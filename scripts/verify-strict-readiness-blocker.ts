import { spawn } from "node:child_process";

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";

type CommandResult = {
  code: number | null;
  output: string;
};

function runStrictReadiness() {
  return new Promise<CommandResult>((resolve, reject) => {
    const child = spawn(npmCommand, ["run", "audit:readiness:strict"], {
      shell: process.platform === "win32",
      stdio: ["ignore", "pipe", "pipe"]
    });

    let output = "";

    child.stdout.on("data", (chunk: Buffer) => {
      output += chunk.toString();
    });

    child.stderr.on("data", (chunk: Buffer) => {
      output += chunk.toString();
    });

    child.on("error", reject);
    child.on("exit", (code) => resolve({ code, output }));
  });
}

async function main() {
  const result = await runStrictReadiness();

  if (result.code === 0) {
    console.log("ok strict readiness passed with no external blockers");
    return;
  }

  const blockerMatches = Array.from(result.output.matchAll(/strict readiness blocker: (.+)/g)).map((match) => match[1]);
  const expectedMissingDatabaseBlocker = "DATABASE_URL is not set, so Supabase migration/import/database smoke cannot run here";

  if (blockerMatches.length === 1 && blockerMatches[0] === expectedMissingDatabaseBlocker) {
    console.log("ok strict readiness is blocked only by the missing Supabase DATABASE_URL");
    return;
  }

  console.error(result.output.trim());
  throw new Error(
    blockerMatches.length > 0
      ? `strict readiness has unexpected blocker(s): ${blockerMatches.join("; ")}`
      : "strict readiness failed without a recognizable blocker"
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
