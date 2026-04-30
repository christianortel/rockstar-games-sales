export type ThemeKey =
  | "frontier_noir"
  | "vice_neon"
  | "san_andreas_sunfade"
  | "noir_detective"
  | "school_rebel"
  | "max_pain_cold"
  | "street_racer_glow"
  | "liberty_steel"
  | "heist_gold";

export type DataMode = "confirmed" | "estimated" | "blended";
export type MetricMode = "units" | "revenue";
export type SourceType = "investor_relations" | "official_catalog" | "metadata_api" | "manual_model";
export type ReviewStatus = "pending" | "approved" | "needs_review" | "documented_exception";
export type IngestionStatus = "success" | "warning" | "failed";
export type ModelStep = "lifetime_title_estimate" | "platform_allocation" | "regional_allocation" | "annual_cadence" | "revenue_estimate";
export type EditionType = "base" | "special" | "complete" | "port" | "remaster";
export type GameKind = "game" | "mission_pack" | "expansion" | "online_service" | "variant";
export type RockstarRole = "developed" | "published" | "presented";
export type AnalyticsCoverage = "featured" | "supported" | "catalog_only";
export type ReleaseDatePrecision = "day" | "year";
export type ProvenanceTag = "official" | "modeled" | "inherited" | "enriched";
export type ConsoleGeneration =
  | "gen5"
  | "gen6"
  | "gen7"
  | "gen8"
  | "gen9"
  | "portable"
  | "pc"
  | "mobile"
  | "vr";

export interface Game {
  id: string;
  slug: string;
  title: string;
  franchise: string;
  kind: GameKind;
  rockstarRole: RockstarRole;
  analyticsCoverage: AnalyticsCoverage;
  parentGameId?: string;
  releaseYear: number;
  originalReleaseDate: string;
  releaseDatePrecision: ReleaseDatePrecision;
  shortDescription: string;
  longDescription: string;
  releaseContext: string;
  roleContext: string;
  precisionNote?: string;
  legacyNote?: string;
  themeKey: ThemeKey;
  universeStyle: string;
  heroTagline: string;
  status: "released" | "active";
  developer: string;
  publisher: string;
  criticsAngle: string;
  averageSellingPriceUsd: number;
  estimatedLifetimeUnitsM: number;
  confirmedLifetimeUnitsM?: number;
  headlineMetric: string;
  galleryCaption: string;
  fieldProvenance: GameFieldProvenance;
  confidenceReasons: string[];
  methodologyId: string;
}

export interface FieldProvenance {
  tag: ProvenanceTag;
  label: string;
  reason: string;
  sourceIds?: string[];
  sourceUrl?: string;
}

export interface GameFieldProvenance {
  lifetimeUnits: FieldProvenance;
  revenueEstimate: FieldProvenance;
  releaseDate: FieldProvenance;
  coverArt: FieldProvenance;
  metadata: FieldProvenance;
}

export interface Platform {
  id: string;
  slug: string;
  name: string;
  manufacturer: string;
  generation: ConsoleGeneration;
  releaseYear: number;
  iconText: string;
  family: string;
}

export interface Release {
  id: string;
  gameId: string;
  platformId: string;
  releaseDate: string;
  releaseDatePrecision?: ReleaseDatePrecision;
  editionType: EditionType;
  remaster: boolean;
  notes: string;
}

export interface Region {
  id: string;
  name: string;
  slug: string;
}

export interface OfficialSalesEvent {
  id: string;
  gameId?: string;
  franchise?: string;
  metricName: string;
  metricValueM: number;
  metricUnit: "million_units";
  asOfDate: string;
  sourceId: string;
  sourceName: string;
  sourceUrl: string;
  sourceType: SourceType;
  isOfficial: boolean;
  notes: string;
}

export interface DerivedSalesFact {
  id: string;
  gameId: string;
  platformId: string;
  regionId: string;
  year: number;
  estimatedUnitsSoldM: number;
  cumulativeUnitsSoldM: number;
  estimatedRevenueUsdM: number;
  confidenceScore: number;
  methodologyId: string;
  modelVersion: string;
  uncertaintyRange?: UncertaintyRange;
  sourceIds: string[];
  isModeled: boolean;
  lastVerifiedAt: string;
}

export interface Methodology {
  id: string;
  name: string;
  description: string;
  assumptions: string[];
  formulaNotes: string[];
  version: string;
  modelSteps?: ModelStep[];
  inputs?: string[];
  knownWeaknesses?: string[];
  lastReviewedAt?: string;
  exampleGameIds?: string[];
}

