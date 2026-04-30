import { FilterState } from "@/types/domain";

interface SearchParamReader {
  get(name: string): string | null;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export type DashboardTab = "overview" | "franchises" | "titles" | "platforms" | "sources" | "model-audit";
export type RankingSortKey = "rank" | "title" | "franchise" | "year" | "metric" | "confidence" | "provenance";
export type SortDirection = "asc" | "desc";

export interface DashboardViewState {
  tab: DashboardTab;
  sort: RankingSortKey;
  direction: SortDirection;
}

export function parseDashboardViewState(searchParams: SearchParamReader): DashboardViewState {
  const tabParam = searchParams.get("tab");
  const sortParam = searchParams.get("sort");
  const directionParam = searchParams.get("dir");

  const tab: DashboardTab =
    tabParam === "franchises" ||
    tabParam === "titles" ||
    tabParam === "platforms" ||
    tabParam === "sources" ||
    tabParam === "model-audit"
      ? tabParam
      : "overview";
  const sort: RankingSortKey =
    sortParam === "title" ||
    sortParam === "franchise" ||
    sortParam === "year" ||
    sortParam === "metric" ||
    sortParam === "confidence" ||
    sortParam === "provenance"
      ? sortParam
      : "rank";

  return {
    tab,
    sort,
    direction: directionParam === "asc" ? "asc" : "desc"
  };
}

export function updateDashboardViewSearchParams(current: URLSearchParams, patch: Partial<DashboardViewState>) {
  const next = new URLSearchParams(current.toString());
  const currentView = parseDashboardViewState(current);
  const values = { ...currentView, ...patch };

  if (values.tab === "overview") next.delete("tab");
  else next.set("tab", values.tab);

  if (values.sort === "rank") next.delete("sort");
  else next.set("sort", values.sort);

  if (values.direction === "desc") next.delete("dir");
  else next.set("dir", values.direction);

  return next;
}

export function parseDashboardFilters(
  searchParams: SearchParamReader,
  bounds: { min: number; max: number }
): FilterState {
  const yearStartParam = Number(searchParams.get("yearStart") ?? bounds.min);
  const yearEndParam = Number(searchParams.get("yearEnd") ?? bounds.max);

  return {
    franchise: searchParams.get("franchise") ?? "all",
    platform: searchParams.get("platform") ?? "all",
    family: searchParams.get("family") ?? "all",
    region: searchParams.get("region") ?? "all",
    generation: searchParams.get("generation") ?? "all",
    kind: searchParams.get("kind") ?? "all",
    role: searchParams.get("role") ?? "all",
    status: searchParams.get("status") ?? "all",
    coverage:
      searchParams.get("coverage") === "catalog_only"
        ? "catalog_only"
        : searchParams.get("coverage") === "analytics"
          ? "analytics"
          : "all",
    yearStart: clamp(Number.isNaN(yearStartParam) ? bounds.min : yearStartParam, bounds.min, bounds.max),
    yearEnd: clamp(Number.isNaN(yearEndParam) ? bounds.max : yearEndParam, bounds.min, bounds.max),
    search: searchParams.get("search") ?? "",
    metricMode: searchParams.get("metric") === "revenue" ? "revenue" : "units",
    dataMode:
      searchParams.get("mode") === "confirmed"
        ? "confirmed"
        : searchParams.get("mode") === "estimated"
          ? "estimated"
          : "blended"
  };
}

export function updateDashboardSearchParams(
  current: URLSearchParams,
  patch: Partial<FilterState>,
  defaults: { min: number; max: number }
) {
  const next = new URLSearchParams(current.toString());

  const values: FilterState = {
    franchise: patch.franchise ?? current.get("franchise") ?? "all",
    platform: patch.platform ?? current.get("platform") ?? "all",
    family: patch.family ?? current.get("family") ?? "all",
    region: patch.region ?? current.get("region") ?? "all",
    generation: patch.generation ?? current.get("generation") ?? "all",
    kind: patch.kind ?? current.get("kind") ?? "all",
    role: patch.role ?? current.get("role") ?? "all",
    status: patch.status ?? current.get("status") ?? "all",
    coverage: (patch.coverage ?? current.get("coverage") ?? "all") as FilterState["coverage"],
    yearStart: patch.yearStart ?? Number(current.get("yearStart") ?? defaults.min),
    yearEnd: patch.yearEnd ?? Number(current.get("yearEnd") ?? defaults.max),
    search: patch.search ?? current.get("search") ?? "",
    metricMode: (patch.metricMode ?? current.get("metric") ?? "units") as FilterState["metricMode"],
    dataMode: (patch.dataMode ?? current.get("mode") ?? "blended") as FilterState["dataMode"]
  };

  const assign = (key: string, value: string, fallback: string) => {
    if (!value || value === fallback) {
      next.delete(key);
      return;
    }
    next.set(key, value);
  };

  assign("franchise", values.franchise, "all");
  assign("platform", values.platform, "all");
  assign("family", values.family, "all");
  assign("region", values.region, "all");
  assign("generation", values.generation, "all");
  assign("kind", values.kind, "all");
  assign("role", values.role, "all");
  assign("status", values.status, "all");
  assign("coverage", values.coverage, "all");
  assign("search", values.search, "");
  assign("metric", values.metricMode, "units");
  assign("mode", values.dataMode, "blended");
  assign("yearStart", String(values.yearStart), String(defaults.min));
  assign("yearEnd", String(values.yearEnd), String(defaults.max));

  return next;
}

export const defaultCompareIds = ["gta_v", "red_dead_redemption_2", "san_andreas"];
export interface CompareFilterState {
  search: string;
  franchise: string;
  kind: string;
  coverage: "all" | "featured" | "supported";
}

export function parseCompareFilters(searchParams: SearchParamReader): CompareFilterState {
  return {
    search: searchParams.get("search") ?? "",
    franchise: searchParams.get("franchise") ?? "all",
    kind: searchParams.get("kind") ?? "all",
    coverage:
      searchParams.get("coverage") === "featured"
        ? "featured"
        : searchParams.get("coverage") === "supported"
          ? "supported"
          : "all"
  };
}

export function parseCompareGameIds(searchParams: SearchParamReader, availableIds: string[]) {
  const requested = (searchParams.get("games") ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .filter((item, index, array) => array.indexOf(item) === index)
    .filter((item) => availableIds.includes(item));

  if (requested.length >= 2) return requested.slice(0, 4);

  return defaultCompareIds.filter((id) => availableIds.includes(id));
}

export function updateCompareGameIds(current: URLSearchParams, gameIds: string[]) {
  const next = new URLSearchParams(current.toString());
  next.set("games", gameIds.join(","));
  return next;
}

export function updateCompareSearchParams(
  current: URLSearchParams,
  patch: Partial<CompareFilterState> & { games?: string[] }
) {
  const next = new URLSearchParams(current.toString());

  const assign = (key: string, value: string, fallback: string) => {
    if (!value || value === fallback) {
      next.delete(key);
      return;
    }

    next.set(key, value);
  };

  if (patch.games) {
    next.set("games", patch.games.join(","));
  }

  assign("search", patch.search ?? current.get("search") ?? "", "");
  assign("franchise", patch.franchise ?? current.get("franchise") ?? "all", "all");
  assign("kind", patch.kind ?? current.get("kind") ?? "all", "all");
  assign("coverage", patch.coverage ?? current.get("coverage") ?? "all", "all");

  return next;
}
