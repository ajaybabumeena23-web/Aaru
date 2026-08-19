import type { Metadata } from "next";
import Link from "next/link";
import { TOPIC_HUBS } from "@/lib/content/topics";
import { HUB_ALIASES, getAliasForCanonical } from "@/lib/hub-aliases";
import { ds } from "@/lib/design-system";
import { getSiteUrl } from "@/lib/site";
import { SITE_NAME } from "@/lib/brand";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: {
    absolute: `Financial Topics — SIP, Loans, Tax & More | ${SITE_NAME}`,
  },
  description:
    "Browse SIP, loans, tax, retirement, PPF, NPS, mutual funds, insurance and wealth-planning hubs — calculators, guides and examples for India.",
  alternates: { canonical: `${getSiteUrl()}/topics` },
  openGraph: {
    title: `Financial Topics | ${SITE_NAME}`,
    description:
      "Start from a topic, then open the calculators, guides and examples that belong together.",
    url: `${getSiteUrl()}/topics`,
    siteName: SITE_NAME,
    type: "website",
    locale: "en_IN",
  },
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

      <section className={ds.sectionTight} aria-labelledby="ia-shortcuts">
        <h2 id="ia-shortcuts" className={ds.h3}>
          Popular starting points
        </h2>
        <div className="flex flex-wrap gap-2">
          {[
            { href: "/sip", label: "Investments" },
            { href: "/loans", label: "Loans" },
            { href: "/income-tax", label: "Tax" },
            { href: "/retirement", label: "Retirement" },
            { href: "/wealth-planning", label: "Personal Finance" },
            { href: "/fd-rd", label: "Savings" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full border border-border bg-white px-3 py-1.5 text-sm font-medium text-navy hover:border-primary/40 hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </section>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {TOPIC_HUBS.map((t) => {
          const alias = getAliasForCanonical(t.slug);
          return (
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
              {alias ? (
                <p className="mt-1 text-xs text-muted-foreground">
                  Also reachable via /{alias.alias}
                </p>
              ) : null}
            </Link>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground">
        Canonical topic URLs stay short (/{TOPIC_HUBS[0]?.slug}, /loans, …).
        Friendly paths like{" "}
        {HUB_ALIASES.map((a) => `/${a.alias}`).join(", ")} permanently redirect
        to those hubs on {SITE_NAME}.
      </p>
    </div>
  );
}
