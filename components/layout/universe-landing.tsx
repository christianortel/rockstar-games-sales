"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Compass, Database, Search, ShieldCheck, Sparkles, Swords, WalletCards } from "lucide-react";
import { useDeferredValue, useMemo, useState } from "react";

import { CatalogIndexCard } from "@/components/cards/catalog-index-card";
import { GameUniverseCard } from "@/components/cards/game-universe-card";
import { GtaSixForecast } from "@/components/layout/gta-six-forecast";
import { ReleaseRevenueTimeline } from "@/components/layout/release-revenue-timeline";
import { StatCard } from "@/components/cards/stat-card";
import { SceneBackdrop } from "@/components/layout/scene-backdrop";
import { ConfidenceMeter } from "@/components/ui/confidence-meter";
import { ProvenanceBadge } from "@/components/ui/provenance-badge";
import { SectionShell } from "@/components/ui/section-shell";
import { buildInsights } from "@/lib/metrics/aggregations";
import { formatCurrencyMillions, formatMillions } from "@/lib/formatters";
import {
  getAssetForGame,
  getDashboardRows,
  getFeaturedDashboardRows,
  getThemeForGame,
  getUniverseSummary
} from "@/lib/data/repository";
import { getGamePoster } from "@/lib/themes/asset-utils";

const allRows = getDashboardRows();
const featuredRows = getFeaturedDashboardRows();
const summary = getUniverseSummary();
const franchiseOptions = Array.from(new Set(allRows.map((row) => row.game.franchise))).sort();
const kindOptions = Array.from(new Set(allRows.map((row) => row.game.kind))).sort();

