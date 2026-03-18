import type { Metadata } from "next";

import { UniverseLanding } from "@/components/layout/universe-landing";

export const metadata: Metadata = {
  title: "Catalog",
  description:
    "Browse the full Rockstar release catalog with title context, cover art, confidence cues, and transparent sales modeling."
};

export default function HomePage() {
  return <UniverseLanding />;
}
