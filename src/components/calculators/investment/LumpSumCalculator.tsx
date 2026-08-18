"use client";

import { useMemo } from "react";
import {
  CalculationResultCard,
  DraggableSlider,
  ExportPDFButton,
  FinancialDonutChart,
  ResultInterpretation,
  SensitivityBands,
  rateBandHint,
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
import { rateSensitivityBands } from "@/lib/sensitivity";
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

  const rateBands = useMemo(() => {
    return rateSensitivityBands(values.rate, 2, { min: 1, max: 30 }).map((b) => {
      const r = calculateLumpSum({
        principal: values.principal,
        annualRatePct: b.ratePct,
        years: values.years,
        inflationPct: values.adjustInflation ? values.inflation : 0,
        postTax: values.postTax,
      });
      const { maturityDisplay: m } = resolveMaturityDisplay({
        ...r,
        adjustInflation: values.adjustInflation,
        postTax: values.postTax,
      });
      return {
        label: b.label,
        hint: rateBandHint(b.ratePct),
        value: formatINR(m, true),
        emphasize: b.key === "base",
      };
    });
  }, [values]);

  const gain = maturityDisplay - result.invested;
  const interpretationPoints = [
    `Investing ${formatINR(values.principal, true)} once for ${values.years} year${values.years === 1 ? "" : "s"} at ${formatPercent(values.rate, 1)} projects about ${formatINR(maturityDisplay, true)}.`,
    `Estimated gain is ${formatINR(gain, true)} on top of your principal.`,
    "Lump-sum outcomes swing with return assumptions — compare the bands below before deciding.",
  ];

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
              {
                label: maturityLabel,
                value: formatINR(maturityDisplay),
                emphasize: true,
                hint: `${values.years} year${values.years === 1 ? "" : "s"} · ${formatPercent(values.rate, 1)} p.a.`,
              },
              { label: "Invested", value: formatINR(result.invested) },
              {
                label: "Wealth Gained",
                value: formatINR(gain),
              },
            ]}
            footer={
              <ExportPDFButton
                title="Grow a One-Time Investment"
                tagline="Your personalized lump-sum investment summary"
                subtitle="Lump Sum — Aaru Wealth"
                hero={{
                  label: maturityLabel,
                  value: formatINR(maturityDisplay),
                  hint: `${values.years} year${values.years === 1 ? "" : "s"} horizon`,
                }}
                inputs={[
                  {
                    label: "Invested Amount",
                    value: formatINR(values.principal),
                  },
                  {
                    label: "Expected Return",
                    value: formatPercent(values.rate),
                  },
                  {
                    label: "Investment Period",
                    value: `${values.years} Year${values.years === 1 ? "" : "s"}`,
                  },
                ]}
                results={[
                  {
                    label: "Invested Amount",
                    value: formatINR(result.invested),
                  },
                  {
                    label: maturityLabel,
                    value: formatINR(maturityDisplay),
                  },
                  {
                    label: "Wealth Gained",
                    value: formatINR(maturityDisplay - result.invested),
                  },
                ]}
                chartSlices={[
                  {
                    label: "Principal",
                    value: result.invested,
                    color: "#13192B",
                  },
                  {
                    label: "Wealth Gained",
                    value: Math.max(0, chartGain),
                    color: "#F7C615",
                  },
                ]}
                balanceSeries={result.monthlySeries.map((r) => r.value)}
                balanceChartTitle="Corpus growth over time"
                journey={[
                  `${formatINR(values.principal, true)} invested once`,
                  `${values.years} years of compounding`,
                  `${formatINR(maturityDisplay, true)} at maturity`,
                ]}
                fileName="lump-sum.pdf"
              />
            }
          >
            <ResultInterpretation points={interpretationPoints} />
            <SensitivityBands
              parameterLabel="expected return (p.a.)"
              bands={rateBands}
            />
          </CalculationResultCard>
        </div>
      </div>
    </CalculatorPageLayout>
  );
}

export function LumpSumCalculator() {
  return withCalculatorSuspense(<LumpSumInner />);
}
