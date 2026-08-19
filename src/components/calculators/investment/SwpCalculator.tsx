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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCalculatorParams } from "@/hooks/useCalculatorParams";
import { rateSensitivityBands } from "@/lib/sensitivity";
import { calculateSwp } from "@/utils/financial-math";
import { formatINR, formatPercent } from "@/lib/utils";

function SwpInner() {
  const { values, setParam } = useCalculatorParams({
    corpus: { default: 50_00_000 },
    withdrawal: { default: 30_000 },
    rate: { default: 8 },
    years: { default: 20 },
  });

  const result = useMemo(
    () =>
      calculateSwp({
        corpus: values.corpus,
        monthlyWithdrawal: values.withdrawal,
        annualRatePct: values.rate,
        years: values.years,
      }),
    [values]
  );

  const withdrawn = result.totalWithdrawn;
  const remaining = result.endingCorpus;

  const rateBands = useMemo(() => {
    return rateSensitivityBands(values.rate, 2, { min: 1, max: 20 }).map((b) => {
      const r = calculateSwp({
        corpus: values.corpus,
        monthlyWithdrawal: values.withdrawal,
        annualRatePct: b.ratePct,
        years: values.years,
      });
      return {
        label: b.label,
        hint: rateBandHint(b.ratePct),
        value: r.depleted
          ? `${r.monthsLasted} mo`
          : formatINR(r.endingCorpus, true),
        sub: r.depleted ? "Depleted early" : "Ending corpus",
        emphasize: b.key === "base",
      };
    });
  }, [values]);

  const interpretationPoints = [
    result.depleted
      ? `At ${formatPercent(values.rate, 1)} returns, withdrawing ${formatINR(values.withdrawal, true)}/mo from ${formatINR(values.corpus, true)} depletes the corpus after about ${result.monthsLasted} months.`
      : `At ${formatPercent(values.rate, 1)} returns, this SWP can pay ${formatINR(withdrawn, true)} over ${values.years} years and still leave about ${formatINR(remaining, true)}.`,
    "Lower returns or higher withdrawals shorten sustainability — stress-test with the bands below.",
  ];

  return (
    <CalculatorPageLayout
      seoKey="investment/swp"
      categoryHref="/calculators/investment"
      categoryLabel="Investment & Wealth"
      crumb="SWP"
      title="Plan Systematic Withdrawals"
      description="See how long your corpus lasts with monthly withdrawals and market returns."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Inputs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <DraggableSlider
              id="corpus"
              label="Starting Corpus"
              value={values.corpus}
              onChange={(v) => setParam("corpus", v)}
              min={1_00_000}
              max={10_00_00_000}
              step={50_000}
              prefix="₹"
            />
            <DraggableSlider
              id="withdrawal"
              label="Monthly Withdrawal"
              value={values.withdrawal}
              onChange={(v) => setParam("withdrawal", v)}
              min={1_000}
              max={5_00_000}
              step={1_000}
              prefix="₹"
            />
            <DraggableSlider
              id="rate"
              label="Expected Return (p.a.)"
              value={values.rate}
              onChange={(v) => setParam("rate", v)}
              min={1}
              max={20}
              step={0.1}
              suffix="%"
            />
            <DraggableSlider
              id="years"
              label="Withdrawal Horizon"
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
              <CardTitle className="text-lg">Withdrawn vs Remaining</CardTitle>
            </CardHeader>
            <CardContent>
              <FinancialDonutChart
                data={[
                  { name: "Total Withdrawn", value: withdrawn },
                  {
                    name: result.depleted ? "Depleted" : "Ending Corpus",
                    value: Math.max(remaining, result.depleted ? 0 : remaining),
                    color: result.depleted
                      ? "hsl(0 72% 51%)"
                      : "hsl(173 58% 28%)",
                  },
                ]}
                centerLabel={result.depleted ? "Lasted" : "Ending"}
                centerValue={
                  result.depleted
                    ? `${result.monthsLasted} mo`
                    : formatINR(remaining, true)
                }
              />
            </CardContent>
          </Card>

          <CalculationResultCard
            metrics={[
              {
                label: "Ending Corpus",
                value: formatINR(remaining),
                emphasize: true,
                hint: result.depleted
                  ? `Corpus depleted after ${result.monthsLasted} months`
                  : "Corpus survives the full horizon",
              },
              { label: "Total Withdrawn", value: formatINR(withdrawn) },
              {
                label: "Months Lasted",
                value: `${result.monthsLasted} / ${values.years * 12}`,
              },
            ]}
            footer={
              <ExportPDFButton
                title="Plan Systematic Withdrawals"
                tagline="Your personalized withdrawal plan"
                subtitle="SWP — Aaru Wealth"
                hero={{
                  label: result.depleted ? "Months Lasted" : "Ending Corpus",
                  value: result.depleted
                    ? `${result.monthsLasted} mo`
                    : formatINR(remaining),
                  hint: result.depleted
                    ? "Corpus depleted before horizon"
                    : "Corpus survives the full horizon",
                }}
                inputs={[
                  {
                    label: "Starting Corpus",
                    value: formatINR(values.corpus),
                  },
                  {
                    label: "Monthly Withdrawal",
                    value: formatINR(values.withdrawal),
                  },
                  {
                    label: "Expected Return",
                    value: formatPercent(values.rate),
                  },
                  {
                    label: "Withdrawal Horizon",
                    value: `${values.years} Year${values.years === 1 ? "" : "s"}`,
                  },
                ]}
                results={[
                  {
                    label: "Ending Corpus",
                    value: formatINR(remaining),
                  },
                  {
                    label: "Total Withdrawn",
                    value: formatINR(withdrawn),
                  },
                  {
                    label: "Months Lasted",
                    value: `${result.monthsLasted} / ${values.years * 12}`,
                  },
                ]}
                chartSlices={[
                  {
                    label: "Total Withdrawn",
                    value: withdrawn,
                    color: "#13192B",
                  },
                  {
                    label: result.depleted ? "Depleted" : "Ending Corpus",
                    value: Math.max(remaining, result.depleted ? 0 : remaining),
                    color: "#F7C615",
                  },
                ]}
                balanceSeries={result.series.map((r) => r.corpus)}
                balanceSeriesYears={values.years}
                balanceChartTitle="Corpus balance over time"
                journey={[
                  `${formatINR(values.corpus, true)} starting corpus`,
                  `${formatINR(values.withdrawal, true)} monthly withdrawals`,
                  result.depleted
                    ? `Lasted ${result.monthsLasted} months`
                    : `${formatINR(remaining, true)} remaining`,
                ]}
                fileName="swp.pdf"
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

export function SwpCalculator() {
  return withCalculatorSuspense(<SwpInner />);
}
