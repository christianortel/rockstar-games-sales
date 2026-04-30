import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

import { catalogSeeds } from "@/data/normalized/catalog";
import rawGameEnrichment from "@/data/raw/game-enrichment.json";
import { validateGameEnrichment } from "@/lib/data/enrichment-validation";
import { GameEnrichment } from "@/types/domain";

const WIKIPEDIA_API = "https://en.wikipedia.org/w/api.php";
const WIKIPEDIA_SUMMARY_API = "https://en.wikipedia.org/api/rest_v1/page/summary";
const OUTPUT_FILE = path.join(process.cwd(), "data", "raw", "game-enrichment.json");
const ACCESS_DATE = new Date().toISOString().slice(0, 10);
const dryRun = process.argv.includes("--dry-run");
const limitArg = process.argv.find((argument) => argument.startsWith("--limit="));
const limit = limitArg ? Number(limitArg.replace("--limit=", "")) : undefined;
const platformLabelById: Record<string, string> = {
  ps1: "PlayStation",
  n64: "Nintendo 64",
  gbc: "Game Boy Color",
  ps2: "PlayStation 2",
  xbox: "Xbox",
  gamecube: "Nintendo GameCube",
  dreamcast: "Dreamcast",
  pc: "PC",
  mac: "Mac",
  gba: "Game Boy Advance",
  psp: "PSP",
  ds: "Nintendo DS",
  wii: "Wii",
  ps3: "PlayStation 3",
  xbox360: "Xbox 360",
  ps4: "PlayStation 4",
  xboxone: "Xbox One",
  ios: "iOS",
  android: "Android",
  switch: "Nintendo Switch",
  ps5: "PlayStation 5",
  seriesxs: "Xbox Series X|S",
  vr: "VR"
};

const wikipediaTitleOverrides: Record<string, string> = {
  gta_1: "Grand Theft Auto (video game)",
  gta_london_1969: "Grand Theft Auto: London 1969",
  gta_2: "Grand Theft Auto 2",
  gta_iii: "Grand Theft Auto III",
  vice_city: "Grand Theft Auto: Vice City",
  san_andreas: "Grand Theft Auto: San Andreas",
  gta_iv: "Grand Theft Auto IV",
  gta_v: "Grand Theft Auto V",
  gta_online: "Grand Theft Auto Online",
  gta_advance: "Grand Theft Auto Advance",
  liberty_city_stories: "Grand Theft Auto: Liberty City Stories",
  vice_city_stories: "Grand Theft Auto: Vice City Stories",
  chinatown_wars: "Grand Theft Auto: Chinatown Wars",
  red_dead_revolver: "Red Dead Revolver",
  red_dead_redemption: "Red Dead Redemption",
  red_dead_redemption_2: "Red Dead Redemption 2",
  red_dead_online: "Red Dead Online",
  la_noire: "L.A. Noire",
  la_noire_vr_case_files: "L.A. Noire: The VR Case Files",
  bully: "Bully (video game)",
  bully_scholarship_edition: "Bully: Scholarship Edition",
  bully_anniversary: "Bully: Anniversary Edition",
  midnight_club_street_racing: "Midnight Club: Street Racing",
  midnight_club_ii: "Midnight Club II",
  midnight_club_3: "Midnight Club 3: DUB Edition",
  midnight_club_3_remix: "Midnight Club 3: DUB Edition Remix",
  midnight_club_los_angeles: "Midnight Club: Los Angeles",
  max_payne: "Max Payne (video game)",
  max_payne_2: "Max Payne 2",
  max_payne_3: "Max Payne 3",
  manhunt: "Manhunt (video game)",
  manhunt_2: "Manhunt 2",
  table_tennis: "Rockstar Games Presents Table Tennis",
  beaterator: "Beaterator",
  the_warriors: "The Warriors (video game)",
  smugglers_run: "Smuggler's Run",
  smugglers_run_2: "Smuggler's Run 2",
  smugglers_run_warzones: "Smuggler's Run: Warzones",
  oni: "Oni (video game)",
  state_of_emergency: "State of Emergency (video game)",
  the_italian_job: "The Italian Job (2001 video game)",
  earthworm_jim_3d: "Earthworm Jim 3D",
  thrasher_skate_and_destroy: "Thrasher: Skate and Destroy",
  wild_metal: "Wild Metal Country",
  monster_truck_madness_64: "Monster Truck Madness 2",
  austin_powers_oh_behave: "Austin Powers: Oh, Behave!",
  austin_powers_underground_lair: "Austin Powers: Welcome to My Underground Lair!",
  surfing_h3o: "Surfing H3O",
  you_dont_know_jack: "You Don't Know Jack (1999 video game)",
  evel_knievel: "Evel Knievel (video game)"
};

