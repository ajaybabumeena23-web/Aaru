/**
 * Pretty IA aliases → canonical topic hubs.
 * Canonical URLs stay /sip, /loans, etc. Aliases 301 to those hubs.
 */

export type HubAlias = {
  /** Pretty path segment, e.g. "investments" → /investments */
  alias: string;
  /** Canonical TOPIC_HUBS slug */
  canonical: string;
  /** Search / nav label */
  label: string;
};

export const HUB_ALIASES: HubAlias[] = [
  { alias: "investments", canonical: "sip", label: "Investments" },
  { alias: "tax", canonical: "income-tax", label: "Tax" },
  { alias: "personal-finance", canonical: "wealth-planning", label: "Personal Finance" },
  { alias: "savings", canonical: "fd-rd", label: "Savings" },
];

/** Related-topic graph for hub ↔ hub internal links (slugs only). */
export const RELATED_TOPIC_SLUGS: Record<string, string[]> = {
  sip: ["mutual-funds", "stocks", "retirement", "wealth-planning", "ppf"],
  loans: ["income-tax", "insurance", "wealth-planning", "retirement"],
  "income-tax": ["wealth-planning", "nps", "ppf", "loans", "retirement"],
  retirement: ["nps", "ppf", "sip", "wealth-planning", "income-tax"],
  ppf: ["nps", "retirement", "fd-rd", "income-tax", "wealth-planning"],
  nps: ["retirement", "ppf", "income-tax", "sip", "wealth-planning"],
  "mutual-funds": ["sip", "stocks", "retirement", "wealth-planning"],
  "fd-rd": ["ppf", "wealth-planning", "insurance", "sip"],
  insurance: ["wealth-planning", "loans", "retirement", "income-tax"],
  stocks: ["mutual-funds", "sip", "wealth-planning", "income-tax"],
  "wealth-planning": ["sip", "retirement", "fd-rd", "insurance", "income-tax"],
};

/**
 * Calculator category / seoKey prefix → primary topic hub slug.
 * Used for “Explore topic” links on calculator pages.
 */
export const CALCULATOR_TOPIC_HUB: Record<string, string> = {
  investment: "sip",
  debt: "loans",
  taxation: "income-tax",
  retirement: "retirement",
  government: "ppf",
};

/** More specific overrides by full seoKey. */
export const CALCULATOR_TOPIC_HUB_OVERRIDE: Record<string, string> = {
  "government/nps": "nps",
  "government/fd-rd": "fd-rd",
  "government/epf": "retirement",
  "government/ssy": "wealth-planning",
  "government/post-office": "fd-rd",
  "investment/xirr": "stocks",
  "investment/inflation": "wealth-planning",
  "investment/cagr": "mutual-funds",
  "investment/net-worth": "wealth-planning",
  "debt/loan-affordability": "loans",
  "debt/education-loan-emi": "loans",
  "retirement/emergency-fund": "wealth-planning",
};

export function resolveCalculatorTopicHub(seoKey: string): string | undefined {
  if (CALCULATOR_TOPIC_HUB_OVERRIDE[seoKey]) {
    return CALCULATOR_TOPIC_HUB_OVERRIDE[seoKey];
  }
  const category = seoKey.split("/")[0];
  return CALCULATOR_TOPIC_HUB[category];
}

export function getAliasForCanonical(canonical: string): HubAlias | undefined {
  return HUB_ALIASES.find((a) => a.canonical === canonical);
}

export function getCanonicalForAlias(alias: string): string | undefined {
  return HUB_ALIASES.find((a) => a.alias === alias)?.canonical;
}
