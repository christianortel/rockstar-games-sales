"use client";

import { FieldProvenance } from "@/types/domain";

const toneClasses: Record<FieldProvenance["tag"], string> = {
  official: "border-emerald-400/35 bg-emerald-400/12 text-emerald-100",
  modeled: "border-amber-300/35 bg-amber-300/12 text-amber-50",
  inherited: "border-sky-300/35 bg-sky-300/12 text-sky-50",
  enriched: "border-fuchsia-300/35 bg-fuchsia-300/12 text-fuchsia-50"
};

export function ProvenanceBadge({
  provenance,
  compact = false
}: {
  provenance: FieldProvenance;
  compact?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 uppercase tracking-[0.2em] ${compact ? "text-[9px]" : "text-[10px]"} ${toneClasses[provenance.tag]}`}
      title={provenance.reason}
    >
      {provenance.label}
    </span>
  );
}
