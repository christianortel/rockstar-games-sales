import { defineConfig } from "drizzle-kit";

import { loadRuntimeEnv } from "./lib/env/load-runtime-env";

loadRuntimeEnv();

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "postgres://postgres:postgres@localhost:5432/rockstar_sales_universe"
  },
  strict: true
});
