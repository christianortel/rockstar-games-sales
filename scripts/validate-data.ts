import { currentModelVersion, games, officialSalesEvents, sources } from "@/data/normalized/seed";
import rawSourceSnapshots from "@/data/raw/source-snapshots.json";
import { derivedSalesFacts, getDashboardRows, getSourceIdsForGame } from "@/lib/data/repository";
import { isOfficialBaselineStale, officialDataFreshness } from "@/lib/data/freshness";
import { SourceSnapshot } from "@/types/domain";

const errors: string[] = [];
const warnings: string[] = [];
const sourceById = new Map(sources.map((source) => [source.id, source]));
const sourceSnapshots = rawSourceSnapshots as SourceSnapshot[];
const snapshotBySourceId = new Map(sourceSnapshots.map((snapshot) => [snapshot.sourceId, snapshot]));

for (const event of officialSalesEvents) {
  const source = sourceById.get(event.sourceId);
  if (!source) {
    errors.push(`Official event ${event.id} references missing source ${event.sourceId}.`);
  } else if (event.isOfficial && source.trustTier !== 1) {
    errors.push(`Official event ${event.id} is not backed by a Tier 1 source.`);
  }
}

for (const source of sources) {
  const snapshot = snapshotBySourceId.get(source.id);
  if (!snapshot) {
    errors.push(`Source ${source.id} has no ingestion snapshot.`);
    continue;
  }

  if (source.trustTier === 1 && snapshot.reviewStatus !== "approved") {
    errors.push(`Tier 1 source ${source.id} has unapproved snapshot status ${snapshot.reviewStatus}.`);
  }

  if (snapshot.reviewStatus === "needs_review") {
    warnings.push(`Source ${source.id} needs review: ${snapshot.notes}`);
  }

  if (snapshot.reviewStatus === "documented_exception") {
    warnings.push(`Source ${source.id} has a documented exception: ${snapshot.notes}`);
  }
}

for (const game of games) {
  if (!game.releaseContext.trim()) errors.push(`${game.id} is missing release context.`);
  if (!game.roleContext.trim()) errors.push(`${game.id} is missing Rockstar role context.`);
  if (!Object.keys(game.fieldProvenance).length) errors.push(`${game.id} is missing field provenance.`);

  for (const [field, provenance] of Object.entries(game.fieldProvenance)) {
    if (!provenance.label || !provenance.reason) {
      errors.push(`${game.id}.${field} has incomplete provenance copy.`);
    }

    for (const sourceId of provenance.sourceIds ?? []) {
      if (!sourceById.has(sourceId)) errors.push(`${game.id}.${field} references missing source ${sourceId}.`);
    }
  }

  const sourceIds = getSourceIdsForGame(game.id);
  if (!sourceIds.length) errors.push(`${game.id} has no source trail.`);
}

for (const fact of derivedSalesFacts) {
  if (!fact.modelVersion) errors.push(`${fact.id} is missing modelVersion.`);
  if (fact.modelVersion !== currentModelVersion) warnings.push(`${fact.id} uses ${fact.modelVersion}, expected ${currentModelVersion}.`);
  if (!fact.uncertaintyRange) errors.push(`${fact.id} is missing uncertainty range.`);
  if (!fact.isModeled && !fact.sourceIds.some((sourceId) => sourceById.get(sourceId)?.trustTier === 1)) {
    errors.push(`${fact.id} is non-modeled but lacks a Tier 1 source.`);
  }
  for (const sourceId of fact.sourceIds) {
    if (!sourceById.has(sourceId)) errors.push(`${fact.id} references missing source ${sourceId}.`);
  }
}

for (const row of getDashboardRows()) {
  if (!row.game.fieldProvenance.lifetimeUnits) errors.push(`${row.game.id} dashboard KPI lacks lifetime provenance.`);
  if (!row.confidenceReasons.length) errors.push(`${row.game.id} lacks confidence reasons.`);
}

if (isOfficialBaselineStale()) {
  errors.push(
    `Official baseline is stale. Refresh after ${officialDataFreshness.nextOfficialReportLabel} (${officialDataFreshness.nextOfficialReportDate}).`
  );
}

if (warnings.length) {
  console.warn(warnings.map((warning) => `warning: ${warning}`).join("\n"));
}

if (errors.length) {
  console.error(errors.map((error) => `error: ${error}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log(`data validation passed for ${games.length} games, ${derivedSalesFacts.length} derived facts, and ${sources.length} sources.`);
}
