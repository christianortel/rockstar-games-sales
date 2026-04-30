import { officialSalesEvents, sources } from "@/data/normalized/seed";

type ExpectedAnchor = {
  id: string;
  franchise: string;
  gameId?: string;
  metricValueM: number;
  asOfDate: string;
  sourceId: string;
};

const expectedAnchors: ExpectedAnchor[] = [
  {
    id: "evt-gta-series-2026-02",
    franchise: "Grand Theft Auto",
    metricValueM: 465,
    asOfDate: "2026-02-03",
    sourceId: "ttwo-investor-feb-2026"
  },
  {
    id: "evt-gta-v-2026-02",
    franchise: "Grand Theft Auto",
    gameId: "gta_v",
    metricValueM: 225,
    asOfDate: "2026-02-03",
    sourceId: "ttwo-investor-feb-2026"
  },
  {
    id: "evt-rdr-series-2026-02",
    franchise: "Red Dead Redemption",
    metricValueM: 110,
    asOfDate: "2026-02-03",
    sourceId: "ttwo-investor-feb-2026"
  },
  {
    id: "evt-rdr2-2026-02",
    franchise: "Red Dead Redemption",
    gameId: "red_dead_redemption_2",
    metricValueM: 82,
    asOfDate: "2026-02-03",
    sourceId: "ttwo-investor-feb-2026"
  }
];

const errors: string[] = [];
const sourceById = new Map(sources.map((source) => [source.id, source]));
const eventById = new Map(officialSalesEvents.map((event) => [event.id, event]));

for (const expected of expectedAnchors) {
  const event = eventById.get(expected.id);

  if (!event) {
    errors.push(`Missing official anchor ${expected.id}.`);
    continue;
  }

  if (!event.isOfficial) errors.push(`${expected.id} must be marked official.`);
  if (event.franchise !== expected.franchise) errors.push(`${expected.id} franchise drifted to ${event.franchise}.`);
  if (event.gameId !== expected.gameId) errors.push(`${expected.id} gameId drifted to ${event.gameId ?? "none"}.`);
  if (event.metricValueM !== expected.metricValueM) {
    errors.push(`${expected.id} value drifted to ${event.metricValueM}M, expected ${expected.metricValueM}M.`);
  }
  if (event.asOfDate !== expected.asOfDate) errors.push(`${expected.id} asOfDate drifted to ${event.asOfDate}.`);
  if (event.sourceId !== expected.sourceId) errors.push(`${expected.id} source drifted to ${event.sourceId}.`);

  const source = sourceById.get(event.sourceId);
  if (!source) {
    errors.push(`${expected.id} references missing source ${event.sourceId}.`);
  } else if (source.trustTier !== 1 || source.sourceType !== "investor_relations") {
    errors.push(`${expected.id} must resolve to a Tier 1 investor relations source.`);
  }
}

if (errors.length) {
  console.error(errors.map((error) => `error: ${error}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log(`official anchor validation passed for ${expectedAnchors.length} Take-Two/Rockstar milestones.`);
}
