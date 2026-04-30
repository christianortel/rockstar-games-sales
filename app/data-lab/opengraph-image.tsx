import { contentType, renderRockstarOgImage, size } from "@/lib/og/render-og-image";

export const runtime = "edge";
export const alt = "Rockstar Sales Universe data lab preview";
export { contentType, size };

export default function Image() {
  return renderRockstarOgImage({
    eyebrow: "SQL data lab",
    title: "Inspect the Rockstar dataset directly",
    description: "Query the local tables behind the catalog, dashboard, releases, sources, and modeled sales facts.",
    accent: "#4bb7ff",
    secondary: "#f5c84b",
    metrics: [
      { label: "Mode", value: "Browser SQL" },
      { label: "Tables", value: "Raw + derived" },
      { label: "Trust", value: "Inspectable" }
    ]
  });
}
