import { platformAssets } from "@/config/platformAssets";
import { gameAssets } from "@/config/gameAssets";
import { getGameCoverImage } from "@/lib/data/game-enrichment";

export function getPlatformAsset(platformId: string) {
  return platformAssets[platformId];
}

export function getGamePoster(gameId: string, parentGameId?: string) {
  return (
    gameAssets[gameId]?.posterImage ??
    getGameCoverImage(gameId, parentGameId) ??
    gameAssets[gameId]?.heroImage ??
    "/images/fallbacks/no-image.svg"
  );
}

export function getGameLogo(gameId: string) {
  return gameAssets[gameId]?.logoImage;
}
