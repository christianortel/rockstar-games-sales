export interface PlatformAsset {
  id: string;
  image: string;
  badgeImage?: string;
  label: string;
  wordmark: string;
}

export const platformAssets: Record<string, PlatformAsset> = {
  ps1: {
    id: "ps1",
    image: "/images/brandmarks/playstation.svg",
    badgeImage: "/images/platforms/ps1-badge.svg",
    label: "PlayStation",
    wordmark: "PLAYSTATION"
  },
  n64: { id: "n64", image: "/images/brandmarks/nintendo.svg", label: "Nintendo 64", wordmark: "N64" },
  gbc: { id: "gbc", image: "/images/brandmarks/nintendo.svg", label: "Game Boy Color", wordmark: "GAME BOY COLOR" },
  ps2: {
    id: "ps2",
    image: "/images/brandmarks/playstation.svg",
    badgeImage: "/images/platforms/ps2-badge.svg",
    label: "PlayStation 2",
    wordmark: "PS2"
  },
  xbox: {
    id: "xbox",
    image: "/images/brandmarks/xbox.svg",
    badgeImage: "/images/platforms/xbox-badge.svg",
    label: "Xbox",
    wordmark: "XBOX"
  },
  gamecube: { id: "gamecube", image: "/images/brandmarks/nintendo.svg", label: "Nintendo GameCube", wordmark: "GAMECUBE" },
  dreamcast: { id: "dreamcast", image: "/images/brandmarks/sega.svg", label: "Dreamcast", wordmark: "DREAMCAST" },
  pc: {
    id: "pc",
    image: "/images/brandmarks/windows.svg",
    badgeImage: "/images/platforms/pc-badge.svg",
    label: "PC",
    wordmark: "PC"
  },
  mac: { id: "mac", image: "/images/brandmarks/apple.svg", label: "Mac", wordmark: "MAC" },
  gba: { id: "gba", image: "/images/brandmarks/nintendo.svg", label: "Game Boy Advance", wordmark: "GBA" },
  psp: {
    id: "psp",
    image: "/images/brandmarks/playstation.svg",
    badgeImage: "/images/platforms/psp-badge.svg",
    label: "PSP",
    wordmark: "PSP"
  },
  ds: { id: "ds", image: "/images/brandmarks/nintendo.svg", label: "Nintendo DS", wordmark: "DS" },
  wii: {
    id: "wii",
    image: "/images/brandmarks/nintendo.svg",
    badgeImage: "/images/platforms/wii-badge.svg",
    label: "Wii",
    wordmark: "WII"
  },
  ps3: {
    id: "ps3",
    image: "/images/brandmarks/playstation.svg",
    badgeImage: "/images/platforms/ps3-badge.svg",
    label: "PlayStation 3",
    wordmark: "PS3"
  },
  xbox360: {
    id: "xbox360",
    image: "/images/brandmarks/xbox.svg",
    badgeImage: "/images/platforms/xbox360-badge.svg",
    label: "Xbox 360",
    wordmark: "XBOX 360"
  },
  ps4: {
    id: "ps4",
    image: "/images/brandmarks/playstation.svg",
    badgeImage: "/images/platforms/ps4-badge.svg",
    label: "PlayStation 4",
    wordmark: "PS4"
  },
  xboxone: {
    id: "xboxone",
    image: "/images/brandmarks/xbox.svg",
    badgeImage: "/images/platforms/xboxone-badge.svg",
    label: "Xbox One",
    wordmark: "XBOX ONE"
  },
  switch: {
    id: "switch",
    image: "/images/brandmarks/nintendo.svg",
    badgeImage: "/images/platforms/switch-badge.svg",
    label: "Nintendo Switch",
    wordmark: "SWITCH"
  },
  ps5: {
    id: "ps5",
    image: "/images/brandmarks/playstation.svg",
    badgeImage: "/images/platforms/ps5-badge.svg",
    label: "PlayStation 5",
    wordmark: "PS5"
  },
  seriesxs: {
    id: "seriesxs",
    image: "/images/brandmarks/xbox.svg",
    badgeImage: "/images/platforms/seriesxs-badge.svg",
    label: "Xbox Series X|S",
    wordmark: "SERIES X|S"
  },
  ios: {
    id: "ios",
    image: "/images/brandmarks/apple.svg",
    badgeImage: "/images/platforms/ios-badge.svg",
    label: "iPhone / iOS",
    wordmark: "IPHONE"
  },
  android: {
    id: "android",
    image: "/images/brandmarks/android.svg",
    badgeImage: "/images/platforms/android-badge.svg",
    label: "Android",
    wordmark: "ANDROID"
  },
  vr: {
    id: "vr",
    image: "/images/brandmarks/meta.svg",
    badgeImage: "/images/platforms/vr-badge.svg",
    label: "VR",
    wordmark: "VR"
  }
};
