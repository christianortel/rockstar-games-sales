# ROCKSTAR SALES UNIVERSE

`ROCKSTAR SALES UNIVERSE` is an interactive release atlas for Rockstar Games. It combines a full catalog browser, themed title pages, comparison tools, a modeled sales layer, and a raw SQL data lab in one product.

The project is built to answer three questions clearly:

- What did Rockstar release, and on which platforms?
- Which numbers are official, which are estimated, and how strong is that estimate?
- How do you turn a data-heavy catalog into something worth exploring instead of another BI dashboard?

## Product Overview

This app is structured as a multi-surface explorer rather than a single dashboard:

- The homepage is a release atlas with search, filters, and a full Rockstar catalog browser.
- The dashboard is the broad analytics view for slicing the catalog by franchise, platform family, generation, role, status, and data mode.
- Game detail pages turn a title into its own themed environment with platform breakdowns, trend charts, release timelines, and provenance.
- Compare mode builds head-to-head matchups from the full catalog.
- Data Lab exposes the local dataset through a read-only SQL interface.
- Methodology explains the trust model, source hierarchy, confidence scoring, and limits.

## Why This Project Exists

Most analytics projects stop at correctness and most fan projects stop at vibe. This project tries to do both.

The design goal was to make the interface feel like a Rockstar companion product while keeping the data contract explicit. That means:

- themed visuals without hiding uncertainty
- dramatic transitions without sacrificing readability
- modeled data that is always labeled as modeled
- a product flow that supports browsing, analysis, comparison, and raw inspection

## Core Product Decisions

### 1. Full Catalog First

The catalog includes every Rockstar release in the supplied list, not just the largest commercial hits.

That includes:

- mainline games
- mission packs
- expansions
- online-service layers
- variants and re-releases

Those release types are modeled separately so the app does not pretend `GTA V`, `GTA Online`, `The Lost and Damned`, and `Bully: Scholarship Edition` are the same kind of thing.

### 2. Honest Data Layers

The app supports three modes:

- `Confirmed`: direct title-level official milestones only
- `Estimated`: full modeled commercial layer
- `Blended`: official anchors where available, modeled detail where disclosure stops

This separation is a core product feature, not a footnote.

### 3. Theme System Over One-Off Styling

Each game world is driven through a reusable theme and asset system, so the product can shift atmosphere without duplicating layout logic.

Themes control:

- accents
- overlay gradients
- panel treatment
- chart palettes
- backdrop behavior

Assets control:

- poster art
- hero imagery
- logos
- gallery images
- fallbacks

### 4. Raw Data Should Be Reachable

The new `Data Lab` route exists because polished charts should not be the only way to inspect the project. Users can query the local seed and derived fact tables directly in SQL.

That makes the app stronger as:

- an exploration tool
- a data-engineering portfolio piece
- a frontend portfolio piece

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Recharts
- AlaSQL for the in-browser SQL lab
- Local typed seed data and derived facts

## Folder Structure

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

The project uses typed normalized entities in [`types/domain.ts`](./types/domain.ts):

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

Those fields are what let the app represent the full catalog honestly instead of flattening everything into a single leaderboard.

## Data Pipeline

The current build is seed-first. The app ships with a local dataset so it runs immediately, but the repository is organized so the seed can be replaced later.

Current flow:

1. Raw source references live under [`data/raw`](./data/raw)
2. Catalog and typed seed entities live under [`data/normalized`](./data/normalized)
3. Repository helpers shape the dataset for the product layer
4. Presenter utilities generate chart-friendly and card-friendly views
5. The SQL lab exposes the raw table layer directly

Scripts included:

- [`scripts/fetch-metadata.ts`](./scripts/fetch-metadata.ts)
- [`scripts/normalize-data.ts`](./scripts/normalize-data.ts)
- [`scripts/build-derived-sales.ts`](./scripts/build-derived-sales.ts)

## Source Hierarchy

### Tier 1

- Take-Two investor relations materials
- Rockstar official catalog references
- official title or franchise milestone disclosures

### Tier 2

- structured metadata sources such as MobyGames
- platform and release-history references

### Tier 3

- internal modeling assumptions
- manual allocation logic used for unsupported commercial layers

The app keeps those categories visible in the UI instead of blending them into one implied truth.

## Modeling Approach

Not every Rockstar title has a public title-level sales milestone. For those titles, the app uses a clearly labeled low-confidence model.

The modeled layer considers:

- release year
- franchise strength
- platform spread
- release type
- Rockstar role on the title
- parent-title inheritance for mission packs, expansions, variants, and online layers

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

## UX Structure

### Homepage

- full release explorer
- searchable catalog atlas
- featured high-detail worlds
- direct entry into atlas, compare, and data lab

### Dashboard

- sticky multi-filter control surface
- scope summary
- KPIs
- charts for titles, franchises, trends, platform mix, and regions
- ranking table with CSV export

### Game Detail

- world-specific presentation
- platform cards
- trend charts
- release timeline
- provenance and confidence UI

### Compare

- selection roster
- full library search
- matchup cards
- comparative trend overlay

### Data Lab

- SQL presets
- raw table counts
- editable query surface
- result grid

## Theme and Asset System

Theme configuration lives in [`config/gameThemes.ts`](./config/gameThemes.ts).

Asset configuration lives in [`config/gameAssets.ts`](./config/gameAssets.ts).

This split matters because it lets the app evolve in two directions independently:

- new visual art can be swapped in without restructuring components
- theme behavior can change without touching the underlying data

## Performance Decisions

Recent cleanup focused on making the app feel less heavy:

- charts are lazy-loaded behind lightweight loading shells
- backdrop transitions avoid expensive blur-based motion
- counters animate from the previous state instead of restarting from zero
- shared repository helpers reduce repeated data work across the UI

The app is still visually ambitious, but it now stages heavy UI work more carefully.

## How To Run

```bash
npm install
npm run dev
```

Verification:

```bash
npm run lint
npm run build
```

## How To Swap To Supabase Later

1. Mirror the normalized entities into Supabase tables.
2. Replace repository reads in [`lib/data/repository.ts`](./lib/data/repository.ts) with Supabase queries.
3. Keep presenter logic intact so components do not care where the data came from.
4. Move provenance timestamps and attribution data into database rows.
5. Preserve the SQL lab as a read-only inspection surface on top of real database exports.

## Known Limits

- Many non-flagship titles still rely on low-confidence modeled commercial coverage.
- Asset richness is uneven because real cover art is stronger for some titles than others.
- The visual language is much stronger on the featured worlds than on every legacy catalog entry.
- Some legacy dates remain year-level references until stronger per-platform release normalization is added.

## Roadmap

- improve cover-art coverage for the long tail of the catalog
- expand platform-specific release metadata
- enrich source-level attribution and inline provenance badges
- add saved compare presets and share snapshots
- add Supabase-backed updates and editing workflows
- tighten dashboard bundle size further by splitting more heavy client surfaces
