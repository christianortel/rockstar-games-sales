import postgres from "postgres";

export type DatabaseHealth =
  | {
      configured: false;
      connected: null;
      mode: "local-seed-fallback";
    }
  | {
      configured: true;
      connected: true;
      mode: "postgres";
    }
  | {
      configured: true;
      connected: false;
      mode: "postgres";
      error: string;
    };

function formatDatabaseError(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

export async function checkDatabaseHealth(): Promise<DatabaseHealth> {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    return {
      configured: false,
      connected: null,
      mode: "local-seed-fallback"
    };
  }

  const sql = postgres(databaseUrl, {
    connect_timeout: 5,
    idle_timeout: 1,
    max: 1,
    prepare: false
  });

  try {
    await sql`select 1 as ok`;

    return {
      configured: true,
      connected: true,
      mode: "postgres"
    };
  } catch (error) {
    return {
      configured: true,
      connected: false,
      mode: "postgres",
      error: formatDatabaseError(error)
    };
  } finally {
    await sql.end({ timeout: 1 });
  }
}
