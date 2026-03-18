import { DashboardGameRow, DataMode, FilterState, MetricMode } from "@/types/domain";

import { formatCurrencyMillions, formatMillions } from "@/lib/formatters";
import { resolveMetricValue } from "@/lib/metrics/aggregations";
import { buildGamePlatformBreakdown, buildGameRegionBreakdown, buildReleaseTimeline } from "@/lib/metrics/presenters";

export function buildDashboardInsights({
  rows,
  filters,
  metricMode,
  dataMode
}: {
  rows: DashboardGameRow[];
  filters: FilterState;
  metricMode: MetricMode;
  dataMode: DataMode;
}) {
  if (!rows.length) {
    return ["No titles match the current filter stack. Broaden the range or reset the selector."];
  }

  const sorted = rows
    .map((row) => ({ row, value: resolveMetricValue(row, metricMode, dataMode) }))
    .sort((a, b) => b.value - a.value);
  const leader = sorted[0];
  const trailingPlatforms = rows.filter((row) => row.platforms.length <= 3).length;
  const oldCatalogShare = rows.filter((row) => row.game.releaseYear < 2010).length;
  const formattedLeaderValue =
    metricMode === "revenue" ? formatCurrencyMillions(leader.value, 1) : formatMillions(leader.value, 1);

  return [
    `${leader.row.game.title} leads the current view at ${formattedLeaderValue}, even after applying the active filters.`,
    filters.platform !== "all"
      ? `${leader.row.game.title} remains the strongest fit for the selected ${filters.platform.toUpperCase()} slice, suggesting that platform still captures a disproportionate share of Rockstar demand.`
      : `${trailingPlatforms} of ${rows.length} visible titles launch on three or fewer platforms, reinforcing how concentrated Rockstar's historical platform strategy has been.`,
    oldCatalogShare > 0 && filters.yearEnd < 2015
      ? "Legacy-era Rockstar releases show heavier console concentration and thinner long-tail diversification than the HD-era tentpoles."
      : "Later Rockstar tentpoles compound over more years of re-release support, which is why the cumulative curves stay steep well past launch."
  ];
}

export function buildGameInsights(gameId: string, title: string) {
  const platformBreakdown = buildGamePlatformBreakdown(gameId);
  const regionBreakdown = buildGameRegionBreakdown(gameId).sort((a, b) => b.value - a.value);
  const releaseTimeline = buildReleaseTimeline(gameId);
  const leaderPlatform = platformBreakdown[0];
  const leaderRegion = regionBreakdown[0];
  const remasterCount = releaseTimeline.filter((item) => item.remaster).length;

  return [
    leaderPlatform
      ? `${leaderPlatform.platform?.name} is the primary volume driver for ${title}, contributing ${Math.round(leaderPlatform.share * 100)}% of modeled lifetime units.`
      : `${title} has no platform breakout in the current seed.`,
    leaderRegion
      ? `${leaderRegion.name} is the strongest regional cluster in the model, which is consistent with Rockstar's historical North America and Europe skew.`
      : "Regional coverage is incomplete for this title in the current seed.",
    remasterCount
      ? `${title} shows ${remasterCount} later-cycle remaster or enhanced releases, which helps explain the durability of its catalog tail.`
      : `${title} relies mostly on its original launch wave rather than later remaster-driven lifts.`
  ];
}

export function buildCompareInsights(rows: DashboardGameRow[]) {
  if (!rows.length) return [];
  const sorted = rows.slice().sort((a, b) => b.blendedUnitsM - a.blendedUnitsM);
  const widestPlatformSpread = rows.slice().sort((a, b) => b.platforms.length - a.platforms.length)[0];
  const newest = rows.slice().sort((a, b) => b.game.releaseYear - a.game.releaseYear)[0];

  return [
    `${sorted[0]?.game.title} is the volume leader in this matchup, with ${formatMillions(sorted[0]?.blendedUnitsM ?? 0, 1)} blended lifetime units.`,
    `${widestPlatformSpread?.game.title} is the most diversified across hardware in the current compare set, spanning ${widestPlatformSpread?.platforms.length} tracked platforms.`,
    `${newest?.game.title} is the newest release in the selection, so its sales curve is naturally compressed into fewer post-launch years.`
  ];
}
