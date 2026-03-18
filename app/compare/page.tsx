import { Suspense } from "react";

import { CompareClient } from "@/components/compare/compare-client";

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="rounded-[2rem] border border-white/10 bg-black/25 p-6 text-sm text-white/60">Loading compare mode...</div>}>
      <CompareClient />
    </Suspense>
  );
}
