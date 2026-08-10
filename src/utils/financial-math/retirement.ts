import {
  DEFAULT_EDUCATION_INFLATION_PCT,
  DEFAULT_FIRE_RETIREMENT_AGE,
  DEFAULT_INFLATION_PCT,
} from "./constants";
import { futureValueLumpSum, round0 } from "./helpers";
import { calculateReverseSip } from "./investment";
import { generateAmortizationSchedule } from "./loan";

export type FireInput = {
  currentAge: number;
  /** Defaults to 42. */
  retirementAge?: number;
  monthlyExpenses: number;
  /** Safe withdrawal rate %, e.g. 4. */
  withdrawalRatePct: number;
  currentCorpus?: number;
  expectedReturnPct?: number;
  inflationPct?: number;
};

export type FireResult = {
  retirementAge: number;
  yearsToRetirement: number;
  annualExpensesToday: number;
  annualExpensesAtRetirement: number;
  targetCorpus: number;
  corpusGap: number;
  requiredMonthlySip: number;
};

/**
 * FIRE target corpus = inflated annual expenses / (SWR/100).
 * Default retirement age: 42.
 */
export function calculateFire(input: FireInput): FireResult {
  const retirementAge = input.retirementAge ?? DEFAULT_FIRE_RETIREMENT_AGE;
  const inflationPct = input.inflationPct ?? DEFAULT_INFLATION_PCT;
  const expectedReturnPct = input.expectedReturnPct ?? 12;
  const currentCorpus = input.currentCorpus ?? 0;

  const yearsToRetirement = Math.max(0, retirementAge - input.currentAge);
  const annualExpensesToday = input.monthlyExpenses * 12;
  const annualExpensesAtRetirement = round0(
    futureValueLumpSum(annualExpensesToday, inflationPct, yearsToRetirement)
  );
  const swr = Math.max(0.1, input.withdrawalRatePct);
  const targetCorpus = round0(
    (annualExpensesAtRetirement * 100) / swr
  );
  const futureCurrentCorpus = round0(
    futureValueLumpSum(currentCorpus, expectedReturnPct, yearsToRetirement)
  );
  const corpusGap = Math.max(0, targetCorpus - futureCurrentCorpus);
  const { monthlySip } = calculateReverseSip({
    targetCorpus: corpusGap,
    annualRatePct: expectedReturnPct,
    years: yearsToRetirement,
  });

  return {
    retirementAge,
    yearsToRetirement,
    annualExpensesToday: round0(annualExpensesToday),
    annualExpensesAtRetirement,
    targetCorpus,
    corpusGap,
    requiredMonthlySip: monthlySip,
  };
}

export type ChildEducationInput = {
  currentCost: number;
  yearsUntilStart: number;
  educationInflationPct?: number;
  existingCorpus?: number;
  expectedReturnPct?: number;
  /** Duration of funding need in years (e.g. 4-year degree). */
  programYears?: number;
};

export type ChildEducationResult = {
  futureCost: number;
  totalProgramCost: number;
  corpusGap: number;
  requiredMonthlySip: number;
};

export function calculateChildEducation(
  input: ChildEducationInput
): ChildEducationResult {
  const educationInflationPct =
    input.educationInflationPct ?? DEFAULT_EDUCATION_INFLATION_PCT;
  const expectedReturnPct = input.expectedReturnPct ?? 12;
  const existingCorpus = input.existingCorpus ?? 0;
  const programYears = input.programYears ?? 4;

  const futureCost = round0(
    futureValueLumpSum(
      input.currentCost,
      educationInflationPct,
      input.yearsUntilStart
    )
  );

  // Sum inflated annual costs across program years
  let totalProgramCost = 0;
  for (let y = 0; y < programYears; y++) {
    totalProgramCost += futureValueLumpSum(
      input.currentCost,
      educationInflationPct,
      input.yearsUntilStart + y
    );
  }
  totalProgramCost = round0(totalProgramCost);

  const futureExisting = round0(
    futureValueLumpSum(
      existingCorpus,
      expectedReturnPct,
      input.yearsUntilStart
    )
  );
  const corpusGap = Math.max(0, totalProgramCost - futureExisting);
  const { monthlySip } = calculateReverseSip({
    targetCorpus: corpusGap,
    annualRatePct: expectedReturnPct,
    years: input.yearsUntilStart,
  });

  return {
    futureCost,
    totalProgramCost,
    corpusGap,
    requiredMonthlySip: monthlySip,
  };
}

/** Simplified rent vs buy NPV comparison (first-pass heuristic). */
export function analyzeRentVsBuy(input: {
  homePrice: number;
  downPayment: number;
  loanRatePct: number;
  loanTenureYears: number;
  monthlyRent: number;
  rentInflationPct?: number;
  homeAppreciationPct?: number;
  investmentReturnPct?: number;
  years: number;
  maintenancePctOfPrice?: number;
}): {
  buyNetWorth: number;
  rentNetWorth: number;
  advantage: "buy" | "rent" | "same";
  advantageAmount: number;
} {
  const {
    homePrice,
    downPayment,
    loanRatePct,
    loanTenureYears,
    monthlyRent,
    rentInflationPct = 5,
    homeAppreciationPct = 4,
    investmentReturnPct = 10,
    years,
    maintenancePctOfPrice = 1,
  } = input;

  const loan = Math.max(0, homePrice - downPayment);
  const amort = generateAmortizationSchedule({
    principal: loan,
    annualRatePct: loanRatePct,
    tenureMonths: loanTenureYears * 12,
  });

  const homeValue = futureValueLumpSum(homePrice, homeAppreciationPct, years);
  const months = years * 12;
  const loanBalance =
    amort.schedule[Math.min(months, amort.schedule.length) - 1]?.balance ?? 0;
  const maintenanceAnnual = homePrice * (maintenancePctOfPrice / 100);
  const totalMaintenance = maintenanceAnnual * years;
  // Rough equity build: home - remaining loan - maint opportunity cost ignored
  const buyNetWorth = round0(homeValue - loanBalance - totalMaintenance);

  // Rent path: invest down payment + EMI−rent differential when positive
  let portfolio = downPayment;
  let rent = monthlyRent;
  const monthlyInvestReturn = investmentReturnPct / 100 / 12;
  const emi = amort.emi;

  for (let m = 1; m <= months; m++) {
    portfolio *= 1 + monthlyInvestReturn;
    // Opportunity: money not spent on EMI beyond rent can be invested
    const surplus = emi - rent;
    if (surplus > 0) portfolio += surplus;
    if (m % 12 === 0) rent *= 1 + rentInflationPct / 100;
  }

  const rentNetWorth = round0(portfolio);
  const diff = buyNetWorth - rentNetWorth;
  let advantage: "buy" | "rent" | "same" = "same";
  if (diff > 1000) advantage = "buy";
  else if (diff < -1000) advantage = "rent";

  return {
    buyNetWorth,
    rentNetWorth,
    advantage,
    advantageAmount: round0(Math.abs(diff)),
  };
}
