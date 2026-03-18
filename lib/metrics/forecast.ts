import { getDashboardRows } from "@/lib/data/repository";
import { buildGameTrend } from "@/lib/metrics/presenters";

type ForecastScenarioId = "conservative" | "base" | "upside";

export interface GtaSixForecastScenario {
  id: ForecastScenarioId;
  label: string;
  firstYearUnitsM: number;
  firstYearRevenueUsdM: number;
  threeYearUnitsM: number;
  threeYearRevenueUsdM: number;
  fiveYearRevenueUsdM: number;
  readout: string;
}

interface LaunchBenchmark {
  gameId: string;
  title: string;
  firstYearUnitsM: number;
  firstYearRevenueUsdM: number;
}

function buildLaunchBenchmark(gameId: string): LaunchBenchmark {
  const row = getDashboardRows().find((item) => item.game.id === gameId);
  const firstYearUnitsM = buildGameTrend(gameId)[0]?.annualUnitsM ?? 0;

  return {
    gameId,
    title: row?.game.title ?? gameId,
    firstYearUnitsM,
    firstYearRevenueUsdM: Number((firstYearUnitsM * (row?.game.averageSellingPriceUsd ?? 0)).toFixed(0))
  };
}

export function buildGtaSixForecast() {
  const scenarios: GtaSixForecastScenario[] = [
    {
      id: "conservative",
      label: "Conservative",
      firstYearUnitsM: 28,
      firstYearRevenueUsdM: 2296,
      threeYearUnitsM: 52,
      threeYearRevenueUsdM: 4004,
      fiveYearRevenueUsdM: 5550,
      readout: "Strong premium launch, but below the most aggressive blockbuster expectations."
    },
    {
      id: "base",
      label: "Base case",
      firstYearUnitsM: 36,
      firstYearRevenueUsdM: 3024,
      threeYearUnitsM: 72,
      threeYearRevenueUsdM: 5616,
      fiveYearRevenueUsdM: 7980,
      readout: "A launch that clears Red Dead Redemption 2's opening pace and settles into a major multi-year premium tail."
    },
    {
      id: "upside",
      label: "Upside",
      firstYearUnitsM: 45,
      firstYearRevenueUsdM: 3870,
      threeYearUnitsM: 90,
      threeYearRevenueUsdM: 7110,
      fiveYearRevenueUsdM: 10010,
      readout: "Near-event-level demand with sustained platform expansion and a very high-priced launch mix."
    }
  ];

  const benchmarks = [buildLaunchBenchmark("gta_v"), buildLaunchBenchmark("red_dead_redemption_2")];
  const baseScenario = scenarios.find((scenario) => scenario.id === "base") ?? scenarios[1];
  const maxLaunchRevenue = Math.max(...scenarios.map((scenario) => scenario.firstYearRevenueUsdM), ...benchmarks.map((item) => item.firstYearRevenueUsdM));

  return {
    scenarios,
    benchmarks,
    baseScenario,
    maxLaunchRevenue,
    revenueRange: {
      low: scenarios[0].fiveYearRevenueUsdM,
      high: scenarios[2].fiveYearRevenueUsdM
    },
    assumptions: [
      "Assumes a premium console-first launch wave with a later platform expansion tail.",
      "Uses a launch ASP band around $82-$86, then eases the long-term average lower as the catalog matures.",
      "Premium software revenue only: excludes recurring online spend, subscriptions, bundles, and merchandising.",
      "Treats GTA V and Red Dead Redemption 2 as internal benchmarks, not direct one-to-one templates."
    ],
    catalysts: [
      "High launch pricing power and collector-edition mix.",
      "Large premium-console installed base at release.",
      "A later PC wave and long-tail content cadence.",
      "A likely online-service layer that extends the franchise halo beyond the base game."
    ]
  };
}
