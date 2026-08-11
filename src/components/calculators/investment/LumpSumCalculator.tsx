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
import {
  InflationTaxToggles,
  resolveMaturityDisplay,
} from "@/components/calculators/InflationTaxToggles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCalculatorParams } from "@/hooks/useCalculatorParams";
import { calculateLumpSum } from "@/utils/financial-math";
import { formatINR, formatPercent } from "@/lib/utils";

function LumpSumInner() {
  const { values, setParam } = useCalculatorParams({
    principal: { default: 10_00_000 },
    rate: { default: 12 },
    years: { default: 10 },
    inflation: { default: 6 },
    adjustInflation: { default: false },
    postTax: { default: false },
  });

  const result = useMemo(
    () =>
      calculateLumpSum({
        principal: values.principal,
        annualRatePct: values.rate,
        years: values.years,
        inflationPct: values.adjustInflation ? values.inflation : 0,
        postTax: values.postTax,
      }),
    [values]
  );

  const { maturityDisplay, chartGain, maturityLabel } = resolveMaturityDisplay({
    ...result,
    adjustInflation: values.adjustInflation,
    postTax: values.postTax,
  });

  return (
    <CalculatorPageLayout
      seoKey="investment/lump-sum"
      categoryHref="/calculators/investment"
      categoryLabel="Investment & Wealth"
      crumb="Lump Sum"
      title="Grow a One-Time Investment"
      description="Estimate corpus from a single lump-sum investment with inflation and post-tax toggles."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Inputs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <DraggableSlider
              id="principal"
              label="Investment Amount"
              value={values.principal}
              onChange={(v) => setParam("principal", v)}
              min={10_000}
              max={5_00_00_000}
              step={10_000}
              prefix="₹"
            />
            <DraggableSlider
              id="rate"
              label="Expected Return (p.a.)"
              value={values.rate}
              onChange={(v) => setParam("rate", v)}
              min={1}
              max={30}
              step={0.1}
              suffix="%"
            />
            <DraggableSlider
              id="years"
              label="Investment Period"
              value={values.years}
              onChange={(v) => setParam("years", v)}
              min={1}
              max={40}
              step={1}
              suffix="yrs"
            />
            <InflationTaxToggles
              adjustInflation={values.adjustInflation}
              onAdjustInflation={(v) => setParam("adjustInflation", v)}
              inflation={values.inflation}
              onInflation={(v) => setParam("inflation", v)}
              postTax={values.postTax}
              onPostTax={(v) => setParam("postTax", v)}
            />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Principal vs Wealth Gained</CardTitle>
            </CardHeader>
            <CardContent>
              <FinancialDonutChart
                data={[
                  { name: "Principal", value: result.invested },
                  { name: "Wealth Gained", value: Math.max(0, chartGain) },
                ]}
                centerLabel="Maturity"
                centerValue={formatINR(maturityDisplay, true)}
              />
            </CardContent>
          </Card>

          <CalculationResultCard
            metrics={[
              { label: "Invested", value: formatINR(result.invested) },
              {
                label: maturityLabel,
                value: formatINR(maturityDisplay),
                emphasize: true,
              },
              {
                label: "Wealth Gained",
                value: formatINR(maturityDisplay - result.invested),
              },
            ]}
            footer={
              <ExportPDFButton
                title="Grow a One-Time Investment"
                subtitle="Lump Sum — Aaru Wealth"
                inputs={[
                  { label: "Principal", value: formatINR(values.principal) },
                  { label: "Return", value: formatPercent(values.rate) },
                  { label: "Years", value: String(values.years) },
                ]}
                results={[
                  { label: "Maturity", value: formatINR(maturityDisplay) },
                  {
                    label: "Gain",
                    value: formatINR(maturityDisplay - result.invested),
                  },
                ]}
                fileName="lump-sum.pdf"
              />
            }
          />
        </div>
      </div>
    </CalculatorPageLayout>
  );
}

export function LumpSumCalculator() {
  return withCalculatorSuspense(<LumpSumInner />);
}
