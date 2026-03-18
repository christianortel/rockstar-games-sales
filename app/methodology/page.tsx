import type { Metadata } from "next";

import { SceneBackdrop } from "@/components/layout/scene-backdrop";
import { ProvenanceDrawer } from "@/components/ui/provenance-drawer";
import { SectionShell } from "@/components/ui/section-shell";
import {
  getAllMethodologies,
  getAllSources,
  getAssetForGame,
  getLastVerifiedAt,
  getThemeForGame
} from "@/lib/data/repository";

const methodology = getAllMethodologies()[0];
const sources = getAllSources();
const theme = getThemeForGame("la_noire");
const asset = getAssetForGame("la_noire");

export const metadata: Metadata = {
  title: "Methodology",
  description:
    "Read the trust stack behind the project, including official anchors, modeled layers, confidence logic, and metadata provenance."
};

export default function MethodologyPage() {
  return (
    <div className="space-y-8">
      <SceneBackdrop
        backgroundPosition={asset?.backgroundPosition}
        image={asset?.backgroundImage}
        sceneKey="methodology"
        theme={theme}
      />

      <section className="rounded-[2.5rem] border border-white/10 bg-black/25 p-6 shadow-panel backdrop-blur-xl md:p-8">
        <div className="grid gap-8 xl:grid-cols-[1.15fr,0.85fr]">
          <div>
            <p className="text-[11px] uppercase tracking-[0.32em] text-white/45">Methodology and provenance</p>
            <h1 className="mt-3 max-w-[12ch] font-display text-5xl uppercase tracking-[0.05em] text-white md:text-7xl">
              Data notes, trust tiers, and limits
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-white/70">
              This project is designed to be visually assertive without pretending its modeled layers are official. Every
              title, chart, and KPI inherits the same explicit source hierarchy.
            </p>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-white/6 p-6">
            <p className="text-[11px] uppercase tracking-[0.28em] text-white/45">Quick summary</p>
            <div className="mt-4 space-y-3 text-sm leading-7 text-white/68">
              <p>Tier 1 sources anchor the official layer: Take-Two investor materials and Rockstar catalog references.</p>
              <p>Tier 2 sources support metadata enrichment such as platform history and release records.</p>
              <p>Tier 3 sources are internal modeling assumptions and never appear as official facts.</p>
            </div>
            <div className="mt-5">
              <ProvenanceDrawer
                lastVerifiedAt={getLastVerifiedAt()}
                methodology={methodology}
                sources={sources}
                summary="The full project source stack, assumptions, and last-verified timestamp are all exposed here so the visual polish never obscures data honesty."
                triggerLabel="Open full source stack"
              />
            </div>
          </div>
        </div>
      </section>

      <SectionShell
        description="The app always distinguishes what is official, what is modeled, and what is blended for usability."
        eyebrow="Data modes"
        title="Confirmed, estimated, blended"
      >
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
            <h3 className="font-display text-2xl uppercase tracking-[0.05em] text-white">Confirmed</h3>
            <p className="mt-4 text-sm leading-7 text-white/66">
              Restricts the view to directly disclosed title milestones. This mode is deliberately sparse because official
              Rockstar sell-in disclosure is sparse.
            </p>
          </div>
          <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
            <h3 className="font-display text-2xl uppercase tracking-[0.05em] text-white">Estimated</h3>
            <p className="mt-4 text-sm leading-7 text-white/66">
              Uses the full modeled layer for every tracked title, including platform splits, regional allocations, and
              lifetime cadence.
            </p>
          </div>
          <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
            <h3 className="font-display text-2xl uppercase tracking-[0.05em] text-white">Blended</h3>
            <p className="mt-4 text-sm leading-7 text-white/66">
              Defaults to official totals where they exist, then transparently layers modeled granularity so the dashboard
              stays usable.
            </p>
          </div>
        </div>
      </SectionShell>

      <SectionShell
        description="Confidence is not arbitrary styling. It is a compact expression of source quality and modeling distance."
        eyebrow="Scoring"
        title="How confidence is derived"
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 text-sm leading-7 text-white/66">
            Official title milestone present: stronger base score.
          </div>
          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 text-sm leading-7 text-white/66">
            Platform or region split only: weaker score because Rockstar does not disclose those layers publicly.
          </div>
          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 text-sm leading-7 text-white/66">
            Older catalog titles decay slightly because public updates are rarer and less granular.
          </div>
          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 text-sm leading-7 text-white/66">
            Trust tiers from sources inform the baseline before title-specific adjustments are applied.
          </div>
        </div>
      </SectionShell>

      <SectionShell
        description="The app is designed to make future data upgrades cheap rather than painful."
        eyebrow="Architecture"
        title="Expansion path"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
            <h3 className="font-display text-2xl uppercase tracking-[0.05em] text-white">Data roadmap</h3>
            <div className="mt-4 space-y-3 text-sm leading-7 text-white/66">
              <p>Swap local seed data for Supabase-backed normalized tables without changing most UI components.</p>
              <p>Replace modeled platform splits with better research-backed allocations as stronger sources become available.</p>
              <p>Pull structured metadata from IGDB, RAWG, or MobyGames when credentials and attribution rules are in place.</p>
            </div>
          </div>
          <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
            <h3 className="font-display text-2xl uppercase tracking-[0.05em] text-white">Asset roadmap</h3>
            <div className="mt-4 space-y-3 text-sm leading-7 text-white/66">
              <p>All visual assets run through centralized config, so backgrounds, logos, gallery strips, and fallbacks can be swapped cleanly.</p>
              <p>Image attribution rules can be added at the asset-record level without rewriting page components.</p>
              <p>Remote imagery is allowed by `next.config.ts`, but the MVP ships with local SVG scenes so it runs immediately.</p>
            </div>
          </div>
        </div>
      </SectionShell>
    </div>
  );
}
