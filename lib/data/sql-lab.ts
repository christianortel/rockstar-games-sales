import { derivedSalesFacts } from "@/lib/data/repository";
import { games, methodologies, officialSalesEvents, platforms, regions, releases, sources } from "@/data/normalized/seed";

function toSnakeCaseRecord<T extends object>(record: T) {
  return Object.fromEntries(
    Object.entries(record as Record<string, unknown>).map(([key, value]) => [
      key.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`),
      value
    ])
  );
}

export const sqlLabTables = {
  games: games.map((game) => toSnakeCaseRecord(game)),
  platforms: platforms.map((platform) => toSnakeCaseRecord(platform)),
  releases: releases.map((release) => toSnakeCaseRecord(release)),
  regions: regions.map((region) => toSnakeCaseRecord(region)),
  official_sales_events: officialSalesEvents.map((event) => toSnakeCaseRecord(event)),
  derived_sales_facts: derivedSalesFacts.map((fact) => toSnakeCaseRecord(fact)),
  methodologies: methodologies.map((methodology) => toSnakeCaseRecord(methodology)),
  sources: sources.map((source) => toSnakeCaseRecord(source))
} as const;

export const sqlLabPresets = [
  {
    label: "Top 15 by units",
    description: "Quick ranking of the biggest Rockstar releases in the modeled dataset.",
    query:
      "SELECT title, franchise, release_year, blended_units_m FROM (SELECT g.title, g.franchise, g.release_year, g.estimated_lifetime_units_m AS blended_units_m FROM games AS g) ORDER BY blended_units_m DESC LIMIT 15"
  },
  {
    label: "Games by platform family",
    description: "See how many releases are associated with each hardware family.",
    query:
      "SELECT p.family, COUNT(DISTINCT r.game_id) AS games FROM releases AS r JOIN platforms AS p ON r.platform_id = p.id GROUP BY p.family ORDER BY games DESC"
  },
  {
    label: "Supported GTA releases",
    description: "List Grand Theft Auto releases in the dataset that carry analytics coverage.",
    query:
      "SELECT title, kind, analytics_coverage, release_year FROM games WHERE franchise = 'Grand Theft Auto' AND analytics_coverage <> 'catalog_only' ORDER BY release_year DESC"
  },
  {
    label: "Platform facts by title",
    description: "Inspect modeled platform facts at the raw grain used by the charts.",
    query:
      "SELECT game_id, platform_id, year, estimated_units_sold_m, confidence_score FROM derived_sales_facts ORDER BY estimated_units_sold_m DESC LIMIT 25"
  }
] as const;
