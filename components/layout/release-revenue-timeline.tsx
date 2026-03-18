"use client";

import Image from "next/image";

import { GameCoverArt } from "@/components/ui/game-cover-art";
import { SectionShell } from "@/components/ui/section-shell";
import { getDashboardRows } from "@/lib/data/repository";
import { formatCurrencyMillions } from "@/lib/formatters";
import { getGamePoster } from "@/lib/themes/asset-utils";
import { cn } from "@/lib/utils";

const timelineRows = getDashboardRows()
  .slice()
  .sort((left, right) => {
    if (left.game.releaseYear !== right.game.releaseYear) {
      return left.game.releaseYear - right.game.releaseYear;
    }

    return left.game.title.localeCompare(right.game.title);
  });

const maxRevenue = Math.max(...timelineRows.map((row) => row.estimatedRevenueUsdM));

export function ReleaseRevenueTimeline() {
  return (
    <SectionShell
      accent="#f2c94c"
      description="A full release timeline for the Rockstar catalog. The cards track release order, show cover art when available, and put each title's modeled revenue contribution in context."
      eyebrow="Timeline"
      title="Rockstar release and revenue timeline"
    >
      <div className="overflow-x-auto pb-2">
        <div className="relative min-w-max px-2 pb-6 pt-4">
          <div className="absolute left-0 right-0 top-[7.7rem] h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <div className="flex items-start gap-5">
            {timelineRows.map((row, index) => {
              const poster = getGamePoster(row.game.id, row.game.parentGameId);
              const revenueWidth = Math.max(14, Math.round((row.estimatedRevenueUsdM / maxRevenue) * 100));

              return (
                <article
                  key={row.game.id}
                  className={cn("relative w-[172px] shrink-0", index % 2 === 0 ? "pt-0" : "pt-16")}
                >
                  <div className="mb-4 flex justify-center">
                    <span className="rounded-full border border-white/12 bg-black/25 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-white/62">
                      {row.game.releaseYear}
                    </span>
                  </div>

                  <div className="absolute left-1/2 top-[3.1rem] h-[4.4rem] w-px -translate-x-1/2 bg-white/18" />
                  <div className="absolute left-1/2 top-[7.4rem] h-2.5 w-2.5 -translate-x-1/2 rounded-full border border-[#f2c94c]/50 bg-black shadow-[0_0_18px_rgba(242,201,76,0.28)]" />

                  <div className="rounded-[1.45rem] border border-white/10 bg-white/5 p-3 backdrop-blur-xl">
                    <div className="relative mx-auto aspect-[3/4] w-[116px] overflow-hidden rounded-[1rem] border border-white/10 bg-black/30 shadow-[0_16px_40px_rgba(0,0,0,0.38)]">
                      {poster === "/images/fallbacks/no-image.svg" ? (
                        <GameCoverArt game={row.game} sizes="116px" variant="catalog" />
                      ) : (
                        <>
                          <Image alt={row.game.title} className="object-cover object-center" fill sizes="116px" src={poster} unoptimized />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                        </>
                      )}
                    </div>

                    <p className="mt-3 text-[9px] uppercase tracking-[0.24em] text-white/42">{row.game.kind.replace(/_/g, " ")}</p>
                    <h3 className="mt-2 line-clamp-3 font-display text-lg uppercase tracking-[0.04em] text-white">{row.game.title}</h3>
                    <p className="mt-2 text-xs leading-6 text-white/58">{row.game.shortDescription}</p>

                    <div className="mt-4">
                      <div className="mb-2 flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.22em] text-white/42">
                        <span>Revenue</span>
                        <span>{formatCurrencyMillions(row.estimatedRevenueUsdM)}</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#f2c94c] via-[#ff9a4d] to-[#ff4f91]"
                          style={{ width: `${revenueWidth}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
