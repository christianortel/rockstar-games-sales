import type { Metadata } from "next";
import { Suspense } from "react";

import { DashboardClient } from "@/components/dashboard/dashboard-client";

export const metadata: Metadata = {
  title: "Atlas",
  description:
    "Filter Rockstar's catalog by franchise, platform, era, and data mode with visible provenance and confidence reads."
};

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="rounded-[2rem] border border-white/10 bg-black/25 p-6 text-sm text-white/60">Loading dashboard...</div>}>
      <DashboardClient />
    </Suspense>
  );
}
