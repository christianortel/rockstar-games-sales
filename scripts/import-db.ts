import { loadRuntimeEnv } from "@/lib/env/load-runtime-env";
import { getDb, hasDatabaseUrl } from "@/lib/db/client";
import {
  derivedSalesFacts,
  getAllReleases,
  getPlatformOptions
} from "@/lib/data/repository";
import {
  games,
  methodologies,
  officialSalesEvents,
  sources
} from "@/data/normalized/seed";
import rawGameEnrichment from "@/data/raw/game-enrichment.json";
import * as schema from "@/lib/db/schema";

loadRuntimeEnv();

async function main() {
  if (!hasDatabaseUrl()) {
    console.log("DATABASE_URL is not set. Skipping database import; local seed data remains active.");
    return;
  }

  const db = getDb();

  await db.insert(schema.sources).values(sources).onConflictDoNothing();
  await db.insert(schema.platforms).values(getPlatformOptions()).onConflictDoNothing();
  await db.insert(schema.methodologies).values(methodologies).onConflictDoNothing();
  await db.insert(schema.games).values(
    games.map((game) => ({
      id: game.id,
      slug: game.slug,
      title: game.title,
      franchise: game.franchise,
      kind: game.kind,
      rockstarRole: game.rockstarRole,
      analyticsCoverage: game.analyticsCoverage,
      parentGameId: game.parentGameId,
      releaseYear: game.releaseYear,
      originalReleaseDate: game.originalReleaseDate,
      releaseDatePrecision: game.releaseDatePrecision,
      status: game.status,
      developer: game.developer,
      publisher: game.publisher,
      themeKey: game.themeKey,
      estimatedLifetimeUnitsM: String(game.estimatedLifetimeUnitsM),
      confirmedLifetimeUnitsM: game.confirmedLifetimeUnitsM ? String(game.confirmedLifetimeUnitsM) : null,
      averageSellingPriceUsd: String(game.averageSellingPriceUsd),
      methodologyId: game.methodologyId,
      copy: {
        shortDescription: game.shortDescription,
        longDescription: game.longDescription,
        releaseContext: game.releaseContext,
        roleContext: game.roleContext,
        precisionNote: game.precisionNote,
        legacyNote: game.legacyNote,
        headlineMetric: game.headlineMetric,
        confidenceReasons: game.confidenceReasons
      }
    }))
  ).onConflictDoNothing();
  await db.insert(schema.releases).values(getAllReleases().map((release) => ({
    ...release,
    releaseDatePrecision: release.releaseDatePrecision ?? "day"
  }))).onConflictDoNothing();
  await db.insert(schema.salesEvents).values(officialSalesEvents.map((event) => ({
    id: event.id,
    gameId: event.gameId,
    franchise: event.franchise,
    metricName: event.metricName,
    metricValueM: String(event.metricValueM),
    metricUnit: event.metricUnit,
    asOfDate: event.asOfDate,
    sourceId: event.sourceId,
    isOfficial: event.isOfficial,
    notes: event.notes
  }))).onConflictDoNothing();
  await db.insert(schema.derivedSalesFacts).values(derivedSalesFacts.map((fact) => ({
    ...fact,
    estimatedUnitsSoldM: String(fact.estimatedUnitsSoldM),
    cumulativeUnitsSoldM: String(fact.cumulativeUnitsSoldM),
    estimatedRevenueUsdM: String(fact.estimatedRevenueUsdM),
    confidenceScore: String(fact.confidenceScore)
  }))).onConflictDoNothing();
  await db.insert(schema.gameEnrichment).values(Object.values(rawGameEnrichment)).onConflictDoNothing();

  console.log(`imported ${games.length} games and ${derivedSalesFacts.length} derived facts.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
