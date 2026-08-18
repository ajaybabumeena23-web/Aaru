import type { Metadata } from "next";
import Link from "next/link";
import { GLOSSARY } from "@/lib/content/glossary";
import { ds } from "@/lib/design-system";
import { getSiteUrl } from "@/lib/site";
import { SITE_NAME } from "@/lib/brand";
import { cn } from "@/lib/utils";

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
          Open any term for examples, related tools and links.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        {terms.map((t) => (
          <Link
            key={t.slug}
            href={`/glossary/${t.slug}`}
            className="rounded-md border border-border bg-white px-2.5 py-1 text-xs font-medium hover:border-primary/40 hover:text-primary"
          >
            {t.term}
          </Link>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {terms.map((t) => (
          <Link
            key={t.slug}
            href={`/glossary/${t.slug}`}
            className={cn(ds.cardInteractive, "block p-4")}
          >
            <h2 className="text-base font-semibold text-navy">
              {t.term}{" "}
              <span className="text-sm font-normal text-muted-foreground">
                — {t.short}
              </span>
            </h2>
            <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
              {t.definition}
            </p>
          </Link>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        Glossary by {SITE_NAME}. Verify statutory details on official sources.
      </p>
    </div>
  );
}
