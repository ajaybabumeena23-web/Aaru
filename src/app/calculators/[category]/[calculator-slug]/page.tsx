import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  CALCULATOR_CATEGORIES,
  getCalculator,
  getCategory,
} from "@/lib/calculators";
import { CALCULATOR_REGISTRY } from "@/components/calculators/registry";
import { getCalculatorSeo, getSeoKeyFromParts } from "@/lib/calculator-seo";
import { getSiteUrl } from "@/lib/site";
import { SITE_NAME } from "@/lib/brand";

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

  const seoKey = getSeoKeyFromParts(params.category, params["calculator-slug"]);
  const seo = getCalculatorSeo(seoKey);
  const base = getSiteUrl();
  const path = `/calculators/${params.category}/${params["calculator-slug"]}`;
  const title = seo?.metaTitle ?? `${calc.h1} | ${SITE_NAME}`;
  const description = seo?.metaDescription ?? calc.description;

  return {
    title: {
      absolute: title,
    },
    description,
    alternates: {
      canonical: `${base}${path}`,
    },
    openGraph: {
      title,
      description,
      url: `${base}${path}`,
      siteName: SITE_NAME,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
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
