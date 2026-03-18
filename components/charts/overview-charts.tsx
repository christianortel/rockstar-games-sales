"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { ChartShell } from "@/components/charts/chart-shell";
import { formatCurrencyMillions, formatMillions, formatPercent } from "@/lib/formatters";

function TooltipCard({
  active,
  payload,
  label,
  valueFormatter = formatMillions
}: {
  active?: boolean;
  payload?: Array<{ color?: string; name?: unknown; value?: unknown }>;
  label?: unknown;
  valueFormatter?: (value: number) => string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0b0d10]/95 px-4 py-3 shadow-panel">
      {typeof label === "string" || typeof label === "number" ? (
        <p className="text-[11px] uppercase tracking-[0.24em] text-white/45">{label}</p>
      ) : null}
      <div className="mt-2 space-y-2">
        {payload.map((item) => (
          <div key={`${String(item.name)}-${String(item.value)}`} className="flex items-center justify-between gap-6 text-sm text-white/80">
            <span className="inline-flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color ?? "#fff" }} />
              {String(item.name ?? "")}
            </span>
            <span>{typeof item.value === "number" ? valueFormatter(item.value) : String(item.value ?? "")}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const axisStyle = {
  fontSize: 11,
  fill: "rgba(255,255,255,0.52)",
  letterSpacing: "0.2em",
  textTransform: "uppercase"
};

export function TopTitlesChart({
  data,
  accent,
  formatter = formatMillions
}: {
  data: Array<{ name: string; value: number }>;
  accent: string;
  formatter?: (value: number) => string;
}) {
  return (
    <ChartShell title="Top Titles" subtitle="Lifetime volume under the current metric and data mode.">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 16, right: 8 }}>
          <CartesianGrid horizontal stroke="rgba(255,255,255,0.07)" vertical={false} />
          <XAxis axisLine={false} tickFormatter={formatter} tickLine={false} tick={axisStyle} type="number" />
          <YAxis axisLine={false} dataKey="name" tickLine={false} tick={axisStyle} type="category" width={120} />
          <Tooltip content={(props) => <TooltipCard {...props} valueFormatter={formatter} />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
          <Bar dataKey="value" fill={accent} radius={[0, 14, 14, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}

export function TrendChart({
  data,
  accent,
  secondary,
  title,
  subtitle,
  mode = "both",
  formatter = formatMillions
}: {
  data: Array<{ year: number; annualUnitsM: number; cumulativeUnitsM?: number }>;
  accent: string;
  secondary?: string;
  title: string;
  subtitle?: string;
  mode?: "annual" | "cumulative" | "both";
  formatter?: (value: number) => string;
}) {
  return (
    <ChartShell title={title} subtitle={subtitle}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ left: 0, right: 6 }}>
          <defs>
            <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={accent} stopOpacity={0.4} />
              <stop offset="100%" stopColor={accent} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.07)" vertical={false} />
          <XAxis axisLine={false} dataKey="year" tickLine={false} tick={axisStyle} />
          <YAxis axisLine={false} tickFormatter={formatter} tickLine={false} tick={axisStyle} />
          <Tooltip content={(props) => <TooltipCard {...props} valueFormatter={formatter} />} />
          {mode !== "cumulative" ? (
            <Area dataKey="annualUnitsM" fill="url(#trendFill)" stroke={accent} strokeWidth={2.5} type="monotone" />
          ) : null}
          {mode !== "annual" && data[0]?.cumulativeUnitsM ? (
            <Line
              dataKey="cumulativeUnitsM"
              dot={false}
              stroke={secondary ?? "#ffffff"}
              strokeDasharray="6 6"
              strokeWidth={2}
              type="monotone"
            />
          ) : null}
        </AreaChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}

export function RegionDonutChart({
  data,
  colors
}: {
  data: Array<{ name: string; value: number }>;
  colors: string[];
}) {
  return (
    <ChartShell title="Regional Mix" subtitle="Modeled regional contribution under the current scope.">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip content={(props) => <TooltipCard {...props} />} />
          <Legend wrapperStyle={{ fontSize: "12px", color: "rgba(255,255,255,0.72)" }} />
          <Pie
            cx="50%"
            cy="50%"
            data={data}
            dataKey="value"
            innerRadius={82}
            nameKey="name"
            outerRadius={124}
            paddingAngle={3}
          >
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={colors[index % colors.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}

export function FranchiseChart({
  data,
  colors,
  formatter = formatMillions
}: {
  data: Array<{ name: string; value: number }>;
  colors: string[];
  formatter?: (value: number) => string;
}) {
  return (
    <ChartShell title="Franchise Performance" subtitle="Current filtered performance by franchise.">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid stroke="rgba(255,255,255,0.07)" vertical={false} />
          <XAxis axisLine={false} dataKey="name" tickLine={false} tick={axisStyle} />
          <YAxis axisLine={false} tickFormatter={formatter} tickLine={false} tick={axisStyle} />
          <Tooltip content={(props) => <TooltipCard {...props} valueFormatter={formatter} />} />
          <Bar dataKey="value" radius={[14, 14, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}

export function ComparisonTrendChart({
  data,
  colors
}: {
  data: Array<Record<string, number | string>>;
  colors: string[];
}) {
  const lineKeys = data.length ? Object.keys(data[0]).filter((key) => key !== "year") : [];

  return (
    <ChartShell title="Comparison Overlay" subtitle="Cumulative unit trajectory by selected title.">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <CartesianGrid stroke="rgba(255,255,255,0.07)" vertical={false} />
          <XAxis axisLine={false} dataKey="year" tickLine={false} tick={axisStyle} />
          <YAxis axisLine={false} tickFormatter={formatMillions} tickLine={false} tick={axisStyle} />
          <Tooltip content={(props) => <TooltipCard {...props} valueFormatter={formatMillions} />} />
          {lineKeys.map((key, index) => (
            <Area
              key={key}
              dataKey={key}
              fillOpacity={0}
              stroke={colors[index % colors.length]}
              strokeWidth={2.6}
              type="monotone"
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}

export function PlatformMixChart({
  data,
  colors
}: {
  data: Array<Record<string, number | string>>;
  colors: string[];
}) {
  const platformKeys = data.length ? Object.keys(data[0]).filter((key) => key !== "year") : [];

  return (
    <ChartShell title="Platform Mix" subtitle="Yearly platform contribution stacked across the filtered selection.">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid stroke="rgba(255,255,255,0.07)" vertical={false} />
          <XAxis axisLine={false} dataKey="year" tickLine={false} tick={axisStyle} />
          <YAxis axisLine={false} tickFormatter={formatMillions} tickLine={false} tick={axisStyle} />
          <Tooltip content={(props) => <TooltipCard {...props} valueFormatter={formatMillions} />} />
          <Legend wrapperStyle={{ fontSize: "12px", color: "rgba(255,255,255,0.72)" }} />
          {platformKeys.map((key, index) => (
            <Bar
              key={key}
              dataKey={key}
              fill={colors[index % colors.length]}
              radius={index === platformKeys.length - 1 ? [8, 8, 0, 0] : 0}
              stackId="platforms"
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}

export function ShareLabel({ value }: { value?: number }) {
  if (typeof value !== "number") return null;
  return <span>{formatPercent(value)}</span>;
}

export function chartFormatterForMetric(metricMode: "units" | "revenue") {
  return metricMode === "revenue" ? formatCurrencyMillions : formatMillions;
}
