"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CalendarRange, Cpu } from "lucide-react";

import { DataBadge } from "@/components/ui/data-badge";
import { ConfidenceMeter } from "@/components/ui/confidence-meter";
import { formatMillions, formatPercent } from "@/lib/formatters";
import { getPlatformAsset } from "@/lib/themes/asset-utils";
import { Platform } from "@/types/domain";

export function PlatformCard({
  platform,
  units,
  share,
  confidence,
  releaseDate,
  isModeled,
  accent
}: {
  platform: Platform;
  units: number;
  share: number;
  confidence: number;
  releaseDate?: string;
  isModeled: boolean;
  accent: string;
}) {
  const platformAsset = getPlatformAsset(platform.id);

  return (
    <motion.div
      className="group rounded-[1.8rem] border border-white/10 bg-white/6 p-5 shadow-panel backdrop-blur-xl transition hover:border-white/18 hover:bg-white/8"
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.35 }}
      viewport={{ once: true, amount: 0.2 }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div
            className="flex min-h-[76px] min-w-[164px] items-center gap-3 overflow-hidden rounded-2xl border border-white/12 bg-black/35 px-3 py-3 shadow-[0_12px_35px_rgba(0,0,0,0.35)]"
            style={{ boxShadow: `inset 0 1px 0 rgba(255,255,255,0.04), 0 12px 35px rgba(0,0,0,0.35), 0 0 0 1px ${accent}20` }}
          >
            {platformAsset?.badgeImage ? (
              <div className="relative h-full min-h-[52px] w-full">
                <Image alt={platformAsset.label} className="object-contain object-left" fill sizes="164px" src={platformAsset.badgeImage} unoptimized />
              </div>
            ) : platformAsset ? (
              <>
                <div className="relative h-10 w-10 shrink-0 rounded-xl border border-white/10 bg-white/6">
                  <Image
                    alt={platformAsset.label}
                    className="object-contain object-center p-2 brightness-0 invert"
                    fill
                    sizes="40px"
                    src={platformAsset.image}
                    unoptimized
                  />
                </div>
                <div className="min-w-0">
                  <p className="font-display text-lg uppercase tracking-[0.14em] text-white">{platformAsset.wordmark}</p>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-white/48">{platformAsset.label}</p>
                </div>
              </>
            ) : (
              <div className="inline-flex h-full w-full items-center justify-center font-display text-sm uppercase tracking-[0.16em] text-white">
                {platform.iconText}
              </div>
            )}
          </div>
          <h3 className="mt-4 font-display text-2xl uppercase tracking-[0.05em] text-white">{platform.name}</h3>
          <p className="mt-2 text-sm text-white/58">{[platform.manufacturer, platform.generation.toUpperCase(), platform.family].join(" · ")}</p>
        </div>
        <DataBadge label={isModeled ? "Modeled split" : "Blended split"} mode={isModeled ? "estimated" : "blended"} />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.25em] text-white/42">Units</p>
          <p className="mt-2 font-display text-3xl uppercase tracking-[0.04em] text-white">{formatMillions(units)}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.25em] text-white/42">Share</p>
          <p className="mt-2 font-display text-3xl uppercase tracking-[0.04em] text-white">{formatPercent(share)}</p>
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-[11px] uppercase tracking-[0.24em] text-white/42">
          <span>Contribution</span>
          <span>{formatPercent(share)}</span>
        </div>
        <div className="h-3 rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full"
            initial={{ width: 0 }}
            style={{ background: `linear-gradient(90deg, ${accent} 0%, rgba(255,255,255,0.92) 100%)` }}
            transition={{ duration: 0.75, ease: "easeOut" }}
            viewport={{ once: true }}
            whileInView={{ width: `${share * 100}%` }}
          />
        </div>
      </div>

      <ConfidenceMeter accent={accent} className="mt-5" score={confidence} />

      <div className="mt-5 grid gap-3 border-t border-white/10 pt-4 text-xs uppercase tracking-[0.18em] text-white/46 md:grid-cols-2">
        <div className="flex items-center gap-2">
          <CalendarRange className="h-3.5 w-3.5" />
          <span>
            {releaseDate
              ? new Date(releaseDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })
              : "Catalog release"}
          </span>
        </div>
        <div className="flex items-center gap-2 md:justify-end">
          <Cpu className="h-3.5 w-3.5" />
          <span>{platform.releaseYear} hardware launch</span>
        </div>
      </div>
    </motion.div>
  );
}
