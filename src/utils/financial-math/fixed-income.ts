import { futureValueLumpSum, round0 } from "./helpers";

/** PPF: annual deposits, compounded annually (simplified March-end model). */
export function calculatePpf(input: {
  annualDeposit: number;
  years?: number;
  ratePct?: number;
}): {
  maturityValue: number;
  totalDeposited: number;
  interestEarned: number;
  yearly: { year: number; deposit: number; balance: number }[];
} {
  const years = input.years ?? 15;
  const rate = (input.ratePct ?? 7.1) / 100;
  let balance = 0;
  let totalDeposited = 0;
  const yearly: { year: number; deposit: number; balance: number }[] = [];

  for (let y = 1; y <= years; y++) {
    balance += input.annualDeposit;
    totalDeposited += input.annualDeposit;
    balance *= 1 + rate;
    yearly.push({
      year: y,
      deposit: round0(input.annualDeposit),
      balance: round0(balance),
    });
  }

  const maturityValue = round0(balance);
  return {
    maturityValue,
    totalDeposited: round0(totalDeposited),
    interestEarned: round0(maturityValue - totalDeposited),
    yearly,
  };
}

/** EPF: monthly employee + employer contribution, monthly compounding approx. */
export function calculateEpf(input: {
  monthlyBasic: number;
  employeePct?: number;
  employerPct?: number;
  years: number;
  ratePct?: number;
}): {
  maturityValue: number;
  employeeContribution: number;
  employerContribution: number;
  interestEarned: number;
} {
  const employeePct = (input.employeePct ?? 12) / 100;
  const employerPct = (input.employerPct ?? 3.67) / 100; // EPS carve-out simplified
  const r = (input.ratePct ?? 8.25) / 100 / 12;
  const months = input.years * 12;
  let balance = 0;
  let employeeContribution = 0;
  let employerContribution = 0;

  for (let m = 0; m < months; m++) {
    const emp = input.monthlyBasic * employeePct;
    const er = input.monthlyBasic * employerPct;
    employeeContribution += emp;
    employerContribution += er;
    balance = (balance + emp + er) * (1 + r);
  }

  const maturityValue = round0(balance);
  return {
    maturityValue,
    employeeContribution: round0(employeeContribution),
    employerContribution: round0(employerContribution),
    interestEarned: round0(
      maturityValue - employeeContribution - employerContribution
    ),
  };
}

/** NPS corpus projection (simplified equity/debt blend return). */
export function calculateNps(input: {
  monthlyContribution: number;
  years: number;
  expectedReturnPct?: number;
  annuityPct?: number;
}): {
  corpus: number;
  lumpSum: number;
  annuityAmount: number;
  totalInvested: number;
} {
  const rate = input.expectedReturnPct ?? 10;
  const annuityPct = (input.annuityPct ?? 40) / 100;
  const months = input.years * 12;
  const r = rate / 100 / 12;
  let corpus = 0;
  for (let m = 0; m < months; m++) {
    corpus = (corpus + input.monthlyContribution) * (1 + r);
  }
  corpus = round0(corpus);
  const annuityAmount = round0(corpus * annuityPct);
  const lumpSum = corpus - annuityAmount;
  return {
    corpus,
    lumpSum,
    annuityAmount,
    totalInvested: round0(input.monthlyContribution * months),
  };
}

/** Sukanya Samriddhi Yojana — annual deposit, annual compound. */
export function calculateSsy(input: {
  annualDeposit: number;
  /** Deposits allowed for 15 years; matures at 21. */
  depositYears?: number;
  maturityYears?: number;
  ratePct?: number;
}): {
  maturityValue: number;
  totalDeposited: number;
  interestEarned: number;
} {
  const depositYears = input.depositYears ?? 15;
  const maturityYears = input.maturityYears ?? 21;
  const rate = (input.ratePct ?? 8.2) / 100;
  let balance = 0;
  let totalDeposited = 0;

  for (let y = 1; y <= maturityYears; y++) {
    if (y <= depositYears) {
      balance += input.annualDeposit;
      totalDeposited += input.annualDeposit;
    }
    balance *= 1 + rate;
  }

  const maturityValue = round0(balance);
  return {
    maturityValue,
    totalDeposited: round0(totalDeposited),
    interestEarned: round0(maturityValue - totalDeposited),
  };
}

export function calculateFd(input: {
  principal: number;
  ratePct: number;
  years: number;
  compoundingPerYear?: number;
}): { maturityValue: number; interestEarned: number } {
  const n = input.compoundingPerYear ?? 4;
  const maturityValue = round0(
    input.principal *
      Math.pow(1 + input.ratePct / 100 / n, n * input.years)
  );
  return {
    maturityValue,
    interestEarned: round0(maturityValue - input.principal),
  };
}

export function calculateRd(input: {
  monthlyDeposit: number;
  ratePct: number;
  months: number;
}): { maturityValue: number; totalDeposited: number; interestEarned: number } {
  const r = input.ratePct / 100 / 12;
  let balance = 0;
  for (let m = 0; m < input.months; m++) {
    balance = (balance + input.monthlyDeposit) * (1 + r);
  }
  const maturityValue = round0(balance);
  const totalDeposited = round0(input.monthlyDeposit * input.months);
  return {
    maturityValue,
    totalDeposited,
    interestEarned: round0(maturityValue - totalDeposited),
  };
}

/** NSC / SCSS / KVP simplified maturity helpers. */
export function calculatePostOfficeScheme(input: {
  scheme: "nsc" | "scss" | "kvp";
  principal: number;
  ratePct?: number;
  years?: number;
  /** SCSS: quarterly interest payout instead of compounding. */
}): {
  maturityValue: number;
  totalInterest: number;
  periodicPayout?: number;
} {
  const { scheme, principal } = input;
  if (scheme === "scss") {
    const rate = input.ratePct ?? 8.2;
    const years = input.years ?? 5;
    const quarterly = round0((principal * rate) / 100 / 4);
    const totalInterest = quarterly * 4 * years;
    return {
      maturityValue: round0(principal), // principal returned at end
      totalInterest: round0(totalInterest),
      periodicPayout: quarterly,
    };
  }
  if (scheme === "kvp") {
    // KVP doubles money in ~115 months at ~7.5% — use FV
    const rate = input.ratePct ?? 7.5;
    const years = input.years ?? 115 / 12;
    const maturityValue = round0(futureValueLumpSum(principal, rate, years));
    return {
      maturityValue,
      totalInterest: round0(maturityValue - principal),
    };
  }
  // NSC 5-year compound annually
  const rate = input.ratePct ?? 7.7;
  const years = input.years ?? 5;
  const maturityValue = round0(futureValueLumpSum(principal, rate, years));
  return {
    maturityValue,
    totalInterest: round0(maturityValue - principal),
  };
}
