"use client";

import * as React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { cn, formatINR } from "@/lib/utils";

export type DonutSlice = {
  name: string;
  value: number;
  color?: string;
};

export type FinancialDonutChartProps = {
  /** Typically Principal vs Wealth Gained / Interest Paid. */
  data: DonutSlice[];
  centerLabel?: string;
  centerValue?: string;
  className?: string;
  height?: number;
  showLegend?: boolean;
};

/** Premium dark palette: Gold + Turquoise (+ muted fallbacks). */
const DEFAULT_COLORS = [
  "#F7C615", // bold gold
  "#26D6C6", // vibrant turquoise
  "#F87171", // soft red for interest / risk
  "#94A3B8",
];

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: DonutSlice }>;
}) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="rounded-md border border-border/80 bg-popover px-3 py-2 text-sm shadow-card">
      <p className="font-medium text-popover-foreground">{item.name}</p>
      <p className="text-muted-foreground">{formatINR(item.value)}</p>
    </div>
  );
}

/**
 * Responsive donut comparing principal vs gain/interest.
 * Pure presentational — pass precomputed slice values.
 */
export function FinancialDonutChart({
  data,
  centerLabel,
  centerValue,
  className,
  height = 280,
  showLegend = true,
}: FinancialDonutChartProps) {
  const chartData = React.useMemo(
    () =>
      data.map((d, i) => ({
        ...d,
        color: d.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length],
      })),
    [data]
  );

  const total = chartData.reduce((sum, d) => sum + (d.value || 0), 0);

  return (
    <div
      className={cn(
        "relative w-full rounded-lg illustrative-gradient border border-border/60 p-2",
        className
      )}
      style={{ height }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius="58%"
            outerRadius="82%"
            paddingAngle={2}
            stroke="#13192B"
            strokeWidth={2}
          >
            {chartData.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltip />} />
          {showLegend ? (
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => (
                <span className="text-sm text-card-foreground">{value}</span>
              )}
            />
          ) : null}
        </PieChart>
      </ResponsiveContainer>

      {(centerLabel || centerValue) && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="mb-6 text-center">
            {centerLabel ? (
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {centerLabel}
              </p>
            ) : null}
            {centerValue ? (
              <p className="text-lg font-semibold tabular-nums text-gold">
                {centerValue}
              </p>
            ) : (
              <p className="text-lg font-semibold tabular-nums text-gold">
                {formatINR(total, true)}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
