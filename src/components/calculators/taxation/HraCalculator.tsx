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
import { calculateHraExemption } from "@/utils/financial-math";
import { formatINR } from "@/lib/utils";

function HraInner() {
  const { values, setParam } = useCalculatorParams({
    basic: { default: 60_000 },
    hra: { default: 30_000 },
    rent: { default: 25_000 },
    metro: { default: true },
  });

  const result = useMemo(
    () =>
      calculateHraExemption({
        basicSalary: values.basic * 12,
        hraReceived: values.hra * 12,
        rentPaid: values.rent * 12,
        isMetro: values.metro,
      }),
    [values]
  );

  return (
    <CalculatorPageLayout
      categoryHref="/calculators/taxation"
      categoryLabel="Taxation & Salary"
      crumb="HRA"
      title="Maximise Your HRA Exemption"
      description="Compute exempt HRA under Section 10(13A) — minimum of the three statutory rules."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Monthly Inputs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <DraggableSlider
              id="basic"
              label="Basic Salary"
              value={values.basic}
              onChange={(v) => setParam("basic", v)}
              min={10_000}
              max={5_00_000}
              step={1_000}
              prefix="₹"
            />
            <DraggableSlider
              id="hra"
              label="HRA Received"
              value={values.hra}
              onChange={(v) => setParam("hra", v)}
              min={0}
              max={3_00_000}
              step={1_000}
              prefix="₹"
            />
            <DraggableSlider
              id="rent"
              label="Rent Paid"
              value={values.rent}
              onChange={(v) => setParam("rent", v)}
              min={0}
              max={3_00_000}
              step={1_000}
              prefix="₹"
            />
            <div className="flex items-center justify-between rounded-md border bg-muted/30 px-3 py-2">
              <Label htmlFor="metro">Metro city (50% of basic)</Label>
              <Switch
                id="metro"
                checked={values.metro}
                onCheckedChange={(v) => setParam("metro", v)}
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Exempt vs Taxable HRA</CardTitle>
            </CardHeader>
            <CardContent>
              <FinancialDonutChart
                data={[
                  { name: "Exempt HRA", value: result.exemption },
                  {
                    name: "Taxable HRA",
                    value: result.taxableHra,
                    color: "hsl(0 72% 51%)",
                  },
                ]}
                centerLabel="Annual exempt"
                centerValue={formatINR(result.exemption, true)}
              />
            </CardContent>
          </Card>

          <CalculationResultCard
            metrics={[
              {
                label: "Annual HRA exemption",
                value: formatINR(result.exemption),
                emphasize: true,
              },
              {
                label: "Taxable HRA",
                value: formatINR(result.taxableHra),
              },
              ...result.components.map((c) => ({
                label: c.rule,
                value: formatINR(c.amount),
              })),
            ]}
            footer={
              <ExportPDFButton
                title="Maximise Your HRA Exemption"
                subtitle="HRA — Aaru Wealth"
                inputs={[
                  { label: "Basic (mo)", value: formatINR(values.basic) },
                  { label: "HRA (mo)", value: formatINR(values.hra) },
                  { label: "Rent (mo)", value: formatINR(values.rent) },
                  { label: "Metro", value: values.metro ? "Yes" : "No" },
                ]}
                results={[
                  { label: "Exemption", value: formatINR(result.exemption) },
                  { label: "Taxable", value: formatINR(result.taxableHra) },
                ]}
                fileName="hra.pdf"
              />
            }
          />
        </div>
      </div>
    </CalculatorPageLayout>
  );
}

export function HraCalculator() {
  return withCalculatorSuspense(<HraInner />);
}
