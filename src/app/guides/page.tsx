import type { Metadata } from "next";
import Link from "next/link";
import { GUIDES } from "@/lib/content/guides";
import { GUIDE_CATEGORIES } from "@/lib/content/guide-categories";
import { ds } from "@/lib/design-system";
import { getSiteUrl } from "@/lib/site";
import { SITE_NAME } from "@/lib/brand";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Money Guides",
  description:
    "Practical guides on SIPs, loans, tax, retirement and government schemes for Indian households.",
  alternates: { canonical: `${getSiteUrl()}/guides` },
};

export default function GuidesIndexPage() {
  const byCategory = GUIDES.reduce<Record<string, typeof GUIDES>>((acc, g) => {
    (acc[g.category] ??= []).push(g);
    return acc;
  }, {});

  return (
    <div className={ds.page}>
      <header className={ds.sectionTight}>
        <h1 className={ds.h1}>Money guides</h1>
        <p className={ds.lead}>
          Clear explainers that pair with our calculators—examples and frameworks,
          not product pitches.
        </p>
      </header>

      <section className={ds.section}>
        <h2 className={ds.h2}>Browse by topic cluster</h2>
        <div className="flex flex-wrap gap-2">
          {GUIDE_CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/guides/${c.slug}`}
              className="rounded-full border border-border bg-white px-3 py-1.5 text-sm font-medium text-navy hover:border-primary/40 hover:text-primary"
            >
              {c.label}
            </Link>
          ))}
        </div>
      </section>

      {Object.entries(byCategory).map(([category, guides]) => {
        const catMeta = GUIDE_CATEGORIES.find((c) => c.category === category);
        return (
          <section key={category} className={ds.section}>
            <div className="flex items-baseline justify-between gap-3">
              <h2 className={ds.h2}>{category}</h2>
              {catMeta ? (
                <Link
                  href={`/guides/${catMeta.slug}`}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  View cluster
                </Link>
              ) : null}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {guides.map((g) => (
                <Link
                  key={g.slug}
                  href={`/guides/${g.slug}`}
                  className={cn(ds.cardInteractive, "block px-4 py-3")}
                >
                  <p className="font-medium">{g.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {g.description}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {g.readingMinutes} min · {SITE_NAME}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
