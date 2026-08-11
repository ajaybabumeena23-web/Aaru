export const SITE_NAME = "Aaru Wealth";
export const SITE_TAGLINE = "Smart Financial Tools for India";
export const SITE_DESCRIPTION =
  "Free calculators and practical financial resources for SIPs, loans, taxes, retirement, savings and wealth planning in India.";

export const POPULAR_CALCULATORS = [
  { category: "investment", slug: "sip", title: "SIP Calculator" },
  { category: "debt", slug: "emi", title: "EMI Calculator" },
  { category: "taxation", slug: "income-tax", title: "Income Tax Calculator" },
  { category: "investment", slug: "step-up-sip", title: "Step-Up SIP" },
  { category: "government", slug: "fd-rd", title: "FD / RD Calculator" },
  { category: "government", slug: "ppf", title: "PPF Calculator" },
  { category: "government", slug: "nps", title: "NPS Calculator" },
  { category: "investment", slug: "swp", title: "SWP Calculator" },
  { category: "retirement", slug: "fire", title: "FIRE Planner" },
  { category: "investment", slug: "xirr", title: "XIRR Calculator" },
  { category: "debt", slug: "advanced-prepayment", title: "Loan Prepayment" },
  { category: "taxation", slug: "take-home-salary", title: "Take-Home Salary" },
] as const;

export const TRUST_LINKS = [
  { href: "/about", label: "About" },
  { href: "/methodology", label: "Calculator Methodology" },
  { href: "/editorial-policy", label: "Editorial Policy" },
  { href: "/disclaimer", label: "Disclaimer" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Use" },
  { href: "/contact", label: "Contact" },
] as const;
