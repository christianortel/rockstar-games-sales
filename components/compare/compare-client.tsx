"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { startTransition, useDeferredValue, useMemo, useState, useTransition } from "react";
import { Layers3, Search, ShieldCheck, Swords, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { ChartLoadingCard } from "@/components/charts/chart-loading-card";
import { SceneBackdrop } from "@/components/layout/scene-backdrop";
import { DataBadge } from "@/components/ui/data-badge";
import { ProvenanceDrawer } from "@/components/ui/provenance-drawer";
import { SectionShell } from "@/components/ui/section-shell";
import {
  getAllMethodologies,
  getAllSources,
  getAssetForGame,
  getDashboardRows,
  getSourceIdsForGame,
  getThemeForGame
} from "@/lib/data/repository";
import { formatCurrencyMillions, formatMillions, formatPercent } from "@/lib/formatters";
import { buildCompareInsights } from "@/lib/metrics/insights";
import { buildComparisonTrend, buildGamePlatformBreakdown, buildGameRegionBreakdown } from "@/lib/metrics/presenters";
import { getGamePoster, getPlatformAsset } from "@/lib/themes/asset-utils";
import { blendThemeKeys } from "@/lib/themes/theme-utils";
import { parseCompareGameIds, updateCompareGameIds } from "@/lib/url-state";
import { DashboardGameRow } from "@/types/domain";

const rows = getDashboardRows();
const rowMap = new Map(rows.map((row) => [row.game.id, row]));
const methodologies = getAllMethodologies();
const sources = getAllSources();
const ComparisonTrendChart = dynamic(
  () => import("@/components/charts/overview-charts").then((mod) => mod.ComparisonTrendChart),
  {
    loading: () => <ChartLoadingCard subtitle="Preparing the head-to-head overlay." title="Comparison Overlay" />,
    ssr: false
  }
);

export function CompareClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startUiTransition] = useTransition();
  const [libraryQuery, setLibraryQuery] = useState("");
  const [libraryFranchise, setLibraryFranchise] = useState("all");
  const [libraryKind, setLibraryKind] = useState("all");
  const [libraryCoverage, setLibraryCoverage] = useState<"all" | "featured" | "supported">("all");
  const deferredLibraryQuery = useDeferredValue(libraryQuery);

  const selectedIds = useMemo(() => parseCompareGameIds(searchParams, rows.map((row) => row.game.id)), [searchParams]);
  const selectedRows = useMemo(
    () => selectedIds.map((id) => rowMap.get(id)).filter((row): row is DashboardGameRow => Boolean(row)),
    [selectedIds]
  );
  const compareFranchises = useMemo(() => Array.from(new Set(rows.map((row) => row.game.franchise))).sort(), []);
  const compareKinds = useMemo(() => Array.from(new Set(rows.map((row) => row.game.kind))).sort(), []);
  const libraryRows = useMemo(
    () =>
      rows
        .filter((row) => {
          const query = deferredLibraryQuery.trim().toLowerCase();
          const matchesQuery =
            !query ||
            row.game.title.toLowerCase().includes(query) ||
            row.game.franchise.toLowerCase().includes(query);
          const matchesFranchise = libraryFranchise === "all" || row.game.franchise === libraryFranchise;
          const matchesKind = libraryKind === "all" || row.game.kind === libraryKind;
          const matchesCoverage =
            libraryCoverage === "all" ||
            (libraryCoverage === "featured"
              ? row.game.analyticsCoverage === "featured"
              : row.game.analyticsCoverage === "supported");

          return matchesQuery && matchesFranchise && matchesKind && matchesCoverage;
        })
        .sort((left, right) => {
          const leftSelected = selectedIds.includes(left.game.id) ? 1 : 0;
          const rightSelected = selectedIds.includes(right.game.id) ? 1 : 0;
          if (leftSelected !== rightSelected) return rightSelected - leftSelected;
          return right.blendedUnitsM - left.blendedUnitsM;
        }),
    [deferredLibraryQuery, libraryCoverage, libraryFranchise, libraryKind, selectedIds]
  );
  const primaryRow = selectedRows[0] ?? rows[0];
  const primaryAsset = primaryRow ? getAssetForGame(primaryRow.game.id) : undefined;
  const blendTheme = blendThemeKeys(selectedRows.map((row) => row.game.themeKey));
  const comparisonTrend = buildComparisonTrend(selectedIds);
  const insights = buildCompareInsights(selectedRows);
  const combinedUnits = selectedRows.reduce((sum, row) => sum + row.blendedUnitsM, 0);
  const averageConfidence = selectedRows.reduce((sum, row) => sum + row.confidence, 0) / Math.max(selectedRows.length, 1);

  const toggleGame = (gameId: string) => {
    const exists = selectedIds.includes(gameId);
    let nextIds = selectedIds.slice();

    if (exists && nextIds.length > 2) {
      nextIds = nextIds.filter((id) => id !== gameId);
    } else if (!exists && nextIds.length < 4) {
      nextIds = [...nextIds, gameId];
    } else if (!exists) {
      nextIds = [...nextIds.slice(1), gameId];
    }

    startUiTransition(() => {
      startTransition(() => {
        const next = updateCompareGameIds(new URLSearchParams(searchParams.toString()), nextIds);
        router.replace(`${pathname}?${next.toString()}`, { scroll: false });
      });
    });
  };

  const compareSourceIds = Array.from(new Set(selectedIds.flatMap((id) => getSourceIdsForGame(id))));
  const compareSources = sources.filter((source) => compareSourceIds.includes(source.id));

  return (
    <div className="space-y-8">
      <SceneBackdrop
        backgroundPosition={primaryAsset?.backgroundPosition}
        image={primaryAsset?.backgroundImage}
        sceneKey={selectedIds.join("-")}
        theme={blendTheme}
      />

      <section className="grid gap-5 rounded-[2.4rem] border border-white/10 bg-black/25 p-6 shadow-panel backdrop-blur-xl xl:grid-cols-[1.1fr,0.9fr]">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <DataBadge label="Blended compare" mode="blended" />
            <span className="rounded-full border border-white/12 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-white/55">
              2 to 4 games
            </span>
          </div>
          <p className="mt-4 text-[11px] uppercase tracking-[0.3em] text-white/45">Compare mode</p>
          <h1 className="mt-3 max-w-[14ch] font-display text-4xl uppercase tracking-[0.05em] text-white md:text-6xl">
            Compare Rockstar releases
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-white/68">
            Build a two-to-four title slate, then compare scale, platform spread, regional mix, and cumulative trajectory.
            The backdrop and roster styling respond to the selected lineup.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              className="rounded-full border border-white/12 bg-white/10 px-5 py-3 text-xs uppercase tracking-[0.26em] text-white transition hover:bg-white/15"
              href="/dashboard"
            >
              Return to dashboard
            </Link>
            <ProvenanceDrawer
              methodology={methodologies[0]}
              sources={compareSources}
              summary="Compare mode uses blended lifetime anchors per title, then layers modeled platform and regional splits so head-to-head structure remains honest and interpretable."
              triggerLabel="Inspect compare sources"
            />
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/6 p-6">
          <p className="text-[11px] uppercase tracking-[0.28em] text-white/45">Auto insights</p>
          <div className="mt-4 space-y-3">
            {insights.map((insight) => (
              <div key={insight} className="rounded-[1.2rem] border border-white/8 bg-black/20 p-4 text-sm leading-7 text-white/70">
                {insight}
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionShell
        description="Search the entire catalog, narrow by franchise or release type, and build a two-to-four game card from the full Rockstar library."
        eyebrow="Selection"
        title="Build the matchup"
      >
        <div className="mb-5 grid gap-4 rounded-[1.6rem] border border-white/10 bg-white/5 p-4 xl:grid-cols-[1.2fr,0.8fr]">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-white/45">Selected roster</p>
            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {selectedRows.map((row, index) => (
                <div key={row.game.id} className="rounded-[1.2rem] border border-white/10 bg-black/20 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="relative h-16 w-12 overflow-hidden rounded-lg border border-white/10 bg-black/30">
                        <Image alt={row.game.title} className="object-cover object-center" fill sizes="48px" src={getGamePoster(row.game.id)} unoptimized />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-white/42">Slot {index + 1}</p>
                        <p className="mt-1 truncate font-semibold text-white">{row.game.title}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.16em] text-white/45">{formatMillions(row.blendedUnitsM, 1)}</p>
                      </div>
                    </div>
                    <button
                      className="rounded-full border border-white/10 bg-white/5 p-2 text-white/58 transition hover:border-white/18 hover:text-white disabled:opacity-30"
                      disabled={selectedIds.length <= 2 || isPending}
                      onClick={() => toggleGame(row.game.id)}
                      type="button"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            <div className="rounded-[1.2rem] border border-white/10 bg-black/20 p-4">
              <p className="text-[11px] uppercase tracking-[0.22em] text-white/42">Combined units</p>
              <p className="mt-3 font-display text-3xl uppercase tracking-[0.04em] text-white">{formatMillions(combinedUnits, 1)}</p>
            </div>
            <div className="rounded-[1.2rem] border border-white/10 bg-black/20 p-4">
              <p className="text-[11px] uppercase tracking-[0.22em] text-white/42">Average confidence</p>
              <p className="mt-3 font-display text-3xl uppercase tracking-[0.04em] text-white">{Math.round(averageConfidence * 100)}%</p>
            </div>
            <div className="rounded-[1.2rem] border border-white/10 bg-black/20 p-4">
              <p className="text-[11px] uppercase tracking-[0.22em] text-white/42">Selection rule</p>
              <p className="mt-3 text-sm leading-7 text-white/68">Keep two to four games active. Adding a fifth rolls the oldest slot out.</p>
            </div>
          </div>
        </div>

        <div className="mb-5 grid gap-3 lg:grid-cols-[1.2fr,0.8fr,0.8fr,0.9fr]">
          <label className="space-y-2">
            <span className="text-[11px] uppercase tracking-[0.28em] text-white/45">Search library</span>
            <div className="flex items-center gap-3 rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3">
              <Search className="h-4 w-4 text-white/38" />
              <input
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/28"
                onChange={(event) => setLibraryQuery(event.target.value)}
                placeholder="Find a title, service, mission pack, or franchise"
                value={libraryQuery}
              />
            </div>
          </label>
          <label className="space-y-2">
            <span className="text-[11px] uppercase tracking-[0.28em] text-white/45">Franchise</span>
            <select
              className="w-full rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
              onChange={(event) => setLibraryFranchise(event.target.value)}
              value={libraryFranchise}
            >
              <option value="all">All franchises</option>
              {compareFranchises.map((franchise) => (
                <option key={franchise} value={franchise}>
                  {franchise}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2">
            <span className="text-[11px] uppercase tracking-[0.28em] text-white/45">Release type</span>
            <select
              className="w-full rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
              onChange={(event) => setLibraryKind(event.target.value)}
              value={libraryKind}
            >
              <option value="all">All release types</option>
              {compareKinds.map((kind) => (
                <option key={kind} value={kind}>
                  {kind.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </label>
          <div className="space-y-2">
            <span className="text-[11px] uppercase tracking-[0.28em] text-white/45">Coverage</span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "All", value: "all" },
                { label: "Featured", value: "featured" },
                { label: "Supported", value: "supported" }
              ].map((option) => (
                <button
                  key={option.value}
                  className={`rounded-[1rem] border px-3 py-3 text-[11px] uppercase tracking-[0.22em] transition ${
                    libraryCoverage === option.value
                      ? "border-white/22 bg-white/12 text-white"
                      : "border-white/10 bg-white/5 text-white/58 hover:border-white/16 hover:bg-white/8"
                  }`}
                  onClick={() => setLibraryCoverage(option.value as typeof libraryCoverage)}
                  type="button"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-white/62">
            Showing {libraryRows.length} of {rows.length} Rockstar releases. Selected titles stay pinned at the front.
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Full catalog", onClick: () => { setLibraryCoverage("all"); setLibraryKind("all"); setLibraryFranchise("all"); } },
              { label: "Mission packs", onClick: () => setLibraryKind("mission_pack") },
              { label: "Expansions", onClick: () => setLibraryKind("expansion") },
              { label: "Online", onClick: () => setLibraryKind("online_service") }
            ].map((action) => (
              <button
                key={action.label}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[11px] uppercase tracking-[0.22em] text-white/66 transition hover:border-white/18 hover:bg-white/8"
                onClick={action.onClick}
                type="button"
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {libraryRows.map((row) => {
            const active = selectedIds.includes(row.game.id);

            return (
              <button
                key={row.game.id}
                className={`rounded-[1.5rem] border p-4 text-left transition ${
                  active ? "border-white/22 bg-white/10" : "border-white/10 bg-white/5 hover:border-white/18 hover:bg-white/8"
                }`}
                disabled={isPending}
                onClick={() => toggleGame(row.game.id)}
                type="button"
              >
                <div className="relative mb-4 aspect-[3/4] overflow-hidden rounded-[1.1rem] border border-white/10 bg-black/35 shadow-[0_18px_45px_rgba(0,0,0,0.45)]">
                  <Image
                    alt={row.game.title}
                    className="object-contain object-center"
                    fill
                    sizes="(max-width: 768px) 70vw, (max-width: 1280px) 40vw, 16vw"
                    src={getGamePoster(row.game.id)}
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-white/45">{row.game.franchise}</p>
                  <span className="rounded-full border border-white/10 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-white/50">
                    {row.game.kind.replace(/_/g, " ")}
                  </span>
                </div>
                <h3 className="mt-3 font-display text-xl uppercase tracking-[0.04em] text-white">{row.game.title}</h3>
                <div className="mt-3 flex items-center justify-between gap-3 text-sm text-white/62">
                  <span>{formatMillions(row.blendedUnitsM)}</span>
                  <span>{Math.round(row.confidence * 100)}%</span>
                </div>
              </button>
            );
          })}
        </div>
      </SectionShell>

      <SectionShell
        description="Each tile captures lifetime units, revenue estimate, release era, platform breadth, and confidence."
        eyebrow="Selected games"
        title="Comparison hero tiles"
      >
        <div className="grid gap-4 xl:grid-cols-3">
          {selectedRows.map((row) => {
            const asset = getAssetForGame(row.game.id);
            const theme = getThemeForGame(row.game.id);
            const regions = buildGameRegionBreakdown(row.game.id).sort((a, b) => b.value - a.value);
            const platforms = buildGamePlatformBreakdown(row.game.id);
            const topPlatformAsset = platforms[0]?.platform ? getPlatformAsset(platforms[0].platform.id) : undefined;

            return (
              <article key={row.game.id} className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-panel">
                <div className="absolute inset-0">
                  <Image
                    alt=""
                    className="object-cover object-center opacity-40"
                    fill
                    sizes="(max-width: 1280px) 100vw, 33vw"
                    src={asset?.heroImage ?? "/images/fallbacks/no-image.svg"}
                  />
                  <div className={`absolute inset-0 ${theme.overlayGradient}`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                </div>
                <div className="relative">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-white/45">{row.game.franchise}</p>
                  <div className="mt-4 grid gap-4 md:grid-cols-[220px,1fr]">
                    <div className="relative aspect-[3/4] overflow-hidden rounded-[1.3rem] border border-white/10 bg-black/35 shadow-[0_18px_50px_rgba(0,0,0,0.45)]">
                      <Image
                        alt={row.game.title}
                        className="object-contain object-center"
                        fill
                        sizes="(max-width: 768px) 70vw, 220px"
                        src={getGamePoster(row.game.id)}
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />
                    </div>
                    <div>
                      <h3 className="font-display text-3xl uppercase tracking-[0.05em] text-white">{row.game.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-white/68">{row.game.shortDescription}</p>
                      <div className="mt-4 flex items-center gap-3">
                        {topPlatformAsset ? (
                          <div className="flex min-h-12 min-w-[132px] items-center overflow-hidden rounded-xl border border-white/10 bg-black/25 px-2.5 py-2">
                            {topPlatformAsset.badgeImage ? (
                              <div className="relative h-10 w-[118px]">
                                <Image alt={topPlatformAsset.label} className="object-contain object-left" fill sizes="118px" src={topPlatformAsset.badgeImage} unoptimized />
                              </div>
                            ) : (
                              <>
                                <div className="relative h-7 w-7 shrink-0 rounded-lg border border-white/10 bg-white/6">
                                  <Image
                                    alt={topPlatformAsset.label}
                                    className="object-contain object-center p-1.5 brightness-0 invert"
                                    fill
                                    sizes="28px"
                                    src={topPlatformAsset.image}
                                    unoptimized
                                  />
                                </div>
                                <span className="ml-2 font-display text-sm uppercase tracking-[0.14em] text-white">{topPlatformAsset.wordmark}</span>
                              </>
                            )}
                          </div>
                        ) : null}
                        <p className="text-xs uppercase tracking-[0.22em] text-white/55">Lead platform</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.22em] text-white/42">Units</p>
                      <p className="mt-2 font-display text-3xl uppercase tracking-[0.04em] text-white">{formatMillions(row.blendedUnitsM)}</p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.22em] text-white/42">Revenue</p>
                      <p className="mt-2 font-display text-3xl uppercase tracking-[0.04em] text-white">{formatCurrencyMillions(row.estimatedRevenueUsdM)}</p>
                    </div>
                  </div>
                  <div className="mt-5 grid gap-2 text-sm text-white/62">
                    <p>Released {row.game.releaseYear}</p>
                    <p>{row.platforms.length} tracked platforms</p>
                    <p>{Math.round(row.confidence * 100)}% confidence</p>
                    <p>Lead region: {regions[0]?.name ?? "n/a"}</p>
                    <p>Top platform: {platforms[0]?.platform?.name ?? "n/a"}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </SectionShell>

      <SectionShell
        description="Trajectory and structural comparisons are where the matchup becomes legible."
        eyebrow="Visual comparison"
        title="Sales curve and structure"
      >
        <div className="grid gap-5 xl:grid-cols-[1.2fr,0.8fr]">
          <ComparisonTrendChart colors={blendTheme.chartPalette} data={comparisonTrend} />
          <div className="grid gap-5">
            <div className="rounded-[1.7rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <Layers3 className="h-5 w-5 text-white/45" />
                <div>
                  <p className="text-[11px] uppercase tracking-[0.28em] text-white/45">Diversification</p>
                  <h3 className="mt-2 font-display text-2xl uppercase tracking-[0.05em] text-white">Platform breadth</h3>
                </div>
              </div>
              <div className="mt-5 space-y-4">
                {selectedRows.map((row) => {
                  const platformBreakdown = buildGamePlatformBreakdown(row.game.id);
                  const leader = platformBreakdown[0];

                  return (
                    <div key={row.game.id} className="rounded-[1.2rem] border border-white/8 bg-black/20 p-4">
                      <div className="flex items-center justify-between gap-4">
                        <p className="font-semibold text-white">{row.game.title}</p>
                        <span className="text-xs uppercase tracking-[0.22em] text-white/45">{row.platforms.length} platforms</span>
                      </div>
                      <p className="mt-2 text-sm leading-7 text-white/65">
                        {leader?.platform?.name ?? "n/a"} leads with {leader ? formatPercent(leader.share) : "0%"} of modeled lifetime units.
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[1.7rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-white/45" />
                <div>
                  <p className="text-[11px] uppercase tracking-[0.28em] text-white/45">Readout</p>
                  <h3 className="mt-2 font-display text-2xl uppercase tracking-[0.05em] text-white">Interpretation</h3>
                </div>
              </div>
              <div className="mt-5 space-y-3">
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
        description="Use compare mode as the jump point into individual game worlds."
        eyebrow="Drill down"
        title="Enter a selected universe"
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {selectedRows.map((row) => (
            <Link
              key={row.game.id}
              className="inline-flex items-center justify-between rounded-[1.4rem] border border-white/10 bg-white/5 p-4 text-sm text-white/76 transition hover:border-white/18 hover:bg-white/8"
              href={`/game/${row.game.slug}`}
            >
              <span>{row.game.title}</span>
              <Swords className="h-4 w-4" />
            </Link>
          ))}
        </div>
      </SectionShell>
    </div>
  );
}
