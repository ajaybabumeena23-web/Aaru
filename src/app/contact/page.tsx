import { TrustPage, trustMetadata } from "@/components/layout/TrustPage";
import { SITE_NAME } from "@/lib/brand";

export const metadata = trustMetadata(
  "Contact",
  `Contact ${SITE_NAME} for feedback and corrections.`,
  "/contact"
);

export default function ContactPage() {
  return (
    <TrustPage
      title="Contact"
      description="Feedback, corrections and partnership enquiries."
    >
      <p>
        Found an error in a calculator or article? We want to know. Please
        include the page URL, your inputs and the unexpected result.
      </p>
      <p>
        Email:{" "}
        <a
          className="text-gold hover:underline"
          href="mailto:hello@aaruwealth.com"
        >
          hello@aaruwealth.com
        </a>
      </p>
      <p className="text-sm text-muted-foreground">
        We cannot provide personalised investment or tax advice by email.
      </p>
    </TrustPage>
  );
}
