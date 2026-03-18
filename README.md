# ROCKSTAR SALES UNIVERSE

`ROCKSTAR SALES UNIVERSE` is a Next.js project I built around Rockstar Games' release history, sales estimates, platform breakdowns, and a browser-based SQL lab.

I kept coming back to three questions while building it:

- What did Rockstar release, and where did each title land?
- Which figures are official, which are modeled, and how confident should the user be in them?
- How do you make a data-heavy catalog feel like a product instead of a spreadsheet with charts?

## Overview

This project is structured as a multi-surface explorer rather than a single dashboard:

- `Homepage`: a full release atlas with search, filters, featured worlds, and direct entry points into the rest of the app
- `Dashboard`: the broad analytics surface for slicing the catalog by franchise, platform family, generation, role, status, and data mode
- `Game detail pages`: themed title-specific environments with platform breakdowns, trends, release timelines, and provenance
- `Compare`: head-to-head matchups built from the full Rockstar catalog
- `Data Lab`: a read-only SQL interface over the local dataset
- `Methodology`: the trust model, source hierarchy, confidence framing, and modeling limits

## Why I Built It

I did not want this to feel like a generic game sales dashboard.

I wanted it to feel closer to a Rockstar companion product while still being clear about what is official, what is estimated, and where the weak spots are. So the whole project is built around a few rules:

- strong visual identity without hiding uncertainty
- modeled data that is always labeled as modeled
- different ways to move through the app depending on whether someone wants to browse, compare, analyze, or inspect raw rows
- a codebase that works as both a frontend project and a data-modeling project

## Feature Highlights

### 1. Full Catalog Coverage

The catalog is not limited to the largest commercial hits. It includes:

- mainline games
- mission packs
- expansions
- online-service layers
- variants, remasters, and re-releases

This matters because `GTA V`, `GTA Online`, `The Lost and Damned`, and `Bully: Scholarship Edition` should not be flattened into the same type of release.

### 2. Honest Data Modes

The app supports three explicit data modes:

- `Confirmed`: title-level official milestones only
- `Estimated`: the full modeled commercial layer
- `Blended`: official anchors where public, modeled detail where disclosure stops

That separation matters to me because I did not want estimated numbers dressed up like hard facts.

### 3. Theme and Asset System

Each title world is driven by reusable theme and asset configuration instead of one-off styling.

Themes control:

- accents
- gradients and overlays
- panel treatment
- chart palettes
- atmosphere

Assets control:

- poster art
- hero imagery
- logos
- gallery strips
- fallbacks

That lets the app shift tone from `Red Dead Redemption` to `L.A. Noire` to `Midnight Club` without rebuilding the same page over and over.

### 4. SQL Data Lab

The `Data Lab` route exists because polished charts should not be the only way to inspect the project. Users can query the local seed and derived tables directly in-browser through a read-only SQL interface.

That also makes the project more useful as:

- a frontend portfolio piece
- a data-modeling portfolio piece
- an exploration tool instead of just a presentation layer

## Screens and Product Flow

### Homepage

- searchable release explorer
- franchise quick filters
- featured title worlds
- direct entry into dashboard, compare mode, and data lab

### Dashboard

- multi-filter control surface
- KPI cards
- charts for titles, franchises, trends, platform mix, and regions
- ranked table with CSV export

### Game Detail

- title-specific visual treatment
- platform cards
- trend charts
- release timeline
- provenance and confidence surfaces

### Compare

- selection roster
- full library search
- matchup cards
- comparative trend overlay

### Data Lab

- SQL presets
- editable query surface
- raw table counts
- result grid

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Recharts
- AlaSQL for the in-browser SQL lab
- local typed seed data and derived fact tables

## Project Structure

```text
app/
  page.tsx
  dashboard/page.tsx
  compare/page.tsx
  data-lab/page.tsx
  game/[slug]/page.tsx
  methodology/page.tsx
components/
  cards/
  charts/
  compare/
  dashboard/
  data-lab/
  game/
  layout/
  ui/
config/
  gameAssets.ts
  gameThemes.ts
  platformAssets.ts
  site.ts
data/
  raw/
  normalized/
lib/
  data/
  formatters/
  metrics/
  themes/
  url-state.ts
scripts/
types/
```

## Data Model

Typed domain entities live in [`types/domain.ts`](./types/domain.ts). Core entities include:

