import type { Metadata } from "next";
import Link from "next/link";
import { CALCULATOR_CATEGORIES } from "@/lib/calculators";
import { SITE_NAME } from "@/lib/brand";
import { SiteSearch } from "@/components/layout/SiteSearch";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "All Financial Calculators",
  description: `Browse free SIP, EMI, tax, retirement and government scheme calculators from ${SITE_NAME}.`,
  alternates: { canonical: "/calculators" },
};

export default function CalculatorsDirectoryPage({
  searchParams,
}: {
  searchParams?: { q?: string };
}) {
  const q = (searchParams?.q || "").trim().toLowerCase();

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">
          Financial Calculators
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Free tools for investing, loans, tax, retirement and savings — built
          for Indian money decisions.
        </p>
        <div className="max-w-lg">
          <SiteSearch large />
        </div>
      </header>

      {CALCULATOR_CATEGORIES.map((category) => {
        const Icon = category.icon;
        const items = q
          ? category.calculators.filter((c) =>
              `${c.title} ${c.h1} ${c.description}`.toLowerCase().includes(q)
            )
          : category.calculators;
        if (items.length === 0) return null;
        return (
          <section key={category.id} className="space-y-3">
            <div className="flex items-center gap-2">
              <Icon className="h-5 w-5 text-gold" />
              <h2 className="text-xl font-semibold">{category.label}</h2>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {items.map((calc) => (
                <Link
                  key={calc.slug}
                  href={`/calculators/${category.id}/${calc.slug}`}
                >
                  <Card className="h-full transition-colors hover:border-gold/40">
                    <CardHeader>
                      <CardTitle className="text-lg">{calc.h1}</CardTitle>
                      <CardDescription>{calc.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
