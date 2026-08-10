"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { DraggableSlider } from "@/components/calculators/DraggableSlider";

type InflationTaxTogglesProps = {
  adjustInflation: boolean;
  onAdjustInflation: (v: boolean) => void;
  inflation: number;
  onInflation: (v: number) => void;
  postTax: boolean;
  onPostTax: (v: boolean) => void;
  postTaxHint?: string;
};

export function InflationTaxToggles({
  adjustInflation,
  onAdjustInflation,
  inflation,
  onInflation,
  postTax,
  onPostTax,
  postTaxHint = "Equity LTCG 12.5% above ₹1.25L exemption",
}: InflationTaxTogglesProps) {
  return (
    <div className="space-y-4 rounded-md border bg-muted/30 p-4">
      <div className="flex items-center justify-between gap-3">
        <Label htmlFor="adjustInflation">Adjust for Inflation</Label>
        <Switch
          id="adjustInflation"
          checked={adjustInflation}
          onCheckedChange={onAdjustInflation}
        />
      </div>
      {adjustInflation ? (
        <DraggableSlider
          id="inflation"
          label="Inflation Rate"
          value={inflation}
          onChange={onInflation}
          min={1}
          max={15}
          step={0.1}
          suffix="%"
        />
      ) : null}
      <div className="flex items-center justify-between gap-3">
        <div>
          <Label htmlFor="postTax">Show Post-Tax Returns</Label>
          <p className="text-xs text-muted-foreground">{postTaxHint}</p>
        </div>
        <Switch id="postTax" checked={postTax} onCheckedChange={onPostTax} />
      </div>
    </div>
  );
}

/** Resolve maturity display when inflation / post-tax toggles are on. */
export function resolveMaturityDisplay(opts: {
  maturityValue: number;
  realMaturityValue: number;
  postTaxMaturityValue: number;
  invested: number;
  wealthGained: number;
  adjustInflation: boolean;
  postTax: boolean;
}) {
  const maturityDisplay = opts.postTax
    ? opts.postTaxMaturityValue
    : opts.adjustInflation
      ? opts.realMaturityValue
      : opts.maturityValue;

  const chartGain = opts.postTax
    ? Math.max(0, opts.postTaxMaturityValue - opts.invested)
    : opts.adjustInflation
      ? Math.max(0, opts.realMaturityValue - opts.invested)
      : opts.wealthGained;

  const maturityLabel = opts.postTax
    ? "Post-Tax Maturity"
    : opts.adjustInflation
      ? "Real Maturity (Today ₹)"
      : "Maturity Value";

  return { maturityDisplay, chartGain, maturityLabel };
}
