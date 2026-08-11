import { TrustPage, trustMetadata } from "@/components/layout/TrustPage";
import { SITE_NAME } from "@/lib/brand";

export const metadata = trustMetadata(
  "Disclaimer",
  `Important limitations of ${SITE_NAME} calculators and content.`,
  "/disclaimer"
);

export default function DisclaimerPage() {
  return (
    <TrustPage title="Disclaimer">
      <p>
        Calculators and articles on {SITE_NAME} provide <strong>illustrative
        estimates</strong> based on the inputs and assumptions you provide (or
        our published defaults). Results are not guarantees of investment
        returns, tax outcomes, loan approvals or eligibility for any scheme.
      </p>
      <p>
        Nothing on this website constitutes investment advice, tax advice, legal
        advice or a solicitation to buy or sell any financial product. Past
        performance is not indicative of future results. Markets, interest
        rates, tax rules and scheme rates change.
      </p>
      <p>
        {SITE_NAME} does not claim SEBI registration, advisory certification or
        regulatory approval unless explicitly stated for a specific regulated
        service (none currently).
      </p>
      <p>
        Always verify critical decisions with a qualified professional and
        official government or institution sources (Income Tax Department, RBI,
        SEBI, EPFO, PFRDA, India Post, your bank or lender).
      </p>
    </TrustPage>
  );
}
