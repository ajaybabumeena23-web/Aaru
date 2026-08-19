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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCalculatorParams } from "@/hooks/useCalculatorParams";
import { rateSensitivityBands } from "@/lib/sensitivity";
import { calculatePpf } from "@/utils/financial-math";
import { formatINR, formatPercent } from "@/lib/utils";

function PpfInner() {
  const { values, setParam } = useCalculatorParams({
    annual: { default: 1_50_000 },
    years: { default: 15 },
    rate: { default: 7.1 },
  });

  const result = useMemo(
    () =>
      calculatePpf({
        annualDeposit: values.annual,
        years: values.years,
        ratePct: values.rate,
      }),
    [values]
  );

  const rateBands = useMemo(() => {
    return rateSensitivityBands(values.rate, 0.5, {
      min: 6,
      max: 9,
      labels: ["Lower rate", "Your rate", "Higher rate"],
    }).map((b) => {
      const r = calculatePpf({
        annualDeposit: values.annual,
        years: values.years,
        ratePct: b.ratePct,
      });
      return {
        label: b.label,
        hint: rateBandHint(b.ratePct),
        value: formatINR(r.maturityValue, true),
        emphasize: b.key === "base",
      };
    });
  }, [values]);

  const interpretationPoints = [
    `Depositing ${formatINR(values.annual, true)}/year for ${values.years} years at ${formatPercent(values.rate, 1)} projects about ${formatINR(result.maturityValue, true)}.`,
    `Interest earned is roughly ${formatINR(result.interestEarned, true)} on ${formatINR(result.totalDeposited, true)} deposited.`,
    "PPF rates are notified by the government and can change — the bands show a ±0.5% what-if.",
  ];

  return (
    <CalculatorPageLayout
      seoKey="government/ppf"
      categoryHref="/calculators/government"
      categoryLabel="Govt & Fixed Income"
      crumb="PPF"
      title="Grow Tax-Free with PPF"
      description="Public Provident Fund maturity with annual deposits and compounding."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Inputs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <DraggableSlider
              id="annual"
              label="Annual Deposit"
              value={values.annual}
              onChange={(v) => setParam("annual", v)}
              min={500}
              max={1_50_000}
              step={500}
              prefix="₹"
            />
            <DraggableSlider
              id="years"
              label="Tenure"
              value={values.years}
              onChange={(v) => setParam("years", v)}
              min={15}
              max={50}
              step={1}
              suffix="yrs"
            />
            <DraggableSlider
              id="rate"
              label="Interest Rate"
              value={values.rate}
              onChange={(v) => setParam("rate", v)}
              min={6}
              max={9}
              step={0.1}
              suffix="%"
            />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Deposited vs Interest</CardTitle>
            </CardHeader>
            <CardContent>
              <FinancialDonutChart
                data={[
                  { name: "Deposited", value: result.totalDeposited },
                  { name: "Interest", value: result.interestEarned },
                ]}
                centerLabel="Maturity"
                centerValue={formatINR(result.maturityValue, true)}
              />
            </CardContent>
          </Card>

          <CalculationResultCard
            metrics={[
              {
                label: "Maturity Value",
                value: formatINR(result.maturityValue),
                emphasize: true,
              },
              {
                label: "Total Deposited",
                value: formatINR(result.totalDeposited),
              },
              {
                label: "Interest Earned",
                value: formatINR(result.interestEarned),
              },
            ]}
            footer={
              <ExportPDFButton
                title="Grow Tax-Free with PPF"
                tagline="Your personalized PPF maturity summary"
                subtitle="PPF — Aaru Wealth"
                hero={{
                  label: "Maturity Value",
                  value: formatINR(result.maturityValue),
                  hint: `${values.years}-year PPF tenure`,
                }}
                inputs={[
                  {
                    label: "Annual Deposit",
                    value: formatINR(values.annual),
                  },
                  {
                    label: "Tenure",
                    value: `${values.years} Year${values.years === 1 ? "" : "s"}`,
                  },
                  {
                    label: "Interest Rate",
                    value: formatPercent(values.rate),
                  },
                ]}
                results={[
                  {
                    label: "Maturity Value",
                    value: formatINR(result.maturityValue),
                  },
                  {
                    label: "Total Deposited",
                    value: formatINR(result.totalDeposited),
                  },
                  {
                    label: "Interest Earned",
                    value: formatINR(result.interestEarned),
                  },
                ]}
                chartSlices={[
                  {
                    label: "Deposited",
                    value: result.totalDeposited,
                    color: "#13192B",
                  },
                  {
                    label: "Interest",
                    value: result.interestEarned,
                    color: "#F7C615",
                  },
                ]}
                balanceSeries={result.yearly.map((y) => y.balance)}
                balanceSeriesYears={values.years}
                balanceChartTitle="PPF balance over years"
                journey={[
                  `${formatINR(values.annual, true)} deposited yearly`,
                  `${values.years} years of compounding`,
                  `${formatINR(result.maturityValue, true)} at maturity`,
                ]}
                table={{
                  title: "Yearly PPF schedule",
                  columns: [
                    { header: "Year", key: "year" },
                    { header: "Deposit", key: "deposit" },
                    { header: "Balance", key: "balance" },
                  ],
                  rows: result.yearly.map((y) => ({
                    year: y.year,
                    deposit: formatINR(y.deposit),
                    balance: formatINR(y.balance),
                  })),
                }}
                fileName="ppf.pdf"
              />
            }
          >
            <ResultInterpretation points={interpretationPoints} />
            <SensitivityBands
              parameterLabel="PPF interest rate"
              bands={rateBands}
            />
          </CalculationResultCard>
        </div>
      </div>
    </CalculatorPageLayout>
  );
}

export function PpfCalculator() {
  return withCalculatorSuspense(<PpfInner />);
}
