import { notFound } from "next/navigation";

import { getGameBySlug, getThemeForGame } from "@/lib/data/repository";
import { contentType, renderRockstarOgImage, size } from "@/lib/og/render-og-image";

export const runtime = "edge";
export const alt = "Rockstar Sales Universe title preview";
export { contentType, size };

export default async function Image({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const game = getGameBySlug(slug);

  if (!game) {
    notFound();
  }

  const theme = getThemeForGame(game.id);

  return renderRockstarOgImage({
    eyebrow: `${game.franchise} / ${game.releaseYear}`,
    title: game.title,
    description: `${game.shortDescription} ${game.releaseContext}`,
    accent: theme.accent,
    secondary: theme.accentStrong,
    metrics: [
      { label: "Units", value: `${game.estimatedLifetimeUnitsM.toFixed(1)}M` },
      { label: "Coverage", value: game.analyticsCoverage },
      { label: "Trust", value: game.fieldProvenance.lifetimeUnits.label }
    ]
  });
}
