import type { Metadata } from "next";
import Link from "next/link";
import { GLOSSARY } from "@/lib/content/glossary";
import { getGuide } from "@/lib/content/guides";
import { ds } from "@/lib/design-system";
import { getSiteUrl } from "@/lib/site";
import { SITE_NAME } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Financial Glossary",
  description:
    "Plain-language definitions of SIP, EMI, XIRR, PPF, NPS and other personal-finance terms used across Aaru Wealth.",
  alternates: { canonical: `${getSiteUrl()}/glossary` },
};

export default function GlossaryPage() {
  const terms = [...GLOSSARY].sort((a, b) => a.term.localeCompare(b.term));

  return (
    <div className={ds.page}>
      <header className={ds.sectionTight}>
        <h1 className={ds.h1}>Financial glossary</h1>
        <p className={ds.lead}>
          Short definitions for terms you will see in our calculators and guides.
          Not a substitute for official scheme documents or tax law.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        {terms.map((t) => (
          <a
            key={t.slug}
            href={`#${t.slug}`}
            className="rounded-md border border-border/60 px-2.5 py-1 text-xs hover:border-gold/40 hover:text-gold"
          >
            {t.term}
          </a>
        ))}
      </div>

      <div className="space-y-6">
        {terms.map((t) => (
          <section
            key={t.slug}
            id={t.slug}
            className="scroll-mt-24 rounded-xl border border-border/60 bg-card/50 p-4 sm:p-5"
          >
            <h2 className="text-lg font-semibold text-foreground">
              {t.term}{" "}
              <span className="text-sm font-normal text-muted-foreground">
                — {t.short}
              </span>
            </h2>
            <p className="mt-2 text-sm text-foreground/90">{t.definition}</p>
            {t.relatedCalculators?.length ? (
              <p className="mt-3 text-sm">
                Calculators:{" "}
                {t.relatedCalculators.map((c, i) => (
                  <span key={c.href}>
                    {i > 0 ? " · " : null}
                    <Link href={c.href} className="text-gold hover:underline">
                      {c.title}
                    </Link>
                  </span>
                ))}
              </p>
            ) : null}
            {t.relatedGuides?.length ? (
              <p className="mt-1 text-sm">
                Guides:{" "}
                {t.relatedGuides.map((slug, i) => {
                  const g = getGuide(slug);
                  if (!g) return null;
                  return (
                    <span key={slug}>
                      {i > 0 ? " · " : null}
                      <Link
                        href={`/guides/${slug}`}
                        className="text-gold hover:underline"
                      >
                        {g.title}
                      </Link>
                    </span>
                  );
                })}
              </p>
            ) : null}
          </section>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        Glossary by {SITE_NAME}. Verify statutory details on official sources.
      </p>
    </div>
  );
}
