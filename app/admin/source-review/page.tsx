import type { Metadata } from "next";
import { LockKeyhole, ShieldCheck } from "lucide-react";

import { SceneBackdrop } from "@/components/layout/scene-backdrop";
import { SectionShell } from "@/components/ui/section-shell";
import { getAllSources, getAssetForGame, getFieldAudits, getIngestionStatus, getThemeForGame } from "@/lib/data/repository";

export const metadata: Metadata = {
  title: "Source Review",
  description: "Read-only source and model review surface for Rockstar Sales Universe."
};

export default function SourceReviewPage() {
  const authorized = process.env.ADMIN_REVIEW_PASSWORD ? process.env.ADMIN_REVIEW_ENABLED === "true" : true;
  const theme = getThemeForGame("la_noire");
  const asset = getAssetForGame("la_noire");
  const ingestion = getIngestionStatus();
  const sources = getAllSources();
  const audits = getFieldAudits();
  const snapshotBySourceId = new Map(ingestion.sourceSnapshots.map((snapshot) => [snapshot.sourceId, snapshot]));

  return (
    <div className="space-y-8">
      <SceneBackdrop backgroundPosition={asset?.backgroundPosition} image={asset?.backgroundImage} sceneKey="source-review" theme={theme} />

      <section className="rounded-[1rem] border border-white/10 bg-black/25 p-6 shadow-panel backdrop-blur-xl md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <p className="text-[11px] uppercase tracking-[0.32em] text-white/45">Read-only admin</p>
            <h1 className="mt-3 font-display text-5xl uppercase tracking-[0.05em] text-white md:text-6xl">Source review</h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-white/68">
              This route makes source freshness, review status, and field provenance visible for interview and audit scenarios.
            </p>
          </div>
          <div className="rounded-[0.75rem] border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-3">
              {authorized ? <ShieldCheck className="h-5 w-5 text-white/55" /> : <LockKeyhole className="h-5 w-5 text-white/55" />}
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] text-white/45">Access mode</p>
                <p className="mt-1 text-sm text-white/72">{authorized ? "Review enabled" : "Locked"}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionShell accent={theme.accent} description="Latest ingestion and official reporting checkpoints." eyebrow="Ingestion" title="Data freshness">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[0.75rem] border border-white/10 bg-white/5 p-5">
            <p className="text-[11px] uppercase tracking-[0.24em] text-white/45">Latest run</p>
            <p className="mt-3 text-lg text-white">{ingestion.latestRun?.id ?? "Not run"}</p>
          </div>
          <div className="rounded-[0.75rem] border border-white/10 bg-white/5 p-5">
            <p className="text-[11px] uppercase tracking-[0.24em] text-white/45">Official as of</p>
            <p className="mt-3 text-lg text-white">{ingestion.latestOfficialAsOfDate}</p>
          </div>
          <div className="rounded-[0.75rem] border border-white/10 bg-white/5 p-5">
            <p className="text-[11px] uppercase tracking-[0.24em] text-white/45">Next checkpoint</p>
            <p className="mt-3 text-lg text-white">{ingestion.nextOfficialReportDate}</p>
          </div>
        </div>
      </SectionShell>

      <SectionShell accent={theme.accentStrong} description="Primary and enrichment sources currently trusted by the app." eyebrow="Sources" title="Source stack">
        <div className="grid gap-4 lg:grid-cols-3">
          {sources.map((source) => (
            <div key={source.id} className="rounded-[0.75rem] border border-white/10 bg-white/5 p-5">
              <div className="flex flex-wrap items-center gap-2">
                <p className="rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/45">
                  Tier {source.trustTier}
                </p>
                <p className="rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/45">
                  {source.sourceType.replace(/_/g, " ")}
                </p>
                <p className="rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/45">
                  {snapshotBySourceId.get(source.id)?.reviewStatus ?? "no snapshot"}
                </p>
              </div>
              <h2 className="mt-3 text-lg font-semibold text-white">{source.sourceName}</h2>
              <p className="mt-2 text-sm leading-7 text-white/64">{source.notes}</p>
              <p className="mt-3 text-xs leading-6 text-white/46">
                {snapshotBySourceId.get(source.id)?.notes ?? "No snapshot has been generated for this source yet."}
              </p>
            </div>
          ))}
        </div>
      </SectionShell>

      <SectionShell accent={theme.accent} description="Field-level review records generated from the typed provenance layer." eyebrow="Audit" title="Field provenance review">
        <div className="grid gap-3">
          {audits.slice(0, 24).map((audit) => (
            <div key={audit.id} className="rounded-[0.75rem] border border-white/10 bg-white/5 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-semibold text-white">{audit.gameId} / {audit.fieldName}</p>
                <span className="text-[11px] uppercase tracking-[0.22em] text-white/48">{audit.reviewStatus}</span>
              </div>
              <p className="mt-2 text-sm leading-6 text-white/62">{audit.notes}</p>
            </div>
          ))}
        </div>
      </SectionShell>
    </div>
  );
}
