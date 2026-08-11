export type TopicLink = { href: string; title: string; blurb?: string };

export type TopicHub = {
  slug: string;
  title: string;
  h1: string;
  description: string;
  intro: string;
  calculators: TopicLink[];
  guideSlugs: string[];
  scenarioSlugs?: string[];
  glossaryTerms?: string[];
  faqs: { q: string; a: string }[];
};

export const TOPIC_HUBS: TopicHub[] = [
  {
    slug: "sip",
    title: "SIP",
    h1: "SIP investing in India — calculators, guides & examples",
    description:
      "Learn how SIPs work, compare step-up and lump sum, and run free SIP calculators with shareable scenarios.",
    intro:
      "A Systematic Investment Plan (SIP) invests a fixed amount at regular intervals—usually monthly—into mutual funds. Use the tools and guides below to estimate maturity, understand trade-offs, and plan with clear assumptions (not guarantees).",
    calculators: [
      {
        href: "/calculators/investment/sip",
        title: "SIP Calculator",
        blurb: "Monthly SIP maturity with optional inflation & tax views",
      },
      {
        href: "/calculators/investment/step-up-sip",
        title: "Step-Up SIP",
        blurb: "Model annual increase in SIP amount",
      },
      {
        href: "/calculators/investment/lump-sum",
        title: "Lump Sum",
        blurb: "One-time investment growth",
      },
      {
        href: "/calculators/investment/swp",
        title: "SWP Calculator",
        blurb: "Systematic withdrawals from a corpus",
      },
      {
        href: "/calculators/retirement/reverse-sip",
        title: "Reverse SIP",
        blurb: "Find SIP needed for a target corpus",
      },
    ],
    guideSlugs: [
      "how-sip-works",
      "sip-vs-lump-sum",
      "sip-for-beginners",
      "sip-taxation-basics",
    ],
    scenarioSlugs: [
      "5000-sip-for-10-years",
      "10000-sip-for-20-years",
      "20000-sip-for-15-years",
    ],
    glossaryTerms: ["sip", "nav", "cagr", "xirr", "ltcg"],
    faqs: [
      {
        q: "Is SIP return guaranteed?",
        a: "No. Market-linked SIPs can rise or fall. Calculators only project outcomes under the return rate you assume.",
      },
      {
        q: "What return should I assume?",
        a: "There is no correct single number. Many people stress-test with a range (for example illustrative 8–12% p.a.) and focus on contribution consistency rather than a precise forecast.",
      },
      {
        q: "Should I use step-up SIP?",
        a: "If your income is likely to rise and you can sustain higher contributions, an annual step-up often builds a larger corpus than a flat SIP—compare both tools before deciding.",
      },
    ],
  },
  {
    slug: "loans",
    title: "Loans & EMI",
    h1: "Loan EMI, prepayment & refinance tools",
    description:
      "Home, personal and car loan EMI calculators plus prepayment, refinance and rent-vs-buy analysis for India.",
    intro:
      "Debt decisions hinge on EMI affordability, interest cost and prepayment strategy. Start with an EMI estimate, then stress-test prepayments and refinance breakpoints.",
    calculators: [
      {
        href: "/calculators/debt/emi",
        title: "EMI Calculator",
        blurb: "Generic reducing-balance EMI",
      },
      {
        href: "/calculators/debt/home-loan-emi",
        title: "Home Loan EMI",
        blurb: "Defaults tuned for longer tenures",
      },
      {
        href: "/calculators/debt/personal-loan-emi",
        title: "Personal Loan EMI",
        blurb: "Shorter tenure, higher rate defaults",
      },
      {
        href: "/calculators/debt/car-loan-emi",
        title: "Car Loan EMI",
        blurb: "Auto loan EMI estimate",
      },
      {
        href: "/calculators/debt/advanced-prepayment",
        title: "Loan Prepayment",
        blurb: "Lump-sum prepay & EMI step-up",
      },
      {
        href: "/calculators/debt/refinance",
        title: "Refinance Analyzer",
        blurb: "Switching cost vs interest saved",
      },
      {
        href: "/calculators/debt/rent-vs-buy",
        title: "Rent vs Buy",
        blurb: "Housing opportunity-cost view",
      },
    ],
    guideSlugs: ["how-emi-works", "loan-prepayment-strategies"],
    glossaryTerms: ["emi", "reducing-balance", "flat-rate", "prepayment"],
    faqs: [
      {
        q: "Does a lower EMI always mean a cheaper loan?",
        a: "Not necessarily. Stretching tenure lowers EMI but usually raises total interest. Compare total interest and your cash-flow buffer.",
      },
      {
        q: "Should I prepay or invest?",
        a: "It depends on loan rate, tax benefits (if any), expected investment returns and emergency reserves. Run prepayment scenarios first, then decide with your full balance sheet.",
      },
    ],
  },
  {
    slug: "income-tax",
    title: "Income Tax",
    h1: "Income tax calculators & salary guides for India",
    description:
      "Old vs new regime comparison, take-home salary, HRA and capital gains tools with plain-language guides.",
    intro:
      "Tax tools here are illustrative for education. Always verify against the latest Income Tax Department rules for the assessment year you care about.",
    calculators: [
      {
        href: "/calculators/taxation/income-tax",
        title: "Income Tax Calculator",
        blurb: "Old vs new regime side-by-side",
      },
      {
        href: "/calculators/taxation/take-home-salary",
        title: "Take-Home Salary",
        blurb: "In-hand after common deductions",
      },
      {
        href: "/calculators/taxation/hra-exemption",
        title: "HRA Exemption",
        blurb: "Section 10(13A) style estimate",
      },
      {
        href: "/calculators/taxation/capital-gains",
        title: "Capital Gains",
        blurb: "STCG / LTCG style estimates",
      },
    ],
    guideSlugs: ["old-vs-new-tax-regime", "understanding-take-home-salary"],
    glossaryTerms: ["tds", "ltcg", "stcg", "80c"],
    faqs: [
      {
        q: "Which tax regime is better?",
        a: "It depends on your deductions and income mix. Use the side-by-side calculator with your own numbers rather than a rule of thumb.",
      },
    ],
  },
  {
    slug: "retirement",
    title: "Retirement",
    h1: "Retirement & FIRE planning tools",
    description:
      "FIRE planner, reverse SIP, child education funding and goal corpus planning for Indian households.",
    intro:
      "Retirement planning is about a target corpus, savings rate and withdrawal assumptions. Stress-test inflation and longevity—do not treat a single calculator output as advice.",
    calculators: [
      {
        href: "/calculators/retirement/fire",
        title: "FIRE Planner",
        blurb: "Early-retirement corpus estimate",
      },
      {
        href: "/calculators/retirement/goal-planner",
        title: "Goal Planner",
        blurb: "Corpus + SIP needed for a money goal",
      },
      {
        href: "/calculators/retirement/reverse-sip",
        title: "Reverse SIP",
        blurb: "SIP required for a target",
      },
      {
        href: "/calculators/retirement/child-education",
        title: "Child Education",
        blurb: "Education inflation planning",
      },
      {
        href: "/calculators/investment/swp",
        title: "SWP Calculator",
        blurb: "Withdrawal sustainability check",
      },
    ],
    guideSlugs: ["how-to-plan-retirement-india", "what-is-fire"],
    glossaryTerms: ["fire", "swr", "corpus", "inflation"],
    faqs: [
      {
        q: "What is a safe withdrawal rate?",
        a: "Common illustrations use ~3–4% of corpus per year, but suitability varies with markets, expenses and longevity. Treat it as a planning assumption, not a promise.",
      },
    ],
  },
  {
    slug: "ppf",
    title: "PPF",
    h1: "PPF calculator & guides",
    description:
      "Public Provident Fund maturity calculator with plain-language guides on tenure, limits and planning role.",
    intro:
      "PPF is a long-horizon government-backed savings scheme. Use the calculator for illustrations; confirm the latest interest rate and contribution rules from official sources before investing.",
    calculators: [
      {
        href: "/calculators/government/ppf",
        title: "PPF Calculator",
        blurb: "Maturity & contribution schedule",
      },
      {
        href: "/calculators/government/epf",
        title: "EPF Calculator",
        blurb: "Employee Provident Fund projection",
      },
      {
        href: "/calculators/government/ssy",
        title: "SSY Calculator",
        blurb: "Sukanya Samriddhi Yojana",
      },
    ],
    guideSlugs: ["ppf-basics"],
    glossaryTerms: ["ppf", "epf", "80c"],
    faqs: [
      {
        q: "Is PPF interest fixed forever?",
        a: "No. The applicable rate is set by the government and can change. Calculators should use the rate you enter for illustration.",
      },
    ],
  },
  {
    slug: "nps",
    title: "NPS",
    h1: "NPS calculator & retirement corpus guides",
    description:
      "National Pension System corpus estimates and guides on how NPS fits a retirement stack.",
    intro:
      "NPS blends market-linked returns with retirement withdrawal rules. Projections depend on contribution, allocation and assumed returns—verify current PFRDA rules separately.",
    calculators: [
      {
        href: "/calculators/government/nps",
        title: "NPS Calculator",
        blurb: "Corpus & annuity split illustration",
      },
      {
        href: "/calculators/retirement/fire",
        title: "FIRE Planner",
        blurb: "Overall retirement target",
      },
    ],
    guideSlugs: ["nps-basics"],
    glossaryTerms: ["nps", "annuity", "corpus"],
    faqs: [
      {
        q: "Is NPS the same as EPF?",
        a: "No. EPF is typically employment-linked with administered rates; NPS is a voluntary/contribution-based pension system with market-linked returns and different withdrawal rules.",
      },
    ],
  },
  {
    slug: "mutual-funds",
    title: "Mutual Funds",
    h1: "Mutual fund calculators — SIP, SWP, XIRR",
    description:
      "Tools to estimate SIP/SWP outcomes and measure true portfolio returns with XIRR.",
    intro:
      "Mutual fund outcomes depend on NAV path, costs and taxes. These calculators help you model assumptions and measure historical cash-flow returns—not pick schemes.",
    calculators: [
      {
        href: "/calculators/investment/sip",
        title: "SIP Calculator",
      },
      {
        href: "/calculators/investment/swp",
        title: "SWP Calculator",
      },
      {
        href: "/calculators/investment/xirr",
        title: "XIRR Calculator",
      },
      {
        href: "/calculators/investment/lump-sum",
        title: "Lump Sum Calculator",
      },
    ],
    guideSlugs: ["how-sip-works", "xirr-explained", "how-swp-works"],
    glossaryTerms: ["nav", "xirr", "cagr", "expense-ratio"],
    faqs: [
      {
        q: "Why is XIRR different from CAGR?",
        a: "CAGR fits a single start and end value. XIRR accounts for multiple contributions and withdrawals on different dates—usually closer to lived portfolio experience.",
      },
    ],
  },
  {
    slug: "fd-rd",
    title: "FD & RD",
    h1: "FD / RD calculators & fixed-income basics",
    description:
      "Bank FD and RD maturity estimates plus related post-office scheme tools.",
    intro:
      "Fixed deposits and recurring deposits offer more predictable returns than equity—but rates, compounding frequency and tax treatment still matter. Enter the rate your bank quotes.",
    calculators: [
      {
        href: "/calculators/government/fd-rd",
        title: "FD / RD Calculator",
      },
      {
        href: "/calculators/government/post-office",
        title: "Post Office Schemes",
      },
      {
        href: "/calculators/government/ppf",
        title: "PPF Calculator",
      },
    ],
    guideSlugs: ["fd-vs-rd"],
    glossaryTerms: ["fd", "rd", "compounding"],
    faqs: [
      {
        q: "Is FD interest tax-free?",
        a: "Generally no for most resident individuals—interest is typically taxable as per your slab (check current rules and TDS thresholds). This site does not replace tax advice.",
      },
    ],
  },
];

export function getTopic(slug: string): TopicHub | undefined {
  return TOPIC_HUBS.find((t) => t.slug === slug);
}
