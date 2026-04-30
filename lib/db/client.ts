import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "@/lib/db/schema";

let client: ReturnType<typeof postgres> | undefined;

export function hasDatabaseUrl() {
  return Boolean(process.env.DATABASE_URL);
}

export function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured. The app is using local seed data until Supabase/Postgres is connected.");
  }

  client ??= postgres(process.env.DATABASE_URL, { max: 5, prepare: false });
  return drizzle(client, { schema });
}
