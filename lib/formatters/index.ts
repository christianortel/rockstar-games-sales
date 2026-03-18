export function formatMillions(value: number, digits = 1) {
  if (Math.abs(value) >= 1_000) {
    return `${(value / 1_000).toFixed(digits)}B`;
  }
  return `${value.toFixed(digits)}M`;
}

export function formatCurrencyMillions(value: number, digits = 0) {
  if (Math.abs(value) >= 1_000) {
    return `$${(value / 1_000).toFixed(Math.max(1, digits))}B`;
  }
  return `$${value.toFixed(digits)}M`;
}

export function formatPercent(value: number, digits = 0) {
  return `${(value * 100).toFixed(digits)}%`;
}

export function formatLongDate(dateString: string, precision: "day" | "year" = "day") {
  if (precision === "year") {
    return new Intl.DateTimeFormat("en-US", { year: "numeric" }).format(new Date(dateString));
  }
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(dateString));
}

export function formatCompactCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 1,
    notation: "compact"
  }).format(value * 1_000_000);
}
