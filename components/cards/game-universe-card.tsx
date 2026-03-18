"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import { GameCoverArt } from "@/components/ui/game-cover-art";
import { formatMillions } from "@/lib/formatters";
import { getGameAsset, getTheme } from "@/lib/themes/theme-utils";
import { getGamePoster } from "@/lib/themes/asset-utils";
import { DashboardGameRow } from "@/types/domain";

export function GameUniverseCard({
  row,
  onHover
}: {
  row: DashboardGameRow;
  onHover?: (gameId: string) => void;
}) {
  const asset = getGameAsset(row.game.id);
  const theme = getTheme(row.game.themeKey);
  const poster = getGamePoster(row.game.id, row.game.parentGameId);

  return (
    <motion.div className="h-full" transition={{ duration: 0.24, ease: "easeOut" }} whileHover={{ y: -8 }}>
      <Link
        className="group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-white/12 bg-white/5 p-5 shadow-panel"
        href={`/game/${row.game.slug}`}
        onMouseEnter={() => onHover?.(row.game.id)}
        style={{ borderColor: `${theme.accent}44`, boxShadow: `0 20px 80px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05), 0 0 50px ${theme.cardGlow}` }}
      >
        <div className="absolute inset-0">
          <Image
            alt=""
            className="object-cover object-center opacity-70 transition duration-500 group-hover:scale-105 group-hover:opacity-90"
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            src={asset?.heroImage ?? "/images/fallbacks/no-image.svg"}
          />
          <div className={`absolute inset-0 ${theme.overlayGradient}`} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/15 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-24 opacity-70" style={{ background: `linear-gradient(180deg, ${theme.accent}26 0%, transparent 100%)` }} />
        </div>
        <div className="relative flex h-full flex-col">
          <div className="flex items-start justify-between gap-4">
            <p className="text-[11px] uppercase tracking-[0.35em]" style={{ color: theme.accent }}>
              {row.game.franchise}
            </p>
            <span className="rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-white/80" style={{ borderColor: `${theme.accent}55`, backgroundColor: `${theme.accent}22` }}>
              {row.game.confirmedLifetimeUnitsM ? "Official anchor" : "Modeled title"}
            </span>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-[190px,1fr]">
            <div className="relative aspect-[3/4] overflow-hidden rounded-[1.4rem] border border-white/12 bg-black/35 shadow-[0_18px_50px_rgba(0,0,0,0.45)]">
              {poster === "/images/fallbacks/no-image.svg" ? (
                <GameCoverArt game={row.game} sizes="(max-width: 768px) 56vw, 190px" variant="feature" />
              ) : (
                <>
                  <Image
                    alt={row.game.title}
                    className="object-contain object-center"
                    fill
                    sizes="(max-width: 768px) 56vw, 190px"
                    src={poster}
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                </>
              )}
            </div>
            <div>
              <h3 className="max-w-[16ch] font-display text-3xl uppercase tracking-[0.06em] text-white md:text-4xl">
                {row.game.title}
              </h3>
              <p className="mt-3 max-w-md text-sm leading-7 text-white/78">{row.game.shortDescription}</p>
              <p className="mt-3 max-w-md text-sm leading-7 text-white/58">{row.game.headlineMetric}</p>
            </div>
          </div>

          <div className="mt-6 inline-flex rounded-full border px-4 py-2 text-[11px] uppercase tracking-[0.26em] text-white/85" style={{ borderColor: `${theme.accent}55`, backgroundColor: `${theme.accent}22` }}>
            Enter analytics world
          </div>

          <div className="mt-6 grid gap-4 border-t border-white/10 pt-4 md:grid-cols-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-white/40">Release</p>
              <p className="mt-2 text-lg text-white">{row.game.releaseYear}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-white/40">Lifetime</p>
              <p className="mt-2 text-lg text-white">{formatMillions(row.blendedUnitsM)}</p>
            </div>
            <div className="text-left md:text-right">
              <p className="text-[11px] uppercase tracking-[0.28em] text-white/40">Confidence</p>
              <p className="mt-2 text-lg text-white">{Math.round(row.confidence * 100)}%</p>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
