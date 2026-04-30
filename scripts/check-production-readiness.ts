import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import postgres from "postgres";

import { officialDataFreshness, isOfficialBaselineStale } from "@/lib/data/freshness";
import { loadRuntimeEnv } from "@/lib/env/load-runtime-env";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const loadedEnvFiles = loadRuntimeEnv(repoRoot);
const strict = process.argv.includes("--strict");
const failures: string[] = [];
const blockers: string[] = [];

function absolutePath(relativePath: string) {
  return path.join(repoRoot, relativePath);
}

function readText(relativePath: string) {
  return readFileSync(absolutePath(relativePath), "utf8");
}

function readJson<T>(relativePath: string) {
  return JSON.parse(readText(relativePath)) as T;
}

function ok(message: string) {
  console.log(`ok ${message}`);
}

function fail(message: string) {
  failures.push(message);
  console.error(`x ${message}`);
}

function blocked(message: string) {
  blockers.push(message);
  console.warn(`blocked ${message}`);
}

function formatError(error: unknown): string {
  if (error instanceof AggregateError) {
    const nestedMessages: string[] = error.errors
      .map((nestedError) => formatError(nestedError))
      .filter(Boolean);

    return nestedMessages.length ? nestedMessages.join("; ") : error.message;
  }

  if (error && typeof error === "object" && "code" in error) {
    const code = String((error as { code?: unknown }).code);
    const message = error instanceof Error ? error.message : String(error);
    return message ? `${code}: ${message}` : code;
  }

  return error instanceof Error ? error.message : String(error);
}

function requireFile(relativePath: string) {
  if (!existsSync(absolutePath(relativePath))) {
    fail(`${relativePath} is missing`);
    return false;
  }

  ok(`${relativePath} exists`);
  return true;
}

const requiredFiles = [
  ".env.example",
  "drizzle.config.ts",
  "lib/db/schema.ts",
  "lib/db/client.ts",
  "lib/env/load-runtime-env.ts",
  "scripts/import-db.ts",
  "scripts/smoke-db.ts",
  "docs/PRODUCTION_RUNBOOK.md",
  "data/raw/sources.json",
  "data/raw/source-snapshots.json",
  "data/raw/ingestion-runs.json",
  "data/raw/official-sales-events.json",
  "data/raw/game-enrichment.json"
];

for (const file of requiredFiles) {
  requireFile(file);
}

if (existsSync(absolutePath(".env.example"))) {
  const envExample = readText(".env.example");
  const requiredEnvVars = [
    "DATABASE_URL",
    "APP_BASE_URL",
    "NEXT_PUBLIC_SITE_URL",
    "ADMIN_REVIEW_ENABLED",
    "ADMIN_REVIEW_PASSWORD"
  ];

  for (const envVar of requiredEnvVars) {
    if (!envExample.includes(envVar)) {
      fail(`.env.example is missing ${envVar}`);
    }
  }

  if (requiredEnvVars.every((envVar) => envExample.includes(envVar))) {
    ok(".env.example documents the required production/runtime variables");
  }
}

if (existsSync(absolutePath("docs/PRODUCTION_RUNBOOK.md"))) {
  const runbook = readText("docs/PRODUCTION_RUNBOOK.md");
  const requiredRunbookTerms = [
    "DATABASE_URL",
    "npm run db:push",
    "npm run db:import",
    "npm run db:smoke",
    "npm run audit:readiness:strict",
    "npm run app:verify",
    "npm run app:visual",
    "npm run docs:screenshots",
    "2026-05-21"
  ];

  for (const term of requiredRunbookTerms) {
    if (!runbook.includes(term)) {
      fail(`production runbook is missing ${term}`);
    }
  }

  if (requiredRunbookTerms.every((term) => runbook.includes(term))) {
    ok("production runbook covers database, deploy, verification, visual, and refresh steps");
  }
}

const databaseUrl = process.env.DATABASE_URL;

async function verifyDatabaseConnection(url: string) {
  const sql = postgres(url, {
    connect_timeout: 5,
    max: 1,
    prepare: false
  });

  try {
    await sql`select 1`;
    ok("DATABASE_URL connection check passed");
  } catch (error) {
    const message = formatError(error);
    blocked(`DATABASE_URL is set but the database connection check failed: ${message}`);
  } finally {
    await sql.end({ timeout: 5 });
  }
}

if (!databaseUrl) {
  blocked("DATABASE_URL is not set, so Supabase migration/import/database smoke cannot run here");
} else if (!/^postgres(ql)?:\/\//.test(databaseUrl)) {
  fail("DATABASE_URL must be a Postgres connection string");
} else if (databaseUrl.includes("[password]") || databaseUrl.includes("[host]")) {
  fail("DATABASE_URL still contains placeholder values");
} else {
  ok("DATABASE_URL is present and looks like a Postgres connection string");
  await verifyDatabaseConnection(databaseUrl);
}

