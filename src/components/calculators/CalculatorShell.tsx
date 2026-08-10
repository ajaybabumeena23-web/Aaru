"use client";

import Link from "next/link";
import type { CalculatorMeta } from "@/lib/calculators";
import {
  CalculationResultCard,
  DraggableSlider,
  ExportPDFButton,
  FinancialDonutChart,
} from "@/components/calculators";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatINR } from "@/lib/utils";

type CalculatorShellProps = {
  categoryId: string;
  categoryLabel: string;
  calculator: CalculatorMeta;
};

/**
 * Placeholder shell for Steps 1–2.
 * Demonstrates the reusable UI kit; live math lands in Step 3+.
 */
export function CalculatorShell({
  categoryId,
  categoryLabel,
  calculator,
}: CalculatorShellProps) {
  const demoPrincipal = 5_00_000;
  const demoGain = 3_25_000;

  return (
    <div className="space-y-6">
      <nav className="text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/calculators/${categoryId}`}
          className="hover:text-foreground"
        >
          {categoryLabel}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{calculator.title}</span>
      </nav>

      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{calculator.h1}</h1>
        <p className="max-w-2xl text-muted-foreground">
          {calculator.description} Full calculation engine arrives in Step 3 —
          this page previews the shared UI pattern.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Inputs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <DraggableSlider
              id="demo-principal"
              label="Sample Principal"
              value={demoPrincipal}
              onChange={() => undefined}
              min={10_000}
              max={1_00_00_000}
              step={10_000}
              prefix="₹"
              disabled
            />
            <DraggableSlider
              id="demo-rate"
              label="Sample Rate"
              value={12}
              onChange={() => undefined}
              min={1}
              max={30}
              step={0.1}
              suffix="%"
              disabled
            />
            <p className="rounded-md border border-dashed bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
              Interactive controls + URL sync will bind here once the math
              engine (`utils/financial-math.ts`) is implemented.
            </p>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Principal vs Wealth</CardTitle>
            </CardHeader>
            <CardContent>
              <FinancialDonutChart
                data={[
                  { name: "Principal", value: demoPrincipal },
                  { name: "Wealth Gained", value: demoGain },
                ]}
                centerLabel="Total"
                centerValue={formatINR(demoPrincipal + demoGain, true)}
              />
            </CardContent>
          </Card>

          <CalculationResultCard
            metrics={[
              {
                label: "Invested",
                value: formatINR(demoPrincipal),
              },
              {
                label: "Wealth Gained",
                value: formatINR(demoGain),
              },
              {
                label: "Maturity Value",
                value: formatINR(demoPrincipal + demoGain),
                emphasize: true,
                hint: "Demo figures — replace with live engine output",
              },
            ]}
            footer={
              <ExportPDFButton
                title={calculator.h1}
                subtitle={calculator.description}
                inputs={[
                  { label: "Principal", value: formatINR(demoPrincipal) },
                  { label: "Rate", value: "12%" },
                ]}
                results={[
                  { label: "Invested", value: formatINR(demoPrincipal) },
                  { label: "Wealth Gained", value: formatINR(demoGain) },
                  {
                    label: "Maturity",
                    value: formatINR(demoPrincipal + demoGain),
                  },
                ]}
                fileName={`${calculator.slug}-demo.pdf`}
              />
            }
          />
        </div>
      </div>
    </div>
  );
}
