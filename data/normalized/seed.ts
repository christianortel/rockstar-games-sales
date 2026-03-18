import rawOfficialSalesEvents from "@/data/raw/official-sales-events.json";
import rawSources from "@/data/raw/sources.json";
import rawGameEnrichment from "@/data/raw/game-enrichment.json";
import { catalogSeeds, featuredGameIds } from "@/data/normalized/catalog";
import {
  AnalyticsCoverage,
  Game,
  GameProfile,
  Methodology,
  OfficialSalesEvent,
  Platform,
  Region,
  Release,
  SourceRecord,
  ThemeKey
} from "@/types/domain";

export const sources = rawSources as SourceRecord[];
export const officialSalesEvents = rawOfficialSalesEvents as OfficialSalesEvent[];
const gameEnrichment = rawGameEnrichment as Record<string, { summary?: string }>;

export const methodologies: Methodology[] = [
  {
    id: "blend-model-v1",
    name: "Blended franchise allocation model",
    description:
      "Uses official franchise and title milestones as hard anchors, then allocates undisclosed platform, region, and annual values with release timing, platform generation fit, and historical franchise behavior.",
    assumptions: [
      "Official Take-Two title or franchise sell-in numbers override all modeled totals.",
      "Undisclosed platform splits are allocated from launch platform mix, install-base context, and later re-release cadence.",
      "Regional distributions are modeled conservatively and normalized to 100% across tracked regions.",
      "Older catalog titles are treated as lower-confidence because Rockstar and Take-Two rarely publish updated sell-in totals for them."
    ],
    formulaNotes: [
      "blendedUnits = confirmedUnits ?? estimatedUnits",
      "estimatedRevenue = estimatedUnits * averageSellingPrice",
      "platformYearUnits = lifetimeUnits * platformShare * yearlyWeight * regionShare",
      "confidenceScore combines source tier, official coverage, and release-era distance"
    ],
    version: "1.1.0"
  }
];

export const regions: Region[] = [
  { id: "north_america", name: "North America", slug: "na" },
  { id: "europe", name: "Europe", slug: "europe" },
  { id: "asia_pacific", name: "Asia Pacific", slug: "apac" },
  { id: "latin_america", name: "Latin America", slug: "latam" }
];

export const platforms: Platform[] = [
  { id: "ps1", slug: "ps1", name: "PlayStation", manufacturer: "Sony", generation: "gen5", releaseYear: 1994, iconText: "PS", family: "PlayStation" },
  { id: "n64", slug: "n64", name: "Nintendo 64", manufacturer: "Nintendo", generation: "gen5", releaseYear: 1996, iconText: "N64", family: "Nintendo" },
  { id: "gbc", slug: "game-boy-color", name: "Game Boy Color", manufacturer: "Nintendo", generation: "portable", releaseYear: 1998, iconText: "GBC", family: "Nintendo" },
  { id: "ps2", slug: "ps2", name: "PlayStation 2", manufacturer: "Sony", generation: "gen6", releaseYear: 2000, iconText: "PS2", family: "PlayStation" },
  { id: "xbox", slug: "xbox", name: "Xbox", manufacturer: "Microsoft", generation: "gen6", releaseYear: 2001, iconText: "XB", family: "Xbox" },
  { id: "gamecube", slug: "gamecube", name: "Nintendo GameCube", manufacturer: "Nintendo", generation: "gen6", releaseYear: 2001, iconText: "GC", family: "Nintendo" },
  { id: "dreamcast", slug: "dreamcast", name: "Dreamcast", manufacturer: "Sega", generation: "gen6", releaseYear: 1999, iconText: "DC", family: "Sega" },
  { id: "pc", slug: "pc", name: "PC", manufacturer: "Microsoft", generation: "pc", releaseYear: 1981, iconText: "PC", family: "PC" },
  { id: "mac", slug: "mac", name: "Mac", manufacturer: "Apple", generation: "pc", releaseYear: 1984, iconText: "MAC", family: "PC" },
  { id: "gba", slug: "game-boy-advance", name: "Game Boy Advance", manufacturer: "Nintendo", generation: "portable", releaseYear: 2001, iconText: "GBA", family: "Nintendo" },
  { id: "psp", slug: "psp", name: "PSP", manufacturer: "Sony", generation: "portable", releaseYear: 2004, iconText: "PSP", family: "PlayStation" },
  { id: "ds", slug: "nintendo-ds", name: "Nintendo DS", manufacturer: "Nintendo", generation: "portable", releaseYear: 2004, iconText: "DS", family: "Nintendo" },
  { id: "wii", slug: "wii", name: "Wii", manufacturer: "Nintendo", generation: "gen7", releaseYear: 2006, iconText: "Wii", family: "Nintendo" },
  { id: "ps3", slug: "ps3", name: "PlayStation 3", manufacturer: "Sony", generation: "gen7", releaseYear: 2006, iconText: "PS3", family: "PlayStation" },
  { id: "xbox360", slug: "xbox-360", name: "Xbox 360", manufacturer: "Microsoft", generation: "gen7", releaseYear: 2005, iconText: "360", family: "Xbox" },
  { id: "ps4", slug: "ps4", name: "PlayStation 4", manufacturer: "Sony", generation: "gen8", releaseYear: 2013, iconText: "PS4", family: "PlayStation" },
  { id: "xboxone", slug: "xbox-one", name: "Xbox One", manufacturer: "Microsoft", generation: "gen8", releaseYear: 2013, iconText: "ONE", family: "Xbox" },
  { id: "ios", slug: "ios", name: "iOS", manufacturer: "Apple", generation: "mobile", releaseYear: 2007, iconText: "iOS", family: "Mobile" },
  { id: "android", slug: "android", name: "Android", manufacturer: "Google", generation: "mobile", releaseYear: 2008, iconText: "AND", family: "Mobile" },
  { id: "switch", slug: "switch", name: "Nintendo Switch", manufacturer: "Nintendo", generation: "portable", releaseYear: 2017, iconText: "SW", family: "Nintendo" },
  { id: "ps5", slug: "ps5", name: "PlayStation 5", manufacturer: "Sony", generation: "gen9", releaseYear: 2020, iconText: "PS5", family: "PlayStation" },
  { id: "seriesxs", slug: "series-xs", name: "Xbox Series X|S", manufacturer: "Microsoft", generation: "gen9", releaseYear: 2020, iconText: "XS", family: "Xbox" },
  { id: "vr", slug: "vr", name: "VR", manufacturer: "Mixed", generation: "vr", releaseYear: 2017, iconText: "VR", family: "VR" }
];

const platformById = new Map(platforms.map((platform) => [platform.id, platform]));

