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
import { calculateChildEducation } from "@/utils/financial-math";
import { formatINR, formatPercent } from "@/lib/utils";

function ChildEducationInner() {
  const { values, setParam } = useCalculatorParams({
    cost: { default: 25_00_000 },
    years: { default: 12 },
    eduInflation: { default: 11 },
    existing: { default: 2_00_000 },
    returnPct: { default: 12 },
    programYears: { default: 4 },
  });

  const result = useMemo(
    () =>
      calculateChildEducation({
        currentCost: values.cost,
        yearsUntilStart: values.years,
        educationInflationPct: values.eduInflation,
        existingCorpus: values.existing,
        expectedReturnPct: values.returnPct,
        programYears: values.programYears,
      }),
    [values]
  );

  return (
    <CalculatorPageLayout
      seoKey="retirement/child-education"
      categoryHref="/calculators/retirement"
      categoryLabel="Retirement & Goals"
      crumb="Child Education"
      title="Fund Your Child's Education"
      description="Plan for 10–12% education inflation and a multi-year degree cost."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Inputs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <DraggableSlider
              id="cost"
              label="Current Annual Education Cost"
              value={values.cost}
              onChange={(v) => setParam("cost", v)}
              min={1_00_000}
              max={50_00_000}
              step={50_000}
              prefix="₹"
            />
            <DraggableSlider
              id="years"
              label="Years Until College"
              value={values.years}
              onChange={(v) => setParam("years", v)}
              min={1}
              max={20}
              step={1}
              suffix="yrs"
            />
            <DraggableSlider
              id="eduInflation"
              label="Education Inflation"
              value={values.eduInflation}
              onChange={(v) => setParam("eduInflation", v)}
              min={6}
              max={15}
              step={0.5}
              suffix="%"
            />
            <DraggableSlider
              id="programYears"
              label="Program Duration"
              value={values.programYears}
              onChange={(v) => setParam("programYears", v)}
              min={1}
              max={6}
              step={1}
              suffix="yrs"
            />
            <DraggableSlider
              id="existing"
              label="Existing Education Corpus"
              value={values.existing}
              onChange={(v) => setParam("existing", v)}
              min={0}
              max={1_00_00_000}
              step={50_000}
              prefix="₹"
            />
            <DraggableSlider
              id="returnPct"
              label="Expected Investment Return"
              value={values.returnPct}
              onChange={(v) => setParam("returnPct", v)}
              min={6}
              max={15}
              step={0.1}
              suffix="%"
            />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Covered vs Gap</CardTitle>
            </CardHeader>
            <CardContent>
              <FinancialDonutChart
                data={[
                  {
                    name: "Covered (projected)",
                    value: Math.max(
                      0,
                      result.totalProgramCost - result.corpusGap
                    ),
                  },
                  {
                    name: "Funding gap",
                    value: result.corpusGap,
                    color: "hsl(32 95% 44%)",
                  },
                ]}
                centerLabel="Program cost"
                centerValue={formatINR(result.totalProgramCost, true)}
              />
            </CardContent>
          </Card>

          <CalculationResultCard
            metrics={[
              {
                label: "First-year future cost",
                value: formatINR(result.futureCost),
              },
              {
                label: "Total program cost",
                value: formatINR(result.totalProgramCost),
                emphasize: true,
              },
              { label: "Corpus gap", value: formatINR(result.corpusGap) },
              {
                label: "Required monthly SIP",
                value: formatINR(result.requiredMonthlySip),
              },
            ]}
            footer={
              <ExportPDFButton
                title="Fund Your Child's Education"
                tagline="Your personalized education funding plan"
                subtitle="Child Education — Aaru Wealth"
                hero={{
                  label: "Total Program Cost",
                  value: formatINR(result.totalProgramCost),
                  hint: `${values.programYears}-year program after inflation`,
                }}
                inputs={[
                  {
                    label: "Current Annual Education Cost",
                    value: formatINR(values.cost),
                  },
                  {
                    label: "Years Until College",
                    value: `${values.years} Year${values.years === 1 ? "" : "s"}`,
                  },
                  {
                    label: "Education Inflation",
                    value: formatPercent(values.eduInflation),
                  },
                  {
                    label: "Program Duration",
                    value: `${values.programYears} Year${values.programYears === 1 ? "" : "s"}`,
                  },
                  {
                    label: "Existing Education Corpus",
                    value: formatINR(values.existing),
                  },
                  {
                    label: "Expected Investment Return",
                    value: formatPercent(values.returnPct),
                  },
                ]}
                results={[
                  {
                    label: "First-Year Future Cost",
                    value: formatINR(result.futureCost),
                  },
                  {
                    label: "Total Program Cost",
                    value: formatINR(result.totalProgramCost),
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
                    label: "Covered (projected)",
                    value: Math.max(
                      0,
                      result.totalProgramCost - result.corpusGap
                    ),
                    color: "#13192B",
                  },
                  {
                    label: "Funding gap",
                    value: result.corpusGap,
                    color: "#F7C615",
                  },
                ]}
                journey={[
                  `${formatINR(values.cost, true)} current annual cost`,
                  `${formatINR(result.totalProgramCost, true)} future program cost`,
                  `${formatINR(result.requiredMonthlySip, true)} monthly SIP needed`,
                ]}
                fileName="child-education.pdf"
              />
            }
          />
        </div>
      </div>
    </CalculatorPageLayout>
  );
}

export function ChildEducationCalculator() {
  return withCalculatorSuspense(<ChildEducationInner />);
}
