import {
  TrendingUp,
  Landmark,
  Flame,
  Receipt,
  Building2,
  type LucideIcon,
} from "lucide-react";

export type CalculatorMeta = {
  slug: string;
  title: string;
  h1: string;
  description: string;
};

export type CalculatorCategory = {
  id: string;
  label: string;
  icon: LucideIcon;
  calculators: CalculatorMeta[];
};

export const CALCULATOR_CATEGORIES: CalculatorCategory[] = [
  {
    id: "investment",
    label: "Investment & Wealth",
    icon: TrendingUp,
    calculators: [
      {
        slug: "sip",
        title: "SIP Calculator",
        h1: "Build Wealth with Systematic Investing",
        description: "Project SIP maturity with inflation and post-tax toggles.",
      },
      {
        slug: "step-up-sip",
        title: "Step-Up SIP",
        h1: "Accelerate Wealth with Annual SIP Step-Ups",
        description: "Model SIPs that grow by a fixed % every year.",
      },
      {
        slug: "lump-sum",
        title: "Lump Sum",
        h1: "Grow a One-Time Investment",
        description: "Estimate corpus from a single lump-sum investment.",
      },
      {
        slug: "swp",
        title: "SWP Calculator",
        h1: "Plan Systematic Withdrawals",
        description: "See how long your corpus lasts with monthly withdrawals.",
      },
      {
        slug: "xirr",
        title: "XIRR Calculator",
        h1: "Measure True Portfolio Returns",
        description: "Compute XIRR for irregular cash flows (Newton-Raphson).",
      },
    ],
  },
  {
    id: "debt",
    label: "Debt Management",
    icon: Landmark,
    calculators: [
      {
        slug: "emi",
        title: "EMI Calculator",
        h1: "Know Your Exact Monthly EMI",
        description: "Calculate EMI, total interest, and payment breakup.",
      },
      {
        slug: "advanced-prepayment",
        title: "Advanced Prepayment",
        h1: "Crush Debt Faster with Smart Prepayments",
        description: "Lump-sum prepayments and annual EMI step-ups.",
      },
      {
        slug: "tenure-vs-emi",
        title: "Tenure vs EMI",
        h1: "Choose Tenure Cut or EMI Cut",
        description: "Side-by-side impact of prepayment strategies.",
      },
      {
        slug: "refinance",
        title: "Refinance Analyzer",
        h1: "Should You Refinance Your Loan?",
        description: "Compare switching costs vs interest savings.",
      },
      {
        slug: "flat-vs-reducing",
        title: "Flat vs Reducing",
        h1: "Unmask Flat Rate Loans",
        description: "Compare flat rate quotes with reducing balance reality.",
      },
      {
        slug: "rent-vs-buy",
        title: "Rent vs Buy",
        h1: "Decide: Rent or Buy Your Home?",
        description: "Opportunity-cost aware rent vs buy analysis.",
      },
    ],
  },
  {
    id: "retirement",
    label: "Retirement & Goals",
    icon: Flame,
    calculators: [
      {
        slug: "fire",
        title: "FIRE Planner",
        h1: "Retire Early (FIRE) Planner",
        description: "Target corpus from expenses, SWR, and retirement age 42.",
      },
      {
        slug: "reverse-sip",
        title: "Reverse SIP",
        h1: "Find the SIP That Hits Your Goal",
        description: "Back-solve monthly SIP for a target corpus.",
      },
      {
        slug: "child-education",
        title: "Child Education",
        h1: "Fund Your Child's Education",
        description: "Plan for 10–12% education inflation.",
      },
    ],
  },
  {
    id: "taxation",
    label: "Taxation & Salary",
    icon: Receipt,
    calculators: [
      {
        slug: "income-tax",
        title: "Income Tax",
        h1: "Old vs New Tax Regime Compared",
        description: "Side-by-side FY tax under both regimes.",
      },
      {
        slug: "capital-gains",
        title: "Capital Gains",
        h1: "Estimate STCG & LTCG Liability",
        description: "Equity and real-estate capital gains (Indian rates).",
      },
      {
        slug: "hra-exemption",
        title: "HRA Exemption",
        h1: "Maximise Your HRA Exemption",
        description: "Compute exempt HRA under Section 10(13A).",
      },
      {
        slug: "take-home-salary",
        title: "Take-Home Salary",
        h1: "See Your Real In-Hand Pay",
        description: "Net salary after EPF, TDS, and professional tax.",
      },
    ],
  },
  {
    id: "government",
    label: "Govt & Fixed Income",
    icon: Building2,
    calculators: [
      {
        slug: "ppf",
        title: "PPF",
        h1: "Grow Tax-Free with PPF",
        description: "Public Provident Fund maturity and interest schedule.",
      },
      {
        slug: "nps",
        title: "NPS",
        h1: "Plan Your NPS Retirement Corpus",
        description: "Estimate NPS corpus and annuity split.",
      },
      {
        slug: "epf",
        title: "EPF",
        h1: "Project Your EPF Balance",
        description: "Employee Provident Fund growth with contributions.",
      },
      {
        slug: "ssy",
        title: "SSY",
        h1: "Save for Your Girl Child (SSY)",
        description: "Sukanya Samriddhi Yojana maturity calculator.",
      },
      {
        slug: "post-office",
        title: "Post Office Schemes",
        h1: "Compare NSC, SCSS & KVP",
        description: "India Post fixed-income scheme returns.",
      },
      {
        slug: "fd-rd",
        title: "Bank FD / RD",
        h1: "Bank FD & RD Returns",
        description: "Fixed and recurring deposit maturity values.",
      },
    ],
  },
];

export function getCategory(categoryId: string): CalculatorCategory | undefined {
  return CALCULATOR_CATEGORIES.find((c) => c.id === categoryId);
}

export function getCalculator(
  categoryId: string,
  slug: string
): CalculatorMeta | undefined {
  return getCategory(categoryId)?.calculators.find((c) => c.slug === slug);
}
