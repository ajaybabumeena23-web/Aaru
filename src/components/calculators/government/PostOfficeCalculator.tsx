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
import { calculatePostOfficeScheme } from "@/utils/financial-math";
import { formatINR, formatPercent } from "@/lib/utils";

function PostOfficeInner() {
  const { values, setParam } = useCalculatorParams({
    scheme: { default: "nsc" as string },
    principal: { default: 1_00_000 },
    rate: { default: 7.7 },
    years: { default: 5 },
  });

  const scheme =
    values.scheme === "scss" || values.scheme === "kvp"
      ? values.scheme
      : "nsc";

  const defaults =
    scheme === "scss"
      ? { rate: 8.2, years: 5 }
      : scheme === "kvp"
        ? { rate: 7.5, years: 9.58 }
        : { rate: 7.7, years: 5 };

  const result = useMemo(
    () =>
      calculatePostOfficeScheme({
        scheme,
        principal: values.principal,
        ratePct: values.rate || defaults.rate,
        years: values.years || defaults.years,
      }),
    [values, scheme, defaults.rate, defaults.years]
  );

  return (
    <CalculatorPageLayout
      seoKey="government/post-office"
      categoryHref="/calculators/government"
      categoryLabel="Govt & Fixed Income"
      crumb="Post Office"
      title="Compare NSC, SCSS & KVP"
      description="India Post fixed-income scheme returns — NSC, Senior Citizen Savings, and Kisan Vikas Patra."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Inputs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Scheme</Label>
              <Tabs
                value={scheme}
                onValueChange={(v) => {
                  setParam("scheme", v);
                  if (v === "scss") {
                    setParam("rate", 8.2);
                    setParam("years", 5);
                  } else if (v === "kvp") {
                    setParam("rate", 7.5);
                    setParam("years", 10);
                  } else {
                    setParam("rate", 7.7);
                    setParam("years", 5);
                  }
                }}
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="nsc">NSC</TabsTrigger>
                  <TabsTrigger value="scss">SCSS</TabsTrigger>
                  <TabsTrigger value="kvp">KVP</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <DraggableSlider
              id="principal"
              label="Investment"
              value={values.principal}
              onChange={(v) => setParam("principal", v)}
              min={1_000}
              max={30_00_000}
              step={1_000}
              prefix="₹"
            />
            <DraggableSlider
              id="rate"
              label="Interest Rate"
              value={values.rate}
              onChange={(v) => setParam("rate", v)}
              min={5}
              max={10}
              step={0.1}
              suffix="%"
            />
            <DraggableSlider
              id="years"
              label="Tenure"
              value={values.years}
              onChange={(v) => setParam("years", v)}
              min={1}
              max={15}
              step={1}
              suffix="yrs"
            />
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
                  { name: "Principal", value: values.principal },
                  { name: "Interest", value: result.totalInterest },
                ]}
                centerLabel={scheme === "scss" ? "Quarterly" : "Maturity"}
                centerValue={
                  scheme === "scss" && result.periodicPayout
                    ? formatINR(result.periodicPayout, true)
                    : formatINR(result.maturityValue, true)
                }
              />
            </CardContent>
          </Card>

          <CalculationResultCard
            metrics={[
              {
                label:
                  scheme === "scss" ? "Principal returned" : "Maturity value",
                value: formatINR(result.maturityValue),
                emphasize: true,
              },
              {
                label: "Total interest",
                value: formatINR(result.totalInterest),
              },
              ...(result.periodicPayout
                ? [
                    {
                      label: "Quarterly payout",
                      value: formatINR(result.periodicPayout),
                    },
                  ]
                : []),
            ]}
            footer={
              <ExportPDFButton
                title="Compare NSC, SCSS & KVP"
                tagline="Your personalized post office scheme summary"
                subtitle="Post Office — Aaru Wealth"
                hero={{
                  label:
                    scheme === "scss" && result.periodicPayout
                      ? "Quarterly Payout"
                      : scheme === "scss"
                        ? "Principal Returned"
                        : "Maturity Value",
                  value:
                    scheme === "scss" && result.periodicPayout
                      ? formatINR(result.periodicPayout)
                      : formatINR(result.maturityValue),
                  hint: scheme.toUpperCase(),
                }}
                inputs={[
                  {
                    label: "Scheme",
                    value: scheme.toUpperCase(),
                  },
                  {
                    label: "Invested Amount",
                    value: formatINR(values.principal),
                  },
                  {
                    label: "Interest Rate",
                    value: formatPercent(values.rate),
                  },
                  {
                    label: "Tenure",
                    value: `${values.years} Year${values.years === 1 ? "" : "s"}`,
                  },
                ]}
                results={[
                  {
                    label:
                      scheme === "scss" ? "Principal Returned" : "Maturity Value",
                    value: formatINR(result.maturityValue),
                  },
                  {
                    label: "Total Interest",
                    value: formatINR(result.totalInterest),
                  },
                  ...(result.periodicPayout
                    ? [
                        {
                          label: "Quarterly Payout",
                          value: formatINR(result.periodicPayout),
                        },
                      ]
                    : []),
                ]}
                chartSlices={[
                  {
                    label: "Principal",
                    value: values.principal,
                    color: "#13192B",
                  },
                  {
                    label: "Interest",
                    value: result.totalInterest,
                    color: "#F7C615",
                  },
                ]}
                journey={[
                  `${scheme.toUpperCase()} investment`,
                  `${formatINR(values.principal, true)} principal`,
                  scheme === "scss" && result.periodicPayout
                    ? `${formatINR(result.periodicPayout, true)} quarterly`
                    : `${formatINR(result.maturityValue, true)} at maturity`,
                ]}
                fileName="post-office.pdf"
              />
            }
          />
        </div>
      </div>
    </CalculatorPageLayout>
  );
}

export function PostOfficeCalculator() {
  return withCalculatorSuspense(<PostOfficeInner />);
}
