"use client";

import { useMemo } from "react";
import {
  CalculationResultCard,
  DraggableSlider,
  ExportPDFButton,
} from "@/components/calculators";
import {
  CalculatorPageLayout,
  withCalculatorSuspense,
} from "@/components/calculators/CalculatorPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCalculatorParams } from "@/hooks/useCalculatorParams";
import { calculateReverseSip, calculateSip } from "@/utils/financial-math";
import { formatINR, formatPercent } from "@/lib/utils";

/**
 * Advanced goal planner: target corpus → required SIP, plus optional
 * "what if I invest X" forward projection.
 */
function GoalPlannerInner() {
  const { values, setParam } = useCalculatorParams({
    target: { default: 1_00_00_000 },
    rate: { default: 12 },
    years: { default: 15 },
    current: { default: 0 },
    whatIfMonthly: { default: 20_000 },
  });

  const remainingTarget = Math.max(0, values.target - values.current);

  const reverse = useMemo(
    () =>
      calculateReverseSip({
        targetCorpus: remainingTarget,
        annualRatePct: values.rate,
        years: values.years,
      }),
    [remainingTarget, values.rate, values.years]
  );

  const whatIf = useMemo(() => {
    const fromSip = calculateSip({
      monthlyInvestment: values.whatIfMonthly,
      annualRatePct: values.rate,
      years: values.years,
    });
    const months = Math.round(values.years * 12);
    const r = values.rate / 12 / 100;
    const grownCurrent =
      values.current <= 0
        ? 0
        : Math.abs(r) < 1e-12
          ? values.current
          : values.current * Math.pow(1 + r, months);
    const total = Math.round(fromSip.maturityValue + grownCurrent);
    return {
      sipMaturity: fromSip.maturityValue,
      grownCurrent: Math.round(grownCurrent),
      total,
      gap: Math.round(values.target - total),
    };
  }, [values]);

  return (
    <CalculatorPageLayout
      seoKey="retirement/goal-planner"
      categoryHref="/calculators/retirement"
      categoryLabel="Retirement & Goals"
      crumb="Goal Planner"
      title="Plan the SIP Behind Your Money Goal"
      description="Enter a target corpus and timeline to estimate the monthly SIP required. Compare with a what-if contribution. Illustrative only."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Goal inputs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <DraggableSlider
              id="target"
              label="Target corpus"
              value={values.target}
              onChange={(v) => setParam("target", v)}
              min={1_00_000}
              max={10_00_00_000}
              step={1_00_000}
              prefix="₹"
            />
            <DraggableSlider
              id="current"
              label="Already saved (optional)"
              value={values.current}
              onChange={(v) => setParam("current", v)}
              min={0}
              max={5_00_00_000}
              step={50_000}
              prefix="₹"
            />
            <DraggableSlider
              id="rate"
              label="Expected return (p.a.)"
              value={values.rate}
              onChange={(v) => setParam("rate", v)}
              min={4}
              max={18}
              step={0.1}
              suffix="%"
            />
            <DraggableSlider
              id="years"
              label="Years to goal"
              value={values.years}
              onChange={(v) => setParam("years", v)}
              min={1}
              max={40}
              step={1}
              suffix="yrs"
            />
            <DraggableSlider
              id="whatIfMonthly"
              label="What-if monthly SIP"
              value={values.whatIfMonthly}
              onChange={(v) => setParam("whatIfMonthly", v)}
              min={500}
              max={5_00_000}
              step={500}
              prefix="₹"
            />
          </CardContent>
        </Card>

        <div className="space-y-6 calculator-results-sticky">
          <CalculationResultCard
            metrics={[
              {
                label: "SIP needed (for remaining target)",
                value: formatINR(reverse.monthlySip),
                emphasize: true,
              },
              {
                label: "Total you'd invest at that SIP",
                value: formatINR(reverse.totalInvested),
              },
              {
                label: "Remaining target after current savings",
                value: formatINR(remainingTarget),
              },
            ]}
          />

          <CalculationResultCard
            metrics={[
              {
                label: "What-if: SIP maturity",
                value: formatINR(whatIf.sipMaturity),
              },
              {
                label: "What-if: grown current savings",
                value: formatINR(whatIf.grownCurrent),
              },
              {
                label: "What-if: combined corpus",
                value: formatINR(whatIf.total),
                emphasize: true,
              },
              {
                label:
                  whatIf.gap > 0
                    ? "Shortfall vs target"
                    : "Surplus vs target",
                value: formatINR(Math.abs(whatIf.gap)),
              },
            ]}
            footer={
              <ExportPDFButton
                title="Goal Planner"
                subtitle="Aaru Wealth"
                inputs={[
                  { label: "Target", value: formatINR(values.target) },
                  { label: "Current", value: formatINR(values.current) },
                  { label: "Return", value: formatPercent(values.rate) },
                  { label: "Years", value: String(values.years) },
                ]}
                results={[
                  {
                    label: "Required SIP",
                    value: formatINR(reverse.monthlySip),
                  },
                  {
                    label: "What-if combined",
                    value: formatINR(whatIf.total),
                  },
                ]}
                fileName="goal-planner.pdf"
              />
            }
          />
        </div>
      </div>
    </CalculatorPageLayout>
  );
}

export function GoalPlannerCalculator() {
  return withCalculatorSuspense(<GoalPlannerInner />);
}
