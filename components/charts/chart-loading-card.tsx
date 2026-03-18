export function ChartLoadingCard({
  title = "Loading chart",
  subtitle = "Preparing the analytics layer."
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <div className="rounded-[1.7rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
      <div className="mb-4">
        <h3 className="font-display text-xl uppercase tracking-[0.06em] text-white">{title}</h3>
        <p className="mt-2 text-sm text-white/58">{subtitle}</p>
      </div>
      <div className="h-[320px] animate-pulse rounded-[1.2rem] border border-white/8 bg-[linear-gradient(90deg,rgba(255,255,255,0.02),rgba(255,255,255,0.08),rgba(255,255,255,0.02))]" />
    </div>
  );
}
