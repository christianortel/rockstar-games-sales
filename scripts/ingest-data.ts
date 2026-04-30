import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

import { currentModelVersion, officialSalesEvents, sources } from "@/data/normalized/seed";
import rawGameEnrichment from "@/data/raw/game-enrichment.json";
import { officialDataFreshness } from "@/lib/data/freshness";
import { IngestionRun, SourceSnapshot } from "@/types/domain";

const SNAPSHOT_FILE = path.join(process.cwd(), "data", "raw", "source-snapshots.json");
const RUN_FILE = path.join(process.cwd(), "data", "raw", "ingestion-runs.json");

function hashContent(content: string) {
  return createHash("sha256").update(content).digest("hex");
}

async function fetchSnapshot(source: (typeof sources)[number]): Promise<SourceSnapshot> {
  const capturedAt = new Date().toISOString();

  if (source.sourceType === "manual_model") {
    return {
      id: `${source.id}-${capturedAt.slice(0, 10)}`,
      sourceId: source.id,
      sourceUrl: source.sourceUrl,
      capturedAt,
      contentHash: hashContent(`${source.id}:${source.notes}:${currentModelVersion}`),
      extractionMethod: "internal_model_hash",
      reviewStatus: "approved",
      notes: "Internal modeling source is hashed from the local methodology notes and model version."
    };
  }

  try {
    const response = await fetch(source.sourceUrl, {
      headers: {
        "user-agent": "rockstar-sales-universe-ingest/1.0 (portfolio data audit)"
      }
    });
    const body = await response.text();
    const isDocumentedException = source.id === "mobygames-catalog" && response.status === 403;

    return {
      id: `${source.id}-${capturedAt.slice(0, 10)}`,
      sourceId: source.id,
      sourceUrl: source.sourceUrl,
      capturedAt,
      contentHash: hashContent(body),
      extractionMethod: "http_fetch_hash_only",
      reviewStatus: response.ok ? "approved" : isDocumentedException ? "documented_exception" : "needs_review",
      notes: response.ok
        ? "Fetched source and stored a content hash for auditability. Full source text is not stored in the repo."
        : isDocumentedException
          ? "Direct unauthenticated fetch returns HTTP 403. This source is retained as a Tier 2 metadata reference only, not as an official sales source."
        : `Fetch returned HTTP ${response.status}; source remains in the stack but needs review.`
    };
  } catch (error) {
    return {
      id: `${source.id}-${capturedAt.slice(0, 10)}`,
      sourceId: source.id,
      sourceUrl: source.sourceUrl,
      capturedAt,
      contentHash: hashContent(`${source.sourceUrl}:${capturedAt}`),
      extractionMethod: "fetch_failed_placeholder_hash",
      reviewStatus: "needs_review",
      notes: error instanceof Error ? error.message : "Unknown fetch error"
    };
  }
}

async function main() {
  const startedAt = new Date();
  const snapshots = await Promise.all(sources.map(fetchSnapshot));
  const run: IngestionRun = {
    id: `ingest-${startedAt.toISOString().slice(0, 10)}`,
    startedAt: startedAt.toISOString(),
    completedAt: new Date().toISOString(),
    status: snapshots.some((snapshot) => snapshot.reviewStatus === "needs_review" || snapshot.reviewStatus === "documented_exception") ? "warning" : "success",
    sourceCount: sources.length,
    officialEventCount: officialSalesEvents.length,
    enrichmentCount: Object.keys(rawGameEnrichment).length,
    modelVersion: currentModelVersion,
    notes: [
      `Official baseline: ${officialDataFreshness.latestOfficialLabel} (${officialDataFreshness.latestOfficialAsOfDate}).`,
      `Next official refresh checkpoint: ${officialDataFreshness.nextOfficialReportLabel} on ${officialDataFreshness.nextOfficialReportDate}.`,
      "This run stores hashes and review status for source auditability; it does not store copyrighted source bodies."
    ]
  };

  mkdirSync(path.dirname(SNAPSHOT_FILE), { recursive: true });
  writeFileSync(SNAPSHOT_FILE, `${JSON.stringify(snapshots, null, 2)}\n`, "utf8");
  writeFileSync(RUN_FILE, `${JSON.stringify([run], null, 2)}\n`, "utf8");

  console.log(`wrote ${snapshots.length} source snapshots to ${SNAPSHOT_FILE}`);
  console.log(`wrote ingestion run ${run.id} to ${RUN_FILE}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