if (loadedEnvFiles.length > 0) {
  ok(`runtime env loaded from ${loadedEnvFiles.join(", ")}`);
} else if (databaseUrl) {
  ok("runtime env is supplied by the shell; no .env.local or .env file was loaded");
} else {
  console.warn("note DATABASE_URL is not available from .env.local, .env, or the shell environment");
}

const expectedTables = [
  "games",
  "platforms",
  "releases",
  "sales_events",
  "derived_sales_facts",
  "sources",
  "game_enrichment",
  "methodologies",
  "ingestion_runs",
  "source_snapshots",
  "field_provenance"
];

if (existsSync(absolutePath("lib/db/schema.ts"))) {
  const schema = readText("lib/db/schema.ts");
  for (const table of expectedTables) {
    if (!schema.includes(`pgTable("${table}"`)) {
      fail(`schema is missing table ${table}`);
    }
  }

  if (expectedTables.every((table) => schema.includes(`pgTable("${table}"`))) {
    ok("Drizzle schema contains every production table");
  }
}

const migrationFiles = existsSync(absolutePath("drizzle"))
  ? readFileList("drizzle").filter((file) => file.endsWith(".sql"))
  : [];

if (migrationFiles.length === 0) {
  fail("drizzle migration SQL is missing");
} else {
  const migrationSql = migrationFiles.map((file) => readText(file)).join("\n");
  for (const table of expectedTables) {
    if (!migrationSql.includes(`CREATE TABLE IF NOT EXISTS ${table}`)) {
      fail(`migration SQL is missing table ${table}`);
    }
  }

  if (expectedTables.every((table) => migrationSql.includes(`CREATE TABLE IF NOT EXISTS ${table}`))) {
    ok("migration SQL creates every production table");
  }
}

function readFileList(relativeDirectory: string) {
  const base = absolutePath(relativeDirectory);
  return readdirSync(base)
    .map((entry) => path.join(relativeDirectory, entry))
    .filter((entry) => statSync(absolutePath(entry)).isFile());
}

if (existsSync(absolutePath("data/raw/source-snapshots.json"))) {
  const snapshots = readJson<Array<{ reviewStatus: string; sourceId: string }>>("data/raw/source-snapshots.json");
  const acceptedStatuses = new Set(["approved", "documented_exception"]);
  const approvedCount = snapshots.filter((snapshot) => snapshot.reviewStatus === "approved").length;
  const documentedExceptions = snapshots.filter((snapshot) => snapshot.reviewStatus === "documented_exception");
  const needsReview = snapshots.filter((snapshot) => !acceptedStatuses.has(snapshot.reviewStatus));

  if (approvedCount === 0) {
    fail("source snapshots have no approved records");
  } else {
    ok(`${approvedCount} source snapshot(s) are approved`);
  }

  if (documentedExceptions.length > 0) {
    ok(
      `${documentedExceptions.length} source snapshot exception(s) are documented: ${documentedExceptions
        .map((snapshot) => snapshot.sourceId)
        .join(", ")}`
    );
  }

  if (needsReview.length > 0) {
    blocked(
      `${needsReview.length} source snapshot(s) still need review: ${needsReview
        .map((snapshot) => snapshot.sourceId)
        .join(", ")}`
    );
  }
}

if (existsSync(absolutePath("data/raw/ingestion-runs.json"))) {
  const runs = readJson<Array<{ id: string; status: string; modelVersion: string }>>("data/raw/ingestion-runs.json");
  const latestRun = runs.at(-1);

  if (!latestRun) {
    fail("ingestion-runs.json is empty");
  } else {
    ok(`latest ingestion run is ${latestRun.id} with status ${latestRun.status}`);
  }
}

if (existsSync(absolutePath("data/raw/game-enrichment.json"))) {
  const enrichment = readJson<Record<string, unknown>>("data/raw/game-enrichment.json");
  const enrichmentCount = Object.keys(enrichment).length;

  if (enrichmentCount < 54) {
    fail(`game enrichment has ${enrichmentCount} records; expected at least 54`);
  } else {
    ok(`game enrichment covers ${enrichmentCount} records`);
  }
}

if (isOfficialBaselineStale()) {
  blocked(
    `official baseline is past the ${officialDataFreshness.nextOfficialReportDate} ${officialDataFreshness.nextOfficialReportLabel} checkpoint`
  );
} else {
  ok(
    `official baseline is current until ${officialDataFreshness.nextOfficialReportDate} (${officialDataFreshness.nextOfficialReportLabel})`
  );
}

if (strict && blockers.length > 0) {
  for (const blocker of blockers) {
    fail(`strict readiness blocker: ${blocker}`);
  }
}

if (failures.length > 0) {
  console.error(`\nProduction readiness check failed with ${failures.length} issue(s).`);
  process.exit(1);
}

if (blockers.length > 0) {
  console.log(`\nProduction readiness has ${blockers.length} external blocker(s). Use --strict to fail on blockers.`);
} else {
  console.log("\nProduction readiness check passed with no blockers.");
}
