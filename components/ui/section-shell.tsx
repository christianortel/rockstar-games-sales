import { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function SectionShell({
  eyebrow,
  title,
  description,
  children,
  className,
  accent,
  id
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  accent?: string;
  id?: string;
}) {
  return (
    <section
      className={cn("relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/30 p-6 shadow-panel backdrop-blur-xl md:p-8", className)}
      id={id}
      style={
        accent
          ? {
              borderColor: `${accent}33`,
              boxShadow: `0 20px 80px rgba(0,0,0,0.35), 0 0 0 1px ${accent}10, 0 0 80px ${accent}1a`
            }
          : undefined
      }
    >
      {accent ? (
        <>
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-20 opacity-60"
            style={{ background: `linear-gradient(180deg, ${accent}22 0%, transparent 100%)` }}
          />
          <div
            className="pointer-events-none absolute -right-16 top-0 h-40 w-40 rounded-full blur-3xl"
            style={{ backgroundColor: `${accent}22` }}
          />
        </>
      ) : null}
      <div className="mb-6 max-w-3xl">
        {eyebrow ? (
          <p className="mb-3 text-[11px] uppercase tracking-[0.35em] text-white/55" style={accent ? { color: accent } : undefined}>
            {eyebrow}
          </p>
        ) : null}
        <h2 className="font-display text-3xl uppercase tracking-[0.06em] text-white md:text-4xl">{title}</h2>
        {description ? <p className="mt-3 max-w-2xl text-sm leading-7 text-white/68 md:text-base">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}
