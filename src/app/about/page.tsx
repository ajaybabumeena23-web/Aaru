import { TrustPage, trustMetadata } from "@/components/layout/TrustPage";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/brand";

export const metadata = trustMetadata(
  "About Aaru Wealth",
  `${SITE_NAME} provides free Indian financial calculators and practical money guidance.`,
  "/about"
);

export default function AboutPage() {
  return (
    <TrustPage
      title={`About ${SITE_NAME}`}
      description={SITE_TAGLINE}
    >
      <p>
        {SITE_NAME} is an Indian personal-finance platform offering free
        calculators and practical guidance for SIPs, loans, taxes, retirement,
        savings and wealth planning.
      </p>
      <p>
        Our goal is simple: help you understand numbers quickly, transparently
        and privately. Most calculations run entirely in your browser — we do
        not require an account for basic tools.
      </p>
      <p>
        We are not a SEBI-registered investment adviser, broker or tax advisor.
        Content and calculators are educational estimates, not personalised
        financial advice.
      </p>
      <h2 className="text-xl font-semibold text-foreground">What we offer</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>Investment & wealth calculators (SIP, step-up SIP, SWP, XIRR)</li>
        <li>Loan & EMI tools including prepayment and refinance analysis</li>
        <li>Retirement & goal planners (FIRE, reverse SIP, education)</li>
        <li>Tax & salary helpers (old vs new regime, HRA, take-home)</li>
        <li>Government & fixed-income schemes (PPF, NPS, EPF, SSY, FD/RD)</li>
      </ul>
    </TrustPage>
  );
}
