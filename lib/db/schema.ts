import { boolean, integer, jsonb, numeric, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const games = pgTable("games", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  franchise: text("franchise").notNull(),
  kind: text("kind").notNull(),
  rockstarRole: text("rockstar_role").notNull(),
  analyticsCoverage: text("analytics_coverage").notNull(),
  parentGameId: text("parent_game_id"),
  releaseYear: integer("release_year").notNull(),
  originalReleaseDate: text("original_release_date").notNull(),
  releaseDatePrecision: text("release_date_precision").notNull(),
  status: text("status").notNull(),
  developer: text("developer").notNull(),
  publisher: text("publisher").notNull(),
  themeKey: text("theme_key").notNull(),
  estimatedLifetimeUnitsM: numeric("estimated_lifetime_units_m", { precision: 10, scale: 4 }).notNull(),
  confirmedLifetimeUnitsM: numeric("confirmed_lifetime_units_m", { precision: 10, scale: 4 }),
  averageSellingPriceUsd: numeric("average_selling_price_usd", { precision: 10, scale: 2 }).notNull(),
  methodologyId: text("methodology_id").notNull(),
  copy: jsonb("copy").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
});

export const platforms = pgTable("platforms", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  manufacturer: text("manufacturer").notNull(),
  generation: text("generation").notNull(),
  releaseYear: integer("release_year").notNull(),
  family: text("family").notNull(),
  iconText: text("icon_text").notNull()
});

export const releases = pgTable("releases", {
  id: text("id").primaryKey(),
  gameId: text("game_id").notNull(),
  platformId: text("platform_id").notNull(),
  releaseDate: text("release_date").notNull(),
  releaseDatePrecision: text("release_date_precision").notNull(),
  editionType: text("edition_type").notNull(),
  remaster: boolean("remaster").notNull(),
  notes: text("notes").notNull()
});

export const sources = pgTable("sources", {
  id: text("id").primaryKey(),
  sourceName: text("source_name").notNull(),
  sourceUrl: text("source_url").notNull(),
  sourceType: text("source_type").notNull(),
  trustTier: integer("trust_tier").notNull(),
  accessedAt: text("accessed_at").notNull(),
  attributionRequired: boolean("attribution_required").notNull(),
  notes: text("notes").notNull()
});

export const salesEvents = pgTable("sales_events", {
  id: text("id").primaryKey(),
  gameId: text("game_id"),
  franchise: text("franchise"),
  metricName: text("metric_name").notNull(),
  metricValueM: numeric("metric_value_m", { precision: 10, scale: 4 }).notNull(),
  metricUnit: text("metric_unit").notNull(),
  asOfDate: text("as_of_date").notNull(),
  sourceId: text("source_id").notNull(),
  isOfficial: boolean("is_official").notNull(),
  notes: text("notes").notNull()
});

export const derivedSalesFacts = pgTable("derived_sales_facts", {
  id: text("id").primaryKey(),
  gameId: text("game_id").notNull(),
  platformId: text("platform_id").notNull(),
  regionId: text("region_id").notNull(),
  year: integer("year").notNull(),
  estimatedUnitsSoldM: numeric("estimated_units_sold_m", { precision: 12, scale: 6 }).notNull(),
  cumulativeUnitsSoldM: numeric("cumulative_units_sold_m", { precision: 12, scale: 6 }).notNull(),
  estimatedRevenueUsdM: numeric("estimated_revenue_usd_m", { precision: 12, scale: 6 }).notNull(),
  confidenceScore: numeric("confidence_score", { precision: 5, scale: 4 }).notNull(),
  methodologyId: text("methodology_id").notNull(),
  modelVersion: text("model_version").notNull(),
  uncertaintyRange: jsonb("uncertainty_range"),
  sourceIds: jsonb("source_ids").notNull(),
  isModeled: boolean("is_modeled").notNull(),
  lastVerifiedAt: text("last_verified_at").notNull()
});

export const gameEnrichment = pgTable("game_enrichment", {
  gameId: text("game_id").primaryKey(),
  wikipediaTitle: text("wikipedia_title"),
  wikipediaUrl: text("wikipedia_url"),
  summary: text("summary"),
  releaseContext: text("release_context"),
  roleContext: text("role_context"),
  precisionNote: text("precision_note"),
  legacyNote: text("legacy_note"),
  coverImageUrl: text("cover_image_url"),
  sourceName: text("source_name"),
  sourceUrl: text("source_url"),
  accessedAt: text("accessed_at")
});

export const methodologies = pgTable("methodologies", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  version: text("version").notNull(),
  assumptions: jsonb("assumptions").notNull(),
  formulaNotes: jsonb("formula_notes").notNull(),
  modelSteps: jsonb("model_steps"),
  inputs: jsonb("inputs"),
  knownWeaknesses: jsonb("known_weaknesses"),
  lastReviewedAt: text("last_reviewed_at"),
  exampleGameIds: jsonb("example_game_ids")
});

export const ingestionRuns = pgTable("ingestion_runs", {
  id: text("id").primaryKey(),
  startedAt: timestamp("started_at", { withTimezone: true }).notNull(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  status: text("status").notNull(),
  sourceCount: integer("source_count").notNull(),
  officialEventCount: integer("official_event_count").notNull(),
  enrichmentCount: integer("enrichment_count").notNull(),
  modelVersion: text("model_version").notNull(),
  notes: jsonb("notes").notNull()
});

export const sourceSnapshots = pgTable("source_snapshots", {
  id: text("id").primaryKey(),
  sourceId: text("source_id").notNull(),
  sourceUrl: text("source_url").notNull(),
  capturedAt: timestamp("captured_at", { withTimezone: true }).notNull(),
  contentHash: text("content_hash").notNull(),
  extractionMethod: text("extraction_method").notNull(),
  reviewStatus: text("review_status").notNull(),
  notes: text("notes").notNull()
});

export const fieldProvenance = pgTable("field_provenance", {
  id: text("id").primaryKey(),
  gameId: text("game_id").notNull(),
  fieldName: text("field_name").notNull(),
  tag: text("tag").notNull(),
  label: text("label").notNull(),
  reason: text("reason").notNull(),
  sourceIds: jsonb("source_ids"),
  sourceUrl: text("source_url"),
  modelVersion: text("model_version"),
  reviewStatus: text("review_status").notNull(),
  reviewedAt: text("reviewed_at"),
  notes: text("notes").notNull()
});
