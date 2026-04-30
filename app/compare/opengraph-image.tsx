import { getFeaturedDashboardRows } from "@/lib/data/repository";
import { formatMillions } from "@/lib/formatters";
import { contentType, renderRockstarOgImage, size } from "@/lib/og/render-og-image";

export const runtime = "edge";
export const alt = "Rockstar Sales Universe compare mode preview";
export { contentType, size };

export default function Image() {
  const leaders = getFeaturedDashboardRows()
    .slice()
    .sort((a, b) => b.blendedUnitsM - a.blendedUnitsM)
    .slice(0, 2);

  return renderRockstarOgImage({
    eyebrow: "Compare mode",
    title: "Build a Rockstar head-to-head slate",
    description: "Compare lifetime scale, platform spread, regional mix, confidence, and source context across selected titles.",
    accent: "#ff7a3d",
    secondary: "#f5c84b",
    metrics: leaders.map((row) => ({
      label: row.game.title,
      value: formatMillions(row.blendedUnitsM)
    }))
  });
}
