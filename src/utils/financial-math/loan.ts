import type {
  AmortizationResult,
  AmortizationRow,
  PrepaymentEvent,
} from "./constants";
import { calculateEmi, monthsToClearLoan, round0, round2, monthlyRate } from "./helpers";

export type LoanInput = {
  principal: number;
  annualRatePct: number;
  tenureMonths: number;
};

export function basicEmi(input: LoanInput): {
  emi: number;
  totalInterest: number;
  totalPayment: number;
  schedule: AmortizationRow[];
} {
  const { principal, annualRatePct, tenureMonths } = input;
  const emi = round0(calculateEmi(principal, annualRatePct, tenureMonths));
  const result = generateAmortizationSchedule({
    principal,
    annualRatePct,
    tenureMonths,
    emi,
  });
  return {
    emi,
    totalInterest: result.totalInterest,
    totalPayment: result.totalPayment,
    schedule: result.schedule,
  };
}

export type AdvancedAmortizationInput = {
  principal: number;
  annualRatePct: number;
  tenureMonths: number;
  /** Override EMI; defaults to standard EMI for original tenure. */
  emi?: number;
  /**
   * Ad-hoc lump-sum prepayments keyed by month (1-indexed).
   * Multiple events on the same month are summed.
   */
  prepayments?: PrepaymentEvent[];
  /**
   * Annual EMI step-up percentage (applied every 12 months).
   * e.g. 10 → EMI increases 10% each year.
   */
  annualEmiStepUpPct?: number;
  /**
   * When prepaying: "tenure" keeps EMI and shortens tenure;
   * "emi" recalculates EMI to keep original end date (approx via remaining months).
   * Default: "tenure".
   */
  prepaymentMode?: "tenure" | "emi";
};

/**
 * Month-by-month amortization with lump-sum prepayments and annual EMI step-ups.
 */
export function generateAmortizationSchedule(
  input: AdvancedAmortizationInput
): AmortizationResult {
  const {
    principal,
    annualRatePct,
    tenureMonths,
    prepayments = [],
    annualEmiStepUpPct = 0,
    prepaymentMode = "tenure",
  } = input;

  const r = monthlyRate(annualRatePct);
  let emi =
    input.emi ?? round0(calculateEmi(principal, annualRatePct, tenureMonths));
  const baseEmi = emi;

  const prepayMap = new Map<number, number>();
  for (const p of prepayments) {
    if (p.month < 1 || p.amount <= 0) continue;
    prepayMap.set(p.month, (prepayMap.get(p.month) ?? 0) + p.amount);
  }

  // Baseline (no prepay / no step-up) for savings comparison
  const baseline = (() => {
    let bal = principal;
    let interest = 0;
    const base = round0(calculateEmi(principal, annualRatePct, tenureMonths));
    let months = 0;
    for (let m = 1; m <= tenureMonths + 2 && bal > 0.5; m++) {
      const interestPart = bal * r;
      const principalPart = Math.min(base - interestPart, bal);
      const pay = principalPart + interestPart;
      bal = Math.max(0, bal - principalPart);
      interest += interestPart;
      months = m;
      if (pay < 0) break;
    }
    return { interest: round0(interest), months };
  })();

  const schedule: AmortizationRow[] = [];
  let balance = principal;
  let cumulativeInterest = 0;
  let cumulativePrincipal = 0;
  let totalPrepayment = 0;
  let currentEmi = emi;
  const hardCap = tenureMonths * 3 + 12; // safety for step-up / tenure mode

  for (let month = 1; month <= hardCap && balance > 0.5; month++) {
    if (annualEmiStepUpPct > 0 && month > 1 && (month - 1) % 12 === 0) {
      currentEmi = round0(currentEmi * (1 + annualEmiStepUpPct / 100));
    }

    const interestComponent = round2(balance * r);
    let principalComponent = round2(currentEmi - interestComponent);

    // Final month adjustment
    if (principalComponent > balance) {
      principalComponent = round2(balance);
      currentEmi = round2(principalComponent + interestComponent);
    }

    if (principalComponent < 0) {
      // EMI too small to cover interest — abort
      break;
    }

    balance = round2(balance - principalComponent);
    cumulativeInterest = round2(cumulativeInterest + interestComponent);
    cumulativePrincipal = round2(cumulativePrincipal + principalComponent);

    let prepayment = prepayMap.get(month) ?? 0;
    if (prepayment > 0) {
      prepayment = Math.min(prepayment, balance);
      balance = round2(balance - prepayment);
      cumulativePrincipal = round2(cumulativePrincipal + prepayment);
      totalPrepayment = round2(totalPrepayment + prepayment);

      if (prepaymentMode === "emi" && balance > 0.5) {
        const remainingMonths = Math.max(1, tenureMonths - month);
        currentEmi = round0(
          calculateEmi(balance, annualRatePct, remainingMonths)
        );
      }
    }

    schedule.push({
      month,
      emi: round0(currentEmi),
      principalComponent: round0(principalComponent),
      interestComponent: round0(interestComponent),
      prepayment: round0(prepayment),
      balance: round0(Math.max(0, balance)),
      cumulativeInterest: round0(cumulativeInterest),
      cumulativePrincipal: round0(cumulativePrincipal),
    });

    if (balance <= 0.5) {
      balance = 0;
      break;
    }

    // In EMI-reduction mode without further step-ups, still stop at original tenure
    if (
      prepaymentMode === "emi" &&
      annualEmiStepUpPct === 0 &&
      month >= tenureMonths
    ) {
      break;
    }
  }

  const monthsTaken = schedule.length;
  const totalInterest = round0(cumulativeInterest);
  const totalPayment = round0(
    schedule.reduce((s, row) => s + row.emi + row.prepayment, 0)
  );

  return {
    schedule,
    emi: baseEmi,
    totalInterest,
    totalPayment,
    totalPrepayment: round0(totalPrepayment),
    monthsTaken,
    interestSavedVsBaseline: Math.max(0, baseline.interest - totalInterest),
    monthsSavedVsBaseline: Math.max(0, baseline.months - monthsTaken),
  };
}