const manualOverrides: Record<string, Partial<GameEnrichment>> = {
  gta_london_1961: {
    wikipediaTitle: "Grand Theft Auto: London 1961",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Grand_Theft_Auto:_London_1961",
    summary:
      "Grand Theft Auto: London 1961 was a free PC-only mission pack released in 1999 that expanded London 1969 with new missions, vehicles, and a multiplayer map.",
    sourceName: "Wikipedia",
    sourceUrl: "https://pt.wikipedia.org/wiki/Grand_Theft_Auto%3A_London_1961"
  },
  monster_truck_madness_64: {
    wikipediaTitle: "Monster Truck Madness 64",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Monster_Truck_Madness_2",
    summary:
      "Monster Truck Madness 64 was Rockstar's 1999 Nintendo 64 version of Monster Truck Madness 2, adapted by Edge of Reality for console release.",
    sourceName: "Wikipedia",
    sourceUrl: "https://en.wikipedia.org/wiki/Monster_Truck_Madness_2"
  },
  smugglers_run_warzones: {
    wikipediaTitle: "Smuggler's Run: Warzones",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Smuggler%27s_Run_2",
    summary:
      "Smuggler's Run: Warzones was the 2002 GameCube adaptation of Rockstar's off-road smuggling racer, bringing the series to Nintendo hardware.",
    sourceName: "Wikipedia",
    sourceUrl: "https://en.wikipedia.org/wiki/Smuggler%27s_Run_2"
  },
  bully_scholarship_edition: {
    wikipediaTitle: "Bully: Scholarship Edition",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Bully_(video_game)",
    summary:
      "Bully: Scholarship Edition was Rockstar's expanded 2008 re-release, adding new classes, missions, and multiplayer modes to the original campus cult hit.",
    sourceName: "Wikipedia",
    sourceUrl: "https://en.wikipedia.org/wiki/Bully_(video_game)"
  },
  bully_anniversary: {
    wikipediaTitle: "Bully: Anniversary Edition",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Bully_(video_game)",
    summary:
      "Bully: Anniversary Edition was Rockstar's 2016 mobile update, built from Scholarship Edition content and redesigned for touchscreen play.",
    sourceName: "Wikipedia",
    sourceUrl: "https://en.wikipedia.org/wiki/Bully_(video_game)"
  },
  la_noire_vr_case_files: {
    wikipediaTitle: "L.A. Noire: The VR Case Files",
    wikipediaUrl: "https://en.wikipedia.org/wiki/L.A._Noire:_The_VR_Case_Files",
    summary:
      "L.A. Noire: The VR Case Files was Rockstar's 2017 virtual-reality adaptation, rebuilding a curated set of cases from the original detective game for VR headsets.",
    sourceName: "Wikipedia",
    sourceUrl: "https://ru.wikipedia.org/wiki/L.A._Noire%3A_The_VR_Case_Files"
  }
};

function normalizeSummary(text: string | undefined) {
  if (!text) return undefined;

  const compact = text
    .replace(/\([^)]*[^\x00-\x7F][^)]*\)/g, "")
    .replace(/\s+/g, " ")
    .trim();
  const firstSentence = compact.match(/^.*?[.!?](?:\s|$)/)?.[0]?.trim() ?? compact;

  return firstSentence.length > 180 ? `${firstSentence.slice(0, 177).trimEnd()}...` : firstSentence;
}

function summarizePlatforms(platformIds: string[]) {
  const labels = platformIds.map((platformId) => platformLabelById[platformId] ?? platformId);

  if (labels.length <= 2) return labels.join(" and ");
  if (labels.length === 3) return `${labels[0]}, ${labels[1]}, and ${labels[2]}`;
  return `${labels[0]}, ${labels[1]}, and ${labels.length - 2} more`;
}

function buildReleaseContext(seed: (typeof catalogSeeds)[number]) {
  if (seed.kind === "online_service") {
    return `${seed.title} is tracked as the ongoing online layer attached to its parent premium release rather than as a separate boxed launch.`;
  }

  if (seed.kind === "expansion" || seed.kind === "mission_pack") {
    return `${seed.title} sits in the catalog as an extension release, so its historical read depends on the parent title's installed base and timing.`;
  }

  if (seed.kind === "variant") {
    return `${seed.title} is treated as a re-release or platform refresh that extends the original title's afterlife instead of resetting the catalog clock.`;
  }

  return `${seed.title} entered Rockstar's catalog in ${seed.year} across ${summarizePlatforms(seed.platforms)}, which gives the app a concrete release-era frame for the title.`;
}

function buildRoleContext(seed: (typeof catalogSeeds)[number]) {
  if (seed.rockstarRole === "developed") {
    return `${seed.title} is treated as a Rockstar-developed release, so it sits inside the company's direct studio lineage.`;
  }

  if (seed.rockstarRole === "published") {
    return `${seed.title} remains part of the catalog because Rockstar published it, even though the development role was not fully in-house.`;
  }

  return `${seed.title} is preserved as a Rockstar-presented release, which keeps the brand timeline complete without overstating direct development ownership.`;
}

