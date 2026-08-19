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
  {
    slug: "term-vs-traditional-life-cover",
    title: "Term cover vs traditional life plans",
    description:
      "How to think about pure protection versus bundled savings+insurance—without treating either as a tip.",
    category: "Insurance",
    readingMinutes: 6,
    lastUpdated: UPDATED,
    topicSlugs: ["insurance", "wealth-planning"],
    sections: [
      {
        h2: "Different jobs",
        paragraphs: [
          "Term life insurance mainly pays a sum assured if the insured dies during the term. Traditional/endowment-style plans often mix protection with a savings component. Mixing makes comparison harder because you are buying two products in one wrapper.",
        ],
      },
      {
        h2: "A practical framing",
        paragraphs: [
          "Many households separate: buy adequate pure term cover for dependents, invest surplus for goals. That is a framework—not a mandate. If you prefer a bundled plan, demand a clear illustration of premiums, guaranteed vs non-guaranteed benefits, and exit costs.",
        ],
      },
      {
        h2: "Verify officially",
        paragraphs: [
          "Premiums, riders, exclusions and claim processes are insurer-specific. Read the policy document; do not rely on marketing summaries.",
        ],
      },
    ],
    relatedCalculators: [
      {
        href: "/calculators/taxation/take-home-salary",
        title: "Take-Home Salary",
      },
      { href: "/calculators/retirement/goal-planner", title: "Goal Planner" },
    ],
    relatedGuides: ["how-much-life-cover", "emergency-fund-basics"],
  },
  {
    slug: "how-much-life-cover",
    title: "How much life cover? A simple framework",
    description:
      "Human-life-value style questions to size cover—expenses, goals, debts—without inventing a one-size multiple.",
    category: "Insurance",
    readingMinutes: 7,
    lastUpdated: UPDATED,
    topicSlugs: ["insurance"],
    sections: [
      {
        h2: "Start with dependents’ needs",
        paragraphs: [
          "Estimate years of income replacement, outstanding loans, and major goals (education, home) that should not collapse if you die. Subtract existing cover and liquid assets earmarked for the same purpose.",
        ],
      },
      {
        h2: "Income multiples are only a shortcut",
        paragraphs: [
          "Rules of thumb (for example “10× income”) ignore debt, spouse income, and lifestyle. Prefer a needs analysis, then sanity-check affordability of premiums against take-home pay.",
        ],
      },
      {
        h2: "Review when life changes",
        paragraphs: [
          "Marriage, children, home loans and career jumps change the right number. Revisit cover when those events happen—not only at policy anniversary marketing calls.",
        ],
      },
    ],
    relatedCalculators: [
      { href: "/calculators/debt/emi", title: "EMI Calculator" },
      { href: "/calculators/retirement/goal-planner", title: "Goal Planner" },
      {
        href: "/calculators/taxation/take-home-salary",
        title: "Take-Home Salary",
      },
    ],
    relatedGuides: ["term-vs-traditional-life-cover", "health-insurance-planning-basics"],
  },
  {
    slug: "health-insurance-planning-basics",
    title: "Health insurance planning basics",
    description:
      "What to clarify before buying or upgrading health cover—without quoting premiums you haven’t verified.",
    category: "Insurance",
    readingMinutes: 6,
    lastUpdated: UPDATED,
    topicSlugs: ["insurance", "wealth-planning"],
    sections: [
      {
        h2: "Cover catastrophic medical risk first",
        paragraphs: [
          "Health insurance is primarily about hospitalisation and large bills you cannot pay from an emergency fund. Room rent limits, disease waiting periods, co-pays and network hospitals matter as much as the headline sum insured.",
        ],
      },
      {
        h2: "Questions to ask",
        paragraphs: [],
        bullets: [
          "What is excluded or waiting-period limited?",
          "How do cashless claims work at nearby hospitals?",
          "Are there sub-limits that shrink real cover?",
          "How do premiums change with age (ask insurer for illustrations)?",
        ],
      },
      {
        h2: "Emergency fund still matters",
        paragraphs: [
          "Insurance does not replace a cash buffer for deductibles, non-covered care, or income pauses during illness.",
        ],
      },
    ],
    relatedCalculators: [
      {
        href: "/calculators/taxation/take-home-salary",
        title: "Take-Home Salary",
      },
    ],
    relatedGuides: ["emergency-fund-basics", "how-much-life-cover"],
  },
  {
    slug: "stocks-vs-mutual-funds",
    title: "Stocks vs mutual funds",
    description:
      "When direct equity and mutual funds differ in effort, diversification and behaviour risk.",
    category: "Stocks",
    readingMinutes: 6,
    lastUpdated: UPDATED,
    topicSlugs: ["stocks", "mutual-funds"],
    sections: [
      {
        h2: "Same market, different packaging",
        paragraphs: [
          "Both can give equity exposure. Mutual funds pool money and follow a mandate; individual stocks concentrate decisions on fewer companies. Concentration can help or hurt—there is no free lunch.",
        ],
      },
      {
        h2: "Effort and process",
        paragraphs: [
          "Stock picking needs research, monitoring and emotional control. Funds shift some of that work to a manager (for a fee). SIPs into diversified funds are popular because they automate behaviour—not because returns are guaranteed.",
        ],
      },
      {
        h2: "Measure honestly",
        paragraphs: [
          "Use XIRR for irregular buy/sell histories. Do not compare a favourite stock’s peak gain to a fund’s long-term SIP without matching cash-flow timing.",
        ],
      },
    ],
    relatedCalculators: [
      { href: "/calculators/investment/sip", title: "SIP Calculator" },
      { href: "/calculators/investment/xirr", title: "XIRR Calculator" },
    ],
    relatedGuides: ["equity-risk-basics", "diversification-basics", "xirr-explained"],
  },
  {
    slug: "equity-risk-basics",
    title: "Equity risk basics",
    description:
      "What equity volatility means for goals, timelines and sleep-at-night money.",
    category: "Stocks",
    readingMinutes: 5,
    lastUpdated: UPDATED,
    topicSlugs: ["stocks", "wealth-planning"],
    sections: [
      {
        h2: "Prices can fall for long periods",
        paragraphs: [
          "Equity markets have historically rewarded long holding periods in many countries—but past returns do not guarantee the future, and drawdowns can last years. Money needed soon usually should not be 100% equity.",
        ],
      },
      {
        h2: "Match risk to the goal date",
        paragraphs: [
          "A retirement corpus decades away can tolerate more volatility than next year’s tuition. If a 30–40% paper fall would force you to sell, your allocation is too aggressive for your temperament.",
        ],
      },
    ],
    relatedCalculators: [
      { href: "/calculators/investment/sip", title: "SIP Calculator" },
      { href: "/calculators/retirement/goal-planner", title: "Goal Planner" },
    ],
    relatedGuides: ["stocks-vs-mutual-funds", "asset-allocation-basics"],
  },
  {
    slug: "diversification-basics",
    title: "Diversification basics",
    description:
      "Why spreading risk across assets and holdings matters—and what diversification does not do.",
    category: "Stocks",
    readingMinutes: 5,
    lastUpdated: UPDATED,
    topicSlugs: ["stocks", "wealth-planning", "mutual-funds"],
    sections: [
      {
        h2: "Don’t confuse activity with diversification",
        paragraphs: [
          "Owning ten stocks in the same sector is not broad diversification. Owning multiple funds that hold the same large companies may also overlap. Look at underlying exposure, not just product count.",
        ],
      },
      {
        h2: "What it cannot do",
        paragraphs: [
          "Diversification reduces idiosyncratic risk; it does not eliminate market risk. In a broad crash, many assets can fall together.",
        ],
      },
    ],
    relatedCalculators: [
      { href: "/calculators/investment/xirr", title: "XIRR Calculator" },
    ],
    relatedGuides: ["equity-risk-basics", "asset-allocation-basics"],
  },
  {
    slug: "emergency-fund-basics",
    title: "Emergency fund basics",
    description:
      "How to think about cash buffers before aggressive investing or aggressive prepayment.",
    category: "Wealth planning",
    readingMinutes: 5,
    lastUpdated: UPDATED,
    topicSlugs: ["wealth-planning", "insurance"],
    sections: [
      {
        h2: "What it is for",
        paragraphs: [
          "An emergency fund covers job loss, urgent medical gaps, or essential repairs without forced selling of long-term investments or high-cost borrowing.",
        ],
      },
      {
        h2: "Sizing is personal",
        paragraphs: [
          "Common illustrations use a few months of essential expenses. Dual-income stable jobs may need less buffer than single-income variable income—judge your risk, not a social-media number.",
        ],
      },
      {
        h2: "Where to keep it",
        paragraphs: [
          "Prioritise liquidity and safety over return. Chasing yield with emergency money often defeats the purpose.",
        ],
      },
    ],
    relatedCalculators: [
      {
        href: "/calculators/taxation/take-home-salary",
        title: "Take-Home Salary",
      },
      { href: "/calculators/government/fd-rd", title: "FD / RD Calculator" },
    ],
    relatedGuides: ["asset-allocation-basics", "health-insurance-planning-basics"],
  },
  {
    slug: "asset-allocation-basics",
    title: "Asset allocation basics",
    description:
      "Splitting money across equity, debt and other buckets based on goals and risk—not tips.",
    category: "Wealth planning",
    readingMinutes: 7,
    lastUpdated: UPDATED,
    topicSlugs: ["wealth-planning", "stocks"],
    sections: [
      {
        h2: "Allocation beats product hopping",
        paragraphs: [
          "The mix of growth assets vs stability assets usually drives outcomes more than frequent scheme switches. Rebalance occasionally; avoid constant tinkering.",
        ],
      },
      {
        h2: "Map buckets to timelines",
        paragraphs: [],
        bullets: [
          "Near-term spending → higher safety/liquidity",
          "Medium goals → balanced mix",
          "Long goals → higher growth assets if you can hold through falls",
        ],
      },
      {
        h2: "Debt is part of the picture",
        paragraphs: [
          "High-interest loans can dominate “allocation” in practice. Sometimes prepaying is the highest risk-adjusted move—even if it is not labelled as an investment.",
        ],
      },
    ],
    relatedCalculators: [
      { href: "/calculators/investment/sip", title: "SIP Calculator" },
      { href: "/calculators/debt/advanced-prepayment", title: "Loan Prepayment" },
      { href: "/calculators/retirement/goal-planner", title: "Goal Planner" },
    ],
    relatedGuides: ["emergency-fund-basics", "equity-risk-basics", "net-worth-and-goals"],
  },
  {
    slug: "net-worth-and-goals",
    title: "Net worth and goal-based investing",
    description:
      "Use a simple net-worth snapshot to prioritise goals, debt and investing surplus.",
    category: "Wealth planning",
    readingMinutes: 6,
    lastUpdated: UPDATED,
    topicSlugs: ["wealth-planning"],
    sections: [
      {
        h2: "Net worth = assets − liabilities",
        paragraphs: [
          "List financial assets, important physical assets you would count, and all debts. The point is clarity—not a social score.",
        ],
      },
      {
        h2: "Goals turn the snapshot into a plan",
        paragraphs: [
          "Attach dates and amounts to goals, then use reverse-SIP / goal planners to estimate contributions. Update yearly when income or goals change.",
        ],
      },
    ],
    relatedCalculators: [
      { href: "/calculators/retirement/goal-planner", title: "Goal Planner" },
      { href: "/calculators/debt/emi", title: "EMI Calculator" },
      { href: "/calculators/retirement/fire", title: "FIRE Planner" },
      { href: "/calculators/investment/net-worth", title: "Net Worth" },
    ],
    relatedGuides: [
      "asset-allocation-basics",
      "how-to-plan-retirement-india",
      "goal-based-investing-basics",
    ],
  },
  {
    slug: "how-to-choose-sip-amount",
    title: "How to choose a SIP amount",
    description:
      "Pick a sustainable monthly SIP from surplus cash flow—after emergency reserves and high-interest debt—then stress-test returns.",
    category: "Investing",
    readingMinutes: 7,
    lastUpdated: UPDATED,
    topicSlugs: ["sip", "mutual-funds", "wealth-planning"],
    sections: [
      {
        h2: "Start from surplus, not from a headline corpus",
        paragraphs: [
          "A useful SIP is one you can continue through ordinary life events. Begin with take-home income, subtract essential expenses, minimum debt payments and a contribution toward an emergency fund. What remains is investable surplus—not the full surplus if you also need short-term sinking funds.",
          "Rules like “invest 20% of income” are only starting points. High rent, dependents or aggressive loan EMIs can make that unrealistic; low fixed costs can make it too timid.",
        ],
      },
      {
        h2: "Separate habit SIPs from goal SIPs",
        paragraphs: [
          "A habit SIP builds long-term wealth without a single deadline. A goal SIP is reverse-engineered from a target date and amount (house down payment, education, retirement milestone). Mixing both into one vague “₹X SIP” often underfunds the dated goal.",
        ],
        bullets: [
          "Habit SIP: sized to cash flow you can sustain for years",
          "Goal SIP: use Reverse SIP / Goal Planner, then check affordability",
          "Step-ups: raise only when income reliably rises",
        ],
      },
      {
        h2: "Stress-test before you lock the number",
        paragraphs: [
          "Run the same SIP at a lower assumed return and, for dated goals, with inflation. If the plan only “works” at an optimistic rate, increase contributions, extend the horizon, or lower the goal—don’t stretch risk just to make a calculator look green.",
        ],
      },
    ],
    relatedCalculators: [
      { href: "/calculators/investment/sip", title: "SIP Calculator" },
      { href: "/calculators/retirement/goal-planner", title: "Goal Planner" },
      { href: "/calculators/investment/step-up-sip", title: "Step-Up SIP" },
    ],
    relatedGuides: [
      "sip-for-beginners",
      "how-sip-works",
      "goal-based-investing-basics",
      "emergency-fund-basics",
    ],
  },
  {
    slug: "how-much-home-loan-can-i-afford",
    title: "How much home loan can I afford?",
    description:
      "Estimate loan size from income, existing EMIs and a FOIR-style EMI cap—then compare with the EMI for the property you want.",
    category: "Loans",
    readingMinutes: 8,
    lastUpdated: UPDATED,
    topicSlugs: ["loans"],
    sections: [
      {
        h2: "Affordability is capacity, not desire",
        paragraphs: [
          "Banks often look at a share of income that can go toward all EMIs (sometimes discussed as FOIR or similar internal limits), credit history and property rules. Online illustrations use transparent assumptions so you can see the math—they are not a sanction letter.",
          "Your personal affordability also includes emergency reserves, job stability and other goals. Passing a FOIR-style screen does not mean the EMI is comfortable every month.",
        ],
      },
      {
        h2: "A practical sequence",
        paragraphs: [
          "First estimate max loan from income and existing EMIs. Then compute EMI for the loan you actually need after down payment. If required EMI exceeds available capacity, options include a larger down payment, a smaller property, a longer tenure (usually more total interest), or waiting.",
        ],
        bullets: [
          "Use Loan Affordability for capacity",
          "Use Home Loan EMI for payment and interest totals",
          "Stress-test a higher rate and a shorter tenure you might prefer later",
        ],
      },
      {
        h2: "What this site does not claim",
        paragraphs: [
          "We do not publish bank-specific eligibility grids or promised rates. Re-run tools with the rate and FOIR your lender quotes, and verify fees, insurance and prepayment terms in the offer documents.",
        ],
      },
    ],
    relatedCalculators: [
      {
        href: "/calculators/debt/loan-affordability",
        title: "Loan Affordability",
      },
      { href: "/calculators/debt/home-loan-emi", title: "Home Loan EMI" },
      { href: "/calculators/debt/advanced-prepayment", title: "Loan Prepayment" },
    ],
    relatedGuides: [
      "how-emi-works",
      "home-loan-tenure-tradeoffs",
      "loan-prepayment-strategies",
    ],
  },
  {
    slug: "home-loan-tenure-tradeoffs",
    title: "Home loan tenure: EMI vs total interest",
    description:
      "Why a longer home-loan tenure lowers EMI but usually raises lifetime interest—and how to compare 20 vs 25 years honestly.",
    category: "Loans",
    readingMinutes: 6,
    lastUpdated: UPDATED,
    topicSlugs: ["loans"],
    sections: [
      {
        h2: "Two numbers that pull in opposite directions",
        paragraphs: [
          "For the same principal and interest rate, stretching tenure reduces monthly EMI and increases the number of interest-bearing months. Comfortable cash flow and minimum lifetime interest are different objectives—pick deliberately.",
        ],
      },
      {
        h2: "A useful comparison habit",
        paragraphs: [
          "Before accepting the longest tenure on offer, note EMI and total interest for a shorter tenure you could still pay. If the shorter EMI fits with a buffer, you may prefer it even if the longer EMI feels “easy.”",
          "Prepayments later can shorten an initially long tenure—but only if you actually make them. Do not rely on future discipline to justify an oversized loan today.",
        ],
      },
      {
        h2: "Assumptions to keep visible",
        paragraphs: [
          "Illustrations on this site use reducing-balance EMI math and exclude processing fees, insurance and floating-rate resets. When your lender’s schedule differs, trust the lender’s amortization for legal purposes and use our tools for education.",
        ],
      },
    ],
    relatedCalculators: [
      { href: "/calculators/debt/home-loan-emi", title: "Home Loan EMI" },
      { href: "/calculators/debt/tenure-vs-emi", title: "Tenure vs EMI" },
      { href: "/calculators/debt/advanced-prepayment", title: "Loan Prepayment" },
    ],
    relatedGuides: [
      "how-emi-works",
      "how-much-home-loan-can-i-afford",
      "loan-prepayment-strategies",
    ],
  },
  {
    slug: "how-much-retirement-corpus",
    title: "How much retirement corpus might you need?",
    description:
      "Translate monthly retirement expenses into a planning corpus using withdrawal-rate style assumptions—then reverse-solve the SIP.",
    category: "Retirement",
    readingMinutes: 8,
    lastUpdated: UPDATED,
    topicSlugs: ["retirement", "wealth-planning"],
    sections: [
      {
        h2: "Corpus is a bridge from expenses, not a round number",
        paragraphs: [
          "₹1 crore is a popular headline, but need depends on the lifestyle you fund, other pensions/rental income, longevity and healthcare. A clearer path is: estimate monthly expenses in today’s rupees → inflate to retirement → choose a planning withdrawal assumption → back into a corpus range.",
        ],
      },
      {
        h2: "Withdrawal-rate illustrations are assumptions",
        paragraphs: [
          "Common educational illustrations use roughly 3–4% of corpus per year as a starting withdrawal idea. That is not a guarantee of sustainability. Markets, sequence of returns, healthcare shocks and longevity can require a lower rate or a flexible spending plan.",
        ],
        bullets: [
          "Lower withdrawal rate → larger corpus needed for the same expense",
          "Higher assumed investment return while accumulating → lower SIP, more risk",
          "Always keep an emergency buffer separate from “invested forever” money",
        ],
      },
      {
        h2: "Connect corpus to contributions",
        paragraphs: [
          "Once you have a target range, use Goal Planner or Reverse SIP to estimate monthly investing. Revisit when income, family or the expense estimate changes—retirement planning is iterative, not a one-time calculator screenshot.",
        ],
      },
    ],
    relatedCalculators: [
      { href: "/calculators/retirement/fire", title: "FIRE Planner" },
      { href: "/calculators/retirement/goal-planner", title: "Goal Planner" },
      { href: "/calculators/retirement/reverse-sip", title: "Reverse SIP" },
      { href: "/calculators/investment/swp", title: "SWP Calculator" },
    ],
    relatedGuides: [
      "how-to-plan-retirement-india",
      "what-is-fire",
      "goal-based-investing-basics",
      "how-swp-works",
    ],
  },
  {
    slug: "goal-based-investing-basics",
    title: "Goal-based investing basics",
    description:
      "Attach dates and amounts to money goals, then use reverse-SIP style tools—without treating any single projection as a promise.",
    category: "Wealth planning",
    readingMinutes: 7,
    lastUpdated: UPDATED,
    topicSlugs: ["wealth-planning", "sip", "retirement"],
    sections: [
      {
        h2: "Goals need three inputs",
        paragraphs: [
          "A usable goal states what you are funding, roughly when you need the money, and an amount in today’s or future rupees. Vague goals (“be rich”, “secure future”) do not produce actionable SIPs.",
        ],
      },
      {
        h2: "Map each goal to a tool",
        paragraphs: [
          "Dated corpus goals → Goal Planner / Reverse SIP. Loan capacity → Affordability + EMI. Near-term safety → Emergency fund sizing. Retirement lifestyle → expense → corpus → SIP chain. Keep the mapping explicit so tools do not fight each other for the same rupee of surplus.",
        ],
      },
      {
        h2: "Prioritise before you optimise returns",
        paragraphs: [
          "High-interest debt and empty emergency reserves usually beat fine-tuning equity allocation. After the foundation, assign surplus across goals by deadline and importance—not by whichever calculator produced the largest number.",
        ],
      },
    ],
    relatedCalculators: [
      { href: "/calculators/retirement/goal-planner", title: "Goal Planner" },
      { href: "/calculators/investment/sip", title: "SIP Calculator" },
      {
        href: "/calculators/debt/loan-affordability",
        title: "Loan Affordability",
      },
      {
        href: "/calculators/retirement/emergency-fund",
        title: "Emergency Fund",
      },
    ],
    relatedGuides: [
      "how-to-choose-sip-amount",
      "emergency-fund-basics",
      "asset-allocation-basics",
      "net-worth-and-goals",
    ],
  },
];

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}

export function getGuidesByTopic(topicSlug: string): Guide[] {
  return GUIDES.filter((g) => g.topicSlugs?.includes(topicSlug));
}