function inferTheme(franchise: string, title: string): ThemeKey {
  if (franchise === "Red Dead Redemption" || franchise === "Red Dead") return "frontier_noir";
  if (franchise === "L.A. Noire") return "noir_detective";
  if (franchise === "Bully") return "school_rebel";
  if (franchise === "Midnight Club" || franchise === "Smuggler's Run") return "street_racer_glow";
  if (franchise === "Max Payne" || franchise === "Manhunt" || franchise === "Oni") return "max_pain_cold";
  if (title.includes("Vice City")) return "vice_neon";
  if (title.includes("San Andreas")) return "san_andreas_sunfade";
  if (title.includes("Grand Theft Auto IV") || title.includes("Liberty City")) return "liberty_steel";
  if (title.includes("Grand Theft Auto V") || title.includes("Grand Theft Auto Online")) return "heist_gold";
  if (franchise === "Grand Theft Auto") return "liberty_steel";
  return "heist_gold";
}

function inferUniverseStyle(themeKey: ThemeKey) {
  const copy: Record<ThemeKey, string> = {
    frontier_noir: "Western dust, high-contrast skies, and elegiac frontier tension.",
    vice_neon: "Neon haze, nightlife excess, and pastel criminal glamour.",
    san_andreas_sunfade: "Sun-baked streets, lowrider energy, and sprawling west-coast scale.",
    noir_detective: "Case boards, cigarette smoke, and monochrome city intrigue.",
    school_rebel: "Uniform rebellion, dorm grime, and cult-hit mischief.",
    max_pain_cold: "Cold steel, urban pressure, and hard-edged action framing.",
    street_racer_glow: "Streetlight reflections, after-hours speed, and console-era velocity.",
    liberty_steel: "Concrete skyline grit, migration-era drama, and metallic tension.",
    heist_gold: "Premium crime spectacle, high-value ambition, and blockbuster polish."
  };

  return copy[themeKey];
}

function buildCatalogShortDescription(title: string, coverage: AnalyticsCoverage, kind: Game["kind"]) {
  if (coverage === "featured") return "";
  if (kind === "online_service") return `${title} is modeled as a service-layer extension connected to its parent release footprint.`;
  if (kind === "expansion" || kind === "mission_pack") return `${title} is modeled as a connected extension inside Rockstar's broader commercial timeline.`;
  if (kind === "variant") return `${title} is modeled as a re-release or format variant within Rockstar's release history.`;
  return `${title} is included in the complete Rockstar release catalog with low-confidence modeled commercial coverage.`;
}

function buildCatalogLongDescription(title: string, coverage: AnalyticsCoverage, role: Game["rockstarRole"]) {
  if (coverage === "featured") return "";
  return `${title} is included so the app can represent Rockstar's full commercial and historical release footprint. This entry uses a lower-confidence modeled layer based on release timing, platform mix, franchise strength, and Rockstar role rather than direct title-level disclosure. Rockstar's role on this release is labeled as ${role}.`;
}

function buildCatalogHeroTagline(year: number, kind: Game["kind"], coverage: AnalyticsCoverage) {
  if (coverage === "featured") return "";
  if (kind === "online_service") return `${year} live-service layer estimated from the parent title's commercial base.`;
  if (kind === "expansion" || kind === "mission_pack") return `${year} extension release modeled from parent demand and launch context.`;
  if (kind === "variant") return `${year} re-release or format variant with an estimated long-tail contribution.`;
  return `${year} Rockstar release modeled into the wider commercial universe.`;
}

function buildCatalogHeadline(kind: Game["kind"]) {
  if (kind === "online_service") return "Low-confidence service-layer estimate tied back to the parent release footprint.";
  if (kind === "expansion" || kind === "mission_pack") return "Low-confidence extension estimate tied to parent-title demand.";
  if (kind === "variant") return "Low-confidence variant estimate capturing the commercial afterlife of a re-release.";
  return "Low-confidence title estimate built from release-era and platform context.";
}

function summarizePlatforms(platformIds: string[]) {
  const names = platformIds.map((platformId) => platformById.get(platformId)?.name ?? platformId);

  if (names.length <= 2) {
    return names.join(" and ");
  }

  if (names.length === 3) {
    return `${names[0]}, ${names[1]}, and ${names[2]}`;
  }

  return `${names[0]}, ${names[1]}, and ${names.length - 2} more`;
}

function buildCatalogFactLine(seed: (typeof catalogSeeds)[number]) {
  if (seed.kind === "online_service") {
    return `Launched in ${seed.year} as a live-service layer tied to ${seed.parentGameId ? "its parent title" : "Rockstar's wider catalog"}.`;
  }

  if (seed.kind === "expansion" || seed.kind === "mission_pack") {
    return `Released in ${seed.year} as an add-on, first tracked on ${summarizePlatforms(seed.platforms)}.`;
  }

  if (seed.kind === "variant") {
    return `Re-release from ${seed.year}, tracked across ${summarizePlatforms(seed.platforms)}.`;
  }

  const roleLabel =
    seed.rockstarRole === "developed"
      ? "Rockstar-developed"
      : seed.rockstarRole === "published"
        ? "Rockstar-published"
        : "Rockstar-presented";

  return `${roleLabel} release from ${seed.year}, first tracked on ${summarizePlatforms(seed.platforms)}.`;
}

function buildCatalogGame(seed: (typeof catalogSeeds)[number]): Game {
  const analyticsCoverage: AnalyticsCoverage = featuredGameIds.includes(seed.id) ? "featured" : "supported";
  const themeKey = inferTheme(seed.franchise, seed.title);
  const enrichment = gameEnrichment[seed.id] ?? (seed.parentGameId ? gameEnrichment[seed.parentGameId] : undefined);
  const roleDeveloperMap = {
    developed: "Rockstar Studios",
    published: "Third-party / Rockstar-published",
    presented: "Rockstar Games Presents"
  } as const;

  return {
    id: seed.id,
    slug: seed.slug,
    title: seed.title,
    franchise: seed.franchise,
    kind: seed.kind,
    rockstarRole: seed.rockstarRole,
    analyticsCoverage,
    parentGameId: seed.parentGameId,
    releaseYear: seed.year,
    originalReleaseDate: seed.releaseDate ?? `${seed.year}-01-01`,
    releaseDatePrecision: seed.releaseDatePrecision ?? (seed.releaseDate ? "day" : "year"),
    shortDescription: enrichment?.summary ?? buildCatalogShortDescription(seed.title, analyticsCoverage, seed.kind),
    longDescription: buildCatalogLongDescription(seed.title, analyticsCoverage, seed.rockstarRole),
    themeKey,
    universeStyle: inferUniverseStyle(themeKey),
    heroTagline: buildCatalogHeroTagline(seed.year, seed.kind, analyticsCoverage),
    status: seed.status ?? "released",
    developer: roleDeveloperMap[seed.rockstarRole],
    publisher: "Rockstar Games",
    criticsAngle: "Catalog-only entry retained for complete Rockstar timeline coverage.",
    averageSellingPriceUsd: 0,
    estimatedLifetimeUnitsM: 0,
    headlineMetric: buildCatalogFactLine(seed),
    galleryCaption: "Catalog entry using centralized theme and asset fallbacks.",
    methodologyId: "blend-model-v1"
  };
}

