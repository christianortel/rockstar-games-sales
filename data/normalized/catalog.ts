import { GameKind, ReleaseDatePrecision, RockstarRole } from "@/types/domain";

export interface CatalogSeed {
  id: string;
  slug: string;
  title: string;
  franchise: string;
  year: number;
  kind: GameKind;
  rockstarRole: RockstarRole;
  parentGameId?: string;
  status?: "released" | "active";
  releaseDate?: string;
  releaseDatePrecision?: ReleaseDatePrecision;
  platforms: string[];
}

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/#/g, "")
    .replace(/['.]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function catalogEntry(seed: Omit<CatalogSeed, "slug">): CatalogSeed {
  return {
    ...seed,
    slug: slugify(seed.title)
  };
}

export const featuredGameIds = [
  "gta_v",
  "san_andreas",
  "vice_city",
  "gta_iv",
  "red_dead_redemption",
  "red_dead_redemption_2",
  "la_noire",
  "bully",
  "max_payne_3",
  "midnight_club_3"
];

export const catalogSeeds: CatalogSeed[] = [
  catalogEntry({ id: "gta_1", title: "Grand Theft Auto", franchise: "Grand Theft Auto", year: 1997, kind: "game", rockstarRole: "developed", platforms: ["pc", "ps1", "gbc"] }),
  catalogEntry({ id: "gta_london_1969", title: "Grand Theft Auto: Mission Pack #1 - London 1969", franchise: "Grand Theft Auto", year: 1999, kind: "mission_pack", rockstarRole: "developed", parentGameId: "gta_1", platforms: ["pc", "ps1"] }),
  catalogEntry({ id: "gta_london_1961", title: "Grand Theft Auto: Mission Pack #2 - London 1961", franchise: "Grand Theft Auto", year: 1999, kind: "mission_pack", rockstarRole: "developed", parentGameId: "gta_1", platforms: ["pc", "ps1"] }),
  catalogEntry({ id: "monster_truck_madness_64", title: "Monster Truck Madness 64", franchise: "Monster Truck Madness", year: 1999, kind: "game", rockstarRole: "published", platforms: ["n64"] }),
  catalogEntry({ id: "gta_2", title: "Grand Theft Auto 2", franchise: "Grand Theft Auto", year: 1999, kind: "game", rockstarRole: "developed", platforms: ["pc", "ps1", "dreamcast", "gbc"] }),
  catalogEntry({ id: "earthworm_jim_3d", title: "Earthworm Jim 3D", franchise: "Earthworm Jim", year: 1999, kind: "game", rockstarRole: "published", platforms: ["n64", "pc"] }),
  catalogEntry({ id: "thrasher_skate_and_destroy", title: "Thrasher: Skate and Destroy", franchise: "Thrasher", year: 1999, kind: "game", rockstarRole: "published", platforms: ["ps1"] }),
  catalogEntry({ id: "evel_knievel", title: "Evel Knievel", franchise: "Evel Knievel", year: 1999, kind: "game", rockstarRole: "published", platforms: ["gbc"] }),
  catalogEntry({ id: "wild_metal", title: "Wild Metal", franchise: "Wild Metal", year: 2000, kind: "game", rockstarRole: "published", platforms: ["pc"] }),
  catalogEntry({ id: "austin_powers_oh_behave", title: "Austin Powers: Oh, Behave!", franchise: "Austin Powers", year: 2000, kind: "game", rockstarRole: "published", platforms: ["gbc"] }),
  catalogEntry({ id: "austin_powers_underground_lair", title: "Austin Powers: Welcome to My Underground Lair!", franchise: "Austin Powers", year: 2000, kind: "game", rockstarRole: "published", platforms: ["gbc"] }),
  catalogEntry({ id: "midnight_club_street_racing", title: "Midnight Club: Street Racing", franchise: "Midnight Club", year: 2000, kind: "game", rockstarRole: "developed", platforms: ["ps2"] }),
  catalogEntry({ id: "smugglers_run", title: "Smuggler's Run", franchise: "Smuggler's Run", year: 2000, kind: "game", rockstarRole: "developed", platforms: ["ps2"] }),
  catalogEntry({ id: "surfing_h3o", title: "Surfing H3O", franchise: "Surfing H3O", year: 2000, kind: "game", rockstarRole: "published", platforms: ["ps2"] }),
  catalogEntry({ id: "oni", title: "Oni", franchise: "Oni", year: 2001, kind: "game", rockstarRole: "published", platforms: ["ps2", "pc", "mac"] }),
  catalogEntry({ id: "you_dont_know_jack", title: "You Don't Know Jack", franchise: "You Don't Know Jack", year: 2001, kind: "game", rockstarRole: "published", platforms: ["pc"] }),
  catalogEntry({ id: "gta_iii", title: "Grand Theft Auto III", franchise: "Grand Theft Auto", year: 2001, kind: "game", rockstarRole: "developed", platforms: ["ps2", "pc", "xbox"] }),
  catalogEntry({ id: "smugglers_run_2", title: "Smuggler's Run 2: Hostile Territory", franchise: "Smuggler's Run", year: 2001, kind: "game", rockstarRole: "developed", platforms: ["ps2"] }),
  catalogEntry({ id: "max_payne", title: "Max Payne", franchise: "Max Payne", year: 2001, kind: "game", rockstarRole: "published", platforms: ["pc", "ps2", "xbox", "mac"] }),
  catalogEntry({ id: "state_of_emergency", title: "State of Emergency", franchise: "State of Emergency", year: 2002, kind: "game", rockstarRole: "published", platforms: ["ps2", "xbox"] }),
  catalogEntry({ id: "the_italian_job", title: "The Italian Job", franchise: "The Italian Job", year: 2002, kind: "game", rockstarRole: "published", platforms: ["ps1"] }),
  catalogEntry({ id: "smugglers_run_warzones", title: "Smuggler's Run: Warzones", franchise: "Smuggler's Run", year: 2002, kind: "game", rockstarRole: "developed", platforms: ["gamecube"] }),
  catalogEntry({ id: "vice_city", title: "Grand Theft Auto: Vice City", franchise: "Grand Theft Auto", year: 2002, kind: "game", rockstarRole: "developed", platforms: ["ps2", "pc", "xbox", "ios", "android"] }),
  catalogEntry({ id: "midnight_club_ii", title: "Midnight Club II", franchise: "Midnight Club", year: 2003, kind: "game", rockstarRole: "developed", platforms: ["ps2", "xbox", "pc"] }),
  catalogEntry({ id: "max_payne_2", title: "Max Payne 2: The Fall of Max Payne", franchise: "Max Payne", year: 2003, kind: "game", rockstarRole: "published", platforms: ["pc", "ps2", "xbox"] }),
  catalogEntry({ id: "manhunt", title: "Manhunt", franchise: "Manhunt", year: 2003, kind: "game", rockstarRole: "developed", platforms: ["ps2", "xbox", "pc"] }),
  catalogEntry({ id: "red_dead_revolver", title: "Red Dead Revolver", franchise: "Red Dead", year: 2004, kind: "game", rockstarRole: "developed", platforms: ["ps2", "xbox"] }),
  catalogEntry({ id: "gta_advance", title: "Grand Theft Auto Advance", franchise: "Grand Theft Auto", year: 2004, kind: "game", rockstarRole: "published", platforms: ["gba"] }),
  catalogEntry({ id: "san_andreas", title: "Grand Theft Auto: San Andreas", franchise: "Grand Theft Auto", year: 2004, kind: "game", rockstarRole: "developed", platforms: ["ps2", "xbox", "pc", "ios", "android"] }),
  catalogEntry({ id: "midnight_club_3", title: "Midnight Club 3: DUB Edition", franchise: "Midnight Club", year: 2005, kind: "game", rockstarRole: "developed", platforms: ["ps2", "xbox", "psp"] }),
  catalogEntry({ id: "the_warriors", title: "The Warriors", franchise: "The Warriors", year: 2005, kind: "game", rockstarRole: "developed", platforms: ["ps2", "psp"] }),
  catalogEntry({ id: "liberty_city_stories", title: "Grand Theft Auto: Liberty City Stories", franchise: "Grand Theft Auto", year: 2005, kind: "game", rockstarRole: "developed", platforms: ["psp", "ps2"] }),
  catalogEntry({ id: "midnight_club_3_remix", title: "Midnight Club 3: DUB Edition Remix", franchise: "Midnight Club", year: 2006, kind: "variant", rockstarRole: "developed", parentGameId: "midnight_club_3", platforms: ["psp"] }),
  catalogEntry({ id: "table_tennis", title: "Rockstar Games Presents Table Tennis", franchise: "Table Tennis", year: 2006, kind: "game", rockstarRole: "presented", platforms: ["xbox360", "wii"] }),
  catalogEntry({ id: "bully", title: "Bully", franchise: "Bully", year: 2006, kind: "game", rockstarRole: "developed", platforms: ["ps2", "wii", "xbox360", "pc", "ios", "android"] }),
  catalogEntry({ id: "vice_city_stories", title: "Grand Theft Auto: Vice City Stories", franchise: "Grand Theft Auto", year: 2006, kind: "game", rockstarRole: "developed", platforms: ["psp", "ps2"] }),
  catalogEntry({ id: "manhunt_2", title: "Manhunt 2", franchise: "Manhunt", year: 2007, kind: "game", rockstarRole: "developed", platforms: ["ps2", "psp", "wii", "pc"] }),
  catalogEntry({ id: "bully_scholarship_edition", title: "Bully: Scholarship Edition", franchise: "Bully", year: 2008, kind: "variant", rockstarRole: "developed", parentGameId: "bully", platforms: ["wii", "xbox360", "pc"] }),
  catalogEntry({ id: "gta_iv", title: "Grand Theft Auto IV", franchise: "Grand Theft Auto", year: 2008, kind: "game", rockstarRole: "developed", platforms: ["ps3", "xbox360", "pc"] }),
  catalogEntry({ id: "midnight_club_los_angeles", title: "Midnight Club: Los Angeles", franchise: "Midnight Club", year: 2008, kind: "game", rockstarRole: "developed", platforms: ["ps3", "xbox360"] }),
  catalogEntry({ id: "lost_and_damned", title: "Grand Theft Auto IV: The Lost and Damned", franchise: "Grand Theft Auto", year: 2009, kind: "expansion", rockstarRole: "developed", parentGameId: "gta_iv", platforms: ["xbox360", "ps3", "pc"] }),
  catalogEntry({ id: "chinatown_wars", title: "Grand Theft Auto: Chinatown Wars", franchise: "Grand Theft Auto", year: 2009, kind: "game", rockstarRole: "developed", platforms: ["ds", "psp", "ios", "android"] }),
  catalogEntry({ id: "beaterator", title: "Beaterator", franchise: "Beaterator", year: 2009, kind: "game", rockstarRole: "developed", platforms: ["psp", "ios"] }),
  catalogEntry({ id: "ballad_of_gay_tony", title: "Grand Theft Auto: The Ballad of Gay Tony", franchise: "Grand Theft Auto", year: 2009, kind: "expansion", rockstarRole: "developed", parentGameId: "gta_iv", platforms: ["xbox360", "ps3", "pc"] }),
  catalogEntry({ id: "red_dead_redemption", title: "Red Dead Redemption", franchise: "Red Dead Redemption", year: 2010, kind: "game", rockstarRole: "developed", platforms: ["ps3", "xbox360", "ps4", "switch", "pc"] }),
  catalogEntry({ id: "undead_nightmare", title: "Red Dead Redemption: Undead Nightmare", franchise: "Red Dead Redemption", year: 2010, kind: "expansion", rockstarRole: "developed", parentGameId: "red_dead_redemption", platforms: ["ps3", "xbox360"] }),
  catalogEntry({ id: "la_noire", title: "L.A. Noire", franchise: "L.A. Noire", year: 2011, kind: "game", rockstarRole: "published", platforms: ["ps3", "xbox360", "pc", "ps4", "switch", "vr"] }),
  catalogEntry({ id: "max_payne_3", title: "Max Payne 3", franchise: "Max Payne", year: 2012, kind: "game", rockstarRole: "developed", platforms: ["ps3", "xbox360", "pc"] }),
  catalogEntry({ id: "gta_v", title: "Grand Theft Auto V", franchise: "Grand Theft Auto", year: 2013, kind: "game", rockstarRole: "developed", status: "active", platforms: ["ps3", "xbox360", "ps4", "xboxone", "pc", "ps5", "seriesxs"] }),
  catalogEntry({ id: "gta_online", title: "Grand Theft Auto Online", franchise: "Grand Theft Auto", year: 2013, kind: "online_service", rockstarRole: "developed", parentGameId: "gta_v", status: "active", platforms: ["ps3", "xbox360", "ps4", "xboxone", "pc", "ps5", "seriesxs"] }),
  catalogEntry({ id: "bully_anniversary", title: "Bully: Anniversary Edition", franchise: "Bully", year: 2016, kind: "variant", rockstarRole: "developed", parentGameId: "bully", platforms: ["ios", "android"] }),
  catalogEntry({ id: "la_noire_vr_case_files", title: "L.A. Noire: The VR Case Files", franchise: "L.A. Noire", year: 2017, kind: "variant", rockstarRole: "published", parentGameId: "la_noire", platforms: ["vr"] }),
  catalogEntry({ id: "red_dead_redemption_2", title: "Red Dead Redemption 2", franchise: "Red Dead Redemption", year: 2018, kind: "game", rockstarRole: "developed", status: "active", platforms: ["ps4", "xboxone", "pc"] }),
  catalogEntry({ id: "red_dead_online", title: "Red Dead Online", franchise: "Red Dead Redemption", year: 2019, kind: "online_service", rockstarRole: "developed", parentGameId: "red_dead_redemption_2", status: "active", platforms: ["ps4", "xboxone", "pc"] })
];
