import { catalogSeeds } from "@/data/normalized/catalog";
import { GameEnrichment } from "@/types/domain";

export type EnrichmentValidationResult = {
  errors: string[];
  warnings: string[];
};

const requiredFields = ["summary", "releaseContext", "roleContext", "precisionNote", "sourceName", "sourceUrl", "accessedAt"] as const;

function hasValue(value: unknown) {
  return typeof value === "string" ? value.trim().length > 0 : Boolean(value);
}

export function validateGameEnrichment(enrichment: Record<string, GameEnrichment>): EnrichmentValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const catalogIds = new Set(catalogSeeds.map((seed) => seed.id));

  for (const seed of catalogSeeds) {
    const record = enrichment[seed.id];

    if (!record) {
      errors.push(`${seed.id} is missing enrichment.`);
      continue;
    }

    if (record.gameId !== seed.id) {
      errors.push(`${seed.id} has mismatched gameId ${record.gameId}.`);
    }

    for (const field of requiredFields) {
      if (!hasValue(record[field])) {
        errors.push(`${seed.id} is missing ${field}.`);
      }
    }

    if (record.summary && record.summary.length > 220) {
      warnings.push(`${seed.id} summary is ${record.summary.length} characters; cards may become crowded.`);
    }

    if (record.sourceName === "Wikipedia" && !record.sourceUrl?.includes("wikipedia.org")) {
      warnings.push(`${seed.id} uses Wikipedia as sourceName but sourceUrl is ${record.sourceUrl ?? "missing"}.`);
    }
  }

  for (const gameId of Object.keys(enrichment)) {
    if (!catalogIds.has(gameId)) {
      warnings.push(`${gameId} exists in enrichment but not in the catalog.`);
    }
  }

  return { errors, warnings };
}
