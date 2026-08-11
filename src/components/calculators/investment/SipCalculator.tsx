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
import { calculateSip } from "@/utils/financial-math";
import { formatINR, formatPercent } from "@/lib/utils";

function SipInner() {
  const { values, setParam } = useCalculatorParams({
    monthly: { default: 25_000 },
    rate: { default: 12 },
    years: { default: 15 },
    inflation: { default: 6 },
    adjustInflation: { default: false },
    postTax: { default: false },
  });

  const result = useMemo(
    () =>
      calculateSip({
        monthlyInvestment: values.monthly,
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
              { label: "Total Invested", value: formatINR(result.invested) },
              {
                label: maturityLabel,
                value: formatINR(maturityDisplay),
                emphasize: true,
              },
              {
                label: "Wealth Gained",
                value: formatINR(maturityDisplay - result.invested),
              },
              ...(values.postTax && result.taxOnGains > 0
                ? [{ label: "Est. LTCG Tax", value: formatINR(result.taxOnGains) }]
                : []),
            ]}
            footer={
              <ExportPDFButton
                title="Build Wealth with Systematic Investing"
                subtitle="SIP Calculator — Aaru Wealth"
                inputs={[
                  { label: "Monthly SIP", value: formatINR(values.monthly) },
                  { label: "Return", value: formatPercent(values.rate) },
                  { label: "Years", value: String(values.years) },
                ]}
                results={[
                  { label: "Invested", value: formatINR(result.invested) },
                  { label: "Maturity", value: formatINR(maturityDisplay) },
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
                fileName="sip.pdf"
              />
            }
          />
        </div>
      </div>
    </CalculatorPageLayout>
  );
}

export function SipCalculator() {
  return withCalculatorSuspense(<SipInner />);
}
