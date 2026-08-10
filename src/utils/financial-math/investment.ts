import {
  EQUITY_LTCG_EXEMPTION,
  EQUITY_LTCG_RATE,
  type SipResult,
} from "./constants";
import {
  futureValueAnnuity,
  futureValueLumpSum,
  inflationAdjust,
  monthlyRate,
  round0,
  round2,
} from "./helpers";

export type SipInput = {
  monthlyInvestment: number;
  annualRatePct: number;
  years: number;
  inflationPct?: number;
  /** Apply equity LTCG on gains (12.5% above exemption). */
  postTax?: boolean;
};

/**
 * Classic SIP: FV = P × ((1+r)^n − 1) / r × (1+r)
 * Contributions assumed at month-end; compounding monthly.
 */
export function calculateSip(input: SipInput): SipResult {
  const {
    monthlyInvestment,
    annualRatePct,
    years,
    inflationPct = 0,
    postTax = false,
  } = input;
  const months = Math.max(0, Math.round(years * 12));
  const r = monthlyRate(annualRatePct);

  const monthlySeries: SipResult["monthlySeries"] = [];
  let value = 0;
  let invested = 0;

  for (let m = 1; m <= months; m++) {
    value = value * (1 + r) + monthlyInvestment;
    invested += monthlyInvestment;
    if (m % 12 === 0 || m === months) {
      monthlySeries.push({
        month: m,
        invested: round0(invested),
        value: round0(value),
      });
    }
  }

  const maturityValue = round0(value);
  invested = round0(invested);
  const wealthGained = Math.max(0, maturityValue - invested);
  const realMaturityValue = round0(
    inflationAdjust(maturityValue, inflationPct, years)
  );

  let taxOnGains = 0;
  let postTaxMaturityValue = maturityValue;
  if (postTax && wealthGained > 0) {
    const taxable = Math.max(0, wealthGained - EQUITY_LTCG_EXEMPTION);
    taxOnGains = round0(taxable * EQUITY_LTCG_RATE);
    postTaxMaturityValue = maturityValue - taxOnGains;
  }

  return {
    invested,
    maturityValue,
    wealthGained,
    realMaturityValue,
    postTaxMaturityValue: round0(postTaxMaturityValue),
    taxOnGains,
    monthlySeries,
  };
}

export type StepUpSipInput = SipInput & {
  /** Annual increase in SIP amount, e.g. 10 = +10% each year. */
  stepUpPct: number;
};

/**
 * Step-up SIP: monthly amount grows by `stepUpPct` at each anniversary.
 */
export function calculateStepUpSip(input: StepUpSipInput): SipResult {
  const {
    monthlyInvestment,
    annualRatePct,
    years,
    stepUpPct,
    inflationPct = 0,
    postTax = false,
  } = input;
  const months = Math.max(0, Math.round(years * 12));
  const r = monthlyRate(annualRatePct);
  const step = stepUpPct / 100;

  const monthlySeries: SipResult["monthlySeries"] = [];
  let value = 0;
  let invested = 0;
  let currentSip = monthlyInvestment;

  for (let m = 1; m <= months; m++) {
    value = value * (1 + r) + currentSip;
    invested += currentSip;
    if (m % 12 === 0 && m < months) {
      currentSip = currentSip * (1 + step);
    }
    if (m % 12 === 0 || m === months) {
      monthlySeries.push({
        month: m,
        invested: round0(invested),
        value: round0(value),
      });
    }
  }

  const maturityValue = round0(value);
  invested = round0(invested);
  const wealthGained = Math.max(0, maturityValue - invested);
  const realMaturityValue = round0(
    inflationAdjust(maturityValue, inflationPct, years)
  );

  let taxOnGains = 0;
  let postTaxMaturityValue = maturityValue;
  if (postTax && wealthGained > 0) {
    const taxable = Math.max(0, wealthGained - EQUITY_LTCG_EXEMPTION);
    taxOnGains = round0(taxable * EQUITY_LTCG_RATE);
    postTaxMaturityValue = maturityValue - taxOnGains;
  }

  return {
    invested,
    maturityValue,
    wealthGained,
    realMaturityValue,
    postTaxMaturityValue: round0(postTaxMaturityValue),
    taxOnGains,
    monthlySeries,
  };
}

export type LumpSumInput = {
  principal: number;
  annualRatePct: number;
  years: number;
  inflationPct?: number;
  postTax?: boolean;
};