const featuredOverrides: Record<string, Partial<Game>> = {
  gta_v: {
    releaseDatePrecision: "day",
    originalReleaseDate: "2013-09-17",
    shortDescription: "Rockstar's biggest release, spanning three console generations.",
    longDescription:
      "Grand Theft Auto V is Rockstar's defining multi-generation blockbuster: a Los Santos crime epic whose premium sales tail, platform reach, and live-service pull keep it central to Take-Two's commercial story more than a decade after launch.",
    themeKey: "heist_gold",
    universeStyle: "A modern crime blockbuster with broad platform reach and exceptional long-tail sales.",
    heroTagline: "Los Santos, three protagonists, and Rockstar's longest-running hit.",
    developer: "Rockstar North",
    criticsAngle: "A benchmark for long-tail premium game monetization and cross-generation retention.",
    averageSellingPriceUsd: 31,
    estimatedLifetimeUnitsM: 225,
    confirmedLifetimeUnitsM: 225,
    headlineMetric: "Best-selling Rockstar release in the dataset.",
    galleryCaption: "Los Santos' premium chaos and long-tail live service momentum."
  },
  san_andreas: {
    releaseDatePrecision: "day",
    originalReleaseDate: "2004-10-26",
    shortDescription: "A defining open-world release of the PS2 era.",
    longDescription:
      "San Andreas remains one of Rockstar's most important era-defining releases, pairing massive PS2-era volume with persistent re-release relevance and a fan legacy that still props up franchise nostalgia and catalog demand.",
    themeKey: "san_andreas_sunfade",
    universeStyle: "A landmark sixth-generation release with an outsized PS2-era footprint.",
    heroTagline: "State-scale ambition with enduring catalog demand.",
    developer: "Rockstar North",
    criticsAngle: "A catalog giant with disproportionate sixth-generation concentration.",
    averageSellingPriceUsd: 24,
    estimatedLifetimeUnitsM: 27.4,
    headlineMetric: "One of Rockstar's strongest catalog performers, led by PS2.",
    galleryCaption: "Orange skies, gangland legend, and PS2-era scale."
  },
  vice_city: {
    releaseDatePrecision: "day",
    originalReleaseDate: "2002-10-29",
    shortDescription: "A breakout GTA release with one of Rockstar's most recognizable settings.",
    longDescription:
      "Vice City pushed Rockstar's tone-setting muscle into the mainstream, with a release profile that skewed heavily toward PlayStation 2 before expanding through Xbox, PC, and later mobile catalog ports.",
    themeKey: "vice_neon",
    universeStyle: "A style-led GTA entry with concentrated early console sales and a durable catalog afterlife.",
    heroTagline: "A defining early-2000s GTA release with strong PS2 momentum and long-tail ports.",
    developer: "Rockstar North",
    criticsAngle: "A brand-building phenomenon with a sharply concentrated launch-platform mix.",
    averageSellingPriceUsd: 22,
    estimatedLifetimeUnitsM: 17.5,
    headlineMetric: "PS2 remains the core of Vice City's lifetime sales profile.",
    galleryCaption: "Pink haze, palm silhouettes, and Miami crime fantasy."
  },
  gta_iv: {
    releaseDatePrecision: "day",
    originalReleaseDate: "2008-04-29",
    shortDescription: "Rockstar's HD-era reset for Liberty City.",
    longDescription:
      "Grand Theft Auto IV sits at Rockstar's transition into HD-era systems, with a more balanced Sony/Microsoft split than the PS2 heavyweights and a meaningful but smaller PC tail.",
    themeKey: "liberty_steel",
    universeStyle: "An HD-era GTA release with stronger Xbox 360 contribution than earlier GTA titles.",
    heroTagline: "A major seventh-generation launch with balanced console support.",
    developer: "Rockstar North",
    criticsAngle: "Commercially powerful, but structurally less all-platform dominant than GTA V.",
    averageSellingPriceUsd: 29,
    estimatedLifetimeUnitsM: 25,
    headlineMetric: "A major gen-7 release between classic GTA scale and GTA V's long tail.",
    galleryCaption: "Rain-slicked high-rises and East Coast compression."
  },
  red_dead_redemption: {
    releaseDatePrecision: "day",
    originalReleaseDate: "2010-05-18",
    shortDescription: "Rockstar's first blockbuster western and a long-tail catalog staple.",
    longDescription:
      "The original Red Dead Redemption established Rockstar's modern western commercial template, with a heavy seventh-generation base and a later lift from re-releases on modern consoles and PC.",
    themeKey: "frontier_noir",
    universeStyle: "A console-led western release whose commercial life extended through later ports.",
    heroTagline: "A western hit with a strong gen-7 base and later re-release support.",
    developer: "Rockstar San Diego",
    criticsAngle: "A strong gen-7 western with a meaningful modern-port epilogue.",
    averageSellingPriceUsd: 28,
    estimatedLifetimeUnitsM: 24,
    headlineMetric: "Modern ports expanded the reach of an already strong seventh-generation release.",
    galleryCaption: "Desert dusk and frontier finality."
  },
  red_dead_redemption_2: {
    releaseDatePrecision: "day",
    originalReleaseDate: "2018-10-26",
    shortDescription: "A blockbuster western with one of Rockstar's largest official milestones.",
    longDescription:
      "Red Dead Redemption 2 is Rockstar's prestige western at blockbuster scale, combining exceptional premium sell-in with a premium-console concentration that still skews more heavily to Sony and Microsoft than to PC.",
    themeKey: "frontier_noir",
    universeStyle: "A premium Rockstar release with heavy PS4 and Xbox One concentration plus later PC expansion.",
    heroTagline: "Large launch scale, premium positioning, and durable sell-through.",
    developer: "Rockstar Studios",
    criticsAngle: "A rare premium release that sustained blockbuster scale without matching GTA V's platform sprawl.",
    averageSellingPriceUsd: 42,
    estimatedLifetimeUnitsM: 82,
    confirmedLifetimeUnitsM: 82,
    headlineMetric: "Second-largest officially disclosed Rockstar title milestone in the dataset.",
    galleryCaption: "Snow, smoke, and gold-hour frontier drama."
  },
  la_noire: {
    releaseDatePrecision: "day",
    originalReleaseDate: "2011-05-17",
    shortDescription: "A detective drama with a smaller launch and an unusually long afterlife.",
    longDescription:
      "L.A. Noire stands apart in Rockstar's portfolio as a noir investigative experience with a modest but resilient commercial afterlife through remasters, Switch, and VR editions.",
    themeKey: "noir_detective",
    universeStyle: "A prestige release with modest scale but broad re-release coverage.",
    heroTagline: "A catalog outlier kept alive by remasters, Switch, and VR.",
    developer: "Team Bondi / Rockstar Leeds",
    criticsAngle: "Prestige catalog title with a surprisingly broad re-release footprint.",
    averageSellingPriceUsd: 26,
    estimatedLifetimeUnitsM: 6.3,
    headlineMetric: "Remasters and VR extended the commercial life of L.A. Noire.",
    galleryCaption: "Case files, lamp light, and city corruption."
  },
  bully: {
    releaseDatePrecision: "day",
    originalReleaseDate: "2006-10-17",
    shortDescription: "A cult Rockstar release with a durable re-release history.",
    longDescription:
      "Bully never reached GTA-level volume, but its long shelf life across Scholarship Edition and later PC/mobile releases turned it into one of Rockstar's most durable cult properties.",
    themeKey: "school_rebel",
    universeStyle: "A cult title whose commercial relevance comes from portability and reissues.",
    heroTagline: "Smaller scale than GTA, but unusually persistent across later platforms.",
    developer: "Rockstar Vancouver",
    criticsAngle: "Lower-volume than Rockstar's blockbusters, but notable for cult demand and re-release persistence.",
    averageSellingPriceUsd: 20,
    estimatedLifetimeUnitsM: 3.8,
    headlineMetric: "A lower-volume release with a long tail across Scholarship and Anniversary editions.",
    galleryCaption: "Locker-room rebellion and chipped-paint bravado."
  },
  max_payne_3: {
    releaseDatePrecision: "day",
    originalReleaseDate: "2012-05-15",
    shortDescription: "A late-cycle action release with a console-heavy sales mix.",
    longDescription:
      "Max Payne 3 is a late-cycle action shooter whose commercial profile leans heavily on seventh-generation consoles, with a secondary PC presence and a sharper drop-off than Rockstar's open-world giants.",
    themeKey: "max_pain_cold",
    universeStyle: "A console-led action release with a narrower commercial footprint than GTA or Red Dead.",
    heroTagline: "A focused seventh-generation shooter with a shorter tail than Rockstar's sandbox titles.",
    developer: "Rockstar Studios",
    criticsAngle: "Sharper launch concentration and a thinner tail than Rockstar's sandbox titles.",
    averageSellingPriceUsd: 27,
    estimatedLifetimeUnitsM: 5.7,
    headlineMetric: "A strong but concentrated action release led by PS3 and Xbox 360.",
    galleryCaption: "Blue steel, night rain, and kinetic damage."
  },
  midnight_club_3: {
    releaseDatePrecision: "day",
    originalReleaseDate: "2005-04-11",
    shortDescription: "Rockstar's sixth-generation street racer with portable reach.",
    longDescription:
      "Midnight Club 3 captures Rockstar's pre-open-world-racing energy, with strong sixth-generation console relevance and portable support but comparatively modest lifetime reach against the publisher's tentpoles.",
    themeKey: "street_racer_glow",
    universeStyle: "A focused racing release built around PS2, Xbox, and PSP.",
    heroTagline: "Strong console identity, smaller scale, durable genre recognition.",
    developer: "Rockstar San Diego",
    criticsAngle: "A genre-defining style piece with narrower commercial breadth than the crime epics.",
    averageSellingPriceUsd: 19,
    estimatedLifetimeUnitsM: 3.2,
    headlineMetric: "A modest but durable racing catalog entry with a clear console-led mix.",
    galleryCaption: "Traffic streaks and chrome-lit midnight speed."
  }
};

