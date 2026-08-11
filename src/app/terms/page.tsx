import { TrustPage, trustMetadata } from "@/components/layout/TrustPage";
import { SITE_NAME } from "@/lib/brand";

export const metadata = trustMetadata(
  "Terms of Use",
  `Terms for using ${SITE_NAME}.`,
  "/terms"
);

export default function TermsPage() {
  return (
    <TrustPage title="Terms of Use">
      <p>
        By using {SITE_NAME}, you agree that calculators and content are
        provided “as is” for educational purposes. You are responsible for how
        you use the outputs.
      </p>
      <p>
        You may not scrape, misuse or misrepresent our tools as personalised
        regulated advice. You may not attempt to disrupt the service.
      </p>
      <p>
        Content and branding are owned by {SITE_NAME} unless otherwise noted.
        Official scheme names and trademarks belong to their respective owners.
      </p>
    </TrustPage>
  );
}
