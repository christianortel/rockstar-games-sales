export const officialDataFreshness = {
  latestOfficialAsOfDate: "2026-02-03",
  latestOfficialLabel: "Take-Two Q3 FY2026 / February 2026 investor materials",
  nextOfficialReportDate: "2026-05-21",
  nextOfficialReportLabel: "Take-Two Q4 and fiscal year 2026 results"
} as const;

export function isOfficialBaselineStale(now = new Date()) {
  return now.getTime() >= new Date(`${officialDataFreshness.nextOfficialReportDate}T23:59:59-04:00`).getTime();
}
