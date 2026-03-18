import { gameAssets } from "@/config/gameAssets";
import { gameThemes } from "@/config/gameThemes";
import { ThemeDefinition, ThemeKey } from "@/types/domain";

export function getTheme(themeKey: ThemeKey): ThemeDefinition {
  return gameThemes[themeKey];
}

export function getGameAsset(gameId: string) {
  return gameAssets[gameId];
}

export function blendThemeKeys(themeKeys: ThemeKey[]): ThemeDefinition {
  const uniqueKeys = Array.from(new Set(themeKeys)).slice(0, 4);
  const sourceThemes = uniqueKeys.length ? uniqueKeys.map(getTheme) : [gameThemes.heist_gold];

  return {
    ...sourceThemes[0],
    label: "Universe Blend",
    accentSoft: sourceThemes[1]?.accentSoft ?? sourceThemes[0].accentSoft,
    accentStrong: sourceThemes[2]?.accentStrong ?? sourceThemes[0].accentStrong,
    chartPalette: sourceThemes.flatMap((theme) => theme.chartPalette).slice(0, 4)
  };
}
