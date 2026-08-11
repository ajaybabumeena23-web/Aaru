/** Long-tail SIP scenario pages with genuine utility (not thin doorway pages). */

export type SipScenario = {
  slug: string;
  title: string;
  h1: string;
  description: string;
  monthly: number;
  rate: number;
  years: number;
  insight: string;
  compareNote: string;
};

export const SIP_SCENARIOS: SipScenario[] = [
  {
    slug: "5000-sip-for-10-years",
    title: "₹5,000 SIP for 10 years",
    h1: "₹5,000 monthly SIP for 10 years — illustrative maturity",
    description:
      "See invested amount and estimated maturity for a ₹5,000 SIP over 10 years at an illustrative return, then open the live calculator to change assumptions.",
    monthly: 5_000,
    rate: 12,
    years: 10,
    insight:
      "A modest SIP builds habit first. At this size, consistency usually matters more than fine-tuning the return assumption within a realistic band.",
    compareNote:
      "Try the same tenure at 8% and 12% in the live calculator to see how sensitive the corpus is to return assumptions.",
  },
  {
    slug: "10000-sip-for-20-years",
    title: "₹10,000 SIP for 20 years",
    h1: "₹10,000 monthly SIP for 20 years — illustrative maturity",
    description:
      "Long-horizon illustration for a ₹10,000 SIP over 20 years with clear invested-vs-gains framing.",
    monthly: 10_000,
    rate: 12,
    years: 20,
    insight:
      "Over 20 years, compounding and contribution totals both dominate. Small annual step-ups can change the ending corpus more than obsessing over a 0.5% return tweak.",
    compareNote:
      "Open Step-Up SIP with a 10% annual increase to compare against a flat ₹10,000 plan.",
  },
  {
    slug: "20000-sip-for-15-years",
    title: "₹20,000 SIP for 15 years",
    h1: "₹20,000 monthly SIP for 15 years — illustrative maturity",
    description:
      "Mid-horizon illustration for a ₹20,000 SIP over 15 years—useful for house-down-payment style goals.",
    monthly: 20_000,
    rate: 12,
    years: 15,
    insight:
      "For goals with a hard date (education, down payment), also run an inflation-adjusted view so the corpus is expressed in today’s purchasing power.",
    compareNote:
      "Use Advanced mode on the SIP calculator to toggle inflation and compare real vs nominal corpus.",
  },
];

export function getSipScenario(slug: string): SipScenario | undefined {
  return SIP_SCENARIOS.find((s) => s.slug === slug);
}
