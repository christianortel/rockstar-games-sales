"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { startTransition, useDeferredValue, useMemo, useTransition } from "react";
import { BarChart3, Compass, Layers3, ShieldCheck, Sparkles, Swords, WalletCards } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  chartFormatterForMetric
} from "@/components/charts/overview-charts";
import { ChartLoadingCard } from "@/components/charts/chart-loading-card";
import { StatCard } from "@/components/cards/stat-card";
import { DashboardFilterBar } from "@/components/dashboard/filter-bar";
import { RankingTable } from "@/components/dashboard/ranking-table";
import { SceneBackdrop } from "@/components/layout/scene-backdrop";
import { DataBadge } from "@/components/ui/data-badge";
import { ProvenanceDrawer } from "@/components/ui/provenance-drawer";
import { SectionShell } from "@/components/ui/section-shell";
import {
  getAllMethodologies,
  getAllSources,
  getAssetForGame,
  getDashboardRows,
  getFranchiseNames,
  getGameKindOptions,
  getGenerationOptions,
  getLastVerifiedAt,
  getPlatformFamilyOptions,
  getPlatformOptions,
  getRegionOptions,
  getRockstarRoleOptions,
  getStatusOptions,
  getThemeForGame,
  getYearBounds
} from "@/lib/data/repository";
import { formatCurrencyMillions, formatMillions } from "@/lib/formatters";
import { filterDashboardRows, resolveMetricValue } from "@/lib/metrics/aggregations";
import { buildDashboardInsights } from "@/lib/metrics/insights";
import {
  buildAnnualTrendForRows,
  buildFranchiseBreakdown,
  buildGenerationBreakdown,
  buildPlatformMixTimeline,
  buildRegionBreakdownForRows,
  buildTopTitleData
} from "@/lib/metrics/presenters";
import { parseDashboardFilters, updateDashboardSearchParams } from "@/lib/url-state";
import { FilterState } from "@/types/domain";

const dashboardRows = getDashboardRows();
const franchiseOptions = getFranchiseNames();
const gameKindOptions = getGameKindOptions();
const platformOptions = getPlatformOptions();
const platformFamilyOptions = getPlatformFamilyOptions();
const regionOptions = getRegionOptions();
const generationOptions = getGenerationOptions();
const rockstarRoleOptions = getRockstarRoleOptions();
const statusOptions = getStatusOptions();
const yearBounds = getYearBounds();
const methodologies = getAllMethodologies();
const sources = getAllSources();
const TopTitlesChart = dynamic(() => import("@/components/charts/overview-charts").then((mod) => mod.TopTitlesChart), {
  loading: () => <ChartLoadingCard subtitle="Preparing the ranking view." title="Top Titles" />,
  ssr: false
});
const FranchiseChart = dynamic(() => import("@/components/charts/overview-charts").then((mod) => mod.FranchiseChart), {
  loading: () => <ChartLoadingCard subtitle="Preparing the franchise view." title="Franchise Performance" />,
  ssr: false
});
const TrendChart = dynamic(() => import("@/components/charts/overview-charts").then((mod) => mod.TrendChart), {
  loading: () => <ChartLoadingCard subtitle="Preparing the timeline view." title="Sales Over Time" />,
  ssr: false
});
const PlatformMixChart = dynamic(() => import("@/components/charts/overview-charts").then((mod) => mod.PlatformMixChart), {
  loading: () => <ChartLoadingCard subtitle="Preparing the hardware mix." title="Platform Mix" />,
  ssr: false
});
const RegionDonutChart = dynamic(() => import("@/components/charts/overview-charts").then((mod) => mod.RegionDonutChart), {
  loading: () => <ChartLoadingCard subtitle="Preparing the regional split." title="Regional Mix" />,
  ssr: false
});

