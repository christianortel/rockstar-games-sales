# Production Audit Queue

Last updated: 2026-04-29

This file is the persistent tracker for getting Rockstar Sales Universe to a production-grade, interview-ready full-stack demo. Keep it updated after every audit pass.

## Verified Done

- Added Drizzle/Postgres/Supabase-ready schema and migration SQL.
- Added local seed fallback so the app runs without `DATABASE_URL`.
- Added `data:ingest`, `data:validate`, and `db:import` scripts.
- Added source snapshots and ingestion run records under `data/raw`.
- Added model versioning with `blend-model-v1.2.0`.
- Added uncertainty ranges to derived sales facts.
- Added field-level provenance, confidence reasons, and model audit interfaces.
- Added dashboard tabs: `Overview`, `Franchises`, `Titles`, `Platforms`, `Sources`, and `Model Audit`.
- Added dashboard freshness cards for official data, enrichment run, model run, and next Take-Two reporting checkpoint.
- Added sortable ranking table state in the URL and CSV export with provenance.
- Added `/api/health`.
- Added database connectivity verification to `/api/health`; local seed mode remains healthy when `DATABASE_URL` is absent, but a configured unreachable database returns an unhealthy response.
- Added `/admin/source-review`.
- Added route-level loading and error states for dashboard, compare, data lab, and game detail.
- Verified `npm run data:ingest`, `npm run data:validate`, `npm run db:import`, `npm run lint`, and `npm run build`.
- Added repo-persistent audit tracking in this file.
- Added `npm run app:verify` runtime route verification.
- Strengthened `npm run app:verify` so `/api/health` must expose database health mode, connectivity state, model version, and official data freshness fields.
- Added source snapshot status to `/admin/source-review`.
- Updated ingestion so internal manual-model sources are hashed and approved intentionally.
- Verified production runtime routes on `http://localhost:3002`.
- Added GitHub Actions quality gate for install, ingest, validate, type check, build, production start, and runtime route verification.
- Added `.env.example` for Supabase/Vercel setup and read-only source review controls.
- Added `npm run data:official-anchors` to lock the four official Take-Two February 2026 sales anchors.
- Added Playwright visual smoke checks for dashboard overview, sources, model audit, and source review on desktop and mobile.
- Added active dashboard tab `aria-pressed` state and a visible `Known weaknesses` label in the model audit panel.
- Patched the dependency stack to Next.js `15.5.15`, React `19.2.5`, and zero known `npm audit` vulnerabilities.
- Added dynamic OpenGraph image routes for the homepage, dashboard, compare mode, and major game pages.
- Added runtime verification for OpenGraph PNG responses, including `Grand Theft Auto V` and `Red Dead Redemption 2`.
- Added a README interview demo path that explains the strongest walkthrough order.
- Added a Take-Two official anchor extraction parser and fixture validation script.
- Added GitHub Actions failure artifact upload for Playwright traces, screenshots, and server logs.
- Expanded OpenGraph coverage to methodology, data lab, Bully, and L.A. Noire verification targets.
- Added `npm run docs:screenshots` to regenerate README screenshot assets through Playwright.
- Added CI screenshot capture and upload for `docs/screenshots/readme-*.png`.
- Replaced `tsx` script execution with a local Node loader so data/runtime scripts do not depend on an esbuild child process.
- Added `npm run db:smoke`, which skips cleanly without `DATABASE_URL` and verifies key Supabase table counts when credentials are present.
- Converted the remaining local data helper scripts (`data:normalize`, `data:derived`, and `data:fetch`) to the shared Node loader path.
- Added `npm run data:enrichment:validate` to enforce complete enrichment coverage for every catalog title.
- Added `--dry-run` support to `npm run data:fetch` so live metadata refreshes can be reviewed before writing `data/raw/game-enrichment.json`.
- Hardened `data:fetch` so it merges live results into existing reviewed enrichment instead of replacing the file with a partial network result.
- Removed the stale direct `tsx` dev dependency after moving script execution to the local Node loader.
- Added `npm run audit:queue` to verify required package scripts, CI commands, README screenshot references, and audit tracker sections.
- Added `npm run audit:readiness` and `npm run audit:readiness:strict` to report production blockers before demo/deploy work.
- Added `npm run audit:strict-blocker` to prove strict readiness has either no blockers or only the expected missing `DATABASE_URL` blocker before Supabase is connected.
- Added `npm run audit:health` to lock the `/api/health` dependency contract for local fallback and configured-but-unreachable Postgres.
- Added `npm run audit:enrichment-dry-run` to prove live metadata refresh dry-runs do not mutate `data/raw/game-enrichment.json`.
- Added `documented_exception` source review status so known metadata-only fetch limitations are tracked explicitly instead of remaining unresolved.
- Converted the MobyGames HTTP 403 source snapshot from `needs_review` to a documented Tier 2 metadata-only exception.
- Added `docs/PRODUCTION_RUNBOOK.md` with the Supabase, Vercel, migration, import, smoke, readiness, runtime, visual, screenshot, and refresh checklist.
- Extended `npm run audit:queue` and `npm run audit:readiness` so the production runbook is checked as part of the local audit surface.
- Added `npm run audit:browser` and `npm run audit:browser:strict` to preflight whether Chromium can launch before running visual checks or README screenshots.
- Verified Chromium launch locally with `npm run audit:browser:strict`.
- Ran the full Playwright visual smoke suite locally with `npm run app:visual`.
- Regenerated README screenshots locally with `npm run docs:screenshots`.
- Expanded the README to include homepage, dashboard sources/provenance, compare mode, and data lab screenshots.
- Added a README production-readiness section that calls out the Supabase-ready state, current `DATABASE_URL` blocker, and final strict signoff commands.
- Tightened `npm run audit:queue` so every generated `docs/screenshots/readme-*.png` file must be referenced from the README.
- Isolated and retested the Next.js 16.2.4 upgrade in `C:\tmp\rockstar-next16-audit` before changing the main worktree.
- Upgraded the main app to Next.js `16.2.4` and updated `tsconfig.json` to `jsx: react-jsx`, matching the Next 16 requirement.
- Verified the previous `/api/health` Next 16 build/runtime issue no longer reproduces.
- Added `lib/env/load-runtime-env.ts` so standalone Node scripts and Drizzle config can load `.env.local` / `.env` without requiring shell-exported environment variables.
- Added `.env`, `.env.local`, and `.env.*.local` to `.gitignore` so local database credentials are not committed.
- Updated `npm run audit:readiness` to verify `DATABASE_URL` connectivity when a database URL is present, not just string shape.
- Improved `npm run db:smoke` database failure output so unreachable Postgres URLs produce concise connection errors.
- Removed stale runbook wording that said Chromium was blocked in the current Codex environment.
- Tightened readiness output so missing `.env.local` is a note, not a second blocker, when the real issue is missing `DATABASE_URL`.
- Added an audit guard that fails if stale Chromium `spawn EPERM` blocker wording returns to the production runbook.
- Added `npm run release:verify` to run the standard non-Supabase release gate end-to-end from one command.
- Added `npm run release:verify:strict` for final post-Supabase signoff, where strict readiness must pass before the rest of the release checks continue.
- Hardened `npm run release:verify` so it refuses to run against an occupied port, detects early production-server exit, and kills the Windows process tree after verification.
- Extended `npm run audit:queue` to guard the release verifier's port availability check, Windows process-tree cleanup, health audit step, and documented `RELEASE_VERIFY_PORT` override.
- Extended `npm run audit:queue` to guard the release verifier's strict-blocker step and prevent the old manual enrichment dry-run command from returning to the audit tracker.
- Extended `npm run audit:queue` to guard the README production-readiness handoff so public docs keep listing the strict audit, database, and release gates.
- Added `npm run audit:enrichment-dry-run` to the standard release verifier and GitHub Actions quality gate.
- Extended `npm run audit:queue` to guard `/api/health` runtime payload verification for database health and official freshness fields.
- Added `npm run audit:browser:strict` to the GitHub Actions quality gate after Chromium installation and before visual checks.
- Quieted `npm run audit:strict-blocker` so expected missing-database state does not print nested `x strict readiness blocker` failure text during successful release verification.
- Strengthened `npm run app:verify` so production runtime checks include dynamic game detail pages and a shareable compare URL, not only static shells and OpenGraph image routes.
- Extended `npm run audit:queue` to guard the dynamic game-page and shareable compare runtime checks.

