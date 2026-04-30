CREATE TABLE IF NOT EXISTS games (
  id text PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  franchise text NOT NULL,
  kind text NOT NULL,
  rockstar_role text NOT NULL,
  analytics_coverage text NOT NULL,
  parent_game_id text,
  release_year integer NOT NULL,
  original_release_date text NOT NULL,
  release_date_precision text NOT NULL,
  status text NOT NULL,
  developer text NOT NULL,
  publisher text NOT NULL,
  theme_key text NOT NULL,
  estimated_lifetime_units_m numeric(10, 4) NOT NULL,
  confirmed_lifetime_units_m numeric(10, 4),
  average_selling_price_usd numeric(10, 2) NOT NULL,
  methodology_id text NOT NULL,
  copy jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS platforms (
  id text PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  manufacturer text NOT NULL,
  generation text NOT NULL,
  release_year integer NOT NULL,
  family text NOT NULL,
  icon_text text NOT NULL
);

CREATE TABLE IF NOT EXISTS releases (
  id text PRIMARY KEY,
  game_id text NOT NULL,
  platform_id text NOT NULL,
  release_date text NOT NULL,
  release_date_precision text NOT NULL,
  edition_type text NOT NULL,
  remaster boolean NOT NULL,
  notes text NOT NULL
);

CREATE TABLE IF NOT EXISTS sources (
  id text PRIMARY KEY,
  source_name text NOT NULL,
  source_url text NOT NULL,
  source_type text NOT NULL,
  trust_tier integer NOT NULL,
  accessed_at text NOT NULL,
  attribution_required boolean NOT NULL,
  notes text NOT NULL
);

CREATE TABLE IF NOT EXISTS sales_events (
  id text PRIMARY KEY,
  game_id text,
  franchise text,
  metric_name text NOT NULL,
  metric_value_m numeric(10, 4) NOT NULL,
  metric_unit text NOT NULL,
  as_of_date text NOT NULL,
  source_id text NOT NULL,
  is_official boolean NOT NULL,
  notes text NOT NULL
);

CREATE TABLE IF NOT EXISTS derived_sales_facts (
  id text PRIMARY KEY,
  game_id text NOT NULL,
  platform_id text NOT NULL,
  region_id text NOT NULL,
  year integer NOT NULL,
  estimated_units_sold_m numeric(12, 6) NOT NULL,
  cumulative_units_sold_m numeric(12, 6) NOT NULL,
  estimated_revenue_usd_m numeric(12, 6) NOT NULL,
  confidence_score numeric(5, 4) NOT NULL,
  methodology_id text NOT NULL,
  model_version text NOT NULL,
  uncertainty_range jsonb,
  source_ids jsonb NOT NULL,
  is_modeled boolean NOT NULL,
  last_verified_at text NOT NULL
);

CREATE TABLE IF NOT EXISTS game_enrichment (
  game_id text PRIMARY KEY,
  wikipedia_title text,
  wikipedia_url text,
  summary text,
  release_context text,
  role_context text,
  precision_note text,
  legacy_note text,
  cover_image_url text,
  source_name text,
  source_url text,
  accessed_at text
);

CREATE TABLE IF NOT EXISTS methodologies (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL,
  version text NOT NULL,
  assumptions jsonb NOT NULL,
  formula_notes jsonb NOT NULL,
  model_steps jsonb,
  inputs jsonb,
  known_weaknesses jsonb,
  last_reviewed_at text,
  example_game_ids jsonb
);

CREATE TABLE IF NOT EXISTS ingestion_runs (
  id text PRIMARY KEY,
  started_at timestamptz NOT NULL,
  completed_at timestamptz,
  status text NOT NULL,
  source_count integer NOT NULL,
  official_event_count integer NOT NULL,
  enrichment_count integer NOT NULL,
  model_version text NOT NULL,
  notes jsonb NOT NULL
);

CREATE TABLE IF NOT EXISTS source_snapshots (
  id text PRIMARY KEY,
  source_id text NOT NULL,
  source_url text NOT NULL,
  captured_at timestamptz NOT NULL,
  content_hash text NOT NULL,
  extraction_method text NOT NULL,
  review_status text NOT NULL,
  notes text NOT NULL
);

CREATE TABLE IF NOT EXISTS field_provenance (
  id text PRIMARY KEY,
  game_id text NOT NULL,
  field_name text NOT NULL,
  tag text NOT NULL,
  label text NOT NULL,
  reason text NOT NULL,
  source_ids jsonb,
  source_url text,
  model_version text,
  review_status text NOT NULL,
  reviewed_at text,
  notes text NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_releases_game_id ON releases(game_id);
CREATE INDEX IF NOT EXISTS idx_facts_game_year ON derived_sales_facts(game_id, year);
CREATE INDEX IF NOT EXISTS idx_field_provenance_game_id ON field_provenance(game_id);
CREATE INDEX IF NOT EXISTS idx_sales_events_source_id ON sales_events(source_id);
