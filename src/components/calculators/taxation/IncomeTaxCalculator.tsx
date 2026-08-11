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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useCalculatorParams } from "@/hooks/useCalculatorParams";
import { calculateIncomeTax } from "@/utils/financial-math";
import { formatINR, formatPercent } from "@/lib/utils";

function IncomeTaxInner() {
  const { values, setParam } = useCalculatorParams({
    income: { default: 18_00_000 },
    ded80c: { default: 1_50_000 },
    otherDed: { default: 50_000 },
    exemptions: { default: 0 },
    salaried: { default: true },
  });

  const result = useMemo(
    () =>
      calculateIncomeTax({
        grossIncome: values.income,
        deductions80C: values.ded80c,
        otherDeductions: values.otherDed,
        exemptions: values.exemptions,
        isSalaried: values.salaried,
      }),
    [values]
  );

  return (
    <CalculatorPageLayout
      seoKey="taxation/income-tax"
      categoryHref="/calculators/taxation"
      categoryLabel="Taxation & Salary"
      crumb="Income Tax"
      title="Old vs New Tax Regime Compared"
      description="Side-by-side FY 2025-26 tax under both regimes with 87A rebate and 4% cess."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Inputs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <DraggableSlider
              id="income"
              label="Gross Annual Income"
              value={values.income}
              onChange={(v) => setParam("income", v)}
              min={3_00_000}
              max={1_00_00_000}
              step={25_000}
              prefix="₹"
            />
            <div className="flex items-center justify-between rounded-md border bg-muted/30 px-3 py-2">
              <Label htmlFor="salaried">Salaried (standard deduction)</Label>
              <Switch
                id="salaried"
                checked={values.salaried}
                onCheckedChange={(v) => setParam("salaried", v)}
              />
            </div>
            <DraggableSlider
              id="ded80c"
              label="80C Deductions (old regime)"
              value={values.ded80c}
              onChange={(v) => setParam("ded80c", v)}
              min={0}
              max={1_50_000}
              step={5_000}
              prefix="₹"
            />
            <DraggableSlider
              id="otherDed"
              label="Other Deductions (old)"
              value={values.otherDed}
              onChange={(v) => setParam("otherDed", v)}
              min={0}
              max={5_00_000}
              step={5_000}
              prefix="₹"
            />
            <DraggableSlider
              id="exemptions"
              label="Exemptions e.g. HRA (old)"
              value={values.exemptions}
              onChange={(v) => setParam("exemptions", v)}
              min={0}
              max={5_00_000}
              step={5_000}
              prefix="₹"
            />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Old vs New Tax Liability</CardTitle>
            </CardHeader>
            <CardContent>
              <FinancialDonutChart
                data={[
                  {
                    name: "Old regime tax",
                    value: result.old.totalTax,
                    color: "hsl(0 72% 51%)",
                  },
                  {
                    name: "New regime tax",
                    value: result.new.totalTax,
                  },
                ]}
                centerLabel="Better"
                centerValue={
                  result.better === "same"
                    ? "Tie"
                    : result.better === "new"
                      ? "New"
                      : "Old"
                }
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <CalculationResultCard
          title="Old Regime"
          metrics={[
            {
              label: "Taxable income",
              value: formatINR(result.old.taxableIncome),
            },
            { label: "Rebate 87A", value: formatINR(result.old.rebate87A) },
            {
              label: "Total tax (incl. cess)",
              value: formatINR(result.old.totalTax),
              emphasize: true,
            },
            {
              label: "Effective rate",
              value: formatPercent(result.old.effectiveRate),
            },
          ]}
        />
        <CalculationResultCard
          title="New Regime (default)"
          metrics={[
            {
              label: "Taxable income",
              value: formatINR(result.new.taxableIncome),
            },
            { label: "Rebate 87A", value: formatINR(result.new.rebate87A) },
            {
              label: "Total tax (incl. cess)",
              value: formatINR(result.new.totalTax),
              emphasize: true,
            },
            {
              label: "Effective rate",
              value: formatPercent(result.new.effectiveRate),
            },
          ]}
          footer={
            <ExportPDFButton
              title="Old vs New Tax Regime Compared"
              subtitle="Income Tax — Aaru Wealth"
              inputs={[
                { label: "Gross income", value: formatINR(values.income) },
                { label: "80C", value: formatINR(values.ded80c) },
              ]}
              results={[
                { label: "Old tax", value: formatINR(result.old.totalTax) },
                { label: "New tax", value: formatINR(result.new.totalTax) },
                { label: "Better", value: result.better },
              ]}
              fileName="income-tax.pdf"
            />
          }
        />
      </div>
    </CalculatorPageLayout>
  );
}

export function IncomeTaxCalculator() {
  return withCalculatorSuspense(<IncomeTaxInner />);
}
