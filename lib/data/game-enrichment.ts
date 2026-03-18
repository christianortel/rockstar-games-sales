import rawGameEnrichment from "@/data/raw/game-enrichment.json";
import { GameEnrichment } from "@/types/domain";

const gameEnrichment = rawGameEnrichment as Record<string, GameEnrichment>;

export function getGameEnrichment(gameId: string, parentGameId?: string) {
  const enrichment = gameEnrichment[gameId];
  const parentEnrichment = parentGameId ? gameEnrichment[parentGameId] : undefined;

  if (!enrichment) return parentEnrichment;
  if (!parentEnrichment) return enrichment;

  return {
    ...parentEnrichment,
    ...enrichment,
    summary: enrichment.summary ?? parentEnrichment.summary,
    coverImageUrl: enrichment.coverImageUrl ?? parentEnrichment.coverImageUrl
  };
}

export function getGameCoverImage(gameId: string, parentGameId?: string) {
  return getGameEnrichment(gameId, parentGameId)?.coverImageUrl;
}