/** Side-by-side: apply same prepayment to cut tenure vs cut EMI. */
export function compareTenureVsEmiReduction(input: {
  principal: number;
  annualRatePct: number;
  tenureMonths: number;
  prepayments: PrepaymentEvent[];
}): {
  tenureStrategy: AmortizationResult;
  emiStrategy: AmortizationResult;
} {
  const base = {
    principal: input.principal,
    annualRatePct: input.annualRatePct,
    tenureMonths: input.tenureMonths,
    prepayments: input.prepayments,
  };
  return {
    tenureStrategy: generateAmortizationSchedule({
      ...base,
      prepaymentMode: "tenure",
    }),
    emiStrategy: generateAmortizationSchedule({
      ...base,
      prepaymentMode: "emi",
    }),
  };
}

export type RefinanceInput = {
  outstandingPrincipal: number;
  currentRatePct: number;
  remainingMonths: number;
  newRatePct: number;
  newTenureMonths: number;
  processingFeePct?: number;
  processingFeeFlat?: number;
};

export function analyzeRefinance(input: RefinanceInput): {
  currentEmi: number;
  newEmi: number;
  currentTotalInterest: number;
  newTotalInterest: number;
  fees: number;
  netSavings: number;
  breakEvenMonths: number | null;
} {
  const {
    outstandingPrincipal,
    currentRatePct,
    remainingMonths,
    newRatePct,
    newTenureMonths,
    processingFeePct = 0,
    processingFeeFlat = 0,
  } = input;

  const current = basicEmi({
    principal: outstandingPrincipal,
    annualRatePct: currentRatePct,
    tenureMonths: remainingMonths,
  });
  const neu = basicEmi({
    principal: outstandingPrincipal,
    annualRatePct: newRatePct,
    tenureMonths: newTenureMonths,
  });

  const fees = round0(
    outstandingPrincipal * (processingFeePct / 100) + processingFeeFlat
  );
  const interestSaving = current.totalInterest - neu.totalInterest;
  const netSavings = round0(interestSaving - fees);
  const monthlySaving = current.emi - neu.emi;
  const breakEvenMonths =
    monthlySaving > 0 ? Math.ceil(fees / monthlySaving) : null;

  return {
    currentEmi: current.emi,
    newEmi: neu.emi,
    currentTotalInterest: current.totalInterest,
    newTotalInterest: neu.totalInterest,
    fees,
    netSavings,
    breakEvenMonths,
  };
}

/** Flat-rate interest vs reducing-balance equivalent. */
export function flatVsReducing(input: {
  principal: number;
  flatRatePct: number;
  tenureMonths: number;
}): {
  flatEmi: number;
  flatTotalInterest: number;
  reducingEmi: number;
  reducingTotalInterest: number;
  equivalentReducingRatePct: number;
} {
  const { principal, flatRatePct, tenureMonths } = input;
  const years = tenureMonths / 12;
  const flatTotalInterest = round0(principal * (flatRatePct / 100) * years);
  const flatEmi = round0((principal + flatTotalInterest) / tenureMonths);

  const reducing = basicEmi({
    principal,
    annualRatePct: flatRatePct,
    tenureMonths,
  });

  // Approximate IRR / equivalent reducing rate via binary search on EMI match
  let lo = 0;
  let hi = flatRatePct * 3;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    const emi = calculateEmi(principal, mid, tenureMonths);
    if (emi > flatEmi) hi = mid;
    else lo = mid;
  }

  return {
    flatEmi,
    flatTotalInterest,
    reducingEmi: reducing.emi,
    reducingTotalInterest: reducing.totalInterest,
    equivalentReducingRatePct: round2(lo),
  };
}

export { calculateEmi, monthsToClearLoan };
