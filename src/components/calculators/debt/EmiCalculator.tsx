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
import { basicEmi } from "@/utils/financial-math";
import { formatINR, formatNumber, formatPercent } from "@/lib/utils";

function EmiInner() {
  const { values, setParam } = useCalculatorParams({
    principal: { default: 50_00_000 },
    rate: { default: 8.5 },
    tenure: { default: 20 },
  });

  const result = useMemo(
    () =>
      basicEmi({
        principal: values.principal,
        annualRatePct: values.rate,
        tenureMonths: values.tenure * 12,
      }),
    [values]
  );

  return (
    <CalculatorPageLayout
      categoryHref="/calculators/debt"
      categoryLabel="Debt Management"
      crumb="EMI"
      title="Know Your Exact Monthly EMI"
      description="Calculate EMI, total interest, and principal vs interest breakup instantly."
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
              label="Interest Rate (p.a.)"
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

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Principal vs Interest Paid</CardTitle>
            </CardHeader>
            <CardContent>
              <FinancialDonutChart
                data={[
                  { name: "Principal", value: values.principal },
                  {
                    name: "Interest Paid",
                    value: result.totalInterest,
                    color: "hsl(0 72% 51%)",
                  },
                ]}
                centerLabel="EMI"
                centerValue={formatINR(result.emi, true)}
              />
            </CardContent>
          </Card>

          <CalculationResultCard
            metrics={[
              {
                label: "Monthly EMI",
                value: formatINR(result.emi),
                emphasize: true,
              },
              { label: "Total Interest", value: formatINR(result.totalInterest) },
              { label: "Total Payment", value: formatINR(result.totalPayment) },
            ]}
            footer={
              <ExportPDFButton
                title="Know Your Exact Monthly EMI"
                subtitle="EMI Calculator — IndiaCalc"
                inputs={[
                  { label: "Principal", value: formatINR(values.principal) },
                  { label: "Rate", value: formatPercent(values.rate) },
                  { label: "Tenure", value: `${values.tenure} yrs` },
                ]}
                results={[
                  { label: "EMI", value: formatINR(result.emi) },
                  {
                    label: "Total Interest",
                    value: formatINR(result.totalInterest),
                  },
                ]}
                table={{
                  columns: [
                    { header: "Mo", key: "month" },
                    { header: "EMI", key: "emi" },
                    { header: "Principal", key: "p" },
                    { header: "Interest", key: "i" },
                    { header: "Balance", key: "b" },
                  ],
                  rows: result.schedule.map((r) => ({
                    month: r.month,
                    emi: formatNumber(r.emi),
                    p: formatNumber(r.principalComponent),
                    i: formatNumber(r.interestComponent),
                    b: formatNumber(r.balance),
                  })),
                  maxRows: 240,
                }}
                fileName="emi.pdf"
              />
            }
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Amortization Schedule</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="py-2 pr-3 font-medium">Month</th>
                <th className="py-2 pr-3 font-medium">EMI</th>
                <th className="py-2 pr-3 font-medium">Principal</th>
                <th className="py-2 pr-3 font-medium">Interest</th>
                <th className="py-2 font-medium">Balance</th>
              </tr>
            </thead>
            <tbody>
              {result.schedule.map((row) => (
                <tr
                  key={row.month}
                  className="border-b border-border/60 tabular-nums hover:bg-muted/40"
                >
                  <td className="py-1.5 pr-3">{row.month}</td>
                  <td className="py-1.5 pr-3">{formatINR(row.emi)}</td>
                  <td className="py-1.5 pr-3">
                    {formatINR(row.principalComponent)}
                  </td>
                  <td className="py-1.5 pr-3">
                    {formatINR(row.interestComponent)}
                  </td>
                  <td className="py-1.5">{formatINR(row.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </CalculatorPageLayout>
  );
}

export function EmiCalculator() {
  return withCalculatorSuspense(<EmiInner />);
}
