"use client";

import { useMemo } from "react";
import {
  CalculationResultCard,
  DraggableSlider,
  ExportPDFButton,
  ResultInterpretation,
  SensitivityBands,
  rateBandHint,
} from "@/components/calculators";
import {
  CalculatorPageLayout,
  withCalculatorSuspense,
} from "@/components/calculators/CalculatorPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCalculatorParams } from "@/hooks/useCalculatorParams";
import { rateSensitivityBands } from "@/lib/sensitivity";
import { calculateLoanAffordability } from "@/utils/financial-math";
import { formatINR, formatPercent } from "@/lib/utils";

function AffordabilityInner() {
  const { values, setParam } = useCalculatorParams({
    income: { default: 1_00_000 },
    existing: { default: 15_000 },
    foir: { default: 40 },
    rate: { default: 8.5 },
    tenure: { default: 20 },
  });

  const result = useMemo(
    () =>
      calculateLoanAffordability({
        monthlyIncome: values.income,
        existingEmis: values.existing,
        foirPct: values.foir,
        annualRatePct: values.rate,
        tenureYears: values.tenure,
      }),
    [values]
  );

  const bands = useMemo(() => {
    return rateSensitivityBands(values.rate, 1, {
      min: 5,
      max: 18,
      labels: ["Lower rate", "Your rate", "Higher rate"],
    }).map((b) => {
      const r = calculateLoanAffordability({
        monthlyIncome: values.income,
        existingEmis: values.existing,
        foirPct: values.foir,
        annualRatePct: b.ratePct,
        tenureYears: values.tenure,
      });
      return {
        label: b.label,
        hint: rateBandHint(b.ratePct),
        value: formatINR(r.maxLoan, true),
        sub: `EMI capacity ${formatINR(r.availableEmi, true)}`,
        emphasize: b.key === "base",
      };
    });
  }, [values]);

  const interpretationPoints = [
    result.availableEmi <= 0
      ? `At a ${formatPercent(values.foir, 0)} FOIR-style cap, existing EMIs of ${formatINR(values.existing, true)} already use your EMI budget — available capacity is zero in this model.`
      : `With ${formatINR(values.income, true)} monthly income and ${formatINR(values.existing, true)} existing EMIs, about ${formatINR(result.availableEmi, true)} remains for a new EMI under a ${formatPercent(values.foir, 0)} cap.`,
    result.maxLoan > 0
      ? `At ${formatPercent(values.rate, 2)} for ${values.tenure} years, that capacity supports roughly ${formatINR(result.maxLoan, true)} of loan principal.`
      : "Increase income, lower existing EMIs, raise FOIR, or lengthen tenure to see a positive loan estimate.",
    "Banks use their own eligibility rules, bureau scores and FOIR policies — this is an illustration, not a sanction.",
  ];

  return (
    <CalculatorPageLayout
      seoKey="debt/loan-affordability"
      categoryHref="/calculators/debt"
      categoryLabel="Debt Management"
      crumb="Loan Affordability"
      title="Estimate How Much Loan You Can Afford"
      description="Illustrate max loan from income, existing EMIs and a FOIR-style EMI cap — using the same reducing-balance EMI math."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Inputs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <DraggableSlider
              id="income"
              label="Monthly take-home income"
              value={values.income}
              onChange={(v) => setParam("income", v)}
              min={20_000}
              max={10_00_000}
              step={5_000}
              prefix="₹"
            />
            <DraggableSlider
              id="existing"
              label="Existing EMIs"
              value={values.existing}
              onChange={(v) => setParam("existing", v)}
              min={0}
              max={5_00_000}
              step={1_000}
              prefix="₹"
            />
            <DraggableSlider
              id="foir"
              label="Max EMI as % of income (FOIR-style)"
              value={values.foir}
              onChange={(v) => setParam("foir", v)}
              min={20}
              max={60}
              step={1}
              suffix="%"
            />
            <DraggableSlider
              id="rate"
              label="Expected interest rate"
              value={values.rate}
              onChange={(v) => setParam("rate", v)}
              min={5}
              max={18}
              step={0.05}
              suffix="%"
            />
            <DraggableSlider
              id="tenure"
              label="Tenure"
              value={values.tenure}
              onChange={(v) => setParam("tenure", v)}
              min={1}
              max={30}
              step={1}
              suffix="yrs"
            />
          </CardContent>
        </Card>

        <div className="space-y-6 calculator-results-sticky">
          <CalculationResultCard
            metrics={[
              {
                label: "Estimated max loan",
                value: formatINR(result.maxLoan),
                emphasize: true,
                hint: `${formatPercent(values.rate, 2)} · ${values.tenure} yrs`,
              },
              {
                label: "Available EMI capacity",
                value: formatINR(result.availableEmi),
              },
              {
                label: "Max total EMI (cap)",
                value: formatINR(result.maxTotalEmi),
              },
              {
                label: "Income used by EMIs",
                value: formatPercent(result.incomeUsedPct, 0),
              },
            ]}
            footer={
              <ExportPDFButton
                title="Loan Affordability Calculator"
                tagline="Your loan eligibility illustration"
                subtitle="Loan Affordability — Aaru Wealth"
                hero={{
                  label: "Estimated max loan",
                  value: formatINR(result.maxLoan),
                }}
                inputs={[
                  {
                    label: "Monthly income",
                    value: formatINR(values.income),
                  },
                  {
                    label: "Existing EMIs",
                    value: formatINR(values.existing),
                  },
                  { label: "FOIR-style cap", value: formatPercent(values.foir, 0) },
                  { label: "Rate", value: formatPercent(values.rate) },
                  { label: "Tenure", value: `${values.tenure} years` },
                ]}
                results={[
                  { label: "Max loan", value: formatINR(result.maxLoan) },
                  {
                    label: "Available EMI",
                    value: formatINR(result.availableEmi),
                  },
                ]}
                fileName="loan-affordability.pdf"
              />
            }
          >
            <ResultInterpretation points={interpretationPoints} />
            <SensitivityBands
              title="Rate sensitivity"
              parameterLabel="interest rate (p.a.)"
              bands={bands}
            />
          </CalculationResultCard>
        </div>
      </div>
    </CalculatorPageLayout>
  );
}

export function LoanAffordabilityCalculator() {
  return withCalculatorSuspense(<AffordabilityInner />);
}
