/**
 * Lightweight smoke checks for the financial math engine.
 * Run: npx tsx scripts/smoke-math.ts
 */
import {
  calculateStepUpSip,
  calculateSip,
  calculateXirr,
  generateAmortizationSchedule,
  calculateIncomeTax,
  calculateFire,
  calculateEmi,
} from "../src/utils/financial-math";

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(msg);
}

const sip = calculateSip({
  monthlyInvestment: 10_000,
  annualRatePct: 12,
  years: 10,
});
assert(sip.invested === 12_00_000, `SIP invested ${sip.invested}`);
assert(sip.maturityValue > sip.invested, "SIP should grow");

const step = calculateStepUpSip({
  monthlyInvestment: 10_000,
  annualRatePct: 12,
  years: 10,
  stepUpPct: 10,
});
assert(step.invested > sip.invested, "Step-up should invest more");
assert(step.maturityValue > sip.maturityValue, "Step-up maturity higher");

const emi = calculateEmi(50_00_000, 8.5, 240);
assert(emi > 40_000 && emi < 50_000, `EMI out of range: ${emi}`);

const amort = generateAmortizationSchedule({
  principal: 50_00_000,
  annualRatePct: 8.5,
  tenureMonths: 240,
  prepayments: [{ month: 12, amount: 5_00_000 }],
  annualEmiStepUpPct: 5,
});
assert(amort.monthsTaken < 240, "Prepay should shorten tenure");
assert((amort.interestSavedVsBaseline ?? 0) > 0, "Should save interest");

const xirr = calculateXirr([
  { date: "2020-01-01", amount: -100000 },
  { date: "2021-01-01", amount: -50000 },
  { date: "2024-01-01", amount: 200000 },
]);
assert(xirr.converged, "XIRR should converge");
assert(xirr.xirrPct > 0, "XIRR should be positive");

const tax = calculateIncomeTax({
  grossIncome: 15_00_000,
  deductions80C: 1_50_000,
  isSalaried: true,
});
assert(tax.new.totalTax >= 0 && tax.old.totalTax >= 0, "Tax non-negative");

const fire = calculateFire({
  currentAge: 30,
  monthlyExpenses: 50_000,
  withdrawalRatePct: 4,
});
assert(fire.retirementAge === 42, "Default FIRE age 42");
assert(fire.targetCorpus > 0, "FIRE corpus > 0");

console.log("All smoke checks passed.");
console.log({
  sipMaturity: sip.maturityValue,
  stepMaturity: step.maturityValue,
  emi: Math.round(emi),
  monthsTaken: amort.monthsTaken,
  interestSaved: amort.interestSavedVsBaseline,
  xirrPct: Number(xirr.xirrPct.toFixed(2)),
  betterRegime: tax.better,
  fireCorpus: fire.targetCorpus,
});
