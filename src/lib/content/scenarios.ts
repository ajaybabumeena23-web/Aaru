import { calculateSip, calculateStepUpSip, calculateReverseSip, basicEmi } from "@/utils/financial-math";

/** Long-tail scenario pages with genuine utility (not thin doorway pages). */

type ScenarioBase = {
  slug: string;
  /** Topic hub path segment, e.g. sip | loans | retirement */
  hub: string;
  title: string;
  h1: string;
  description: string;
  insight: string;
  compareNote: string;
  relatedGuides?: string[];
};

export type SipScenario = ScenarioBase & {
  kind: "sip";
  monthly: number;
  rate: number;
  years: number;
  /** If set, also show inflation-adjusted maturity */
  inflationPct?: number;
  /** If set, also show step-up SIP comparison at this annual % */
  stepUpPct?: number;
};

export type EmiScenario = ScenarioBase & {
  kind: "emi";
  principal: number;
  rate: number;
  years: number;
  loanLabel: string;
};

export type GoalScenario = ScenarioBase & {
  kind: "goal";
  target: number;
  rate: number;
  years: number;
  current?: number;
};

export type ContentScenario = SipScenario | EmiScenario | GoalScenario;

export const SCENARIOS: ContentScenario[] = [
  // —— SIP ——
  {
    kind: "sip",
    hub: "sip",
    slug: "5000-sip-for-10-years",
    title: "₹5,000 SIP for 10 years",
    h1: "₹5,000 monthly SIP for 10 years — illustrative maturity",
    description:
      "See invested amount and estimated maturity for a ₹5,000 SIP over 10 years at an illustrative return, then open the live calculator to change assumptions.",
    monthly: 5_000,
    rate: 12,
    years: 10,
    insight:
      "A modest SIP builds habit first. At this size, consistency usually matters more than fine-tuning the return assumption within a realistic band.",
    compareNote:
      "Try the same tenure at 8% and 12% in the live calculator to see how sensitive the corpus is to return assumptions.",
    relatedGuides: ["how-sip-works", "sip-for-beginners"],
  },
  {
    kind: "sip",
    hub: "sip",
    slug: "10000-sip-for-20-years",
    title: "₹10,000 SIP for 20 years",
    h1: "₹10,000 monthly SIP for 20 years — illustrative maturity",
    description:
      "Long-horizon illustration for a ₹10,000 SIP over 20 years with clear invested-vs-gains framing.",
    monthly: 10_000,
    rate: 12,
    years: 20,
    insight:
      "Over 20 years, compounding and contribution totals both dominate. Small annual step-ups can change the ending corpus more than obsessing over a 0.5% return tweak.",
    compareNote:
      "Open Step-Up SIP with a 10% annual increase to compare against a flat ₹10,000 plan.",
    relatedGuides: ["how-sip-works", "sip-vs-lump-sum"],
  },
  {
    kind: "sip",
    hub: "sip",
    slug: "20000-sip-for-15-years",
    title: "₹20,000 SIP for 15 years",
    h1: "₹20,000 monthly SIP for 15 years — illustrative maturity",
    description:
      "Mid-horizon illustration for a ₹20,000 SIP over 15 years—useful for house-down-payment style goals.",
    monthly: 20_000,
    rate: 12,
    years: 15,
    insight:
      "For goals with a hard date (education, down payment), also run an inflation-adjusted view so the corpus is expressed in today’s purchasing power.",
    compareNote:
      "Use Advanced mode on the SIP calculator to toggle inflation and compare real vs nominal corpus.",
    relatedGuides: ["how-sip-works"],
  },
  {
    kind: "sip",
    hub: "sip",
    slug: "25000-sip-for-20-years",
    title: "₹25,000 SIP for 20 years",
    h1: "₹25,000 monthly SIP for 20 years — illustrative maturity",
    description:
      "Higher-contribution long-horizon SIP illustration with invested amount vs estimated maturity.",
    monthly: 25_000,
    rate: 12,
    years: 20,
    insight:
      "At higher SIPs, staying invested through volatility matters as much as the starting amount. Revisit the SIP only when income or goals change—not after every market headline.",
    compareNote:
      "Compare with the Goal Planner if you have a rupee target instead of a fixed SIP.",
    relatedGuides: ["how-sip-works", "how-to-plan-retirement-india"],
  },
  {
    kind: "sip",
    hub: "sip",
    slug: "5000-sip-for-20-years",
    title: "₹5,000 SIP for 20 years",
    h1: "₹5,000 monthly SIP for 20 years — illustrative maturity",
    description:
      "Small SIP, long tenure—shows how time can matter more than starting large.",
    monthly: 5_000,
    rate: 12,
    years: 20,
    insight:
      "A smaller SIP sustained for two decades often beats an ambitious SIP that stops after a few years. Sustainability is a feature.",
    compareNote:
      "Contrast with ₹5,000 for 10 years on this site to see the tenure effect with the same monthly amount.",
    relatedGuides: ["sip-for-beginners"],
  },
  {
    kind: "sip",
    hub: "sip",
    slug: "10000-sip-15-years-with-inflation",
    title: "₹10,000 SIP for 15 years with inflation",
    h1: "₹10,000 SIP for 15 years — nominal vs inflation-adjusted",
    description:
      "Side-by-side nominal maturity and an illustrative inflation-adjusted (real) corpus so purchasing power is clearer.",
    monthly: 10_000,
    rate: 12,
    years: 15,
    inflationPct: 6,
    insight:
      "Nominal maturity can look large while real purchasing power is lower. For goals priced in today’s rupees (fees, down payments), the inflation-adjusted view is often the more honest planning number.",
    compareNote:
      "Change the inflation assumption in the live SIP calculator’s Advanced mode—education costs may inflate faster than general CPI.",
    relatedGuides: ["how-sip-works", "how-to-plan-retirement-india"],
  },
  {
    kind: "sip",
    hub: "sip",
    slug: "10000-flat-vs-10pct-step-up-15-years",
    title: "Flat vs 10% step-up SIP (₹10,000)",
    h1: "₹10,000 SIP: flat vs 10% annual step-up over 15 years",
    description:
      "Compare a flat ₹10,000 SIP with the same starting SIP that rises 10% every year—invested amounts and maturities side by side.",
    monthly: 10_000,
    rate: 12,
    years: 15,
    stepUpPct: 10,
    insight:
      "Step-ups raise both contributions and ending corpus if you can sustain them. The gap is not “free return”—it is mostly higher savings plus compounding on those extras.",
    compareNote:
      "Only step up when cash flow allows. Open the Step-Up SIP calculator to try 5% vs 10% increases.",
    relatedGuides: ["how-sip-works", "sip-vs-lump-sum"],
  },

  // —— Loans / EMI ——
  {
    kind: "emi",
    hub: "loans",
    slug: "50-lakh-home-loan-20-years",
    title: "₹50 lakh home loan for 20 years",
    h1: "₹50 lakh home loan @ 8.5% for 20 years — EMI illustration",
    description:
      "See monthly EMI, total interest and total payment for a common home-loan size, then open the live calculator.",
    principal: 50_00_000,
    rate: 8.5,
    years: 20,
    loanLabel: "Home loan",
    insight:
      "Early EMIs are interest-heavy on reducing-balance loans. A lower EMI from a longer tenure usually means more total interest—compare both before choosing comfort over cost.",
    compareNote:
      "Model a mid-tenure prepayment on the Loan Prepayment calculator to see months and interest saved.",
    relatedGuides: ["how-emi-works", "loan-prepayment-strategies"],
  },
  {
    kind: "emi",
    hub: "loans",
    slug: "75-lakh-home-loan-25-years",
    title: "₹75 lakh home loan for 25 years",
    h1: "₹75 lakh home loan @ 8.5% for 25 years — EMI illustration",
    description:
      "Longer-tenure housing loan illustration showing how stretching tenure lowers EMI but raises lifetime interest.",
    principal: 75_00_000,
    rate: 8.5,
    years: 25,
    loanLabel: "Home loan",
    insight:
      "A 25-year tenure can make EMI fit a budget while quietly increasing total interest. Stress-test a 20-year tenure EMI before locking the longer plan.",
    compareNote:
      "Use the Home Loan EMI calculator and toggle tenure between 20 and 25 years with the same principal.",
    relatedGuides: ["how-emi-works"],
  },
  {
    kind: "emi",
    hub: "loans",
    slug: "5-lakh-personal-loan-4-years",
    title: "₹5 lakh personal loan for 4 years",
    h1: "₹5 lakh personal loan @ 14% for 4 years — EMI illustration",
    description:
      "Shorter-tenure, higher-rate personal loan EMI and total interest illustration.",
    principal: 5_00_000,
    rate: 14,
    years: 4,
    loanLabel: "Personal loan",
    insight:
      "Personal loans often cost more per year than home loans. Prefer clearing high-rate debt before large new SIPs—unless you have a documented higher-priority cash need.",
    compareNote:
      "If a lender quotes a flat rate, compare with the Flat vs Reducing calculator before accepting the EMI.",
    relatedGuides: ["how-emi-works", "loan-prepayment-strategies"],
  },

  // —— Goals ——
  {
    kind: "goal",
    hub: "retirement",
    slug: "1-crore-in-15-years",
    title: "₹1 crore in 15 years",
    h1: "SIP needed for ₹1 crore in 15 years — illustrative",
    description:
      "Reverse-solve the monthly SIP required to reach ₹1 crore in 15 years at an assumed return.",
    target: 1_00_00_000,
    rate: 12,
    years: 15,
    insight:
      "The required SIP is only as good as the return assumption. Re-run at a lower rate to see how much buffer you need in contributions.",
    compareNote:
      "Open the Goal Planner to subtract money already saved and test a what-if SIP.",
    relatedGuides: ["how-to-plan-retirement-india", "how-sip-works"],
  },
  {
    kind: "goal",
    hub: "retirement",
    slug: "50-lakh-in-10-years",
    title: "₹50 lakh in 10 years",
    h1: "SIP needed for ₹50 lakh in 10 years — illustrative",
    description:
      "Shorter-horizon corpus goal—useful for house down-payment style targets.",
    target: 50_00_000,
    rate: 12,
    years: 10,
    insight:
      "Shorter deadlines leave less room for equity volatility. Pair a required-SIP number with an emergency fund and realistic risk level.",
    compareNote:
      "Also price the goal in future rupees if costs will inflate (education, property).",
    relatedGuides: ["how-to-plan-retirement-india", "emergency-fund-basics"],
  },
  {
    kind: "goal",
    hub: "wealth-planning",
    slug: "2-crore-in-20-years",
    title: "₹2 crore in 20 years",
    h1: "SIP needed for ₹2 crore in 20 years — illustrative",
    description:
      "Long-horizon wealth target with required monthly SIP under an assumed return.",
    target: 2_00_00_000,
    rate: 12,
    years: 20,
    insight:
      "Long horizons make consistent investing more important than picking a precise forecast. Review allocation yearly; avoid constant tinkering.",
    compareNote:
      "Use Wealth Planning guides on emergency funds and asset allocation before maximising SIP size.",
    relatedGuides: [
      "asset-allocation-basics",
      "emergency-fund-basics",
      "how-to-plan-retirement-india",
    ],
  },
];

