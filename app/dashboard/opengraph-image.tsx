import { getDashboardSummary } from "@/lib/data/repository";
import { formatMillions } from "@/lib/formatters";
import { contentType, renderRockstarOgImage, size } from "@/lib/og/render-og-image";

export const runtime = "edge";
export const alt = "Rockstar Sales Universe dashboard preview";
export { contentType, size };

export default function Image() {
  const summary = getDashboardSummary();

  return renderRockstarOgImage({
    eyebrow: "Analytics cockpit",
    title: "Source-first Rockstar sales dashboard",
    description: "Filter the catalog by franchise, platform, era, and confidence while keeping modeled and official values separate.",
    accent: "#f5c84b",
    secondary: "#4bb7ff",
    metrics: [
      { label: "Tracked units", value: formatMillions(summary.totalUnits.value) },
      { label: "Official as of", value: summary.latestOfficialAsOfDate },
      { label: "Confidence", value: `${Math.round(summary.averageConfidence.value * 100)}%` }
    ]
  });
}
