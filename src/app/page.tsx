import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Scale, Shield } from "lucide-react";
import { POPULAR_CALCULATORS, SITE_NAME } from "@/lib/brand";
import { getGuide } from "@/lib/content/guides";
import { ds } from "@/lib/design-system";
import { getSiteUrl } from "@/lib/site";
import { SiteSearch } from "@/components/layout/SiteSearch";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: {
    absolute: `${SITE_NAME} — Make better financial decisions`,
  },
  description:
    "Calculate investments, loans, taxes and financial goals with transparent tools designed for India — then understand, compare and plan.",
  alternates: { canonical: getSiteUrl() },
};

const QUICK = [
  { label: "SIP", href: "/calculators/investment/sip" },
  { label: "EMI", href: "/calculators/debt/emi" },
  { label: "Income Tax", href: "/calculators/taxation/income-tax" },
  { label: "FD", href: "/calculators/government/fd-rd" },
  { label: "PPF", href: "/calculators/government/ppf" },
  { label: "NPS", href: "/calculators/government/nps" },
  { label: "Retirement", href: "/retirement" },
] as const;

const FEATURED_CALCS = [
  {
    category: "investment",
    slug: "sip",
    title: "SIP Calculator",
    blurb: "Estimate maturity from monthly investing assumptions.",
  },
  {
    category: "debt",
    slug: "emi",
    title: "EMI Calculator",
    blurb: "Monthly EMI, interest and principal breakup.",
  },
  {
    category: "taxation",
    slug: "income-tax",
    title: "Income Tax Calculator",
    blurb: "Compare old vs new regime side by side.",
  },
  {
    category: "government",
    slug: "fd-rd",
    title: "FD Calculator",
    blurb: "Fixed and recurring deposit maturity estimates.",
  },
  {
    category: "government",
    slug: "ppf",
    title: "PPF Calculator",
    blurb: "Project PPF corpus with transparent rate assumptions.",
  },
  {
    category: "retirement",
    slug: "fire",
    title: "Retirement Calculator",
    blurb: "Plan corpus needs with FIRE-style assumptions.",
  },
] as const;

const GOALS = [
  {
    title: "Buying a home",
    href: "/loans",
    blurb: "Calculate affordability, EMI and total interest.",
  },
  {
    title: "Building wealth",
    href: "/sip",
    blurb: "Plan SIPs, lump sums and long-term goals.",
  },
  {
    title: "Retirement",
    href: "/retirement",
    blurb: "Estimate the corpus you may need to retire.",
  },
  {
    title: "Child's education",
    href: "/calculators/retirement/child-education",
    blurb: "Estimate future education costs with inflation.",
  },
  {
    title: "Buying a car",
    href: "/calculators/debt/car-loan-emi",
    blurb: "Calculate EMI and tenure for an auto loan.",
  },
  {
    title: "Becoming debt-free",
    href: "/calculators/debt/advanced-prepayment",
    blurb: "Plan prepayment and compare tenure vs EMI cuts.",
  },
] as const;

const EXPLORE = [
  {
    title: "Investments",
    href: "/sip",
    items: [
      { label: "SIP", href: "/calculators/investment/sip" },
      { label: "Mutual Funds", href: "/mutual-funds" },
      { label: "XIRR", href: "/calculators/investment/xirr" },
      { label: "Lumpsum", href: "/calculators/investment/lump-sum" },
      { label: "SWP", href: "/calculators/investment/swp" },
    ],
  },
  {
    title: "Loans",
    href: "/loans",
    items: [
      { label: "Home Loan", href: "/calculators/debt/home-loan-emi" },
      { label: "Personal Loan", href: "/calculators/debt/personal-loan-emi" },
      { label: "Car Loan", href: "/calculators/debt/car-loan-emi" },
      { label: "EMI", href: "/calculators/debt/emi" },
      { label: "Prepayment", href: "/calculators/debt/advanced-prepayment" },
    ],
  },
  {
    title: "Tax",
    href: "/income-tax",
    items: [
      { label: "Income Tax", href: "/calculators/taxation/income-tax" },
      { label: "HRA", href: "/calculators/taxation/hra-exemption" },
      { label: "Capital Gains", href: "/calculators/taxation/capital-gains" },
      { label: "Take-Home", href: "/calculators/taxation/take-home-salary" },
    ],
  },
  {
    title: "Retirement",
    href: "/retirement",
    items: [
      { label: "FIRE Planner", href: "/calculators/retirement/fire" },
      { label: "NPS", href: "/calculators/government/nps" },
      { label: "EPF", href: "/calculators/government/epf" },
      { label: "PPF", href: "/calculators/government/ppf" },
    ],
  },
  {
    title: "Savings",
    href: "/fd-rd",
    items: [
      { label: "FD / RD", href: "/calculators/government/fd-rd" },
      { label: "PPF", href: "/calculators/government/ppf" },
      { label: "Post Office", href: "/calculators/government/post-office" },
      { label: "SSY", href: "/calculators/government/ssy" },
    ],
  },
  {
    title: "Personal Finance",
    href: "/wealth-planning",
    items: [
      { label: "Goal Planner", href: "/calculators/retirement/goal-planner" },
      { label: "Emergency Fund", href: "/guides/emergency-fund-basics" },
      { label: "Asset Allocation", href: "/guides/asset-allocation-basics" },
      { label: "Net Worth", href: "/guides/net-worth-and-goals" },
    ],
  },
] as const;

