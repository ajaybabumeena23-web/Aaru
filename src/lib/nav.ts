/**
 * Shared navigation IA for Aaru Wealth 2.0.
 * All hrefs point at existing canonical routes (no URL breakage).
 */

export type NavLink = {
  href: string;
  label: string;
  /** Path prefix(es) that mark this item active */
  match?: string | string[];
};

export const DESKTOP_NAV: NavLink[] = [
  { href: "/calculators", label: "Calculators", match: "/calculators" },
  {
    href: "/sip",
    label: "Investments",
    match: ["/sip", "/mutual-funds", "/stocks", "/calculators/investment"],
  },
  {
    href: "/loans",
    label: "Loans",
    match: ["/loans", "/calculators/debt"],
  },
  {
    href: "/income-tax",
    label: "Tax",
    match: ["/income-tax", "/calculators/taxation"],
  },
  {
    href: "/retirement",
    label: "Retirement",
    match: ["/retirement", "/nps", "/ppf", "/calculators/retirement"],
  },
  {
    href: "/wealth-planning",
    label: "Personal Finance",
    match: ["/wealth-planning", "/fd-rd", "/insurance"],
  },
  { href: "/guides", label: "Guides", match: "/guides" },
];

/** Mobile / footer “Money” topic links */
export const MONEY_LINKS: NavLink[] = [
  { href: "/sip", label: "Investments" },
  { href: "/loans", label: "Loans" },
  { href: "/income-tax", label: "Tax" },
  { href: "/retirement", label: "Retirement" },
  { href: "/fd-rd", label: "Savings" },
  { href: "/wealth-planning", label: "Personal Finance" },
  { href: "/topics", label: "All topics" },
];

export const LEARN_LINKS: NavLink[] = [
  { href: "/guides", label: "Guides" },
  { href: "/glossary", label: "Glossary" },
  { href: "/methodology", label: "Methodology" },
  { href: "/editorial-policy", label: "Editorial Policy" },
  { href: "/disclaimer", label: "Disclaimer" },
];

export const FINANCIAL_GOALS: NavLink[] = [
  { href: "/loans/50-lakh-home-loan-20-years", label: "Buy a Home" },
  { href: "/retirement", label: "Retirement" },
  { href: "/calculators/retirement/child-education", label: "Education" },
  { href: "/sip", label: "Wealth Building" },
  { href: "/loans", label: "Debt-Free" },
  { href: "/guides/emergency-fund-basics", label: "Emergency Fund" },
];

/** Footer calculator shortcuts (existing tools only) */
export const FOOTER_CALCULATORS: NavLink[] = [
  { href: "/calculators/investment/sip", label: "SIP" },
  { href: "/calculators/debt/emi", label: "EMI" },
  { href: "/calculators/government/fd-rd", label: "FD" },
  { href: "/calculators/government/ppf", label: "PPF" },
  { href: "/calculators/government/nps", label: "NPS" },
  { href: "/calculators/taxation/income-tax", label: "Tax" },
  { href: "/calculators/retirement/fire", label: "Retirement" },
  { href: "/calculators", label: "All calculators" },
];

export function isNavActive(
  pathname: string,
  match?: string | string[]
): boolean {
  if (!match) return false;
  const prefixes = Array.isArray(match) ? match : [match];
  return prefixes.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}
