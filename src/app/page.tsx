import Link from "next/link";
import { ArrowRight, BookOpen, Shield, Sparkles } from "lucide-react";
import { CALCULATOR_CATEGORIES } from "@/lib/calculators";
import { POPULAR_CALCULATORS, SITE_NAME, SITE_TAGLINE } from "@/lib/brand";
import { GUIDES } from "@/lib/content/guides";
import { TOPIC_HUBS } from "@/lib/content/topics";
import { ds } from "@/lib/design-system";
import { SiteSearch } from "@/components/layout/SiteSearch";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const GOALS = [
  {
    title: "Start Investing",
    href: "/sip",
    blurb: "SIP tools & beginner guides",
  },
  {
    title: "Reduce Debt",
    href: "/loans",
    blurb: "EMI, prepayment & refinance",
  },
  {
    title: "Plan Retirement",
    href: "/retirement",
    blurb: "FIRE, goals & NPS",
  },
  {
    title: "Save Tax",
    href: "/income-tax",
    blurb: "Old vs new regime & salary",
  },
  {
    title: "Buy a Home",
    href: "/loans/50-lakh-home-loan-20-years",
    blurb: "Home loan EMI scenarios",
  },
  {
    title: "Build Emergency Fund",
    href: "/guides/emergency-fund-basics",
    blurb: "Cash buffer basics",
  },
  {
    title: "Plan Child Education",
    href: "/calculators/retirement/child-education",
    blurb: "Education inflation planner",
  },
  {
    title: "Fixed Income",
    href: "/fd-rd",
    blurb: "FD, RD & PPF tools",
  },
] as const;

const QUICK = [
  { label: "SIP", href: "/calculators/investment/sip" },
  { label: "EMI", href: "/calculators/debt/emi" },
  { label: "Income Tax", href: "/calculators/taxation/income-tax" },
  { label: "PPF", href: "/calculators/government/ppf" },
  { label: "NPS", href: "/calculators/government/nps" },
  { label: "FD", href: "/calculators/government/fd-rd" },
  { label: "Retirement", href: "/retirement" },
  { label: "Salary", href: "/calculators/taxation/take-home-salary" },
] as const;

