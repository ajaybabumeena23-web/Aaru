"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  parseJsonParam,
  serializeJsonParam,
  useCalculatorParams,
} from "@/hooks/useCalculatorParams";
import {
  generateAmortizationSchedule,
  type PrepaymentEvent,
} from "@/utils/financial-math";
import { formatINR, formatNumber } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

function AdvancedPrepaymentInner() {
  const searchParams = useSearchParams();

  const { values, setParam } = useCalculatorParams({
    principal: { default: 50_00_000 },
    rate: { default: 8.5 },
    tenure: { default: 20 },
    stepUp: { default: 0 },
  });

  const [prepayments, setPrepayments] = useState<PrepaymentEvent[]>(() =>
    parseJsonParam<PrepaymentEvent[]>(searchParams.get("prepay"), [
      { month: 12, amount: 1_00_000 },
    ])
  );

  // Keep prepayments in URL via a lightweight effect on parent values sync —
  // we serialize when schedule is computed / on change by patching history.
  const syncPrepayToUrl = (next: PrepaymentEvent[]) => {
    setPrepayments(next);
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    const meaningful = next.filter((p) => p.month > 0 && p.amount > 0);
    if (meaningful.length === 0) url.searchParams.delete("prepay");
    else url.searchParams.set("prepay", serializeJsonParam(meaningful));
    window.history.replaceState(null, "", url.toString());
  };

  const tenureMonths = values.tenure * 12;

  const result = useMemo(
    () =>
      generateAmortizationSchedule({
        principal: values.principal,
        annualRatePct: values.rate,
        tenureMonths,
        annualEmiStepUpPct: values.stepUp,
        prepayments: prepayments.filter((p) => p.month > 0 && p.amount > 0),
        prepaymentMode: "tenure",
      }),
    [values, tenureMonths, prepayments]
  );

  const addPrepayment = () => {
    syncPrepayToUrl([
      ...prepayments,
      { month: Math.min(tenureMonths, 24), amount: 50_000 },
    ]);
  };

  const updatePrepayment = (
    index: number,
    patch: Partial<PrepaymentEvent>
  ) => {
    syncPrepayToUrl(
      prepayments.map((p, i) => (i === index ? { ...p, ...patch } : p))
    );
  };

  const removePrepayment = (index: number) => {
    syncPrepayToUrl(prepayments.filter((_, i) => i !== index));
  };

  return (
    <CalculatorPageLayout
      seoKey="debt/advanced-prepayment"
      categoryHref="/calculators/debt"
      categoryLabel="Debt Management"
      crumb="Advanced Prepayment"
      title="Crush Debt Faster with Smart Prepayments"
      description="Model lump-sum prepayments in specific months and optional annual EMI step-ups. Amortization updates instantly; share via URL."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Loan Inputs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <DraggableSlider
                id="principal"
                label="Loan Amount"
                value={values.principal}
                onChange={(v) => setParam("principal", v)}
                min={1_00_000}
                max={5_00_00_000}
                step={50_000}
                prefix="₹"
              />
              <DraggableSlider
                id="rate"
                label="Interest Rate (p.a.)"
                value={values.rate}
                onChange={(v) => setParam("rate", v)}
                min={5}
                max={18}
                step={0.05}
                suffix="%"
              />
              <DraggableSlider
                id="tenure"
                label="Original Tenure"
                value={values.tenure}
                onChange={(v) => setParam("tenure", v)}
                min={1}
                max={30}
                step={1}
                suffix="yrs"
              />
              <DraggableSlider
                id="stepUp"
                label="Annual EMI Step-Up"
                value={values.stepUp}
                onChange={(v) => setParam("stepUp", v)}
                min={0}
                max={20}
                step={1}
                suffix="%"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-lg">Lump-Sum Prepayments</CardTitle>
              <Button type="button" size="sm" variant="outline" onClick={addPrepayment}>
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {prepayments.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No prepayments yet. Add a month + amount to see interest saved.
                </p>
              ) : (
                prepayments.map((p, i) => (
                  <div
                    key={`${p.month}-${i}`}
                    className="grid grid-cols-[1fr_1fr_auto] items-end gap-2"
                  >
                    <div className="space-y-1">
                      <Label className="text-xs">Month #</Label>
                      <Input
                        type="number"
                        min={1}
                        max={tenureMonths}
                        value={p.month}
                        onChange={(e) =>
                          updatePrepayment(i, {
                            month: Number(e.target.value) || 1,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Amount (₹)</Label>
                      <Input
                        type="number"
                        min={0}
                        step={1000}
                        value={p.amount}
                        onChange={(e) =>
                          updatePrepayment(i, {
                            amount: Number(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      aria-label="Remove prepayment"
                      onClick={() => removePrepayment(i)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
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
                centerLabel="Total Outflow"
                centerValue={formatINR(result.totalPayment, true)}
              />
            </CardContent>
          </Card>

          <CalculationResultCard
            metrics={[
              { label: "Standard EMI", value: formatINR(result.emi) },
              {
                label: "Months to Clear",
                value: `${result.monthsTaken} mo`,
                hint:
                  result.monthsSavedVsBaseline && result.monthsSavedVsBaseline > 0
                    ? `${result.monthsSavedVsBaseline} months saved vs baseline`
                    : undefined,
              },
              {
                label: "Total Interest",
                value: formatINR(result.totalInterest),
              },
              {
                label: "Interest Saved",
                value: formatINR(result.interestSavedVsBaseline ?? 0),
                emphasize: true,
                hint: "Versus loan with no prepayments / EMI step-ups",
              },
              {
                label: "Total Prepayments",
                value: formatINR(result.totalPrepayment),
              },
            ]}
            footer={
              <ExportPDFButton
                title="Crush Debt Faster with Smart Prepayments"
                tagline="Your personalized prepayment savings summary"
                subtitle="Advanced Prepayment — Aaru Wealth"
                hero={{
                  label: "Interest Saved",
                  value: formatINR(result.interestSavedVsBaseline ?? 0),
                  hint: "Versus loan with no prepayments / EMI step-ups",
                }}
                inputs={[
                  {
                    label: "Loan Amount",
                    value: formatINR(values.principal),
                  },
                  {
                    label: "Interest Rate",
                    value: `${values.rate}%`,
                  },
                  {
                    label: "Loan Tenure",
                    value: `${values.tenure} Year${values.tenure === 1 ? "" : "s"}`,
                  },
                  {
                    label: "EMI Step-Up",
                    value: `${values.stepUp}%`,
                  },
                  ...prepayments.map((p, i) => ({
                    label: `Prepayment #${i + 1}`,
                    value: `Month ${p.month}: ${formatINR(p.amount)}`,
                  })),
                ]}
                results={[
                  { label: "Standard EMI", value: formatINR(result.emi) },
                  {
                    label: "Months to Clear",
                    value: String(result.monthsTaken),
                  },
                  {
                    label: "Total Interest",
                    value: formatINR(result.totalInterest),
                  },
                  {
                    label: "Interest Saved",
                    value: formatINR(result.interestSavedVsBaseline ?? 0),
                  },
                ]}
                chartSlices={[
                  {
                    label: "Principal",
                    value: values.principal,
                    color: "#13192B",
                  },
                  {
                    label: "Interest Paid",
                    value: result.totalInterest,
                    color: "#F7C615",
                  },
                ]}
                balanceSeries={result.schedule.map((r) => r.balance)}
                balanceSeriesYears={Math.max(
                  1,
                  Math.ceil(result.monthsTaken / 12)
                )}
                balanceChartTitle="Outstanding loan balance"
                journey={[
                  `${formatINR(values.principal, true)} borrowed`,
                  `${result.monthsTaken} months to clear`,
                  `${formatINR(result.interestSavedVsBaseline ?? 0, true)} interest saved`,
                ]}
                table={{
                  title: "Repayment schedule",
                  groupByYear: true,
                  monthKey: "month",
                  columns: [
                    { header: "Mo", key: "month" },
                    { header: "EMI", key: "emi" },
                    { header: "Principal", key: "principal" },
                    { header: "Interest", key: "interest" },
                    { header: "Prepay", key: "prepay" },
                    { header: "Balance", key: "balance" },
                  ],
                  rows: result.schedule.map((r) => ({
                    month: r.month,
                    emi: formatNumber(r.emi),
                    principal: formatNumber(r.principalComponent),
                    interest: formatNumber(r.interestComponent),
                    prepay: formatNumber(r.prepayment),
                    balance: formatNumber(r.balance),
                  })),
                  maxRows: 240,
                }}
                fileName="advanced-prepayment.pdf"
              />
            }
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Amortization Schedule</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="py-2 pr-3 font-medium">Month</th>
                <th className="py-2 pr-3 font-medium">EMI</th>
                <th className="py-2 pr-3 font-medium">Principal</th>
                <th className="py-2 pr-3 font-medium">Interest</th>
                <th className="py-2 pr-3 font-medium">Prepayment</th>
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
                  <td className="py-1.5 pr-3">
                    {row.prepayment > 0 ? formatINR(row.prepayment) : "—"}
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

export function AdvancedPrepaymentCalculator() {
  return withCalculatorSuspense(<AdvancedPrepaymentInner />);
}
