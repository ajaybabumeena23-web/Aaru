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
import { flatVsReducing } from "@/utils/financial-math";
import { formatINR, formatPercent } from "@/lib/utils";

function FlatVsReducingInner() {
  const { values, setParam } = useCalculatorParams({
    principal: { default: 5_00_000 },
    flatRate: { default: 12 },
    tenure: { default: 3 },
  });

  const result = useMemo(
    () =>
      flatVsReducing({
        principal: values.principal,
        flatRatePct: values.flatRate,
        tenureMonths: values.tenure * 12,
      }),
    [values]
  );

  return (
    <CalculatorPageLayout
      categoryHref="/calculators/debt"
      categoryLabel="Debt Management"
      crumb="Flat vs Reducing"
      title="Unmask Flat Rate Loans"
      description="Compare advertised flat rates with true reducing-balance equivalents."
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
              min={50_000}
              max={50_00_000}
              step={10_000}
              prefix="₹"
            />
            <DraggableSlider
              id="flatRate"
              label="Quoted Flat Rate"
              value={values.flatRate}
              onChange={(v) => setParam("flatRate", v)}
              min={5}
              max={25}
              step={0.1}
              suffix="%"
            />
            <DraggableSlider
              id="tenure"
              label="Tenure"
              value={values.tenure}
              onChange={(v) => setParam("tenure", v)}
              min={1}
              max={7}
              step={1}
              suffix="yrs"
            />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Flat vs Reducing Interest</CardTitle>
            </CardHeader>
            <CardContent>
              <FinancialDonutChart
                data={[
                  {
                    name: "Flat interest",
                    value: result.flatTotalInterest,
                    color: "hsl(0 72% 51%)",
                  },
                  {
                    name: "Reducing interest (same %)",
                    value: result.reducingTotalInterest,
                  },
                ]}
                centerLabel="Equiv. reducing"
                centerValue={formatPercent(result.equivalentReducingRatePct)}
              />
            </CardContent>
          </Card>

          <CalculationResultCard
            metrics={[
              { label: "Flat EMI", value: formatINR(result.flatEmi) },
              {
                label: "Flat total interest",
                value: formatINR(result.flatTotalInterest),
              },
              {
                label: "Equivalent reducing rate",
                value: formatPercent(result.equivalentReducingRatePct),
                emphasize: true,
                hint: "True cost of the quoted flat rate",
              },
              {
                label: "Reducing EMI (same % quote)",
                value: formatINR(result.reducingEmi),
              },
            ]}
            footer={
              <ExportPDFButton
                title="Unmask Flat Rate Loans"
                subtitle="Flat vs Reducing — Aaru Wealth"
                inputs={[
                  { label: "Principal", value: formatINR(values.principal) },
                  { label: "Flat rate", value: formatPercent(values.flatRate) },
                ]}
                results={[
                  {
                    label: "Equivalent reducing",
                    value: formatPercent(result.equivalentReducingRatePct),
                  },
                  {
                    label: "Flat interest",
                    value: formatINR(result.flatTotalInterest),
                  },
                ]}
                fileName="flat-vs-reducing.pdf"
              />
            }
          />
        </div>
      </div>
    </CalculatorPageLayout>
  );
}

export function FlatVsReducingCalculator() {
  return withCalculatorSuspense(<FlatVsReducingInner />);
}
