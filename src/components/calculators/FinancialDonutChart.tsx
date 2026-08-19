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
  height,
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
  const resolvedHeight = height ?? undefined;

  return (
    <div
      className={cn(
        "relative w-full min-w-0 overflow-hidden rounded-lg border border-border/60 illustrative-gradient p-2",
        !resolvedHeight && "h-[200px] sm:h-[240px]",
        className
      )}
      style={resolvedHeight ? { height: resolvedHeight } : undefined}
    >
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <PieChart margin={{ top: 4, right: 4, bottom: showLegend ? 4 : 4, left: 4 }}>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy={showLegend ? "46%" : "50%"}
            innerRadius="54%"
            outerRadius="78%"
            paddingAngle={2}
            stroke="#0B1F33"
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
              height={32}
              wrapperStyle={{ fontSize: 12, paddingTop: 4 }}
              formatter={(value) => (
                <span className="text-xs text-card-foreground sm:text-sm">
                  {value}
                </span>
              )}
            />
          ) : null}
        </PieChart>
      </ResponsiveContainer>

      {(centerLabel || centerValue) && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div
            className={cn(
              "max-w-[45%] text-center",
              showLegend ? "mb-7 sm:mb-8" : "mb-0"
            )}
          >
            {centerLabel ? (
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground sm:text-xs">
                {centerLabel}
              </p>
            ) : null}
            <p className="truncate text-base font-semibold tabular-nums text-accent sm:text-lg">
              {centerValue ?? formatINR(total, true)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