## Current Audit Pass

- Status: complete.
- Commands passed: `npm run audit:strict-blocker`, `npm run audit:health`, `npm run audit:enrichment-dry-run`, `npm run audit:browser:strict`, `npm run audit:queue`, `npm run lint`, `npm run audit:readiness`, `npm run build`, production `npm run app:verify` on ports `3029` and `3030`, `npm run release:verify`, `RELEASE_VERIFY_PORT=3023 npm run release:verify`, `RELEASE_VERIFY_PORT=3024 npm run release:verify`, `RELEASE_VERIFY_PORT=3025 npm run release:verify`, `RELEASE_VERIFY_PORT=3026 npm run release:verify`, `RELEASE_VERIFY_PORT=3027 npm run release:verify`, `RELEASE_VERIFY_PORT=3028 npm run release:verify`, and `RELEASE_VERIFY_PORT=3031 npm run release:verify`.
- Expected strict release result verified: `npm run release:verify:strict` stops at `npm run audit:readiness:strict` because `DATABASE_URL` is missing, then passes through the wrapper check because that failure is intentional until Supabase credentials exist.
- Temporary `.env.local` verification passed: scripts loaded a placeholder Postgres URL from `.env.local`, `npm run audit:readiness:strict` failed with a clear `ECONNREFUSED` blocker, and `npm run db:smoke` failed with a concise connection error. The temporary `.env.local` file was removed after the test.
- Isolated Next 16 audit commands passed in `C:\tmp\rockstar-next16-audit`: `npm ci`, `npm install next@16.2.4 --save-exact`, `npm run audit:queue`, `npm run lint`, `npm audit`, `npm run build`, `npm run app:verify`, `npm run audit:browser:strict`, and `npm run app:visual`.
- Expected strict-mode result verified: `npm run audit:readiness:strict` now fails with exactly one blocker because `DATABASE_URL` is not set, then passes through the wrapper check because that failure is intentional until Supabase credentials exist.
- Strict blocker guard result: `npm run audit:strict-blocker` runs strict readiness and confirms the only current strict blocker is the missing Supabase `DATABASE_URL`; once Supabase is connected, the same guard will require strict readiness to pass cleanly.
- Strict blocker output result: expected missing-`DATABASE_URL` state now prints a clean `ok strict readiness is blocked only by the missing Supabase DATABASE_URL` summary instead of streaming the nested strict-readiness failure output.
- Browser strict-mode result verified: `npm run audit:browser:strict` now passes in this environment.
- Runtime verified: `/`, `/dashboard`, `/dashboard?tab=titles&sort=confidence&dir=asc`, `/dashboard?tab=sources`, `/dashboard?tab=model-audit`, `/compare`, `/data-lab`, `/methodology`, `/admin/source-review`, `/api/health`, `/opengraph-image`, `/dashboard/opengraph-image`, `/compare/opengraph-image`, `/data-lab/opengraph-image`, `/methodology/opengraph-image`, `/game/grand-theft-auto-v/opengraph-image`, `/game/red-dead-redemption-2/opengraph-image`, `/game/bully/opengraph-image`, and `/game/la-noire/opengraph-image`.
- Runtime dynamic route targets added: `/compare?games=gta_v,red_dead_redemption_2`, `/game/grand-theft-auto-v`, `/game/red-dead-redemption-2`, `/game/bully`, and `/game/la-noire`.
- Runtime dynamic route verification result: production `npm run app:verify` passed on `http://127.0.0.1:3030`, and `RELEASE_VERIFY_PORT=3031 npm run release:verify` passed with the expanded dynamic route coverage inside the release sequence.
- Runtime health payload result: `npm run app:verify` now checks `/api/health` for valid local fallback vs Postgres database health shape plus official freshness dates, not only `ok` and model version.
- Runtime health payload verification result: production `npm run app:verify` passed on `http://127.0.0.1:3029` with the stricter `/api/health` database and freshness assertions.
- Visual verified: dashboard overview, dashboard sources, dashboard model audit, and source review on desktop and mobile passed through Playwright.
- Framework result: Next.js `16.2.4` builds with Turbopack, serves `/api/health`, serves OG image routes, and passes the existing runtime and visual smoke suite.
- CI now runs data ingestion, data validation, official anchor validation, official extraction validation, enrichment validation, database smoke testing, audit queue guard, production readiness reporting, dependency audit, type check, build, production route verification, Playwright dashboard/source-review visual checks, README screenshot capture, screenshot artifact upload, and failure artifact upload.
- Supabase readiness is complete locally, but real database migration/import is blocked until a valid `DATABASE_URL` exists.
- Dependency audit result: clean with zero known vulnerabilities after patch updates and targeted overrides.
- README screenshot result: `readme-homepage-hero.png`, `readme-dashboard-sources.png`, `readme-compare.png`, and `readme-data-lab.png` were regenerated and are all referenced from `README.md`.
- README production handoff result: `README.md` now lists `audit:queue`, `audit:strict-blocker`, `audit:health`, `audit:enrichment-dry-run`, `release:verify`, `release:verify:strict`, the Supabase `DATABASE_URL` blocker, and the final database signoff sequence.
- Browser readiness result: visual checks are now locally unblocked and still gated by `npm run audit:browser` / `npm run audit:browser:strict`.
- CI browser readiness result: the GitHub Actions quality gate now runs `npm run audit:browser:strict` after installing Chromium, so browser launch failures are reported before Playwright visual tests.
- Production readiness report result: all local schema, migration, snapshot, environment-example, ingestion, enrichment, source-review, and official-refresh checks pass; the only remaining readiness blocker is missing `DATABASE_URL`. Missing `.env.local` is reported as a note, not a separate blocker.
- Database handoff result: local scripts now auto-load `.env.local` while the Next app runtime avoids importing filesystem-based env loading, keeping Turbopack tracing clean.
- Production runbook result: deployment handoff is now documented and guarded. The runbook covers `DATABASE_URL`, `db:push`, `db:import`, `db:smoke`, strict readiness, runtime verification, visual checks, README screenshots, Vercel envs, and the 2026-05-21 official refresh checkpoint.
- Release verifier result: `npm run release:verify` completed the standard local gate, including data validation, official anchor checks, enrichment validation, database smoke fallback, dependency audit, browser preflight, type check, Next build, production route verification, Playwright visual checks, and README screenshot capture.
- Release verifier cleanup result: a stale `node` listener on port `3020` exposed a false-positive risk. The verifier now checks port availability before `next start`, waits on the server it launched, and frees port `3020` after completion.
- Release verifier guard result: `npm run audit:queue` now fails if the stale-port protections, process-tree cleanup, `audit:health` step, or `RELEASE_VERIFY_PORT` runbook note are removed.
- Release verifier strict-blocker guard result: `npm run audit:queue` now fails if `npm run release:verify` stops running `npm run audit:strict-blocker`.
- Release verifier override result: `RELEASE_VERIFY_PORT=3023 npm run release:verify` passed, and port `3023` was free after completion, proving the override and cleanup path work.
- Release verifier strict-blocker result: `RELEASE_VERIFY_PORT=3024 npm run release:verify` passed with `npm run audit:strict-blocker` inside the sequence, and port `3024` was free after completion.
- Release verifier clean-log result: `RELEASE_VERIFY_PORT=3025 npm run release:verify` passed after quieting expected strict-blocker output, and port `3025` was free after completion.
- README production handoff release result: `RELEASE_VERIFY_PORT=3026 npm run release:verify` passed after adding the README production-readiness section and guard, and port `3026` was free after completion.
- Health endpoint result: `/api/health` now performs a live Postgres `select 1` check when `DATABASE_URL` exists, while still reporting `local-seed-fallback` as healthy for local development without Supabase.
- Health endpoint negative-path result: starting production mode with `DATABASE_URL=postgres://postgres:postgres@127.0.0.1:59999/postgres` makes `/api/health` return HTTP `503` with `database.connected: false` and a concise `ECONNREFUSED` error.
- Health contract guard result: `npm run audit:health` now verifies the same dependency behavior without needing a production server: no `DATABASE_URL` reports healthy `local-seed-fallback`, while an unreachable configured Postgres URL reports `connected: false`.
- Enrichment dry-run result: `npm run audit:enrichment-dry-run` resolved 54 enrichment records through the live metadata path and confirmed `data/raw/game-enrichment.json` was unchanged by hash comparison.
- Enrichment instruction guard result: `npm run audit:queue` now fails if the tracker points contributors back to the old manual `data:fetch -- --dry-run` command instead of the hash-verified `npm run audit:enrichment-dry-run` command.
- Enrichment release-gate result: `npm run release:verify` and the GitHub Actions quality gate now run `npm run audit:enrichment-dry-run`, so metadata refresh safety is part of the standard signoff path.
- Enrichment release verification result: `RELEASE_VERIFY_PORT=3027 npm run release:verify` passed with `npm run audit:enrichment-dry-run` inside the sequence, and port `3027` was free after completion.
- CI browser-preflight release result: `RELEASE_VERIFY_PORT=3028 npm run release:verify` passed after adding `npm run audit:browser:strict` to GitHub Actions, and port `3028` was free after completion.
- Source review result: `mobygames-catalog` is documented as a Tier 2 metadata-only exception because direct unauthenticated snapshot fetch returns HTTP 403; it is not used as official sales authority.
- Process improvement from this pass: remaining blocker work now has a single runbook with done criteria. Future passes should update the runbook whenever deployment, database, or verification commands change.
- Process improvement from this pass: generated README screenshots are now audited both ways: README references must exist on disk, and every generated `readme-*.png` must be used in the README.
- Process improvement from this pass: public project docs should expose the same gate language as the private audit queue. The README production handoff is now checked by `npm run audit:queue`.
- Process improvement from this pass: visual-check failures now have a fast preflight, so future passes should run `npm run audit:browser:strict` before spending time on Playwright screenshots.
- Process improvement from this pass: CI should mirror local release verification for browser prerequisites. Browser launch readiness is now a named CI step before visual checks.
- Process improvement from this pass: framework upgrades should be tested first in an isolated copy/worktree, then applied to the main tree only after build, runtime, and visual checks pass.
- Process improvement from this pass: script env loading and app env loading are different paths. Keep `.env.local` loading inside CLI/Drizzle entrypoints, not shared app runtime modules, to avoid Turbopack tracing filesystem helpers into app routes.
- Process improvement from this pass: stale blocker text should be guarded. The audit queue now checks that the production runbook does not reintroduce the old Chromium `spawn EPERM` statement after browser verification started passing locally.
- Process improvement from this pass: repeated manual command sequences should become one executable gate. Standard verification is now one command; strict production verification is also one command after Supabase is connected.
- Process improvement from this pass: a passing release gate is not trustworthy if it can validate a stale server. Future runtime verification scripts should assert port ownership or port availability before starting local production checks.
- Process improvement from this pass: critical release-script behavior must be protected by the audit guard itself, not only by a passing release run. The guard now checks for the exact release-verifier safety hooks.
- Process improvement from this pass: production health checks should prove connectivity, not just configuration. Any future service dependency added to `/api/health` should distinguish `not configured for local fallback` from `configured but failing`.
- Process improvement from this pass: runtime route checks should verify response contracts, not only status codes. `/api/health` now has payload-level assertions in `npm run app:verify`.
- Process improvement from this pass: production route checks should exercise real external-demo paths, not just route shells. Dynamic game pages and shareable compare links are now part of `npm run app:verify`.
- Process improvement from this pass: any behavior important enough to document in the runbook should have a focused executable guard. The health contract now has its own fast audit command and is part of CI plus release verification.
- Process improvement from this pass: refresh workflows should prove non-mutating review steps mechanically. The enrichment refresh path now has a hash-based dry-run guard before any write path is used.
- Process improvement from this pass: standalone audit commands should be promoted into the release path when they protect data integrity. The enrichment dry-run guard is now part of local release verification and CI.
- Process improvement from this pass: tracker instructions can drift even after scripts are fixed. Audit guards should check the human-facing queue text when stale instructions could cause unsafe manual workflow.
- Process improvement from this pass: not every source-fetch failure should stay as `needs_review`. Known, bounded metadata-source limitations now have a typed status so strict readiness blocks only on true unresolved items.
- Process improvement from this pass: external blockers are now executable checks instead of only prose. Normal readiness mode reports blockers without breaking CI, while strict mode can be used before an interview/deploy to fail until the blockers are resolved.
- Process improvement from this pass: known blockers should be asserted narrowly. The strict blocker guard prevents a second hidden blocker from being masked by the known missing database credential.
- Process improvement from this pass: successful release logs should not contain expected nested failure noise. Guard scripts should summarize expected failures and reserve full captured output for unexpected failures.
- Process improvement from this pass: tracker claims are now executable. `npm run audit:queue` fails if required scripts are missing, if CI stops running the critical checks, if README screenshot links point at missing files, or if `tsx` is reintroduced.
- Process improvement from this pass: queue claims need verification against the actual scripts. The previous "no tsx" statement was incomplete because three helper scripts still used `tsx`; that is now corrected.
- Process improvement from this pass: do not run `npm run lint` and `npm run build` in parallel locally because both can touch `.next/types` and produce false missing-file errors.
- Process improvement from this pass: live enrichment must be dry-run and validated first. A full dry-run initially proved the old fetch path could produce a partial file, so the script now preserves existing reviewed metadata when live lookup fails.

