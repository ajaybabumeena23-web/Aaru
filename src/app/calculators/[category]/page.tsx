import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCategory, CALCULATOR_CATEGORIES } from "@/lib/calculators";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type PageProps = {
  params: { category: string };
};

export function generateStaticParams() {
  return CALCULATOR_CATEGORIES.map((c) => ({ category: c.id }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const category = getCategory(params.category);
  if (!category) return { title: "Calculators" };
  return {
    title: category.label,
    description: `${category.label} calculators for the Indian financial market.`,
  };
}

export default function CategoryPage({ params }: PageProps) {
  const category = getCategory(params.category);
  if (!category) notFound();

  const Icon = category.icon;

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <div className="flex items-center gap-2 text-primary">
          <Icon className="h-5 w-5" />
          <span className="text-sm font-medium uppercase tracking-wider">
            {category.label}
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{category.label}</h1>
        <p className="text-muted-foreground">
          Choose a calculator. Inputs sync to the URL for shareable scenarios.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2">
        {category.calculators.map((calc) => (
          <Link
            key={calc.slug}
            href={`/calculators/${category.id}/${calc.slug}`}
            className="group"
          >
            <Card className="h-full transition-colors group-hover:border-primary/40">
              <CardHeader>
                <CardTitle className="text-lg">{calc.h1}</CardTitle>
                <CardDescription>{calc.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