function buildPrecisionNote(seed: (typeof catalogSeeds)[number]) {
  return (seed.releaseDatePrecision ?? (seed.releaseDate ? "day" : "year")) === "day"
    ? `Current metadata tracks a specific launch date (${seed.releaseDate ?? `${seed.year}-01-01`}).`
    : `Current metadata only supports year-level release precision (${seed.year}) for this title.`;
}

function buildLegacyNote(seed: (typeof catalogSeeds)[number]) {
  if (seed.kind === "mission_pack") {
    return "Early Rockstar mission packs are preserved for historical completeness even when modern metadata is thinner than on flagship releases.";
  }

  if (seed.kind === "expansion") {
    return "Expansion releases are modeled as connected add-ons rather than standalone mainline titles.";
  }

  if (seed.kind === "variant") {
    return "Variant entries are kept separate so remasters, anniversary editions, and platform-specific reissues remain visible in the timeline.";
  }

  if (seed.year <= 2001) {
    return "Older catalog entries often need extra manual context because public release coverage and archived art are less consistent.";
  }

  return undefined;
}

async function fetchJson<T>(url: string) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "rockstar-sales-universe-metadata-fetch/1.0 (educational project)"
    }
  });

  if (!response.ok) {
    throw new Error(`Request failed for ${url}: ${response.status}`);
  }

  return (await response.json()) as T;
}

type WikipediaPage = {
  title?: string;
  fullurl?: string;
  extract?: string;
  original?: { source?: string };
  thumbnail?: { source?: string };
  pageprops?: { disambiguation?: string };
};

type WikipediaSummary = {
  title?: string;
  content_urls?: { desktop?: { page?: string } };
  originalimage?: { source?: string };
  thumbnail?: { source?: string };
};

