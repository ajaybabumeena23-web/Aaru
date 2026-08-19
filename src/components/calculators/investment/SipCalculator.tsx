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
  HighReturnCaution,
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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useCalculatorParams } from "@/hooks/useCalculatorParams";
import { rateSensitivityBands } from "@/lib/sensitivity";
import { calculateSip } from "@/utils/financial-math";
import { formatINR, formatPercent } from "@/lib/utils";
import Link from "next/link";

function SipInner() {
  const { values, setParam } = useCalculatorParams({
    monthly: { default: 25_000 },
    rate: { default: 12 },
    years: { default: 15 },
    inflation: { default: 6 },
    adjustInflation: { default: false },
    postTax: { default: false },
    advanced: { default: false },
  });

  const result = useMemo(
    () =>
      calculateSip({
        monthlyInvestment: values.monthly,
        annualRatePct: values.rate,
        years: values.years,
        inflationPct:
          values.advanced && values.adjustInflation ? values.inflation : 0,
        postTax: values.advanced && values.postTax,
      }),
    [values]
  );

  const adjustInflation = values.advanced && values.adjustInflation;
  const postTax = values.advanced && values.postTax;

  const { maturityDisplay, chartGain, maturityLabel } = resolveMaturityDisplay({
    ...result,
    adjustInflation,
    postTax,
  });

  const rateBands = useMemo(() => {
    const bands = rateSensitivityBands(values.rate, 2, { min: 1, max: 30 });
    return bands.map((b) => {
      const r = calculateSip({
        monthlyInvestment: values.monthly,
        annualRatePct: b.ratePct,
        years: values.years,
        inflationPct: adjustInflation ? values.inflation : 0,
        postTax,
      });
      const { maturityDisplay: m } = resolveMaturityDisplay({
        ...r,
        adjustInflation,
        postTax,
      });
      return {
        label: b.label,
        hint: rateBandHint(b.ratePct),
        value: formatINR(m, true),
        emphasize: b.key === "base",
        sub: `Gain ${formatINR(m - r.invested, true)}`,
      };
    });
  }, [
    values.monthly,
    values.rate,
    values.years,
    values.inflation,
    adjustInflation,
    postTax,
  ]);

  const gain = maturityDisplay - result.invested;
  const multiple =
    result.invested > 0 ? (maturityDisplay / result.invested).toFixed(1) : "—";

  const interpretationPoints = [
    `A ${formatINR(values.monthly, true)} monthly SIP for ${values.years} year${values.years === 1 ? "" : "s"} at ${formatPercent(values.rate, 1)} grows to about ${formatINR(maturityDisplay, true)}.`,
    `You invest roughly ${formatINR(result.invested, true)}; estimated wealth gained is ${formatINR(gain, true)} (~${multiple}× contributions).`,
    "Returns are assumptions, not guarantees — use the sensitivity bands to stress-test higher and lower rates.",
  ];

  return (
    <CalculatorPageLayout
      seoKey="investment/sip"
      categoryHref="/calculators/investment"
      categoryLabel="Investment & Wealth"
      crumb="SIP"
      title="Build Wealth with Systematic Investing"
      description="Project SIP maturity with optional inflation and post-tax adjustments. Share this scenario via the URL."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Inputs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-navy/30 px-3 py-2">
              <div>
                <Label htmlFor="advanced" className="text-sm font-medium">
                  Advanced options
                </Label>
                <p className="text-xs text-muted-foreground">
                  Inflation adjustment & stylised post-tax view
                </p>
              </div>
              <Switch
                id="advanced"
                checked={values.advanced}
                onCheckedChange={(v) => setParam("advanced", v)}
              />
            </div>

            <DraggableSlider
              id="monthly"
              label="Monthly SIP"
              value={values.monthly}
              onChange={(v) => setParam("monthly", v)}
              min={500}
              max={5_00_000}
              step={500}
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

            {values.advanced ? (
              <InflationTaxToggles
                adjustInflation={values.adjustInflation}
                onAdjustInflation={(v) => setParam("adjustInflation", v)}
                inflation={values.inflation}
                onInflation={(v) => setParam("inflation", v)}
                postTax={values.postTax}
                onPostTax={(v) => setParam("postTax", v)}
              />
            ) : (
              <p className="text-xs text-muted-foreground">
                Need annual increases? Try the{" "}
                <Link
                  href="/calculators/investment/step-up-sip"
                  className="text-accent hover:underline"
                >
                  Step-Up SIP calculator
                </Link>
                .
              </p>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6 calculator-results-sticky">
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
              { label: "Total Invested", value: formatINR(result.invested) },
              {
                label: "Wealth Gained",
                value: formatINR(gain),
              },
              ...(postTax && result.taxOnGains > 0
                ? [{ label: "Est. LTCG Tax", value: formatINR(result.taxOnGains) }]
                : []),
            ]}
            footer={
              <ExportPDFButton
                title="Build Wealth with Systematic Investing"
                tagline="Your personalized investment summary"
                subtitle="SIP Calculator — Aaru Wealth"
                hero={{
                  label: maturityLabel,
                  value: formatINR(maturityDisplay),
                  hint: `${values.years} year${values.years === 1 ? "" : "s"} horizon`,
                }}
                inputs={[
                  { label: "Monthly SIP", value: formatINR(values.monthly) },
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
                balanceSeriesYears={values.years}
                balanceChartTitle="Portfolio value over time"
                journey={[
                  `${formatINR(values.monthly, true)} monthly SIP`,
                  `${values.years} year investment journey`,
                  `${formatINR(maturityDisplay, true)} at maturity`,
                ]}
                table={{
                  title: "Investment schedule",
                  groupByYear: true,
                  monthKey: "month",
                  columns: [
                    { header: "Month", key: "month" },
                    { header: "Invested", key: "invested" },
                    { header: "Value", key: "value" },
                  ],
                  rows: result.monthlySeries.map((r) => ({
                    month: r.month,
                    invested: formatINR(r.invested),
                    value: formatINR(r.value),
                  })),
                }}
                fileName="sip.pdf"
                expectedReturnPct={values.rate}
              />
            }
          >
            <ResultInterpretation points={interpretationPoints} />
            <HighReturnCaution ratePct={values.rate} className="mt-3" />
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

export function SipCalculator() {
  return withCalculatorSuspense(<SipInner />);
}
