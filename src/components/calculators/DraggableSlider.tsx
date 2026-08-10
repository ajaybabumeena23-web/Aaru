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
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between gap-3">
        <Label
          htmlFor={id}
          className="text-sm font-medium text-card-foreground"
        >
          {label}
        </Label>
        <div className="flex items-center gap-1">
          {prefix ? (
            <span className="text-sm text-muted-foreground">{prefix}</span>
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
            className="h-8 w-28 border-border/70 bg-navy/50 text-right tabular-nums text-foreground focus-visible:ring-gold/40"
            aria-label={`${label} value`}
          />
          {suffix ? (
            <span className="text-sm text-muted-foreground">{suffix}</span>
          ) : null}
        </div>
      </div>

      <Slider
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        value={[clamp(value)]}
        onValueChange={([v]) => onChange(clamp(v))}
        aria-label={label}
        className="[&_[role=slider]]:border-gold [&_[role=slider]]:bg-gold"
      />

      <div className="flex justify-between text-xs text-muted-foreground">
        <span>
          {prefix}
          {formatNumber(min)}
          {suffix ? ` ${suffix}` : ""}
        </span>
        <span className="font-medium text-gold/90">{display}</span>
        <span>
          {prefix}
          {formatNumber(max)}
          {suffix ? ` ${suffix}` : ""}
        </span>
      </div>
    </div>
  );
}
