"use client";

import { useMemo } from "react";
import {
  CalculationResultCard,
  DraggableSlider,
  ExportPDFButton,
  ResultInterpretation,
  SensitivityBands,
  rateBandHint,
} from "@/components/calculators";
import {
  CalculatorPageLayout,
  withCalculatorSuspense,
} from "@/components/calculators/CalculatorPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCalculatorParams } from "@/hooks/useCalculatorParams";
import { rateSensitivityBands } from "@/lib/sensitivity";
import { calculateInflationPlan } from "@/utils/financial-math";
import { formatINR, formatPercent } from "@/lib/utils";

function InflationInner() {
  const { values, setParam } = useCalculatorParams({
    amount: { default: 1_00_000 },
    inflation: { default: 6 },
    years: { default: 10 },
    nominal: { default: 12 },
  });

  const result = useMemo(
    () =>
      calculateInflationPlan({
        presentAmount: values.amount,
        inflationPct: values.inflation,
        years: values.years,
        nominalReturnPct: values.nominal,
      }),
    [values]
  );

  const bands = useMemo(() => {
    return rateSensitivityBands(values.inflation, 2, {
      min: 1,
      max: 15,
      labels: ["Lower inflation", "Your assumption", "Higher inflation"],
    }).map((b) => {
      const r = calculateInflationPlan({
        presentAmount: values.amount,
        inflationPct: b.ratePct,
        years: values.years,
        nominalReturnPct: values.nominal,
      });
      return {
        label: b.label,
        hint: rateBandHint(b.ratePct),
        value: formatINR(r.futureCost, true),
        emphasize: b.key === "base",
      };
    });
  }, [values]);

  const interpretationPoints = [
    `At ${formatPercent(values.inflation, 1)} inflation, something costing ${formatINR(values.amount, true)} today may cost about ${formatINR(result.futureCost, true)} in ${values.years} years.`,
    `That is roughly ${formatPercent(result.erodedPct, 0)} higher in nominal terms — purchasing power of cash falls unless returns beat inflation.`,
    `With a ${formatPercent(values.nominal, 1)} nominal return assumption, real return is about ${formatPercent(result.realReturnPct, 1)} after inflation.`,
  ];

  return (
    <CalculatorPageLayout
      seoKey="investment/inflation"
      categoryHref="/calculators/investment"
      categoryLabel="Investment & Wealth"
      crumb="Inflation"
      title="See How Inflation Changes Costs"
      description="Project future prices and real returns with transparent inflation assumptions."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Inputs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <DraggableSlider
              id="amount"
              label="Today's cost / amount"
              value={values.amount}
              onChange={(v) => setParam("amount", v)}
              min={1_000}
              max={1_00_00_000}
              step={1_000}
              prefix="₹"
            />
            <DraggableSlider
              id="inflation"
              label="Inflation (p.a.)"
              value={values.inflation}
              onChange={(v) => setParam("inflation", v)}
              min={1}
              max={15}
              step={0.1}
              suffix="%"
            />
            <DraggableSlider
              id="years"
              label="Years ahead"
              value={values.years}
              onChange={(v) => setParam("years", v)}
              min={1}
              max={40}
              step={1}
              suffix="yrs"
            />
            <DraggableSlider
              id="nominal"
              label="Optional nominal return"
              value={values.nominal}
              onChange={(v) => setParam("nominal", v)}
              min={0}
              max={20}
              step={0.1}
              suffix="%"
            />
          </CardContent>
        </Card>

        <div className="space-y-6 calculator-results-sticky">
          <CalculationResultCard
            metrics={[
              {
                label: "Future cost",
                value: formatINR(result.futureCost),
                emphasize: true,
                hint: `${values.years} years · ${formatPercent(values.inflation, 1)} inflation`,
              },
              {
                label: "Price increase",
                value: formatPercent(result.erodedPct, 0),
              },
              {
                label: "Real return (illustrative)",
                value: formatPercent(result.realReturnPct, 1),
                hint: `From ${formatPercent(values.nominal, 1)} nominal`,
              },
            ]}
            footer={
              <ExportPDFButton
                title="Inflation Calculator"
                tagline="Your inflation impact summary"
                subtitle="Inflation — Aaru Wealth"
                hero={{
                  label: "Future cost",
                  value: formatINR(result.futureCost),
                  hint: `${values.years}-year horizon`,
                }}
                inputs={[
                  { label: "Today's amount", value: formatINR(values.amount) },
                  { label: "Inflation", value: formatPercent(values.inflation) },
                  { label: "Years", value: String(values.years) },
                  {
                    label: "Nominal return",
                    value: formatPercent(values.nominal),
                  },
                ]}
                results={[
                  {
                    label: "Future cost",
                    value: formatINR(result.futureCost),
                  },
                  {
                    label: "Real return",
                    value: formatPercent(result.realReturnPct),
                  },
                ]}
                fileName="inflation.pdf"
              />
            }
          >
            <ResultInterpretation points={interpretationPoints} />
            <SensitivityBands
              parameterLabel="inflation (p.a.)"
              bands={bands}
            />
          </CalculationResultCard>
        </div>
      </div>
    </CalculatorPageLayout>
  );
}

export function InflationCalculator() {
  return withCalculatorSuspense(<InflationInner />);
}