const catalogSeedById = new Map(catalogSeeds.map((seed) => [seed.id, seed]));
const explicitUnitsByGameId = new Map(
  Object.entries(featuredOverrides)
    .filter(([, game]) => typeof game.estimatedLifetimeUnitsM === "number")
    .map(([gameId, game]) => [gameId, game.estimatedLifetimeUnitsM as number])
);

const franchiseStrength: Record<string, number> = {
  "Grand Theft Auto": 1.7,
  "Red Dead Redemption": 1.18,
  "Red Dead": 0.82,
  "Midnight Club": 0.74,
  "Max Payne": 0.68,
  "Bully": 0.56,
  "L.A. Noire": 0.54,
  "Smuggler's Run": 0.44,
  "Manhunt": 0.46,
  "Austin Powers": 0.3,
  "The Warriors": 0.36,
  "Table Tennis": 0.28,
  "State of Emergency": 0.31,
  "Beaterator": 0.24
};

const defaultRegionShares = { north_america: 0.35, europe: 0.28, asia_pacific: 0.15, latin_america: 0.22 };
const estimatedUnitsCache = new Map<string, number>();

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function normalizeRecord<T extends string>(values: Record<T, number>) {
  const total = (Object.values(values) as number[]).reduce((sum, value) => sum + value, 0);
  return Object.fromEntries(
    (Object.entries(values) as Array<[T, number]>).map(([key, value]) => [key, Number((value / Math.max(total, 1)).toFixed(4))])
  ) as Record<T, number>;
}

function getPlatformWeight(seed: (typeof catalogSeeds)[number], platformId: string) {
  const platform = platformById.get(platformId);
  if (!platform) return 0.3;

  let weight =
    platform.generation === "gen5"
      ? 0.7
      : platform.generation === "gen6"
        ? 1
        : platform.generation === "gen7"
          ? 1.02
          : platform.generation === "gen8"
            ? 1.04
            : platform.generation === "gen9"
              ? 0.96
              : platform.generation === "portable"
                ? 0.56
                : platform.generation === "mobile"
                  ? 0.34
                  : platform.generation === "pc"
                    ? 0.62
                    : 0.2;

  if (platform.family === "PlayStation" && seed.franchise === "Grand Theft Auto" && seed.year <= 2006) weight *= 1.2;
  if (platform.family === "Xbox" && seed.franchise.startsWith("Red Dead")) weight *= 1.08;
  if (platform.family === "PC" && seed.year < 2004) weight *= 0.82;
  if (platform.generation === "portable" && (seed.title.includes("Stories") || seed.title.includes("Chinatown"))) weight *= 1.24;
  if (platform.generation === "mobile" && seed.kind !== "online_service") weight *= 0.84;
  if (platform.generation === "vr") weight *= 1.4;
  if (seed.kind === "online_service" && (platform.family === "PC" || platform.generation === "gen8" || platform.generation === "gen9")) weight *= 1.1;

  return weight;
}