- `Game`
- `Platform`
- `Release`
- `Region`
- `OfficialSalesEvent`
- `DerivedSalesFact`
- `Methodology`
- `SourceRecord`
- `GameAsset`
- `ThemeDefinition`

Important modeling fields include:

- `kind`
- `rockstarRole`
- `analyticsCoverage`
- `releaseDatePrecision`
- `confidenceScore`

Those fields are what keep the catalog from turning into one flattened leaderboard.

## Data Pipeline

The current build is seed-first. It ships with a local dataset so the app runs immediately, but the repo is organized so the source layer can evolve later.

Current flow:

1. Raw source references live under [`data/raw`](./data/raw)
2. Catalog entities and typed normalized seed data live under [`data/normalized`](./data/normalized)
3. Repository helpers shape that dataset for the product layer
4. Presenter utilities generate card-ready and chart-ready views
5. The SQL lab exposes the table layer directly

Available scripts:

- `npm run data:fetch`
- `npm run data:normalize`
- `npm run data:derived`

Script entry points:

- [`scripts/fetch-metadata.ts`](./scripts/fetch-metadata.ts)
- [`scripts/normalize-data.ts`](./scripts/normalize-data.ts)
- [`scripts/build-derived-sales.ts`](./scripts/build-derived-sales.ts)

## Source Hierarchy

### Tier 1

- Take-Two investor relations materials
- Rockstar official catalog references
- official title-level or franchise-level milestone disclosures

### Tier 2

- structured metadata sources such as MobyGames
- platform and release-history references

### Tier 3

- internal modeling assumptions
- manual allocation logic for titles without direct disclosure

I wanted those categories to stay visible in the UI instead of getting blended into fake certainty.

## Modeling Approach

Not every Rockstar title has a public title-level sales milestone. When that disclosure does not exist, the app falls back to a clearly labeled lower-confidence model.

The modeled layer considers:

- release year
- franchise strength
- platform spread
- release type
- Rockstar role on the title
- inheritance from parent titles for mission packs, expansions, variants, and online-service layers

What is modeled:

- lifetime unit estimates where no title-level milestone exists
- platform splits
- region splits
- annual cadence
- revenue estimates

What is not claimed:

- exact historical sell-through by platform
- official revenue reporting
- false precision on unsupported legacy titles

## Performance Notes

Recent cleanup focused on keeping the app visually ambitious without making it feel heavy:

- charts are lazy-loaded behind lightweight loading shells
- backdrop transitions avoid expensive blur-heavy motion
- counters animate from the previous state instead of restarting from zero
- repository helpers reduce repeated data work across the UI

## Running Locally

Install dependencies and start the app:

```bash
npm install
npm run dev
```

Build and run the production server:

```bash
npm run build
npm run start
```

Verification:

```bash
npm run lint
```

Note: `npm run lint` currently runs `tsc --noEmit`.

## Screenshots

Screenshot placeholders and naming guidance live in [`docs/screenshots/README.md`](./docs/screenshots/README.md).

## Future Backend Migration

If I move this to Supabase later, the plan is:

1. mirror normalized entities into database tables
2. replace repository reads in [`lib/data/repository.ts`](./lib/data/repository.ts) with database queries
3. keep presenter logic intact so components remain data-source agnostic
4. move provenance timestamps and attribution metadata into persistent rows
5. preserve the SQL lab as a read-only inspection surface on top of real exports

## Known Limits

- many non-flagship titles still rely on lower-confidence modeled commercial coverage
- asset richness remains stronger for flagship titles than for the entire long tail
- some legacy release dates are still represented at year precision
- the featured worlds are visually richer than the oldest catalog entries

## Roadmap

- improve long-tail cover art coverage further
- expand platform-specific release metadata
- enrich source-level attribution and inline provenance badges
- add saved compare presets and shareable snapshots
- introduce Supabase-backed updates and editing workflows
- reduce dashboard bundle weight further by splitting more heavy client surfaces

## Why This Repo Matters To Me

- it let me combine product design, frontend work, and data modeling in one project instead of splitting those ideas across smaller demos
- it gave me a way to treat uncertainty as part of the UX instead of hiding it in tiny footnotes
- it pushed me to build a cleaner structure around repository helpers, presenter logic, themes, and assets
- it feels more like a real product than a chart dump, which was the whole point
