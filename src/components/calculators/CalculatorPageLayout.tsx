"use client";

import { Suspense, type ReactNode } from "react";
import Link from "next/link";
import { getCalculatorSeo } from "@/lib/calculator-seo";
import { SITE_NAME } from "@/lib/brand";
import { ds } from "@/lib/design-system";
import { getSiteUrl } from "@/lib/site";
import { cn } from "@/lib/utils";
import { ShareResultButtons } from "@/components/calculators/ShareResultButtons";
import { getGuide } from "@/lib/content/guides";
import { CALCULATOR_GUIDE_LINKS } from "@/lib/content/guide-links";
import {
  RelatedCalculators,
  RelatedGuides,
  SourcesBlock,
} from "@/components/seo/RelatedContent";

export type CalculatorPageLayoutProps = {
  /** e.g. investment/sip */
  seoKey: string;
  categoryHref: string;
  categoryLabel: string;
  crumb: string;
  title: string;
  description: string;
  children: ReactNode;
};

export function CalculatorPageLayout({
  seoKey,
  categoryHref,
  categoryLabel,
  crumb,
  title,
  description,
  children,
}: CalculatorPageLayoutProps) {
  const seo = getCalculatorSeo(seoKey);
  const base = getSiteUrl();
  const relatedGuides = (CALCULATOR_GUIDE_LINKS[seoKey] ?? [])
    .map((slug) => getGuide(slug))
    .filter(Boolean);

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${base}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: "Calculators",
        item: `${base}/calculators`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: categoryLabel,
        item: `${base}${categoryHref}`,
      },
      { "@type": "ListItem", position: 4, name: crumb },
    ],
  };

  const howToLd = seo
    ? {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: `How to use the ${title}`,
        step: seo.howToUse.map((text, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          text,
        })),
      }
    : null;

  return (
    <div className={ds.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      {howToLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToLd) }}
        />
      ) : null}

      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <li>
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href="/calculators" className="hover:text-primary">
              Calculators
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href={categoryHref} className="hover:text-primary">
              {categoryLabel}
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-foreground">{crumb}</li>
        </ol>
      </nav>

      <header className={ds.sectionTight}>
        <h1 className={ds.h1}>{title}</h1>
        <p className={ds.lead}>{seo?.intro || description}</p>
        <ShareResultButtons title={title} />
      </header>

      <div className="calculator-tool">{children}</div>

      {seo ? (
        <>
          <section className={cn(ds.panel, ds.section)} aria-labelledby="how-to">
            <h2 id="how-to" className={ds.h2}>
              How to use this calculator
            </h2>
            <ol className="list-decimal space-y-2 pl-5 text-sm text-foreground/90 sm:text-base">
              {seo.howToUse.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </section>

          <section className={ds.section} aria-labelledby="formula">
            <h2 id="formula" className={ds.h2}>
              Formula & assumptions
            </h2>
            <p className="rounded-lg border border-primary/20 bg-secondary p-4 font-mono text-sm text-navy">
              {seo.formula}
            </p>
            <p className={ds.muted}>
              <span className="font-medium text-foreground">Example: </span>
              {seo.example}
            </p>
          </section>

          <section className={ds.section} aria-labelledby="factors">
            <h2 id="factors" className={ds.h2}>
              Factors that affect the result
            </h2>
            <ul className="grid gap-2 sm:grid-cols-2">
              {seo.factors.map((f) => (
                <li
                  key={f}
                  className="rounded-md border border-border/50 bg-card/50 px-3 py-2 text-sm"
                >
                  {f}
                </li>
              ))}
            </ul>
          </section>

          <section className={ds.section} aria-labelledby="faq">
            <h2 id="faq" className={ds.h2}>
              Frequently asked questions
            </h2>
            <div className="space-y-3">
              {seo.faqs.map((item) => (
                <details
                  key={item.q}
                  className="group rounded-lg border border-border/60 bg-card/60 px-4 py-3"
                >
                  <summary className="cursor-pointer list-none font-medium text-foreground marker:content-none [&::-webkit-details-marker]:hidden">
                    <span className="flex items-center justify-between gap-2">
                      {item.q}
                      <span className="text-primary transition group-open:rotate-45">
                        +
                      </span>
                    </span>
                  </summary>
                  <p className="mt-2 text-sm text-muted-foreground">{item.a}</p>
                </details>
              ))}
            </div>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  mainEntity: seo.faqs.map((f) => ({
                    "@type": "Question",
                    name: f.q,
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: f.a,
                    },
                  })),
                }),
              }}
            />
          </section>

          <RelatedCalculators
            heading="You may also find useful"
            items={seo.related.map((r) => ({
              href: `/calculators/${r.category}/${r.slug}`,
              title: r.title,
            }))}
          />

          <RelatedGuides
            items={relatedGuides.flatMap((g) =>
              g
                ? [
                    {
                      href: `/guides/${g.slug}`,
                      title: g.title,
                      blurb: g.description,
                    },
                  ]
                : []
            )}
          />

          <SourcesBlock
            sources={[
              {
                label: "Calculator Methodology",
                href: "/methodology",
                note: "how formulas and assumptions are documented",
              },
              {
                label: "Income Tax Department",
                href: "https://www.incometax.gov.in/",
                note: "for tax rules (verify current assessment year)",
              },
              {
                label: "RBI / SEBI / PFRDA / EPFO / India Post",
                note: "for rates and scheme rules when applicable",
              },
            ]}
          />

          <section className="rounded-lg border border-border bg-secondary/60 p-4 text-xs text-muted-foreground sm:text-sm">
            <p>
              <strong className="text-foreground">Disclaimer: </strong>
              Results are illustrative estimates for education only — not
              investment, tax or legal advice, and not guaranteed. See our{" "}
              <Link href="/disclaimer" className="text-primary hover:underline">
                Disclaimer
              </Link>{" "}
              and{" "}
              <Link href="/methodology" className="text-primary hover:underline">
                Methodology
              </Link>
              .
            </p>
            <p className="mt-2">
              Last updated: {seo.lastUpdated} · {SITE_NAME}
            </p>
          </section>
        </>
      ) : null}
    </div>
  );
}

export function withCalculatorSuspense(node: ReactNode) {
  return (
    <Suspense
      fallback={
        <div className="text-sm text-muted-foreground">Loading calculator…</div>
      }
    >
      {node}
    </Suspense>
  );
}
