/** @type {import('next').NextConfig} */
const seoRedirects = [
  ["sip-calculator", "investment/sip"],
  ["step-up-sip-calculator", "investment/step-up-sip"],
  ["lumpsum-calculator", "investment/lump-sum"],
  ["swp-calculator", "investment/swp"],
  ["xirr-calculator", "investment/xirr"],
  ["emi-calculator", "debt/emi"],
  ["home-loan-emi-calculator", "debt/home-loan-emi"],
  ["personal-loan-emi-calculator", "debt/personal-loan-emi"],
  ["car-loan-emi-calculator", "debt/car-loan-emi"],
  ["loan-prepayment-calculator", "debt/advanced-prepayment"],
  ["tenure-vs-emi-calculator", "debt/tenure-vs-emi"],
  ["refinance-calculator", "debt/refinance"],
  ["flat-vs-reducing-calculator", "debt/flat-vs-reducing"],
  ["rent-vs-buy-calculator", "debt/rent-vs-buy"],
  ["fire-calculator", "retirement/fire"],
  ["retirement-calculator", "retirement/fire"],
  ["goal-planner", "retirement/goal-planner"],
  ["goal-planner-calculator", "retirement/goal-planner"],
  ["reverse-sip-calculator", "retirement/reverse-sip"],
  ["child-education-calculator", "retirement/child-education"],
  ["income-tax-calculator", "taxation/income-tax"],
  ["capital-gains-calculator", "taxation/capital-gains"],
  ["hra-calculator", "taxation/hra-exemption"],
  ["take-home-salary-calculator", "taxation/take-home-salary"],
  ["ppf-calculator", "government/ppf"],
  ["nps-calculator", "government/nps"],
  ["epf-calculator", "government/epf"],
  ["ssy-calculator", "government/ssy"],
  ["post-office-calculator", "government/post-office"],
  ["fd-rd-calculator", "government/fd-rd"],
  ["fd-calculator", "government/fd-rd"],
  ["rd-calculator", "government/fd-rd"],
  ["inflation-calculator", "investment/inflation"],
  ["cagr-calculator", "investment/cagr"],
  ["net-worth-calculator", "investment/net-worth"],
  ["loan-affordability-calculator", "debt/loan-affordability"],
  ["loan-eligibility-calculator", "debt/loan-affordability"],
  ["education-loan-emi-calculator", "debt/education-loan-emi"],
  ["emergency-fund-calculator", "retirement/emergency-fund"],
];

/** Pretty IA aliases → existing canonical topic hubs (no new content URLs). */
const hubIaAliases = [
  ["investments", "sip"],
  ["tax", "income-tax"],
  ["personal-finance", "wealth-planning"],
  ["savings", "fd-rd"],
];

const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    const flat = seoRedirects.map(([seoSlug, path]) => ({
      source: `/calculators/${seoSlug}`,
      destination: `/calculators/${path}`,
      permanent: true,
    }));
    // Preferred /topics/* paths → existing canonical hubs (no URL breakage)
    const topicAliases = [
      "sip",
      "loans",
      "income-tax",
      "retirement",
      "ppf",
      "nps",
      "mutual-funds",
      "fd-rd",
      "insurance",
      "stocks",
      "wealth-planning",
    ].map((slug) => ({
      source: `/topics/${slug}`,
      destination: `/${slug}`,
      permanent: true,
    }));
    const iaAliases = hubIaAliases.map(([alias, canonical]) => ({
      source: `/${alias}`,
      destination: `/${canonical}`,
      permanent: true,
    }));
    return [...flat, ...topicAliases, ...iaAliases];
  },
};

export default nextConfig;
