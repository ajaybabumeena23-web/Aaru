import { TrustPage, trustMetadata } from "@/components/layout/TrustPage";
import { SITE_NAME } from "@/lib/brand";

export const metadata = trustMetadata(
  "Editorial Policy",
  `How ${SITE_NAME} researches and updates financial content.`,
  "/editorial-policy"
);

export default function EditorialPolicyPage() {
  return (
    <TrustPage title="Editorial Policy">
      <p>
        {SITE_NAME} aims to publish clear, useful explanations for Indian
        personal-finance topics. We prioritise accuracy and transparency over
        volume.
      </p>
      <ul className="list-disc space-y-1 pl-5">
        <li>
          Prefer official sources (Income Tax Department, RBI, SEBI, EPFO,
          PFRDA, India Post) for rates and rules.
        </li>
        <li>Do not invent tax rates, scheme limits or regulatory claims.</li>
        <li>
          Calculators are tested for common and edge cases; methodology is
          disclosed.
        </li>
        <li>
          Time-sensitive pages should show a last-reviewed date when published.
        </li>
        <li>Corrections are made promptly when errors are identified.</li>
      </ul>
      <p>
        We do not sell rankings, fake testimonials or guaranteed-return claims.
      </p>
    </TrustPage>
  );
}