function buildPlatformSharesForSeed(seed: (typeof catalogSeeds)[number]) {
  return normalizeRecord(
    Object.fromEntries(seed.platforms.map((platformId) => [platformId, getPlatformWeight(seed, platformId)]))
  );
}

function buildRegionSharesForSeed(seed: (typeof catalogSeeds)[number]) {
  const isPortableHeavy = seed.platforms.every((platformId) => {
    const generation = platformById.get(platformId)?.generation;
    return generation === "portable" || generation === "mobile";
  });

  const shares =
    seed.franchise === "Grand Theft Auto"
      ? { north_america: 0.36, europe: 0.29, asia_pacific: 0.14, latin_america: 0.21 }
      : seed.franchise.startsWith("Red Dead")
        ? { north_america: 0.41, europe: 0.25, asia_pacific: 0.11, latin_america: 0.23 }
        : seed.franchise === "Midnight Club" || seed.franchise === "Smuggler's Run"
          ? { north_america: 0.4, europe: 0.23, asia_pacific: 0.11, latin_america: 0.26 }
          : seed.franchise === "Max Payne" || seed.franchise === "L.A. Noire" || seed.franchise === "Manhunt"
            ? { north_america: 0.32, europe: 0.32, asia_pacific: 0.15, latin_america: 0.21 }
            : { ...defaultRegionShares };

  if (isPortableHeavy) {
    shares.asia_pacific += 0.04;
    shares.north_america -= 0.02;
    shares.europe -= 0.02;
  }

  return normalizeRecord(shares);
}

function buildYearlyWeightsForSeed(seed: (typeof catalogSeeds)[number]) {
  const totalYears = new Date().getFullYear() - seed.year + 1;
  const starter =
    seed.kind === "mission_pack"
      ? [0.56, 0.22, 0.1, 0.05]
      : seed.kind === "expansion"
        ? [0.5, 0.23, 0.11, 0.06]
        : seed.kind === "variant"
          ? [0.42, 0.21, 0.13, 0.08]
          : seed.kind === "online_service"
            ? [0.18, 0.16, 0.14, 0.12, 0.1, 0.08]
            : [0.39, 0.19, 0.12, 0.08, 0.06];

  const weights = starter.slice();
  while (weights.length < totalYears) {
    const previous = weights[weights.length - 1] ?? 0.02;
    weights.push(Number((previous * (seed.status === "active" ? 0.92 : 0.8)).toFixed(4)));
  }

  return weights.slice(0, totalYears);
}

function getEstimatedUnitsForSeed(seed: (typeof catalogSeeds)[number]): number {
  const cached = estimatedUnitsCache.get(seed.id);
  if (typeof cached === "number") return cached;

  const explicitUnits = explicitUnitsByGameId.get(seed.id);
  if (typeof explicitUnits === "number") {
    estimatedUnitsCache.set(seed.id, explicitUnits);
    return explicitUnits;
  }

  const platformReach = seed.platforms.reduce((sum, platformId) => sum + getPlatformWeight(seed, platformId), 0);
  const franchiseFactor = franchiseStrength[seed.franchise] ?? 0.34;
  const eraFactor = 0.58 + (seed.year - 1997) * 0.08 + (seed.year >= 2001 ? 0.32 : 0) + (seed.year >= 2008 ? 0.28 : 0);
  const roleFactor = seed.rockstarRole === "developed" ? 1 : seed.rockstarRole === "published" ? 0.72 : 0.63;
  const kindFactor =
    seed.kind === "game"
      ? 1
      : seed.kind === "mission_pack"
        ? 0.26
        : seed.kind === "expansion"
          ? 0.32
          : seed.kind === "variant"
            ? 0.22
            : 0.18;
  const statusFactor = seed.status === "active" ? 1.08 : 1;

  let estimate = eraFactor * franchiseFactor * roleFactor * kindFactor * platformReach * statusFactor;

  if (seed.parentGameId) {
    const parentSeed = catalogSeedById.get(seed.parentGameId);
    const parentUnits = parentSeed ? getEstimatedUnitsForSeed(parentSeed) : 0;
    const inheritedFactor =
      seed.kind === "mission_pack"
        ? 0.18
        : seed.kind === "expansion"
          ? 0.24
          : seed.kind === "variant"
            ? 0.16
            : 0.12;
    estimate = Math.max(estimate, parentUnits * inheritedFactor);
  }

  if (seed.title.includes("Grand Theft Auto III")) estimate *= 1.28;
  if (seed.title.includes("Liberty City Stories") || seed.title.includes("Vice City Stories")) estimate *= 1.16;
  if (seed.title.includes("Chinatown Wars")) estimate *= 1.08;
  if (seed.title.includes("The Warriors")) estimate *= 1.1;
  if (seed.title.includes("Max Payne")) estimate *= 1.12;
  if (seed.title.includes("Monster Truck")) estimate *= 0.9;

  const rounded = Number(clamp(estimate, 0.08, 38).toFixed(2));
  estimatedUnitsCache.set(seed.id, rounded);
  return rounded;
}

function estimateAverageSellingPrice(seed: (typeof catalogSeeds)[number]) {
  const hasOnlyMobileLikePlatforms = seed.platforms.every((platformId) => {
    const generation = platformById.get(platformId)?.generation;
    return generation === "mobile" || generation === "portable" || generation === "vr";
  });

  if (seed.kind === "mission_pack") return 11;
  if (seed.kind === "expansion") return 18;
  if (seed.kind === "variant") return hasOnlyMobileLikePlatforms ? 10 : 19;
  if (seed.kind === "online_service") return 14;
  if (hasOnlyMobileLikePlatforms) return 13;
  if (seed.year < 2001) return 18;
  if (seed.year < 2006) return 24;
  if (seed.year < 2012) return 29;
  if (seed.year < 2018) return 34;
  return 39;
}

function estimateConfidenceForSeed(seed: (typeof catalogSeeds)[number]) {
  const profileConfidence =
    0.36 +
    (seed.rockstarRole === "developed" ? 0.07 : 0) +
    (seed.parentGameId ? 0.04 : 0) -
    (seed.year < 2001 ? 0.05 : 0) -
    (seed.kind === "online_service" ? 0.04 : 0);

  return Number(clamp(profileConfidence, 0.31, 0.67).toFixed(2));
}

