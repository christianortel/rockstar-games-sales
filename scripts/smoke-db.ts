import { sql } from "drizzle-orm";
import { AnyPgTable } from "drizzle-orm/pg-core";

import { games as seedGames, officialSalesEvents, sources } from "@/data/normalized/seed";
import { getDb, hasDatabaseUrl } from "@/lib/db/client";
import { derivedSalesFacts } from "@/lib/data/repository";
import { loadRuntimeEnv } from "@/lib/env/load-runtime-env";
import * as schema from "@/lib/db/schema";

loadRuntimeEnv();

type TableCheck = {
  label: string;
  expectedMin: number;
  readCount: () => Promise<number>;
};

async function readTableCount(table: AnyPgTable) {
  const db = getDb();
  const [result] = await db.select({ count: sql<number>`count(*)::int` }).from(table);
  return result?.count ?? 0;
}

function formatError(error: unknown): string {
  if (error instanceof AggregateError) {
    const nestedMessages: string[] = error.errors
      .map((nestedError) => formatError(nestedError))
      .filter(Boolean);

    return nestedMessages.length ? nestedMessages.join("; ") : error.message;
  }

  if (error && typeof error === "object" && "cause" in error && (error as { cause?: unknown }).cause) {
    return formatError((error as { cause: unknown }).cause);
  }

  if (error && typeof error === "object" && "code" in error) {
    const code = String((error as { code?: unknown }).code);
    const message = error instanceof Error ? error.message : String(error);
    return message ? `${code}: ${message}` : code;
  }

  return error instanceof Error ? error.message : String(error);
}

async function main() {
  if (!hasDatabaseUrl()) {
    console.log("DATABASE_URL is not set. Skipping Supabase smoke test; local seed data remains active.");
    return;
  }

  const checks: TableCheck[] = [
    {
      label: "games",
      expectedMin: seedGames.length,
      readCount: () => readTableCount(schema.games)
    },
    {
      label: "sources",
      expectedMin: sources.length,
      readCount: () => readTableCount(schema.sources)
    },
    {
      label: "sales_events",
      expectedMin: officialSalesEvents.length,
      readCount: () => readTableCount(schema.salesEvents)
    },
    {
      label: "derived_sales_facts",
      expectedMin: derivedSalesFacts.length,
      readCount: () => readTableCount(schema.derivedSalesFacts)
    }
  ];

  const errors: string[] = [];

  for (const check of checks) {
    const count = await check.readCount();
    if (count < check.expectedMin) {
      errors.push(`${check.label} has ${count} rows; expected at least ${check.expectedMin}.`);
    } else {
      console.log(`ok ${check.label}: ${count} rows`);
    }
  }

  if (errors.length) {
    console.error(errors.map((error) => `error: ${error}`).join("\n"));
    process.exitCode = 1;
  } else {
    console.log("Supabase smoke test passed.");
  }
}

main().catch((error) => {
  console.error(`error: Supabase smoke test failed: ${formatError(error)}`);
  process.exitCode = 1;
});
