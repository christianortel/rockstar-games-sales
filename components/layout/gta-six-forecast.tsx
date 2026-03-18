"use client";

import Image from "next/image";
import { TrendingUp, WalletCards } from "lucide-react";

import { DataBadge } from "@/components/ui/data-badge";
import { SectionShell } from "@/components/ui/section-shell";
import { formatCurrencyMillions, formatMillions } from "@/lib/formatters";
import { buildGtaSixForecast } from "@/lib/metrics/forecast";

const forecast = buildGtaSixForecast();

export function GtaSixForecast() {
  return (
    <SectionShell
      accent="#ff4f91"
      description="This is a speculative forward model for GTA VI, built to show possible premium-software revenue outcomes rather than claim an official forecast."
      eyebrow="Forward model"
      title="GTA VI revenue outlook"
    >
      <div className="grid gap-5 xl:grid-cols-[1.02fr,0.98fr]">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/30 p-6">
          <div className="absolute inset-0">
            <Image
              alt=""
              className="scale-[1.03] object-cover object-center opacity-58"
              fill
              sizes="(max-width: 1280px) 100vw, 48vw"
              src="/images/games/gta-vi-jason-lucia-01.jpg"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/72 to-black/28" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,79,145,0.22),transparent_28%)]" />
            <div className="absolute inset-y-0 right-0 w-[36%] bg-gradient-to-l from-[#ff9cc4]/18 via-transparent to-transparent" />
          </div>

          <div className="relative">
            <div className="flex flex-wrap items-center gap-3">
              <DataBadge label="Speculative model" mode="estimated" />
              <span className="rounded-full border border-white/12 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-white/58">
                Premium software only
              </span>
            </div>

            <p className="mt-5 text-[11px] uppercase tracking-[0.34em] text-[#ff9cc4]">Projected blockbuster range</p>
            <h3 className="mt-3 font-display text-5xl uppercase tracking-[0.06em] text-white md:text-6xl">Grand Theft Auto VI</h3>
            <p className="mt-5 max-w-xl text-sm leading-8 text-white/72">
              The base case here assumes a launch bigger than Red Dead Redemption 2's modeled opening year, but still short of
              GTA V's original shockwave. The point is not to pretend certainty. It is to show the range of what a title at
              this scale could do if the launch cadence and pricing mix break the right way.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-[1.3rem] border border-white/10 bg-black/25 p-4">
                <p className="text-[11px] uppercase tracking-[0.24em] text-white/46">Base case year 1</p>
                <p className="mt-3 font-display text-3xl uppercase tracking-[0.04em] text-white">
                  {formatCurrencyMillions(forecast.baseScenario.firstYearRevenueUsdM)}
                </p>
              </div>
              <div className="rounded-[1.3rem] border border-white/10 bg-black/25 p-4">
                <p className="text-[11px] uppercase tracking-[0.24em] text-white/46">Base case units</p>
                <p className="mt-3 font-display text-3xl uppercase tracking-[0.04em] text-white">
                  {formatMillions(forecast.baseScenario.firstYearUnitsM)}
                </p>
              </div>
              <div className="rounded-[1.3rem] border border-white/10 bg-black/25 p-4">
                <p className="text-[11px] uppercase tracking-[0.24em] text-white/46">5-year range</p>
                <p className="mt-3 font-display text-3xl uppercase tracking-[0.04em] text-white">
                  {formatCurrencyMillions(forecast.revenueRange.low)}-{formatCurrencyMillions(forecast.revenueRange.high)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-1">
            {forecast.scenarios.map((scenario) => (
              <div key={scenario.id} className="rounded-[1.6rem] border border-white/10 bg-white/6 p-5 backdrop-blur-xl">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.28em] text-white/45">{scenario.label}</p>
                    <h3 className="mt-2 font-display text-2xl uppercase tracking-[0.05em] text-white">
                      {formatCurrencyMillions(scenario.fiveYearRevenueUsdM)}
                    </h3>
                  </div>
                  <WalletCards className="h-5 w-5 text-white/38" />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/42">Year 1 units</p>
                    <p className="mt-2 text-lg text-white">{formatMillions(scenario.firstYearUnitsM)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/42">3-year revenue</p>
                    <p className="mt-2 text-lg text-white">{formatCurrencyMillions(scenario.threeYearRevenueUsdM)}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-white/66">{scenario.readout}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.05fr,0.95fr]">
        <div className="rounded-[1.8rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-5 w-5 text-white/45" />
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-white/45">Benchmark check</p>
              <h3 className="mt-2 font-display text-2xl uppercase tracking-[0.05em] text-white">Launch-year comparison</h3>
            </div>
          </div>
          <div className="mt-5 space-y-4">
            {[...forecast.benchmarks, { gameId: "gta_vi_base", title: "GTA VI (base case)", firstYearUnitsM: forecast.baseScenario.firstYearUnitsM, firstYearRevenueUsdM: forecast.baseScenario.firstYearRevenueUsdM }].map((entry) => (
              <div key={entry.gameId}>
                <div className="mb-2 flex items-center justify-between gap-4 text-sm text-white/72">
                  <span>{entry.title}</span>
                  <span>{formatCurrencyMillions(entry.firstYearRevenueUsdM)}</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(entry.firstYearRevenueUsdM / forecast.maxLaunchRevenue) * 100}%`,
                      background:
                        entry.gameId === "gta_vi_base"
                          ? "linear-gradient(90deg, #ff4f91 0%, #ffd164 100%)"
                          : "linear-gradient(90deg, rgba(255,255,255,0.42) 0%, rgba(255,255,255,0.88) 100%)"
                    }}
                  />
                </div>
                <p className="mt-2 text-[11px] uppercase tracking-[0.22em] text-white/42">{formatMillions(entry.firstYearUnitsM)} year-one units</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
          <div className="rounded-[1.8rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
            <p className="text-[11px] uppercase tracking-[0.28em] text-white/45">Assumptions</p>
            <div className="mt-4 space-y-3">
              {forecast.assumptions.map((assumption) => (
                <div key={assumption} className="rounded-[1.2rem] border border-white/8 bg-black/20 p-4 text-sm leading-7 text-white/68">
                  {assumption}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[1.8rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
            <p className="text-[11px] uppercase tracking-[0.28em] text-white/45">Potential upside</p>
            <div className="mt-4 space-y-3">
              {forecast.catalysts.map((item) => (
                <div key={item} className="rounded-[1.2rem] border border-white/8 bg-black/20 p-4 text-sm leading-7 text-white/68">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
