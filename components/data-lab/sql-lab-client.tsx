"use client";

import { useMemo, useState } from "react";
import { Database, Play, Table2 } from "lucide-react";
import Script from "next/script";

import { SceneBackdrop } from "@/components/layout/scene-backdrop";
import { SectionShell } from "@/components/ui/section-shell";
import { getAssetForGame, getThemeForGame } from "@/lib/data/repository";
import { sqlLabPresets, sqlLabTables } from "@/lib/data/sql-lab";

type QueryResultRow = Record<string, unknown>;
type AlaSqlRuntime = {
  (query: string): QueryResultRow[] | QueryResultRow;
  tables: Record<string, { data: unknown[] }>;
};

declare global {
  interface Window {
    alasql?: AlaSqlRuntime;
  }
}

const theme = getThemeForGame("gta_iv");
const asset = getAssetForGame("gta_iv");

export function SqlLabClient() {
  const [query, setQuery] = useState<string>(sqlLabPresets[0].query);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<QueryResultRow[]>([]);
  const [ready, setReady] = useState(false);

  const tableSummary = useMemo(
    () => Object.entries(sqlLabTables).map(([name, data]) => ({ name, count: data.length })),
    []
  );

  const runQuery = () => {
    const runtime = window.alasql;

    if (!runtime) {
      setError("SQL runtime is still loading.");
      setRows([]);
      return;
    }

    try {
      Object.entries(sqlLabTables).forEach(([name, data]) => {
        runtime(`DROP TABLE IF EXISTS ${name}`);
        runtime(`CREATE TABLE ${name}`);
        runtime.tables[name].data = [...data];
      });

      const result = runtime(query) as QueryResultRow[] | QueryResultRow;
      const normalized = Array.isArray(result) ? result : [result];
      setRows(normalized);
      setError(null);
    } catch (issue) {
      setRows([]);
      setError(issue instanceof Error ? issue.message : "Query failed.");
    }
  };

  const columns = rows[0] ? Object.keys(rows[0]) : [];

  return (
    <div className="space-y-8">
      <Script onLoad={() => setReady(true)} src="/vendor/alasql.min.js" strategy="afterInteractive" />
      <SceneBackdrop
        backgroundPosition={asset?.backgroundPosition}
        image={asset?.backgroundImage}
        sceneKey="data-lab"
        theme={theme}
      />

      <section className="rounded-[2.5rem] border border-white/10 bg-black/25 p-6 shadow-panel backdrop-blur-xl md:p-8">
        <div className="grid gap-8 xl:grid-cols-[1.15fr,0.85fr]">
          <div>
            <p className="text-[11px] uppercase tracking-[0.32em]" style={{ color: theme.accent }}>
              Data lab
            </p>
            <h1 className="mt-3 max-w-[12ch] font-display text-5xl uppercase tracking-[0.05em] text-white md:text-7xl">
              Query the raw model
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-white/70">
              This lab exposes the local seed, release metadata, official sales events, and derived sales facts through a
              read-only SQL surface. Use it to inspect the raw rows behind the visual product.
            </p>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-white/6 p-6">
            <p className="text-[11px] uppercase tracking-[0.28em] text-white/45">Loaded tables</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {tableSummary.map((table) => (
                <div key={table.name} className="rounded-[1.2rem] border border-white/8 bg-black/20 p-4">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-white/45">{table.name}</p>
                  <p className="mt-2 font-display text-2xl uppercase tracking-[0.04em] text-white">{table.count}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SectionShell
        accent={theme.accent}
        description="Start with a preset or write your own SELECT query. The lab is read-only and rehydrates from the current local dataset each run."
        eyebrow="Workbench"
        title="SQL query surface"
      >
        <div className="grid gap-5 xl:grid-cols-[0.7fr,1.3fr]">
          <div className="space-y-3">
            {sqlLabPresets.map((preset) => (
              <button
                key={preset.label}
                className="w-full rounded-[1.4rem] border border-white/10 bg-white/5 p-4 text-left transition hover:border-white/18 hover:bg-white/8"
                onClick={() => setQuery(preset.query)}
                type="button"
              >
                <p className="text-[11px] uppercase tracking-[0.24em]" style={{ color: theme.accent }}>
                  {preset.label}
                </p>
                <p className="mt-2 text-sm leading-7 text-white/66">{preset.description}</p>
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <div className="rounded-[1.7rem] border border-white/10 bg-white/5 p-5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Database className="h-5 w-5 text-white/45" />
                  <p className="text-[11px] uppercase tracking-[0.28em] text-white/45">Editor</p>
                </div>
                <button
                  className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-xs uppercase tracking-[0.22em] text-white/80 transition hover:border-white/20 hover:bg-white/12"
                  disabled={!ready}
                  onClick={runQuery}
                  type="button"
                >
                  <Play className="h-4 w-4" />
                  Run query
                </button>
              </div>
              <textarea
                className="mt-4 min-h-[220px] w-full rounded-[1.3rem] border border-white/10 bg-[#07090d] p-4 font-mono text-sm leading-7 text-white outline-none"
                onChange={(event) => setQuery(event.target.value)}
                spellCheck={false}
                value={query}
              />
              {error ? <p className="mt-3 text-sm text-[#ff8a80]">{error}</p> : null}
              {!ready ? <p className="mt-3 text-sm text-white/50">Loading SQL runtime...</p> : null}
            </div>

            <div className="rounded-[1.7rem] border border-white/10 bg-white/5 p-5">
              <div className="flex items-center gap-3">
                <Table2 className="h-5 w-5 text-white/45" />
                <div>
                  <p className="text-[11px] uppercase tracking-[0.28em] text-white/45">Result set</p>
                  <h3 className="mt-2 font-display text-2xl uppercase tracking-[0.05em] text-white">
                    {rows.length ? `${rows.length} row${rows.length === 1 ? "" : "s"}` : "No rows yet"}
                  </h3>
                </div>
              </div>
              {rows.length ? (
                <div className="mt-5 overflow-x-auto">
                  <table className="min-w-full divide-y divide-white/10">
                    <thead>
                      <tr>
                        {columns.map((column) => (
                          <th key={column} className="px-3 py-3 text-left text-[11px] uppercase tracking-[0.22em] text-white/45">
                            {column}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/8">
                      {rows.slice(0, 100).map((row, index) => (
                        <tr key={index}>
                          {columns.map((column) => (
                            <td key={column} className="px-3 py-3 text-sm text-white/72">
                              {String(row[column] ?? "")}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="mt-5 text-sm leading-7 text-white/64">
                  Run a query to inspect the raw data. Results are capped to the first 100 rows in the grid.
                </p>
              )}
            </div>
          </div>
        </div>
      </SectionShell>
    </div>
  );
}
