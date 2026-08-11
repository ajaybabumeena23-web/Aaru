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
import { calculateEpf } from "@/utils/financial-math";
import { formatINR, formatPercent } from "@/lib/utils";

function EpfInner() {
  const { values, setParam } = useCalculatorParams({
    basic: { default: 30_000 },
    years: { default: 20 },
    rate: { default: 8.25 },
  });

  const result = useMemo(
    () =>
      calculateEpf({
        monthlyBasic: values.basic,
        years: values.years,
        ratePct: values.rate,
      }),
    [values]
  );

  const contributed =
    result.employeeContribution + result.employerContribution;

  return (
    <CalculatorPageLayout
      categoryHref="/calculators/government"
      categoryLabel="Govt & Fixed Income"
      crumb="EPF"
      title="Project Your EPF Balance"
      description="Employee Provident Fund growth with employee and employer contributions."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Inputs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <DraggableSlider
              id="basic"
              label="Monthly Basic + DA"
              value={values.basic}
              onChange={(v) => setParam("basic", v)}
              min={5_000}
              max={2_00_000}
              step={1_000}
              prefix="₹"
            />
            <DraggableSlider
              id="years"
              label="Years Remaining"
              value={values.years}
              onChange={(v) => setParam("years", v)}
              min={1}
              max={40}
              step={1}
              suffix="yrs"
            />
            <DraggableSlider
              id="rate"
              label="EPF Interest Rate"
              value={values.rate}
              onChange={(v) => setParam("rate", v)}
              min={6}
              max={10}
              step={0.05}
              suffix="%"
            />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contributions vs Interest</CardTitle>
            </CardHeader>
            <CardContent>
              <FinancialDonutChart
                data={[
                  { name: "Contributions", value: contributed },
                  { name: "Interest", value: result.interestEarned },
                ]}
                centerLabel="EPF corpus"
                centerValue={formatINR(result.maturityValue, true)}
              />
            </CardContent>
          </Card>

          <CalculationResultCard
            metrics={[
              {
                label: "Projected EPF",
                value: formatINR(result.maturityValue),
                emphasize: true,
              },
              {
                label: "Employee share",
                value: formatINR(result.employeeContribution),
              },
              {
                label: "Employer share (EPF portion)",
                value: formatINR(result.employerContribution),
              },
              {
                label: "Interest earned",
                value: formatINR(result.interestEarned),
              },
            ]}
            footer={
              <ExportPDFButton
                title="Project Your EPF Balance"
                subtitle="EPF — Aaru Wealth"
                inputs={[
                  { label: "Basic", value: formatINR(values.basic) },
                  { label: "Years", value: String(values.years) },
                  { label: "Rate", value: formatPercent(values.rate) },
                ]}
                results={[
                  {
                    label: "Corpus",
                    value: formatINR(result.maturityValue),
                  },
                ]}
                fileName="epf.pdf"
              />
            }
          />
        </div>
      </div>
    </CalculatorPageLayout>
  );
}

export function EpfCalculator() {
  return withCalculatorSuspense(<EpfInner />);
}
