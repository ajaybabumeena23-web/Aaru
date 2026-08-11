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
import { analyzeRentVsBuy } from "@/utils/financial-math";
import { formatINR, formatPercent } from "@/lib/utils";

function RentVsBuyInner() {
  const { values, setParam } = useCalculatorParams({
    price: { default: 1_00_00_000 },
    down: { default: 20_00_000 },
    loanRate: { default: 8.5 },
    loanYears: { default: 20 },
    rent: { default: 35_000 },
    years: { default: 10 },
    investReturn: { default: 10 },
  });

  const result = useMemo(
    () =>
      analyzeRentVsBuy({
        homePrice: values.price,
        downPayment: values.down,
        loanRatePct: values.loanRate,
        loanTenureYears: values.loanYears,
        monthlyRent: values.rent,
        investmentReturnPct: values.investReturn,
        years: values.years,
      }),
    [values]
  );

  return (
    <CalculatorPageLayout
      seoKey="debt/rent-vs-buy"
      categoryHref="/calculators/debt"
      categoryLabel="Debt Management"
      crumb="Rent vs Buy"
      title="Decide: Rent or Buy Your Home?"
      description="Opportunity-cost aware comparison of buying with a loan versus renting and investing."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Inputs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <DraggableSlider
              id="price"
              label="Home Price"
              value={values.price}
              onChange={(v) => setParam("price", v)}
              min={20_00_000}
              max={10_00_00_000}
              step={1_00_000}
              prefix="₹"
            />
            <DraggableSlider
              id="down"
              label="Down Payment"
              value={values.down}
              onChange={(v) => setParam("down", v)}
              min={0}
              max={values.price}
              step={50_000}
              prefix="₹"
            />
            <DraggableSlider
              id="loanRate"
              label="Home Loan Rate"
              value={values.loanRate}
              onChange={(v) => setParam("loanRate", v)}
              min={6}
              max={12}
              step={0.05}
              suffix="%"
            />
            <DraggableSlider
              id="rent"
              label="Monthly Rent"
              value={values.rent}
              onChange={(v) => setParam("rent", v)}
              min={5_000}
              max={2_00_000}
              step={1_000}
              prefix="₹"
            />
            <DraggableSlider
              id="years"
              label="Comparison Horizon"
              value={values.years}
              onChange={(v) => setParam("years", v)}
              min={5}
              max={30}
              step={1}
              suffix="yrs"
            />
            <DraggableSlider
              id="investReturn"
              label="Investment Return (if renting)"
              value={values.investReturn}
              onChange={(v) => setParam("investReturn", v)}
              min={4}
              max={15}
              step={0.1}
              suffix="%"
            />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Buy Net Worth vs Rent Portfolio</CardTitle>
            </CardHeader>
            <CardContent>
              <FinancialDonutChart
                data={[
                  { name: "Buy path", value: Math.max(0, result.buyNetWorth) },
                  {
                    name: "Rent + invest",
                    value: Math.max(0, result.rentNetWorth),
                    color: "hsl(32 95% 44%)",
                  },
                ]}
                centerLabel="Advantage"
                centerValue={
                  result.advantage === "same"
                    ? "Tie"
                    : `${result.advantage === "buy" ? "Buy" : "Rent"} ${formatINR(result.advantageAmount, true)}`
                }
              />
            </CardContent>
          </Card>

          <CalculationResultCard
            metrics={[
              { label: "Buy net worth", value: formatINR(result.buyNetWorth) },
              {
                label: "Rent + invest net worth",
                value: formatINR(result.rentNetWorth),
              },
              {
                label: "Better path",
                value:
                  result.advantage === "same"
                    ? "Roughly equal"
                    : result.advantage === "buy"
                      ? "Buy"
                      : "Rent",
                emphasize: true,
                hint: `Edge of ${formatINR(result.advantageAmount)} over ${values.years} years`,
              },
            ]}
            footer={
              <ExportPDFButton
                title="Decide: Rent or Buy Your Home?"
                tagline="Your personalized rent vs buy comparison"
                subtitle="Rent vs Buy — Aaru Wealth"
                hero={{
                  label: "Better Path Advantage",
                  value:
                    result.advantage === "same"
                      ? "Roughly equal"
                      : formatINR(result.advantageAmount),
                  hint:
                    result.advantage === "same"
                      ? `Over ${values.years} years`
                      : `${result.advantage === "buy" ? "Buy" : "Rent"} leads by ${formatINR(result.advantageAmount)}`,
                }}
                inputs={[
                  { label: "Home Price", value: formatINR(values.price) },
                  { label: "Down Payment", value: formatINR(values.down) },
                  {
                    label: "Home Loan Rate",
                    value: formatPercent(values.loanRate),
                  },
                  {
                    label: "Monthly Rent",
                    value: formatINR(values.rent),
                  },
                  {
                    label: "Comparison Horizon",
                    value: `${values.years} Year${values.years === 1 ? "" : "s"}`,
                  },
                  {
                    label: "Investment Return (if renting)",
                    value: formatPercent(values.investReturn),
                  },
                ]}
                results={[
                  {
                    label: "Buy Net Worth",
                    value: formatINR(result.buyNetWorth),
                  },
                  {
                    label: "Rent + Invest Net Worth",
                    value: formatINR(result.rentNetWorth),
                  },
                  {
                    label: "Advantage",
                    value: `${result.advantage} by ${formatINR(result.advantageAmount)}`,
                  },
                ]}
                chartSlices={[
                  {
                    label: "Buy path",
                    value: Math.max(0, result.buyNetWorth),
                    color: "#13192B",
                  },
                  {
                    label: "Rent + invest",
                    value: Math.max(0, result.rentNetWorth),
                    color: "#F7C615",
                  },
                ]}
                journey={[
                  `${formatINR(values.price, true)} home price`,
                  `${values.years}-year comparison`,
                  result.advantage === "same"
                    ? "Paths roughly equal"
                    : `${result.advantage === "buy" ? "Buy" : "Rent"} wins by ${formatINR(result.advantageAmount, true)}`,
                ]}
                fileName="rent-vs-buy.pdf"
              />
            }
          />
        </div>
      </div>
    </CalculatorPageLayout>
  );
}

export function RentVsBuyCalculator() {
  return withCalculatorSuspense(<RentVsBuyInner />);
}
