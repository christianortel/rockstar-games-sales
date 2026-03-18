import { ReactNode } from "react";

export function ChartShell({
  title,
  subtitle,
  children
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-[1.7rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
      <div className="mb-4">
        <h3 className="font-display text-xl uppercase tracking-[0.06em] text-white">{title}</h3>
        {subtitle ? <p className="mt-2 text-sm text-white/58">{subtitle}</p> : null}
      </div>
      <div className="h-[320px]">{children}</div>
    </div>
  );
}
