"use client";

export default function DataLabError({ reset }: { reset: () => void }) {
  return (
    <div className="rounded-[1rem] border border-white/10 bg-black/25 p-6">
      <h2 className="font-display text-3xl uppercase tracking-[0.05em] text-white">Data lab failed to load</h2>
      <button className="mt-4 rounded-full border border-white/12 bg-white/6 px-4 py-2 text-xs uppercase tracking-[0.22em] text-white/78" onClick={reset} type="button">
        Try again
      </button>
    </div>
  );
}
