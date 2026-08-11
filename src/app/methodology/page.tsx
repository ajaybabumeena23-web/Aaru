import { TrustPage, trustMetadata } from "@/components/layout/TrustPage";
import { SITE_NAME } from "@/lib/brand";

export const metadata = trustMetadata(
  "Calculator Methodology",
  `How ${SITE_NAME} calculates SIP, EMI, tax and other results.`,
  "/methodology"
);

export default function MethodologyPage() {
  return (
    <TrustPage title="Calculator Methodology">
      <p>
        We document common assumptions so you can interpret results correctly.
        Exact formulas live in our client-side math library and may be refined
        over time.
      </p>
      <h2 className="text-xl font-semibold">General conventions</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>Currency: Indian Rupees (₹), Indian numbering where displayed.</li>
        <li>
          Compounding: monthly for most SIP/EMI models unless a scheme uses
          annual compounding (e.g. simplified PPF/SSY models).
        </li>
        <li>Rounding: display values are typically rounded to nearest rupee.</li>
        <li>
          Inflation toggles discount future values to today&apos;s rupees when
          enabled.
        </li>
      </ul>
      <h2 className="text-xl font-semibold">Examples</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>
          <strong>SIP:</strong> future value of a monthly annuity with optional
          annual step-up.
        </li>
        <li>
          <strong>EMI:</strong> reducing-balance loan amortisation; advanced
          tools support lump-sum prepayments and EMI step-ups.
        </li>
        <li>
          <strong>XIRR:</strong> Newton-Raphson (with bisection fallback) on
          irregular cash flows.
        </li>
        <li>
          <strong>Income tax:</strong> FY 2025-26 style new-regime slabs and
          legacy old-regime comparison with Section 87A rebate and 4% cess —
          update when law changes.
        </li>
      </ul>
      <p>
        Scheme interest rates (PPF, SSY, NSC, etc.) are configurable inputs with
        sensible defaults; always confirm the latest notified rate before
        relying on a maturity figure.
      </p>
    </TrustPage>
  );
}
