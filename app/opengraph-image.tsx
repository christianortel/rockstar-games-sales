import { contentType, renderRockstarOgImage, size } from "@/lib/og/render-og-image";

export const runtime = "edge";
export const alt = "Rockstar Sales Universe catalog preview";
export { contentType, size };

export default function Image() {
  return renderRockstarOgImage({
    eyebrow: "Rockstar release atlas",
    title: "Explore the full Rockstar catalog",
    description: "A source-aware catalog, sales model, timeline, and SQL lab for Rockstar's release history.",
    metrics: [
      { label: "Catalog", value: "54 releases" },
      { label: "Trust", value: "Provenance" },
      { label: "Mode", value: "Interactive" }
    ]
  });
}
