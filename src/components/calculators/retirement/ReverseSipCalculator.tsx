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
import { calculateReverseSip } from "@/utils/financial-math";
import { formatINR, formatPercent } from "@/lib/utils";

function ReverseSipInner() {
  const { values, setParam } = useCalculatorParams({
    target: { default: 1_00_00_000 },
    rate: { default: 12 },
    years: { default: 15 },
  });

  const result = useMemo(
    () =>
      calculateReverseSip({
        targetCorpus: values.target,
        annualRatePct: values.rate,
        years: values.years,
      }),
    [values]
  );

  const gain = values.target - result.totalInvested;

  return (
    <CalculatorPageLayout
      categoryHref="/calculators/retirement"
      categoryLabel="Retirement & Goals"
      crumb="Reverse SIP"
      title="Find the SIP That Hits Your Goal"
      description="Back-solve the monthly SIP needed to reach a target corpus."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Inputs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <DraggableSlider
              id="target"
              label="Target Corpus"
              value={values.target}
              onChange={(v) => setParam("target", v)}
              min={1_00_000}
              max={10_00_00_000}
              step={1_00_000}
              prefix="₹"
            />
            <DraggableSlider
              id="rate"
              label="Expected Return"
              value={values.rate}
              onChange={(v) => setParam("rate", v)}
              min={1}
              max={20}
              step={0.1}
              suffix="%"
            />
            <DraggableSlider
              id="years"
              label="Time Horizon"
              value={values.years}
              onChange={(v) => setParam("years", v)}
              min={1}
              max={40}
              step={1}
              suffix="yrs"
            />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Invested vs Wealth Gained</CardTitle>
            </CardHeader>
            <CardContent>
              <FinancialDonutChart
                data={[
                  { name: "Total Invested", value: result.totalInvested },
                  { name: "Wealth Gained", value: Math.max(0, gain) },
                ]}
                centerLabel="Required SIP"
                centerValue={formatINR(result.monthlySip, true)}
              />
            </CardContent>
          </Card>

          <CalculationResultCard
            metrics={[
              {
                label: "Required Monthly SIP",
                value: formatINR(result.monthlySip),
                emphasize: true,
              },
              {
                label: "Total Invested",
                value: formatINR(result.totalInvested),
              },
              { label: "Target Corpus", value: formatINR(values.target) },
            ]}
            footer={
              <ExportPDFButton
                title="Find the SIP That Hits Your Goal"
                subtitle="Reverse SIP — Aaru Wealth"
                inputs={[
                  { label: "Target", value: formatINR(values.target) },
                  { label: "Return", value: formatPercent(values.rate) },
                  { label: "Years", value: String(values.years) },
                ]}
                results={[
                  {
                    label: "Monthly SIP",
                    value: formatINR(result.monthlySip),
                  },
                ]}
                fileName="reverse-sip.pdf"
              />
            }
          />
        </div>
      </div>
    </CalculatorPageLayout>
  );
}

export function ReverseSipCalculator() {
  return withCalculatorSuspense(<ReverseSipInner />);
}
