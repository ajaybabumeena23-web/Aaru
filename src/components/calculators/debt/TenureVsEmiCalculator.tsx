"use client";

import { useMemo } from "react";
import {
  CalculationResultCard,
  DraggableSlider,
  ExportPDFButton,
  FinancialDonutChart,
} from "@/components/calculators";
import {
  CalculatorPageLayout,
  withCalculatorSuspense,
} from "@/components/calculators/CalculatorPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCalculatorParams } from "@/hooks/useCalculatorParams";
import { compareTenureVsEmiReduction } from "@/utils/financial-math";
import { formatINR, formatPercent } from "@/lib/utils";

function TenureVsEmiInner() {
  const { values, setParam } = useCalculatorParams({
    principal: { default: 50_00_000 },
    rate: { default: 8.5 },
    tenure: { default: 20 },
    prepayMonth: { default: 12 },
    prepayAmount: { default: 5_00_000 },
  });

  const result = useMemo(
    () =>
      compareTenureVsEmiReduction({
        principal: values.principal,
        annualRatePct: values.rate,
        tenureMonths: values.tenure * 12,
        prepayments: [
          { month: values.prepayMonth, amount: values.prepayAmount },
        ],
      }),
    [values]
  );

  const { tenureStrategy: t, emiStrategy: e } = result;

  return (
    <CalculatorPageLayout
      categoryHref="/calculators/debt"
      categoryLabel="Debt Management"
      crumb="Tenure vs EMI"
      title="Choose Tenure Cut or EMI Cut"
      description="Side-by-side impact of the same prepayment: shorten tenure vs reduce EMI."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Inputs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <DraggableSlider
              id="principal"
              label="Loan Amount"
              value={values.principal}
              onChange={(v) => setParam("principal", v)}
              min={1_00_000}
              max={5_00_00_000}
              step={50_000}
              prefix="₹"
            />
            <DraggableSlider
              id="rate"
              label="Interest Rate"
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
            <DraggableSlider
              id="prepayMonth"
              label="Prepayment Month"
              value={values.prepayMonth}
              onChange={(v) => setParam("prepayMonth", v)}
              min={1}
              max={values.tenure * 12}
              step={1}
            />
            <DraggableSlider
              id="prepayAmount"
              label="Prepayment Amount"
              value={values.prepayAmount}
              onChange={(v) => setParam("prepayAmount", v)}
              min={10_000}
              max={50_00_000}
              step={10_000}
              prefix="₹"
            />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Interest: Tenure vs EMI Cut</CardTitle>
            </CardHeader>
            <CardContent>
              <FinancialDonutChart
                data={[
                  {
                    name: "Tenure-cut interest",
                    value: t.totalInterest,
                  },
                  {
                    name: "EMI-cut interest",
                    value: e.totalInterest,
                    color: "hsl(0 72% 51%)",
                  },
                ]}
                centerLabel="Saved (tenure)"
                centerValue={formatINR(t.interestSavedVsBaseline ?? 0, true)}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <CalculationResultCard
          title="Reduce Tenure (keep EMI)"
          metrics={[
            { label: "Months to clear", value: `${t.monthsTaken}` },
            { label: "Total interest", value: formatINR(t.totalInterest) },
            {
              label: "Interest saved",
              value: formatINR(t.interestSavedVsBaseline ?? 0),
              emphasize: true,
            },
          ]}
        />
        <CalculationResultCard
          title="Reduce EMI (keep tenure)"
          metrics={[
            { label: "Final EMI (approx)", value: formatINR(e.schedule.at(-1)?.emi ?? e.emi) },
            { label: "Months", value: `${e.monthsTaken}` },
            { label: "Total interest", value: formatINR(e.totalInterest) },
            {
              label: "Interest saved",
              value: formatINR(e.interestSavedVsBaseline ?? 0),
              emphasize: true,
            },
          ]}
          footer={
            <ExportPDFButton
              title="Choose Tenure Cut or EMI Cut"
              subtitle="Tenure vs EMI — Aaru Wealth"
              inputs={[
                { label: "Principal", value: formatINR(values.principal) },
                { label: "Rate", value: formatPercent(values.rate) },
                {
                  label: "Prepay",
                  value: `Month ${values.prepayMonth}: ${formatINR(values.prepayAmount)}`,
                },
              ]}
              results={[
                {
                  label: "Tenure-cut interest",
                  value: formatINR(t.totalInterest),
                },
                {
                  label: "EMI-cut interest",
                  value: formatINR(e.totalInterest),
                },
              ]}
              fileName="tenure-vs-emi.pdf"
            />
          }
        />
      </div>
    </CalculatorPageLayout>
  );
}

export function TenureVsEmiCalculator() {
  return withCalculatorSuspense(<TenureVsEmiInner />);
}
