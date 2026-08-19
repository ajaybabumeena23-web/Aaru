"use client";

import * as React from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn, formatNumber } from "@/lib/utils";

export type DraggableSliderProps = {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  /** Prefix shown in the numeric input (e.g. ₹). */
  prefix?: string;
  /** Suffix shown in the numeric input (e.g. %, yrs). */
  suffix?: string;
  /** Format the displayed value under the slider. */
  formatValue?: (value: number) => string;
  className?: string;
  disabled?: boolean;
};

/**
 * Dual-control input: Radix slider + editable number field.
 * Updates are instantaneous (controlled); parent owns URL sync.
 */
export function DraggableSlider({
  id,
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  prefix,
  suffix,
  formatValue,
  className,
  disabled,
}: DraggableSliderProps) {
  const [draft, setDraft] = React.useState(String(value));

  React.useEffect(() => {
    setDraft(String(value));
  }, [value]);

  const clamp = (n: number) => Math.min(max, Math.max(min, n));

  const commitDraft = () => {
    const parsed = Number(draft.replace(/,/g, ""));
    if (Number.isFinite(parsed)) {
      onChange(clamp(parsed));
    } else {
      setDraft(String(value));
    }
  };

  const display = formatValue ? formatValue(value) : formatNumber(value);

  return (
    <div className={cn("min-w-0 space-y-3", className)}>
      <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
        <Label
          htmlFor={id}
          className="min-w-0 shrink text-sm font-medium leading-snug text-card-foreground"
        >
          {label}
        </Label>
        <div className="flex min-w-0 shrink-0 items-center gap-1.5 self-stretch sm:self-auto">
          {prefix ? (
            <span className="shrink-0 text-sm text-muted-foreground">{prefix}</span>
          ) : null}
          <Input
            id={id}
            type="text"
            inputMode="decimal"
            disabled={disabled}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commitDraft}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.currentTarget.blur();
              }
            }}
            className="h-11 min-h-11 w-full min-w-0 flex-1 border-border/70 bg-secondary/80 text-right tabular-nums text-base text-foreground focus-visible:ring-accent/40 sm:h-10 sm:w-28 sm:flex-none sm:text-sm"
            aria-label={`${label} value`}
          />
          {suffix ? (
            <span className="shrink-0 text-sm text-muted-foreground">{suffix}</span>
          ) : null}
        </div>
      </div>

      <div className="px-0.5 py-1">
        <Slider
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          value={[clamp(value)]}
          onValueChange={([v]) => onChange(clamp(v))}
          aria-label={label}
          className="[&_[role=slider]]:border-accent [&_[role=slider]]:bg-accent"
        />
      </div>

      <div className="flex justify-between gap-2 text-[11px] text-muted-foreground sm:text-xs">
        <span className="min-w-0 truncate">
          {prefix}
          {formatNumber(min)}
          {suffix ? ` ${suffix}` : ""}
        </span>
        <span className="shrink-0 font-medium text-accent">{display}</span>
        <span className="min-w-0 truncate text-right">
          {prefix}
          {formatNumber(max)}
          {suffix ? ` ${suffix}` : ""}
        </span>
      </div>
    </div>
  );
}
