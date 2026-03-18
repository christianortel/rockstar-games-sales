import { gameAssets } from "@/config/gameAssets";
import { gameThemes } from "@/config/gameThemes";
import {
  gameProfiles,
  games,
  methodologies,
  officialSalesEvents,
  platforms,
  regions,
  releases,
  sources
} from "@/data/normalized/seed";
import {
  DashboardGameRow,
  DerivedSalesFact,
  Game,
  Methodology,
  Platform,
  Region,
  Release,
  SourceRecord
} from "@/types/domain";

const lastVerifiedAt = "2026-03-17";

function getProfile(gameId: string) {
  return gameProfiles.find((profile) => profile.gameId === gameId);
}

function buildDerivedSalesFacts(): DerivedSalesFact[] {
  const rows: DerivedSalesFact[] = [];

  for (const game of games) {
    const profile = getProfile(game.id);
    if (!profile) continue;

    const years = Array.from(
      { length: new Date(lastVerifiedAt).getFullYear() - game.releaseYear + 1 },
      (_, index) => game.releaseYear + index
    );
    const normalizedWeights =
      profile.yearlyWeights.length >= years.length
        ? profile.yearlyWeights.slice(0, years.length)
        : [...profile.yearlyWeights, ...Array.from({ length: years.length - profile.yearlyWeights.length }, () => 0)];
    const weightTotal = normalizedWeights.reduce((sum, value) => sum + value, 0);
    const totalUnits = game.estimatedLifetimeUnitsM;

    for (const [platformId, platformShare] of Object.entries(profile.platformShares)) {
      for (const [regionId, regionShare] of Object.entries(profile.regionShares)) {
        let cumulative = 0;

        years.forEach((year, index) => {
          const yearlyWeight = weightTotal > 0 ? normalizedWeights[index] / weightTotal : 0;
          const units = totalUnits * platformShare * regionShare * yearlyWeight;
          cumulative += units;

          rows.push({
            id: `${game.id}-${platformId}-${regionId}-${year}`,
            gameId: game.id,
            platformId,
            regionId,
            year,
            estimatedUnitsSoldM: Number(units.toFixed(4)),
            cumulativeUnitsSoldM: Number(cumulative.toFixed(4)),
            estimatedRevenueUsdM: Number((units * game.averageSellingPriceUsd).toFixed(3)),
            confidenceScore: Number(
              (
                profile.confidenceBase *
                (game.confirmedLifetimeUnitsM ? 1 : 0.82) *
                (year < 2010 ? 0.95 : 1)
              ).toFixed(2)
            ),
            methodologyId: game.methodologyId,
            sourceIds: game.confirmedLifetimeUnitsM
              ? ["ttwo-investor-feb-2026", "manual-model-v1"]
              : ["manual-model-v1", "mobygames-catalog"],
            isModeled: !game.confirmedLifetimeUnitsM,
            lastVerifiedAt
          });
        });
      }
    }
  }

  return rows;
}

export const derivedSalesFacts = buildDerivedSalesFacts();

const dashboardRowsCache: DashboardGameRow[] = games.map((game) => {
  const facts = getFactsForGame(game.id);
  const confidence =
    facts.reduce((sum, item) => sum + item.confidenceScore, 0) / Math.max(facts.length, 1);

  return {
    game,
    estimatedUnitsM: game.estimatedLifetimeUnitsM,
    confirmedUnitsM: game.confirmedLifetimeUnitsM,
    blendedUnitsM: game.confirmedLifetimeUnitsM ?? game.estimatedLifetimeUnitsM,
    estimatedRevenueUsdM: Number((game.estimatedLifetimeUnitsM * game.averageSellingPriceUsd).toFixed(1)),
    platforms: getPlatformsForGame(game.id),
    confidence: Number(confidence.toFixed(2))
  };
});

function rowsByCoverage(coverage: Game["analyticsCoverage"][]) {
  return dashboardRowsCache.filter((row) => coverage.includes(row.game.analyticsCoverage));
}

export function getAllGames() {
  return games;
}

export function getGameBySlug(slug: string) {
  return games.find((game) => game.slug === slug);
}

export function getGameById(gameId: string) {
  return games.find((game) => game.id === gameId);
}

export function getPlatformsForGame(gameId: string): Platform[] {
  const ids = releases.filter((release) => release.gameId === gameId).map((release) => release.platformId);
  return platforms.filter((platform) => ids.includes(platform.id));
}

