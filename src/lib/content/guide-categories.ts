import { GUIDES, type Guide } from "@/lib/content/guides";

export type GuideCategory = {
  slug: string;
  label: string;
  title: string;
  description: string;
  /** Matches Guide.category */
  category: string;
};

export const GUIDE_CATEGORIES: GuideCategory[] = [
  {
    slug: "investing",
    label: "Investing",
    title: "Investing Guides",
    description:
      "SIP, mutual funds, lump sum vs SIP, XIRR and withdrawal basics for Indian investors.",
    category: "Investing",
  },
  {
    slug: "loans",
    label: "Loans",
    title: "Loan & EMI Guides",
    description:
      "How EMIs work, prepayment choices and comparing loan costs without jargon.",
    category: "Loans",
  },
  {
    slug: "tax",
    label: "Tax",
    title: "Income Tax Guides",
    description:
      "Old vs new regime, take-home salary and capital gains basics for residents.",
    category: "Tax",
  },
  {
    slug: "retirement",
    label: "Retirement",
    title: "Retirement Guides",
    description:
      "Retirement corpus planning and FIRE concepts with transparent assumptions.",
    category: "Retirement",
  },
  {
    slug: "government-schemes",
    label: "Government schemes",
    title: "Government Scheme Guides",
    description: "PPF, NPS and related long-term schemes explained carefully.",
    category: "Government schemes",
  },
  {
    slug: "fixed-income",
    label: "Fixed income",
    title: "Fixed Income Guides",
    description: "FD, RD and how they differ from market-linked products.",
    category: "Fixed income",
  },
  {
    slug: "insurance",
    label: "Insurance",
    title: "Insurance Guides",
    description:
      "Term cover, health insurance planning and how much life cover to consider.",
    category: "Insurance",
  },
  {
    slug: "stocks",
    label: "Stocks",
    title: "Stocks & Equity Guides",
    description:
      "Equity risk, diversification and stocks vs mutual funds for beginners.",
    category: "Stocks",
  },
  {
    slug: "wealth-planning",
    label: "Wealth planning",
    title: "Wealth Planning Guides",
    description:
      "Emergency funds, asset allocation and connecting net worth to goals.",
    category: "Wealth planning",
  },
];

export function getGuideCategory(slug: string): GuideCategory | undefined {
  return GUIDE_CATEGORIES.find((c) => c.slug === slug);
}

export function guidesForCategory(category: GuideCategory): Guide[] {
  return GUIDES.filter((g) => g.category === category.category);
}

export function categoryHrefForGuide(guide: Guide): string | undefined {
  const cat = GUIDE_CATEGORIES.find((c) => c.category === guide.category);
  return cat ? `/guides/${cat.slug}` : undefined;
}
