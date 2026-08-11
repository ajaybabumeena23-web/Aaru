import Link from "next/link";
import type { ReactNode } from "react";
import {
  type ContentScenario,
  computeEmiScenario,
  computeGoalScenario,
  computeSipScenario,
  scenarioPath,
} from "@/lib/content/scenarios";
import { getGuide } from "@/lib/content/guides";
import { formatINR, formatPercent } from "@/lib/utils";
import { ds } from "@/lib/design-system";
import { cn } from "@/lib/utils";
import { SITE_NAME } from "@/lib/brand";

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: "gold" | "turquoise";
}) {
  return (
    <div className="rounded-lg border border-border/50 bg-navy/40 p-4">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p
        className={cn(
          "mt-1 text-xl font-semibold tabular-nums",
          accent === "gold" && "text-gold",
          accent === "turquoise" && "text-turquoise"
        )}
      >
        {value}
      </p>
    </div>
  );
}

export function ScenarioArticle({ scenario }: { scenario: ContentScenario }) {
  const hubHref = `/${scenario.hub}`;
  const hubLabel =
    scenario.hub === "sip"
      ? "SIP"
      : scenario.hub === "loans"
        ? "Loans"
        : scenario.hub === "wealth-planning"
          ? "Wealth planning"
          : "Retirement";

  let body: ReactNode = null;
  let liveHref = "/calculators";

  if (scenario.kind === "sip") {
    const { flat, step } = computeSipScenario(scenario);
    liveHref = `/calculators/investment/sip?monthly=${scenario.monthly}&rate=${scenario.rate}&years=${scenario.years}${
      scenario.inflationPct
        ? `&advanced=1&adjustInflation=1&inflation=${scenario.inflationPct}`
        : ""
    }`;
    body = (
      <>
        <p className="text-sm text-muted-foreground">
          Assumptions: {formatINR(scenario.monthly)}/month ·{" "}
          {formatPercent(scenario.rate)} p.a. · {scenario.years} years
          {scenario.inflationPct
            ? ` · inflation ${formatPercent(scenario.inflationPct)}`
            : ""}
          {scenario.stepUpPct
            ? ` · step-up comparison at ${formatPercent(scenario.stepUpPct)}/yr`
            : ""}
          . Not a guarantee.
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          <Stat label="Total invested (flat)" value={formatINR(flat.invested)} />
          <Stat
            label="Est. maturity (flat)"
            value={formatINR(flat.maturityValue)}
            accent="gold"
          />
          <Stat
            label="Wealth gained (flat)"
            value={formatINR(flat.maturityValue - flat.invested)}
            accent="turquoise"
          />
        </div>
        {scenario.inflationPct ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <Stat
              label="Nominal maturity"
              value={formatINR(flat.maturityValue)}
              accent="gold"
            />
            <Stat
              label={`Inflation-adjusted (~${formatPercent(scenario.inflationPct)})`}
              value={formatINR(flat.realMaturityValue)}
              accent="turquoise"
            />
          </div>
        ) : null}
        {step ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <Stat
              label="Step-up: total invested"
              value={formatINR(step.invested)}
            />
            <Stat
              label="Step-up: est. maturity"
              value={formatINR(step.maturityValue)}
              accent="gold"
            />
          </div>
        ) : null}
        <div className="flex flex-wrap gap-4 text-sm">
          <Link href={liveHref} className="font-medium text-gold hover:underline">
            Open live SIP calculator →
          </Link>
          {scenario.stepUpPct ? (
            <Link
              href={`/calculators/investment/step-up-sip?monthly=${scenario.monthly}&rate=${scenario.rate}&years=${scenario.years}&stepUp=${scenario.stepUpPct}`}
              className="font-medium text-gold hover:underline"
            >
              Open Step-Up SIP →
            </Link>
          ) : null}
        </div>
      </>
    );
  }

  if (scenario.kind === "emi") {
    const result = computeEmiScenario(scenario);
    const slugPath =
      scenario.loanLabel.toLowerCase().includes("personal")
        ? "personal-loan-emi"
        : scenario.loanLabel.toLowerCase().includes("car")
          ? "car-loan-emi"
          : "home-loan-emi";
    liveHref = `/calculators/debt/${slugPath}?principal=${scenario.principal}&rate=${scenario.rate}&tenure=${scenario.years}`;
    body = (
      <>
        <p className="text-sm text-muted-foreground">
          Assumptions: {scenario.loanLabel} · {formatINR(scenario.principal)} ·{" "}
          {formatPercent(scenario.rate)} p.a. · {scenario.years} years ·
          reducing-balance EMI. Fees not included.
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          <Stat label="Monthly EMI" value={formatINR(result.emi)} accent="gold" />
          <Stat label="Total interest" value={formatINR(result.totalInterest)} />
          <Stat
            label="Total payment"
            value={formatINR(result.totalPayment)}
            accent="turquoise"
          />
        </div>
        <Link href={liveHref} className="text-sm font-medium text-gold hover:underline">
          Open live EMI calculator with these inputs →
        </Link>
      </>
    );
  }

  if (scenario.kind === "goal") {
    const { remaining, reverse } = computeGoalScenario(scenario);
    liveHref = `/calculators/retirement/goal-planner?target=${scenario.target}&rate=${scenario.rate}&years=${scenario.years}&current=${scenario.current ?? 0}`;
    body = (
      <>
        <p className="text-sm text-muted-foreground">
          Assumptions: target {formatINR(scenario.target)}
          {scenario.current
            ? ` · already saved ${formatINR(scenario.current)}`
            : ""}{" "}
          · {formatPercent(scenario.rate)} p.a. · {scenario.years} years. Not a
          guarantee.
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          <Stat
            label="Remaining target"
            value={formatINR(remaining)}
          />
          <Stat
            label="Required monthly SIP"
            value={formatINR(reverse.monthlySip)}
            accent="gold"
          />
          <Stat
            label="Total you'd invest"
            value={formatINR(reverse.totalInvested)}
            accent="turquoise"
          />
        </div>
        <Link href={liveHref} className="text-sm font-medium text-gold hover:underline">
          Open Goal Planner with these inputs →
        </Link>
      </>
    );
  }

  return (
    <div className={ds.page}>
      <nav className="text-sm text-muted-foreground">
        <Link href="/" className="hover:text-gold">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href={hubHref} className="hover:text-gold">
          {hubLabel}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{scenario.title}</span>
      </nav>

      <header className={ds.sectionTight}>
        <h1 className={ds.h1}>{scenario.h1}</h1>
        <p className={ds.lead}>{scenario.description}</p>
      </header>

      <section className={cn(ds.panel, ds.section)}>
        <h2 className={ds.h2}>Illustrative result</h2>
        {body}
      </section>

      <section className={ds.section}>
        <h2 className={ds.h2}>How to read this</h2>
        <p className="text-sm text-foreground/90 sm:text-base">
          {scenario.insight}
        </p>
        <p className="text-sm text-muted-foreground">{scenario.compareNote}</p>
      </section>

      {scenario.relatedGuides?.length ? (
        <section className={ds.section}>
          <h2 className={ds.h2}>Related guides</h2>
          <ul className="space-y-2 text-sm">
            {scenario.relatedGuides.map((slug) => {
              const g = getGuide(slug);
              if (!g) return null;
              return (
                <li key={slug}>
                  <Link
                    href={`/guides/${slug}`}
                    className="text-gold hover:underline"
                  >
                    {g.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      <p className="text-xs text-muted-foreground">
        Scenario path {scenarioPath(scenario)} · {SITE_NAME}. Educational
        estimates only.
      </p>
    </div>
  );
}
