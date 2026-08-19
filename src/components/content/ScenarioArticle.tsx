import Link from "next/link";
import type { ReactNode } from "react";
import {
  type ContentScenario,
  computeAffordabilityScenario,
  computeEmiScenario,
  computeGoalScenario,
  computeSipScenario,
  getRelatedScenarios,
  scenarioPath,
} from "@/lib/content/scenarios";
import { getGuide } from "@/lib/content/guides";
import { calculateSip, calculateReverseSip, basicEmi } from "@/utils/financial-math";
import { formatINR, formatPercent } from "@/lib/utils";
import { ds } from "@/lib/design-system";
import { cn } from "@/lib/utils";
import { SITE_NAME } from "@/lib/brand";

function Stat({
  label,
  value,
  accent,
  hint,
}: {
  label: string;
  value: string;
  accent?: "gold" | "turquoise";
  hint?: string;
}) {
  return (
    <div className="rounded-lg border border-border/50 bg-navy/40 p-4">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p
        className={cn(
          "mt-1 text-xl font-semibold tabular-nums",
          accent === "gold" && "text-primary",
          accent === "turquoise" && "text-turquoise"
        )}
      >
        {value}
      </p>
      {hint ? (
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

function BandTable({
  rows,
}: {
  rows: { label: string; value: string; emphasize?: boolean }[];
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border/50">
      <table className="w-full min-w-[280px] text-left text-sm">
        <thead className="bg-navy/50 text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-3 py-2 font-medium">Assumption</th>
            <th className="px-3 py-2 font-medium">Result</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr
              key={r.label}
              className={cn(
                "border-t border-border/40",
                r.emphasize && "bg-primary/5 font-medium"
              )}
            >
              <td className="px-3 py-2.5">{r.label}</td>
              <td className="px-3 py-2.5 tabular-nums">{r.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function hubLabel(hub: string) {
  if (hub === "sip") return "SIP";
  if (hub === "loans") return "Loans";
  if (hub === "wealth-planning") return "Wealth planning";
  return "Retirement";
}

const DEFAULT_FAQS: Record<ContentScenario["kind"], { q: string; a: string }[]> =
  {
    sip: [
      {
        q: "Are these maturity numbers guaranteed?",
        a: "No. They assume a constant annual return you choose. Real market-linked returns vary year to year.",
      },
      {
        q: "What should I change first?",
        a: "Start with a SIP you can sustain, then stress-test return and tenure. Prefer consistency over optimistic rate assumptions.",
      },
    ],
    emi: [
      {
        q: "Does this include fees or insurance?",
        a: "No. It is a reducing-balance EMI illustration only. Add processing fees, insurance and prepayment rules separately.",
      },
      {
        q: "Should I pick the lowest EMI?",
        a: "Not automatically. Longer tenures lower EMI but usually raise total interest. Compare both comfort and lifetime cost.",
      },
    ],
    goal: [
      {
        q: "Is the required SIP advice?",
        a: "No. It is reverse math under your assumed return. Change the rate downward to see a more conservative contribution need.",
      },
      {
        q: "What if I already have savings?",
        a: "Subtract them from the target (Goal Planner supports a current corpus). Existing money reduces the remaining SIP gap.",
      },
    ],
    affordability: [
      {
        q: "Will my bank use the same FOIR?",
        a: "Unlikely to match exactly. This page uses a transparent FOIR-style cap for education. Lenders apply their own eligibility rules.",
      },
      {
        q: "What if the target loan exceeds capacity?",
        a: "You can lower the loan, raise down payment, extend tenure (with more interest), reduce other EMIs, or wait until income supports a safer EMI.",
      },
    ],
  };

export function ScenarioArticle({ scenario }: { scenario: ContentScenario }) {
  const hubHref = `/${scenario.hub}`;
  const related = getRelatedScenarios(scenario);
  const faqs = scenario.faqs?.length
    ? scenario.faqs
    : DEFAULT_FAQS[scenario.kind];

  let body: ReactNode = null;
  let sensitivity: ReactNode = null;
  let liveHref = "/calculators";
  let secondaryLinks: { href: string; label: string }[] = [];

  if (scenario.kind === "sip") {
    const { flat, step } = computeSipScenario(scenario);
    liveHref = `/calculators/investment/sip?monthly=${scenario.monthly}&rate=${scenario.rate}&years=${scenario.years}${
      scenario.inflationPct
        ? `&advanced=1&adjustInflation=1&inflation=${scenario.inflationPct}`
        : ""
    }`;
    if (scenario.stepUpPct) {
      secondaryLinks.push({
        href: `/calculators/investment/step-up-sip?monthly=${scenario.monthly}&rate=${scenario.rate}&years=${scenario.years}&stepUp=${scenario.stepUpPct}`,
        label: "Open Step-Up SIP →",
      });
    }
    secondaryLinks.push({
      href: "/calculators/retirement/goal-planner",
      label: "Prefer a target corpus? Goal Planner →",
    });

    const rateBands = [8, 10, scenario.rate].filter(
      (v, i, a) => a.indexOf(v) === i
    );
    if (!rateBands.includes(12) && scenario.rate !== 12) rateBands.push(12);
    sensitivity = (
      <BandTable
        rows={rateBands
          .sort((a, b) => a - b)
          .map((r) => {
            const m = calculateSip({
              monthlyInvestment: scenario.monthly,
              annualRatePct: r,
              years: scenario.years,
              inflationPct: scenario.inflationPct ?? 0,
            });
            return {
              label: `${formatPercent(r)} p.a.`,
              value: formatINR(m.maturityValue),
              emphasize: r === scenario.rate,
            };
          })}
      />
    );

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
    secondaryLinks = [
      {
        href: `/calculators/debt/loan-affordability?rate=${scenario.rate}&tenure=${scenario.years}`,
        label: "Check income affordability →",
      },
      {
        href: "/calculators/debt/advanced-prepayment",
        label: "Model a prepayment →",
      },
    ];

    const tenureBands = [20, 25, scenario.years]
      .filter((v, i, a) => a.indexOf(v) === i)
      .sort((a, b) => a - b);
    sensitivity = (
      <BandTable
        rows={tenureBands.map((y) => {
          const r = basicEmi({
            principal: scenario.principal,
            annualRatePct: scenario.rate,
            tenureMonths: y * 12,
          });
          return {
            label: `${y} years`,
            value: `${formatINR(r.emi)} EMI · ${formatINR(r.totalInterest)} interest`,
            emphasize: y === scenario.years,
          };
        })}
      />
    );

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
      </>
    );
  }

  if (scenario.kind === "goal") {
    const { remaining, reverse } = computeGoalScenario(scenario);
    liveHref = `/calculators/retirement/goal-planner?target=${scenario.target}&rate=${scenario.rate}&years=${scenario.years}&current=${scenario.current ?? 0}`;
    secondaryLinks = [
      {
        href: `/calculators/retirement/reverse-sip?target=${remaining}&rate=${scenario.rate}&years=${scenario.years}`,
        label: "Open Reverse SIP →",
      },
      {
        href: "/calculators/investment/sip",
        label: "Forward SIP maturity →",
      },
    ];

    const rateBands = [8, 10, scenario.rate, 12].filter(
      (v, i, a) => a.indexOf(v) === i
    );
    sensitivity = (
      <BandTable
        rows={rateBands
          .sort((a, b) => a - b)
          .map((r) => {
            const rev = calculateReverseSip({
              targetCorpus: remaining,
              annualRatePct: r,
              years: scenario.years,
            });
            return {
              label: `${formatPercent(r)} p.a.`,
              value: `${formatINR(rev.monthlySip)} / month`,
              emphasize: r === scenario.rate,
            };
          })}
      />
    );

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
          <Stat label="Remaining target" value={formatINR(remaining)} />
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
      </>
    );
  }

  if (scenario.kind === "affordability") {
    const { capacity, targetEmi, affordable, principalGap, emiGap } =
      computeAffordabilityScenario(scenario);
    liveHref = `/calculators/debt/loan-affordability?income=${scenario.monthlyIncome}&existing=${scenario.existingEmis}&foir=${scenario.foirPct}&rate=${scenario.rate}&tenure=${scenario.years}`;
    secondaryLinks = [
      {
        href: `/calculators/debt/home-loan-emi?principal=${scenario.targetLoan}&rate=${scenario.rate}&tenure=${scenario.years}`,
        label: "Open Home Loan EMI for this principal →",
      },
    ];
    if (scenario.targetLoan === 75_00_000) {
      secondaryLinks.push({
        href: "/loans/75-lakh-home-loan-25-years",
        label: "See ₹75L EMI totals →",
      });
    } else if (scenario.targetLoan === 50_00_000) {
      secondaryLinks.push({
        href: "/loans/50-lakh-home-loan-20-years",
        label: "See ₹50L EMI totals →",
      });
    }

    sensitivity = (
      <BandTable
        rows={[35, 40, 50]
          .map((foir) => {
            const c = computeAffordabilityScenario({
              ...scenario,
              foirPct: foir,
            });
            return {
              label: `${foir}% FOIR-style cap`,
              value: `Max loan ${formatINR(c.capacity.maxLoan)}`,
              emphasize: foir === scenario.foirPct,
            };
          })}
      />
    );

    body = (
      <>
        <p className="text-sm text-muted-foreground">
          Assumptions: {scenario.loanLabel} target {formatINR(scenario.targetLoan)}{" "}
          · take-home {formatINR(scenario.monthlyIncome)}/mo · existing EMIs{" "}
          {formatINR(scenario.existingEmis)} · FOIR-style cap{" "}
          {formatPercent(scenario.foirPct, 0)} · {formatPercent(scenario.rate)}{" "}
          p.a. · {scenario.years} years. Not a bank sanction.
        </p>
        <div
          className={cn(
            "rounded-lg border px-4 py-3 text-sm font-medium",
            affordable
              ? "border-turquoise/40 bg-turquoise/10 text-turquoise"
              : "border-primary/40 bg-primary/10 text-primary"
          )}
        >
          {affordable
            ? `Under these assumptions, the target loan fits within illustrated EMI capacity.`
            : `Under these assumptions, the target exceeds illustrated capacity by about ${formatINR(principalGap)} of principal (EMI shortfall ~${formatINR(emiGap)}/mo).`}
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat
            label="Available EMI budget"
            value={formatINR(capacity.availableEmi)}
            accent="turquoise"
          />
          <Stat
            label="EMI for target loan"
            value={formatINR(targetEmi.emi)}
            accent="gold"
          />
          <Stat
            label="Max loan (illustration)"
            value={formatINR(capacity.maxLoan)}
          />
          <Stat
            label="Income used (approx.)"
            value={formatPercent(capacity.incomeUsedPct, 1)}
            hint="Existing + illustrative new EMI"
          />
        </div>
      </>
    );
  }

  return (
    <div className={ds.page}>
      <nav className="text-sm text-muted-foreground">
        <Link href="/" className="hover:text-primary">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href={hubHref} className="hover:text-primary">
          {hubLabel(scenario.hub)}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{scenario.title}</span>
      </nav>

      <header className={ds.sectionTight}>
        {scenario.decisionTool ? (
          <p className={ds.eyebrow}>Decision tool</p>
        ) : (
          <p className={ds.eyebrow}>Scenario</p>
        )}
        <h1 className={ds.h1}>{scenario.h1}</h1>
        <p className={ds.lead}>{scenario.description}</p>
      </header>

      <section className={cn(ds.panel, ds.section)}>
        <h2 className={ds.h2}>Illustrative result</h2>
        <div className="mt-4 space-y-4">{body}</div>
        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          <Link
            href={liveHref}
            className="inline-flex min-h-11 items-center rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground hover:opacity-90"
          >
            Open live calculator with these inputs →
          </Link>
          {secondaryLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="inline-flex min-h-11 items-center font-medium text-primary hover:underline"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </section>

      {sensitivity ? (
        <section className={ds.section}>
          <h2 className={ds.h2}>Sensitivity check</h2>
          <p className="mb-3 text-sm text-muted-foreground">
            Same scenario with alternate assumptions—use this to avoid anchoring
            on a single optimistic number.
          </p>
          {sensitivity}
        </section>
      ) : null}

      <section className={ds.section}>
        <h2 className={ds.h2}>How to read this</h2>
        <p className="text-sm text-foreground/90 sm:text-base">
          {scenario.insight}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {scenario.compareNote}
        </p>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-foreground/90">
          <li>Confirm the assumptions match your cash flow and time horizon.</li>
          <li>Stress-test a more conservative rate, tenure or FOIR in the table above.</li>
          <li>Open the live calculator and save or share your customised case.</li>
        </ol>
      </section>

      {faqs.length ? (
        <section className={ds.section}>
          <h2 className={ds.h2}>FAQ</h2>
          <dl className="mt-3 space-y-4">
            {faqs.map((f) => (
              <div key={f.q}>
                <dt className="font-medium text-foreground">{f.q}</dt>
                <dd className="mt-1 text-sm text-muted-foreground">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

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
                    className="text-primary hover:underline"
                  >
                    {g.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {related.length ? (
        <section className={ds.section}>
          <h2 className={ds.h2}>Related scenarios</h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {related.map((s) => (
              <li key={s.slug}>
                <Link
                  href={scenarioPath(s)}
                  className={cn(ds.cardInteractive, "block p-4 text-sm")}
                >
                  <span className="font-medium text-foreground">{s.title}</span>
                  {s.decisionTool ? (
                    <span className="mt-1 block text-xs text-accent">
                      Decision tool
                    </span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <p className="text-xs text-muted-foreground">
        Scenario path {scenarioPath(scenario)} · {SITE_NAME}. Educational
        estimates only—not financial, tax or lending advice.
      </p>
    </div>
  );
}
