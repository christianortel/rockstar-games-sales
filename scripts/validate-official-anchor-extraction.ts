import officialAnchorFixtures from "@/data/raw/official-anchor-fixtures.json";
import { officialSalesEvents } from "@/data/normalized/seed";
import { parseTakeTwoOfficialAnchors } from "@/lib/data/official-anchor-parser";

const fixtureText = officialAnchorFixtures["ttwo-investor-feb-2026"];
const parsedAnchors = parseTakeTwoOfficialAnchors(fixtureText);
const officialById = new Map(officialSalesEvents.map((event) => [event.id, event]));
const errors: string[] = [];

if (parsedAnchors.length !== 4) {
  errors.push(`Expected 4 parsed official anchors, received ${parsedAnchors.length}.`);
}

for (const parsed of parsedAnchors) {
  const expected = officialById.get(parsed.id);

  if (!expected) {
    errors.push(`Parsed unknown official anchor ${parsed.id}.`);
    continue;
  }

  if (parsed.metricValueM !== expected.metricValueM) {
    errors.push(`${parsed.id} parsed ${parsed.metricValueM}M, expected ${expected.metricValueM}M.`);
  }
  if (parsed.asOfDate !== expected.asOfDate) {
    errors.push(`${parsed.id} parsed date ${parsed.asOfDate}, expected ${expected.asOfDate}.`);
  }
  if (parsed.sourceId !== expected.sourceId) {
    errors.push(`${parsed.id} parsed source ${parsed.sourceId}, expected ${expected.sourceId}.`);
  }
  if (parsed.gameId !== expected.gameId) {
    errors.push(`${parsed.id} parsed game ${parsed.gameId ?? "none"}, expected ${expected.gameId ?? "none"}.`);
  }
}

if (errors.length) {
  console.error(errors.map((error) => `error: ${error}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log(`official anchor extraction validation passed for ${parsedAnchors.length} parsed Take-Two milestones.`);
}
