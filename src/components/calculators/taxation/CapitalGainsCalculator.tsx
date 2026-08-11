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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCalculatorParams } from "@/hooks/useCalculatorParams";
import { calculateCapitalGains } from "@/utils/financial-math";
import { formatINR, formatPercent } from "@/lib/utils";

function CapitalGainsInner() {
  const { values, setParam } = useCalculatorParams({
    asset: { default: "equity" as string },
    buy: { default: 5_00_000 },
    sell: { default: 12_00_000 },
    months: { default: 18 },
  });

  const asset = values.asset === "real-estate" ? "real-estate" : "equity";

  const result = useMemo(
    () =>
      calculateCapitalGains({
        asset,
        purchasePrice: values.buy,
        salePrice: values.sell,
        holdingMonths: values.months,
      }),
    [values, asset]
  );

  return (
    <CalculatorPageLayout
      seoKey="taxation/capital-gains"
      categoryHref="/calculators/taxation"
      categoryLabel="Taxation & Salary"
      crumb="Capital Gains"
      title="Estimate STCG & LTCG Liability"
      description="Equity (20% STCG / 12.5% LTCG above ₹1.25L) and real-estate capital gains."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Inputs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Asset type</Label>
              <Tabs
                value={asset}
                onValueChange={(v) => setParam("asset", v)}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="equity">Equity / MF</TabsTrigger>
                  <TabsTrigger value="real-estate">Real Estate</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <DraggableSlider
              id="buy"
              label="Purchase Price"
              value={values.buy}
              onChange={(v) => setParam("buy", v)}
              min={10_000}
              max={5_00_00_000}
              step={10_000}
              prefix="₹"
            />
            <DraggableSlider
              id="sell"
              label="Sale Price"
              value={values.sell}
              onChange={(v) => setParam("sell", v)}
              min={10_000}
              max={10_00_00_000}
              step={10_000}
              prefix="₹"
            />
            <DraggableSlider
              id="months"
              label="Holding Period"
              value={values.months}
              onChange={(v) => setParam("months", v)}
              min={1}
              max={120}
              step={1}
              suffix="mo"
            />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Gain vs Tax</CardTitle>
            </CardHeader>
            <CardContent>
              <FinancialDonutChart
                data={[
                  {
                    name: "Net gain after tax",
                    value: Math.max(0, result.gain - result.tax),
                  },
                  {
                    name: "Tax",
                    value: result.tax,
                    color: "hsl(0 72% 51%)",
                  },
                ]}
                centerLabel={result.isLongTerm ? "LTCG" : "STCG"}
                centerValue={formatPercent(result.rate * 100, 1)}
              />
            </CardContent>
          </Card>

          <CalculationResultCard
            metrics={[
              {
                label: "Capital gain",
                value: formatINR(result.gain),
              },
              {
                label: result.isLongTerm ? "LTCG tax" : "STCG tax",
                value: formatINR(result.tax),
                emphasize: true,
                hint:
                  asset === "equity" && result.isLongTerm
                    ? `Exemption used: ${formatINR(result.exemptionUsed)}`
                    : undefined,
              },
              {
                label: "Net proceeds",
                value: formatINR(result.netProceeds),
              },
            ]}
            footer={
              <ExportPDFButton
                title="Estimate STCG & LTCG Liability"
                subtitle="Capital Gains — Aaru Wealth"
                inputs={[
                  { label: "Asset", value: asset },
                  { label: "Buy", value: formatINR(values.buy) },
                  { label: "Sell", value: formatINR(values.sell) },
                  { label: "Holding", value: `${values.months} mo` },
                ]}
                results={[
                  { label: "Gain", value: formatINR(result.gain) },
                  { label: "Tax", value: formatINR(result.tax) },
                ]}
                fileName="capital-gains.pdf"
              />
            }
          />
        </div>
      </div>
    </CalculatorPageLayout>
  );
}

export function CapitalGainsCalculator() {
  return withCalculatorSuspense(<CapitalGainsInner />);
}
