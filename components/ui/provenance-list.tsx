"use client";

import { FieldProvenance } from "@/types/domain";

import { ProvenanceBadge } from "@/components/ui/provenance-badge";

export function ProvenanceList({
  items
}: {
  items: Array<{ label: string; provenance: FieldProvenance }>;
}) {
  return (
    <div className="grid gap-3">
      {items.map((item) => (
        <div key={item.label} className="rounded-[1.2rem] border border-white/8 bg-black/20 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-[11px] uppercase tracking-[0.24em] text-white/48">{item.label}</p>
            <ProvenanceBadge provenance={item.provenance} />
          </div>
          <p className="mt-3 text-sm leading-7 text-white/68">{item.provenance.reason}</p>
        </div>
      ))}
    </div>
  );
}
