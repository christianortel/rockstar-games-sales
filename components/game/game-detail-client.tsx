"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { CalendarRange, Clock3, Flame, ShieldCheck, Sparkles, Swords } from "lucide-react";

import { ChartLoadingCard } from "@/components/charts/chart-loading-card";
import { StatCard } from "@/components/cards/stat-card";
import { PlatformCard } from "@/components/game/platform-card";
import { SceneBackdrop } from "@/components/layout/scene-backdrop";
import { GameCoverArt } from "@/components/ui/game-cover-art";
import { DataBadge } from "@/components/ui/data-badge";
import { ConfidenceMeter } from "@/components/ui/confidence-meter";
import { ProvenanceBadge } from "@/components/ui/provenance-badge";
import { ProvenanceDrawer } from "@/components/ui/provenance-drawer";
import { ProvenanceList } from "@/components/ui/provenance-list";
import { SectionShell } from "@/components/ui/section-shell";
import {
  getAssetForGame,
  getDashboardRows,
  getGameById,
  getLastVerifiedAt,
  getMethodology,
  getOfficialEventsForGame,
  getSourceIdsForGame,
  getSourceRecords,
  getThemeForGame
} from "@/lib/data/repository";
import { formatCurrencyMillions, formatLongDate, formatMillions } from "@/lib/formatters";
import { buildGameInsights } from "@/lib/metrics/insights";
import {
  buildGamePlatformBreakdown,
  buildGameRegionBreakdown,
  buildGameTrend,
  buildReleaseTimeline
} from "@/lib/metrics/presenters";
import { getGameLogo, getGamePoster } from "@/lib/themes/asset-utils";

const dashboardRows = getDashboardRows();
const TrendChart = dynamic(() => import("@/components/charts/overview-charts").then((mod) => mod.TrendChart), {
  loading: () => <ChartLoadingCard subtitle="Preparing the title trajectory." title="Lifetime Trend" />,
  ssr: false
});
const RegionDonutChart = dynamic(() => import("@/components/charts/overview-charts").then((mod) => mod.RegionDonutChart), {
  loading: () => <ChartLoadingCard subtitle="Preparing the regional mix." title="Regional Mix" />,
  ssr: false
});

