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
import { analyzeRefinance } from "@/utils/financial-math";
import { formatINR, formatPercent } from "@/lib/utils";

function RefinanceInner() {
  const { values, setParam } = useCalculatorParams({
    outstanding: { default: 40_00_000 },
    currentRate: { default: 9.5 },
    remainingYears: { default: 15 },
    newRate: { default: 8.2 },
    newYears: { default: 15 },
    feePct: { default: 0.5 },
  });

  const result = useMemo(
    () =>
      analyzeRefinance({
        outstandingPrincipal: values.outstanding,
        currentRatePct: values.currentRate,
        remainingMonths: values.remainingYears * 12,
        newRatePct: values.newRate,
        newTenureMonths: values.newYears * 12,
        processingFeePct: values.feePct,
      }),
    [values]
  );

  return (
    <CalculatorPageLayout
      categoryHref="/calculators/debt"
      categoryLabel="Debt Management"
      crumb="Refinance"
      title="Should You Refinance Your Loan?"
      description="Compare switching costs versus interest savings on a balance transfer."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Inputs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <DraggableSlider
              id="outstanding"
              label="Outstanding Principal"
              value={values.outstanding}
              onChange={(v) => setParam("outstanding", v)}
              min={1_00_000}
              max={5_00_00_000}
              step={50_000}
              prefix="₹"
            />
            <DraggableSlider
              id="currentRate"
              label="Current Rate"
              value={values.currentRate}
              onChange={(v) => setParam("currentRate", v)}
              min={5}
              max={18}
              step={0.05}
              suffix="%"
            />
            <DraggableSlider
              id="remainingYears"
              label="Remaining Tenure"
              value={values.remainingYears}
              onChange={(v) => setParam("remainingYears", v)}
              min={1}
              max={30}
              step={1}
              suffix="yrs"
            />
            <DraggableSlider
              id="newRate"
              label="New Rate"
              value={values.newRate}
              onChange={(v) => setParam("newRate", v)}
              min={5}
              max={18}
              step={0.05}
              suffix="%"
            />
            <DraggableSlider
              id="newYears"
              label="New Tenure"
              value={values.newYears}
              onChange={(v) => setParam("newYears", v)}
              min={1}
              max={30}
              step={1}
              suffix="yrs"
            />
            <DraggableSlider
              id="feePct"
              label="Processing Fee"
              value={values.feePct}
              onChange={(v) => setParam("feePct", v)}
              min={0}
              max={3}
              step={0.1}
              suffix="%"
            />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Current vs New Interest</CardTitle>
            </CardHeader>
            <CardContent>
              <FinancialDonutChart
                data={[
                  {
                    name: "Current interest",
                    value: result.currentTotalInterest,
                    color: "hsl(0 72% 51%)",
                  },
                  {
                    name: "New interest",
                    value: result.newTotalInterest,
                  },
                ]}
                centerLabel="Net savings"
                centerValue={formatINR(result.netSavings, true)}
              />
            </CardContent>
          </Card>

          <CalculationResultCard
            metrics={[
              { label: "Current EMI", value: formatINR(result.currentEmi) },
              { label: "New EMI", value: formatINR(result.newEmi) },
              { label: "Switching fees", value: formatINR(result.fees) },
              {
                label: "Net savings",
                value: formatINR(result.netSavings),
                emphasize: true,
                hint:
                  result.breakEvenMonths != null
                    ? `Break-even in ~${result.breakEvenMonths} months`
                    : "No monthly EMI reduction",
              },
            ]}
            footer={
              <ExportPDFButton
                title="Should You Refinance Your Loan?"
                subtitle="Refinance Analyzer — Aaru Wealth"
                inputs={[
                  {
                    label: "Outstanding",
                    value: formatINR(values.outstanding),
                  },
                  {
                    label: "Current → New rate",
                    value: `${formatPercent(values.currentRate)} → ${formatPercent(values.newRate)}`,
                  },
                ]}
                results={[
                  { label: "Net savings", value: formatINR(result.netSavings) },
                  { label: "Fees", value: formatINR(result.fees) },
                ]}
                fileName="refinance.pdf"
              />
            }
          />
        </div>
      </div>
    </CalculatorPageLayout>
  );
}

export function RefinanceCalculator() {
  return withCalculatorSuspense(<RefinanceInner />);
}