## Next To Start

- Connect a real Supabase project and run `npm run db:push` plus `npm run db:import` with `DATABASE_URL`.
- Follow `docs/PRODUCTION_RUNBOOK.md` end-to-end once Supabase credentials are available.
- Create `.env.local` from `.env.example`, add the real Supabase pooled `DATABASE_URL`, then run `npm run db:push`, `npm run db:import`, `npm run db:smoke`, and `npm run audit:readiness:strict`.
- After Supabase is connected and imported, run `npm run release:verify:strict`.
- When refreshing enrichment, run `npm run audit:enrichment-dry-run` first, then run `npm run data:fetch` only if the guarded dry-run is clean and the resulting `data/raw/game-enrichment.json` diff is reviewed.

## Risks / Open Items

- Official data must be refreshed after Take-Two reports Q4/FY2026 results on 2026-05-21.
- Supabase is wired but not connected until `DATABASE_URL` is configured.
- MobyGames blocks direct unauthenticated snapshot fetches with HTTP 403; this is now tracked as a documented metadata-only exception, not an official sales source.
- Wikipedia and MobyGames are metadata enrichment sources only, not official sales sources.
- Modeled revenue remains premium-software revenue only and should never be described as official financial reporting.
- OpenGraph routes use Edge runtime, which disables static generation for those image endpoints. This is acceptable for dynamic social previews but should be monitored if preview latency becomes a concern.
- Docker is not installed in this environment, so local containerized Postgres cannot substitute for the missing Supabase `DATABASE_URL`.

## Improvement Loop

- After every implementation pass, update this file before final reporting.
- Every new dashboard metric must include provenance, confidence, source IDs, and model version.
- Every new data source must have an ingestion snapshot or an explicit reason why it is internal/manual.
- Every visual upgrade must be checked on desktop and mobile before it counts as done.
- Any failed validation should become either a code fix or a named backlog item here.