export function GameDetailClient({ gameId }: { gameId: string }) {
  const row = dashboardRows.find((item) => item.game.id === gameId);
  const game = getGameById(gameId);

  if (!row || !game) return null;

  const theme = getThemeForGame(gameId);
  const asset = getAssetForGame(gameId);
  const platformBreakdown = buildGamePlatformBreakdown(gameId);
  const regionBreakdown = buildGameRegionBreakdown(gameId);
  const trend = buildGameTrend(gameId);
  const releaseTimeline = buildReleaseTimeline(gameId);
  const methodology = getMethodology(game.methodologyId);
  const sources = getSourceRecords(getSourceIdsForGame(gameId));
  const officialEvents = getOfficialEventsForGame(gameId);
  const insights = buildGameInsights(gameId, game.title);
  const firstOfficialEvent = officialEvents[0];
  const gameLogo = getGameLogo(gameId);
  const gamePoster = getGamePoster(gameId, game.parentGameId);
  const hasAnalytics = game.analyticsCoverage !== "catalog_only" && trend.length > 0;

  return (
    <div className="space-y-8">
      <SceneBackdrop
        backgroundPosition={asset?.backgroundPosition}
        image={asset?.backgroundImage}
        priority
        sceneKey={gameId}
        theme={theme}
      />

      <section className="relative overflow-hidden rounded-[2.6rem] border border-white/10 bg-black/25 p-6 shadow-panel backdrop-blur-xl md:p-8">
        <div className="grid gap-8 xl:grid-cols-[1.15fr,0.85fr]">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <DataBadge
                label={
                  game.analyticsCoverage === "catalog_only"
                    ? "Catalog entry"
                    : game.confirmedLifetimeUnitsM
                      ? "Official anchor"
                      : "Modeled title"
                }
                mode={game.confirmedLifetimeUnitsM ? "confirmed" : "estimated"}
              />
              <span className="rounded-full border border-white/12 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-white/55">
                {game.franchise}
              </span>
              <span className="rounded-full border border-white/12 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-white/55">
                {game.analyticsCoverage === "catalog_only" ? "Catalog reference" : `Verified ${getLastVerifiedAt()}`}
              </span>
              <span className="rounded-full border border-white/12 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-white/55">
                {game.kind.replace(/_/g, " ")}
              </span>
            </div>
            <p className="mt-5 text-[11px] uppercase tracking-[0.32em]" style={{ color: theme.accent }}>
              {theme.headingEyebrow}
            </p>
            {gameLogo ? (
              <div className="relative mt-3 h-28 max-w-[36rem]">
                <Image alt={game.title} className="object-contain object-left" fill sizes="(max-width: 768px) 90vw, 36rem" src={gameLogo} unoptimized />
              </div>
            ) : (
              <h1 className="mt-3 max-w-[12ch] font-display text-5xl uppercase tracking-[0.05em] text-white md:text-7xl">
                {game.title}
              </h1>
            )}
            <p className="mt-5 max-w-3xl text-lg leading-8 text-white/70">{game.heroTagline}</p>
            <p className="mt-4 max-w-3xl text-sm leading-8 text-white/64">{game.longDescription}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <ProvenanceBadge provenance={game.fieldProvenance.lifetimeUnits} />
              <ProvenanceBadge provenance={game.fieldProvenance.metadata} />
              <ProvenanceBadge provenance={game.fieldProvenance.coverArt} />
              <ProvenanceBadge provenance={game.fieldProvenance.releaseDate} />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {[
                { href: "#platform-breakdown", label: "Platforms" },
                { href: "#analytics-world", label: "Analytics" },
                { href: "#release-timeline", label: "Timeline" },
                { href: "#provenance-layer", label: "Provenance" }
              ].map((item) => (
                <a
                  key={item.href}
                  className="rounded-full border px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-white/78 transition hover:text-white"
                  href={item.href}
                  style={{ borderColor: `${theme.accent}44`, backgroundColor: `${theme.accent}14` }}
                >
                  {item.label}
                </a>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {hasAnalytics ? (
                <Link
                  className="rounded-full border border-white/14 bg-white/10 px-5 py-3 text-xs uppercase tracking-[0.26em] text-white transition hover:bg-white/15"
                  href={`/compare?games=${game.id},gta_v`}
                >
                  <Swords className="mr-2 inline-flex h-4 w-4" />
                  Compare this game
                </Link>
              ) : (
                <span className="rounded-full border border-white/10 bg-white/6 px-5 py-3 text-xs uppercase tracking-[0.26em] text-white/42">
                  Catalog reference only
                </span>
              )}
              <Link
                className="rounded-full border border-white/12 bg-black/25 px-5 py-3 text-xs uppercase tracking-[0.26em] text-white/78 transition hover:border-white/20 hover:text-white"
                href="/dashboard"
              >
                Back to dashboard
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border bg-white/6 p-6" style={{ borderColor: `${theme.accent}44`, backgroundColor: `${theme.accent}0f` }}>
            <p className="text-[11px] uppercase tracking-[0.28em]" style={{ color: theme.accent }}>
              Universe identity
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-[220px,1fr]">
              <div className="relative aspect-[3/4] overflow-hidden rounded-[1.4rem] border border-white/10 bg-black/35 shadow-[0_18px_50px_rgba(0,0,0,0.45)]">
                {gamePoster === "/images/fallbacks/no-image.svg" ? (
                  <GameCoverArt game={game} sizes="(max-width: 1280px) 100vw, 18vw" variant="feature" />
                ) : (
                  <>
                    <Image alt={game.title} className="object-contain object-center" fill sizes="(max-width: 1280px) 100vw, 18vw" src={gamePoster} unoptimized />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />
                  </>
                )}
              </div>
              <div className="relative min-h-[180px] overflow-hidden rounded-[1.4rem] border border-white/10">
                <Image
                  alt=""
                  className="object-cover object-center opacity-85"
                  fill
                  sizes="(max-width: 1280px) 100vw, 24vw"
                  src={asset?.heroImage ?? "/images/fallbacks/no-image.svg"}
                  unoptimized
                />
                <div className={`absolute inset-0 ${theme.overlayGradient}`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <p className="text-[11px] uppercase tracking-[0.22em]" style={{ color: theme.accent }}>
                    {theme.label}
                  </p>
                  <p className="mt-2 max-w-md text-sm leading-7 text-white/76">{game.universeStyle}</p>
                </div>
              </div>
            </div>
            <div className="mt-4 grid gap-3">
              {insights.map((insight) => (
                <div key={insight} className="rounded-[1.2rem] border border-white/8 bg-black/20 p-4 text-sm leading-7 text-white/68">
                  {insight}
                </div>
              ))}
            </div>
            <ConfidenceMeter accent={theme.accent} className="mt-5" reasons={row.confidenceReasons} score={row.confidence} />
            <div className="mt-5">
              <ProvenanceDrawer
                lastVerifiedAt={getLastVerifiedAt()}
                methodology={methodology}
                sources={sources}
                summary={
                  hasAnalytics
                    ? `${game.title} uses ${game.confirmedLifetimeUnitsM ? "an official title-level milestone as its headline anchor" : "a modeled title total based on release history and franchise context"}, then allocates platform, region, and annual cadence transparently.`
                    : `${game.title} is currently a catalog-only entry. Franchise placement, release lineage, platform scope, and Rockstar role are visible, but the commercial layer is intentionally withheld until stronger research is added.`
                }
              />
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            caption={hasAnalytics ? "Headline lifetime value for this title." : "Catalog-only entry awaiting deeper sales modeling."}
            detail={
              hasAnalytics
                ? game.confirmedLifetimeUnitsM
                  ? "Official title milestone disclosed."
                  : "Modeled lifetime estimate."
                : "Release lineage and platform scope are available; commercial metrics are not yet modeled."
            }
            formatter={formatMillions}
            label="Lifetime Units"
            provenance={game.fieldProvenance.lifetimeUnits}
            value={row.blendedUnitsM}
          />
          <StatCard
            caption={hasAnalytics ? "Modeled from lifetime units and ASP." : "Revenue is withheld until a modeled commercial layer exists."}
            detail={hasAnalytics ? "Revenue remains an estimate in every mode." : "Catalog coverage does not imply invented revenue figures."}
            formatter={formatCurrencyMillions}
            label="Revenue Estimate"
            provenance={game.fieldProvenance.revenueEstimate}
            value={row.estimatedRevenueUsdM}
          />
          <StatCard
            caption="Tracked launch, ports, remasters, and re-releases."
            detail={hasAnalytics ? "Sorted by strongest performance in the platform section below." : "Catalog release footprint across tracked hardware."}
            formatter={(value) => value.toFixed(0)}
            label="Platforms"
            value={platformBreakdown.length}
          />
          <StatCard
            caption={
              firstOfficialEvent
                ? `Official as of ${formatLongDate(firstOfficialEvent.asOfDate)}`
                : hasAnalytics
                  ? "No direct official title milestone in the seed."
                  : "Catalog-only entries do not claim a modeled confidence score."
            }
            detail={
              hasAnalytics
                ? "Lifecycle uses modeled annual cadence even when the total anchor is official."
                : "Confidence activates once a title receives modeled or confirmed commercial coverage."
            }
            formatter={(value) => `${Math.round(value * 100)}%`}
            label="Confidence"
            provenance={game.fieldProvenance.metadata}
            value={row.confidence}
          />
        </div>
      </section>

      <SectionShell
        accent={theme.accent}
        description="This module explains where the title sits in Rockstar's catalog and why the trust read looks the way it does."
        eyebrow="Release context"
        title="Why this title matters in the catalog"
      >
        <div className="grid gap-4 xl:grid-cols-[1.05fr,0.95fr]">
          <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
            <h3 className="font-display text-2xl uppercase tracking-[0.05em] text-white">Catalog read</h3>
            <div className="mt-4 space-y-3 text-sm leading-7 text-white/68">
              <p>{game.releaseContext}</p>
              <p>{game.roleContext}</p>
              {game.precisionNote ? <p>{game.precisionNote}</p> : null}
              {game.legacyNote ? <p>{game.legacyNote}</p> : null}
            </div>
          </div>
          <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
            <h3 className="font-display text-2xl uppercase tracking-[0.05em] text-white">Field provenance</h3>
            <div className="mt-4">
              <ProvenanceList
                items={[
                  { label: "Lifetime units", provenance: game.fieldProvenance.lifetimeUnits },
                  { label: "Revenue estimate", provenance: game.fieldProvenance.revenueEstimate },
                  { label: "Release date precision", provenance: game.fieldProvenance.releaseDate },
                  { label: "Cover art", provenance: game.fieldProvenance.coverArt },
                  { label: "Summary and metadata", provenance: game.fieldProvenance.metadata }
                ]}
              />
            </div>
          </div>
        </div>
      </SectionShell>

      <SectionShell
        accent={theme.accent}
        description="This is the collectible stat-board layer: each console card shows modeled share, confidence, and release metadata."
        eyebrow="Platform breakdown"
        id="platform-breakdown"
        title="Console and platform contribution"
      >
        {platformBreakdown.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {platformBreakdown.map((item) => (
              <PlatformCard
                accent={theme.accent}
                confidence={item.confidence}
                isModeled={!game.confirmedLifetimeUnitsM}
                key={item.platform?.id}
                platform={item.platform!}
                releaseDate={item.releaseDate}
                share={item.share}
                units={item.units}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5 text-sm leading-7 text-white/68">
            This title is currently represented as a catalog reference entry. Platform release history is tracked below, but no platform-level sales model has been attached yet.
          </div>
        )}
      </SectionShell>

      <SectionShell
        accent={theme.accentStrong}
        description="Annual cadence, cumulative growth, and region split help explain where this title sits inside the wider Rockstar catalog."
        eyebrow="Analytics world"
        id="analytics-world"
        title="Trend and regional mix"
      >
        {hasAnalytics ? (
          <div className="grid gap-5 xl:grid-cols-[1.1fr,1.1fr,0.8fr]">
            <TrendChart
              accent={theme.accent}
              data={trend}
              secondary={theme.accentStrong}
              subtitle="Modeled annual units with cumulative overlay."
              title="Lifetime trend"
            />
            <TrendChart
              accent={theme.accentStrong}
              data={trend}
              mode="cumulative"
              secondary={theme.accent}
              subtitle="The cumulative climb isolates the long-tail story."
              title="Cumulative curve"
            />
            <RegionDonutChart colors={theme.chartPalette} data={regionBreakdown} />
          </div>
        ) : (
          <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5 text-sm leading-7 text-white/68">
            This title is in the full Rockstar release catalog, but its annual trend, regional mix, and cumulative commercial curve have not been modeled yet. The catalog layer is complete; the analytics layer is intentionally incomplete.
          </div>
        )}
      </SectionShell>

      <SectionShell
        accent={theme.accent}
        description="Ports, remasters, and modern re-releases are core to Rockstar's catalog durability. The timeline makes that explicit."
        eyebrow="Release timeline"
        id="release-timeline"
        title="Launches, ports, and remasters"
      >
        <div className="grid gap-4 xl:grid-cols-[1.1fr,0.9fr]">
          <div className="space-y-4">
            {releaseTimeline.map((item) => (
              <div key={`${item.date}-${item.label}`} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-white/55">
                    {formatLongDate(item.date, item.precision)}
                  </span>
                  {item.remaster ? (
                    <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-white/55">
                      Remaster / enhanced
                    </span>
                  ) : null}
                </div>
                <h3 className="mt-3 font-display text-2xl uppercase tracking-[0.04em] text-white">{item.label}</h3>
                <p className="mt-2 text-sm leading-7 text-white/66">{item.notes}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-4">
            <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
              <div className="flex items-center gap-3">
                <CalendarRange className="h-5 w-5 text-white/45" />
                <div>
                  <p className="text-[11px] uppercase tracking-[0.28em] text-white/45">At a glance</p>
                  <h3 className="mt-2 font-display text-2xl uppercase tracking-[0.05em] text-white">Release facts</h3>
                </div>
              </div>
              <div className="mt-5 space-y-3 text-sm leading-7 text-white/66">
                <p>Original release: {formatLongDate(game.originalReleaseDate, game.releaseDatePrecision)}</p>
                <p>Developer: {game.developer}</p>
                <p>Publisher: {game.publisher}</p>
                <p>Tracked releases: {releaseTimeline.length}</p>
              </div>
            </div>

            <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
              <div className="flex items-center gap-3">
                <Clock3 className="h-5 w-5 text-white/45" />
                <div>
                  <p className="text-[11px] uppercase tracking-[0.28em] text-white/45">Headline metric</p>
                  <h3 className="mt-2 font-display text-2xl uppercase tracking-[0.05em] text-white">Commercial read</h3>
                </div>
              </div>
              <p className="mt-5 text-sm leading-7 text-white/66">{game.headlineMetric}</p>
            </div>
          </div>
        </div>
      </SectionShell>

      <SectionShell
        accent={theme.accentStrong}
        description="The MVP keeps the line between official and modeled data visible rather than hiding it in footnotes."
        eyebrow="Provenance"
        id="provenance-layer"
        title="Official vs estimated layers"
      >
        <div className="grid gap-4 xl:grid-cols-3">
          <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-white/45" />
              <h3 className="font-display text-2xl uppercase tracking-[0.05em] text-white">Official layer</h3>
            </div>
            <p className="mt-4 text-sm leading-7 text-white/66">
              {firstOfficialEvent
                ? `${game.title} has an official title-specific milestone in the seed, as of ${formatLongDate(firstOfficialEvent.asOfDate)}.`
                : hasAnalytics
                  ? `${game.title} does not have a direct title-specific official milestone in the current seed, so the headline total is modeled.`
                  : `${game.title} is currently a catalog-only entry, so no title-level official or modeled headline is asserted yet.`}
            </p>
          </div>
          <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-white/45" />
              <h3 className="font-display text-2xl uppercase tracking-[0.05em] text-white">Modeled layer</h3>
            </div>
            <p className="mt-4 text-sm leading-7 text-white/66">
              {hasAnalytics
                ? "Platform splits, regional mix, annual cadence, and revenue estimates are all modeled. They remain clearly replaceable as stronger research arrives."
                : "This entry currently exposes release-history and lineage metadata only. Commercial modeling is deferred until stronger sourcing is added."}
            </p>
          </div>
          <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-3">
              <Flame className="h-5 w-5 text-white/45" />
              <h3 className="font-display text-2xl uppercase tracking-[0.05em] text-white">Asset system</h3>
            </div>
            <p className="mt-4 text-sm leading-7 text-white/66">
              Backgrounds, hero imagery, and gallery strips all come through the centralized asset config, so the look can be
              upgraded or swapped without changing the app structure.
            </p>
          </div>
        </div>
      </SectionShell>

      <SectionShell
        accent={theme.accent}
        description="Gallery images are centralized in config, easy to replace, and safe to disable if asset rights change."
        eyebrow="Gallery"
        title="World-building strip"
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {(asset?.galleryImages ?? []).map((image, index) => (
            <div key={`${image}-${index}`} className="relative min-h-[220px] overflow-hidden rounded-[1.8rem] border border-white/10 bg-white/5">
              <Image alt="" className="object-cover object-center opacity-75" fill sizes="(max-width: 1280px) 100vw, 33vw" src={image} />
              <div className={`absolute inset-0 ${theme.overlayGradient}`} />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="text-[11px] uppercase tracking-[0.24em] text-white/45">{game.galleryCaption}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionShell>
    </div>
  );
}
