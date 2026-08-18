import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  GLOSSARY,
  getGlossaryTerm,
} from "@/lib/content/glossary";
import { getGuide } from "@/lib/content/guides";
import { ds } from "@/lib/design-system";
import { getSiteUrl } from "@/lib/site";
import { SITE_NAME } from "@/lib/brand";
import { SourcesBlock } from "@/components/seo/RelatedContent";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return GLOSSARY.map((t) => ({ slug: t.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const term = getGlossaryTerm(params.slug);
  if (!term) return { title: "Glossary" };
  const url = `${getSiteUrl()}/glossary/${term.slug}`;
  const title = `${term.term} Meaning – ${term.short} | ${SITE_NAME}`;
  const description = `${term.term} (${term.short}): ${term.definition.slice(0, 140)}…`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: SITE_NAME, type: "article" },
  };
}

export default function GlossaryTermPage({ params }: Props) {
  const term = getGlossaryTerm(params.slug);
  if (!term) notFound();

  const relatedTerms = GLOSSARY.filter(
    (t) => t.slug !== term.slug
  ).slice(0, 8);

  return (
    <article className={ds.page}>
      <nav className="text-sm text-muted-foreground">
        <Link href="/" className="hover:text-primary">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/glossary" className="hover:text-primary">
          Glossary
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{term.term}</span>
      </nav>

      <header className={ds.sectionTight}>
        <p className={ds.label}>{term.short}</p>
        <h1 className={ds.h1}>{term.term}</h1>
        <p className={ds.lead}>{term.definition}</p>
      </header>

      <section className={ds.section}>
        <h2 className={ds.h2}>In simple terms</h2>
        <p className="text-sm text-foreground/90 sm:text-base">
          {term.definition} Use the related calculators below to see the idea in
          numbers — results are illustrative, not advice.
        </p>
      </section>

      {term.relatedCalculators?.length ? (
        <section className={ds.section}>
          <h2 className={ds.h2}>Related calculators</h2>
          <ul className="flex flex-wrap gap-2">
            {term.relatedCalculators.map((c) => (
              <li key={c.href}>
                <Link
                  href={c.href}
                  className="inline-block rounded-md border border-border bg-white px-3 py-2 text-sm font-medium text-navy hover:border-primary/40 hover:text-primary"
                >
                  {c.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {term.relatedGuides?.length ? (
        <section className={ds.section}>
          <h2 className={ds.h2}>Related guides</h2>
          <ul className="space-y-2 text-sm">
            {term.relatedGuides.map((slug) => {
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

      <section className={ds.section}>
        <h2 className={ds.h2}>Related terms</h2>
        <div className="flex flex-wrap gap-2">
          {relatedTerms.map((t) => (
            <Link
              key={t.slug}
              href={`/glossary/${t.slug}`}
              className="rounded-md border border-border px-2.5 py-1 text-sm hover:border-primary/40 hover:text-primary"
            >
              {t.term}
            </Link>
          ))}
        </div>
      </section>

      <SourcesBlock
        sources={[
          {
            label: "Verify definitions against official scheme / tax documents",
            note: "terms and rates can change by notification",
          },
          {
            label: `${SITE_NAME} Methodology`,
            href: "/methodology",
          },
        ]}
      />
    </article>
  );
}
