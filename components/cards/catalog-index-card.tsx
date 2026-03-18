"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import { GameCoverArt } from "@/components/ui/game-cover-art";
import { getTheme } from "@/lib/themes/theme-utils";
import { gameAssets } from "@/config/gameAssets";
import { formatMillions } from "@/lib/formatters";
import { DashboardGameRow } from "@/types/domain";

export function CatalogIndexCard({
  row,
  onHover
}: {
  row: DashboardGameRow;
  onHover?: (gameId: string) => void;
}) {
  const theme = getTheme(row.game.themeKey);
  const poster = gameAssets[row.game.id]?.posterImage;

  return (
    <motion.div className="h-full" transition={{ duration: 0.2, ease: "easeOut" }} whileHover={{ y: -4 }}>
      <Link
        className="group relative flex h-full flex-col overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/5 p-4 transition hover:bg-white/8"
        href={`/game/${row.game.slug}`}
        onMouseEnter={() => onHover?.(row.game.id)}
        style={{ borderColor: `${theme.accent}24` }}
      >
        <div className="mb-4 grid min-h-[104px] gap-3 grid-cols-[84px,1fr]">
          <div className="relative overflow-hidden rounded-[1rem] border border-white/10 bg-black/30">
            {poster ? (
              <Image alt={row.game.title} className="object-cover object-center" fill sizes="84px" src={poster} unoptimized />
            ) : (
              <GameCoverArt game={row.game} sizes="84px" variant="catalog" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[10px] uppercase tracking-[0.24em]" style={{ color: theme.accent }}>
                {row.game.franchise}
              </p>
              <span className="rounded-full border border-white/10 px-2 py-1 text-[9px] uppercase tracking-[0.16em] text-white/50">
                {row.game.kind.replace(/_/g, " ")}
              </span>
            </div>
            <h3 className="mt-2 line-clamp-2 font-display text-xl uppercase tracking-[0.05em] text-white">{row.game.title}</h3>
            <p className="mt-2 text-xs leading-6 text-white/60">{row.game.headlineMetric}</p>
          </div>
        </div>

        <div className="mt-auto grid grid-cols-3 gap-3 border-t border-white/8 pt-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-white/38">Year</p>
            <p className="mt-1 text-sm text-white/78">{row.game.releaseYear}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-white/38">Units</p>
            <p className="mt-1 text-sm text-white/78">{formatMillions(row.blendedUnitsM, 1)}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-[0.22em] text-white/38">Coverage</p>
            <p className="mt-1 text-sm text-white/78">{row.game.analyticsCoverage.replace(/_/g, " ")}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
