"use client";

import { Suspense, type ReactNode } from "react";
import Link from "next/link";
import { getCalculatorSeo } from "@/lib/calculator-seo";
import { SITE_NAME } from "@/lib/brand";
import { ds } from "@/lib/design-system";
import { getSiteUrl } from "@/lib/site";
import { cn } from "@/lib/utils";
import { ShareResultButtons } from "@/components/calculators/ShareResultButtons";

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
            <Link href="/" className="hover:text-gold">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href="/calculators" className="hover:text-gold">
              Calculators
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href={categoryHref} className="hover:text-gold">
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
            <p className="rounded-lg border border-border/60 bg-navy/40 p-4 font-mono text-sm text-turquoise">
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
                      <span className="text-gold transition group-open:rotate-45">
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

          <section className={ds.section} aria-labelledby="related">
            <h2 id="related" className={ds.h2}>
              You may also find useful
            </h2>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {seo.related.map((r) => (
                <Link
                  key={`${r.category}/${r.slug}`}
                  href={`/calculators/${r.category}/${r.slug}`}
                  className="rounded-lg border border-border/60 px-4 py-3 text-sm font-medium transition-colors hover:border-gold/40 hover:text-gold"
                >
                  {r.title}
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-border/50 bg-navy/30 p-4 text-xs text-muted-foreground sm:text-sm">
            <p>
              <strong className="text-foreground">Disclaimer: </strong>
              Results are illustrative estimates for education only — not
              investment, tax or legal advice, and not guaranteed. See our{" "}
              <Link href="/disclaimer" className="text-gold hover:underline">
                Disclaimer
              </Link>{" "}
              and{" "}
              <Link href="/methodology" className="text-gold hover:underline">
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
