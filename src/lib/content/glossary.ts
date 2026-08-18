export type GlossaryTerm = {
  slug: string;
  term: string;
  short: string;
  definition: string;
  relatedCalculators?: { href: string; title: string }[];
  relatedGuides?: string[];
};

export const GLOSSARY: GlossaryTerm[] = [
  {
    slug: "swp",
    term: "SWP",
    short: "Systematic Withdrawal Plan",
    definition:
      "A schedule of regular withdrawals from a mutual fund investment. Units are redeemed to fund each payout; remaining units stay invested.",
    relatedCalculators: [
      { href: "/calculators/investment/swp", title: "SWP Calculator" },
    ],
    relatedGuides: ["how-swp-works"],
  },
  {
    slug: "hra",
    term: "HRA",
    short: "House Rent Allowance",
    definition:
      "A salary component that may qualify for tax exemption under rules that consider rent paid, salary and city classification. Exact computation depends on current law and your documents.",
    relatedCalculators: [
      {
        href: "/calculators/taxation/hra-exemption",
        title: "HRA Exemption Calculator",
      },
    ],
  },
  {
    slug: "sip",
    term: "SIP",
    short: "Systematic Investment Plan",
    definition:
      "A schedule of fixed investments (often monthly) into a mutual fund. Each instalment buys units at the prevailing NAV. Returns are not guaranteed.",
    relatedCalculators: [
      { href: "/calculators/investment/sip", title: "SIP Calculator" },
    ],
    relatedGuides: ["how-sip-works"],
  },
  {
    slug: "nav",
    term: "NAV",
    short: "Net Asset Value",
    definition:
      "Per-unit value of a mutual fund scheme after assets and liabilities. SIP instalments buy units based on NAV on the allotment day.",
  },
  {
    slug: "cagr",
    term: "CAGR",
    short: "Compound Annual Growth Rate",
    definition:
      "A smoothed annualised growth rate between two values over time. Best for single start/end points—not irregular cash flows (use XIRR instead).",
  },
  {
    slug: "xirr",
    term: "XIRR",
    short: "Extended Internal Rate of Return",
    definition:
      "Annualised return that accounts for multiple cash flows on different dates. Useful for SIP + redemption histories.",
    relatedCalculators: [
      { href: "/calculators/investment/xirr", title: "XIRR Calculator" },
    ],
    relatedGuides: ["xirr-explained"],
  },
  {
    slug: "ltcg",
    term: "LTCG",
    short: "Long-Term Capital Gains",
    definition:
      "Gains on assets held beyond a specified holding period defined in tax law. Rates and holding periods vary by asset class and can change—verify officially.",
    relatedCalculators: [
      { href: "/calculators/taxation/capital-gains", title: "Capital Gains" },
    ],
  },
  {
    slug: "stcg",
    term: "STCG",
    short: "Short-Term Capital Gains",
    definition:
      "Gains on assets sold before the long-term holding period. Treatment depends on asset type and current tax rules.",
  },
  {
    slug: "emi",
    term: "EMI",
    short: "Equated Monthly Instalment",
    definition:
      "A fixed monthly payment on a reducing-balance loan covering interest and principal. Early EMIs are typically interest-heavy.",
    relatedCalculators: [
      { href: "/calculators/debt/emi", title: "EMI Calculator" },
    ],
    relatedGuides: ["how-emi-works"],
  },
  {
    slug: "reducing-balance",
    term: "Reducing balance",
    short: "Interest on outstanding principal",
    definition:
      "Interest is charged on the remaining loan principal. As you repay, interest cost falls. Contrast with flat-rate quotes.",
    relatedCalculators: [
      {
        href: "/calculators/debt/flat-vs-reducing",
        title: "Flat vs Reducing",
      },
    ],
  },
  {
    slug: "flat-rate",
    term: "Flat rate",
    short: "Interest quoted on original principal",
    definition:
      "A quoting method where interest may be calculated on the original loan amount for the full tenure—often looking lower than the equivalent reducing rate. Always compare effective cost.",
  },
  {
    slug: "prepayment",
    term: "Prepayment",
    short: "Extra loan repayment",
    definition:
      "Paying more than the scheduled EMI to reduce principal early. May shorten tenure or lower EMI depending on lender options and fees.",
    relatedCalculators: [
      {
        href: "/calculators/debt/advanced-prepayment",
        title: "Advanced Prepayment",
      },
    ],
  },
  {
    slug: "inflation",
    term: "Inflation",
    short: "Rising prices over time",
    definition:
      "Erodes purchasing power. Long-term goals should compare corpus in today’s rupees using an inflation assumption.",
  },
  {
    slug: "corpus",
    term: "Corpus",
    short: "Total invested pot",
    definition:
      "The pool of money accumulated for a goal (retirement, education, etc.). Target corpus depends on expenses and withdrawal assumptions.",
  },
  {
    slug: "fire",
    term: "FIRE",
    short: "Financial Independence, Retire Early",
    definition:
      "A planning approach aiming for a portfolio that can fund living costs without traditional employment income.",
    relatedCalculators: [
      { href: "/calculators/retirement/fire", title: "FIRE Planner" },
    ],
    relatedGuides: ["what-is-fire"],
  },
  {
    slug: "swr",
    term: "SWR",
    short: "Safe Withdrawal Rate",
    definition:
      "An assumed percentage of corpus withdrawn annually in retirement planning. Common illustrations use ~3–4%; not a guarantee.",
  },
  {
    slug: "ppf",
    term: "PPF",
    short: "Public Provident Fund",
    definition:
      "A long-term government-backed savings scheme with notified interest rates and contribution rules. Confirm current terms officially.",
    relatedCalculators: [
      { href: "/calculators/government/ppf", title: "PPF Calculator" },
    ],
  },
  {
    slug: "epf",
    term: "EPF",
    short: "Employee Provident Fund",
    definition:
      "Retirement savings contribution framework for eligible employees, administered with notified rates and withdrawal rules.",
    relatedCalculators: [
      { href: "/calculators/government/epf", title: "EPF Calculator" },
    ],
  },
  {
    slug: "nps",
    term: "NPS",
    short: "National Pension System",
    definition:
      "A contribution-based pension system with market-linked returns and regulated withdrawal/annuity features (see PFRDA).",
    relatedCalculators: [
      { href: "/calculators/government/nps", title: "NPS Calculator" },
    ],
  },
  {
    slug: "annuity",
    term: "Annuity",
    short: "Income stream purchase",
    definition:
      "A product that converts a lump sum into periodic payments. NPS and retirement plans may require or offer annuity purchase for a portion of corpus—rules vary.",
  },
  {
    slug: "fd",
    term: "FD",
    short: "Fixed Deposit",
    definition:
      "A bank (or similar) deposit of a lump sum for a fixed tenure at a quoted rate. Interest taxation depends on current rules and your slab.",
    relatedCalculators: [
      { href: "/calculators/government/fd-rd", title: "FD / RD Calculator" },
    ],
  },
  {
    slug: "rd",
    term: "RD",
    short: "Recurring Deposit",
    definition:
      "A deposit product where you contribute fixed amounts on a schedule for a tenure, earning interest as per the quote.",
  },
  {
    slug: "compounding",
    term: "Compounding",
    short: "Earning on reinvested returns",
    definition:
      "When returns themselves earn returns. Frequency (monthly/quarterly/annual) and contribution timing change outcomes.",
  },
  {
    slug: "expense-ratio",
    term: "Expense ratio",
    short: "Fund operating cost",
    definition:
      "Annual fund management and operating costs charged within a mutual fund’s NAV. Higher expenses reduce investor returns, all else equal.",
  },
  {
    slug: "80c",
    term: "Section 80C",
    short: "Deduction umbrella (illustrative)",
    definition:
      "A commonly discussed deduction section for eligible investments/expenses subject to limits and regime choice. Eligibility and limits change—verify officially.",
  },
  {
    slug: "tds",
    term: "TDS",
    short: "Tax Deducted at Source",
    definition:
      "Tax withheld by a payer (employer, bank, etc.) and deposited with the government. It is not always your final tax liability.",
  },
  {
    slug: "term-insurance",
    term: "Term insurance",
    short: "Pure life cover",
    definition:
      "Life insurance that pays a sum assured on death during the policy term, typically without a large savings component. Confirm exclusions and claim rules in the policy document.",
    relatedGuides: ["term-vs-traditional-life-cover", "how-much-life-cover"],
  },
  {
    slug: "sum-assured",
    term: "Sum assured",
    short: "Stated life cover amount",
    definition:
      "The amount an insurer agrees to pay on a covered event as defined in the policy. Riders and conditions can affect what is actually paid.",
  },
  {
    slug: "emergency-fund",
    term: "Emergency fund",
    short: "Liquid cash buffer",
    definition:
      "Money set aside for unexpected essential expenses or income shocks, kept accessible and relatively safe rather than maximising return.",
    relatedGuides: ["emergency-fund-basics"],
  },
  {
    slug: "asset-allocation",
    term: "Asset allocation",
    short: "Mix of asset classes",
    definition:
      "How a portfolio is split across equity, debt, cash and other assets based on goals, timeline and risk capacity.",
    relatedGuides: ["asset-allocation-basics"],
  },
  {
    slug: "diversification",
    term: "Diversification",
    short: "Spreading risk",
    definition:
      "Holding exposures that do not all move together, to reduce the impact of any single holding or sector. Does not remove market-wide risk.",
    relatedGuides: ["diversification-basics"],
  },
];

export function getGlossaryTerm(slug: string): GlossaryTerm | undefined {
  return GLOSSARY.find((t) => t.slug === slug);
}

export function searchGlossary(query: string): GlossaryTerm[] {
  const q = query.trim().toLowerCase();
  if (!q) return GLOSSARY;
  return GLOSSARY.filter(
    (t) =>
      t.term.toLowerCase().includes(q) ||
      t.short.toLowerCase().includes(q) ||
      t.definition.toLowerCase().includes(q)
  );
}
