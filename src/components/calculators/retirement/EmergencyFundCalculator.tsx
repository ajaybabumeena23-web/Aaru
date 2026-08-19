"use client";

import { useMemo } from "react";
import {
  CalculationResultCard,
  DraggableSlider,
  ExportPDFButton,
  ResultInterpretation,
} from "@/components/calculators";
import {
  CalculatorPageLayout,
  withCalculatorSuspense,
} from "@/components/calculators/CalculatorPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCalculatorParams } from "@/hooks/useCalculatorParams";
import { calculateEmergencyFund } from "@/utils/financial-math";
import { formatINR, formatNumber } from "@/lib/utils";

function EmergencyFundInner() {
  const { values, setParam } = useCalculatorParams({
    expenses: { default: 50_000 },
    months: { default: 6 },
    savings: { default: 1_50_000 },
  });

  const result = useMemo(
    () =>
      calculateEmergencyFund({
        monthlyExpenses: values.expenses,
        monthsCover: values.months,
        currentSavings: values.savings,
      }),
    [values]
  );

  const onTrack = result.gap === 0;
  const interpretationPoints = [
    `A ${values.months}-month buffer on ${formatINR(values.expenses, true)} expenses targets about ${formatINR(result.target, true)}.`,
    onTrack
      ? `Your ${formatINR(values.savings, true)} savings cover about ${formatNumber(result.monthsCoveredBySavings, 1)} months — at or above the target.`
      : `You have ${formatINR(values.savings, true)} (~${formatNumber(result.monthsCoveredBySavings, 1)} months). Gap to target is about ${formatINR(result.gap, true)}.`,
    "Keep the emergency fund in liquid, low-risk options. This sizing tool is not investment advice.",
  ];

  return (
    <CalculatorPageLayout
      seoKey="retirement/emergency-fund"
      categoryHref="/calculators/retirement"
      categoryLabel="Retirement & Goals"
      crumb="Emergency Fund"
      title="Size Your Emergency Fund"
      description="Estimate a cash buffer from monthly expenses and months of cover — then compare with what you already have."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Inputs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <DraggableSlider
              id="expenses"
              label="Essential monthly expenses"
              value={values.expenses}
              onChange={(v) => setParam("expenses", v)}
              min={10_000}
              max={5_00_000}
              step={1_000}
              prefix="₹"
            />
            <DraggableSlider
              id="months"
              label="Months of cover"
              value={values.months}
              onChange={(v) => setParam("months", v)}
              min={3}
              max={24}
              step={1}
              suffix="mo"
            />
            <DraggableSlider
              id="savings"
              label="Current emergency savings"
              value={values.savings}
              onChange={(v) => setParam("savings", v)}
              min={0}
              max={1_00_00_000}
              step={10_000}
              prefix="₹"
            />
          </CardContent>
        </Card>

        <div className="space-y-6 calculator-results-sticky">
          <CalculationResultCard
            metrics={[
              {
                label: "Target emergency fund",
                value: formatINR(result.target),
                emphasize: true,
                hint: `${values.months} × monthly expenses`,
              },
              {
                label: onTrack ? "Surplus vs target" : "Gap to target",
                value: formatINR(onTrack ? result.surplus : result.gap),
              },
              {
                label: "Months covered now",
                value: formatNumber(result.monthsCoveredBySavings, 1),
              },
            ]}
            footer={
              <ExportPDFButton
                title="Emergency Fund Calculator"
                tagline="Your cash-buffer plan"
                subtitle="Emergency Fund — Aaru Wealth"
                hero={{
                  label: "Target fund",
                  value: formatINR(result.target),
                }}
                inputs={[
                  {
                    label: "Monthly expenses",
                    value: formatINR(values.expenses),
                  },
                  { label: "Months of cover", value: String(values.months) },
                  {
                    label: "Current savings",
                    value: formatINR(values.savings),
                  },
                ]}
                results={[
                  { label: "Target", value: formatINR(result.target) },
                  {
                    label: onTrack ? "Surplus" : "Gap",
                    value: formatINR(onTrack ? result.surplus : result.gap),
                  },
                ]}
                fileName="emergency-fund.pdf"
              />
            }
          >
            <ResultInterpretation points={interpretationPoints} />
          </CalculationResultCard>
        </div>
      </div>
    </CalculatorPageLayout>
  );
}

export function EmergencyFundCalculator() {
  return withCalculatorSuspense(<EmergencyFundInner />);
}
