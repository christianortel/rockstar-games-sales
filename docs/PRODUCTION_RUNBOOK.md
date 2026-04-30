# Production Runbook

This is the checklist I use before treating Rockstar Sales Universe as interview-demo or deploy-ready.

The app is designed to run without a database during local development, but production readiness is stricter: Supabase must be connected, imported, smoked, and verified before calling the full-stack version complete.

## 1. Create Supabase Postgres

Create a Supabase project and copy the pooled Postgres connection string.

Use the pooled connection string for hosted environments because Vercel functions can scale horizontally.

Required variable:

```bash
DATABASE_URL="postgres://..."
```

Do not commit `.env.local`.

## 2. Configure Local Environment

Create `.env.local` from `.env.example` and fill in the real database URL.

```bash
cp .env.example .env.local
```

The Node and Drizzle scripts load `.env.local` automatically. Shell-exporting `DATABASE_URL` still works and takes precedence, but it is not required for local script runs once `.env.local` exists.

Required local values:

```bash
DATABASE_URL="postgres://..."
APP_BASE_URL="http://localhost:3000"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
ADMIN_REVIEW_ENABLED="true"
ADMIN_REVIEW_PASSWORD="change-me"
```

## 3. Apply Database Schema

Run the Drizzle migration against the Supabase database.

```bash
npm run db:push
```

This should create the production tables:

- `games`
- `platforms`
- `releases`
- `sales_events`
- `derived_sales_facts`
- `sources`
- `game_enrichment`
- `methodologies`
- `ingestion_runs`
- `source_snapshots`
- `field_provenance`

## 4. Import Current Dataset

Import the normalized local data into Supabase.

```bash
npm run db:import
```

Then smoke-test the database-backed adapter.

```bash
npm run db:smoke
```

## 5. Run Data And Trust Checks

Run the source, model, and audit checks before demoing the app.

```bash
npm run data:ingest
npm run data:validate
npm run data:official-anchors
npm run data:official-extraction
npm run data:enrichment:validate
npm run audit:queue
npm run audit:strict-blocker
npm run audit:health
npm run audit:enrichment-dry-run
npm run audit:readiness:strict
```

`npm run audit:readiness:strict` should pass only after `DATABASE_URL` is configured and the database smoke path is working.

Before Supabase is connected, `npm run audit:strict-blocker` should pass only if the missing `DATABASE_URL` is the sole strict-readiness blocker. After Supabase is connected, the same command should pass because strict readiness has no blockers.

Readiness also performs a lightweight `DATABASE_URL` connection check. A syntactically valid Postgres URL is not enough; the database must be reachable.

For the full standard local verification path, run:

```bash
npm run release:verify
```

The release verifier starts its own production server. If port `3020` is already in use, stop that process or set `RELEASE_VERIFY_PORT` to a free port before running it.

For final production signoff after Supabase is connected, run:

```bash
npm run release:verify:strict
```

## 6. Build And Runtime Verify

```bash
npm run lint
npm run build
```

Start production mode and verify runtime routes.

```bash
npm run start -- -p 3002
```

In a second terminal:

```bash
APP_BASE_URL="http://127.0.0.1:3002" npm run app:verify
```

## 7. Browser Visual Checks

Run these in a local shell or CI environment that allows Chromium to launch.

First check whether the current environment can launch Chromium:

```bash
npm run audit:browser
```

For final signoff, use strict mode:

```bash
npm run audit:browser:strict
```

```bash
npm run app:visual
npm run docs:screenshots
```

If `npm run audit:browser:strict` fails, use CI or another local shell that can launch Chromium before final screenshot refresh.

## 8. Vercel Setup

Set these environment variables in Vercel:

```bash
DATABASE_URL="postgres://..."
NEXT_PUBLIC_SITE_URL="https://your-production-domain"
ADMIN_REVIEW_ENABLED="true"
ADMIN_REVIEW_PASSWORD="strong-password"
```

After deployment, verify:

```bash
curl https://your-production-domain/api/health
```

The health payload should show `database.connected: true` when `DATABASE_URL` is configured. A missing `DATABASE_URL` is acceptable only for local seed-mode development; a configured but unreachable database returns an unhealthy response.

Then run route verification against the deployed app:

```bash
APP_BASE_URL="https://your-production-domain" npm run app:verify
```

## 9. Refresh Checkpoint

The current official baseline is:

```text
Take-Two Q3 FY2026 / February 2026 investor materials, as of 2026-02-03.
```

The next official refresh checkpoint is:

```text
Take-Two Q4 and fiscal year 2026 results on 2026-05-21.
```

After that date, refresh the official anchors before presenting the app as current.

Before writing any refreshed enrichment metadata, prove the live lookup path is non-mutating:

```bash
npm run audit:enrichment-dry-run
```

Only run `npm run data:fetch` after the dry-run passes and the resulting diff can be reviewed.

Minimum refresh path:

```bash
npm run data:ingest
npm run data:official-anchors
npm run data:official-extraction
npm run data:validate
npm run db:import
npm run db:smoke
npm run audit:readiness:strict
```

## Done Criteria

The project is production/demo-ready only when:

- `DATABASE_URL` is configured locally and in Vercel.
- `npm run db:push` has applied the schema.
- `npm run db:import` has loaded the current dataset.
- `npm run db:smoke` passes against Supabase.
- `npm run audit:readiness:strict` passes.
- `npm run build` passes.
- `npm run app:verify` passes against production mode or the deployed URL.
- `npm run audit:browser:strict` passes in CI or a browser-capable local environment.
- `npm run app:visual` passes in CI or a browser-capable local environment.
- README screenshots have been regenerated after final visual changes.
