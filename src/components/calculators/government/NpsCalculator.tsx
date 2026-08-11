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
import { calculateNps } from "@/utils/financial-math";
import { formatINR, formatPercent } from "@/lib/utils";

function NpsInner() {
  const { values, setParam } = useCalculatorParams({
    monthly: { default: 10_000 },
    years: { default: 25 },
    rate: { default: 10 },
    annuity: { default: 40 },
  });

  const result = useMemo(
    () =>
      calculateNps({
        monthlyContribution: values.monthly,
        years: values.years,
        expectedReturnPct: values.rate,
        annuityPct: values.annuity,
      }),
    [values]
  );

  return (
    <CalculatorPageLayout
      categoryHref="/calculators/government"
      categoryLabel="Govt & Fixed Income"
      crumb="NPS"
      title="Plan Your NPS Retirement Corpus"
      description="Estimate NPS corpus and the mandatory annuity vs lump-sum split."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Inputs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <DraggableSlider
              id="monthly"
              label="Monthly Contribution"
              value={values.monthly}
              onChange={(v) => setParam("monthly", v)}
              min={500}
              max={1_00_000}
              step={500}
              prefix="₹"
            />
            <DraggableSlider
              id="years"
              label="Years to Retirement"
              value={values.years}
              onChange={(v) => setParam("years", v)}
              min={5}
              max={40}
              step={1}
              suffix="yrs"
            />
            <DraggableSlider
              id="rate"
              label="Expected Return"
              value={values.rate}
              onChange={(v) => setParam("rate", v)}
              min={6}
              max={14}
              step={0.1}
              suffix="%"
            />
            <DraggableSlider
              id="annuity"
              label="Annuity Purchase %"
              value={values.annuity}
              onChange={(v) => setParam("annuity", v)}
              min={40}
              max={100}
              step={5}
              suffix="%"
            />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Lump Sum vs Annuity</CardTitle>
            </CardHeader>
            <CardContent>
              <FinancialDonutChart
                data={[
                  { name: "Lump sum", value: result.lumpSum },
                  {
                    name: "Annuity corpus",
                    value: result.annuityAmount,
                    color: "hsl(32 95% 44%)",
                  },
                ]}
                centerLabel="Corpus"
                centerValue={formatINR(result.corpus, true)}
              />
            </CardContent>
          </Card>

          <CalculationResultCard
            metrics={[
              {
                label: "Projected Corpus",
                value: formatINR(result.corpus),
                emphasize: true,
              },
              { label: "Lump sum", value: formatINR(result.lumpSum) },
              {
                label: "Annuity amount",
                value: formatINR(result.annuityAmount),
              },
              {
                label: "Total invested",
                value: formatINR(result.totalInvested),
              },
            ]}
            footer={
              <ExportPDFButton
                title="Plan Your NPS Retirement Corpus"
                subtitle="NPS — Aaru Wealth"
                inputs={[
                  { label: "Monthly", value: formatINR(values.monthly) },
                  { label: "Years", value: String(values.years) },
                  { label: "Return", value: formatPercent(values.rate) },
                ]}
                results={[
                  { label: "Corpus", value: formatINR(result.corpus) },
                  { label: "Lump sum", value: formatINR(result.lumpSum) },
                ]}
                fileName="nps.pdf"
              />
            }
          />
        </div>
      </div>
    </CalculatorPageLayout>
  );
}

export function NpsCalculator() {
  return withCalculatorSuspense(<NpsInner />);
}