export function UniverseLanding() {
  const [activeGameId, setActiveGameId] = useState("gta_v");
  const [catalogQuery, setCatalogQuery] = useState("");
  const [catalogFranchise, setCatalogFranchise] = useState("all");
  const [catalogKind, setCatalogKind] = useState("all");
  const deferredCatalogQuery = useDeferredValue(catalogQuery);

  const activeAsset = getAssetForGame(activeGameId);
  const activeTheme = getThemeForGame(activeGameId);
  const activeRow = useMemo(() => allRows.find((row) => row.game.id === activeGameId) ?? allRows[0], [activeGameId]);
  const activeHeroArtwork = getGamePoster(activeRow.game.id, activeRow.game.parentGameId);
  const heroBackdropImage =
    activeHeroArtwork !== "/images/fallbacks/no-image.svg"
      ? activeHeroArtwork
      : activeAsset?.heroImage ?? activeAsset?.backgroundImage ?? "/images/fallbacks/no-image.svg";
  const activeWorldRows = useMemo(() => {
    const baseRows = featuredRows.slice(0, 7);

    if (baseRows.some((row) => row.game.id === activeRow.game.id)) {
      return baseRows;
    }

    return [activeRow, ...baseRows].slice(0, 7);
  }, [activeRow]);
  const activeWorldIndex = Math.max(
    0,
    activeWorldRows.findIndex((row) => row.game.id === activeRow.game.id)
  );
  const filteredCatalogRows = useMemo(
    () =>
      allRows
        .filter((row) => {
          const query = deferredCatalogQuery.trim().toLowerCase();
          const matchesQuery =
            !query ||
            row.game.title.toLowerCase().includes(query) ||
            row.game.franchise.toLowerCase().includes(query);
          const matchesFranchise = catalogFranchise === "all" || row.game.franchise === catalogFranchise;
          const matchesKind = catalogKind === "all" || row.game.kind === catalogKind;

          return matchesQuery && matchesFranchise && matchesKind;
        })
        .sort((left, right) => {
          if (right.game.releaseYear !== left.game.releaseYear) return right.game.releaseYear - left.game.releaseYear;
          return right.blendedUnitsM - left.blendedUnitsM;
        }),
    [catalogFranchise, catalogKind, deferredCatalogQuery]
  );
  const insights = useMemo(() => buildInsights(allRows).slice(0, 3), []);

  return (
    <div className="space-y-8 md:space-y-10">
      <SceneBackdrop
        backgroundPosition={activeAsset?.backgroundPosition}
        image={activeAsset?.backgroundImage}
        priority
        sceneKey={activeGameId}
        theme={activeTheme}
      />

      <section
        className="grain-overlay relative overflow-hidden rounded-[2.6rem] border border-white/10 bg-black/25 px-6 py-10 shadow-panel backdrop-blur-xl md:px-10 md:py-14"
        style={{ borderColor: `${activeTheme.accent}33`, boxShadow: `0 20px 80px rgba(0,0,0,0.35), 0 0 80px ${activeTheme.cardGlow}` }}
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        <div className="grid gap-10 xl:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)]">
          <div className="relative min-w-0 overflow-hidden rounded-[2.2rem] border border-white/8 bg-black/30 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] md:p-8">
            <div className="absolute inset-0">
              <Image
                alt=""
                className="scale-[1.12] object-cover object-top opacity-20 blur-[1.5px]"
                fill
                priority
                sizes="(max-width: 1280px) 100vw, 48vw"
                src={heroBackdropImage}
                unoptimized
              />
              <div className="absolute inset-y-0 right-0 hidden w-[42%] overflow-hidden md:block">
                <Image
                  alt=""
                  className="scale-[1.14] object-cover object-top opacity-42"
                  fill
                  priority
                  sizes="(max-width: 1280px) 0px, 18vw"
                  src={heroBackdropImage}
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-l from-black/10 via-black/28 to-transparent" />
              </div>
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(90deg, rgba(4,4,4,0.96) 0%, rgba(4,4,4,0.88) 44%, rgba(4,4,4,0.66) 72%, rgba(4,4,4,0.52) 100%)`
                }}
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_34%)]" />
              <div
                className="absolute inset-y-0 right-0 w-[34%]"
                style={{ background: `linear-gradient(180deg, transparent 0%, ${activeTheme.accent}20 35%, transparent 100%)` }}
              />
              <div className="absolute left-[3%] top-[14%] hidden max-w-[78%] overflow-hidden md:block">
                <p className="font-display text-[4.4rem] uppercase leading-[0.78] tracking-[0.06em] text-white/[0.08] lg:text-[6rem]">
                  {activeRow.game.franchise}
                </p>
              </div>
            </div>
            <div className="relative max-w-4xl">
              <p className="text-[11px] uppercase tracking-[0.38em]" style={{ color: activeTheme.accent }}>
                Rockstar release atlas
              </p>
              <h1 className="mt-5 max-w-[13ch] font-display text-5xl uppercase tracking-[0.05em] text-white md:text-7xl">
                Explore the full Rockstar catalog
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/74 md:text-lg">
                Browse every Rockstar release in one place, then move from the catalog layer into platform mix, release history,
                commercial estimates, and raw data inspection. The goal is simple: make the catalog easy to explore and the
                numbers easy to trust.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  className="rounded-full border border-white/15 bg-white/10 px-5 py-3 text-xs uppercase tracking-[0.28em] text-white transition hover:bg-white/15"
                  href="#catalog-atlas"
                >
                  Browse all releases
                </Link>
                <Link
                  className="rounded-full border border-white/12 bg-black/25 px-5 py-3 text-xs uppercase tracking-[0.28em] text-white/78 transition hover:border-white/20 hover:text-white"
                  href="/dashboard"
                >
                  Open atlas
                </Link>
                <Link
                  className="rounded-full border border-white/12 bg-black/25 px-5 py-3 text-xs uppercase tracking-[0.28em] text-white/78 transition hover:border-white/20 hover:text-white"
                  href="/data-lab"
                >
                  Open data lab
                </Link>
              </div>
              <div className="mt-8 grid gap-3 md:grid-cols-3">
                <div className="rounded-[1.25rem] border border-white/10 bg-black/25 p-4">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-white/45">Trust rail</p>
                  <div className="mt-3">
                    <ProvenanceBadge provenance={activeRow.game.fieldProvenance.lifetimeUnits} />
                  </div>
                  <p className="mt-3 text-sm leading-7 text-white/66">{activeRow.game.fieldProvenance.lifetimeUnits.reason}</p>
                </div>
                <div className="rounded-[1.25rem] border border-white/10 bg-black/25 p-4">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-white/45">Metadata layer</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <ProvenanceBadge provenance={activeRow.game.fieldProvenance.metadata} />
                    <ProvenanceBadge provenance={activeRow.game.fieldProvenance.coverArt} />
                  </div>
                  <p className="mt-3 text-sm leading-7 text-white/66">{activeRow.game.roleContext}</p>
                </div>
                <div className="rounded-[1.25rem] border border-white/10 bg-black/25 p-4">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-white/45">Date precision</p>
                  <div className="mt-3">
                    <ProvenanceBadge provenance={activeRow.game.fieldProvenance.releaseDate} />
                  </div>
                  <p className="mt-3 text-sm leading-7 text-white/66">{activeRow.game.precisionNote}</p>
                </div>
              </div>
            </div>
          </div>

          <div
            className="min-w-0 overflow-hidden rounded-[2rem] border bg-white/6 p-6 backdrop-blur-xl"
            style={{ borderColor: `${activeTheme.accent}44`, backgroundColor: `${activeTheme.accent}10` }}
          >
            <div className="flex items-center justify-between gap-4">
              <p className="text-[11px] uppercase tracking-[0.3em]" style={{ color: activeTheme.accent }}>
                Active world
              </p>
              <Sparkles className="h-5 w-5" style={{ color: activeTheme.accent }} />
            </div>
            <h2 className="mt-4 font-display text-4xl uppercase tracking-[0.05em] text-white">{activeRow.game.title}</h2>
            <p className="mt-3 text-sm leading-7 text-white/74">{activeRow.game.universeStyle}</p>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <div className="rounded-[1.3rem] border border-white/10 bg-black/20 p-4">
                <p className="text-[11px] uppercase tracking-[0.24em] text-white/45">Read</p>
                <p className="mt-2 text-sm leading-7 text-white/72">{activeRow.game.releaseContext}</p>
              </div>
              <div className="rounded-[1.3rem] border border-white/10 bg-black/20 p-4">
                <p className="text-[11px] uppercase tracking-[0.24em] text-white/45">Coverage</p>
                <p className="mt-2 text-sm leading-7 text-white/72">
                  {activeRow.game.analyticsCoverage.replace(/_/g, " ")} coverage with {Math.round(activeRow.confidence * 100)}% confidence.
                </p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <span className="rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-white/78" style={{ borderColor: `${activeTheme.accent}55`, backgroundColor: `${activeTheme.accent}20` }}>
                {activeTheme.label}
              </span>
              <span className="rounded-full border border-white/12 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-white/66">
                {activeRow.game.releaseYear}
              </span>
              <span className="rounded-full border border-white/12 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-white/66">
                {activeRow.platforms.length} platforms
              </span>
              <ProvenanceBadge compact provenance={activeRow.game.fieldProvenance.lifetimeUnits} />
              <ProvenanceBadge compact provenance={activeRow.game.fieldProvenance.metadata} />
            </div>
            <ConfidenceMeter accent={activeTheme.accent} className="mt-5" reasons={activeRow.confidenceReasons} score={activeRow.confidence} />
            <div className="mt-6 space-y-3">
              {insights.map((insight) => (
                <div key={insight} className="rounded-[1.4rem] border border-white/8 bg-black/20 p-4 text-sm leading-7 text-white/72">
                  {insight}
                </div>
              ))}
            </div>
            <div className="mt-6 border-t border-white/10 pt-5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-[11px] uppercase tracking-[0.28em] text-white/45">Browse worlds</p>
                <div className="flex items-center gap-2">
                  <button
                    aria-label="Show previous active world"
                    className="rounded-full border border-white/10 bg-black/20 p-2 text-white/66 transition hover:border-white/18 hover:text-white"
                    onClick={() =>
                      setActiveGameId(activeWorldRows[(activeWorldIndex - 1 + activeWorldRows.length) % activeWorldRows.length]?.game.id ?? activeRow.game.id)
                    }
                    type="button"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    aria-label="Show next active world"
                    className="rounded-full border border-white/10 bg-black/20 p-2 text-white/66 transition hover:border-white/18 hover:text-white"
                    onClick={() =>
                      setActiveGameId(activeWorldRows[(activeWorldIndex + 1) % activeWorldRows.length]?.game.id ?? activeRow.game.id)
                    }
                    type="button"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="-mx-1 max-w-full overflow-x-auto px-1 pb-1">
                <div className="flex w-max min-w-full gap-3">
                {activeWorldRows.map((row) => {
                  const poster = getGamePoster(row.game.id, row.game.parentGameId);
                  const isActive = row.game.id === activeRow.game.id;

                  return (
                    <button
                      key={row.game.id}
                      className="group min-w-[172px] rounded-[1.25rem] border bg-black/18 p-2 text-left transition hover:bg-black/28"
                      onClick={() => setActiveGameId(row.game.id)}
                      style={{
                        borderColor: isActive ? `${activeTheme.accent}66` : "rgba(255,255,255,0.08)",
                        backgroundColor: isActive ? `${activeTheme.accent}14` : undefined
                      }}
                      type="button"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-[0.8rem] border border-white/10 bg-black/30">
                          <Image
                            alt={row.game.title}
                            className="object-cover object-center"
                            fill
                            sizes="48px"
                            src={poster}
                            unoptimized
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] uppercase tracking-[0.22em] text-white/42">{row.game.releaseYear}</p>
                          <p className="mt-1 line-clamp-2 text-sm font-semibold uppercase tracking-[0.04em] text-white">
                            {row.game.title}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            caption="Blended lifetime units across the current Rockstar catalog seed."
            detail="Official anchors where public; modeled coverage elsewhere."
            formatter={(value) => formatMillions(value)}
            icon={<Compass className="h-4 w-4 text-white/40" />}
            label="Catalog Units"
            accent={activeTheme.accent}
            provenance={activeRow.game.fieldProvenance.lifetimeUnits}
            value={summary.totalTrackedLifetimeUnits}
          />
          <StatCard
            caption="Revenue is modeled from lifetime units and transparent ASP assumptions."
            detail="This layer is analytical, not official financial reporting."
            formatter={(value) => formatCurrencyMillions(value)}
            icon={<WalletCards className="h-4 w-4 text-white/40" />}
            label="Modeled Revenue"
            accent={activeTheme.accentStrong}
            provenance={activeRow.game.fieldProvenance.revenueEstimate}
            value={summary.totalEstimatedRevenue}
          />
          <StatCard
            caption="Every release currently loaded into the catalog layer."
            detail="Games, mission packs, expansions, online layers, and variants."
            formatter={(value) => value.toFixed(0)}
            icon={<Database className="h-4 w-4 text-white/40" />}
            label="Total Releases"
            accent={activeTheme.accent}
            value={summary.totalGamesTracked}
          />
          <StatCard
            caption={`${summary.bestSellingFranchise} currently leads the model.`}
            detail={`${summary.bestSellingTitle} remains the strongest single title anchor.`}
            formatter={() => summary.bestSellingFranchise}
            icon={<ShieldCheck className="h-4 w-4 text-white/40" />}
            label="Lead Franchise"
            accent={activeTheme.accentStrong}
            provenance={activeRow.game.fieldProvenance.metadata}
            value={1}
          />
        </div>
      </section>

      <GtaSixForecast />

      <ReleaseRevenueTimeline />

      <SectionShell
        accent={activeTheme.accent}
        description="This index is the front door to the project. Search, filter, and hover through the full Rockstar release list directly from the homepage."
        eyebrow="Catalog atlas"
        id="catalog-atlas"
        title="Full release explorer"
      >
        <div className="mb-5 grid gap-3 lg:grid-cols-[1.3fr,0.9fr,0.8fr,auto]">
          <label className="space-y-2">
            <span className="text-[11px] uppercase tracking-[0.28em] text-white/45">Search releases</span>
            <div className="flex items-center gap-3 rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3">
              <Search className="h-4 w-4 text-white/38" />
              <input
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/28"
                onChange={(event) => setCatalogQuery(event.target.value)}
                placeholder="Search by title or franchise"
                value={catalogQuery}
              />
            </div>
          </label>

          <label className="space-y-2">
            <span className="text-[11px] uppercase tracking-[0.28em] text-white/45">Franchise</span>
            <select
              className="w-full rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
              onChange={(event) => setCatalogFranchise(event.target.value)}
              value={catalogFranchise}
            >
              <option value="all">All franchises</option>
              {franchiseOptions.map((franchise) => (
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
              onChange={(event) => setCatalogKind(event.target.value)}
              value={catalogKind}
            >
              <option value="all">All release types</option>
              {kindOptions.map((kind) => (
                <option key={kind} value={kind}>
                  {kind.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </label>

          <div className="flex items-end">
            <button
              className="w-full rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3 text-xs uppercase tracking-[0.24em] text-white/78 transition hover:border-white/18 hover:bg-white/10"
              onClick={() => {
                setCatalogQuery("");
                setCatalogFranchise("all");
                setCatalogKind("all");
              }}
              type="button"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-white/64">
            Showing {filteredCatalogRows.length} of {allRows.length} releases.
          </p>
          <div className="flex flex-wrap gap-2">
            {["Grand Theft Auto", "Red Dead Redemption", "Midnight Club", "Bully"].map((franchise) => (
              <button
                key={franchise}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-white/68 transition hover:border-white/18 hover:bg-white/10"
                onClick={() => setCatalogFranchise(franchise)}
                type="button"
              >
                {franchise}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredCatalogRows.map((row) => (
            <CatalogIndexCard key={row.game.id} onHover={setActiveGameId} row={row} />
          ))}
        </div>
      </SectionShell>

      <SectionShell
        accent={activeTheme.accentStrong}
        description="These are the richest worlds in the current build: deeper cover art, stronger atmospheric treatments, and fuller title-specific analytics pages."
        eyebrow="Featured worlds"
        title="High-detail game entries"
      >
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featuredRows.map((row) => (
            <GameUniverseCard key={row.game.id} onHover={setActiveGameId} row={row} />
          ))}
        </div>
      </SectionShell>

      <SectionShell
        accent={activeTheme.accent}
        description="Each route is meant to answer a different kind of question without forcing the user into one rigid dashboard flow."
        eyebrow="Explore"
        title="Three ways into the dataset"
      >
        <div className="grid gap-4 lg:grid-cols-3">
          <Link className="rounded-[1.6rem] border border-white/10 bg-white/5 p-6 transition hover:border-white/18 hover:bg-white/8" href="/dashboard">
            <Compass className="h-5 w-5 text-white/55" />
            <h3 className="mt-4 font-display text-2xl uppercase tracking-[0.05em] text-white">Atlas view</h3>
            <p className="mt-3 text-sm leading-7 text-white/68">
              Use the main atlas to filter the catalog by franchise, platform family, role, generation, and release type.
            </p>
          </Link>
          <Link className="rounded-[1.6rem] border border-white/10 bg-white/5 p-6 transition hover:border-white/18 hover:bg-white/8" href="/compare">
            <Swords className="h-5 w-5 text-white/55" />
            <h3 className="mt-4 font-display text-2xl uppercase tracking-[0.05em] text-white">Compare view</h3>
            <p className="mt-3 text-sm leading-7 text-white/68">
              Build a head-to-head slate from the full release library and compare platform breadth, trend shape, and scale.
            </p>
          </Link>
          <Link className="rounded-[1.6rem] border border-white/10 bg-white/5 p-6 transition hover:border-white/18 hover:bg-white/8" href="/data-lab">
            <Database className="h-5 w-5 text-white/55" />
            <h3 className="mt-4 font-display text-2xl uppercase tracking-[0.05em] text-white">Data lab</h3>
            <p className="mt-3 text-sm leading-7 text-white/68">
              Query the local seed and derived fact tables directly in SQL when you want the raw rows instead of the finished UI.
            </p>
          </Link>
        </div>
      </SectionShell>
    </div>
  );
}