export default function HomePage() {
  const featuredGuides = GUIDES.slice(0, 6);

  return (
    <div className={cn(ds.page, "pb-6")}>
      <section className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-white via-[#EAF3FF] to-[#F5F9FF] p-6 sm:p-10">
        <p className={cn(ds.label, "text-primary")}>{SITE_NAME}</p>
        <h1 className="mt-2 max-w-3xl text-3xl font-bold tracking-tight text-navy sm:text-4xl lg:text-5xl">
          Free financial calculators & practical money education for India
        </h1>
        <p className={cn(ds.lead, "mt-3 sm:text-lg")}>
          Plan SIPs, loans, taxes, retirement and savings with transparent
          assumptions — then learn the “why” behind the numbers.{" "}
          <span className="text-foreground/90">{SITE_TAGLINE}.</span>
        </p>
        <div className={cn(ds.ctaRow, "mt-6")}>
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/calculators">
              Explore Calculators
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
          >
            <Link href="/guides">Explore Money Guides</Link>
          </Button>
        </div>
        <div className="mt-6 max-w-xl">
          <label className="mb-2 block text-sm font-medium text-foreground">
            What do you want to calculate?
          </label>
          <SiteSearch large />
          <div className="mt-3 flex flex-wrap gap-2">
            {QUICK.map((q) => (
              <Link
                key={q.label}
                href={q.href}
                className="rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-navy hover:border-primary/40 hover:text-primary"
              >
                {q.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={ds.section}>
        <div className="flex items-end justify-between gap-3">
          <h2 className={cn(ds.h2, "sm:text-2xl")}>Popular calculators</h2>
          <Link
            href="/calculators"
            className="shrink-0 text-sm font-medium text-primary hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {POPULAR_CALCULATORS.slice(0, 9).map((c) => (
            <Link
              key={`${c.category}-${c.slug}`}
              href={`/calculators/${c.category}/${c.slug}`}
              className={cn(ds.cardInteractive, "group block p-4")}
            >
              <p className="font-semibold text-navy group-hover:text-primary">
                {c.title}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Instant estimates with shareable scenarios
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
                Open calculator <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className={ds.section}>
        <h2 className={cn(ds.h2, "sm:text-2xl")}>Explore by financial goal</h2>
        <p className={ds.muted}>
          Jump to the hub that matches what you are trying to do.
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {GOALS.map((g) => (
            <Link
              key={g.title}
              href={g.href}
              className={cn(ds.cardInteractive, "block p-4")}
            >
              <p className="font-semibold text-navy">{g.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{g.blurb}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className={ds.section}>
        <div className="flex items-end justify-between gap-3">
          <h2 className={cn(ds.h2, "sm:text-2xl")}>Learn about money</h2>
          <Link
            href="/guides"
            className="shrink-0 text-sm font-medium text-primary hover:underline"
          >
            All guides
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {featuredGuides.map((g) => (
            <Link
              key={g.slug}
              href={`/guides/${g.slug}`}
              className={cn(ds.cardInteractive, "block p-4")}
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                {g.category}
              </p>
              <p className="mt-1 font-semibold text-navy">{g.title}</p>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                {g.description}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                {g.readingMinutes} min read
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className={ds.section}>
        <h2 className={cn(ds.h2, "sm:text-2xl")}>Browse topic hubs</h2>
        <div className="flex flex-wrap gap-2">
          {TOPIC_HUBS.map((t) => (
            <Link
              key={t.slug}
              href={`/${t.slug}`}
              className="rounded-full border border-border bg-white px-3 py-1.5 text-sm font-medium text-navy hover:border-primary/40 hover:text-primary"
            >
              {t.title}
            </Link>
          ))}
        </div>
      </section>

      <section className={cn(ds.panel, ds.section)}>
        <h2 className={cn(ds.h2, "sm:text-2xl")}>Why {SITE_NAME}?</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <Sparkles className="mb-2 h-5 w-5 text-primary" />
            <p className="font-medium text-navy">Instant & private</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Calculations run in your browser. Share scenarios via URL — no
              account required.
            </p>
          </div>
          <div>
            <BookOpen className="mb-2 h-5 w-5 text-primary" />
            <p className="font-medium text-navy">Built for India</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Tax regimes, PPF, NPS, EPF, SSY and loan tools with transparent
              assumptions.
            </p>
          </div>
          <div>
            <Shield className="mb-2 h-5 w-5 text-primary" />
            <p className="font-medium text-navy">Clear methodology</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Charts, breakdowns and documented methods so you understand the
              number.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 text-sm">
          <Link href="/methodology" className="text-primary hover:underline">
            Methodology
          </Link>
          <Link
            href="/editorial-policy"
            className="text-primary hover:underline"
          >
            Editorial Policy
          </Link>
          <Link href="/disclaimer" className="text-primary hover:underline">
            Disclaimer
          </Link>
          <Link href="/about" className="text-primary hover:underline">
            About
          </Link>
          <Link href="/contact" className="text-primary hover:underline">
            Contact
          </Link>
        </div>
      </section>

      <section className="space-y-6">
        {CALCULATOR_CATEGORIES.map((category) => {
          const Icon = category.icon;
          const preview = category.calculators.slice(0, 4);
          return (
            <div key={category.id} className={ds.sectionTight}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-primary" aria-hidden />
                  <h2 className={ds.h2}>{category.label}</h2>
                </div>
                <Link
                  href={`/calculators/${category.id}`}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  View all
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {preview.map((calc) => (
                  <Link
                    key={calc.slug}
                    href={`/calculators/${category.id}/${calc.slug}`}
                    className={cn(ds.cardInteractive, "px-4 py-3 text-sm font-medium")}
                  >
                    {calc.title}
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
