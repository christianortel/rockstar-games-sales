import rawGameEnrichment from "@/data/raw/game-enrichment.json";
import { validateGameEnrichment } from "@/lib/data/enrichment-validation";
import { GameEnrichment } from "@/types/domain";

const enrichment = rawGameEnrichment as Record<string, GameEnrichment>;
const { errors, warnings } = validateGameEnrichment(enrichment);

if (warnings.length) {
  console.warn(warnings.map((warning) => `warning: ${warning}`).join("\n"));
}

if (errors.length) {
  console.error(errors.map((error) => `error: ${error}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log(`enrichment validation passed for ${Object.keys(enrichment).length} records.`);
}
