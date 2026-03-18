import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { GameDetailClient } from "@/components/game/game-detail-client";
import { getGameBySlug } from "@/lib/data/repository";

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const game = getGameBySlug(slug);

  if (!game) {
    return {
      title: "Game not found"
    };
  }

  return {
    title: game.title,
    description: `${game.shortDescription} ${game.releaseContext}`.slice(0, 160)
  };
}

export default async function GameDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const game = getGameBySlug(slug);

  if (!game) {
    notFound();
  }

  return <GameDetailClient gameId={game.id} />;
}
