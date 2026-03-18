import { ReactNode } from "react";

import { AnimatedCounter } from "@/components/ui/animated-counter";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  caption,
  formatter,
  icon,
  className,
  detail,
  accent
}: {
  label: string;
  value: number;
  caption: string;
  formatter: (value: number) => string;
  icon?: ReactNode;
  className?: string;
  detail?: string;
  accent?: string;
}) {
  return (
    <div
      className={cn("relative overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/6 p-5 backdrop-blur-xl", className)}
      style={accent ? { borderColor: `${accent}33` } : undefined}
    >
      {accent ? (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-14 opacity-60" style={{ background: `linear-gradient(180deg, ${accent}26 0%, transparent 100%)` }} />
      ) : null}
      <div className="flex items-center justify-between gap-4">
        <p className="text-[11px] uppercase tracking-[0.28em] text-white/45" style={accent ? { color: accent } : undefined}>
          {label}
        </p>
        {icon}
      </div>
      <p className="mt-4 font-display text-3xl uppercase tracking-[0.04em] text-white">
        <AnimatedCounter formatter={formatter} value={value} />
      </p>
      <p className="mt-2 text-sm leading-6 text-white/62">{caption}</p>
      {detail ? <p className="mt-3 text-[11px] uppercase tracking-[0.22em] text-white/38">{detail}</p> : null}
    </div>
  );
}
