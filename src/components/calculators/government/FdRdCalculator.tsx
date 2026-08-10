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
import { calculateFd, calculateRd } from "@/utils/financial-math";
import { formatINR, formatPercent } from "@/lib/utils";

function FdRdInner() {
  const { values, setParam } = useCalculatorParams({
    mode: { default: "fd" as string },
    amount: { default: 1_00_000 },
    rate: { default: 7 },
    years: { default: 5 },
    months: { default: 60 },
  });

  const mode = values.mode === "rd" ? "rd" : "fd";

  const result = useMemo(() => {
    if (mode === "rd") {
      const rd = calculateRd({
        monthlyDeposit: values.amount,
        ratePct: values.rate,
        months: values.months,
      });
      return {
        maturityValue: rd.maturityValue,
        invested: rd.totalDeposited,
        interest: rd.interestEarned,
      };
    }
    const fd = calculateFd({
      principal: values.amount,
      ratePct: values.rate,
      years: values.years,
      compoundingPerYear: 4,
    });
    return {
      maturityValue: fd.maturityValue,
      invested: values.amount,
      interest: fd.interestEarned,
    };
  }, [values, mode]);

  return (
    <CalculatorPageLayout
      categoryHref="/calculators/government"
      categoryLabel="Govt & Fixed Income"
      crumb="FD / RD"
      title="Bank FD & RD Returns"
      description="Fixed deposit (quarterly compound) and recurring deposit maturity values."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Inputs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Product</Label>
              <Tabs
                value={mode}
                onValueChange={(v) => setParam("mode", v)}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="fd">Fixed Deposit</TabsTrigger>
                  <TabsTrigger value="rd">Recurring Deposit</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <DraggableSlider
              id="amount"
              label={mode === "fd" ? "Principal" : "Monthly Deposit"}
              value={values.amount}
              onChange={(v) => setParam("amount", v)}
              min={500}
              max={mode === "fd" ? 1_00_00_000 : 1_00_000}
              step={500}
              prefix="₹"
            />
            <DraggableSlider
              id="rate"
              label="Interest Rate"
              value={values.rate}
              onChange={(v) => setParam("rate", v)}
              min={3}
              max={10}
              step={0.05}
              suffix="%"
            />
            {mode === "fd" ? (
              <DraggableSlider
                id="years"
                label="Tenure"
                value={values.years}
                onChange={(v) => setParam("years", v)}
                min={1}
                max={10}
                step={1}
                suffix="yrs"
              />
            ) : (
              <DraggableSlider
                id="months"
                label="Tenure"
                value={values.months}
                onChange={(v) => setParam("months", v)}
                min={6}
                max={120}
                step={6}
                suffix="mo"
              />
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Principal vs Interest</CardTitle>
            </CardHeader>
            <CardContent>
              <FinancialDonutChart
                data={[
                  { name: "Invested", value: result.invested },
                  { name: "Interest", value: result.interest },
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
              { label: "Invested", value: formatINR(result.invested) },
              { label: "Interest earned", value: formatINR(result.interest) },
            ]}
            footer={
              <ExportPDFButton
                title="Bank FD & RD Returns"
                subtitle={`${mode.toUpperCase()} — IndiaCalc`}
                inputs={[
                  { label: "Type", value: mode.toUpperCase() },
                  { label: "Amount", value: formatINR(values.amount) },
                  { label: "Rate", value: formatPercent(values.rate) },
                ]}
                results={[
                  {
                    label: "Maturity",
                    value: formatINR(result.maturityValue),
                  },
                  { label: "Interest", value: formatINR(result.interest) },
                ]}
                fileName="fd-rd.pdf"
              />
            }
          />
        </div>
      </div>
    </CalculatorPageLayout>
  );
}

export function FdRdCalculator() {
  return withCalculatorSuspense(<FdRdInner />);
}
