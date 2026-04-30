const baseUrl = process.env.APP_BASE_URL ?? "http://localhost:3000";

const routes = [
  { path: "/", type: "html" },
  { path: "/dashboard", type: "html" },
  { path: "/dashboard?tab=titles&sort=confidence&dir=asc", type: "html" },
  { path: "/dashboard?tab=sources", type: "html" },
  { path: "/dashboard?tab=model-audit", type: "html" },
  { path: "/compare", type: "html" },
  { path: "/compare?games=gta_v,red_dead_redemption_2", type: "html" },
  { path: "/data-lab", type: "html" },
  { path: "/methodology", type: "html" },
  { path: "/admin/source-review", type: "html" },
  { path: "/game/grand-theft-auto-v", type: "html" },
  { path: "/game/red-dead-redemption-2", type: "html" },
  { path: "/game/bully", type: "html" },
  { path: "/game/la-noire", type: "html" },
  { path: "/api/health", type: "json" },
  { path: "/opengraph-image", type: "image" },
  { path: "/dashboard/opengraph-image", type: "image" },
  { path: "/compare/opengraph-image", type: "image" },
  { path: "/data-lab/opengraph-image", type: "image" },
  { path: "/methodology/opengraph-image", type: "image" },
  { path: "/game/grand-theft-auto-v/opengraph-image", type: "image" },
  { path: "/game/red-dead-redemption-2/opengraph-image", type: "image" },
  { path: "/game/bully/opengraph-image", type: "image" },
  { path: "/game/la-noire/opengraph-image", type: "image" }
];

async function checkRoute(route: { path: string; type: string }) {
  const url = new URL(route.path, baseUrl);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`${url.toString()} returned ${response.status}`);
  }

  if (route.type === "json") {
    const payload = (await response.json()) as {
      ok?: boolean;
      database?: {
        configured?: boolean;
        connected?: boolean | null;
        mode?: string;
      };
      ingestion?: {
        latestOfficialAsOfDate?: string;
        modelVersion?: string;
        nextOfficialReportDate?: string;
      };
    };

    if (!payload.ok || !payload.ingestion?.modelVersion) {
      throw new Error(`${url.toString()} returned an invalid health payload`);
    }

    if (!payload.ingestion.latestOfficialAsOfDate || !payload.ingestion.nextOfficialReportDate) {
      throw new Error(`${url.toString()} did not include official data freshness fields`);
    }

    if (!payload.database) {
      throw new Error(`${url.toString()} did not include database health`);
    }

    if (payload.database.configured === false) {
      if (payload.database.mode !== "local-seed-fallback" || payload.database.connected !== null) {
        throw new Error(`${url.toString()} returned an invalid local fallback database health payload`);
      }
    } else if (payload.database.configured === true) {
      if (payload.database.mode !== "postgres" || payload.database.connected !== true) {
        throw new Error(`${url.toString()} returned an invalid Postgres database health payload`);
      }
    } else {
      throw new Error(`${url.toString()} did not report whether the database is configured`);
    }
  } else if (route.type === "image") {
    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("image/png")) {
      throw new Error(`${url.toString()} returned ${contentType}, expected image/png`);
    }

    const bytes = await response.arrayBuffer();
    if (bytes.byteLength < 10_000) {
      throw new Error(`${url.toString()} returned an unexpectedly small image payload`);
    }
  } else {
    const html = await response.text();
    if (!html.includes("Rockstar")) {
      throw new Error(`${url.toString()} did not render expected app content`);
    }
  }

  console.log(`ok ${url.toString()}`);
}

async function main() {
  for (const route of routes) {
    await checkRoute(route);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
