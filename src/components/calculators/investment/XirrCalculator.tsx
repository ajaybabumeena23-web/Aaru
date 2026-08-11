"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  CalculationResultCard,
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
import { calculateXirr, type CashFlow } from "@/utils/financial-math";
import { formatINR, formatPercent } from "@/lib/utils";

type Row = { id: string; date: string; amount: number };

function XirrInner() {
  const [rows, setRows] = useState<Row[]>([
    { id: "1", date: "2022-01-01", amount: -1_00_000 },
    { id: "2", date: "2023-01-01", amount: -50_000 },
    { id: "3", date: "2025-01-01", amount: 2_00_000 },
  ]);

  const cashFlows: CashFlow[] = useMemo(
    () => rows.map((r) => ({ date: r.date, amount: r.amount })),
    [rows]
  );

  const result = useMemo(() => calculateXirr(cashFlows), [cashFlows]);

  const invested = rows
    .filter((r) => r.amount < 0)
    .reduce((s, r) => s + Math.abs(r.amount), 0);
  const returned = rows
    .filter((r) => r.amount > 0)
    .reduce((s, r) => s + r.amount, 0);
  const net = returned - invested;

  return (
    <CalculatorPageLayout
      seoKey="investment/xirr"
      categoryHref="/calculators/investment"
      categoryLabel="Investment & Wealth"
      crumb="XIRR"
      title="Measure True Portfolio Returns"
      description="Compute XIRR for irregular cash flows using Newton-Raphson. Negative = investment, positive = redemption."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-lg">Cash Flows</CardTitle>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() =>
                setRows((prev) => [
                  ...prev,
                  {
                    id: String(Date.now()),
                    date: new Date().toISOString().slice(0, 10),
                    amount: -10_000,
                  },
                ])
              }
            >
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {rows.map((row, i) => (
              <div
                key={row.id}
                className="grid grid-cols-[1.2fr_1fr_auto] items-end gap-2"
              >
                <div className="space-y-1">
                  <Label className="text-xs">Date</Label>
                  <Input
                    type="date"
                    value={row.date}
                    onChange={(e) =>
                      setRows((prev) =>
                        prev.map((r, idx) =>
                          idx === i ? { ...r, date: e.target.value } : r
                        )
                      )
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Amount (₹)</Label>
                  <Input
                    type="number"
                    value={row.amount}
                    onChange={(e) =>
                      setRows((prev) =>
                        prev.map((r, idx) =>
                          idx === i
                            ? { ...r, amount: Number(e.target.value) || 0 }
                            : r
                        )
                      )
                    }
                  />
                </div>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  disabled={rows.length <= 2}
                  onClick={() =>
                    setRows((prev) => prev.filter((_, idx) => idx !== i))
                  }
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
            <p className="text-xs text-muted-foreground">
              Tip: use negative amounts for investments and positive for
              redemptions / current value.
            </p>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Invested vs Returned</CardTitle>
            </CardHeader>
            <CardContent>
              <FinancialDonutChart
                data={[
                  { name: "Invested", value: invested },
                  {
                    name: net >= 0 ? "Net Gain" : "Net Loss",
                    value: Math.abs(net),
                    color:
                      net >= 0 ? "hsl(32 95% 44%)" : "hsl(0 72% 51%)",
                  },
                ]}
                centerLabel="XIRR"
                centerValue={
                  result.converged
                    ? formatPercent(result.xirrPct)
                    : "N/A"
                }
              />
            </CardContent>
          </Card>

          <CalculationResultCard
            metrics={[
              {
                label: "XIRR",
                value: result.converged
                  ? formatPercent(result.xirrPct)
                  : "Did not converge",
                emphasize: true,
                hint: result.converged
                  ? `Converged in ${result.iterations} iterations`
                  : "Check that flows include both investments and returns",
              },
              { label: "Total Invested", value: formatINR(invested) },
              { label: "Total Returned", value: formatINR(returned) },
              { label: "Net P&L", value: formatINR(net) },
            ]}
            footer={
              <ExportPDFButton
                title="Measure True Portfolio Returns"
                subtitle="XIRR — Aaru Wealth"
                inputs={rows.map((r, i) => ({
                  label: `Flow ${i + 1}`,
                  value: `${r.date}: ${formatINR(r.amount)}`,
                }))}
                results={[
                  {
                    label: "XIRR",
                    value: result.converged
                      ? formatPercent(result.xirrPct)
                      : "N/A",
                  },
                  { label: "Invested", value: formatINR(invested) },
                  { label: "Returned", value: formatINR(returned) },
                ]}
                fileName="xirr.pdf"
              />
            }
          />
        </div>
      </div>
    </CalculatorPageLayout>
  );
}

export function XirrCalculator() {
  return withCalculatorSuspense(<XirrInner />);
}
