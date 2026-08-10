import Link from "next/link";
import { CALCULATOR_CATEGORIES } from "@/lib/calculators";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-wider text-gold">
          IndiaCalc
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Plan money decisions for the Indian market
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Zero-latency SIP, EMI, FIRE, tax, and government scheme calculators.
          Share exact scenarios via URL — everything runs in your browser.
        </p>
      </header>

      <div className="grid gap-6">
        {CALCULATOR_CATEGORIES.map((category) => {
          const Icon = category.icon;
          return (
            <section key={category.id} className="space-y-3">
              <div className="flex items-center gap-2">
                <Icon className="h-5 w-5 text-gold" />
                <h2 className="text-xl font-semibold text-foreground">
                  {category.label}
                </h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {category.calculators.map((calc) => (
                  <Link
                    key={calc.slug}
                    href={`/calculators/${category.id}/${calc.slug}`}
                    className="group"
                  >
                    <Card className="h-full transition-colors group-hover:border-gold/40 group-hover:bg-gold/[0.03]">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base text-card-foreground">
                          {calc.title}
                        </CardTitle>
                        <CardDescription>{calc.h1}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          {calc.description}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
