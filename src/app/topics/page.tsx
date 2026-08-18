import type { Metadata } from "next";
import Link from "next/link";
import { TOPIC_HUBS } from "@/lib/content/topics";
import { ds } from "@/lib/design-system";
import { getSiteUrl } from "@/lib/site";
import { SITE_NAME } from "@/lib/brand";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Financial Topics",
  description:
    "Browse SIP, loans, tax, retirement, PPF, NPS, mutual funds, insurance and wealth-planning hubs on Aaru Wealth.",
  alternates: { canonical: `${getSiteUrl()}/topics` },
};

export default function TopicsIndexPage() {
  return (
    <div className={ds.page}>
      <header className={ds.sectionTight}>
        <h1 className={ds.h1}>Financial topic hubs</h1>
        <p className={ds.lead}>
          Start from a topic, then open the calculators, guides and examples that
          belong together — built for Indian personal-finance search intent.
        </p>
      </header>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {TOPIC_HUBS.map((t) => (
          <Link
            key={t.slug}
            href={`/${t.slug}`}
            className={cn(ds.cardInteractive, "block p-5")}
          >
            <p className="font-semibold text-navy">{t.title}</p>
            <p className="mt-2 text-sm text-muted-foreground">{t.description}</p>
            <p className="mt-3 text-sm font-medium text-primary">
              Open {t.title} hub →
            </p>
          </Link>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Prefer short URLs like /sip and /loans — they remain the canonical topic
        pages on {SITE_NAME}.
      </p>
    </div>
  );
}
