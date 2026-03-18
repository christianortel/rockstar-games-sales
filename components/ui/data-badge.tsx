"use client";

import { Info } from "lucide-react";

import { cn } from "@/lib/utils";
import { DataMode } from "@/types/domain";

const styles: Record<DataMode, string> = {
  confirmed: "border-emerald-300/30 bg-emerald-400/10 text-emerald-100",
  estimated: "border-amber-300/30 bg-amber-400/10 text-amber-100",
  blended: "border-sky-300/30 bg-sky-400/10 text-sky-100"
};

export function DataBadge({
  mode,
  label,
  className
}: {
  mode: DataMode;
  label?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.28em]",
        styles[mode],
        className
      )}
    >
      <Info className="h-3.5 w-3.5" />
      {label ?? mode}
    </span>
  );
}
