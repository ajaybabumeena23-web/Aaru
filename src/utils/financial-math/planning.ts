/**
 * Planning helpers for Phase 8 calculators.
 * Pure functions only — no React, no I/O.
 */

import { calculateEmi, inflationAdjust, realReturnPct, round0, round2 } from "./helpers";

/** Future cost of today's amount under inflation. */
export function futureCostOf(
  presentAmount: number,
  inflationPct: number,
  years: number
): number {
  if (years <= 0) return round0(presentAmount);
  return round0(presentAmount * Math.pow(1 + inflationPct / 100, years));
}

/** Purchasing power of a future amount in today's rupees. */
export function purchasingPowerToday(
  futureAmount: number,
  inflationPct: number,
  years: number
): number {
  return round0(inflationAdjust(futureAmount, inflationPct, years));
}

export type InflationResult = {
  futureCost: number;
  purchasingPower: number;
  realReturnPct: number;
  erodedPct: number;
};

/**
 * Inflation planner: projects future cost of a present amount and
 * purchasing power of that future cost back to today (sanity check).
 * Optional nominal return → real return %.
 */
export function calculateInflationPlan(input: {
  presentAmount: number;
  inflationPct: number;
  years: number;
  nominalReturnPct?: number;
}): InflationResult {
  const { presentAmount, inflationPct, years, nominalReturnPct = 0 } = input;
  const futureCost = futureCostOf(presentAmount, inflationPct, years);
  const purchasingPower = purchasingPowerToday(futureCost, inflationPct, years);
  const eroded =
    presentAmount > 0
      ? round2(((futureCost - presentAmount) / presentAmount) * 100)
      : 0;
  return {
    futureCost,
    purchasingPower,
    realReturnPct: round2(realReturnPct(nominalReturnPct, inflationPct)),
    erodedPct: eroded,
  };
}

/**
 * CAGR from start value → end value over years.
 * Returns percent (e.g. 12.5 for 12.5% p.a.).
 */
export function calculateCagr(input: {
  startValue: number;
  endValue: number;
  years: number;
}): { cagrPct: number; multiple: number } {
  const { startValue, endValue, years } = input;
  if (startValue <= 0 || years <= 0) {
    return { cagrPct: 0, multiple: 0 };
  }
  const multiple = endValue / startValue;
  if (multiple <= 0) {
    return { cagrPct: -100, multiple: round2(multiple) };
  }
  const cagrPct = (Math.pow(multiple, 1 / years) - 1) * 100;
  return { cagrPct: round2(cagrPct), multiple: round2(multiple) };
}

/** Project end value from start + CAGR + years. */
export function projectWithCagr(input: {
  startValue: number;
  cagrPct: number;
  years: number;
}): number {
  const { startValue, cagrPct, years } = input;
  if (years <= 0) return round0(startValue);
  return round0(startValue * Math.pow(1 + cagrPct / 100, years));
}

/**
 * Max loan principal supportable by a given EMI (reducing balance).
 * Inverse of standard EMI formula.
 */
export function maxPrincipalFromEmi(
  monthlyEmi: number,
  annualRatePct: number,
  tenureMonths: number
): number {
  if (monthlyEmi <= 0 || tenureMonths <= 0) return 0;
  const r = annualRatePct / 100 / 12;
  if (Math.abs(r) < 1e-12) return round0(monthlyEmi * tenureMonths);
  const factor = Math.pow(1 + r, tenureMonths);
  return round0((monthlyEmi * (factor - 1)) / (r * factor));
}

export type LoanAffordabilityInput = {
  monthlyIncome: number;
  existingEmis: number;
  /** Max share of income for total EMIs, e.g. 40 = 40% FOIR-style cap */
  foirPct: number;
  annualRatePct: number;
  tenureYears: number;
};

export type LoanAffordabilityResult = {
  maxTotalEmi: number;
  availableEmi: number;
  maxLoan: number;
  illustrativeEmi: number;
  incomeUsedPct: number;
};

/**
 * Loan affordability / eligibility illustration.
 * Uses FOIR-style EMI capacity and the inverse EMI formula (same math as basicEmi).
 */
export function calculateLoanAffordability(
  input: LoanAffordabilityInput
): LoanAffordabilityResult {
  const {
    monthlyIncome,
    existingEmis,
    foirPct,
    annualRatePct,
    tenureYears,
  } = input;
  const tenureMonths = Math.max(1, Math.round(tenureYears * 12));
  const maxTotalEmi = round0((monthlyIncome * foirPct) / 100);
  const availableEmi = Math.max(0, maxTotalEmi - Math.max(0, existingEmis));
  const maxLoan = maxPrincipalFromEmi(
    availableEmi,
    annualRatePct,
    tenureMonths
  );
  const illustrativeEmi =
    maxLoan > 0
      ? round0(calculateEmi(maxLoan, annualRatePct, tenureMonths))
      : 0;
  const incomeUsedPct =
    monthlyIncome > 0
      ? round2(((existingEmis + illustrativeEmi) / monthlyIncome) * 100)
      : 0;

  return {
    maxTotalEmi,
    availableEmi,
    maxLoan,
    illustrativeEmi,
    incomeUsedPct,
  };
}

export type EmergencyFundResult = {
  target: number;
  gap: number;
  monthsCoveredBySavings: number;
  surplus: number;
};

export function calculateEmergencyFund(input: {
  monthlyExpenses: number;
  monthsCover: number;
  currentSavings?: number;
}): EmergencyFundResult {
  const { monthlyExpenses, monthsCover, currentSavings = 0 } = input;
  const target = round0(Math.max(0, monthlyExpenses) * Math.max(0, monthsCover));
  const savings = Math.max(0, currentSavings);
  const gap = Math.max(0, target - savings);
  const surplus = Math.max(0, savings - target);
  const monthsCoveredBySavings =
    monthlyExpenses > 0 ? round2(savings / monthlyExpenses) : 0;
  return { target, gap, surplus, monthsCoveredBySavings };
}

export type NetWorthResult = {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
};

export function calculateNetWorth(input: {
  assets: number;
  liabilities: number;
}): NetWorthResult {
  const totalAssets = round0(Math.max(0, input.assets));
  const totalLiabilities = round0(Math.max(0, input.liabilities));
  return {
    totalAssets,
    totalLiabilities,
    netWorth: round0(totalAssets - totalLiabilities),
  };
}
