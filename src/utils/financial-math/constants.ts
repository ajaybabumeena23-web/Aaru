/**
 * Shared types & constants for the IndiaCalc financial engine.
 * Rates reflect FY 2025-26 / AY 2026-27 (Budget 2025) unless noted.
 */

export const DEFAULT_INFLATION_PCT = 6;
export const DEFAULT_FIRE_RETIREMENT_AGE = 42;
export const DEFAULT_EDUCATION_INFLATION_PCT = 11;

/** Equity mutual fund / listed equity (post Budget 2024). */
export const EQUITY_STCG_RATE = 0.2; // 20% u/s 111A
export const EQUITY_LTCG_RATE = 0.125; // 12.5% u/s 112A
export const EQUITY_LTCG_EXEMPTION = 1_25_000; // ₹1.25 lakh

/** Real estate (post Budget 2024 simplified rates). */
export const REAL_ESTATE_STCG_RATE = 0.2; // slab rates often apply; flat helper uses 20%
export const REAL_ESTATE_LTCG_RATE = 0.125; // 12.5% without indexation

export type TaxSlab = { upTo: number | null; rate: number };

/** Old regime — resident < 60 (unchanged). */
export const OLD_REGIME_SLABS: TaxSlab[] = [
  { upTo: 2_50_000, rate: 0 },
  { upTo: 5_00_000, rate: 0.05 },
  { upTo: 10_00_000, rate: 0.2 },
  { upTo: null, rate: 0.3 },
];

/** New regime u/s 115BAC — FY 2025-26 / AY 2026-27. */
export const NEW_REGIME_SLABS: TaxSlab[] = [
  { upTo: 4_00_000, rate: 0 },
  { upTo: 8_00_000, rate: 0.05 },
  { upTo: 12_00_000, rate: 0.1 },
  { upTo: 16_00_000, rate: 0.15 },
  { upTo: 20_00_000, rate: 0.2 },
  { upTo: 24_00_000, rate: 0.25 },
  { upTo: null, rate: 0.3 },
];

export const OLD_REGIME_87A = { maxIncome: 5_00_000, maxRebate: 12_500 };
export const NEW_REGIME_87A = { maxIncome: 12_00_000, maxRebate: 60_000 };
export const OLD_STANDARD_DEDUCTION = 50_000;
export const NEW_STANDARD_DEDUCTION = 75_000;

export type CashFlow = {
  /** Date of cash flow (Date or ISO string). */
  date: Date | string;
  /** Negative = investment/outflow, positive = redemption/inflow. */
  amount: number;
};

export type SipResult = {
  invested: number;
  maturityValue: number;
  wealthGained: number;
  /** Present value of maturity if inflation-adjusted. */
  realMaturityValue: number;
  /** Post-tax maturity assuming equity LTCG on gains (optional path). */
  postTaxMaturityValue: number;
  taxOnGains: number;
  monthlySeries: { month: number; invested: number; value: number }[];
};

export type AmortizationRow = {
  month: number;
  emi: number;
  principalComponent: number;
  interestComponent: number;
  prepayment: number;
  balance: number;
  cumulativeInterest: number;
  cumulativePrincipal: number;
};

export type AmortizationResult = {
  schedule: AmortizationRow[];
  emi: number;
  totalInterest: number;
  totalPayment: number;
  totalPrepayment: number;
  monthsTaken: number;
  interestSavedVsBaseline?: number;
  monthsSavedVsBaseline?: number;
};

export type PrepaymentEvent = {
  /** 1-indexed month number when lump sum is paid. */
  month: number;
  amount: number;
};

export type TaxBreakdown = {
  taxableIncome: number;
  taxBeforeRebate: number;
  rebate87A: number;
  taxAfterRebate: number;
  cess: number;
  totalTax: number;
  effectiveRate: number;
  slabWise: { from: number; to: number | null; rate: number; tax: number }[];
};
