"use client";

import { FilterState, Platform, Region } from "@/types/domain";

import { ModeToggle } from "@/components/ui/mode-toggle";

export function DashboardFilterBar({
  filters,
  onChange,
  onReset,
  franchises,
  platforms,
  families,
  regions,
  generations,
  kinds,
  roles,
  statuses,
  bounds,
  pending
}: {
  filters: FilterState;
  onChange: (patch: Partial<FilterState>) => void;
  onReset: () => void;
  franchises: string[];
  platforms: Platform[];
  families: string[];
  regions: Region[];
  generations: string[];
  kinds: string[];
  roles: string[];
  statuses: string[];
  bounds: { min: number; max: number };
  pending?: boolean;
}) {
  const years = Array.from({ length: bounds.max - bounds.min + 1 }, (_, index) => bounds.min + index);
  const presets: Array<{ label: string; patch: Partial<FilterState> }> = [
    { label: "Interview default", patch: { coverage: "analytics", dataMode: "blended", metricMode: "units", kind: "all", franchise: "all", generation: "all" } },
    { label: "GTA vs Red Dead", patch: { coverage: "analytics", franchise: "Grand Theft Auto", dataMode: "blended", metricMode: "units" } },
    { label: "Official anchors only", patch: { coverage: "analytics", dataMode: "confirmed", metricMode: "units", franchise: "all" } },
    { label: "Highest uncertainty", patch: { coverage: "all", dataMode: "estimated", metricMode: "units", yearStart: bounds.min, yearEnd: 2001 } },
    { label: "Platform era", patch: { generation: "gen6", yearStart: 2000, yearEnd: 2006, dataMode: "blended" } }
  ];

  return (
    <section className="sticky top-[84px] z-30 rounded-[1.8rem] border border-white/10 bg-[#0a0a0b]/75 p-5 shadow-panel backdrop-blur-2xl">
      <div className="mb-5 flex flex-wrap gap-2">
        {presets.map((preset) => (
          <button
            key={preset.label}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[11px] uppercase tracking-[0.24em] text-white/72 transition hover:border-white/18 hover:bg-white/10 disabled:opacity-50"
            disabled={pending}
            onClick={() => onChange(preset.patch)}
            type="button"
          >
            {preset.label}
          </button>
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-[1.1fr,0.9fr]">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <label className="space-y-2">
            <span className="text-[11px] uppercase tracking-[0.28em] text-white/45">Search</span>
            <input
              className="w-full rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/28 focus:border-white/20 focus:bg-white/[0.07]"
              onChange={(event) => onChange({ search: event.target.value })}
              placeholder="Find a title or franchise"
              value={filters.search}
            />
          </label>

          <label className="space-y-2">
            <span className="text-[11px] uppercase tracking-[0.28em] text-white/45">Franchise</span>
            <select
              className="w-full rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
              onChange={(event) => onChange({ franchise: event.target.value })}
              value={filters.franchise}
            >
              <option value="all">All franchises</option>
              {franchises.map((franchise) => (
                <option key={franchise} value={franchise}>
                  {franchise}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-[11px] uppercase tracking-[0.28em] text-white/45">Platform</span>
            <select
              className="w-full rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
              onChange={(event) => onChange({ platform: event.target.value })}
              value={filters.platform}
            >
              <option value="all">All platforms</option>
              {platforms.map((platform) => (
                <option key={platform.id} value={platform.id}>
                  {platform.name}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-[11px] uppercase tracking-[0.28em] text-white/45">Platform family</span>
            <select
              className="w-full rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
              onChange={(event) => onChange({ family: event.target.value })}
              value={filters.family}
            >
              <option value="all">All platform families</option>
              {families.map((family) => (
                <option key={family} value={family}>
                  {family}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-[11px] uppercase tracking-[0.28em] text-white/45">Region</span>
            <select
              className="w-full rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
              onChange={(event) => onChange({ region: event.target.value })}
              value={filters.region}
            >
              <option value="all">All regions</option>
              {regions.map((region) => (
                <option key={region.id} value={region.id}>
                  {region.name}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-[11px] uppercase tracking-[0.28em] text-white/45">Generation</span>
            <select
              className="w-full rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
              onChange={(event) => onChange({ generation: event.target.value })}
              value={filters.generation}
            >
              <option value="all">All generations</option>
              {generations.map((generation) => (
                <option key={generation} value={generation}>
                  {generation.toUpperCase()}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-[11px] uppercase tracking-[0.28em] text-white/45">Release type</span>
            <select
              className="w-full rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
              onChange={(event) => onChange({ kind: event.target.value })}
              value={filters.kind}
            >
              <option value="all">All release types</option>
              {kinds.map((kind) => (
                <option key={kind} value={kind}>
                  {kind.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-[11px] uppercase tracking-[0.28em] text-white/45">Rockstar role</span>
            <select
              className="w-full rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
              onChange={(event) => onChange({ role: event.target.value })}
              value={filters.role}
            >
              <option value="all">All roles</option>
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-[11px] uppercase tracking-[0.28em] text-white/45">Status</span>
            <select
              className="w-full rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
              onChange={(event) => onChange({ status: event.target.value })}
              value={filters.status}
            >
              <option value="all">All statuses</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-[11px] uppercase tracking-[0.28em] text-white/45">Year start</span>
            <select
              className="w-full rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
              onChange={(event) => onChange({ yearStart: Number(event.target.value) })}
              value={filters.yearStart}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-[11px] uppercase tracking-[0.28em] text-white/45">Year end</span>
            <select
              className="w-full rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
              onChange={(event) => onChange({ yearEnd: Number(event.target.value) })}
              value={filters.yearEnd}
            >
              {[...years].reverse().map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </label>

          <div className="flex items-end">
            <button
              className="w-full rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3 text-xs uppercase tracking-[0.26em] text-white/78 transition hover:border-white/18 hover:bg-white/10 disabled:opacity-50"
              disabled={pending}
              onClick={onReset}
              type="button"
            >
              Reset filters
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <ModeToggle
            label="Catalog layer"
            onChange={(coverage) => onChange({ coverage: coverage as typeof filters.coverage })}
            options={[
              { label: "Full catalog", value: "all", hint: "Include every Rockstar release with modeled or confirmed commercial coverage." },
              { label: "Analytics", value: "analytics", hint: "Keep the view anchored to the strongest coverage tiers." },
              { label: "Catalog only", value: "catalog_only", hint: "Focus on release-history entries without the flagship spotlight bias." }
            ]}
            value={filters.coverage}
          />
          <ModeToggle
            label="Metric mode"
            onChange={(metricMode) => onChange({ metricMode })}
            options={[
              { label: "Units", value: "units", hint: "Track lifetime units sold." },
              { label: "Revenue", value: "revenue", hint: "Use modeled ASP-based revenue." }
            ]}
            value={filters.metricMode}
          />
          <ModeToggle
            label="Data mode"
            onChange={(dataMode) => onChange({ dataMode })}
            options={[
              { label: "Blended", value: "blended", hint: "Official totals plus modeled granularity." },
              { label: "Confirmed", value: "confirmed", hint: "Restrict to directly disclosed totals." },
              { label: "Estimated", value: "estimated", hint: "Use the full modeled layer." }
            ]}
            value={filters.dataMode}
          />
          <div className="rounded-[1.3rem] border border-white/10 bg-white/5 p-4 md:col-span-2">
            <p className="text-[11px] uppercase tracking-[0.28em] text-white/45">Current stance</p>
            <p className="mt-3 text-sm leading-7 text-white/68">
              Confirmed narrows the universe to official title milestones. Estimated shows the full modeled layer. Blended
              keeps official totals where public, then fills the missing granularity with transparent estimates.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
