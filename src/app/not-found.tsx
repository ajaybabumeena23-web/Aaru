import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SiteSearch } from "@/components/layout/SiteSearch";
import { POPULAR_CALCULATORS, SITE_NAME } from "@/lib/brand";
import { GUIDES } from "@/lib/content/guides";
import { ds } from "@/lib/design-system";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className={ds.page}>
      <div className="mx-auto max-w-2xl space-y-6 text-center">
        <h1 className={ds.h1}>We couldn&apos;t find that page</h1>
        <p className={cn(ds.lead, "mx-auto")}>
          The link may be outdated, or the page has moved. Search {SITE_NAME} or
          try a popular tool below.
        </p>
        <div className="w-full text-left">
          <SiteSearch large />
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button asChild>
            <Link href="/calculators">Explore Calculators</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/guides">Money Guides</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Home</Link>
          </Button>
        </div>
      </div>

      <section className={ds.section}>
        <h2 className={ds.h2}>Popular calculators</h2>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {POPULAR_CALCULATORS.slice(0, 6).map((c) => (
            <Link
              key={`${c.category}-${c.slug}`}
              href={`/calculators/${c.category}/${c.slug}`}
              className="rounded-lg border border-border bg-white px-4 py-3 text-sm font-medium text-navy hover:border-primary/40 hover:text-primary"
            >
              {c.title}
            </Link>
          ))}
        </div>
      </section>

      <section className={ds.section}>
        <h2 className={ds.h2}>Popular guides</h2>
        <ul className="space-y-2 text-sm">
          {GUIDES.slice(0, 5).map((g) => (
            <li key={g.slug}>
              <Link
                href={`/guides/${g.slug}`}
                className="text-primary hover:underline"
              >
                {g.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
