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
import { calculateStepUpSip } from "@/utils/financial-math";
import { formatINR, formatPercent } from "@/lib/utils";

function StepUpSipCalculatorInner() {
  const { values, setParam } = useCalculatorParams({
    monthly: { default: 25_000 },
    rate: { default: 12 },
    years: { default: 15 },
    stepUp: { default: 10 },
    inflation: { default: 6 },
    adjustInflation: { default: false },
    postTax: { default: false },
  });

  const result = useMemo(
    () =>
      calculateStepUpSip({
        monthlyInvestment: values.monthly,
        annualRatePct: values.rate,
        years: values.years,
        stepUpPct: values.stepUp,
        inflationPct: values.adjustInflation ? values.inflation : 0,
        postTax: values.postTax,
      }),
    [values]
  );

  const chartPrincipal = result.invested;
  const chartGain = values.postTax
    ? Math.max(0, result.postTaxMaturityValue - result.invested)
    : values.adjustInflation
      ? Math.max(0, result.realMaturityValue - result.invested)
      : result.wealthGained;

  const maturityDisplay = values.postTax
    ? result.postTaxMaturityValue
    : values.adjustInflation
      ? result.realMaturityValue
      : result.maturityValue;

  return (
    <CalculatorPageLayout
      seoKey="investment/step-up-sip"
      categoryHref="/calculators/investment"
      categoryLabel="Investment & Wealth"
      crumb="Step-Up SIP"
      title="Accelerate Wealth with Annual SIP Step-Ups"
      description="Model SIPs that grow by a fixed % every year. Share this exact scenario via the URL."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Inputs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
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
            <DraggableSlider
              id="stepUp"
              label="Annual Step-Up"
              value={values.stepUp}
              onChange={(v) => setParam("stepUp", v)}
              min={0}
              max={50}
              step={1}
              suffix="%"
            />

            <div className="space-y-4 rounded-md border bg-muted/30 p-4">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="adjustInflation">Adjust for Inflation</Label>
                <Switch
                  id="adjustInflation"
                  checked={values.adjustInflation}
                  onCheckedChange={(c) => setParam("adjustInflation", c)}
                />
              </div>
              {values.adjustInflation ? (
                <DraggableSlider
                  id="inflation"
                  label="Inflation Rate"
                  value={values.inflation}
                  onChange={(v) => setParam("inflation", v)}
                  min={1}
                  max={15}
                  step={0.1}
                  suffix="%"
                />
              ) : null}
              <div className="flex items-center justify-between gap-3">
                <div>
                  <Label htmlFor="postTax">Show Post-Tax Returns</Label>
                  <p className="text-xs text-muted-foreground">
                    Equity LTCG 12.5% above ₹1.25L exemption
                  </p>
                </div>
                <Switch
                  id="postTax"
                  checked={values.postTax}
                  onCheckedChange={(c) => setParam("postTax", c)}
                />
              </div>
            </div>
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
                  { name: "Principal", value: chartPrincipal },
                  { name: "Wealth Gained", value: Math.max(0, chartGain) },
                ]}
                centerLabel="Maturity"
                centerValue={formatINR(maturityDisplay, true)}
              />
            </CardContent>
          </Card>

          <CalculationResultCard
            metrics={[
              { label: "Total Invested", value: formatINR(result.invested) },
              {
                label: values.postTax
                  ? "Post-Tax Maturity"
                  : values.adjustInflation
                    ? "Real Maturity (Today ₹)"
                    : "Maturity Value",
                value: formatINR(maturityDisplay),
                emphasize: true,
              },
              {
                label: "Wealth Gained",
                value: formatINR(
                  values.postTax
                    ? result.postTaxMaturityValue - result.invested
                    : result.wealthGained
                ),
              },
              ...(values.postTax && result.taxOnGains > 0
                ? [
                    {
                      label: "Est. LTCG Tax",
                      value: formatINR(result.taxOnGains),
                      hint: "Illustrative; actual tax depends on other gains",
                    },
                  ]
                : []),
              {
                label: "Final Monthly SIP",
                value: formatINR(
                  values.monthly *
                    Math.pow(1 + values.stepUp / 100, Math.max(0, values.years - 1))
                ),
                hint: `After ${formatPercent(values.stepUp, 0)} annual step-ups`,
              },
            ]}
            footer={
              <ExportPDFButton
                title="Accelerate Wealth with Annual SIP Step-Ups"
                subtitle="Step-Up SIP — Aaru Wealth"
                inputs={[
                  { label: "Monthly SIP", value: formatINR(values.monthly) },
                  { label: "Return p.a.", value: formatPercent(values.rate) },
                  { label: "Years", value: String(values.years) },
                  { label: "Step-Up", value: formatPercent(values.stepUp, 0) },
                  {
                    label: "Inflation adjust",
                    value: values.adjustInflation
                      ? formatPercent(values.inflation)
                      : "Off",
                  },
                  {
                    label: "Post-tax",
                    value: values.postTax ? "On" : "Off",
                  },
                ]}
                results={[
                  { label: "Invested", value: formatINR(result.invested) },
                  { label: "Maturity", value: formatINR(maturityDisplay) },
                  {
                    label: "Wealth Gained",
                    value: formatINR(maturityDisplay - result.invested),
                  },
                ]}
                table={{
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
                fileName="step-up-sip.pdf"
              />
            }
          />
        </div>
      </div>
    </CalculatorPageLayout>
  );
}

export function StepUpSipCalculator() {
  return withCalculatorSuspense(<StepUpSipCalculatorInner />);
}