export interface SourceRecord {
  id: string;
  sourceName: string;
  sourceUrl: string;
  sourceType: SourceType;
  trustTier: 1 | 2 | 3;
  accessedAt: string;
  attributionRequired: boolean;
  notes: string;
}

export interface UncertaintyRange {
  low: number;
  base: number;
  high: number;
}

export interface OfficialValue {
  value: number;
  unit: string;
  provenance: FieldProvenance;
  confidence: number;
  sourceIds: string[];
  asOfDate: string;
}

export interface ModeledValue {
  value: number;
  unit: string;
  provenance: FieldProvenance;
  confidence: number;
  sourceIds: string[];
  modelVersion: string;
  range: UncertaintyRange;
}

export interface SourceSnapshot {
  id: string;
  sourceId: string;
  sourceUrl: string;
  capturedAt: string;
  contentHash: string;
  extractionMethod: string;
  reviewStatus: ReviewStatus;
  notes: string;
}

export interface IngestionRun {
  id: string;
  startedAt: string;
  completedAt?: string;
  status: IngestionStatus;
  sourceCount: number;
  officialEventCount: number;
  enrichmentCount: number;
  modelVersion: string;
  notes: string[];
}

export interface ModelVersion {
  id: string;
  label: string;
  createdAt: string;
  methodologyId: string;
  steps: ModelStep[];
  assumptions: string[];
  knownWeaknesses: string[];
}

export interface FieldAudit {
  id: string;
  gameId: string;
  fieldName: keyof GameFieldProvenance | "platformAllocation" | "regionalAllocation" | "annualCadence";
  provenance: FieldProvenance;
  modelVersion?: string;
  reviewedAt?: string;
  reviewStatus: ReviewStatus;
  notes: string;
}

export interface DashboardKpiValue {
  value: number;
  unit: string;
  provenance: FieldProvenance;
  confidence: number;
  sourceIds: string[];
  modelVersion: string;
  range?: UncertaintyRange;
}

export interface DashboardSummary {
  totalUnits: DashboardKpiValue;
  totalRevenue: DashboardKpiValue;
  officialAnchorCount: DashboardKpiValue;
  modeledTitleCount: DashboardKpiValue;
  averageConfidence: DashboardKpiValue;
  strongestOfficialAnchor?: DashboardGameRow;
  highestUncertaintyTitle?: DashboardGameRow;
  latestOfficialAsOfDate: string;
  latestEnrichmentRunDate: string;
  latestModelRunDate: string;
}

export interface GameAsset {
  gameId: string;
  backgroundImage?: string;
  heroImage?: string;
  logoImage?: string;
  posterImage?: string;
  galleryImages: string[];
  accentColor: string;
  overlayStyle: string;
  cardStyle: string;
  backgroundPosition: string;
  fallbackGradient: string;
}

export interface ThemeDefinition {
  key: ThemeKey;
  label: string;
  accent: string;
  accentSoft: string;
  accentStrong: string;
  backgroundGradient: string;
  overlayGradient: string;
  panelClassName: string;
  headingEyebrow: string;
  cardGlow: string;
  chartPalette: string[];
  textureClassName: string;
}

export interface FilterState {
  franchise: string;
  platform: string;
  family: string;
  region: string;
  generation: string;
  kind: string;
  role: string;
  status: string;
  coverage: "all" | "analytics" | "catalog_only";
  yearStart: number;
  yearEnd: number;
  search: string;
  metricMode: MetricMode;
  dataMode: DataMode;
}

export interface GameProfile {
  gameId: string;
  platformShares: Record<string, number>;
  regionShares: Record<string, number>;
  yearlyWeights: number[];
  confidenceBase: number;
  notes: string;
}

export interface DashboardGameRow {
  game: Game;
  estimatedUnitsM: number;
  confirmedUnitsM?: number;
  blendedUnitsM: number;
  estimatedRevenueUsdM: number;
  platforms: Platform[];
  confidence: number;
  confidenceReasons: string[];
}

export interface GameEnrichment {
  gameId: string;
  wikipediaTitle?: string;
  wikipediaUrl?: string;
  summary?: string;
  releaseContext?: string;
  roleContext?: string;
  precisionNote?: string;
  legacyNote?: string;
  coverImageUrl?: string;
  sourceName?: string;
  sourceUrl?: string;
  accessedAt?: string;
}
