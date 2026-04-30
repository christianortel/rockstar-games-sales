import { checkDatabaseHealth } from "@/lib/db/health";

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

async function verifyLocalFallback() {
  const originalDatabaseUrl = process.env.DATABASE_URL;
  delete process.env.DATABASE_URL;

  try {
    const health = await checkDatabaseHealth();

    assert(health.configured === false, "expected local fallback health to be unconfigured");
    assert(health.connected === null, "expected local fallback health to report connected as null");
    assert(health.mode === "local-seed-fallback", "expected local fallback health mode");

    console.log("ok /api health dependency reports healthy local seed fallback without DATABASE_URL");
  } finally {
    if (originalDatabaseUrl) {
      process.env.DATABASE_URL = originalDatabaseUrl;
    }
  }
}

async function verifyConfiguredFailure() {
  const originalDatabaseUrl = process.env.DATABASE_URL;
  process.env.DATABASE_URL = "postgres://postgres:postgres@127.0.0.1:59999/postgres";

  try {
    const health = await checkDatabaseHealth();

    assert(health.configured === true, "expected configured failure health to be configured");
    assert(health.connected === false, "expected unreachable database health to report connected false");
    assert(health.mode === "postgres", "expected configured failure health mode to be postgres");
    assert("error" in health && health.error.length > 0, "expected unreachable database health to include an error");

    console.log("ok /api health dependency reports configured unreachable Postgres as unhealthy");
  } finally {
    if (originalDatabaseUrl) {
      process.env.DATABASE_URL = originalDatabaseUrl;
    } else {
      delete process.env.DATABASE_URL;
    }
  }
}

async function main() {
  await verifyLocalFallback();
  await verifyConfiguredFailure();
  console.log("\nHealth contract verification passed.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
