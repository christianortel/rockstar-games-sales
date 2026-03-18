"use client";

import Link from "next/link";
import { Download, Swords } from "lucide-react";

import { DataBadge } from "@/components/ui/data-badge";
import { formatCurrencyMillions, formatMillions } from "@/lib/formatters";
import { resolveMetricValue } from "@/lib/metrics/aggregations";
import { DashboardGameRow, DataMode, MetricMode } from "@/types/domain";

function downloadCsv(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function RankingTable({
  rows,
  metricMode,
  dataMode
}: {
  rows: DashboardGameRow[];
  metricMode: MetricMode;
  dataMode: DataMode;
}) {
  const sortedRows = rows
    .slice()
    .sort((a, b) => resolveMetricValue(b, metricMode, dataMode) - resolveMetricValue(a, metricMode, dataMode));

  const formatter = metricMode === "revenue" ? formatCurrencyMillions : formatMillions;

  const exportRows = () => {
    const header = ["Rank", "Title", "Franchise", "Release Year", "Metric Value", "Platforms", "Confidence", "Data Mode"];
    const body = sortedRows.map((row, index) => [
      index + 1,
      row.game.title,
      row.game.franchise,
      row.game.releaseYear,
      resolveMetricValue(row, metricMode, dataMode).toFixed(1),
      row.platforms.map((platform) => platform.name).join(" | "),
      `${Math.round(row.confidence * 100)}%`,
      dataMode
    ]);

    downloadCsv([header, ...body].map((line) => line.join(",")).join("\n"), "rockstar-sales-universe.csv");
  };

  return (
    <div className="overflow-hidden rounded-[1.7rem] border border-white/10 bg-white/5 backdrop-blur-xl">
      <div className="flex flex-col gap-4 border-b border-white/10 px-5 py-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-white/45">Ranking table</p>
          <p className="mt-2 text-sm text-white/66">Searchable catalog ranking under the active filter, metric, and data mode.</p>
        </div>
        <button
          className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-4 py-2 text-xs uppercase tracking-[0.24em] text-white/80 transition hover:border-white/20 hover:bg-white/10"
          onClick={exportRows}
          type="button"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10">
          <thead className="bg-black/25">
            <tr>
              {["Rank", "Title", "Franchise", "Year", "Metric", "Platforms", "Confidence", "Mode", "Actions"].map((heading) => (
                <th key={heading} className="px-5 py-4 text-left text-[11px] uppercase tracking-[0.24em] text-white/45">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/8">
            {sortedRows.map((row, index) => (
              <tr key={row.game.id} className="hover:bg-white/[0.03]">
                <td className="px-5 py-4 text-sm text-white/72">{index + 1}</td>
                <td className="px-5 py-4">
                  <Link className="font-semibold text-white transition hover:text-white/78" href={`/game/${row.game.slug}`}>
                    {row.game.title}
                  </Link>
                  <p className="mt-1 max-w-md text-sm text-white/50">{row.game.shortDescription}</p>
                  <p className="mt-2 text-[11px] uppercase tracking-[0.22em] text-white/38">
                    {row.game.analyticsCoverage === "catalog_only" ? "Catalog only" : row.game.analyticsCoverage} | {row.game.kind.replace(/_/g, " ")}
                  </p>
                </td>
                <td className="px-5 py-4 text-sm text-white/72">{row.game.franchise}</td>
                <td className="px-5 py-4 text-sm text-white/72">{row.game.releaseYear}</td>
                <td className="px-5 py-4 font-display text-lg uppercase tracking-[0.04em] text-white">
                  {formatter(resolveMetricValue(row, metricMode, dataMode))}
                </td>
                <td className="px-5 py-4 text-sm text-white/72">{row.platforms.length}</td>
                <td className="px-5 py-4 text-sm text-white/72">{Math.round(row.confidence * 100)}%</td>
                <td className="px-5 py-4">
                  <DataBadge mode={dataMode} />
                </td>
                <td className="px-5 py-4">
                  {row.game.analyticsCoverage === "catalog_only" ? (
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] text-white/38">
                      Catalog only
                    </span>
                  ) : (
                    <Link
                      className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] text-white/76 transition hover:border-white/20 hover:bg-white/10"
                      href={`/compare?games=${row.game.id},gta_v`}
                    >
                      <Swords className="h-3.5 w-3.5" />
                      Compare
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
