import {
  getDashboardRows,
  getFactsForGame,
  getPlatformOptions,
  getRegionOptions,
  getReleasesForGame
} from "@/lib/data/repository";
import {
  aggregateByPlatform,
  aggregateByRegion,
  averageConfidence,
  latestCumulativeByYear
} from "@/lib/metrics/aggregations";
import { DataMode, DashboardGameRow, FilterState } from "@/types/domain";

const platformMap = new Map(getPlatformOptions().map((platform) => [platform.id, platform]));
const regionMap = new Map(getRegionOptions().map((region) => [region.id, region]));

function filterFacts(
  gameIds: string[],
  filters?: Partial<Pick<FilterState, "platform" | "family" | "region" | "generation">>
) {
  return gameIds.flatMap((gameId) => {
    const facts = getFactsForGame(gameId);

    return facts.filter((fact) => {
      const platform = platformMap.get(fact.platformId);
      const matchesPlatform = !filters?.platform || filters.platform === "all" || fact.platformId === filters.platform;
      const matchesFamily = !filters?.family || filters.family === "all" || platform?.family === filters.family;
      const matchesRegion = !filters?.region || filters.region === "all" || fact.regionId === filters.region;
      const matchesGeneration =
        !filters?.generation ||
        filters.generation === "all" ||
        platform?.generation === filters.generation;

      return matchesPlatform && matchesFamily && matchesRegion && matchesGeneration;
    });
  });
}

export function buildAnnualTrendForRows(rows: DashboardGameRow[], dataMode: DataMode, filters?: Partial<FilterState>) {
  const confirmedIds = new Set(rows.filter((row) => row.confirmedUnitsM).map((row) => row.game.id));
  const facts = filterFacts(
    rows
      .filter((row) => dataMode !== "confirmed" || row.confirmedUnitsM)
      .map((row) => row.game.id),
    filters
  );

  const grouped = new Map<number, number>();
  for (const fact of facts) {
    if (dataMode === "confirmed" && !confirmedIds.has(fact.gameId)) continue;
    grouped.set(fact.year, (grouped.get(fact.year) ?? 0) + fact.estimatedUnitsSoldM);
  }

  let cumulative = 0;
  return Array.from(grouped.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([year, annualUnitsM]) => {
      cumulative += annualUnitsM;
      return {
        year,
        annualUnitsM: Number(annualUnitsM.toFixed(2)),
        cumulativeUnitsM: Number(cumulative.toFixed(2))
      };
    });
}

export function buildRegionBreakdownForRows(rows: DashboardGameRow[], dataMode: DataMode, filters?: Partial<FilterState>) {
  const gameIds = rows
    .filter((row) => dataMode !== "confirmed" || row.confirmedUnitsM)
    .map((row) => row.game.id);
  const grouped = aggregateByRegion(filterFacts(gameIds, filters));

  return Array.from(grouped.entries()).map(([regionId, value]) => ({
    name: regionMap.get(regionId)?.name ?? regionId,
    value: Number(value.toFixed(2))
  }));
}

export function buildPlatformMixTimeline(rows: DashboardGameRow[], dataMode: DataMode, filters?: Partial<FilterState>) {
  const gameIds = rows
    .filter((row) => dataMode !== "confirmed" || row.confirmedUnitsM)
    .map((row) => row.game.id);
  const facts = filterFacts(gameIds, filters);
  const timeline = new Map<number, Record<string, number | string>>();

  for (const fact of facts) {
    const yearBucket = timeline.get(fact.year) ?? { year: fact.year };
    const platformName = platformMap.get(fact.platformId)?.name ?? fact.platformId;
    yearBucket[platformName] = Number((((yearBucket[platformName] as number) ?? 0) + fact.estimatedUnitsSoldM).toFixed(2));
    timeline.set(fact.year, yearBucket);
  }

  return Array.from(timeline.values()).sort((a, b) => Number(a.year) - Number(b.year));
}

