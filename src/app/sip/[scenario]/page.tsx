import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  SIP_SCENARIOS,
  getSipScenario,
} from "@/lib/content/scenarios";
import { calculateSip } from "@/utils/financial-math";
import { formatINR, formatPercent } from "@/lib/utils";
import { ds } from "@/lib/design-system";
import { getSiteUrl } from "@/lib/site";
import { SITE_NAME } from "@/lib/brand";
import { cn } from "@/lib/utils";

type Props = { params: { scenario: string } };

export function generateStaticParams() {
  return SIP_SCENARIOS.map((s) => ({ scenario: s.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const s = getSipScenario(params.scenario);
  if (!s) return { title: "SIP scenario" };
  const url = `${getSiteUrl()}/sip/${s.slug}`;
  return {
    title: { absolute: `${s.title} | ${SITE_NAME}` },
    description: s.description,
    alternates: { canonical: url },
    openGraph: { title: s.h1, description: s.description, url },
  };
}

export default function SipScenarioPage({ params }: Props) {
  const s = getSipScenario(params.scenario);
  if (!s) notFound();

  const result = calculateSip({
    monthlyInvestment: s.monthly,
    annualRatePct: s.rate,
    years: s.years,
  });

  const liveHref = `/calculators/investment/sip?monthly=${s.monthly}&rate=${s.rate}&years=${s.years}`;

  return (
    <div className={ds.page}>
      <nav className="text-sm text-muted-foreground">
        <Link href="/" className="hover:text-gold">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/sip" className="hover:text-gold">
          SIP
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{s.title}</span>
      </nav>

      <header className={ds.sectionTight}>
        <h1 className={ds.h1}>{s.h1}</h1>
        <p className={ds.lead}>{s.description}</p>
      </header>

      <section className={cn(ds.panel, ds.section)}>
        <h2 className={ds.h2}>Illustrative result</h2>
        <p className="text-sm text-muted-foreground">
          Assumptions: {formatINR(s.monthly)}/month · {formatPercent(s.rate)}{" "}
          p.a. · {s.years} years · monthly compounding model. Not a guarantee.
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-border/50 bg-navy/40 p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Total invested
            </p>
            <p className="mt-1 text-xl font-semibold tabular-nums">
              {formatINR(result.invested)}
            </p>
          </div>
          <div className="rounded-lg border border-border/50 bg-navy/40 p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Est. maturity
            </p>
            <p className="mt-1 text-xl font-semibold tabular-nums text-gold">
              {formatINR(result.maturityValue)}
            </p>
          </div>
          <div className="rounded-lg border border-border/50 bg-navy/40 p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Wealth gained
            </p>
            <p className="mt-1 text-xl font-semibold tabular-nums text-turquoise">
              {formatINR(result.maturityValue - result.invested)}
            </p>
          </div>
        </div>
        <Link
          href={liveHref}
          className="inline-flex text-sm font-medium text-gold hover:underline"
        >
          Open live SIP calculator with these inputs →
        </Link>
      </section>

      <section className={ds.section}>
        <h2 className={ds.h2}>How to read this</h2>
        <p className="text-sm text-foreground/90 sm:text-base">{s.insight}</p>
        <p className="text-sm text-muted-foreground">{s.compareNote}</p>
      </section>

      <section className={ds.section}>
        <h2 className={ds.h2}>Related</h2>
        <ul className="space-y-2 text-sm">
          <li>
            <Link href="/sip" className="text-gold hover:underline">
              SIP topic hub
            </Link>
          </li>
          <li>
            <Link
              href="/calculators/investment/step-up-sip"
              className="text-gold hover:underline"
            >
              Step-Up SIP calculator
            </Link>
          </li>
          <li>
            <Link href="/guides/how-sip-works" className="text-gold hover:underline">
              How SIP works
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}
