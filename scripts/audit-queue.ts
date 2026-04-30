import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

type PackageJson = {
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function readText(relativePath: string) {
  return readFileSync(path.join(repoRoot, relativePath), "utf8");
}

function fail(message: string, failures: string[]) {
  failures.push(message);
  console.error(`x ${message}`);
}

function pass(message: string) {
  console.log(`ok ${message}`);
}

function warn(message: string) {
  console.warn(`warn ${message}`);
}

const failures: string[] = [];
const packageJson = JSON.parse(readText("package.json")) as PackageJson;
const scripts = packageJson.scripts ?? {};
const workflow = readText(".github/workflows/quality-gate.yml");
const gitignore = readText(".gitignore");
const auditQueue = readText("docs/AUDIT_QUEUE.md");
const productionRunbook = readText("docs/PRODUCTION_RUNBOOK.md");
const readme = readText("README.md");
const releaseVerifier = readText("scripts/verify-release.ts");
const strictBlockerVerifier = readText("scripts/verify-strict-readiness-blocker.ts");
const runtimeVerifier = readText("scripts/verify-runtime.ts");

const requiredScripts = [
  "data:ingest",
  "data:validate",
  "data:official-anchors",
  "data:official-extraction",
  "data:enrichment:validate",
  "data:normalize",
  "data:derived",
  "data:fetch",
  "db:import",
  "db:smoke",
  "audit:queue",
  "audit:readiness",
  "audit:readiness:strict",
  "audit:strict-blocker",
  "audit:health",
  "audit:enrichment-dry-run",
  "audit:browser",
  "audit:browser:strict",
  "release:verify",
  "release:verify:strict",
  "app:verify",
  "app:visual",
  "docs:screenshots"
];

for (const scriptName of requiredScripts) {
  if (!scripts[scriptName]) {
    fail(`package.json is missing script "${scriptName}"`, failures);
  }
}

if (failures.length === 0) {
  pass("required package scripts are present");
}

const scriptCommands = Object.entries(scripts);
const tsxScriptUses = scriptCommands.filter(([, command]) => /\btsx\b/.test(command));

if (tsxScriptUses.length > 0) {
  for (const [scriptName, command] of tsxScriptUses) {
    fail(`package script "${scriptName}" still uses tsx: ${command}`, failures);
  }
} else {
  pass("package scripts use the shared Node loader instead of tsx");
}

if (packageJson.devDependencies?.tsx || packageJson.dependencies?.tsx) {
  fail("tsx is still a direct dependency even though scripts no longer use it", failures);
} else {
  pass("tsx is not a direct project dependency");
}

const requiredWorkflowCommands = [
  "npm run data:ingest",
  "npm run data:validate",
  "npm run data:official-anchors",
  "npm run data:official-extraction",
  "npm run data:enrichment:validate",
  "npm run audit:enrichment-dry-run",
  "npm run db:smoke",
  "npm run audit:queue",
  "npm run audit:readiness",
  "npm run audit:strict-blocker",
  "npm run audit:health",
  "npm audit",
  "npm run lint",
  "npm run build",
  "npm run audit:browser:strict",
  "npm run app:verify",
  "npm run app:visual",
  "npm run docs:screenshots"
];

for (const command of requiredWorkflowCommands) {
  if (!workflow.includes(command)) {
    fail(`quality gate does not run "${command}"`, failures);
  }
}

if (requiredWorkflowCommands.every((command) => workflow.includes(command))) {
  pass("quality gate runs the required audit, data, build, runtime, visual, and screenshot checks");
}

const requiredAuditSections = [
  "## Verified Done",
  "## Current Audit Pass",
  "## Next To Start",
  "## Risks / Open Items",
  "## Improvement Loop"
];

for (const section of requiredAuditSections) {
  if (!auditQueue.includes(section)) {
    fail(`docs/AUDIT_QUEUE.md is missing section "${section}"`, failures);
  }
}

if (requiredAuditSections.every((section) => auditQueue.includes(section))) {
  pass("audit queue contains the required tracking sections");
}

const requiredRunbookCommands = [
  "npm run db:push",
  "npm run db:import",
  "npm run db:smoke",
  "npm run data:ingest",
  "npm run data:validate",
  "npm run data:official-anchors",
  "npm run data:official-extraction",
  "npm run data:enrichment:validate",
  "npm run audit:queue",
  "npm run audit:readiness:strict",
  "npm run audit:strict-blocker",
  "npm run audit:health",
  "npm run audit:enrichment-dry-run",
  "npm run audit:browser",
  "npm run audit:browser:strict",
  "npm run release:verify",
  "npm run release:verify:strict",
  "npm run lint",
  "npm run build",
  "npm run app:verify",
  "npm run app:visual",
  "npm run docs:screenshots"
];

for (const command of requiredRunbookCommands) {
  if (!productionRunbook.includes(command)) {
    fail(`production runbook does not include "${command}"`, failures);
  }
}

if (!readme.includes("docs/PRODUCTION_RUNBOOK.md")) {
  fail("README.md does not link to docs/PRODUCTION_RUNBOOK.md", failures);
}

const requiredReadmeProductionTerms = [
  "## Production Readiness",
  "DATABASE_URL",
  "npm run audit:strict-blocker",
  "npm run audit:enrichment-dry-run",
  "npm run release:verify",
  "npm run release:verify:strict",
  "npm run db:push",
  "npm run db:import",
  "npm run db:smoke",
  "npm run audit:readiness:strict"
];

for (const term of requiredReadmeProductionTerms) {
  if (!readme.includes(term)) {
    fail(`README.md production handoff is missing "${term}"`, failures);
  }
}

if (requiredRunbookCommands.every((command) => productionRunbook.includes(command)) && readme.includes("docs/PRODUCTION_RUNBOOK.md")) {
  pass("production runbook covers required deployment and verification commands");
}

if (requiredReadmeProductionTerms.every((term) => readme.includes(term))) {
  pass("README production readiness handoff is guarded");
}

if (!existsSync(path.join(repoRoot, "lib", "env", "load-runtime-env.ts"))) {
  fail("runtime env loader is missing: lib/env/load-runtime-env.ts", failures);
}

if (!gitignore.includes(".env.local")) {
  fail(".gitignore does not ignore .env.local", failures);
}

if (!productionRunbook.includes("scripts load `.env.local` automatically")) {
  fail("production runbook does not explain automatic .env.local loading", failures);
}

if (!productionRunbook.includes("lightweight `DATABASE_URL` connection check")) {
  fail("production runbook does not explain the DATABASE_URL connection check", failures);
}

if (productionRunbook.includes("spawn EPERM") || productionRunbook.includes("current Codex sandbox blocks Chromium")) {
  fail("production runbook still contains stale Chromium blocker wording", failures);
}

if (
  existsSync(path.join(repoRoot, "lib", "env", "load-runtime-env.ts")) &&
  gitignore.includes(".env.local") &&
  productionRunbook.includes("scripts load `.env.local` automatically") &&
  productionRunbook.includes("lightweight `DATABASE_URL` connection check") &&
  !productionRunbook.includes("spawn EPERM") &&
  !productionRunbook.includes("current Codex sandbox blocks Chromium")
) {
  pass("runtime env loading and local secret hygiene are documented and guarded");
}

if (!releaseVerifier.includes("assertPortAvailable")) {
  fail("release verifier does not assert port availability before starting Next.js", failures);
}

if (!releaseVerifier.includes("stopProcessTree")) {
  fail("release verifier does not stop the production server process tree", failures);
}

if (!releaseVerifier.includes("taskkill")) {
  fail("release verifier does not use Windows process-tree cleanup", failures);
}

if (!releaseVerifier.includes('runNpm(["run", "audit:health"])')) {
  fail("release verifier does not run the health contract audit", failures);
}

if (!releaseVerifier.includes('runNpm(["run", "audit:strict-blocker"])')) {
  fail("release verifier does not run the strict readiness blocker audit", failures);
}

if (!releaseVerifier.includes('runNpm(["run", "audit:enrichment-dry-run"])')) {
  fail("release verifier does not run the enrichment dry-run audit", failures);
}

if (strictBlockerVerifier.includes("process.stdout.write(text)") || strictBlockerVerifier.includes("process.stderr.write(text)")) {
  fail("strict blocker verifier still streams nested strict-readiness failure output during expected blocker checks", failures);
}

if (!productionRunbook.includes("RELEASE_VERIFY_PORT")) {
  fail("production runbook does not document the release verifier port override", failures);
}

if (
  releaseVerifier.includes("assertPortAvailable") &&
  releaseVerifier.includes("stopProcessTree") &&
  releaseVerifier.includes("taskkill") &&
  releaseVerifier.includes('runNpm(["run", "audit:health"])') &&
  releaseVerifier.includes('runNpm(["run", "audit:strict-blocker"])') &&
  releaseVerifier.includes('runNpm(["run", "audit:enrichment-dry-run"])') &&
  !strictBlockerVerifier.includes("process.stdout.write(text)") &&
  !strictBlockerVerifier.includes("process.stderr.write(text)") &&
  productionRunbook.includes("RELEASE_VERIFY_PORT")
) {
  pass("release verifier port ownership, cleanup, strict-blocker audit, health audit, and enrichment dry-run audit are guarded");
}

if (auditQueue.includes("npm run data:fetch -- --dry-run")) {
  fail("audit queue still references the old manual enrichment dry-run command", failures);
}

if (!auditQueue.includes("npm run audit:enrichment-dry-run")) {
  fail("audit queue does not reference the guarded enrichment dry-run command", failures);
}

if (!auditQueue.includes("hash-based dry-run guard")) {
  fail("audit queue does not document the hash-based enrichment dry-run guard", failures);
}

if (
  !auditQueue.includes("npm run data:fetch -- --dry-run") &&
  auditQueue.includes("npm run audit:enrichment-dry-run") &&
  auditQueue.includes("hash-based dry-run guard")
) {
  pass("audit tracker enrichment refresh instructions are guarded");
}

if (!runtimeVerifier.includes("database health")) {
  fail("runtime verifier does not validate /api/health database health payloads", failures);
}

if (!runtimeVerifier.includes("local-seed-fallback") || !runtimeVerifier.includes("postgres")) {
  fail("runtime verifier does not validate both local fallback and Postgres health modes", failures);
}

if (!runtimeVerifier.includes("latestOfficialAsOfDate") || !runtimeVerifier.includes("nextOfficialReportDate")) {
  fail("runtime verifier does not validate /api/health official freshness fields", failures);
}

if (
  runtimeVerifier.includes("database health") &&
  runtimeVerifier.includes("local-seed-fallback") &&
  runtimeVerifier.includes("postgres") &&
  runtimeVerifier.includes("latestOfficialAsOfDate") &&
  runtimeVerifier.includes("nextOfficialReportDate")
) {
  pass("runtime health payload verification is guarded");
}

const requiredRuntimePaths = [
  "/compare?games=gta_v,red_dead_redemption_2",
  "/game/grand-theft-auto-v",
  "/game/red-dead-redemption-2",
  "/game/bully",
  "/game/la-noire"
];

for (const runtimePath of requiredRuntimePaths) {
  if (!runtimeVerifier.includes(runtimePath)) {
    fail(`runtime verifier does not check "${runtimePath}"`, failures);
  }
}

if (requiredRuntimePaths.every((runtimePath) => runtimeVerifier.includes(runtimePath))) {
  pass("runtime dynamic game pages and shareable compare links are guarded");
}

const screenshotReferences = Array.from(
  readme.matchAll(/!\[[^\]]*\]\((\.\/docs\/screenshots\/[^)]+)\)/g)
).map((match) => match[1]);
const readmeScreenshotFiles = readdirSync(path.join(repoRoot, "docs", "screenshots"))
  .filter((fileName) => /^readme-.+\.png$/.test(fileName))
  .map((fileName) => `./docs/screenshots/${fileName}`);

if (screenshotReferences.length === 0) {
  fail("README.md does not reference any docs/screenshots images", failures);
} else {
  for (const reference of screenshotReferences) {
    const normalized = reference.replace(/^\.\//, "");
    const absolutePath = path.join(repoRoot, normalized);
    if (!existsSync(absolutePath)) {
      fail(`README screenshot reference is missing on disk: ${reference}`, failures);
    }
  }

  for (const screenshotFile of readmeScreenshotFiles) {
    if (!screenshotReferences.includes(screenshotFile)) {
      fail(`README screenshot file is not referenced in README.md: ${screenshotFile}`, failures);
    }
  }

  if (failures.length === 0) {
    pass("README screenshot references resolve to files on disk and every generated README screenshot is used");
  }
}

if (!process.env.DATABASE_URL) {
  warn("DATABASE_URL is not set; Supabase migration/import checks remain an external blocker");
}

if (failures.length > 0) {
  console.error(`\nAudit queue guard failed with ${failures.length} issue(s).`);
  process.exit(1);
}

console.log("\nAudit queue guard passed.");