export function getReleasesForGame(gameId: string) {
  return releases
    .filter((release) => release.gameId === gameId)
    .sort((a, b) => new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime());
}

export function getAllReleases(): Release[] {
  return releases.slice().sort((a, b) => new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime());
}

export function getFactsForGame(gameId: string) {
  return derivedSalesFacts.filter((fact) => fact.gameId === gameId);
}

export function getThemeForGame(gameId: string) {
  const game = getGameById(gameId);
  return game ? gameThemes[game.themeKey] : gameThemes.heist_gold;
}

export function getAssetForGame(gameId: string) {
  return gameAssets[gameId];
}

export function getMethodology(methodologyId: string) {
  return methodologies.find((item) => item.id === methodologyId);
}

export function getAllMethodologies(): Methodology[] {
  return methodologies;
}

export function getSourceRecords(sourceIds?: string[]) {
  return sourceIds?.length ? sources.filter((source) => sourceIds.includes(source.id)) : sources;
}

export function getAllSources(): SourceRecord[] {
  return sources;
}

export function getOfficialEventsForGame(gameId: string) {
  return officialSalesEvents.filter((event) => event.gameId === gameId);
}

export function getOfficialEventsForFranchise(franchise: string) {
  return officialSalesEvents.filter((event) => event.franchise === franchise);
}

export function getSourceIdsForGame(gameId: string) {
  const factSourceIds = getFactsForGame(gameId).flatMap((fact) => fact.sourceIds);
  const eventSourceIds = getOfficialEventsForGame(gameId).map((event) => event.sourceId);

  return Array.from(new Set([...factSourceIds, ...eventSourceIds]));
}

export function getDashboardRows(): DashboardGameRow[] {
  return dashboardRowsCache;
}

export function getAnalyticsDashboardRows() {
  return rowsByCoverage(["featured", "supported"]);
}

export function getFeaturedDashboardRows() {
  return rowsByCoverage(["featured"]);
}

export function getFranchiseNames() {
  return Array.from(new Set(games.map((game) => game.franchise))).sort();
}

export function getGameKindOptions() {
  return Array.from(new Set(games.map((game) => game.kind))).sort();
}

export function getRegionOptions(): Region[] {
  return regions;
}

export function getPlatformOptions() {
  return platforms;
}

export function getPlatformFamilyOptions() {
  return Array.from(new Set(platforms.map((platform) => platform.family))).sort();
}

export function getGenerationOptions() {
  return Array.from(new Set(platforms.map((platform) => platform.generation)));
}

export function getRockstarRoleOptions() {
  return Array.from(new Set(games.map((game) => game.rockstarRole))).sort();
}

export function getStatusOptions() {
  return Array.from(new Set(games.map((game) => game.status))).sort();
}

export function getYearBounds() {
  return {
    min: Math.min(...games.map((game) => game.releaseYear)),
    max: new Date(lastVerifiedAt).getFullYear()
  };
}

export function getLastVerifiedAt() {
  return lastVerifiedAt;
}

export function getUniverseSummary() {
  const dashboardRows = getAnalyticsDashboardRows();
  const totalTrackedLifetimeUnits = dashboardRows.reduce((sum, row) => sum + row.blendedUnitsM, 0);
  const totalEstimatedRevenue = dashboardRows.reduce((sum, row) => sum + row.estimatedRevenueUsdM, 0);
  const totalPlatformsTracked = platforms.length;
  const bestSellingTitle = dashboardRows.slice().sort((a, b) => b.blendedUnitsM - a.blendedUnitsM)[0];
  const franchiseTotals = Object.entries(
    dashboardRows.reduce<Record<string, number>>((acc, row) => {
      acc[row.game.franchise] = (acc[row.game.franchise] ?? 0) + row.blendedUnitsM;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]);

  return {
    totalTrackedLifetimeUnits: Number(totalTrackedLifetimeUnits.toFixed(1)),
    totalEstimatedRevenue: Number(totalEstimatedRevenue.toFixed(0)),
    totalGamesTracked: games.length,
    totalPlatformsTracked,
    bestSellingTitle: bestSellingTitle.game.title,
    bestSellingFranchise: franchiseTotals[0]?.[0] ?? "Grand Theft Auto"
  };
}
