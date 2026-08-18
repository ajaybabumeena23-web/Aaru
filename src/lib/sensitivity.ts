/**
 * Helpers for calculator sensitivity bands.
 * Always re-run existing math engines — never duplicate formulas here.
 */

export type RateBand = {
  key: "low" | "base" | "high";
  label: string;
  ratePct: number;
};

/**
 * Build conservative / base / optimistic annual-rate bands around `baseRatePct`.
 * Rates are clamped to [min, max] so sliders near edges stay valid.
 */
export function rateSensitivityBands(
  baseRatePct: number,
  deltaPct = 2,
  opts?: { min?: number; max?: number; labels?: [string, string, string] }
): RateBand[] {
  const min = opts?.min ?? 0.1;
  const max = opts?.max ?? 40;
  const [lowLabel, baseLabel, highLabel] = opts?.labels ?? [
    "Conservative",
    "Your assumption",
    "Optimistic",
  ];

  const low = Math.max(min, Math.round((baseRatePct - deltaPct) * 100) / 100);
  const high = Math.min(max, Math.round((baseRatePct + deltaPct) * 100) / 100);
  const base = Math.round(baseRatePct * 100) / 100;

  return [
    { key: "low", label: lowLabel, ratePct: low },
    { key: "base", label: baseLabel, ratePct: base },
    { key: "high", label: highLabel, ratePct: high },
  ];
}
