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
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCalculatorParams } from "@/hooks/useCalculatorParams";
import { calculateCagr, projectWithCagr } from "@/utils/financial-math";
import { formatINR, formatPercent } from "@/lib/utils";

function CagrInner() {
  const { values, setParam } = useCalculatorParams({
    mode: { default: "cagr" as string },
    start: { default: 10_00_000 },
    end: { default: 30_00_000 },
    years: { default: 10 },
    cagr: { default: 12 },
  });

  const mode = values.mode === "project" ? "project" : "cagr";

  const result = useMemo(() => {
    if (mode === "project") {
      const endValue = projectWithCagr({
        startValue: values.start,
        cagrPct: values.cagr,
        years: values.years,
      });
      return {
        cagrPct: values.cagr,
        endValue,
        multiple: values.start > 0 ? endValue / values.start : 0,
      };
    }
    const c = calculateCagr({
      startValue: values.start,
      endValue: values.end,
      years: values.years,
    });
    return {
      cagrPct: c.cagrPct,
      endValue: values.end,
      multiple: c.multiple,
    };
  }, [values, mode]);

  const interpretationPoints =
    mode === "project"
      ? [
          `Growing ${formatINR(values.start, true)} at ${formatPercent(values.cagr, 1)} CAGR for ${values.years} years projects about ${formatINR(result.endValue, true)}.`,
          `That is roughly a ${result.multiple.toFixed(2)}× multiple of the starting value.`,
          "CAGR assumes a smooth path — actual year-by-year returns can differ a lot.",
        ]
      : [
          `Going from ${formatINR(values.start, true)} to ${formatINR(values.end, true)} over ${values.years} years implies about ${formatPercent(result.cagrPct, 1)} CAGR.`,
          `Wealth multiple is about ${result.multiple.toFixed(2)}×.`,
          "CAGR is a mathematical summary of start and end values — not a guarantee of future returns.",
        ];

  return (
    <CalculatorPageLayout
      seoKey="investment/cagr"
      categoryHref="/calculators/investment"
      categoryLabel="Investment & Wealth"
      crumb="CAGR"
      title="Measure Compound Annual Growth"
      description="Calculate CAGR from start and end values, or project an ending corpus from a CAGR assumption."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Inputs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Mode</Label>
              <Tabs
                value={mode}
                onValueChange={(v) => setParam("mode", v)}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="cagr">Find CAGR</TabsTrigger>
                  <TabsTrigger value="project">Project corpus</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <DraggableSlider
              id="start"
              label="Starting value"
              value={values.start}
              onChange={(v) => setParam("start", v)}
              min={1_000}
              max={5_00_00_000}
              step={10_000}
              prefix="₹"
            />

            {mode === "cagr" ? (
              <DraggableSlider
                id="end"
                label="Ending value"
                value={values.end}
                onChange={(v) => setParam("end", v)}
                min={1_000}
                max={10_00_00_000}
                step={10_000}
                prefix="₹"
              />
            ) : (
              <DraggableSlider
                id="cagr"
                label="Assumed CAGR"
                value={values.cagr}
                onChange={(v) => setParam("cagr", v)}
                min={-20}
                max={40}
                step={0.1}
                suffix="%"
              />
            )}

            <DraggableSlider
              id="years"
              label="Years"
              value={values.years}
              onChange={(v) => setParam("years", v)}
              min={1}
              max={40}
              step={1}
              suffix="yrs"
            />
          </CardContent>
        </Card>

        <div className="space-y-6 calculator-results-sticky">
          <CalculationResultCard
            metrics={[
              {
                label: mode === "cagr" ? "CAGR" : "Projected value",
                value:
                  mode === "cagr"
                    ? formatPercent(result.cagrPct, 1)
                    : formatINR(result.endValue),
                emphasize: true,
                hint: `${values.years} year horizon`,
              },
              {
                label: mode === "cagr" ? "Ending value" : "Assumed CAGR",
                value:
                  mode === "cagr"
                    ? formatINR(result.endValue)
                    : formatPercent(result.cagrPct, 1),
              },
              {
                label: "Multiple",
                value: `${result.multiple.toFixed(2)}×`,
              },
            ]}
            footer={
              <ExportPDFButton
                title="CAGR Calculator"
                tagline="Your growth-rate summary"
                subtitle="CAGR — Aaru Wealth"
                hero={{
                  label: mode === "cagr" ? "CAGR" : "Projected value",
                  value:
                    mode === "cagr"
                      ? formatPercent(result.cagrPct, 1)
                      : formatINR(result.endValue),
                }}
                inputs={[
                  { label: "Starting value", value: formatINR(values.start) },
                  {
                    label: mode === "cagr" ? "Ending value" : "CAGR",
                    value:
                      mode === "cagr"
                        ? formatINR(values.end)
                        : formatPercent(values.cagr),
                  },
                  { label: "Years", value: String(values.years) },
                ]}
                results={[
                  { label: "CAGR", value: formatPercent(result.cagrPct, 1) },
                  {
                    label: "Ending / projected",
                    value: formatINR(result.endValue),
                  },
                ]}
                fileName="cagr.pdf"
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

export function CagrCalculator() {
  return withCalculatorSuspense(<CagrInner />);
}
