import { unstable_cache } from "next/cache";

import {
  getAllGames,
  getAllSources,
  getDashboardRows,
  getDashboardSummary,
  getGameDetail,
  getIngestionStatus
} from "@/lib/data/repository";

export const getCachedGames = unstable_cache(async () => getAllGames(), ["games"], {
  tags: ["games"],
  revalidate: 3600
});

export const getCachedDashboard = unstable_cache(async () => ({
  rows: getDashboardRows(),
  summary: getDashboardSummary()
}), ["dashboard"], {
  tags: ["dashboard"],
  revalidate: 1800
});

export const getCachedSources = unstable_cache(async () => getAllSources(), ["sources"], {
  tags: ["sources"],
  revalidate: 3600
});

export const getCachedIngestionStatus = unstable_cache(async () => getIngestionStatus(), ["ingestion"], {
  tags: ["ingestion"],
  revalidate: 900
});

export const getCachedGameDetail = (slug: string) =>
  unstable_cache(async () => getGameDetail(slug), ["games", slug], {
    tags: ["games", `game:${slug}`],
    revalidate: 3600
  })();
