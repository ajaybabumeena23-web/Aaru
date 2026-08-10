import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  CALCULATOR_CATEGORIES,
  getCalculator,
  getCategory,
} from "@/lib/calculators";
import { CALCULATOR_REGISTRY } from "@/components/calculators/registry";

type PageProps = {
  params: { category: string; "calculator-slug": string };
};

export function generateStaticParams() {
  return CALCULATOR_CATEGORIES.flatMap((category) =>
    category.calculators.map((calc) => ({
      category: category.id,
      "calculator-slug": calc.slug,
    }))
  );
}

export function generateMetadata({ params }: PageProps): Metadata {
  const calc = getCalculator(params.category, params["calculator-slug"]);
  if (!calc) return { title: "Calculator" };
  return {
    title: calc.h1,
    description: calc.description,
  };
}

export default function CalculatorPage({ params }: PageProps) {
  const category = getCategory(params.category);
  const calc = getCalculator(params.category, params["calculator-slug"]);
  if (!category || !calc) notFound();

  const key = `${params.category}/${params["calculator-slug"]}`;
  const Calculator = CALCULATOR_REGISTRY[key];
  if (!Calculator) notFound();

  return <Calculator />;
}
