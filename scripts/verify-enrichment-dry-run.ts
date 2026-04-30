import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const enrichmentPath = path.join(process.cwd(), "data", "raw", "game-enrichment.json");

function hashFile(filePath: string) {
  return createHash("sha256").update(readFileSync(filePath)).digest("hex");
}

function runDryRun() {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(npmCommand, ["run", "data:fetch", "--", "--dry-run"], {
      shell: process.platform === "win32",
      stdio: "inherit"
    });

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`metadata dry-run exited with code ${code}`));
      }
    });
  });
}

async function main() {
  const before = hashFile(enrichmentPath);

  await runDryRun();

  const after = hashFile(enrichmentPath);

  if (before !== after) {
    throw new Error("metadata dry-run changed data/raw/game-enrichment.json");
  }

  console.log(`ok metadata dry-run left ${enrichmentPath} unchanged`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
