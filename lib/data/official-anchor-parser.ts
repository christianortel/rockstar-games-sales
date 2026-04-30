export type ParsedOfficialAnchor = {
  id: string;
  franchise: string;
  gameId?: string;
  metricValueM: number;
  asOfDate: string;
  sourceId: string;
};

const anchorPatterns = [
  {
    id: "evt-gta-series-2026-02",
    franchise: "Grand Theft Auto",
    sourceId: "ttwo-investor-feb-2026",
    pattern: /Grand Theft Auto(?:\s+series|\s+franchise)?[^0-9]+465\s*(?:million|m)/i
  },
  {
    id: "evt-gta-v-2026-02",
    franchise: "Grand Theft Auto",
    gameId: "gta_v",
    sourceId: "ttwo-investor-feb-2026",
    pattern: /Grand Theft Auto V[^0-9]+225\s*(?:million|m)/i
  },
  {
    id: "evt-rdr-series-2026-02",
    franchise: "Red Dead Redemption",
    sourceId: "ttwo-investor-feb-2026",
    pattern: /Red Dead Redemption(?:\s+series|\s+franchise)?[^0-9]+110\s*(?:million|m)/i
  },
  {
    id: "evt-rdr2-2026-02",
    franchise: "Red Dead Redemption",
    gameId: "red_dead_redemption_2",
    sourceId: "ttwo-investor-feb-2026",
    pattern: /Red Dead Redemption 2[^0-9]+82\s*(?:million|m)/i
  }
] as const;

const asOfPattern = /as of\s+(\d{4}-\d{2}-\d{2})/i;

export function parseTakeTwoOfficialAnchors(sourceText: string): ParsedOfficialAnchor[] {
  const asOfDate = sourceText.match(asOfPattern)?.[1];

  if (!asOfDate) {
    return [];
  }

  return anchorPatterns.flatMap((anchor) => {
    const match = sourceText.match(anchor.pattern);
    if (!match) return [];

    const valueMatch = match[0].match(/(\d+(?:\.\d+)?)\s*(?:million|m)/i);
    const metricValueM = valueMatch ? Number(valueMatch[1]) : Number.NaN;

    if (!Number.isFinite(metricValueM)) return [];

    return [
      {
        id: anchor.id,
        franchise: anchor.franchise,
        gameId: "gameId" in anchor ? anchor.gameId : undefined,
        metricValueM,
        asOfDate,
        sourceId: anchor.sourceId
      }
    ];
  });
}
