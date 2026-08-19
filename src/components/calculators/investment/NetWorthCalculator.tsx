"use client";

import { useMemo } from "react";
import {
  CalculationResultCard,
  DraggableSlider,
  ExportPDFButton,
  FinancialDonutChart,
  ResultInterpretation,
} from "@/components/calculators";
import {
  CalculatorPageLayout,
  withCalculatorSuspense,
} from "@/components/calculators/CalculatorPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCalculatorParams } from "@/hooks/useCalculatorParams";
import { calculateNetWorth } from "@/utils/financial-math";
import { formatINR } from "@/lib/utils";

function NetWorthInner() {
  const { values, setParam } = useCalculatorParams({
    cash: { default: 2_00_000 },
    investments: { default: 15_00_000 },
    property: { default: 50_00_000 },
    otherAssets: { default: 1_00_000 },
    homeLoan: { default: 30_00_000 },
    otherDebt: { default: 2_00_000 },
  });

  const assets =
    values.cash + values.investments + values.property + values.otherAssets;
  const liabilities = values.homeLoan + values.otherDebt;

  const result = useMemo(
    () => calculateNetWorth({ assets, liabilities }),
    [assets, liabilities]
  );

  const interpretationPoints = [
    `Assets total about ${formatINR(result.totalAssets, true)}; liabilities about ${formatINR(result.totalLiabilities, true)}.`,
    result.netWorth >= 0
      ? `Estimated net worth is ${formatINR(result.netWorth, true)}.`
      : `Liabilities exceed assets by about ${formatINR(Math.abs(result.netWorth), true)} in this snapshot.`,
    "Use market values you believe are realistic. This is a simple balance sheet — not a credit or tax report.",
  ];

  return (
    <CalculatorPageLayout
      seoKey="investment/net-worth"
      categoryHref="/calculators/investment"
      categoryLabel="Investment & Wealth"
      crumb="Net Worth"
      title="Estimate Your Net Worth"
      description="Add major assets and liabilities for a simple net-worth snapshot you can share via URL."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Assets & liabilities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <DraggableSlider
              id="cash"
              label="Cash & bank"
              value={values.cash}
              onChange={(v) => setParam("cash", v)}
              min={0}
              max={2_00_00_000}
              step={10_000}
              prefix="₹"
            />
            <DraggableSlider
              id="investments"
              label="Investments (MF, stocks, EPF…)"
              value={values.investments}
              onChange={(v) => setParam("investments", v)}
              min={0}
              max={5_00_00_000}
              step={50_000}
              prefix="₹"
            />
            <DraggableSlider
              id="property"
              label="Property (est. market value)"
              value={values.property}
              onChange={(v) => setParam("property", v)}
              min={0}
              max={10_00_00_000}
              step={1_00_000}
              prefix="₹"
            />
            <DraggableSlider
              id="otherAssets"
              label="Other assets"
              value={values.otherAssets}
              onChange={(v) => setParam("otherAssets", v)}
              min={0}
              max={2_00_00_000}
              step={10_000}
              prefix="₹"
            />
            <DraggableSlider
              id="homeLoan"
              label="Home loan outstanding"
              value={values.homeLoan}
              onChange={(v) => setParam("homeLoan", v)}
              min={0}
              max={5_00_00_000}
              step={50_000}
              prefix="₹"
            />
            <DraggableSlider
              id="otherDebt"
              label="Other loans / credit"
              value={values.otherDebt}
              onChange={(v) => setParam("otherDebt", v)}
              min={0}
              max={1_00_00_000}
              step={10_000}
              prefix="₹"
            />
          </CardContent>
        </Card>

        <div className="space-y-6 calculator-results-sticky">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Assets vs liabilities</CardTitle>
            </CardHeader>
            <CardContent>
              <FinancialDonutChart
                data={[
                  { name: "Assets", value: Math.max(0, result.totalAssets) },
                  {
                    name: "Liabilities",
                    value: Math.max(0, result.totalLiabilities),
                    color: "hsl(0 72% 51%)",
                  },
                ]}
                centerLabel="Net worth"
                centerValue={formatINR(result.netWorth, true)}
              />
            </CardContent>
          </Card>

          <CalculationResultCard
            metrics={[
              {
                label: "Net worth",
                value: formatINR(result.netWorth),
                emphasize: true,
              },
              {
                label: "Total assets",
                value: formatINR(result.totalAssets),
              },
              {
                label: "Total liabilities",
                value: formatINR(result.totalLiabilities),
              },
            ]}
            footer={
              <ExportPDFButton
                title="Net Worth Calculator"
                tagline="Your balance-sheet snapshot"
                subtitle="Net Worth — Aaru Wealth"
                hero={{
                  label: "Net worth",
                  value: formatINR(result.netWorth),
                }}
                inputs={[
                  { label: "Cash & bank", value: formatINR(values.cash) },
                  {
                    label: "Investments",
                    value: formatINR(values.investments),
                  },
                  { label: "Property", value: formatINR(values.property) },
                  {
                    label: "Other assets",
                    value: formatINR(values.otherAssets),
                  },
                  { label: "Home loan", value: formatINR(values.homeLoan) },
                  {
                    label: "Other debt",
                    value: formatINR(values.otherDebt),
                  },
                ]}
                results={[
                  {
                    label: "Total assets",
                    value: formatINR(result.totalAssets),
                  },
                  {
                    label: "Total liabilities",
                    value: formatINR(result.totalLiabilities),
                  },
                  { label: "Net worth", value: formatINR(result.netWorth) },
                ]}
                chartSlices={[
                  {
                    label: "Assets",
                    value: Math.max(0, result.totalAssets),
                    color: "#0B1F33",
                  },
                  {
                    label: "Liabilities",
                    value: Math.max(0, result.totalLiabilities),
                    color: "#DC2626",
                  },
                ]}
                fileName="net-worth.pdf"
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

export function NetWorthCalculator() {
  return withCalculatorSuspense(<NetWorthInner />);
}