export function scenarioPath(s: ContentScenario): string {
  return `/${s.hub}/${s.slug}`;
}

export function getScenario(slug: string): ContentScenario | undefined {
  return SCENARIOS.find((s) => s.slug === slug);
}

export function getScenariosForHub(hub: string): ContentScenario[] {
  return SCENARIOS.filter((s) => s.hub === hub);
}

/** @deprecated use getScenario */
export function getSipScenario(slug: string): SipScenario | undefined {
  const s = getScenario(slug);
  return s?.kind === "sip" ? s : undefined;
}

/** @deprecated use SCENARIOS filter */
export const SIP_SCENARIOS: SipScenario[] = SCENARIOS.filter(
  (s): s is SipScenario => s.kind === "sip"
);

export function computeSipScenario(s: SipScenario) {
  const flat = calculateSip({
    monthlyInvestment: s.monthly,
    annualRatePct: s.rate,
    years: s.years,
    inflationPct: s.inflationPct ?? 0,
  });
  const step =
    s.stepUpPct && s.stepUpPct > 0
      ? calculateStepUpSip({
          monthlyInvestment: s.monthly,
          annualRatePct: s.rate,
          years: s.years,
          stepUpPct: s.stepUpPct,
        })
      : null;
  return { flat, step };
}

export function computeEmiScenario(s: EmiScenario) {
  return basicEmi({
    principal: s.principal,
    annualRatePct: s.rate,
    tenureMonths: s.years * 12,
  });
}

export function computeGoalScenario(s: GoalScenario) {
  const current = s.current ?? 0;
  const remaining = Math.max(0, s.target - current);
  const reverse = calculateReverseSip({
    targetCorpus: remaining,
    annualRatePct: s.rate,
    years: s.years,
  });
  return { remaining, reverse };
}
