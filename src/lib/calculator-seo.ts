export type FaqItem = { q: string; a: string };

export type RelatedRef = { category: string; slug: string; title: string };

export type CalculatorSeo = {
  /** Flat SEO slug alias, e.g. sip-calculator */
  seoSlug: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  howToUse: string[];
  formula: string;
  example: string;
  factors: string[];
  faqs: FaqItem[];
  related: RelatedRef[];
  lastUpdated: string;
};

const UPDATED = "August 2026";

export const CALCULATOR_SEO: Record<string, CalculatorSeo> = {
  "investment/sip": {
    seoSlug: "sip-calculator",
    metaTitle: "SIP Calculator – Calculate SIP Returns & Maturity | Aaru Wealth",
    metaDescription:
      "Calculate SIP returns, invested amount and estimated maturity value. Adjust monthly investment, return and duration instantly. Free SIP calculator for India.",
    intro:
      "A Systematic Investment Plan (SIP) invests a fixed amount at regular intervals. This calculator estimates maturity value, total invested and wealth gained using monthly compounding — with optional inflation and post-tax views.",
    howToUse: [
      "Enter your monthly SIP amount in rupees.",
      "Set expected annual return (illustrative; not guaranteed).",
      "Choose the investment period in years.",
      "Optionally adjust for inflation or show an equity LTCG-style post-tax estimate.",
      "Share the URL to keep the exact scenario.",
    ],
    formula:
      "Maturity ≈ P × [((1+r)^n − 1) / r] × (1+r), where P is monthly investment, r is monthly rate (annual÷12÷100), and n is number of months. Step-up SIPs increase P each year.",
    example:
      "₹10,000/month for 15 years at 12% p.a. grows to a much larger corpus than the ₹18 lakh invested — returns depend entirely on assumed rate.",
    factors: [
      "Expected return assumption",
      "Investment duration",
      "Step-up percentage (if any)",
      "Inflation (for real purchasing power)",
      "Taxes and exit loads (simplified in post-tax toggle)",
    ],
    faqs: [
      {
        q: "What is a SIP calculator?",
        a: "It estimates the future value of regular investments under an assumed return rate. It does not predict markets or guarantee outcomes.",
      },
      {
        q: "How is SIP maturity calculated?",
        a: "We use a standard future-value of annuity model with monthly compounding. Actual mutual fund units and NAVs differ day to day.",
      },
      {
        q: "What return should I enter in a SIP calculator?",
        a: "Use a conservative range based on the asset class and your own research — not a single optimistic number. Equity outcomes vary widely year to year.",
      },
      {
        q: "Is SIP return guaranteed?",
        a: "No. Market-linked SIPs can fluctuate. The calculator only projects outcomes under the return you assume.",
      },
      {
        q: "How much SIP is required for ₹1 crore?",
        a: "It depends on tenure and assumed return. Try the Reverse SIP / Goal Planner tools, or our ₹1 crore scenario pages under the SIP topic hub.",
      },
      {
        q: "Can I include inflation in a SIP calculation?",
        a: "Yes — use the inflation toggle where available to view approximate purchasing power of the projected corpus.",
      },
      {
        q: "What happens if I increase my SIP every year?",
        a: "Use the Step-Up SIP calculator for an annual percentage increase. Higher contributions usually raise both invested amount and projected corpus.",
      },
      {
        q: "Does this include expense ratios?",
        a: "No. Enter a net expected return after expenses if you want a more conservative estimate.",
      },
    ],
    related: [
      { category: "investment", slug: "step-up-sip", title: "Step-Up SIP" },
      { category: "investment", slug: "lump-sum", title: "Lump Sum" },
      { category: "investment", slug: "swp", title: "SWP Calculator" },
      { category: "retirement", slug: "reverse-sip", title: "Reverse SIP" },
      { category: "retirement", slug: "fire", title: "FIRE Planner" },
    ],
    lastUpdated: UPDATED,
  },
  "investment/step-up-sip": {
    seoSlug: "step-up-sip-calculator",
    metaTitle: "Step-Up SIP Calculator – Annual Increase SIP | Aaru Wealth",
    metaDescription:
      "Model SIPs that rise every year. Estimate maturity with annual step-up %, return and tenure. Free step-up SIP calculator for India.",
    intro:
      "A step-up SIP increases your contribution periodically (usually yearly). This often matches rising income and can meaningfully raise long-term corpus versus a flat SIP.",
    howToUse: [
      "Enter starting monthly SIP.",
      "Set expected return and years.",
      "Choose annual step-up percentage.",
      "Compare with a flat SIP using the related SIP calculator.",
    ],
    formula:
      "Each year the monthly SIP becomes P × (1+s)^y where s is step-up rate. Month-by-month FV compounds at monthly rate r.",
    example:
      "Starting ₹10,000 with 10% annual step-up for 15 years at 12% typically invests and compounds more than a flat ₹10,000 SIP.",
    factors: [
      "Starting SIP amount",
      "Step-up rate and frequency",
      "Return assumption",
      "Ability to sustain higher contributions",
    ],
    faqs: [
      {
        q: "What is a good step-up rate?",
        a: "Many planners use 5–15% aligned with expected salary growth. Use what you can realistically afford.",
      },
      {
        q: "Can I pause step-ups?",
        a: "In practice yes. This tool assumes a constant annual step-up for projection simplicity.",
      },
    ],
    related: [
      { category: "investment", slug: "sip", title: "SIP Calculator" },
      { category: "investment", slug: "lump-sum", title: "Lump Sum" },
      { category: "retirement", slug: "reverse-sip", title: "Reverse SIP" },
    ],
    lastUpdated: UPDATED,
  },
  "investment/lump-sum": {
    seoSlug: "lumpsum-calculator",
    metaTitle: "Lump Sum Calculator – One-Time Investment Returns | Aaru Wealth",
    metaDescription:
      "Estimate growth of a one-time investment with expected return and tenure. Optional inflation and post-tax views.",
    intro:
      "A lump-sum investment places capital once and lets it compound. Compare with SIP when you have a large amount available today.",
    howToUse: [
      "Enter principal amount.",
      "Set expected annual return and years.",
      "Toggle inflation or post-tax if needed.",
    ],
    formula: "FV = PV × (1 + R)^t where R is annual rate and t is years.",
    example:
      "₹5 lakh at 12% for 10 years roughly doubles more than once under annual compounding — actual market returns vary.",
    factors: ["Return rate", "Time horizon", "Taxes", "Inflation"],
    faqs: [
      {
        q: "SIP or lump sum — which is better?",
        a: "Depends on cash flow and market timing risk. SIPs average purchase price over time; lump sums invest immediately.",
      },
    ],
    related: [
      { category: "investment", slug: "sip", title: "SIP Calculator" },
      { category: "investment", slug: "xirr", title: "XIRR Calculator" },
    ],
    lastUpdated: UPDATED,
  },
  "investment/swp": {
    seoSlug: "swp-calculator",
    metaTitle: "SWP Calculator – Systematic Withdrawal Plan | Aaru Wealth",
    metaDescription:
      "See how long a corpus lasts with monthly withdrawals and assumed returns. Free SWP calculator for India.",
    intro:
      "A Systematic Withdrawal Plan (SWP) draws a fixed amount regularly from a corpus while the remainder stays invested.",
    howToUse: [
      "Enter starting corpus and monthly withdrawal.",
      "Set expected return and horizon.",
      "Check whether the corpus depletes within the period.",
    ],
    formula:
      "Each month: balance grows by (1+r), then withdrawal is deducted. Sequence of returns can change real outcomes.",
    example:
      "A large corpus with modest withdrawals may last decades at assumed returns; high withdrawals can deplete early.",
    factors: ["Withdrawal rate", "Return assumption", "Sequence of returns", "Inflation of expenses"],
    faqs: [
      {
        q: "Is SWP safe in retirement?",
        a: "It depends on withdrawal rate and markets. Stress-test lower returns and higher withdrawals.",
      },
    ],
    related: [
      { category: "retirement", slug: "fire", title: "FIRE Planner" },
      { category: "investment", slug: "sip", title: "SIP Calculator" },
    ],
    lastUpdated: UPDATED,
  },
  "investment/xirr": {
    seoSlug: "xirr-calculator",
    metaTitle: "XIRR Calculator – Irregular Cash Flow Returns | Aaru Wealth",
    metaDescription:
      "Compute XIRR for irregular investments and redemptions using Newton-Raphson. Free online XIRR calculator.",
    intro:
      "XIRR is the annualised return for cash flows on different dates — useful for SIPs, STPs and lumpy investments.",
    howToUse: [
      "Add each cash flow with date and amount.",
      "Use negative amounts for investments and positive for redemptions or current value.",
      "Read the annualised XIRR when the solver converges.",
    ],
    formula:
      "Find rate r such that Σ CF_i / (1+r)^(t_i) = 0, solved numerically (Newton-Raphson with bisection fallback).",
    example:
      "Invest −₹1,00,000, later −₹50,000, then redeem ₹2,00,000 — XIRR reflects timing, not just simple profit %.",
    factors: ["Cash flow amounts", "Exact dates", "Missing flows", "Fees not entered"],
    faqs: [
      {
        q: "Why did XIRR not converge?",
        a: "You need at least one inflow and one outflow. Check dates and signs.",
      },
    ],
    related: [
      { category: "investment", slug: "sip", title: "SIP Calculator" },
      { category: "investment", slug: "lump-sum", title: "Lump Sum" },
    ],
    lastUpdated: UPDATED,
  },
  "debt/emi": {
    seoSlug: "emi-calculator",
    metaTitle: "EMI Calculator – Home, Car & Personal Loan EMI | Aaru Wealth",
    metaDescription:
      "Calculate monthly EMI, total interest and amortisation for reducing-balance loans in India.",
    intro:
      "EMI (Equated Monthly Instalment) keeps monthly payments constant while the interest–principal mix changes over the tenure.",
    howToUse: [
      "Enter loan amount, annual interest rate and tenure in years.",
      "Review EMI, total interest and the amortisation schedule.",
    ],
    formula:
      "EMI = P × r × (1+r)^n / ((1+r)^n − 1), where r is monthly rate and n is months.",
    example:
      "A ₹50 lakh loan at 8.5% for 20 years has a fixed EMI; early EMIs are interest-heavy.",
    factors: ["Principal", "Interest rate", "Tenure", "Prepayments"],
    faqs: [
      {
        q: "Does this work for home loans?",
        a: "Yes for standard reducing-balance floating/fixed retail loans. Fees and resets are not modelled.",
      },
      {
        q: "Flat rate vs reducing?",
        a: "Use the Flat vs Reducing calculator — flat quotes can look cheaper but cost more.",
      },
    ],
    related: [
      { category: "debt", slug: "home-loan-emi", title: "Home Loan EMI" },
      { category: "debt", slug: "advanced-prepayment", title: "Advanced Prepayment" },
      { category: "debt", slug: "flat-vs-reducing", title: "Flat vs Reducing" },
      { category: "debt", slug: "refinance", title: "Refinance Analyzer" },
    ],
    lastUpdated: UPDATED,
  },
  "debt/home-loan-emi": {
    seoSlug: "home-loan-emi-calculator",
    metaTitle: "Home Loan EMI Calculator – Housing Loan EMI India | Aaru Wealth",
    metaDescription:
      "Calculate home loan EMI, total interest and amortisation. Adjust loan amount, rate and tenure. Free housing loan EMI calculator.",
    intro:
      "Home loans typically run longer tenures than personal loans. This calculator uses reducing-balance EMI math with housing-oriented defaults—edit to match your sanction letter.",
    howToUse: [
      "Enter loan amount, interest rate and tenure in years.",
      "Review EMI, total interest and the monthly schedule.",
      "Explore prepayment scenarios with the Loan Prepayment calculator.",
    ],
    formula:
      "EMI = P × r × (1+r)^n / ((1+r)^n − 1), where r is monthly rate and n is months.",
    example:
      "A ₹50 lakh home loan at 8.5% for 20 years has a fixed EMI; early payments are interest-heavy.",
    factors: ["Principal", "Rate", "Tenure", "Prepayments", "Fees (not modelled)"],
    faqs: [
      {
        q: "How is home loan EMI calculated?",
        a: "Using the standard reducing-balance formula: EMI = P × r × (1+r)^n / ((1+r)^n − 1), with r as monthly rate and n as months.",
      },
      {
        q: "What happens if the interest rate increases?",
        a: "On floating-rate loans, EMI or tenure may reset per lender policy. Re-run this calculator with the new rate to see the impact.",
      },
      {
        q: "Should I reduce EMI or tenure after prepayment?",
        a: "Reducing tenure usually saves more interest; reducing EMI frees cash flow. Compare both with the Loan Prepayment calculator.",
      },
      {
        q: "How much loan can I afford?",
        a: "Start from a sustainable EMI (often framed as a share of take-home pay), then solve for principal — lenders also apply their own eligibility rules.",
      },
      {
        q: "Does longer tenure reduce EMI?",
        a: "Yes, EMI falls as tenure rises, but total interest usually rises. Balance affordability against lifetime interest cost.",
      },
      {
        q: "Does this include processing fees?",
        a: "No. Add fees separately when comparing lender offers.",
      },
      {
        q: "Floating vs fixed rate?",
        a: "The math is the same for a given rate. Floating rates can change later—re-run when your rate resets.",
      },
    ],
    related: [
      { category: "debt", slug: "emi", title: "EMI Calculator" },
      { category: "debt", slug: "advanced-prepayment", title: "Advanced Prepayment" },
      { category: "debt", slug: "rent-vs-buy", title: "Rent vs Buy" },
    ],
    lastUpdated: UPDATED,
  },
  "debt/personal-loan-emi": {
    seoSlug: "personal-loan-emi-calculator",
    metaTitle: "Personal Loan EMI Calculator | Aaru Wealth",
    metaDescription:
      "Estimate personal loan EMI and total interest with shorter-tenure defaults. Free personal loan EMI calculator for India.",
    intro:
      "Personal loans usually carry higher rates and shorter tenures than home loans. Use this page for a quick reducing-balance EMI estimate.",
    howToUse: [
      "Enter principal, rate and tenure.",
      "Check EMI affordability against your monthly surplus.",
    ],
    formula:
      "EMI = P × r × (1+r)^n / ((1+r)^n − 1), where r is monthly rate and n is months.",
    example:
      "A ₹5 lakh personal loan at 14% for 4 years has a higher EMI share of interest early on.",
    factors: ["Rate", "Tenure", "Fees", "Foreclosure charges"],
    faqs: [
      {
        q: "Why is my quoted EMI different?",
        a: "Lenders may include insurance, fees or different day-count conventions. Treat this as an estimate.",
      },
    ],
    related: [
      { category: "debt", slug: "emi", title: "EMI Calculator" },
      { category: "debt", slug: "flat-vs-reducing", title: "Flat vs Reducing" },
    ],
    lastUpdated: UPDATED,
  },
  "debt/car-loan-emi": {
    seoSlug: "car-loan-emi-calculator",
    metaTitle: "Car Loan EMI Calculator | Aaru Wealth",
    metaDescription:
      "Calculate car loan EMI, total interest and payment breakup. Free auto loan EMI calculator for India.",
    intro:
      "Car loans often sit between personal and home loans on tenure. Adjust amount, rate and years to match your dealer/bank quote.",
    howToUse: [
      "Enter on-road funding need, rate and tenure.",
      "Compare total interest before choosing a longer tenure for a lower EMI.",
    ],
    formula:
      "EMI = P × r × (1+r)^n / ((1+r)^n − 1), where r is monthly rate and n is months.",
    example:
      "An ₹8 lakh car loan at 10% for 5 years shows EMI and total interest instantly.",
    factors: ["Down payment", "Rate", "Tenure", "Insurance add-ons"],
    faqs: [
      {
        q: "Should I take a longer car loan?",
        a: "Lower EMI can cost more interest and leave you owing after the car depreciates. Compare total payment, not only EMI.",
      },
    ],
    related: [
      { category: "debt", slug: "emi", title: "EMI Calculator" },
      { category: "debt", slug: "personal-loan-emi", title: "Personal Loan EMI" },
    ],
    lastUpdated: UPDATED,
  },
  "debt/advanced-prepayment": {
    seoSlug: "loan-prepayment-calculator",
    metaTitle: "Loan Prepayment Calculator – Save Interest Faster | Aaru Wealth",
    metaDescription:
      "Model lump-sum prepayments and EMI step-ups. See months saved and interest saved versus baseline.",
    intro:
      "Prepaying a reducing-balance loan can cut interest and tenure. This tool lets you place lump sums in specific months and optionally raise EMI annually.",
    howToUse: [
      "Enter loan basics.",
      "Add one or more prepayment month/amount pairs.",
      "Optionally set annual EMI step-up %.",
      "Compare interest saved versus no-prepayment baseline.",
    ],
    formula:
      "Month-by-month amortisation: interest = balance × monthly rate; principal = EMI − interest; prepayments reduce balance further.",
    example:
      "A mid-tenure ₹5 lakh prepayment can save years of interest if EMI is kept constant (tenure reduction).",
    factors: ["Prepayment timing", "Amount", "EMI step-ups", "Rate"],
    faqs: [
      {
        q: "Should I reduce EMI or tenure?",
        a: "Tenure reduction usually saves more interest. Compare with the Tenure vs EMI tool.",
      },
    ],
    related: [
      { category: "debt", slug: "emi", title: "EMI Calculator" },
      { category: "debt", slug: "tenure-vs-emi", title: "Tenure vs EMI" },
    ],
    lastUpdated: UPDATED,
  },
  "debt/tenure-vs-emi": {
    seoSlug: "tenure-vs-emi-calculator",
    metaTitle: "Tenure vs EMI Reduction Calculator | Aaru Wealth",
    metaDescription:
      "Compare the same prepayment used to cut tenure versus cut EMI — side-by-side interest impact.",
    intro:
      "The same prepayment can either shorten the loan or lower the EMI. Interest savings differ — this page compares both strategies.",
    howToUse: [
      "Enter loan details and a prepayment month/amount.",
      "Compare tenure-cut vs EMI-cut interest totals.",
    ],
    formula: "Two amortisation runs with prepaymentMode = tenure vs emi.",
    example: "Large early prepayments usually favour tenure reduction for maximum interest saved.",
    factors: ["Cash-flow need for lower EMI", "Interest savings goal"],
    faqs: [
      {
        q: "Which strategy is better?",
        a: "If you can afford the current EMI, reducing tenure typically saves more interest.",
      },
    ],
    related: [
      { category: "debt", slug: "advanced-prepayment", title: "Advanced Prepayment" },
      { category: "debt", slug: "emi", title: "EMI Calculator" },
    ],
    lastUpdated: UPDATED,
  },
  "debt/refinance": {
    seoSlug: "refinance-calculator",
    metaTitle: "Loan Refinance Calculator – Balance Transfer Analysis | Aaru Wealth",
    metaDescription:
      "Compare current vs new loan rates, fees and break-even months for a refinance or balance transfer.",
    intro:
      "Refinancing can lower EMI or interest — but processing fees matter. This analyser estimates net savings and break-even.",
    howToUse: [
      "Enter outstanding principal, current rate and remaining tenure.",
      "Enter new rate, new tenure and fee %.",
      "Review net savings and break-even months.",
    ],
    formula: "Compare total interest paths minus fees; break-even ≈ fees ÷ monthly EMI saving.",
    example: "A 1% rate cut may help only if you stay long enough to recover fees.",
    factors: ["Fee drag", "Remaining tenure", "Rate differential"],
    faqs: [
      {
        q: "Are foreclosure charges included?",
        a: "Model them inside fee inputs. Confirm with your lender.",
      },
    ],
    related: [
      { category: "debt", slug: "emi", title: "EMI Calculator" },
      { category: "debt", slug: "advanced-prepayment", title: "Advanced Prepayment" },
    ],
    lastUpdated: UPDATED,
  },
  "debt/flat-vs-reducing": {
    seoSlug: "flat-vs-reducing-calculator",
    metaTitle: "Flat vs Reducing Rate Calculator | Aaru Wealth",
    metaDescription:
      "Unmask flat interest quotes by comparing with reducing-balance equivalents and true cost.",
    intro:
      "Flat-rate loans charge interest on the full principal for the entire tenure. Reducing-balance interest applies only on outstanding principal — often cheaper for the same quoted %.",
    howToUse: [
      "Enter principal, quoted flat rate and tenure.",
      "Compare flat EMI/interest with reducing-balance and equivalent reducing rate.",
    ],
    formula: "Flat interest = P × flat% × years; EMI = (P + interest) / months. Equivalent reducing rate solved to match flat EMI.",
    example: "A 12% flat personal loan can resemble a much higher reducing rate.",
    factors: ["Quoted rate type", "Tenure", "Fees"],
    faqs: [
      {
        q: "Why do dealers quote flat rates?",
        a: "Flat rates look lower. Always ask for reducing-balance / IRR equivalents.",
      },
    ],
    related: [
      { category: "debt", slug: "emi", title: "EMI Calculator" },
    ],
    lastUpdated: UPDATED,
  },
  "debt/rent-vs-buy": {
    seoSlug: "rent-vs-buy-calculator",
    metaTitle: "Rent vs Buy Calculator India | Aaru Wealth",
    metaDescription:
      "Compare buying with a home loan versus renting and investing the difference — Indian context.",
    intro:
      "Rent vs buy is not only EMI vs rent. Opportunity cost of down payment, appreciation, rent inflation and investment returns matter.",
    howToUse: [
      "Enter home price, down payment, loan rate, rent and horizon.",
      "Compare buy net worth vs rent+invest portfolio.",
    ],
    formula: "Heuristic NPV-style comparison of home equity path vs invested surplus while renting.",
    example: "High rent inflation can favour buying; high investment returns can favour renting longer.",
    factors: ["Appreciation", "Rent inflation", "Investment return", "Loan rate"],
    faqs: [
      {
        q: "Does this include stamp duty?",
        a: "Not explicitly — fold purchase costs into price/down payment for a stricter buy case.",
      },
    ],
    related: [
      { category: "debt", slug: "emi", title: "EMI Calculator" },
      { category: "investment", slug: "sip", title: "SIP Calculator" },
    ],
    lastUpdated: UPDATED,
  },
  "retirement/fire": {
    seoSlug: "fire-calculator",
    metaTitle: "FIRE Calculator India – Retire Early Planner | Aaru Wealth",
    metaDescription:
      "Estimate FIRE target corpus from expenses, safe withdrawal rate and retirement age. Plan required SIP.",
    intro:
      "Financial Independence, Retire Early (FIRE) targets a corpus that can fund expenses via a safe withdrawal rate. Default retirement age here is 42 — adjust to your plan.",
    howToUse: [
      "Enter current age, target retirement age and monthly expenses.",
      "Set SWR, current corpus, return and inflation.",
      "Review target corpus, gap and required monthly SIP.",
    ],
    formula: "Target corpus ≈ annual expenses at retirement ÷ (SWR/100). Gap funded via reverse SIP.",
    example: "₹50,000 monthly expenses today inflated to retirement at 6%, with 4% SWR, needs a large corpus.",
    factors: ["Expenses", "Inflation", "SWR", "Returns", "Years to retirement"],
    faqs: [
      {
        q: "Is 4% SWR safe in India?",
        a: "It is a planning heuristic from global studies — not a guarantee. Stress-test 3–3.5% for longevity.",
      },
    ],
    related: [
      { category: "retirement", slug: "goal-planner", title: "Goal Planner" },
      { category: "retirement", slug: "reverse-sip", title: "Reverse SIP" },
      { category: "investment", slug: "swp", title: "SWP Calculator" },
      { category: "investment", slug: "sip", title: "SIP Calculator" },
    ],
    lastUpdated: UPDATED,
  },
  "retirement/goal-planner": {
    seoSlug: "goal-planner",
    metaTitle: "Goal Planner – SIP Needed for Target Corpus | Aaru Wealth",
    metaDescription:
      "Plan any money goal: enter target corpus and timeline to estimate required SIP, then stress-test a what-if contribution.",
    intro:
      "The Goal Planner reverse-solves the monthly SIP needed for a target corpus (after optional current savings), and compares a what-if SIP path against the goal.",
    howToUse: [
      "Enter target corpus, years and expected return.",
      "Optionally subtract money already saved.",
      "Read the required SIP, then adjust the what-if SIP to see surplus or shortfall.",
    ],
    formula:
      "Required SIP from reverse annuity: P = FV × r / (((1+r)^n − 1) × (1+r)). Current savings grow as a lump sum alongside SIP FV.",
    example:
      "A ₹1 crore goal in 15 years at 12% needs a much smaller SIP if you already have a head start saved.",
    factors: [
      "Target",
      "Time",
      "Return assumption",
      "Current savings",
      "Contribution discipline",
    ],
    faqs: [
      {
        q: "How is this different from Reverse SIP?",
        a: "Reverse SIP focuses on the required instalment. Goal Planner adds current savings and an explicit what-if contribution comparison.",
      },
    ],
    related: [
      { category: "retirement", slug: "reverse-sip", title: "Reverse SIP" },
      { category: "retirement", slug: "fire", title: "FIRE Planner" },
      { category: "investment", slug: "sip", title: "SIP Calculator" },
    ],
    lastUpdated: UPDATED,
  },
  "retirement/reverse-sip": {
    seoSlug: "reverse-sip-calculator",
    metaTitle: "Reverse SIP Calculator – SIP Needed for Goal | Aaru Wealth",
    metaDescription:
      "Back-solve the monthly SIP required to reach a target corpus at an assumed return.",
    intro:
      "Reverse SIP answers: given a goal corpus, return and time, what monthly investment is required?",
    howToUse: [
      "Enter target corpus, expected return and years.",
      "Read required monthly SIP and total invested.",
    ],
    formula: "P = FV × r / (((1+r)^n − 1) × (1+r)) with monthly r and n.",
    example: "A ₹1 crore goal in 15 years at 12% needs a substantial but defined monthly SIP.",
    factors: ["Goal amount", "Time", "Return assumption"],
    faqs: [
      {
        q: "What if returns are lower?",
        a: "Required SIP rises. Re-run with conservative rates.",
      },
    ],
    related: [
      { category: "investment", slug: "sip", title: "SIP Calculator" },
      { category: "retirement", slug: "fire", title: "FIRE Planner" },
    ],
    lastUpdated: UPDATED,
  },
  "retirement/child-education": {
    seoSlug: "child-education-calculator",
    metaTitle: "Child Education Calculator – Education Inflation Planner | Aaru Wealth",
    metaDescription:
      "Plan for rising education costs with 10–12% education inflation and required SIP.",
    intro:
      "Education costs often inflate faster than general CPI. This planner projects programme cost and the SIP needed to close the gap.",
    howToUse: [
      "Enter today’s annual cost, years until start, education inflation and programme length.",
      "Add existing corpus and expected investment return.",
    ],
    formula: "Future costs compounded at education inflation; SIP solves for remaining gap.",
    example: "A ₹25 lakh present annual cost can become much larger in 12 years at 11% education inflation.",
    factors: ["Education inflation", "Years left", "Existing savings", "Returns"],
    faqs: [
      {
        q: "Why 10–12% inflation?",
        a: "Education and coaching costs in India have historically run hotter than general inflation — adjust to your city/course.",
      },
    ],
    related: [
      { category: "retirement", slug: "reverse-sip", title: "Reverse SIP" },
      { category: "investment", slug: "sip", title: "SIP Calculator" },
    ],
    lastUpdated: UPDATED,
  },
  "taxation/income-tax": {
    seoSlug: "income-tax-calculator",
    metaTitle: "Income Tax Calculator India – Old vs New Regime | Aaru Wealth",
    metaDescription:
      "Compare old vs new tax regime for FY 2025-26 style slabs with 87A rebate and cess. Free income tax calculator.",
    intro:
      "India’s default new regime and optional old regime can produce very different liabilities depending on deductions. Compare both side by side.",
    howToUse: [
      "Enter gross income and whether you are salaried.",
      "Add old-regime deductions/exemptions.",
      "Compare total tax including cess.",
    ],
    formula:
      "Slab tax − Section 87A rebate (if eligible) + 4% health & education cess. New regime uses Budget 2025-style slabs in our engine.",
    example: "Salaried income near ₹12 lakh may be near-zero under new regime after rebate/standard deduction — verify with latest law.",
    factors: ["Regime choice", "Deductions", "Special rate incomes", "Surcharge (not fully modelled for ultra-high incomes)"],
    faqs: [
      {
        q: "Is this the final tax for filing?",
        a: "No. It is an estimate. Use official utilities / CA for filing, especially with capital gains or multiple sources.",
      },
    ],
    related: [
      { category: "taxation", slug: "take-home-salary", title: "Take-Home Salary" },
      { category: "taxation", slug: "hra-exemption", title: "HRA Exemption" },
      { category: "taxation", slug: "capital-gains", title: "Capital Gains" },
    ],
    lastUpdated: UPDATED,
  },
  "taxation/capital-gains": {
    seoSlug: "capital-gains-calculator",
    metaTitle: "Capital Gains Calculator India – STCG & LTCG | Aaru Wealth",
    metaDescription:
      "Estimate equity and real-estate capital gains tax using current STCG/LTCG style rates.",
    intro:
      "Capital gains tax depends on asset type and holding period. Equity-oriented gains use special rates; real estate uses different thresholds.",
    howToUse: [
      "Choose equity or real estate.",
      "Enter buy/sell prices and holding months.",
      "Review gain, tax and net proceeds.",
    ],
    formula:
      "Equity STCG ~20%; LTCG ~12.5% above ₹1.25 lakh exemption (engine defaults). Real-estate LTCG uses simplified 12.5% path without full indexation options.",
    example: "Selling listed equity after 18 months may attract LTCG above exemption — other gains in the year matter.",
    factors: ["Holding period", "Asset class", "Exemption stacking", "Indexation options"],
    faqs: [
      {
        q: "Are Budget changes reflected?",
        a: "Rates follow our published engine defaults. Always confirm the latest Finance Act before filing.",
      },
    ],
    related: [
      { category: "taxation", slug: "income-tax", title: "Income Tax" },
      { category: "investment", slug: "xirr", title: "XIRR Calculator" },
    ],
    lastUpdated: UPDATED,
  },
  "taxation/hra-exemption": {
    seoSlug: "hra-calculator",
    metaTitle: "HRA Exemption Calculator – Section 10(13A) | Aaru Wealth",
    metaDescription:
      "Calculate HRA exemption as the minimum of three statutory rules for metro and non-metro cities.",
    intro:
      "House Rent Allowance exemption is the least of: actual HRA, rent paid minus 10% of basic, and 50%/40% of basic (metro/non-metro).",
    howToUse: [
      "Enter monthly basic, HRA and rent.",
      "Toggle metro city.",
      "See annual exemption and taxable HRA.",
    ],
    formula: "Exemption = min(HRA, rent − 10% basic, 50% or 40% of basic).",
    example: "High rent with modest HRA is capped by actual HRA received.",
    factors: ["Metro status", "Basic salary definition", "Rent receipts"],
    faqs: [
      {
        q: "Is this available in the new regime?",
        a: "HRA exemption is generally an old-regime benefit. Confirm current rules for your filing year.",
      },
    ],
    related: [
      { category: "taxation", slug: "income-tax", title: "Income Tax" },
      { category: "taxation", slug: "take-home-salary", title: "Take-Home Salary" },
    ],
    lastUpdated: UPDATED,
  },
  "taxation/take-home-salary": {
    seoSlug: "take-home-salary-calculator",
    metaTitle: "Take-Home Salary Calculator India | Aaru Wealth",
    metaDescription:
      "Estimate in-hand salary after EPF, professional tax and TDS using new-regime tax estimate.",
    intro:
      "Gross salary is not take-home. This tool deducts employee EPF, professional tax and an estimated monthly TDS.",
    howToUse: [
      "Enter monthly gross, basic %, EPF % and professional tax.",
      "Review net monthly pay and deduction breakup.",
    ],
    formula: "Net ≈ gross − EPF − PT − (annual new-regime tax ÷ 12).",
    example: "Higher basic increases EPF deduction even if gross is unchanged.",
    factors: ["Salary structure", "Tax regime", "State PT slabs"],
    faqs: [
      {
        q: "Why does TDS differ from my payslip?",
        a: "Employers use projected annual income and declarations. This is a simplified estimate.",
      },
    ],
    related: [
      { category: "taxation", slug: "income-tax", title: "Income Tax" },
      { category: "government", slug: "epf", title: "EPF Calculator" },
    ],
    lastUpdated: UPDATED,
  },
  "government/ppf": {
    seoSlug: "ppf-calculator",
    metaTitle: "PPF Calculator – Public Provident Fund Maturity | Aaru Wealth",
    metaDescription:
      "Estimate PPF maturity with annual deposits and compounding. Free PPF calculator for India.",
    intro:
      "Public Provident Fund is a long-horizon, EEE-style savings scheme with annual compounding (model simplified). Confirm the latest notified rate.",
    howToUse: [
      "Enter annual deposit, tenure and rate.",
      "Review maturity, deposits and interest.",
    ],
    formula: "Each year: balance += deposit; balance *= (1+rate). Defaults assume annual compounding.",
    example: "₹1.5 lakh yearly for 15 years builds a sizable tax-efficient corpus at notified rates.",
    factors: ["Notified rate changes", "Deposit timing", "Extensions"],
    faqs: [
      {
        q: "What is a PPF calculator?",
        a: "It projects the maturity value of Public Provident Fund contributions under an assumed interest rate and deposit schedule.",
      },
      {
        q: "Is the PPF rate fixed for 15 years?",
        a: "No. PPF rates are notified periodically by the government. Stress-test projections with higher and lower rates.",
      },
      {
        q: "How is PPF interest calculated here?",
        a: "This tool uses a simplified annual compounding model for planning. Official crediting rules and deposit cut-offs can differ — verify with your account provider.",
      },
      {
        q: "What is the maximum annual PPF deposit?",
        a: "Contribution limits are set by scheme rules and can change. Confirm the current ceiling on official government sources before depositing.",
      },
    ],
    related: [
      { category: "government", slug: "epf", title: "EPF Calculator" },
      { category: "government", slug: "nps", title: "NPS Calculator" },
      { category: "government", slug: "ssy", title: "SSY Calculator" },
    ],
    lastUpdated: UPDATED,
  },
  "government/nps": {
    seoSlug: "nps-calculator",
    metaTitle: "NPS Calculator – Retirement Corpus & Annuity Split | Aaru Wealth",
    metaDescription:
      "Project NPS corpus from monthly contributions and estimate lump-sum vs annuity portions.",
    intro:
      "National Pension System builds a retirement corpus with market-linked returns. At exit, a portion typically buys an annuity.",
    howToUse: [
      "Enter monthly contribution, years, expected return and annuity %.",
      "Review corpus, lump sum and annuity amount.",
    ],
    formula: "Monthly contributions compounded at assumed monthly return; annuity share applied at maturity.",
    example: "Long contribution horizons dominate outcomes more than small rate differences.",
    factors: ["Asset allocation", "Contribution consistency", "Annuity rules"],
    faqs: [
      {
        q: "What does an NPS calculator estimate?",
        a: "Illustrative corpus from regular contributions and an assumed return, plus a simple split between lump sum and annuity purchase at exit.",
      },
      {
        q: "Is the annuity percentage fixed?",
        a: "Regulatory minimums can apply depending on exit type and rules in force. Adjust the slider to explore scenarios — not a compliance check.",
      },
      {
        q: "Are NPS returns guaranteed?",
        a: "No. NPS returns depend on asset allocation and market performance. Enter a conservative assumed return for planning.",
      },
      {
        q: "Where can I verify NPS rules?",
        a: "Prefer PFRDA / official NPS portals for contribution, tax and withdrawal rules — they change over time.",
      },
    ],
    related: [
      { category: "government", slug: "ppf", title: "PPF Calculator" },
      { category: "retirement", slug: "fire", title: "FIRE Planner" },
    ],
    lastUpdated: UPDATED,
  },
  "government/epf": {
    seoSlug: "epf-calculator",
    metaTitle: "EPF Calculator – Provident Fund Projection | Aaru Wealth",
    metaDescription:
      "Project EPF balance with employee and employer contributions and assumed interest rate.",
    intro:
      "Employees’ Provident Fund accumulates contributions with interest. This is a simplified monthly model for planning.",
    howToUse: [
      "Enter monthly basic+DA, years remaining and EPF rate.",
      "Review projected corpus and contribution split.",
    ],
    formula: "Monthly employee + employer (EPF portion) contributions compounded monthly at assumed rate.",
    example: "Higher basic accelerates both contributions and corpus — subject to wage ceilings in real EPFO rules.",
    factors: ["Basic wage", "Contribution rates", "Notified interest", "EPS carve-outs"],
    faqs: [
      {
        q: "Does this match EPFO passbook?",
        a: "Unlikely exactly — real accounts have wage ceilings, EPS splits and yearly crediting conventions.",
      },
    ],
    related: [
      { category: "government", slug: "ppf", title: "PPF Calculator" },
      { category: "taxation", slug: "take-home-salary", title: "Take-Home Salary" },
    ],
    lastUpdated: UPDATED,
  },
  "government/ssy": {
    seoSlug: "ssy-calculator",
    metaTitle: "SSY Calculator – Sukanya Samriddhi Yojana | Aaru Wealth",
    metaDescription:
      "Estimate SSY maturity with deposits for 15 years and maturity at 21. Free Sukanya calculator.",
    intro:
      "Sukanya Samriddhi Yojana is a girl-child savings scheme with deposits typically for 15 years and maturity around 21 years.",
    howToUse: [
      "Enter annual deposit and assumed rate.",
      "Review maturity and interest earned.",
    ],
    formula: "Annual deposit for deposit years, then compounding continues to maturity year.",
    example: "Consistent max deposits can create a meaningful education/marriage corpus — rate is notified.",
    factors: ["Notified rate", "Deposit consistency", "Eligibility rules"],
    faqs: [
      {
        q: "Who can open SSY?",
        a: "Subject to scheme eligibility (girl child age limits etc.). Confirm with India Post / bank.",
      },
    ],
    related: [
      { category: "government", slug: "ppf", title: "PPF Calculator" },
      { category: "retirement", slug: "child-education", title: "Child Education" },
    ],
    lastUpdated: UPDATED,
  },
  "government/post-office": {
    seoSlug: "post-office-calculator",
    metaTitle: "Post Office Calculator – NSC, SCSS, KVP | Aaru Wealth",
    metaDescription:
      "Compare NSC, SCSS and KVP style returns with configurable rates and tenures.",
    intro:
      "India Post offers multiple fixed-income products. This tool provides simplified NSC, SCSS and KVP maturity/interest views.",
    howToUse: [
      "Select scheme, principal, rate and tenure.",
      "For SCSS, review quarterly payout estimates.",
    ],
    formula: "NSC/KVP: compound FV. SCSS: periodic interest on principal with principal returned at end.",
    example: "SCSS suits income needs; NSC/KVP suit lock-in compounding — compare after tax.",
    factors: ["Notified rates", "Tax treatment", "Lock-in"],
    faqs: [
      {
        q: "Are rates guaranteed?",
        a: "Use current notified rates from India Post. Defaults are illustrative.",
      },
    ],
    related: [
      { category: "government", slug: "fd-rd", title: "FD / RD" },
      { category: "government", slug: "ppf", title: "PPF Calculator" },
    ],
    lastUpdated: UPDATED,
  },
  "government/fd-rd": {
    seoSlug: "fd-rd-calculator",
    metaTitle: "FD & RD Calculator – Bank Deposit Returns | Aaru Wealth",
    metaDescription:
      "Calculate fixed deposit (quarterly compound) and recurring deposit maturity values.",
    intro:
      "Bank FDs and RDs are popular fixed-income options. FD uses periodic compounding; RD accumulates monthly deposits.",
    howToUse: [
      "Choose FD or RD.",
      "Enter amount, rate and tenure.",
      "Review maturity and interest.",
    ],
    formula: "FD: P(1+r/n)^(n t). RD: monthly deposits compounded at monthly rate.",
    example: "Higher compounding frequency increases effective yield slightly versus annual quotes.",
    factors: ["Bank rate", "Compounding", "TDS on interest"],
    faqs: [
      {
        q: "Is TDS considered?",
        a: "Not automatically. Interest may attract TDS depending on thresholds and declarations.",
      },
    ],
    related: [
      { category: "government", slug: "post-office", title: "Post Office Schemes" },
      { category: "investment", slug: "lump-sum", title: "Lump Sum" },
    ],
    lastUpdated: UPDATED,
  },
};

export function getCalculatorSeo(key: string): CalculatorSeo | undefined {
  return CALCULATOR_SEO[key];
}

export function getSeoKeyFromParts(category: string, slug: string): string {
  return `${category}/${slug}`;
}

/** Map flat SEO slug → internal category/slug path */
export function getPathFromSeoSlug(seoSlug: string): string | undefined {
  for (const [key, seo] of Object.entries(CALCULATOR_SEO)) {
    if (seo.seoSlug === seoSlug) {
      return `/calculators/${key}`;
    }
  }
  return undefined;
}

export function getAllSeoRedirects(): { source: string; destination: string }[] {
  return Object.entries(CALCULATOR_SEO).map(([key, seo]) => ({
    source: `/calculators/${seo.seoSlug}`,
    destination: `/calculators/${key}`,
  }));
}