function buildModeledGameAdjustments(seed: (typeof catalogSeeds)[number]): Partial<Game> {
  if (featuredGameIds.includes(seed.id)) return {};

  const enrichment = gameEnrichment[seed.id] ?? (seed.parentGameId ? gameEnrichment[seed.parentGameId] : undefined);
  const estimatedLifetimeUnitsM = getEstimatedUnitsForSeed(seed);
  const averageSellingPriceUsd = estimateAverageSellingPrice(seed);
  const commercialFrame =
    seed.kind === "online_service"
      ? "Modeled as a low-confidence service-layer commercial equivalent rather than a standalone boxed release."
      : seed.kind === "variant"
        ? "Modeled as a re-release tail, not as a fresh mainline launch."
        : seed.kind === "expansion" || seed.kind === "mission_pack"
          ? "Modeled as an extension of parent-title demand with lower independent commercial gravity."
          : "Modeled from platform footprint, release timing, franchise strength, and Rockstar role.";

  return {
    estimatedLifetimeUnitsM,
    averageSellingPriceUsd,
    shortDescription: enrichment?.summary ?? buildCatalogShortDescription(seed.title, "supported", seed.kind),
    headlineMetric: `${buildCatalogFactLine(seed)} Estimated lifetime revenue: $${(estimatedLifetimeUnitsM * averageSellingPriceUsd).toFixed(0)}M.`,
    criticsAngle: `${commercialFrame} Confidence remains lower than the flagship Rockstar set.`,
    galleryCaption: `${seed.title} uses transparent modeled coverage rather than a direct official milestone.`,
    longDescription: `${buildCatalogLongDescription(seed.title, "supported", seed.rockstarRole)} ${commercialFrame}`,
    heroTagline: enrichment?.summary
      ? `${enrichment.summary} First tracked release year: ${seed.year}.`
      : buildCatalogHeroTagline(seed.year, seed.kind, "supported")
  };
}

export const games: Game[] = catalogSeeds.map((seed) => ({
  ...buildCatalogGame(seed),
  ...buildModeledGameAdjustments(seed),
  ...(featuredOverrides[seed.id] ?? {})
}));

const explicitReleases: Release[] = [
  { id: "rel-gta-v-ps3", gameId: "gta_v", platformId: "ps3", releaseDate: "2013-09-17", releaseDatePrecision: "day", editionType: "base", remaster: false, notes: "Original console launch." },
  { id: "rel-gta-v-x360", gameId: "gta_v", platformId: "xbox360", releaseDate: "2013-09-17", releaseDatePrecision: "day", editionType: "base", remaster: false, notes: "Original console launch." },
  { id: "rel-gta-v-ps4", gameId: "gta_v", platformId: "ps4", releaseDate: "2014-11-18", releaseDatePrecision: "day", editionType: "port", remaster: true, notes: "Expanded and enhanced gen-8 release." },
  { id: "rel-gta-v-xone", gameId: "gta_v", platformId: "xboxone", releaseDate: "2014-11-18", releaseDatePrecision: "day", editionType: "port", remaster: true, notes: "Expanded and enhanced gen-8 release." },
  { id: "rel-gta-v-pc", gameId: "gta_v", platformId: "pc", releaseDate: "2015-04-14", releaseDatePrecision: "day", editionType: "port", remaster: false, notes: "PC release with Rockstar Editor." },
  { id: "rel-gta-v-ps5", gameId: "gta_v", platformId: "ps5", releaseDate: "2022-03-15", releaseDatePrecision: "day", editionType: "remaster", remaster: true, notes: "Expanded and enhanced gen-9 release." },
  { id: "rel-gta-v-series", gameId: "gta_v", platformId: "seriesxs", releaseDate: "2022-03-15", releaseDatePrecision: "day", editionType: "remaster", remaster: true, notes: "Expanded and enhanced gen-9 release." },
  { id: "rel-san-ps2", gameId: "san_andreas", platformId: "ps2", releaseDate: "2004-10-26", releaseDatePrecision: "day", editionType: "base", remaster: false, notes: "Original PS2 launch." },
  { id: "rel-san-xbox", gameId: "san_andreas", platformId: "xbox", releaseDate: "2005-06-07", releaseDatePrecision: "day", editionType: "port", remaster: false, notes: "Original Xbox release." },
  { id: "rel-san-pc", gameId: "san_andreas", platformId: "pc", releaseDate: "2005-06-07", releaseDatePrecision: "day", editionType: "port", remaster: false, notes: "Windows release." },
  { id: "rel-san-ios", gameId: "san_andreas", platformId: "ios", releaseDate: "2013-12-12", releaseDatePrecision: "day", editionType: "port", remaster: false, notes: "Mobile port." },
  { id: "rel-san-android", gameId: "san_andreas", platformId: "android", releaseDate: "2013-12-19", releaseDatePrecision: "day", editionType: "port", remaster: false, notes: "Mobile port." },
  { id: "rel-vice-ps2", gameId: "vice_city", platformId: "ps2", releaseDate: "2002-10-29", releaseDatePrecision: "day", editionType: "base", remaster: false, notes: "Original PS2 launch." },
  { id: "rel-vice-xbox", gameId: "vice_city", platformId: "xbox", releaseDate: "2003-10-31", releaseDatePrecision: "day", editionType: "port", remaster: false, notes: "Xbox release." },
  { id: "rel-vice-pc", gameId: "vice_city", platformId: "pc", releaseDate: "2003-05-13", releaseDatePrecision: "day", editionType: "port", remaster: false, notes: "PC release." },
  { id: "rel-vice-ios", gameId: "vice_city", platformId: "ios", releaseDate: "2012-12-06", releaseDatePrecision: "day", editionType: "port", remaster: false, notes: "Mobile anniversary port." },
  { id: "rel-vice-android", gameId: "vice_city", platformId: "android", releaseDate: "2012-12-06", releaseDatePrecision: "day", editionType: "port", remaster: false, notes: "Mobile anniversary port." },
  { id: "rel-iv-ps3", gameId: "gta_iv", platformId: "ps3", releaseDate: "2008-04-29", releaseDatePrecision: "day", editionType: "base", remaster: false, notes: "Original launch." },
  { id: "rel-iv-x360", gameId: "gta_iv", platformId: "xbox360", releaseDate: "2008-04-29", releaseDatePrecision: "day", editionType: "base", remaster: false, notes: "Original launch." },
  { id: "rel-iv-pc", gameId: "gta_iv", platformId: "pc", releaseDate: "2008-12-02", releaseDatePrecision: "day", editionType: "port", remaster: false, notes: "PC release." },
  { id: "rel-rdr-ps3", gameId: "red_dead_redemption", platformId: "ps3", releaseDate: "2010-05-18", releaseDatePrecision: "day", editionType: "base", remaster: false, notes: "Original launch." },
  { id: "rel-rdr-x360", gameId: "red_dead_redemption", platformId: "xbox360", releaseDate: "2010-05-18", releaseDatePrecision: "day", editionType: "base", remaster: false, notes: "Original launch." },
  { id: "rel-rdr-ps4", gameId: "red_dead_redemption", platformId: "ps4", releaseDate: "2023-08-17", releaseDatePrecision: "day", editionType: "port", remaster: true, notes: "Modern console release." },
  { id: "rel-rdr-switch", gameId: "red_dead_redemption", platformId: "switch", releaseDate: "2023-08-17", releaseDatePrecision: "day", editionType: "port", remaster: true, notes: "Nintendo Switch release." },
  { id: "rel-rdr-pc", gameId: "red_dead_redemption", platformId: "pc", releaseDate: "2024-10-29", releaseDatePrecision: "day", editionType: "port", remaster: true, notes: "PC release." },
  { id: "rel-rdr2-ps4", gameId: "red_dead_redemption_2", platformId: "ps4", releaseDate: "2018-10-26", releaseDatePrecision: "day", editionType: "base", remaster: false, notes: "Original launch." },
  { id: "rel-rdr2-xone", gameId: "red_dead_redemption_2", platformId: "xboxone", releaseDate: "2018-10-26", releaseDatePrecision: "day", editionType: "base", remaster: false, notes: "Original launch." },
  { id: "rel-rdr2-pc", gameId: "red_dead_redemption_2", platformId: "pc", releaseDate: "2019-11-05", releaseDatePrecision: "day", editionType: "port", remaster: false, notes: "PC release." },
  { id: "rel-la-ps3", gameId: "la_noire", platformId: "ps3", releaseDate: "2011-05-17", releaseDatePrecision: "day", editionType: "base", remaster: false, notes: "Original launch." },
  { id: "rel-la-x360", gameId: "la_noire", platformId: "xbox360", releaseDate: "2011-05-17", releaseDatePrecision: "day", editionType: "base", remaster: false, notes: "Original launch." },
  { id: "rel-la-pc", gameId: "la_noire", platformId: "pc", releaseDate: "2011-11-08", releaseDatePrecision: "day", editionType: "port", remaster: false, notes: "PC release." },
  { id: "rel-la-ps4", gameId: "la_noire", platformId: "ps4", releaseDate: "2017-11-14", releaseDatePrecision: "day", editionType: "remaster", remaster: true, notes: "Modern console release." },
  { id: "rel-la-switch", gameId: "la_noire", platformId: "switch", releaseDate: "2017-11-14", releaseDatePrecision: "day", editionType: "remaster", remaster: true, notes: "Nintendo Switch release." },
  { id: "rel-la-vr", gameId: "la_noire", platformId: "vr", releaseDate: "2017-12-15", releaseDatePrecision: "day", editionType: "special", remaster: false, notes: "VR Case Files release." },
  { id: "rel-bully-ps2", gameId: "bully", platformId: "ps2", releaseDate: "2006-10-17", releaseDatePrecision: "day", editionType: "base", remaster: false, notes: "Original launch." },
  { id: "rel-bully-wii", gameId: "bully", platformId: "wii", releaseDate: "2008-03-04", releaseDatePrecision: "day", editionType: "port", remaster: false, notes: "Scholarship Edition." },
  { id: "rel-bully-x360", gameId: "bully", platformId: "xbox360", releaseDate: "2008-03-04", releaseDatePrecision: "day", editionType: "port", remaster: false, notes: "Scholarship Edition." },
  { id: "rel-bully-pc", gameId: "bully", platformId: "pc", releaseDate: "2008-10-21", releaseDatePrecision: "day", editionType: "port", remaster: false, notes: "PC Scholarship Edition." },
  { id: "rel-bully-ios", gameId: "bully", platformId: "ios", releaseDate: "2016-12-08", releaseDatePrecision: "day", editionType: "port", remaster: false, notes: "Anniversary mobile release." },
  { id: "rel-bully-android", gameId: "bully", platformId: "android", releaseDate: "2016-12-08", releaseDatePrecision: "day", editionType: "port", remaster: false, notes: "Anniversary mobile release." },
  { id: "rel-mp3-ps3", gameId: "max_payne_3", platformId: "ps3", releaseDate: "2012-05-15", releaseDatePrecision: "day", editionType: "base", remaster: false, notes: "Original launch." },
  { id: "rel-mp3-x360", gameId: "max_payne_3", platformId: "xbox360", releaseDate: "2012-05-15", releaseDatePrecision: "day", editionType: "base", remaster: false, notes: "Original launch." },
  { id: "rel-mp3-pc", gameId: "max_payne_3", platformId: "pc", releaseDate: "2012-05-29", releaseDatePrecision: "day", editionType: "port", remaster: false, notes: "PC release." },
  { id: "rel-mid-ps2", gameId: "midnight_club_3", platformId: "ps2", releaseDate: "2005-04-11", releaseDatePrecision: "day", editionType: "base", remaster: false, notes: "Original launch." },
  { id: "rel-mid-xbox", gameId: "midnight_club_3", platformId: "xbox", releaseDate: "2005-04-11", releaseDatePrecision: "day", editionType: "base", remaster: false, notes: "Original launch." },
  { id: "rel-mid-psp", gameId: "midnight_club_3", platformId: "psp", releaseDate: "2005-10-24", releaseDatePrecision: "day", editionType: "port", remaster: false, notes: "Portable adaptation." }
];

