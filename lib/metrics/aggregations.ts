import { DashboardGameRow, DataMode, DerivedSalesFact, FilterState, MetricMode } from "@/types/domain";

import { formatMillions } from "@/lib/formatters";

export function resolveUnits(row: DashboardGameRow, dataMode: DataMode) {
  if (dataMode === "confirmed") return row.confirmedUnitsM ?? 0;
  if (dataMode === "estimated") return row.estimatedUnitsM;
  return row.blendedUnitsM;
}

export function resolveMetricValue(row: DashboardGameRow, metricMode: MetricMode, dataMode: DataMode) {
  return metricMode === "revenue" ? row.estimatedRevenueUsdM : resolveUnits(row, dataMode);
}

export function filterDashboardRows(rows: DashboardGameRow[], filters: FilterState) {
  return rows.filter((row) => {
    const matchesFranchise = filters.franchise === "all" || row.game.franchise === filters.franchise;
    const matchesKind = filters.kind === "all" || row.game.kind === filters.kind;
    const matchesRole = filters.role === "all" || row.game.rockstarRole === filters.role;
    const matchesStatus = filters.status === "all" || row.game.status === filters.status;
    const matchesCoverage =
      filters.coverage === "all" ||
      (filters.coverage === "analytics" ? row.game.analyticsCoverage !== "catalog_only" : row.game.analyticsCoverage === "catalog_only");
    const matchesSearch =
      !filters.search ||
      row.game.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      row.game.franchise.toLowerCase().includes(filters.search.toLowerCase());
    const matchesYear = row.game.releaseYear >= filters.yearStart && row.game.releaseYear <= filters.yearEnd;
    const matchesPlatform =
      filters.platform === "all" || row.platforms.some((platform) => platform.id === filters.platform);
    const matchesFamily = filters.family === "all" || row.platforms.some((platform) => platform.family === filters.family);
    const matchesGeneration =
      filters.generation === "all" || row.platforms.some((platform) => platform.generation === filters.generation);

    return (
      matchesFranchise &&
      matchesKind &&
      matchesRole &&
      matchesStatus &&
      matchesCoverage &&
      matchesSearch &&
      matchesYear &&
      matchesPlatform &&
      matchesFamily &&
      matchesGeneration
    );
  });
}

export function latestCumulativeByYear(facts: DerivedSalesFact[]) {
  const grouped = new Map<number, number>();

  for (const fact of facts) {
    grouped.set(fact.year, (grouped.get(fact.year) ?? 0) + fact.estimatedUnitsSoldM);
  }

  const entries = Array.from(grouped.entries()).sort((a, b) => a[0] - b[0]);
  let cumulative = 0;

  return entries.map(([year, value]) => {
    cumulative += value;
    return { year, annualUnitsM: Number(value.toFixed(2)), cumulativeUnitsM: Number(cumulative.toFixed(2)) };
  });
}

export function aggregateByPlatform(facts: DerivedSalesFact[]) {
  const grouped = new Map<string, number>();
  for (const fact of facts) {
    grouped.set(fact.platformId, (grouped.get(fact.platformId) ?? 0) + fact.estimatedUnitsSoldM);
  }
  return grouped;
}

export function aggregateByRegion(facts: DerivedSalesFact[]) {
  const grouped = new Map<string, number>();
  for (const fact of facts) {
    grouped.set(fact.regionId, (grouped.get(fact.regionId) ?? 0) + fact.estimatedUnitsSoldM);
  }
  return grouped;
}

export function averageConfidence(facts: DerivedSalesFact[]) {
  if (!facts.length) return 0;
  return Number((facts.reduce((sum, fact) => sum + fact.confidenceScore, 0) / facts.length).toFixed(2));
}

export function buildInsights(rows: DashboardGameRow[]) {
  if (!rows.length) return [];

  const bestSeller = rows.slice().sort((a, b) => b.blendedUnitsM - a.blendedUnitsM)[0];
  const gtaRows = rows.filter((row) => row.game.franchise === "Grand Theft Auto");
  const rdr2 = rows.find((row) => row.game.id === "red_dead_redemption_2");
  const olderPcLean = rows
    .filter((row) => row.game.releaseYear < 2010)
    .every((row) => row.platforms.some((platform) => platform.id === "pc"));

  return [
    `${bestSeller.game.title} is the clear commercial anchor, leading the tracked catalog with ${formatMillions(bestSeller.blendedUnitsM, 1)} blended lifetime units.`,
    `Grand Theft Auto titles account for ${formatMillions(gtaRows.reduce((sum, row) => sum + row.blendedUnitsM, 0), 1)} tracked units, keeping the franchise structurally dominant across the universe.`,
    rdr2
      ? "Red Dead Redemption 2 carries a stronger premium-console concentration than Rockstar's older catalog, reflecting its PS4 and Xbox One launch balance before PC joined the stack."
      : "Rockstar's western catalog remains more console-heavy than its urban crime titles.",
    olderPcLean
      ? "Older Rockstar releases show thinner PC representation than modern launches, with PC often arriving later as a secondary commercial wave."
      : "PC remains additive, not primary, across most tracked Rockstar releases."
  ];
}