const FEATURED_GUIDE_SLUGS = [
  "sip-vs-lump-sum",
  "how-to-plan-retirement-india",
  "loan-prepayment-strategies",
  "fd-vs-rd",
  "sip-for-beginners",
  "old-vs-new-tax-regime",
] as const;

const TRUST = [
  {
    icon: Scale,
    title: "Transparent calculations",
    blurb: "Assumptions are stated clearly so you can stress-test scenarios.",
  },
  {
    icon: BookOpen,
    title: "India-focused tools",
    blurb: "Tax regimes, PPF, NPS, EPF and loan tools built for local context.",
  },
  {
    icon: Shield,
    title: "Educational, not promotional",
    blurb: "Practical explainers that link to calculators — not product pitches.",
  },
] as const;

export default function HomePage() {
  const featuredGuides = FEATURED_GUIDE_SLUGS.map((s) => getGuide(s)).filter(
    Boolean
  );

  return (
    <div className={cn(ds.page, "pb-8")}>
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border border-border bg-white px-5 py-8 sm:px-10 sm:py-12">
        <div
          className="pointer-events-none absolute inset-0 opacity-90"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 100% 0%, rgba(15,118,110,0.08), transparent 55%), radial-gradient(ellipse 50% 50% at 0% 100%, rgba(11,31,51,0.05), transparent 50%)",
          }}
        />
        <div className="relative max-w-3xl">
          <p className={ds.eyebrow}>Smarter money decisions</p>
          <h1 className={cn(ds.display, "mt-3")}>
            Make better financial decisions.
          </h1>
          <p className={cn(ds.lead, "mt-4 sm:text-lg")}>
            Calculate your investments, loans, taxes and financial goals with
            simple, transparent tools designed for India.
          </p>
          <div className={cn(ds.ctaRow, "mt-7")}>
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
              <Link href="/guides">Financial Guides</Link>
            </Button>
          </div>
        </div>

        <div className="relative mt-10 max-w-2xl border-t border-border/80 pt-8">
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-navy">
            What are you planning?
          </h2>
          <div className="mt-3">
            <SiteSearch
              large
              placeholder="Try ₹50 lakh home loan or SIP for ₹1 crore"
            />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {QUICK.map((q) => (
              <Link
                key={q.label}
                href={q.href}
                className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium text-navy hover:border-accent/40 hover:text-accent"
              >
                {q.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular calculators */}
      <section className={ds.section} aria-labelledby="financial-calculators">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className={ds.eyebrow}>Tools</p>
            <h2 id="financial-calculators" className={cn(ds.h2, "mt-1 sm:text-2xl")}>
              Financial calculators
            </h2>
          </div>
          <Link
            href="/calculators"
            className="shrink-0 text-sm font-medium text-accent hover:underline"
          >
            View all calculators →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED_CALCS.map((c) => (
            <Link
              key={`${c.category}-${c.slug}`}
              href={`/calculators/${c.category}/${c.slug}`}
              className={cn(ds.cardInteractive, "group block p-5")}
            >
              <p className="font-semibold text-navy group-hover:text-accent">
                {c.title}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {c.blurb}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent">
                Open calculator <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Goals */}
      <section className={ds.section} aria-labelledby="planning-for">
        <div>
          <p className={ds.eyebrow}>Goals</p>
          <h2 id="planning-for" className={cn(ds.h2, "mt-1 sm:text-2xl")}>
            What are you planning for?
          </h2>
          <p className={cn(ds.muted, "mt-1")}>
            Start from the decision — not only the formula.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {GOALS.map((g) => (
            <Link
              key={g.title}
              href={g.href}
              className={cn(ds.goalCard, "block")}
            >
              <p className="font-serif text-lg font-normal tracking-tight text-navy">
                {g.title}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {g.blurb}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Explore categories */}
      <section className={ds.section} aria-labelledby="explore-aaru">
        <div>
          <p className={ds.eyebrow}>Explore</p>
          <h2 id="explore-aaru" className={cn(ds.h2, "mt-1 sm:text-2xl")}>
            Explore {SITE_NAME}
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {EXPLORE.map((cat) => (
            <div
              key={cat.title}
              className="rounded-xl border border-border/80 bg-card p-5 shadow-soft"
            >
              <Link
                href={cat.href}
                className="font-semibold text-navy hover:text-accent"
              >
                {cat.title}
              </Link>
              <ul className="mt-3 space-y-1.5">
                {cat.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground hover:text-navy"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Guides */}
      <section className={ds.section} aria-labelledby="money-explained">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className={ds.eyebrow}>Learn</p>
            <h2
              id="money-explained"
              className={cn(ds.h2, "mt-1 font-serif text-2xl font-normal sm:text-3xl")}
            >
              Your money, explained simply.
            </h2>
          </div>
          <Link
            href="/guides"
            className="shrink-0 text-sm font-medium text-accent hover:underline"
          >
            All guides →
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {featuredGuides.map((g) =>
            g ? (
              <Link
                key={g.slug}
                href={`/guides/${g.slug}`}
                className={cn(ds.cardInteractive, "block p-5")}
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-accent">
                  {g.category}
                </p>
                <p className="mt-1.5 font-semibold text-navy">{g.title}</p>
                <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                  {g.description}
                </p>
                <p className="mt-3 text-xs text-muted-foreground">
                  {g.readingMinutes} min read
                </p>
              </Link>
            ) : null
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Looking for a specific goal? Try{" "}
          <Link
            href="/retirement/1-crore-in-15-years"
            className="font-medium text-accent hover:underline"
          >
            SIP needed for ₹1 crore
          </Link>{" "}
          or{" "}
          <Link
            href="/loans/75-lakh-home-loan-25-years"
            className="font-medium text-accent hover:underline"
          >
            ₹75 lakh home loan EMI
          </Link>
          .
        </p>
      </section>

      {/* Trust */}
      <section
        className={cn(ds.panel, "border-navy/10 bg-secondary/40")}
        aria-labelledby="why-trust"
      >
        <p className={ds.eyebrow}>Trust</p>
        <h2 id="why-trust" className={cn(ds.h2, "mt-1 sm:text-2xl")}>
          Why trust {SITE_NAME}?
        </h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-3">
          {TRUST.map((t) => {
            const Icon = t.icon;
            return (
              <div key={t.title}>
                <Icon className="mb-2 h-5 w-5 text-accent" aria-hidden />
                <p className="font-medium text-navy">{t.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {t.blurb}
                </p>
              </div>
            );
          })}
        </div>
        <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-sm">
          <Link href="/methodology" className="text-accent hover:underline">
            Methodology
          </Link>
          <Link
            href="/editorial-policy"
            className="text-accent hover:underline"
          >
            Editorial Policy
          </Link>
          <Link href="/disclaimer" className="text-accent hover:underline">
            Disclaimer
          </Link>
          <Link href="/about" className="text-accent hover:underline">
            About
          </Link>
          <Link href="/contact" className="text-accent hover:underline">
            Contact
          </Link>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          We do not invent reviewers or credentials. Where content is
          time-sensitive, we note the relevant period and sources on the page.
        </p>
      </section>

      {/* Secondary popular strip for SEO/internal links */}
      <section className={ds.sectionTight}>
        <h2 className="sr-only">More popular tools</h2>
        <div className="flex flex-wrap gap-2">
          {POPULAR_CALCULATORS.slice(0, 8).map((c) => (
            <Link
              key={`${c.category}-${c.slug}`}
              href={`/calculators/${c.category}/${c.slug}`}
              className="rounded-md border border-border bg-white px-3 py-1.5 text-xs font-medium text-muted-foreground hover:border-navy/20 hover:text-navy"
            >
              {c.title}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
