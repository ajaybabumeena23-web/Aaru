/** Pure helpers used across calculators. */

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function round0(n: number): number {
  return Math.round(n);
}

/** Monthly rate from annual percentage. */
export function monthlyRate(annualPct: number): number {
  return annualPct / 100 / 12;
}

/** Future value of a growing annuity (monthly SIP). */
export function futureValueAnnuity(
  monthlyInvestment: number,
  annualRatePct: number,
  months: number
): number {
  if (months <= 0) return 0;
  if (monthlyInvestment === 0) return 0;
  const r = monthlyRate(annualRatePct);
  if (Math.abs(r) < 1e-12) return monthlyInvestment * months;
  return monthlyInvestment * ((Math.pow(1 + r, months) - 1) / r) * (1 + r);
}

/** FV of a single lump sum. */
export function futureValueLumpSum(
  principal: number,
  annualRatePct: number,
  years: number
): number {
  if (years <= 0) return principal;
  return principal * Math.pow(1 + annualRatePct / 100, years);
}

/** Discount a future amount by inflation to today's rupees. */
export function inflationAdjust(
  futureValue: number,
  inflationPct: number,
  years: number
): number {
  if (years <= 0) return futureValue;
  return futureValue / Math.pow(1 + inflationPct / 100, years);
}

/** Real (inflation-adjusted) annual return. */
export function realReturnPct(nominalPct: number, inflationPct: number): number {
  return ((1 + nominalPct / 100) / (1 + inflationPct / 100) - 1) * 100;
}

/** Standard reducing-balance EMI. */
export function calculateEmi(
  principal: number,
  annualRatePct: number,
  tenureMonths: number
): number {
  if (principal <= 0 || tenureMonths <= 0) return 0;
  const r = monthlyRate(annualRatePct);
  if (Math.abs(r) < 1e-12) return principal / tenureMonths;
  const factor = Math.pow(1 + r, tenureMonths);
  return (principal * r * factor) / (factor - 1);
}

/** Months needed to amortize with a given EMI (no prepayments). */
export function monthsToClearLoan(
  principal: number,
  annualRatePct: number,
  emi: number
): number {
  if (principal <= 0) return 0;
  if (emi <= 0) return Infinity;
  const r = monthlyRate(annualRatePct);
  if (Math.abs(r) < 1e-12) return Math.ceil(principal / emi);
  if (emi <= principal * r) return Infinity;
  return Math.ceil(
    Math.log(emi / (emi - principal * r)) / Math.log(1 + r)
  );
}

export function toDate(d: Date | string): Date {
  return d instanceof Date ? d : new Date(d);
}

export function yearFraction(from: Date, to: Date): number {
  return (to.getTime() - from.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
}