export function DashboardClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startUiTransition] = useTransition();

  const filters = useMemo(() => parseDashboardFilters(searchParams, yearBounds), [searchParams]);
  const deferredSearch = useDeferredValue(filters.search);
  const effectiveFilters = useMemo<FilterState>(() => ({ ...filters, search: deferredSearch }), [deferredSearch, filters]);

  const filteredRows = useMemo(() => filterDashboardRows(dashboardRows, effectiveFilters), [effectiveFilters]);
  const scopedRows = useMemo(
    () => (filters.dataMode === "confirmed" ? filteredRows.filter((row) => row.confirmedUnitsM) : filteredRows),
    [filteredRows, filters.dataMode]
  );

  const sortedRows = useMemo(
    () =>
      scopedRows
        .slice()
        .sort((a, b) => resolveMetricValue(b, filters.metricMode, filters.dataMode) - resolveMetricValue(a, filters.metricMode, filters.dataMode)),
    [filters.dataMode, filters.metricMode, scopedRows]
  );

  const leadRow = sortedRows[0] ?? dashboardRows[0];
  const backdropAsset = leadRow ? getAssetForGame(leadRow.game.id) : undefined;
  const backdropTheme = leadRow ? getThemeForGame(leadRow.game.id) : getThemeForGame("gta_v");
  const chartFormatter = chartFormatterForMetric(filters.metricMode);

  const totalMetricValue = sortedRows.reduce((sum, row) => sum + resolveMetricValue(row, filters.metricMode, filters.dataMode), 0);
  const franchiseCount = new Set(sortedRows.map((row) => row.game.franchise)).size;
  const averageConfidence =
    sortedRows.reduce((sum, row) => sum + row.confidence, 0) / Math.max(sortedRows.length, 1);

  const franchiseData =
    filters.metricMode === "revenue"
      ? Object.entries(
          sortedRows.reduce<Record<string, number>>((acc, row) => {
            acc[row.game.franchise] = (acc[row.game.franchise] ?? 0) + row.estimatedRevenueUsdM;
            return acc;
          }, {})
        ).map(([name, value]) => ({ name, value: Number(value.toFixed(1)) }))
      : buildFranchiseBreakdown(sortedRows, filters.dataMode);

  const annualTrend = buildAnnualTrendForRows(sortedRows, filters.dataMode, effectiveFilters);
  const regionBreakdown = buildRegionBreakdownForRows(sortedRows, filters.dataMode, effectiveFilters);
  const platformMix = buildPlatformMixTimeline(sortedRows, filters.dataMode, effectiveFilters);
  const generationBreakdown = buildGenerationBreakdown(sortedRows, filters.dataMode, effectiveFilters);
  const topTitleData = buildTopTitleData(sortedRows, filters.dataMode, filters.metricMode);
  const insights = buildDashboardInsights({
    rows: sortedRows,
    filters: effectiveFilters,
    metricMode: filters.metricMode,
    dataMode: filters.dataMode
  });
  const activeScopeChips = useMemo(() => {
    const chips: string[] = [];
    if (filters.search) chips.push(`Search: ${filters.search}`);
    if (filters.franchise !== "all") chips.push(filters.franchise);
    if (filters.platform !== "all") chips.push(`Platform: ${platformOptions.find((item) => item.id === filters.platform)?.name ?? filters.platform}`);
    if (filters.family !== "all") chips.push(`Family: ${filters.family}`);
    if (filters.generation !== "all") chips.push(`Generation: ${filters.generation.toUpperCase()}`);
    if (filters.kind !== "all") chips.push(`Type: ${filters.kind.replace(/_/g, " ")}`);
    if (filters.role !== "all") chips.push(`Role: ${filters.role.replace(/_/g, " ")}`);
    if (filters.status !== "all") chips.push(`Status: ${filters.status}`);
    if (filters.yearStart !== yearBounds.min || filters.yearEnd !== yearBounds.max) chips.push(`Years: ${filters.yearStart}-${filters.yearEnd}`);
    chips.push(`Coverage: ${filters.coverage.replace(/_/g, " ")}`);
    chips.push(`Mode: ${filters.dataMode}`);
    chips.push(`Metric: ${filters.metricMode}`);
    return chips;
  }, [filters]);

  const commitFilters = (patch: Partial<FilterState>) => {
    startUiTransition(() => {
      startTransition(() => {
        const next = updateDashboardSearchParams(new URLSearchParams(searchParams.toString()), patch, yearBounds);
        const query = next.toString();
        router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
      });
    });
  };

  const resetFilters = () => {
    startUiTransition(() => router.replace(pathname, { scroll: false }));
  };

  const metricFormatter = filters.metricMode === "revenue" ? formatCurrencyMillions : formatMillions;

  return (
    <div className="space-y-8">
      <SceneBackdrop
        backgroundPosition={backdropAsset?.backgroundPosition}
        image={backdropAsset?.backgroundImage}
        sceneKey={`${leadRow?.game.id}-${filters.metricMode}-${filters.dataMode}`}
        theme={backdropTheme}
      />

      <section
        className="grid gap-5 rounded-[2.4rem] border border-white/10 bg-black/25 p-6 shadow-panel backdrop-blur-xl xl:grid-cols-[1.15fr,0.85fr]"
        style={{ borderColor: `${backdropTheme.accent}33`, boxShadow: `0 20px 80px rgba(0,0,0,0.35), 0 0 80px ${backdropTheme.cardGlow}` }}
      >
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-3">
            <DataBadge label={filters.dataMode} mode={filters.dataMode} />
            <span className="rounded-full border border-white/12 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-white/55">
              Metric {filters.metricMode}
            </span>
            <span className="rounded-full border border-white/12 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-white/55">
              Updated {getLastVerifiedAt()}
            </span>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.32em]" style={{ color: backdropTheme.accent }}>
              Catalog atlas
            </p>
            <h1 className="mt-3 max-w-[14ch] font-display text-4xl uppercase tracking-[0.05em] text-white md:text-6xl">
              Read the full release map
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-white/68">
              Filter Rockstar's catalog by franchise, platform family, generation, release type, role, and data mode. The
              interface stays visual, but the source and confidence model remain visible at every level.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {leadRow ? (
              <Link
                className="rounded-full border border-white/14 bg-white/10 px-5 py-3 text-xs uppercase tracking-[0.26em] text-white transition hover:bg-white/15"
                href={`/game/${leadRow.game.slug}`}
              >
                Enter {leadRow.game.title}
              </Link>
            ) : null}
            <Link
              className="rounded-full border border-white/12 bg-black/25 px-5 py-3 text-xs uppercase tracking-[0.26em] text-white/78 transition hover:border-white/20 hover:text-white"
              href={`/compare?games=${sortedRows.slice(0, 2).map((row) => row.game.id).join(",")}`}
            >
              Build compare set
            </Link>
          </div>
        </div>

        <div className="rounded-[2rem] border bg-white/6 p-6" style={{ borderColor: `${backdropTheme.accent}44`, backgroundColor: `${backdropTheme.accent}10` }}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em]" style={{ color: backdropTheme.accent }}>
                Active spotlight
              </p>
              <h2 className="mt-2 font-display text-3xl uppercase tracking-[0.05em] text-white">
                {leadRow?.game.title ?? "No titles"}
              </h2>
            </div>
            <Sparkles className="h-5 w-5 text-white/45" />
          </div>
          <div className="relative mt-4 min-h-[180px] overflow-hidden rounded-[1.4rem] border border-white/10">
            <Image
              alt=""
              className="object-cover object-center opacity-85"
              fill
              sizes="(max-width: 1280px) 100vw, 40vw"
              src={backdropAsset?.heroImage ?? "/images/fallbacks/no-image.svg"}
            />
            <div className={`absolute inset-0 ${backdropTheme.overlayGradient}`} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4">
              <p className="text-[11px] uppercase tracking-[0.22em]" style={{ color: backdropTheme.accent }}>
                {backdropTheme.label}
              </p>
              <p className="mt-2 max-w-md text-sm leading-7 text-white/76">{leadRow?.game.universeStyle}</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-7 text-white/68">
            {leadRow?.game.longDescription ?? "No titles match the current filter stack."}
          </p>
          <div className="mt-5 space-y-3">
            {insights.map((insight) => (
              <div key={insight} className="rounded-[1.2rem] border border-white/8 bg-black/20 p-4 text-sm leading-7 text-white/70">
                {insight}
              </div>
            ))}
          </div>
          <div className="mt-5">
            <ProvenanceDrawer
              lastVerifiedAt={getLastVerifiedAt()}
              methodology={methodologies[0]}
              sources={sources}
              summary="Dashboard KPIs inherit the same trust stack: official Take-Two disclosures anchor title milestones, while platform, regional, and revenue detail are modeled and explicitly labeled."
            />
          </div>
        </div>
      </section>

      <DashboardFilterBar
        bounds={yearBounds}
        filters={filters}
        families={platformFamilyOptions}
        franchises={franchiseOptions}
        generations={generationOptions}
        kinds={gameKindOptions}
        onChange={commitFilters}
        onReset={resetFilters}
        pending={isPending}
        platforms={platformOptions}
        regions={regionOptions}
        roles={rockstarRoleOptions}
        statuses={statusOptions}
      />

      <section className="grid gap-4 rounded-[1.8rem] border border-white/10 bg-black/20 p-5 backdrop-blur-xl xl:grid-cols-[0.9fr,1.1fr]">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-white/45">Scope summary</p>
          <h2 className="mt-3 font-display text-3xl uppercase tracking-[0.05em] text-white">Current cut of the universe</h2>
          <p className="mt-3 text-sm leading-7 text-white/68">
            {sortedRows.length} titles, {franchiseCount} franchises, and {platformMix.length ? `${platformMix.length} timeline years` : "no timeline years"} are currently active under this stack.
          </p>
        </div>
        <div className="flex flex-wrap content-start gap-2">
          {activeScopeChips.map((chip) => (
            <span
              key={chip}
              className="rounded-full border border-white/10 bg-white/6 px-3 py-2 text-[11px] uppercase tracking-[0.2em] text-white/72"
            >
              {chip}
            </span>
          ))}
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          caption="Total under the active filter stack."
          detail={filters.metricMode === "revenue" ? "Revenue remains modeled." : "Units respect the active data mode."}
          formatter={metricFormatter}
          icon={<WalletCards className="h-4 w-4 text-white/40" />}
          label={filters.metricMode === "revenue" ? "Total Revenue" : "Total Units"}
          accent={backdropTheme.accent}
          value={totalMetricValue}
        />
        <StatCard
          caption="Visible titles after the active filters."
          detail="Confirmed mode narrows the scope to disclosed anchors."
          formatter={(value) => value.toFixed(0)}
          icon={<Layers3 className="h-4 w-4 text-white/40" />}
          label="Titles In Scope"
          accent={backdropTheme.accentStrong}
          value={sortedRows.length}
        />
        <StatCard
          caption="Distinct franchises represented."
          detail="Useful for judging catalog breadth under the current cut."
          formatter={(value) => value.toFixed(0)}
          icon={<Compass className="h-4 w-4 text-white/40" />}
          label="Franchises In Scope"
          accent={backdropTheme.accent}
          value={franchiseCount}
        />
        <StatCard
          caption="Average confidence across the visible slice."
          detail="Weighted from source trust, official coverage, and release-era distance."
          formatter={(value) => `${Math.round(value * 100)}%`}
          icon={<ShieldCheck className="h-4 w-4 text-white/40" />}
          label="Average Confidence"
          accent={backdropTheme.accentStrong}
          value={averageConfidence}
        />
      </div>

      <SectionShell
        accent={backdropTheme.accent}
        description="The dashboard keeps the metrics analytical while preserving a game-world presentation layer."
        eyebrow="Overview"
        title="Cross-title performance"
      >
        <div className="grid gap-5 xl:grid-cols-[1.15fr,0.85fr]">
          <TopTitlesChart accent={backdropTheme.accent} data={topTitleData} formatter={chartFormatter} />
          <FranchiseChart data={franchiseData} colors={backdropTheme.chartPalette} formatter={chartFormatter} />
          <TrendChart
            accent={backdropTheme.accent}
            data={annualTrend}
            formatter={chartFormatter}
            secondary={backdropTheme.accentStrong}
            subtitle="Annual velocity and cumulative climb for the filtered universe."
            title="Sales over time"
          />
          <PlatformMixChart colors={backdropTheme.chartPalette} data={platformMix} />
        </div>
      </SectionShell>

      <SectionShell
        accent={backdropTheme.accentStrong}
        description="Regional and hardware-generation cuts help reveal how Rockstar's catalog concentration changes by era."
        eyebrow="Mix analysis"
        title="Regions, generations, and standout patterns"
      >
        <div className="grid gap-5 xl:grid-cols-[0.8fr,1.2fr]">
          <RegionDonutChart colors={backdropTheme.chartPalette} data={regionBreakdown} />
          <div className="grid gap-5">
            <FranchiseChart data={generationBreakdown} colors={backdropTheme.chartPalette.slice().reverse()} formatter={formatMillions} />
            <div className="rounded-[1.7rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-5 w-5 text-white/45" />
                <div>
                  <p className="text-[11px] uppercase tracking-[0.28em] text-white/45">Insight engine</p>
                  <h3 className="mt-2 font-display text-2xl uppercase tracking-[0.05em] text-white">Contextual reads</h3>
                </div>
              </div>
              <div className="mt-5 grid gap-3">
                {insights.map((insight) => (
                  <div key={insight} className="rounded-[1.2rem] border border-white/8 bg-black/20 p-4 text-sm leading-7 text-white/68">
                    {insight}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </SectionShell>

      <SectionShell
        accent={backdropTheme.accent}
        description="The ranking table supports URL state and CSV export so the current cut of the catalog can be reviewed outside the app."
        eyebrow="Table"
        title="Searchable ranking view"
      >
        <RankingTable dataMode={filters.dataMode} metricMode={filters.metricMode} rows={sortedRows} />
      </SectionShell>

      <SectionShell
        accent={backdropTheme.accentStrong}
        description="Jump directly from the dashboard into a game world or a head-to-head comparison."
        eyebrow="Next moves"
        title="Continue the exploration"
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {sortedRows.slice(0, 3).map((row) => (
            <Link
              key={row.game.id}
              className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5 transition hover:border-white/18 hover:bg-white/8"
              href={`/game/${row.game.slug}`}
            >
              <p className="text-[11px] uppercase tracking-[0.28em] text-white/45">{row.game.franchise}</p>
              <h3 className="mt-3 font-display text-2xl uppercase tracking-[0.05em] text-white">{row.game.title}</h3>
              <p className="mt-3 text-sm leading-7 text-white/66">{row.game.headlineMetric}</p>
            </Link>
          ))}
        </div>
        <div className="mt-5">
          <Link
            className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-4 py-2 text-xs uppercase tracking-[0.24em] text-white/78 transition hover:border-white/20 hover:bg-white/10"
            href={`/compare?games=${sortedRows.slice(0, 3).map((row) => row.game.id).join(",")}`}
          >
            <Swords className="h-4 w-4" />
            Compare current leaders
          </Link>
        </div>
      </SectionShell>
    </div>
  );
}
