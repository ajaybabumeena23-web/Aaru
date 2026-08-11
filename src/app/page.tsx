import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CALCULATOR_CATEGORIES } from "@/lib/calculators";
import { POPULAR_CALCULATORS, SITE_NAME, SITE_TAGLINE } from "@/lib/brand";
import { ds } from "@/lib/design-system";
import { SiteSearch } from "@/components/layout/SiteSearch";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function HomePage() {
  return (
    <div className={cn(ds.page, "pb-4")}>
      <section className={ds.section}>
        <p className={cn(ds.label, "text-gold")}>{SITE_NAME}</p>
        <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          Make smarter money decisions with simple financial tools
        </h1>
        <p className={cn(ds.lead, "sm:text-lg")}>
          Free calculators and practical financial resources for SIPs, loans,
          taxes, retirement, savings and wealth planning in India.{" "}
          <span className="text-foreground/90">{SITE_TAGLINE}.</span>
        </p>
        <div className={ds.ctaRow}>
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/calculators">
              Explore Calculators
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
            <Link href="/about">About {SITE_NAME}</Link>
          </Button>
        </div>
        <div className="max-w-xl pt-2">
          <label className="mb-2 block text-sm font-medium text-foreground">
            What do you want to calculate?
          </label>
          <SiteSearch large />
          <p className="mt-2 text-xs text-muted-foreground">
            Try SIP, EMI, Income Tax, PPF, NPS, FD, XIRR — or browse{" "}
            <Link href="/guides" className="text-gold hover:underline">
              money guides
            </Link>{" "}
            and the{" "}
            <Link href="/sip" className="text-gold hover:underline">
              SIP hub
            </Link>
            .
          </p>
        </div>
      </section>

      <section className={ds.section}>
        <div className="flex items-end justify-between gap-3">
          <h2 className={cn(ds.h2, "sm:text-2xl")}>Popular calculators</h2>
          <Link
            href="/calculators"
            className="shrink-0 text-sm text-gold hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-3 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {POPULAR_CALCULATORS.map((c) => (
            <Link
              key={`${c.category}-${c.slug}`}
              href={`/calculators/${c.category}/${c.slug}`}
              className={cn(
                ds.cardInteractive,
                "px-4 py-3 text-sm font-medium hover:text-gold"
              )}
            >
              {c.title}
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-8">
        {CALCULATOR_CATEGORIES.map((category) => {
          const Icon = category.icon;
          const preview = category.calculators.slice(0, 6);
          return (
            <div key={category.id} className={ds.sectionTight}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-gold" aria-hidden />
                  <h2 className={ds.h2}>{category.label}</h2>
                </div>
                <Link
                  href={`/calculators/${category.id}`}
                  className="text-sm text-gold hover:underline"
                >
                  View all
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {preview.map((calc) => (
                  <Link
                    key={calc.slug}
                    href={`/calculators/${category.id}/${calc.slug}`}
                    className="group"
                  >
                    <Card className="h-full transition-colors group-hover:border-gold/40">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{calc.title}</CardTitle>
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
            </div>
          );
        })}
      </section>

      <section className={cn(ds.panel, ds.section)}>
        <h2 className={cn(ds.h2, "sm:text-2xl")}>Why use {SITE_NAME}?</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <p className="font-medium text-gold">Instant & private</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Calculations run in your browser. Share exact scenarios via URL —
              no account required.
            </p>
          </div>
          <div>
            <p className="font-medium text-gold">Built for India</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Tax regimes, STCG/LTCG, PPF, NPS, EPF, SSY and post-office schemes
              with transparent assumptions.
            </p>
          </div>
          <div>
            <p className="font-medium text-gold">Clear explanations</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Charts, breakdowns and methodology so you understand the number —
              not just see it.
            </p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Estimates only. Not investment, tax or legal advice. See our{" "}
          <Link href="/disclaimer" className="text-gold hover:underline">
            Disclaimer
          </Link>{" "}
          and{" "}
          <Link href="/methodology" className="text-gold hover:underline">
            Calculator Methodology
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
