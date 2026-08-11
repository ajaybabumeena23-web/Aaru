import { TrustPage, trustMetadata } from "@/components/layout/TrustPage";
import { SITE_NAME } from "@/lib/brand";

export const metadata = trustMetadata(
  "Privacy Policy",
  `How ${SITE_NAME} handles data and privacy.`,
  "/privacy"
);

export default function PrivacyPage() {
  return (
    <TrustPage title="Privacy Policy">
      <p>
        Most {SITE_NAME} calculators run in your browser. Calculation inputs are
        not required to be stored on our servers for basic use.
      </p>
      <p>
        If you share a calculator URL, the query parameters reflect your inputs
        — treat shared links as public.
      </p>
      <p>
        We may use privacy-respecting analytics (such as aggregated traffic
        metrics) to improve the product. We do not sell personal information.
      </p>
      <p>
        Contact pages or future newsletter forms will only collect what you
        voluntarily submit. Details will be updated here if data collection
        expands.
      </p>
    </TrustPage>
  );
}