export function calculateLumpSum(input: LumpSumInput): SipResult {
  const {
    principal,
    annualRatePct,
    years,
    inflationPct = 0,
    postTax = false,
  } = input;
  const maturityValue = round0(
    futureValueLumpSum(principal, annualRatePct, years)
  );
  const wealthGained = Math.max(0, maturityValue - principal);
  const realMaturityValue = round0(
    inflationAdjust(maturityValue, inflationPct, years)
  );

  let taxOnGains = 0;
  let postTaxMaturityValue = maturityValue;
  if (postTax && wealthGained > 0) {
    const taxable = Math.max(0, wealthGained - EQUITY_LTCG_EXEMPTION);
    taxOnGains = round0(taxable * EQUITY_LTCG_RATE);
    postTaxMaturityValue = maturityValue - taxOnGains;
  }

  const months = Math.max(0, Math.round(years * 12));
  const monthlySeries: SipResult["monthlySeries"] = [];
  for (let y = 1; y <= Math.ceil(years); y++) {
    const m = Math.min(y * 12, months);
    const v = round0(futureValueLumpSum(principal, annualRatePct, m / 12));
    monthlySeries.push({ month: m, invested: round0(principal), value: v });
  }

  return {
    invested: round0(principal),
    maturityValue,
    wealthGained,
    realMaturityValue,
    postTaxMaturityValue: round0(postTaxMaturityValue),
    taxOnGains,
    monthlySeries,
  };
}

export type SwpInput = {
  corpus: number;
  monthlyWithdrawal: number;
  annualRatePct: number;
  years: number;
};

export type SwpResult = {
  endingCorpus: number;
  totalWithdrawn: number;
  monthsLasted: number;
  depleted: boolean;
  series: { month: number; corpus: number; withdrawn: number }[];
};

/** Systematic Withdrawal Plan — monthly withdrawal after growth. */
export function calculateSwp(input: SwpInput): SwpResult {
  const { corpus, monthlyWithdrawal, annualRatePct, years } = input;
  const months = Math.max(0, Math.round(years * 12));
  const r = monthlyRate(annualRatePct);
  let balance = corpus;
  let totalWithdrawn = 0;
  let monthsLasted = 0;
  const series: SwpResult["series"] = [];

  for (let m = 1; m <= months; m++) {
    balance = balance * (1 + r);
    const w = Math.min(monthlyWithdrawal, Math.max(0, balance));
    balance -= w;
    totalWithdrawn += w;
    monthsLasted = m;
    if (m % 12 === 0 || m === months || balance <= 0) {
      series.push({
        month: m,
        corpus: round0(balance),
        withdrawn: round0(totalWithdrawn),
      });
    }
    if (balance <= 0) {
      balance = 0;
      break;
    }
  }

  return {
    endingCorpus: round0(balance),
    totalWithdrawn: round0(totalWithdrawn),
    monthsLasted,
    depleted: balance <= 0,
    series,
  };
}

/**
 * Reverse SIP: monthly investment required to hit a target corpus.
 * P = FV × r / (((1+r)^n − 1) × (1+r))
 */
export function calculateReverseSip(input: {
  targetCorpus: number;
  annualRatePct: number;
  years: number;
}): { monthlySip: number; totalInvested: number } {
  const { targetCorpus, annualRatePct, years } = input;
  const months = Math.max(0, Math.round(years * 12));
  if (months === 0 || targetCorpus <= 0) {
    return { monthlySip: 0, totalInvested: 0 };
  }
  const r = monthlyRate(annualRatePct);
  let monthlySip: number;
  if (Math.abs(r) < 1e-12) {
    monthlySip = targetCorpus / months;
  } else {
    monthlySip =
      (targetCorpus * r) / ((Math.pow(1 + r, months) - 1) * (1 + r));
  }
  monthlySip = round0(monthlySip);
  return {
    monthlySip,
    totalInvested: monthlySip * months,
  };
}

/** Closed-form SIP FV helper (no series). */
export function sipMaturityClosedForm(
  monthlyInvestment: number,
  annualRatePct: number,
  years: number
): number {
  return round0(
    futureValueAnnuity(monthlyInvestment, annualRatePct, Math.round(years * 12))
  );
}

export function applyEquityLtcgTax(gains: number): {
  tax: number;
  netGains: number;
} {
  const taxable = Math.max(0, gains - EQUITY_LTCG_EXEMPTION);
  const tax = round2(taxable * EQUITY_LTCG_RATE);
  return { tax, netGains: gains - tax };
}
