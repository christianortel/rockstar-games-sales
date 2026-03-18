"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, FlaskConical, ShieldCheck, X } from "lucide-react";
import { useState } from "react";

import { Methodology, SourceRecord } from "@/types/domain";

export function ProvenanceDrawer({
  title = "Methodology & Sources",
  summary,
  methodology,
  sources,
  lastVerifiedAt,
  triggerLabel = "Open Provenance"
}: {
  title?: string;
  summary: string;
  methodology?: Methodology;
  sources: SourceRecord[];
  lastVerifiedAt?: string;
  triggerLabel?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.24em] text-white/85 transition hover:border-white/30 hover:bg-white/10"
        onClick={() => setOpen(true)}
        type="button"
      >
        <FlaskConical className="h-4 w-4" />
        {triggerLabel}
      </button>
      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-stretch justify-end bg-black/55 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.aside
              className="relative h-full w-full max-w-xl overflow-y-auto border-l border-white/12 bg-[#0b0c0f]/95 p-6"
              initial={{ x: 60 }}
              animate={{ x: 0 }}
              exit={{ x: 60 }}
            >
              <button
                className="absolute right-4 top-4 rounded-full border border-white/12 bg-white/5 p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
                onClick={() => setOpen(false)}
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
              <p className="mb-3 text-[11px] uppercase tracking-[0.35em] text-white/45">Provenance</p>
              <h3 className="font-display text-3xl uppercase tracking-[0.06em] text-white">{title}</h3>
              <p className="mt-4 text-sm leading-7 text-white/68">{summary}</p>
              {lastVerifiedAt ? (
                <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-white/55">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Last verified {lastVerifiedAt}
                </div>
              ) : null}

              {methodology ? (
                <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.28em] text-white/45">Methodology</p>
                      <h4 className="mt-2 font-display text-xl uppercase tracking-[0.06em] text-white">{methodology.name}</h4>
                    </div>
                    <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-white/55">
                      v{methodology.version}
                    </span>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-white/66">{methodology.description}</p>
                  <div className="mt-5 grid gap-5 md:grid-cols-2">
                    <div>
                      <p className="mb-2 text-[11px] uppercase tracking-[0.28em] text-white/45">Assumptions</p>
                      <ul className="space-y-2 text-sm text-white/68">
                        {methodology.assumptions.map((item) => (
                          <li key={item}>- {item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="mb-2 text-[11px] uppercase tracking-[0.28em] text-white/45">Formula Notes</p>
                      <ul className="space-y-2 text-sm text-white/68">
                        {methodology.formulaNotes.map((item) => (
                          <li key={item}>- {item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="mt-8 space-y-4">
                <p className="text-[11px] uppercase tracking-[0.28em] text-white/45">Source Stack</p>
                {sources.map((source) => (
                  <div key={source.id} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-white/55">
                        Tier {source.trustTier}
                      </span>
                      <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-white/55">
                        {source.sourceType.replaceAll("_", " ")}
                      </span>
                    </div>
                    <h4 className="mt-4 text-lg font-semibold text-white">{source.sourceName}</h4>
                    <p className="mt-2 text-sm leading-7 text-white/65">{source.notes}</p>
                    <div className="mt-4 flex items-center justify-between gap-4">
                      <span className="text-xs uppercase tracking-[0.24em] text-white/40">Accessed {source.accessedAt}</span>
                      <a
                        className="inline-flex items-center gap-2 text-sm text-white/80 transition hover:text-white"
                        href={source.sourceUrl}
                        rel="noreferrer"
                        target="_blank"
                      >
                        Visit source
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