const explicitReleaseGameIds = new Set(explicitReleases.map((release) => release.gameId));
const generatedReleases: Release[] = catalogSeeds
  .filter((seed) => !explicitReleaseGameIds.has(seed.id))
  .flatMap((seed) =>
    seed.platforms.map((platformId, index) => ({
      id: `rel-${seed.id}-${platformId}`,
      gameId: seed.id,
      platformId,
      releaseDate: seed.releaseDate ?? `${seed.year}-01-01`,
      releaseDatePrecision: seed.releaseDatePrecision ?? (seed.releaseDate ? "day" : "year"),
      editionType:
        seed.kind === "variant"
          ? "remaster"
          : seed.kind === "online_service" || seed.kind === "expansion" || seed.kind === "mission_pack"
            ? "special"
            : index === 0
              ? "base"
              : "port",
      remaster: seed.kind === "variant",
      notes:
        seed.releaseDatePrecision === "day"
          ? "Catalog release reference."
          : "Catalog reference entry. Exact per-platform day pending normalization."
    }))
  );

export const releases: Release[] = [...explicitReleases, ...generatedReleases];

const featuredProfiles: GameProfile[] = [
  {
    gameId: "gta_v",
    platformShares: { ps3: 0.24, xbox360: 0.21, ps4: 0.19, xboxone: 0.12, pc: 0.1, ps5: 0.09, seriesxs: 0.05 },
    regionShares: { north_america: 0.37, europe: 0.29, asia_pacific: 0.2, latin_america: 0.14 },
    yearlyWeights: [0.28, 0.12, 0.09, 0.07, 0.06, 0.05, 0.05, 0.05, 0.05, 0.04, 0.04, 0.04, 0.03, 0.03],
    confidenceBase: 0.91,
    notes: "Official overall units, modeled platform and region allocation."
  },
  {
    gameId: "san_andreas",
    platformShares: { ps2: 0.59, xbox: 0.12, pc: 0.13, ios: 0.08, android: 0.08 },
    regionShares: { north_america: 0.39, europe: 0.28, asia_pacific: 0.15, latin_america: 0.18 },
    yearlyWeights: [0.44, 0.16, 0.1, 0.08, 0.05, 0.04, 0.03, 0.02, 0.02, 0.015, 0.015, 0.015, 0.015, 0.01, 0.01, 0.01, 0.005, 0.005, 0.005, 0.005, 0.005, 0.005],
    confidenceBase: 0.64,
    notes: "Modeled from franchise residual, release era dominance, and later mobile catalog activity."
  },
  {
    gameId: "vice_city",
    platformShares: { ps2: 0.58, xbox: 0.12, pc: 0.17, ios: 0.07, android: 0.06 },
    regionShares: { north_america: 0.38, europe: 0.3, asia_pacific: 0.14, latin_america: 0.18 },
    yearlyWeights: [0.49, 0.16, 0.1, 0.07, 0.04, 0.03, 0.02, 0.02, 0.015, 0.015, 0.01, 0.01, 0.01, 0.01, 0.005, 0.005, 0.005, 0.005, 0.005, 0.005, 0.005, 0.005, 0.005, 0.005],
    confidenceBase: 0.62,
    notes: "Modeled with heavy PS2 concentration and mild mobile tail."
  },
  {
    gameId: "gta_iv",
    platformShares: { ps3: 0.34, xbox360: 0.42, pc: 0.24 },
    regionShares: { north_america: 0.35, europe: 0.32, asia_pacific: 0.15, latin_america: 0.18 },
    yearlyWeights: [0.41, 0.16, 0.1, 0.08, 0.06, 0.05, 0.04, 0.03, 0.025, 0.02, 0.015, 0.015, 0.015, 0.01, 0.005, 0.005, 0.005, 0.005],
    confidenceBase: 0.68,
    notes: "Modeled using gen-7 install base split and PC tail."
  },
  {
    gameId: "red_dead_redemption",
    platformShares: { ps3: 0.39, xbox360: 0.43, ps4: 0.07, switch: 0.05, pc: 0.06 },
    regionShares: { north_america: 0.42, europe: 0.26, asia_pacific: 0.12, latin_america: 0.2 },
    yearlyWeights: [0.43, 0.17, 0.1, 0.07, 0.05, 0.04, 0.03, 0.02, 0.015, 0.015, 0.01, 0.01, 0.01, 0.005, 0.005, 0.005],
    confidenceBase: 0.72,
    notes: "Anchored to official franchise figure with modern port bump layered on later years."
  },
  {
    gameId: "red_dead_redemption_2",
    platformShares: { ps4: 0.46, xboxone: 0.34, pc: 0.2 },
    regionShares: { north_america: 0.39, europe: 0.28, asia_pacific: 0.18, latin_america: 0.15 },
    yearlyWeights: [0.35, 0.17, 0.11, 0.08, 0.07, 0.06, 0.05, 0.04, 0.03, 0.02, 0.02],
    confidenceBase: 0.89,
    notes: "Official overall units with modeled platform and regional splits."
  },
  {
    gameId: "la_noire",
    platformShares: { ps3: 0.28, xbox360: 0.33, pc: 0.12, ps4: 0.11, switch: 0.1, vr: 0.06 },
    regionShares: { north_america: 0.34, europe: 0.3, asia_pacific: 0.16, latin_america: 0.2 },
    yearlyWeights: [0.38, 0.16, 0.11, 0.08, 0.06, 0.04, 0.03, 0.025, 0.02, 0.02, 0.02, 0.015, 0.015, 0.01, 0.01],
    confidenceBase: 0.57,
    notes: "Lower-confidence modeled title with remaster and VR extension."
  },
  {
    gameId: "bully",
    platformShares: { ps2: 0.43, wii: 0.15, xbox360: 0.14, pc: 0.12, ios: 0.08, android: 0.08 },
    regionShares: { north_america: 0.37, europe: 0.27, asia_pacific: 0.14, latin_america: 0.22 },
    yearlyWeights: [0.47, 0.16, 0.11, 0.07, 0.05, 0.04, 0.025, 0.015, 0.015, 0.01, 0.01, 0.01, 0.005, 0.005, 0.005, 0.005, 0.005, 0.005, 0.005, 0.005],
    confidenceBase: 0.51,
    notes: "Cult catalog title with limited disclosed data and a long re-release tail."
  },
  {
    gameId: "max_payne_3",
    platformShares: { ps3: 0.36, xbox360: 0.39, pc: 0.25 },
    regionShares: { north_america: 0.33, europe: 0.31, asia_pacific: 0.16, latin_america: 0.2 },
    yearlyWeights: [0.45, 0.18, 0.11, 0.07, 0.05, 0.04, 0.025, 0.02, 0.015, 0.01, 0.005, 0.005, 0.005, 0.005],
    confidenceBase: 0.59,
    notes: "Modeled late gen-7 action title with a relatively thin tail."
  },
  {
    gameId: "midnight_club_3",
    platformShares: { ps2: 0.47, xbox: 0.31, psp: 0.22 },
    regionShares: { north_america: 0.44, europe: 0.22, asia_pacific: 0.1, latin_america: 0.24 },
    yearlyWeights: [0.52, 0.18, 0.11, 0.07, 0.04, 0.03, 0.02, 0.015, 0.01, 0.005, 0.005, 0.005, 0.005],
    confidenceBase: 0.48,
    notes: "Modeled sixth-generation racer with a portable boost."
  }
];

const explicitProfileIds = new Set(featuredProfiles.map((profile) => profile.gameId));
const generatedProfiles: GameProfile[] = catalogSeeds
  .filter((seed) => !explicitProfileIds.has(seed.id))
  .map((seed) => ({
    gameId: seed.id,
    platformShares: buildPlatformSharesForSeed(seed),
    regionShares: buildRegionSharesForSeed(seed),
    yearlyWeights: buildYearlyWeightsForSeed(seed),
    confidenceBase: estimateConfidenceForSeed(seed),
    notes:
      seed.kind === "online_service"
        ? "Low-confidence service-layer estimate derived from parent-title commercial reach, active status, and platform continuity."
        : seed.kind === "variant"
          ? "Low-confidence re-release estimate derived from parent-title tail strength, platform spread, and release timing."
          : seed.kind === "expansion" || seed.kind === "mission_pack"
            ? "Low-confidence extension estimate derived from parent-title reach and platform lineage."
            : "Low-confidence title estimate derived from platform era, franchise strength, Rockstar role, and release timing."
  }));

export const gameProfiles: GameProfile[] = [...featuredProfiles, ...generatedProfiles];
