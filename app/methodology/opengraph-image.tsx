import { getIngestionStatus } from "@/lib/data/repository";
import { contentType, renderRockstarOgImage, size } from "@/lib/og/render-og-image";

export const runtime = "edge";
export const alt = "Rockstar Sales Universe methodology preview";
export { contentType, size };

export default function Image() {
  const ingestion = getIngestionStatus();

  return renderRockstarOgImage({
    eyebrow: "Methodology",
    title: "Official anchors, modeled gaps, visible confidence",
    description: "A transparent read on what Rockstar and Take-Two disclose, what the app models, and where confidence changes.",
    accent: "#f5c84b",
    secondary: "#ff6f3d",
    metrics: [
      { label: "Official as of", value: ingestion.latestOfficialAsOfDate },
      { label: "Model", value: ingestion.modelVersion.replace("blend-model-", "v") },
      { label: "Next report", value: ingestion.nextOfficialReportDate }
    ]
  });
}
