import { platformAssets } from "@/config/platformAssets";
import { gameAssets } from "@/config/gameAssets";

export function getPlatformAsset(platformId: string) {
  return platformAssets[platformId];
}

export function getGamePoster(gameId: string) {
  return gameAssets[gameId]?.posterImage ?? gameAssets[gameId]?.heroImage ?? "/images/fallbacks/no-image.svg";
}

export function getGameLogo(gameId: string) {
  return gameAssets[gameId]?.logoImage;
}
