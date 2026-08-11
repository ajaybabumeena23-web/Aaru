export type GuideSection = {
  h2: string;
  paragraphs: string[];
  bullets?: string[];
};

export type Guide = {
  slug: string;
  title: string;
  description: string;
  category: string;
  readingMinutes: number;
  lastUpdated: string;
  sections: GuideSection[];
  relatedCalculators: { href: string; title: string }[];
  relatedGuides: string[];
  topicSlugs?: string[];
};

const UPDATED = "August 2026";

export const GUIDES: Guide[] = [
  {
    slug: "how-sip-works",
    title: "How SIP works",
    description:
      "A plain-language explanation of Systematic Investment Plans, compounding, and what SIP calculators actually estimate.",
    category: "Investing",
    readingMinutes: 6,
    lastUpdated: UPDATED,
    topicSlugs: ["sip", "mutual-funds"],
    sections: [
      {
        h2: "What a SIP really does",
        paragraphs: [
          "A SIP invests a fixed amount on a schedule (often monthly) into a mutual fund scheme. Each instalment buys units at that day’s NAV. Over time you accumulate units; the rupee value of those units moves with the market.",
          "A SIP does not guarantee returns. It is a contribution habit plus market exposure—not a fixed deposit.",
        ],
      },
      {
        h2: "What calculators assume",
        paragraphs: [
          "Most SIP calculators convert an annual expected return into a monthly rate and compound contributions. That is useful for planning ranges, but real NAVs bounce around. Treat outputs as scenarios, not promises.",
        ],
        bullets: [
          "Higher assumed return → higher projected corpus (sensitivity matters)",
          "Longer tenure → more contributions and more compounding time",
          "Step-ups increase contributions over time if you can afford them",
        ],
      },
      {
        h2: "Practical tips",
        paragraphs: [
          "Align SIP size with cash flow after emergency reserves and high-interest debt. Revisit amount yearly. Prefer understanding the risk of the underlying fund over chasing a single “best” projected number.",
        ],
      },
    ],
    relatedCalculators: [
      { href: "/calculators/investment/sip", title: "SIP Calculator" },
      { href: "/calculators/investment/step-up-sip", title: "Step-Up SIP" },
    ],
    relatedGuides: ["sip-vs-lump-sum", "sip-for-beginners"],
  },
  {
    slug: "sip-vs-lump-sum",
    title: "SIP vs lump sum",
    description:
      "When staggered investing and one-time investing differ—and how to compare them without false precision.",
    category: "Investing",
    readingMinutes: 5,
    lastUpdated: UPDATED,
    topicSlugs: ["sip", "mutual-funds"],
    sections: [
      {
        h2: "Different cash-flow problems",
        paragraphs: [
          "Lump sum asks: I have money now—what might it become? SIP asks: I earn monthly—what might steady investing become? Comparing them only makes sense when the total money at risk and timing are comparable.",
        ],
      },
      {
        h2: "Market path matters",
        paragraphs: [
          "In a steadily rising market, investing earlier (more lump sum) often wins on paper. In volatile or falling-then-rising paths, staggered buying can reduce regret. You cannot know the path in advance—so process and risk capacity matter more than a single back-test.",
        ],
      },
      {
        h2: "A sensible approach",
        paragraphs: [
          "If a windfall is large relative to your net worth, consider staging deployment while staying invested overall. If you mainly have salary surplus, SIP (optionally with step-up) is usually the natural fit.",
        ],
      },
    ],
    relatedCalculators: [
      { href: "/calculators/investment/sip", title: "SIP Calculator" },
      { href: "/calculators/investment/lump-sum", title: "Lump Sum" },
    ],
    relatedGuides: ["how-sip-works", "xirr-explained"],
  },
  {
    slug: "sip-for-beginners",
    title: "SIP for beginners",
    description:
      "A starter checklist for first-time SIP investors in India—goals, amount, risk and common mistakes.",
    category: "Investing",
    readingMinutes: 7,
    lastUpdated: UPDATED,
    topicSlugs: ["sip"],
    sections: [
      {
        h2: "Start with the goal, not the product",
        paragraphs: [
          "Write the goal (emergency buffer, house down payment, retirement), time horizon and monthly surplus. Only then pick a risk level. Short horizons usually need lower equity exposure.",
        ],
      },
      {
        h2: "Common beginner mistakes",
        paragraphs: [],
        bullets: [
          "Stopping SIPs after a short market dip",
          "Assuming calculator returns are guaranteed",
          "Ignoring expense ratios and tax on withdrawals",
          "Starting large SIPs before an emergency fund exists",
        ],
      },
      {
        h2: "A calm first setup",
        paragraphs: [
          "Automate a modest SIP you can sustain for years, review annually, and use calculators to explore “what if” ranges—not to chase a perfect forecast.",
        ],
      },
    ],
    relatedCalculators: [
      { href: "/calculators/investment/sip", title: "SIP Calculator" },
      { href: "/calculators/retirement/goal-planner", title: "Goal Planner" },
    ],
    relatedGuides: ["how-sip-works", "sip-taxation-basics"],
  },
  {
    slug: "sip-taxation-basics",
    title: "SIP taxation basics (illustrative)",
    description:
      "High-level overview of how equity-oriented mutual fund gains are often discussed—verify current Income Tax rules.",
    category: "Tax",
    readingMinutes: 5,
    lastUpdated: UPDATED,
    topicSlugs: ["sip", "income-tax"],
    sections: [
      {
        h2: "Important disclaimer",
        paragraphs: [
          "Tax law changes. Holding period definitions, rates and exemptions can differ by asset type and year. Use this only as a conceptual map; confirm with the Income Tax Department or a qualified professional for your case.",
        ],
      },
      {
        h2: "Gains vs contributions",
        paragraphs: [
          "You generally do not pay tax merely because a SIP instalment was invested. Tax discussions usually arise when you redeem units and realise gains (or when dividends are paid, depending on product and rules).",
        ],
      },
      {
        h2: "Using calculators carefully",
        paragraphs: [
          "Post-tax toggles on calculators are simplified illustrations (for example applying a stylised LTCG-style haircut). They are not full tax computations for every folio, slab or grandfathering rule.",
        ],
      },
    ],
    relatedCalculators: [
      { href: "/calculators/investment/sip", title: "SIP Calculator" },
      { href: "/calculators/taxation/capital-gains", title: "Capital Gains" },
    ],
    relatedGuides: ["how-sip-works"],
  },
  {
    slug: "xirr-explained",
    title: "XIRR explained",
    description:
      "Why XIRR is useful for irregular investments and how it differs from a simple annualised return.",
    category: "Investing",
    readingMinutes: 6,
    lastUpdated: UPDATED,
    topicSlugs: ["mutual-funds"],
    sections: [
      {
        h2: "The problem CAGR cannot solve",
        paragraphs: [
          "If you invest once and redeem once, CAGR is enough. Real portfolios have many SIPs, top-ups and partial withdrawals. XIRR finds an annualised rate that links all dated cash flows.",
        ],
      },
      {
        h2: "Sign convention",
        paragraphs: [
          "Investments are usually negative cash flows; redemptions/current value are positive (or vice versa—consistency matters). Wrong signs produce nonsense rates.",
        ],
      },
      {
        h2: "Limits",
        paragraphs: [
          "XIRR is a mathematical fit. It does not tell you whether risk was appropriate, and unusual cash-flow patterns can make interpretation harder.",
        ],
      },
    ],
    relatedCalculators: [
      { href: "/calculators/investment/xirr", title: "XIRR Calculator" },
    ],
    relatedGuides: ["how-sip-works", "how-swp-works"],
  },
  {
    slug: "how-swp-works",
    title: "How SWP works",
    description:
      "Systematic Withdrawal Plans for income from a corpus—what to model and what can go wrong.",
    category: "Investing",
    readingMinutes: 5,
    lastUpdated: UPDATED,
    topicSlugs: ["mutual-funds", "retirement"],
    sections: [
      {
        h2: "SWP in one line",
        paragraphs: [
          "An SWP redeems a fixed amount (or units) on a schedule so you receive cash while the remaining corpus stays invested.",
        ],
      },
      {
        h2: "Sequence risk",
        paragraphs: [
          "Withdrawing during a deep market fall can deplete units faster. Stress-test lower returns and higher withdrawals in a calculator before relying on an SWP for essential expenses.",
        ],
      },
    ],
    relatedCalculators: [
      { href: "/calculators/investment/swp", title: "SWP Calculator" },
      { href: "/calculators/retirement/fire", title: "FIRE Planner" },
    ],
    relatedGuides: ["how-to-plan-retirement-india"],
  },
  {
    slug: "how-emi-works",
    title: "How EMI works",
    description:
      "Reducing-balance EMI, interest vs principal split, and why tenure changes total cost.",
    category: "Loans",
    readingMinutes: 5,
    lastUpdated: UPDATED,
    topicSlugs: ["loans"],
    sections: [
      {
        h2: "Reducing balance in plain words",
        paragraphs: [
          "Each EMI pays interest on the outstanding principal, then reduces principal. Early EMIs are interest-heavy; later EMIs repay more principal.",
        ],
      },
      {
        h2: "EMI vs total interest",
        paragraphs: [
          "Cutting tenure usually raises EMI but can slash total interest. Lengthening tenure does the opposite. Affordability and total cost both matter.",
        ],
      },
    ],
    relatedCalculators: [
      { href: "/calculators/debt/emi", title: "EMI Calculator" },
      { href: "/calculators/debt/flat-vs-reducing", title: "Flat vs Reducing" },
    ],
    relatedGuides: ["loan-prepayment-strategies"],
  },
  {
    slug: "loan-prepayment-strategies",
    title: "Loan prepayment strategies",
    description:
      "Tenure cut vs EMI cut, lump-sum timing, and questions to ask before prepaying.",
    category: "Loans",
    readingMinutes: 6,
    lastUpdated: UPDATED,
    topicSlugs: ["loans"],
    sections: [
      {
        h2: "Two common choices after a prepayment",
        paragraphs: [
          "Lenders may let you reduce tenure (keep EMI) or reduce EMI (keep tenure). Tenure reduction usually saves more interest; EMI reduction improves monthly cash flow.",
        ],
      },
      {
        h2: "Before you prepay",
        paragraphs: [],
        bullets: [
          "Keep emergency cash—don’t prepay the last rupee",
          "Check fees and lock-in clauses in your loan agreement",
          "Compare loan rate with expected post-tax investment returns",
          "Model the exact month of the lump sum—timing changes savings",
        ],
      },
    ],
    relatedCalculators: [
      {
        href: "/calculators/debt/advanced-prepayment",
        title: "Advanced Prepayment",
      },
      { href: "/calculators/debt/tenure-vs-emi", title: "Tenure vs EMI" },
    ],
    relatedGuides: ["how-emi-works"],
  },
  {
    slug: "old-vs-new-tax-regime",
    title: "Old vs new tax regime — how to compare",
    description:
      "A practical way to compare regimes using your deductions—without treating a blog as tax law.",
    category: "Tax",
    readingMinutes: 6,
    lastUpdated: UPDATED,
    topicSlugs: ["income-tax"],
    sections: [
      {
        h2: "Compare with your numbers",
        paragraphs: [
          "Regime choice depends on income level and the deductions/exemptions you actually claim. A neighbour’s answer is not yours. Use a side-by-side calculator with current-year assumptions baked into the tool, and verify against official slabs.",
        ],
      },
      {
        h2: "Watch the moving parts",
        paragraphs: [
          "Standard deduction, surcharge, cess and eligible deductions can change by Finance Act. Re-run the comparison when rules or your salary structure change.",
        ],
      },
    ],
    relatedCalculators: [
      { href: "/calculators/taxation/income-tax", title: "Income Tax" },
      {
        href: "/calculators/taxation/take-home-salary",
        title: "Take-Home Salary",
      },
    ],
    relatedGuides: ["understanding-take-home-salary"],
  },
  {
    slug: "understanding-take-home-salary",
    title: "Understanding take-home salary",
    description:
      "Why CTC is not in-hand pay—EPF, professional tax, TDS and other common gaps.",
    category: "Tax",
    readingMinutes: 5,
    lastUpdated: UPDATED,
    topicSlugs: ["income-tax"],
    sections: [
      {
        h2: "CTC vs in-hand",
        paragraphs: [
          "Cost-to-company often includes employer contributions and benefits you do not see in the monthly credit. In-hand pay is after statutory and elected deductions.",
        ],
      },
      {
        h2: "Use estimates carefully",
        paragraphs: [
          "Take-home calculators approximate common building blocks. Your payslip may include variable pay, meal cards, or state-specific professional tax—adjust inputs accordingly.",
        ],
      },
    ],
    relatedCalculators: [
      {
        href: "/calculators/taxation/take-home-salary",
        title: "Take-Home Salary",
      },
      { href: "/calculators/government/epf", title: "EPF Calculator" },
    ],
    relatedGuides: ["old-vs-new-tax-regime"],
  },
  {
    slug: "how-to-plan-retirement-india",
    title: "How to plan retirement in India",
    description:
      "A simple framework: expenses, corpus, contributions, and stress tests—not product pitches.",
    category: "Retirement",
    readingMinutes: 8,
    lastUpdated: UPDATED,
    topicSlugs: ["retirement"],
    sections: [
      {
        h2: "Four numbers to estimate",
        paragraphs: [],
        bullets: [
          "Today’s monthly essential + lifestyle expenses",
          "Years until you stop earning (or reduce earning)",
          "Inflation assumption for expenses",
          "Withdrawal rate / years of retirement spending",
        ],
      },
      {
        h2: "Build the corpus target",
        paragraphs: [
          "A common illustration: annual retirement expenses ÷ withdrawal rate (for example 4% → multiply annual expenses by 25). Then work backwards to the SIP or savings rate required.",
        ],
      },
      {
        h2: "Layer accounts thoughtfully",
        paragraphs: [
          "EPF/PPF/NPS/taxable investments play different liquidity and tax roles. The mix is personal—calculators help size the gap; they do not choose products for you.",
        ],
      },
    ],
    relatedCalculators: [
      { href: "/calculators/retirement/fire", title: "FIRE Planner" },
      { href: "/calculators/retirement/goal-planner", title: "Goal Planner" },
      { href: "/calculators/government/nps", title: "NPS Calculator" },
    ],
    relatedGuides: ["what-is-fire", "nps-basics"],
  },
  {
    slug: "what-is-fire",
    title: "What is FIRE?",
    description:
      "Financial Independence, Retire Early—definitions, math, and why assumptions dominate outcomes.",
    category: "Retirement",
    readingMinutes: 5,
    lastUpdated: UPDATED,
    topicSlugs: ["retirement"],
    sections: [
      {
        h2: "The core idea",
        paragraphs: [
          "FIRE aims for a portfolio that can fund living expenses without traditional employment income. The popular shorthand links annual spend to a withdrawal-rate multiple.",
        ],
      },
      {
        h2: "India-specific caution",
        paragraphs: [
          "Healthcare costs, family responsibilities, and inflation can differ from Western FIRE blogs. Run conservative expense and longevity assumptions.",
        ],
      },
    ],
    relatedCalculators: [
      { href: "/calculators/retirement/fire", title: "FIRE Planner" },
    ],
    relatedGuides: ["how-to-plan-retirement-india"],
  },
  {
    slug: "ppf-basics",
    title: "PPF basics",
    description:
      "What PPF is for, how maturity illustrations work, and what to verify officially.",
    category: "Government schemes",
    readingMinutes: 5,
    lastUpdated: UPDATED,
    topicSlugs: ["ppf"],
    sections: [
      {
        h2: "Role in a portfolio",
        paragraphs: [
          "PPF is often used for long-term debt allocation with government backing. It is not a substitute for equity growth needs over multi-decade goals.",
        ],
      },
      {
        h2: "Verify before you act",
        paragraphs: [
          "Contribution limits, tenure, extensions and interest rates are notified by the government. Always confirm current rules on official channels; calculators need the rate you supply.",
        ],
      },
    ],
    relatedCalculators: [
      { href: "/calculators/government/ppf", title: "PPF Calculator" },
    ],
    relatedGuides: ["fd-vs-rd"],
  },
  {
    slug: "nps-basics",
    title: "NPS basics",
    description:
      "How to think about NPS contributions and corpus projections without treating them as guarantees.",
    category: "Government schemes",
    readingMinutes: 5,
    lastUpdated: UPDATED,
    topicSlugs: ["nps", "retirement"],
    sections: [
      {
        h2: "Market-linked pension building block",
        paragraphs: [
          "NPS returns depend on asset allocation and markets. Calculators project a corpus under assumed rates, then may illustrate an annuity split—check current PFRDA withdrawal rules separately.",
        ],
      },
    ],
    relatedCalculators: [
      { href: "/calculators/government/nps", title: "NPS Calculator" },
    ],
    relatedGuides: ["how-to-plan-retirement-india"],
  },
  {
    slug: "fd-vs-rd",
    title: "FD vs RD",
    description:
      "Fixed deposit vs recurring deposit—cash-flow fit, compounding, and how to compare quotes.",
    category: "Fixed income",
    readingMinutes: 4,
    lastUpdated: UPDATED,
    topicSlugs: ["fd-rd"],
    sections: [
      {
        h2: "Cash-flow difference",
        paragraphs: [
          "FD: invest a lump sum now. RD: invest fixed amounts on a schedule. Choose based on whether money is available upfront or monthly.",
        ],
      },
      {
        h2: "Compare apples to apples",
        paragraphs: [
          "Match tenure, compounding frequency and the exact quoted rate. Tax treatment can change effective return—check current rules for your situation.",
        ],
      },
    ],
    relatedCalculators: [
      { href: "/calculators/government/fd-rd", title: "FD / RD Calculator" },
    ],
    relatedGuides: ["ppf-basics"],
  },
];

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}

export function getGuidesByTopic(topicSlug: string): Guide[] {
  return GUIDES.filter((g) => g.topicSlugs?.includes(topicSlug));
}
