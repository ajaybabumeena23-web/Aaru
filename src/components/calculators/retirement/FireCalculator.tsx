"use client";

import { useMemo } from "react";
import { Flame } from "lucide-react";
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
import { calculateFire } from "@/utils/financial-math";
import { formatINR, formatPercent } from "@/lib/utils";

function FireInner() {
  const { values, setParam } = useCalculatorParams({
    age: { default: 30 },
    retireAge: { default: 42 },
    expenses: { default: 50_000 },
    swr: { default: 4 },
    corpus: { default: 20_00_000 },
    returnPct: { default: 12 },
    inflation: { default: 6 },
  });

  const result = useMemo(
    () =>
      calculateFire({
        currentAge: values.age,
        retirementAge: values.retireAge,
        monthlyExpenses: values.expenses,
        withdrawalRatePct: values.swr,
        currentCorpus: values.corpus,
        expectedReturnPct: values.returnPct,
        inflationPct: values.inflation,
      }),
    [values]
  );

  const returnBands = useMemo(() => {
    return rateSensitivityBands(values.returnPct, 2, {
      min: 6,
      max: 18,
    }).map((b) => {
      const r = calculateFire({
        currentAge: values.age,
        retirementAge: values.retireAge,
        monthlyExpenses: values.expenses,
        withdrawalRatePct: values.swr,
        currentCorpus: values.corpus,
        expectedReturnPct: b.ratePct,
        inflationPct: values.inflation,
      });
      return {
        label: b.label,
        hint: rateBandHint(b.ratePct),
        value: formatINR(r.requiredMonthlySip, true),
        sub: `Gap ${formatINR(r.corpusGap, true)}`,
        emphasize: b.key === "base",
      };
    });
  }, [values]);

  const interpretationPoints = [
    `To fund ${formatINR(values.expenses, true)}/mo expenses at a ${formatPercent(values.swr, 1)} withdrawal rate, you need about ${formatINR(result.targetCorpus, true)} by age ${result.retirementAge}.`,
    `Closing the ${formatINR(result.corpusGap, true)} gap implies roughly ${formatINR(result.requiredMonthlySip, true)} monthly SIP at ${formatPercent(values.returnPct, 1)} returns.`,
    "FIRE math is assumption-heavy — lower returns raise the SIP needed; use the bands below.",
  ];

  return (
    <CalculatorPageLayout
      seoKey="retirement/fire"
      categoryHref="/calculators/retirement"
      categoryLabel="Retirement & Goals"
      crumb="FIRE"
      title="Retire Early (FIRE) Planner"
      description="Target corpus from monthly expenses, safe withdrawal rate, and retirement age (default 42)."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-card-foreground">Inputs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <DraggableSlider
              id="age"
              label="Current Age"
              value={values.age}
              onChange={(v) => setParam("age", v)}
              min={18}
              max={60}
              step={1}
              suffix="yrs"
            />
            <DraggableSlider
              id="retireAge"
              label="Target Retirement Age"
              value={values.retireAge}
              onChange={(v) => setParam("retireAge", v)}
              min={30}
              max={70}
              step={1}
              suffix="yrs"
            />
            <DraggableSlider
              id="expenses"
              label="Monthly Expenses (today)"
              value={values.expenses}
              onChange={(v) => setParam("expenses", v)}
              min={10_000}
              max={5_00_000}
              step={1_000}
              prefix="₹"
            />
            <DraggableSlider
              id="swr"
              label="Safe Withdrawal Rate"
              value={values.swr}
              onChange={(v) => setParam("swr", v)}
              min={2}
              max={6}
              step={0.1}
              suffix="%"
            />
            <DraggableSlider
              id="corpus"
              label="Current Invested Corpus"
              value={values.corpus}
              onChange={(v) => setParam("corpus", v)}
              min={0}
              max={5_00_00_000}
              step={50_000}
              prefix="₹"
            />
            <DraggableSlider
              id="returnPct"
              label="Expected Return"
              value={values.returnPct}
              onChange={(v) => setParam("returnPct", v)}
              min={6}
              max={18}
              step={0.1}
              suffix="%"
            />
            <DraggableSlider
              id="inflation"
              label="Inflation"
              value={values.inflation}
              onChange={(v) => setParam("inflation", v)}
              min={2}
              max={10}
              step={0.1}
              suffix="%"
            />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-card-foreground">
                Corpus Gap vs Target
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FinancialDonutChart
                data={[
                  {
                    name: "Already covered (projected)",
                    value: Math.max(0, result.targetCorpus - result.corpusGap),
                    color: "#F7C615",
                  },
                  {
                    name: "Corpus gap",
                    value: result.corpusGap,
                    color: "#26D6C6",
                  },
                ]}
                centerLabel="Target"
                centerValue={formatINR(result.targetCorpus, true)}
              />
            </CardContent>
          </Card>

          <CalculationResultCard
            badge={
              <span className="fire-goal-badge">
                <Flame className="h-3.5 w-3.5" aria-hidden />
                FIRE Goal Reached: Age {result.retirementAge}
              </span>
            }
            metrics={[
              {
                label: "FIRE Target Corpus",
                value: formatINR(result.targetCorpus),
                emphasize: true,
                hint: `${result.yearsToRetirement} years to age ${result.retirementAge}`,
              },
              {
                label: "Expenses at retirement",
                value: formatINR(result.annualExpensesAtRetirement),
                hint: "Annual, inflation-adjusted",
              },
              { label: "Corpus gap", value: formatINR(result.corpusGap) },
              {
                label: "Required monthly SIP",
                value: formatINR(result.requiredMonthlySip),
              },
            ]}
            footer={
              <ExportPDFButton
                title="Retire Early (FIRE) Planner"
                tagline="Your personalized retirement plan"
                subtitle="FIRE — Aaru Wealth"
                hero={{
                  label: "FIRE Target Corpus",
                  value: formatINR(result.targetCorpus),
                  hint: `${result.yearsToRetirement} years to age ${result.retirementAge}`,
                }}
                inputs={[
                  { label: "Current Age", value: String(values.age) },
                  {
                    label: "Target Retirement Age",
                    value: String(values.retireAge),
                  },
                  {
                    label: "Monthly Expenses (today)",
                    value: formatINR(values.expenses),
                  },
                  {
                    label: "Safe Withdrawal Rate",
                    value: formatPercent(values.swr),
                  },
                  {
                    label: "Current Invested Corpus",
                    value: formatINR(values.corpus),
                  },
                  {
                    label: "Expected Return",
                    value: formatPercent(values.returnPct),
                  },
                  {
                    label: "Inflation",
                    value: formatPercent(values.inflation),
                  },
                ]}
                results={[
                  {
                    label: "FIRE Target Corpus",
                    value: formatINR(result.targetCorpus),
                  },
                  {
                    label: "Expenses at Retirement",
                    value: formatINR(result.annualExpensesAtRetirement),
                  },
                  {
                    label: "Corpus Gap",
                    value: formatINR(result.corpusGap),
                  },
                  {
                    label: "Required Monthly SIP",
                    value: formatINR(result.requiredMonthlySip),
                  },
                ]}
                chartSlices={[
                  {
                    label: "Already covered (projected)",
                    value: Math.max(0, result.targetCorpus - result.corpusGap),
                    color: "#F7C615",
                  },
                  {
                    label: "Corpus gap",
                    value: result.corpusGap,
                    color: "#26D6C6",
                  },
                ]}
                journey={[
                  `Age ${values.age} → retire at ${result.retirementAge}`,
                  `${formatINR(result.targetCorpus, true)} FIRE target`,
                  `${formatINR(result.requiredMonthlySip, true)} monthly SIP needed`,
                ]}
                fileName="fire.pdf"
              />
            }
          >
            <ResultInterpretation points={interpretationPoints} />
            <SensitivityBands
              title="Return sensitivity"
              parameterLabel="expected return (p.a.)"
              bands={returnBands}
              footnote="Bands show required monthly SIP if returns differ — not a guarantee you can retire."
            />
          </CalculationResultCard>
        </div>
      </div>
    </CalculatorPageLayout>
  );
}

export function FireCalculator() {
  return withCalculatorSuspense(<FireInner />);
}
