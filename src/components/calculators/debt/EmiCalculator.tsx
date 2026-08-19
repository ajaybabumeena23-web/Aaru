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
import { basicEmi } from "@/utils/financial-math";
import { formatINR, formatNumber, formatPercent } from "@/lib/utils";

export type EmiVariantConfig = {
  seoKey: string;
  crumb: string;
  title: string;
  description: string;
  defaults: { principal: number; rate: number; tenure: number };
  principalMax?: number;
  fileName: string;
};

const GENERAL: EmiVariantConfig = {
  seoKey: "debt/emi",
  crumb: "EMI",
  title: "Know Your Exact Monthly EMI",
  description:
    "Calculate EMI, total interest, and principal vs interest breakup instantly.",
  defaults: { principal: 50_00_000, rate: 8.5, tenure: 20 },
  fileName: "emi.pdf",
};

function EmiInner({ config }: { config: EmiVariantConfig }) {
  const { values, setParam } = useCalculatorParams({
    principal: { default: config.defaults.principal },
    rate: { default: config.defaults.rate },
    tenure: { default: config.defaults.tenure },
  });

  const result = useMemo(
    () =>
      basicEmi({
        principal: values.principal,
        annualRatePct: values.rate,
        tenureMonths: values.tenure * 12,
      }),
    [values]
  );

  const rateBands = useMemo(() => {
    return rateSensitivityBands(values.rate, 1, {
      min: 5,
      max: 24,
      labels: ["Lower rate", "Your rate", "Higher rate"],
    }).map((b) => {
      const r = basicEmi({
        principal: values.principal,
        annualRatePct: b.ratePct,
        tenureMonths: values.tenure * 12,
      });
      return {
        label: b.label,
        hint: rateBandHint(b.ratePct),
        value: formatINR(r.emi, true),
        sub: `Interest ${formatINR(r.totalInterest, true)}`,
        emphasize: b.key === "base",
      };
    });
  }, [values]);

  const interestShare =
    result.totalPayment > 0
      ? Math.round((result.totalInterest / result.totalPayment) * 100)
      : 0;

  const interpretationPoints = [
    `On a ${formatINR(values.principal, true)} loan at ${formatPercent(values.rate, 2)} for ${values.tenure} year${values.tenure === 1 ? "" : "s"}, EMI is about ${formatINR(result.emi, true)}.`,
    `You pay roughly ${formatINR(result.totalInterest, true)} in interest (~${interestShare}% of total repayment).`,
    "Even a 1% rate change moves EMI and lifetime interest meaningfully — compare the bands below.",
  ];

  return (
    <CalculatorPageLayout
      seoKey={config.seoKey}
      categoryHref="/calculators/debt"
      categoryLabel="Debt Management"
      crumb={config.crumb}
      title={config.title}
      description={config.description}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Inputs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <DraggableSlider
              id="principal"
              label="Loan Amount"
              value={values.principal}
              onChange={(v) => setParam("principal", v)}
              min={50_000}
              max={config.principalMax ?? 5_00_00_000}
              step={10_000}
              prefix="₹"
            />
            <DraggableSlider
              id="rate"
              label="Interest Rate (p.a.)"
              value={values.rate}
              onChange={(v) => setParam("rate", v)}
              min={5}
              max={24}
              step={0.05}
              suffix="%"
            />
            <DraggableSlider
              id="tenure"
              label="Tenure"
              value={values.tenure}
              onChange={(v) => setParam("tenure", v)}
              min={1}
              max={30}
              step={1}
              suffix="yrs"
            />
          </CardContent>
        </Card>

        <div className="space-y-6 calculator-results-sticky">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Principal vs Interest Paid</CardTitle>
            </CardHeader>
            <CardContent>
              <FinancialDonutChart
                data={[
                  { name: "Principal", value: values.principal },
                  {
                    name: "Interest Paid",
                    value: result.totalInterest,
                    color: "hsl(0 72% 51%)",
                  },
                ]}
                centerLabel="EMI"
                centerValue={formatINR(result.emi, true)}
              />
            </CardContent>
          </Card>

          <CalculationResultCard
            metrics={[
              {
                label: "Monthly EMI",
                value: formatINR(result.emi),
                emphasize: true,
                hint: `${formatPercent(values.rate, 2)} · ${values.tenure} yr tenure`,
              },
              { label: "Total Interest", value: formatINR(result.totalInterest) },
              { label: "Total Payment", value: formatINR(result.totalPayment) },
            ]}
            footer={
              <ExportPDFButton
                title={
                  config.seoKey === "debt/personal-loan-emi"
                    ? "Personal Loan EMI Calculator"
                    : config.seoKey === "debt/home-loan-emi"
                      ? "Home Loan EMI Calculator"
                      :                   config.seoKey === "debt/car-loan-emi"
                        ? "Car Loan EMI Calculator"
                        : config.seoKey === "debt/education-loan-emi"
                          ? "Education Loan EMI Calculator"
                          : "EMI Calculator"
                }
                tagline="Your personalized loan repayment summary"
                subtitle={`${config.crumb} — Aaru Wealth`}
                hero={{
                  label: "Your Monthly EMI",
                  value: formatINR(result.emi),
                  hint: "per month",
                }}
                inputs={[
                  { label: "Loan Amount", value: formatINR(values.principal) },
                  { label: "Interest Rate", value: formatPercent(values.rate) },
                  {
                    label: "Loan Tenure",
                    value: `${values.tenure} Year${values.tenure === 1 ? "" : "s"}`,
                  },
                ]}
                results={[
                  {
                    label: "Principal (Loan Amount)",
                    value: formatINR(values.principal),
                  },
                  {
                    label: "Total Interest",
                    value: formatINR(result.totalInterest),
                  },
                  {
                    label: "Total Repayment",
                    value: formatINR(result.totalPayment),
                  },
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
                balanceSeries={result.schedule.map((r) => r.balance)}
                balanceChartTitle="Outstanding loan balance"
                journey={[
                  `${formatINR(values.principal, true)} borrowed`,
                  `${result.schedule.length} monthly payments`,
                  "Loan fully repaid",
                ]}
                table={{
                  title: "Repayment schedule",
                  groupByYear: true,
                  monthKey: "month",
                  columns: [
                    { header: "Month", key: "month" },
                    { header: "EMI", key: "emi" },
                    { header: "Principal", key: "p" },
                    { header: "Interest", key: "i" },
                    { header: "Outstanding Balance", key: "b" },
                  ],
                  rows: result.schedule.map((r) => ({
                    month: r.month,
                    emi: formatNumber(r.emi),
                    p: formatNumber(r.principalComponent),
                    i: formatNumber(r.interestComponent),
                    b: formatNumber(r.balance),
                  })),
                  maxRows: 400,
                }}
                fileName={config.fileName}
              />
            }
          >
            <ResultInterpretation points={interpretationPoints} />
            <SensitivityBands
              title="Rate sensitivity"
              parameterLabel="interest rate (p.a.)"
              bands={rateBands}
            />
          </CalculationResultCard>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Amortization Schedule</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="py-2 pr-3 font-medium">Month</th>
                <th className="py-2 pr-3 font-medium">EMI</th>
                <th className="py-2 pr-3 font-medium">Principal</th>
                <th className="py-2 pr-3 font-medium">Interest</th>
                <th className="py-2 font-medium">Balance</th>
              </tr>
            </thead>
            <tbody>
              {result.schedule.map((row) => (
                <tr
                  key={row.month}
                  className="border-b border-border/60 tabular-nums hover:bg-muted/40"
                >
                  <td className="py-1.5 pr-3">{row.month}</td>
                  <td className="py-1.5 pr-3">{formatINR(row.emi)}</td>
                  <td className="py-1.5 pr-3">
                    {formatINR(row.principalComponent)}
                  </td>
                  <td className="py-1.5 pr-3">
                    {formatINR(row.interestComponent)}
                  </td>
                  <td className="py-1.5">{formatINR(row.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </CalculatorPageLayout>
  );
}

export function EmiCalculator() {
  return withCalculatorSuspense(<EmiInner config={GENERAL} />);
}

export function HomeLoanEmiCalculator() {
  return withCalculatorSuspense(
    <EmiInner
      config={{
        seoKey: "debt/home-loan-emi",
        crumb: "Home Loan EMI",
        title: "Home Loan EMI Calculator",
        description:
          "Estimate home loan EMI, total interest and amortisation. Defaults suit longer housing tenures—adjust to your sanction letter.",
        defaults: { principal: 50_00_000, rate: 8.5, tenure: 20 },
        fileName: "home-loan-emi.pdf",
      }}
    />
  );
}

export function PersonalLoanEmiCalculator() {
  return withCalculatorSuspense(
    <EmiInner
      config={{
        seoKey: "debt/personal-loan-emi",
        crumb: "Personal Loan EMI",
        title: "Personal Loan EMI Calculator",
        description:
          "Estimate personal loan EMI with shorter-tenure defaults. Confirm your lender’s rate, fees and foreclosure rules separately.",
        defaults: { principal: 5_00_000, rate: 14, tenure: 4 },
        principalMax: 50_00_000,
        fileName: "personal-loan-emi.pdf",
      }}
    />
  );
}

export function CarLoanEmiCalculator() {
  return withCalculatorSuspense(
    <EmiInner
      config={{
        seoKey: "debt/car-loan-emi",
        crumb: "Car Loan EMI",
        title: "Car Loan EMI Calculator",
        description:
          "Estimate car loan EMI and total interest. Defaults reflect typical auto-loan tenures—edit to match your quote.",
        defaults: { principal: 8_00_000, rate: 10, tenure: 5 },
        principalMax: 50_00_000,
        fileName: "car-loan-emi.pdf",
      }}
    />
  );
}

export function EducationLoanEmiCalculator() {
  return withCalculatorSuspense(
    <EmiInner
      config={{
        seoKey: "debt/education-loan-emi",
        crumb: "Education Loan EMI",
        title: "Education Loan EMI Calculator",
        description:
          "Estimate education loan EMI and total interest. Defaults suit typical study-loan tenures—confirm moratorium and rate with your lender.",
        defaults: { principal: 15_00_000, rate: 9.5, tenure: 10 },
        principalMax: 1_00_00_000,
        fileName: "education-loan-emi.pdf",
      }}
    />
  );
}