function normalizeTitle(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function buildEnrichmentFromPage(
  gameId: string,
  seed: (typeof catalogSeeds)[number],
  page: WikipediaPage,
  summary: WikipediaSummary | undefined,
  override?: Partial<GameEnrichment>
): GameEnrichment {
  return {
    gameId,
    wikipediaTitle: override?.wikipediaTitle ?? summary?.title ?? page.title,
    wikipediaUrl: override?.wikipediaUrl ?? summary?.content_urls?.desktop?.page ?? page.fullurl,
    summary: override?.summary ?? normalizeSummary(page.extract),
    releaseContext: override?.releaseContext ?? buildReleaseContext(seed),
    roleContext: override?.roleContext ?? buildRoleContext(seed),
    precisionNote: override?.precisionNote ?? buildPrecisionNote(seed),
    legacyNote: override?.legacyNote ?? buildLegacyNote(seed),
    coverImageUrl: override?.coverImageUrl ?? summary?.originalimage?.source ?? summary?.thumbnail?.source ?? page.original?.source ?? page.thumbnail?.source,
    sourceName: override?.sourceName ?? "Wikipedia",
    sourceUrl: override?.sourceUrl ?? summary?.content_urls?.desktop?.page ?? page.fullurl,
    accessedAt: override?.accessedAt ?? ACCESS_DATE
  };
}

async function fetchPage(title: string) {
  const query = new URLSearchParams({
    action: "query",
    prop: "extracts|pageimages|info|pageprops",
    exintro: "1",
    explaintext: "1",
    inprop: "url",
    piprop: "original|thumbnail",
    pithumbsize: "800",
    redirects: "1",
    titles: title,
    format: "json",
    formatversion: "2",
    origin: "*"
  });

  const result = await fetchJson<{
    query?: {
      pages?: WikipediaPage[];
    };
  }>(`${WIKIPEDIA_API}?${query.toString()}`);

  const page = result.query?.pages?.[0];

  if (!page?.title) {
    throw new Error(`No page returned for ${title}`);
  }

  return page;
}

async function fetchSummary(title: string) {
  return fetchJson<WikipediaSummary>(`${WIKIPEDIA_SUMMARY_API}/${encodeURIComponent(title)}`);
}

async function searchWikipedia(title: string) {
  const query = new URLSearchParams({
    action: "query",
    list: "search",
    srsearch: `${title} video game`,
    srlimit: "8",
    format: "json",
    origin: "*"
  });

  const result = await fetchJson<{
    query?: {
      search?: Array<{ title: string }>;
    };
  }>(`${WIKIPEDIA_API}?${query.toString()}`);

  return result.query?.search?.map((entry) => entry.title) ?? [];
}

function scoreCandidate(seed: (typeof catalogSeeds)[number], candidate: WikipediaPage, preferredTitle: string) {
  const candidateTitle = normalizeTitle(candidate.title ?? "");
  const desiredTitle = normalizeTitle(preferredTitle);
  const originalTitle = normalizeTitle(seed.title);
  const extract = normalizeTitle(candidate.extract ?? "");

  let score = 0;

  if (candidate.pageprops?.disambiguation || candidateTitle.includes("disambiguation")) {
    return -999;
  }

  if (candidateTitle === desiredTitle) score += 80;
  if (candidateTitle === originalTitle) score += 70;
  if (candidateTitle.includes(desiredTitle) || desiredTitle.includes(candidateTitle)) score += 35;
  if (candidateTitle.includes(originalTitle) || originalTitle.includes(candidateTitle)) score += 25;
  if (extract.includes("video game") || extract.includes("action adventure game") || extract.includes("racing video game")) score += 22;
  if (extract.includes(seed.year.toString())) score += 15;
  if (extract.includes("rockstar")) score += 10;
  if (!extract.includes("game")) score -= 40;

  return score;
}

async function enrichGame(gameId: string, title: string): Promise<GameEnrichment | null> {
  const seed = catalogSeeds.find((entry) => entry.id === gameId);

  if (!seed) return null;

  const directTitle = wikipediaTitleOverrides[gameId] ?? title;
  const manualOverride = manualOverrides[gameId];

  try {
    const directPage = await fetchPage(directTitle);

    if (scoreCandidate(seed, directPage, directTitle) > -200) {
      const directSummary = await fetchSummary(directPage.title ?? directTitle).catch(() => undefined);
      return buildEnrichmentFromPage(gameId, seed, directPage, directSummary, manualOverride);
    }
  } catch {
    // Fall back to search-based resolution below.
  }

  const searchedTitles = await searchWikipedia(directTitle).catch(() => []);
  if (searchedTitles.length === 0) {
    return manualOverride
      ? {
          gameId,
          ...manualOverride,
          accessedAt: manualOverride.accessedAt ?? ACCESS_DATE
        }
      : null;
  }

  const candidatePages = await Promise.all(
    searchedTitles.map(async (searchedTitle) => {
      try {
        return await fetchPage(searchedTitle);
      } catch {
        return null;
      }
    })
  );

  const bestPage = candidatePages
    .filter((page): page is WikipediaPage => Boolean(page))
    .map((page) => ({
      page,
      score: scoreCandidate(seed, page, directTitle)
    }))
    .sort((left, right) => right.score - left.score)[0];

  if (bestPage && bestPage.score > -100) {
    const searchedSummary = await fetchSummary(bestPage.page.title ?? directTitle).catch(() => undefined);
    return buildEnrichmentFromPage(gameId, seed, bestPage.page, searchedSummary, manualOverride);
  }

  return manualOverride
    ? {
        gameId,
        releaseContext: buildReleaseContext(seed),
        roleContext: buildRoleContext(seed),
        precisionNote: buildPrecisionNote(seed),
        legacyNote: buildLegacyNote(seed),
        ...manualOverride,
        accessedAt: manualOverride.accessedAt ?? ACCESS_DATE
      }
    : null;
}

async function main() {
  const existingEnrichment = rawGameEnrichment as Record<string, GameEnrichment>;
  const enrichment: Record<string, GameEnrichment> = { ...existingEnrichment };
  const seeds = Number.isFinite(limit) && limit ? catalogSeeds.slice(0, limit) : catalogSeeds;

  for (const seed of seeds) {
    const result = await enrichGame(seed.id, seed.title);

    if (result) {
      enrichment[seed.id] = {
        ...enrichment[seed.id],
        ...result
      };
      console.log(`enriched ${seed.id} -> ${result.wikipediaTitle ?? "unknown page"}`);
    } else if (enrichment[seed.id]) {
      console.log(`kept existing enrichment for ${seed.id}`);
    } else {
      console.log(`no enrichment found for ${seed.id}`);
    }
  }

  const { errors, warnings } = validateGameEnrichment(enrichment);
  const touchedIds = new Set(seeds.map((seed) => seed.id));
  const validationErrors = limit ? errors.filter((error) => touchedIds.has(error.split(" ")[0])) : errors;

  if (warnings.length) {
    console.warn(warnings.map((warning) => `warning: ${warning}`).join("\n"));
  }

  if (validationErrors.length) {
    console.error(validationErrors.map((error) => `error: ${error}`).join("\n"));
    process.exitCode = 1;
    return;
  }

  if (dryRun) {
    console.log(`dry run complete: resolved ${Object.keys(enrichment).length} enrichment records; ${OUTPUT_FILE} was not changed.`);
    return;
  }

  mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  writeFileSync(OUTPUT_FILE, `${JSON.stringify(enrichment, null, 2)}\n`, "utf8");
  console.log(`wrote ${Object.keys(enrichment).length} records to ${OUTPUT_FILE}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
