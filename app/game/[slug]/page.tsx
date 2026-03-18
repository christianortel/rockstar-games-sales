import { notFound } from "next/navigation";

import { GameDetailClient } from "@/components/game/game-detail-client";
import { getGameBySlug } from "@/lib/data/repository";

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