export function buildGenerationBreakdown(rows: DashboardGameRow[], dataMode: DataMode, filters?: Partial<FilterState>) {
  const gameIds = rows
    .filter((row) => dataMode !== "confirmed" || row.confirmedUnitsM)
    .map((row) => row.game.id);
  const facts = filterFacts(gameIds, filters);
  const grouped = new Map<string, number>();

  facts.forEach((fact) => {
    const generation = platformMap.get(fact.platformId)?.generation ?? "unknown";
    grouped.set(generation, (grouped.get(generation) ?? 0) + fact.estimatedUnitsSoldM);
  });

  return Array.from(grouped.entries())
    .map(([name, value]) => ({ name: name.toUpperCase(), value: Number(value.toFixed(2)) }))
    .sort((a, b) => b.value - a.value);
}

export function buildFranchiseBreakdown(rows: DashboardGameRow[], dataMode: DataMode) {
  const grouped = rows.reduce<Record<string, number>>((acc, row) => {
    const value =
      dataMode === "confirmed"
        ? row.confirmedUnitsM ?? 0
        : dataMode === "estimated"
          ? row.estimatedUnitsM
          : row.blendedUnitsM;
    acc[row.game.franchise] = (acc[row.game.franchise] ?? 0) + value;
    return acc;
  }, {});

  return Object.entries(grouped)
    .map(([name, value]) => ({ name, value: Number(value.toFixed(1)) }))
    .sort((a, b) => b.value - a.value);
}

export function buildTopTitleData(rows: DashboardGameRow[], dataMode: DataMode, metricMode: "units" | "revenue" = "units") {
  return rows
    .map((row) => {
      const unitValue =
        dataMode === "confirmed"
          ? row.confirmedUnitsM ?? 0
          : dataMode === "estimated"
            ? row.estimatedUnitsM
            : row.blendedUnitsM;
      const value = metricMode === "revenue" ? row.estimatedRevenueUsdM : unitValue;

      return {
        name: row.game.title.replace("Grand Theft Auto: ", "").replace("Red Dead ", "RD ").replace("Redemption", "RDR"),
        value: Number(value.toFixed(1))
      };
    })
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);
}

export function buildGamePlatformBreakdown(gameId: string) {
  const facts = getFactsForGame(gameId);
  const total = facts.reduce((sum, fact) => sum + fact.estimatedUnitsSoldM, 0);
  const grouped = aggregateByPlatform(facts);

  return Array.from(grouped.entries())
    .map(([platformId, value]) => {
      const platform = platformMap.get(platformId);
      const release = getReleasesForGame(gameId).find((item) => item.platformId === platformId);
      const confidence = averageConfidence(facts.filter((fact) => fact.platformId === platformId));

      return {
        platform,
        units: Number(value.toFixed(2)),
        share: total ? value / total : 0,
        confidence,
        releaseDate: release?.releaseDate,
        releaseDatePrecision: release?.releaseDatePrecision
      };
    })
    .filter((item) => item.platform)
    .sort((a, b) => b.units - a.units);
}

export function buildGameRegionBreakdown(gameId: string) {
  const grouped = aggregateByRegion(getFactsForGame(gameId));

  return Array.from(grouped.entries()).map(([regionId, value]) => ({
    name: regionMap.get(regionId)?.name ?? regionId,
    value: Number(value.toFixed(2))
  }));
}

export function buildGameTrend(gameId: string) {
  return latestCumulativeByYear(getFactsForGame(gameId));
}

export function buildComparisonTrend(gameIds: string[]) {
  const perGame = gameIds.map((gameId) => {
    const row = getDashboardRows().find((item) => item.game.id === gameId);
    return {
      gameId,
      label: row?.game.title ?? gameId,
      trend: buildGameTrend(gameId)
    };
  });

  const yearSet = new Set<number>();
  perGame.forEach((item) => item.trend.forEach((point) => yearSet.add(point.year)));

  return Array.from(yearSet)
    .sort((a, b) => a - b)
    .map((year) => {
      const row: Record<string, string | number> = { year };
      perGame.forEach((item) => {
        const point = item.trend.find((trendPoint) => trendPoint.year === year);
        row[item.label] = point?.cumulativeUnitsM ?? 0;
      });
      return row;
    });
}

export function buildReleaseTimeline(gameId: string) {
  return getReleasesForGame(gameId).map((release) => ({
    date: release.releaseDate,
    precision: release.releaseDatePrecision ?? "day",
    label: platformMap.get(release.platformId)?.name ?? release.platformId,
    notes: release.notes,
    remaster: release.remaster
  }));
}
