import Link from "next/link";

export default function NotFound() {
  return (
    <div className="rounded-[2.4rem] border border-white/10 bg-black/25 p-10 text-center shadow-panel backdrop-blur-xl">
      <p className="text-[11px] uppercase tracking-[0.32em] text-white/45">Lost in the universe</p>
      <h1 className="mt-4 font-display text-5xl uppercase tracking-[0.05em] text-white">Page not found</h1>
      <p className="mt-4 text-sm leading-7 text-white/66">
        That Rockstar world is not present in the current seed. Return to the landing page or jump into the dashboard.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Link
          className="rounded-full border border-white/14 bg-white/10 px-5 py-3 text-xs uppercase tracking-[0.26em] text-white transition hover:bg-white/15"
          href="/"
        >
          Universe selector
        </Link>
        <Link
          className="rounded-full border border-white/12 bg-black/25 px-5 py-3 text-xs uppercase tracking-[0.26em] text-white/78 transition hover:border-white/20 hover:text-white"
          href="/dashboard"
        >
          Dashboard
        </Link>
      </div>
    </div>
  );
}
