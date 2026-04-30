import { NextResponse } from "next/server";

import { getIngestionStatus } from "@/lib/data/repository";
import { checkDatabaseHealth } from "@/lib/db/health";

export async function GET() {
  const ingestion = getIngestionStatus();
  const database = await checkDatabaseHealth();
  const ok = !database.configured || database.connected;

  return NextResponse.json(
    {
      ok,
      database,
      ingestion: {
        latestRun: ingestion.latestRun?.id ?? null,
        status: ingestion.latestRun?.status ?? "not_run",
        latestOfficialAsOfDate: ingestion.latestOfficialAsOfDate,
        nextOfficialReportDate: ingestion.nextOfficialReportDate,
        modelVersion: ingestion.modelVersion
      }
    },
    { status: ok ? 200 : 503 }
  );
}
