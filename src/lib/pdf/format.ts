/**
 * PDF-only money formatting — full Indian numerals, always with ₹, never K/L/Cr.
 * Live UI may still use compact formatINR(..., true).
 */

const COMPACT_RE =
  /₹\s*(-?[\d,]+(?:\.\d+)?)\s*(Cr|CR|crore|Crore|L|lakh|Lakh|K|k)\b/g;

export function formatForPDF(value: number): string {
  if (!Number.isFinite(value)) return "₹0";
  const rounded = Math.round(value);
  const sign = rounded < 0 ? "-" : "";
  const abs = Math.abs(rounded).toLocaleString("en-IN");
  return `${sign}₹${abs}`;
}

/** Strip NBSP / spaces after ₹ so "₹ 1,000" becomes "₹1,000". */
export function tightenRupeeSymbol(text: string): string {
  return text
    .replace(/\u00A0/g, " ")
    .replace(/\u202F/g, " ")
    .replace(/₹\s+/g, "₹");
}

function compactMultiplier(unit: string): number {
  const u = unit.toLowerCase();
  if (u === "cr" || u === "crore") return 1_00_00_000;
  if (u === "l" || u === "lakh") return 1_00_000;
  return 1_000; // K
}

/**
 * Expand any ₹…K / ₹…L / ₹…Cr fragments inside a label string to full INR,
 * and tighten the rupee glyph. Non-money text is left intact.
 */
export function normalizePdfMoneyText(text: string): string {
  if (!text) return text;
  let s = tightenRupeeSymbol(String(text));
  s = s.replace(COMPACT_RE, (_m, num: string, unit: string) => {
    const n = Number.parseFloat(String(num).replace(/,/g, ""));
    if (!Number.isFinite(n)) return _m;
    return formatForPDF(n * compactMultiplier(unit));
  });
  return tightenRupeeSymbol(s);
}

/** True when an input row looks like an investment expected-return assumption. */
export function isInvestmentReturnInput(label: string): boolean {
  const l = label.toLowerCase();
  if (/loan|emi|interest rate|foir|tax|swr|withdrawal|inflation|expense/.test(l)) {
    // Allow "expected return" even if other words present
    if (!/expected return|portfolio return|assumed return|cagr|investment return/.test(l)) {
      return false;
    }
  }
  return /expected return|assumed return|portfolio return|cagr|return \(p\.?a\.?\)|annual return|investment return|^return$|rate of return/.test(
    l
  ) || (/return/.test(l) && !/tax rebate|return journey/.test(l));
}

export function parsePercentFromLabelValue(value: string): number | null {
  const m = String(value)
    .replace(/,/g, "")
    .match(/(-?\d+(?:\.\d+)?)\s*%?/);
  if (!m) return null;
  const n = Number.parseFloat(m[1]);
  return Number.isFinite(n) ? n : null;
}

export const HIGH_RETURN_THRESHOLD_PCT = 15;

export const HIGH_RETURN_WARNING =
  "Sustained returns above 15% p.a. are mathematically highly optimistic and subject to severe market volatility over long durations. Treat this projection as a stress / stretch scenario — not a baseline plan.";
