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
import {
  calculateIncomeTax,
  calculateTakeHomeSalary,
} from "@/utils/financial-math";
import { formatINR } from "@/lib/utils";

function TakeHomeInner() {
  const { values, setParam } = useCalculatorParams({
    gross: { default: 1_50_000 },
    basicPct: { default: 50 },
    epfPct: { default: 12 },
    pt: { default: 200 },
  });

  const annualGross = values.gross * 12;
  const tax = useMemo(
    () =>
      calculateIncomeTax({
        grossIncome: annualGross,
        isSalaried: true,
      }),
    [annualGross]
  );

  const result = useMemo(
    () =>
      calculateTakeHomeSalary({
        monthlyGross: values.gross,
        basicPctOfGross: values.basicPct,
        epfPct: values.epfPct,
        professionalTaxMonthly: values.pt,
        annualTaxLiability: tax.new.totalTax,
      }),
    [values, tax.new.totalTax]
  );

  const deductions =
    result.epfEmployee + result.professionalTax + result.tds;

  return (
    <CalculatorPageLayout
      seoKey="taxation/take-home-salary"
      categoryHref="/calculators/taxation"
      categoryLabel="Taxation & Salary"
      crumb="Take-Home"
      title="See Your Real In-Hand Pay"
      description="Net salary after EPF, TDS (new-regime estimate), and professional tax."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Inputs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <DraggableSlider
              id="gross"
              label="Monthly Gross"
              value={values.gross}
              onChange={(v) => setParam("gross", v)}
              min={20_000}
              max={10_00_000}
              step={5_000}
              prefix="₹"
            />
            <DraggableSlider
              id="basicPct"
              label="Basic as % of Gross"
              value={values.basicPct}
              onChange={(v) => setParam("basicPct", v)}
              min={30}
              max={70}
              step={1}
              suffix="%"
            />
            <DraggableSlider
              id="epfPct"
              label="Employee EPF %"
              value={values.epfPct}
              onChange={(v) => setParam("epfPct", v)}
              min={0}
              max={12}
              step={1}
              suffix="%"
            />
            <DraggableSlider
              id="pt"
              label="Professional Tax"
              value={values.pt}
              onChange={(v) => setParam("pt", v)}
              min={0}
              max={2500}
              step={50}
              prefix="₹"
            />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">In-Hand vs Deductions</CardTitle>
            </CardHeader>
            <CardContent>
              <FinancialDonutChart
                data={[
                  { name: "Take-home", value: result.netMonthly },
                  {
                    name: "Deductions",
                    value: deductions,
                    color: "hsl(0 72% 51%)",
                  },
                ]}
                centerLabel="In-hand"
                centerValue={formatINR(result.netMonthly, true)}
              />
            </CardContent>
          </Card>

          <CalculationResultCard
            metrics={[
              {
                label: "Monthly take-home",
                value: formatINR(result.netMonthly),
                emphasize: true,
              },
              { label: "EPF (employee)", value: formatINR(result.epfEmployee) },
              { label: "Est. TDS", value: formatINR(result.tds) },
              {
                label: "Professional tax",
                value: formatINR(result.professionalTax),
              },
            ]}
            footer={
              <ExportPDFButton
                title="See Your Real In-Hand Pay"
                tagline="Your personalized take-home salary summary"
                subtitle="Take-Home Salary — Aaru Wealth"
                hero={{
                  label: "Monthly Take-Home",
                  value: formatINR(result.netMonthly),
                  hint: "After EPF, TDS & professional tax",
                }}
                inputs={[
                  {
                    label: "Monthly Gross",
                    value: formatINR(values.gross),
                  },
                  {
                    label: "Basic as % of Gross",
                    value: `${values.basicPct}%`,
                  },
                  {
                    label: "Employee EPF %",
                    value: `${values.epfPct}%`,
                  },
                  {
                    label: "Professional Tax",
                    value: formatINR(values.pt),
                  },
                ]}
                results={[
                  {
                    label: "Monthly Take-Home",
                    value: formatINR(result.netMonthly),
                  },
                  {
                    label: "EPF (Employee)",
                    value: formatINR(result.epfEmployee),
                  },
                  {
                    label: "Est. TDS",
                    value: formatINR(result.tds),
                  },
                  {
                    label: "Professional Tax",
                    value: formatINR(result.professionalTax),
                  },
                ]}
                chartSlices={[
                  {
                    label: "Take-home",
                    value: result.netMonthly,
                    color: "#13192B",
                  },
                  {
                    label: "Deductions",
                    value: deductions,
                    color: "#F7C615",
                  },
                ]}
                journey={[
                  `${formatINR(values.gross, true)} monthly gross`,
                  `${formatINR(deductions, true)} deductions`,
                  `${formatINR(result.netMonthly, true)} in-hand`,
                ]}
                fileName="take-home.pdf"
              />
            }
          />
        </div>
      </div>
    </CalculatorPageLayout>
  );
}

export function TakeHomeCalculator() {
  return withCalculatorSuspense(<TakeHomeInner />);
}
