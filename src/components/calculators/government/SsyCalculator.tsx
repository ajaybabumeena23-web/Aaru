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
import { calculateSsy } from "@/utils/financial-math";
import { formatINR, formatPercent } from "@/lib/utils";

function SsyInner() {
  const { values, setParam } = useCalculatorParams({
    annual: { default: 1_00_000 },
    rate: { default: 8.2 },
  });

  const result = useMemo(
    () =>
      calculateSsy({
        annualDeposit: values.annual,
        ratePct: values.rate,
      }),
    [values]
  );

  return (
    <CalculatorPageLayout
      categoryHref="/calculators/government"
      categoryLabel="Govt & Fixed Income"
      crumb="SSY"
      title="Save for Your Girl Child (SSY)"
      description="Sukanya Samriddhi Yojana — deposits for 15 years, maturity at 21."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Inputs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <DraggableSlider
              id="annual"
              label="Annual Deposit"
              value={values.annual}
              onChange={(v) => setParam("annual", v)}
              min={250}
              max={1_50_000}
              step={250}
              prefix="₹"
            />
            <DraggableSlider
              id="rate"
              label="Interest Rate"
              value={values.rate}
              onChange={(v) => setParam("rate", v)}
              min={7}
              max={10}
              step={0.1}
              suffix="%"
            />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Deposited vs Interest</CardTitle>
            </CardHeader>
            <CardContent>
              <FinancialDonutChart
                data={[
                  { name: "Deposited", value: result.totalDeposited },
                  { name: "Interest", value: result.interestEarned },
                ]}
                centerLabel="Maturity"
                centerValue={formatINR(result.maturityValue, true)}
              />
            </CardContent>
          </Card>

          <CalculationResultCard
            metrics={[
              {
                label: "Maturity at year 21",
                value: formatINR(result.maturityValue),
                emphasize: true,
              },
              {
                label: "Total deposited (15 yrs)",
                value: formatINR(result.totalDeposited),
              },
              {
                label: "Interest earned",
                value: formatINR(result.interestEarned),
              },
            ]}
            footer={
              <ExportPDFButton
                title="Save for Your Girl Child (SSY)"
                subtitle="SSY — Aaru Wealth"
                inputs={[
                  { label: "Annual", value: formatINR(values.annual) },
                  { label: "Rate", value: formatPercent(values.rate) },
                ]}
                results={[
                  {
                    label: "Maturity",
                    value: formatINR(result.maturityValue),
                  },
                ]}
                fileName="ssy.pdf"
              />
            }
          />
        </div>
      </div>
    </CalculatorPageLayout>
  );
}

export function SsyCalculator() {
  return withCalculatorSuspense(<SsyInner />);
}
