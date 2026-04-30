import { spawn, ChildProcess } from "node:child_process";
import http from "node:http";
import net from "node:net";

const strict = process.argv.includes("--strict");
const port = process.env.RELEASE_VERIFY_PORT ?? "3020";
const baseUrl = `http://127.0.0.1:${port}`;
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const nextCommand = process.platform === "win32" ? "node_modules\\.bin\\next.cmd" : "node_modules/.bin/next";

type RunOptions = {
  env?: Partial<NodeJS.ProcessEnv>;
};

function run(command: string, args: string[], options: RunOptions = {}) {
  return new Promise<void>((resolve, reject) => {
    console.log(`\n> ${[command, ...args].join(" ")}`);

    const child = spawn(command, args, {
      env: {
        ...process.env,
        ...options.env
      },
      shell: process.platform === "win32",
      stdio: "inherit"
    });

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${command} ${args.join(" ")} exited with code ${code}`));
      }
    });
  });
}

function runNpm(args: string[], options?: RunOptions) {
  return run(npmCommand, args, options);
}

function waitForHealth(url: string, child: ChildProcess, timeoutMs = 60_000) {
  const startedAt = Date.now();
  let serverExitCode: number | null | undefined;

  child.once("exit", (code) => {
    serverExitCode = code;
  });

  return new Promise<void>((resolve, reject) => {
    const attempt = () => {
      const request = http.get(url, (response) => {
        response.resume();

        if (response.statusCode && response.statusCode >= 200 && response.statusCode < 500) {
          resolve();
          return;
        }

        retry();
      });

      request.on("error", retry);
      request.setTimeout(2_000, () => {
        request.destroy();
        retry();
      });
    };

    const retry = () => {
      if (serverExitCode !== undefined) {
        reject(new Error(`Production server exited before health check passed with code ${serverExitCode ?? "unknown"}`));
        return;
      }

      if (Date.now() - startedAt > timeoutMs) {
        reject(new Error(`Timed out waiting for ${url}`));
        return;
      }

      setTimeout(attempt, 1_000);
    };

    attempt();
  });
}

function assertPortAvailable(portNumber: string) {
  return new Promise<void>((resolve, reject) => {
    const server = net.createServer();

    server.once("error", (error: NodeJS.ErrnoException) => {
      if (error.code === "EADDRINUSE") {
        reject(new Error(`Release verification port ${portNumber} is already in use. Stop the existing process or set RELEASE_VERIFY_PORT.`));
      } else {
        reject(error);
      }
    });

    server.listen(Number(portNumber), () => {
      server.close(() => resolve());
    });
  });
}

function stopProcessTree(child: ChildProcess) {
  return new Promise<void>((resolve) => {
    if (!child.pid || child.killed) {
      resolve();
      return;
    }

    if (process.platform === "win32") {
      const killer = spawn("taskkill", ["/pid", String(child.pid), "/T", "/F"], {
        shell: true,
        stdio: "ignore"
      });

      killer.on("exit", () => resolve());
      killer.on("error", () => resolve());
      return;
    }

    child.kill("SIGTERM");
    resolve();
  });
}

async function withProductionServer(runChecks: () => Promise<void>) {
  await assertPortAvailable(port);

  console.log(`\n> ${nextCommand} start -p ${port}`);

  const server: ChildProcess = spawn(nextCommand, ["start", "-p", port], {
    env: process.env,
    shell: process.platform === "win32",
    stdio: "inherit"
  });

  try {
    await waitForHealth(`${baseUrl}/api/health`, server);
    await runChecks();
  } finally {
    await stopProcessTree(server);
  }
}

async function main() {
  const readinessScript = strict ? "audit:readiness:strict" : "audit:readiness";

  await runNpm(["run", "audit:queue"]);
  await runNpm(["run", readinessScript]);
  await runNpm(["run", "audit:strict-blocker"]);
  await runNpm(["run", "audit:health"]);
  await runNpm(["run", "data:validate"]);
  await runNpm(["run", "data:official-anchors"]);
  await runNpm(["run", "data:official-extraction"]);
  await runNpm(["run", "data:enrichment:validate"]);
  await runNpm(["run", "audit:enrichment-dry-run"]);
  await runNpm(["run", "db:smoke"]);
  await runNpm(["audit"]);
  await runNpm(["run", "audit:browser:strict"]);
  await runNpm(["run", "lint"]);
  await runNpm(["run", "build"]);

  await withProductionServer(async () => {
    const env = { APP_BASE_URL: baseUrl };
    await runNpm(["run", "app:verify"], { env });
    await runNpm(["run", "app:visual"], { env });
    await runNpm(["run", "docs:screenshots"], { env });
  });

  console.log(`\nRelease verification passed in ${strict ? "strict" : "standard"} mode.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
