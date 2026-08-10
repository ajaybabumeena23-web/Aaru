import type { CashFlow } from "./constants";
import { toDate, yearFraction } from "./helpers";

/**
 * NPV of irregular cash flows at annual rate `rate` (decimal, e.g. 0.12).
 * Uses Actual/365.25 year fractions from the first cash-flow date.
 */
export function npv(cashFlows: CashFlow[], rate: number): number {
  if (cashFlows.length === 0) return 0;
  const sorted = [...cashFlows].map((cf) => ({
    date: toDate(cf.date),
    amount: cf.amount,
  }));
  sorted.sort((a, b) => a.date.getTime() - b.date.getTime());
  const t0 = sorted[0].date;
  return sorted.reduce((sum, cf) => {
    const t = yearFraction(t0, cf.date);
    return sum + cf.amount / Math.pow(1 + rate, t);
  }, 0);
}

/** Analytical derivative of NPV w.r.t. rate (for Newton-Raphson). */
function npvDerivative(cashFlows: CashFlow[], rate: number): number {
  const sorted = [...cashFlows].map((cf) => ({
    date: toDate(cf.date),
    amount: cf.amount,
  }));
  sorted.sort((a, b) => a.date.getTime() - b.date.getTime());
  const t0 = sorted[0].date;
  return sorted.reduce((sum, cf) => {
    const t = yearFraction(t0, cf.date);
    if (t === 0) return sum;
    return sum - (t * cf.amount) / Math.pow(1 + rate, t + 1);
  }, 0);
}

export type XirrResult = {
  /** Annualized XIRR as percentage, e.g. 14.25 */
  xirrPct: number;
  converged: boolean;
  iterations: number;
};

/**
 * XIRR via Newton-Raphson.
 * Cash flows must include at least one positive and one negative amount.
 */
export function calculateXirr(
  cashFlows: CashFlow[],
  guess = 0.1,
  maxIterations = 100,
  tolerance = 1e-7
): XirrResult {
  if (cashFlows.length < 2) {
    return { xirrPct: 0, converged: false, iterations: 0 };
  }

  const hasPos = cashFlows.some((c) => c.amount > 0);
  const hasNeg = cashFlows.some((c) => c.amount < 0);
  if (!hasPos || !hasNeg) {
    return { xirrPct: 0, converged: false, iterations: 0 };
  }

  let rate = guess;
  let iterations = 0;

  for (; iterations < maxIterations; iterations++) {
    const f = npv(cashFlows, rate);
    const fPrime = npvDerivative(cashFlows, rate);

    if (Math.abs(fPrime) < 1e-14) break;

    const next = rate - f / fPrime;
    if (!Number.isFinite(next) || next <= -0.999999) {
      // Fallback: bisection bracket
      return bisectionXirr(cashFlows, maxIterations, tolerance);
    }

    if (Math.abs(next - rate) < tolerance) {
      return {
        xirrPct: next * 100,
        converged: true,
        iterations: iterations + 1,
      };
    }
    rate = next;
  }

  // If Newton failed to converge tightly, try bisection
  const bisect = bisectionXirr(cashFlows, maxIterations, tolerance);
  if (bisect.converged) return bisect;

  return {
    xirrPct: rate * 100,
    converged: Math.abs(npv(cashFlows, rate)) < 1e-4,
    iterations,
  };
}

function bisectionXirr(
  cashFlows: CashFlow[],
  maxIterations: number,
  tolerance: number
): XirrResult {
  let low = -0.99;
  let high = 10;
  let fLow = npv(cashFlows, low);
  let fHigh = npv(cashFlows, high);

  // Expand high if same sign
  let expand = 0;
  while (fLow * fHigh > 0 && expand < 20) {
    high *= 1.5;
    fHigh = npv(cashFlows, high);
    expand++;
  }
  if (fLow * fHigh > 0) {
    return { xirrPct: 0, converged: false, iterations: 0 };
  }

  let mid = 0;
  for (let i = 0; i < maxIterations; i++) {
    mid = (low + high) / 2;
    const fMid = npv(cashFlows, mid);
    if (Math.abs(fMid) < tolerance || (high - low) / 2 < tolerance) {
      return { xirrPct: mid * 100, converged: true, iterations: i + 1 };
    }
    if (fLow * fMid <= 0) {
      high = mid;
      fHigh = fMid;
    } else {
      low = mid;
      fLow = fMid;
    }
  }
  return { xirrPct: mid * 100, converged: false, iterations: maxIterations };
}
