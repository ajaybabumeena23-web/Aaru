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
import { calculatePpf } from "@/utils/financial-math";
import { formatINR, formatPercent } from "@/lib/utils";

function PpfInner() {
  const { values, setParam } = useCalculatorParams({
    annual: { default: 1_50_000 },
    years: { default: 15 },
    rate: { default: 7.1 },
  });

  const result = useMemo(
    () =>
      calculatePpf({
        annualDeposit: values.annual,
        years: values.years,
        ratePct: values.rate,
      }),
    [values]
  );

  return (
    <CalculatorPageLayout
      categoryHref="/calculators/government"
      categoryLabel="Govt & Fixed Income"
      crumb="PPF"
      title="Grow Tax-Free with PPF"
      description="Public Provident Fund maturity with annual deposits and compounding."
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
              min={500}
              max={1_50_000}
              step={500}
              prefix="₹"
            />
            <DraggableSlider
              id="years"
              label="Tenure"
              value={values.years}
              onChange={(v) => setParam("years", v)}
              min={15}
              max={50}
              step={1}
              suffix="yrs"
            />
            <DraggableSlider
              id="rate"
              label="Interest Rate"
              value={values.rate}
              onChange={(v) => setParam("rate", v)}
              min={6}
              max={9}
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
                label: "Maturity Value",
                value: formatINR(result.maturityValue),
                emphasize: true,
              },
              {
                label: "Total Deposited",
                value: formatINR(result.totalDeposited),
              },
              {
                label: "Interest Earned",
                value: formatINR(result.interestEarned),
              },
            ]}
            footer={
              <ExportPDFButton
                title="Grow Tax-Free with PPF"
                subtitle="PPF — Aaru Wealth"
                inputs={[
                  { label: "Annual", value: formatINR(values.annual) },
                  { label: "Years", value: String(values.years) },
                  { label: "Rate", value: formatPercent(values.rate) },
                ]}
                results={[
                  {
                    label: "Maturity",
                    value: formatINR(result.maturityValue),
                  },
                ]}
                table={{
                  columns: [
                    { header: "Year", key: "year" },
                    { header: "Deposit", key: "deposit" },
                    { header: "Balance", key: "balance" },
                  ],
                  rows: result.yearly.map((y) => ({
                    year: y.year,
                    deposit: formatINR(y.deposit),
                    balance: formatINR(y.balance),
                  })),
                }}
                fileName="ppf.pdf"
              />
            }
          />
        </div>
      </div>
    </CalculatorPageLayout>
  );
}

export function PpfCalculator() {
  return withCalculatorSuspense(<PpfInner />);
}
