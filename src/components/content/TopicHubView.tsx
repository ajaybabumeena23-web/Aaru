import Link from "next/link";
import { getTopic, TOPIC_HUBS } from "@/lib/content/topics";
import { getGuide } from "@/lib/content/guides";
import { getGlossaryTerm } from "@/lib/content/glossary";
import { getScenario, scenarioPath } from "@/lib/content/scenarios";
import { ds } from "@/lib/design-system";
import { cn } from "@/lib/utils";
import { SITE_NAME } from "@/lib/brand";
import {
  SourcesBlock,
  TopicNavigation,
} from "@/components/seo/RelatedContent";

export function TopicHubView({ slug }: { slug: string }) {
  const topic = getTopic(slug);
  if (!topic) return null;

  const guides = topic.guideSlugs
    .map((s) => getGuide(s))
    .filter(Boolean);
  const scenarios = (topic.scenarioSlugs ?? [])
    .map((s) => getScenario(s))
    .filter(Boolean);
  const terms = (topic.glossaryTerms ?? [])
    .map((s) => getGlossaryTerm(s))
    .filter(Boolean);

  return (
    <div className={ds.page}>
      <nav className="text-sm text-muted-foreground">
        <Link href="/" className="hover:text-primary">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{topic.title}</span>
      </nav>

      <header className={ds.sectionTight}>
        <h1 className={ds.h1}>{topic.h1}</h1>
        <p className={ds.lead}>{topic.intro}</p>
      </header>

      <section className={ds.section}>
        <h2 className={ds.h2}>Calculators</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {topic.calculators.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className={cn(ds.cardInteractive, "block px-4 py-3")}
            >
              <p className="font-medium text-foreground hover:text-primary">
                {c.title}
              </p>
              {c.blurb ? (
                <p className="mt-1 text-sm text-muted-foreground">{c.blurb}</p>
              ) : null}
            </Link>
          ))}
        </div>
      </section>

      {guides.length ? (
        <section className={ds.section}>
          <h2 className={ds.h2}>Guides</h2>
          <ul className="space-y-2">
            {guides.map((g) =>
              g ? (
                <li key={g.slug}>
                  <Link
                    href={`/guides/${g.slug}`}
                    className="text-primary hover:underline"
                  >
                    {g.title}
                  </Link>
                  <span className="text-sm text-muted-foreground">
                    {" "}
                    — {g.description}
                  </span>
                </li>
              ) : null
            )}
          </ul>
          <p className="text-sm">
            <Link href="/guides" className="text-primary hover:underline">
              Browse all guides
            </Link>
          </p>
        </section>
      ) : null}

      {scenarios.length ? (
        <section className={ds.section}>
          <h2 className={ds.h2}>Example scenarios</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {scenarios.map((s) =>
              s ? (
                <Link
                  key={s.slug}
                  href={scenarioPath(s)}
                  className={cn(ds.cardInteractive, "block px-4 py-3")}
                >
                  <p className="font-medium">{s.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {s.description}
                  </p>
                </Link>
              ) : null
            )}
          </div>
        </section>
      ) : null}

      {terms.length ? (
        <section className={ds.section}>
          <h2 className={ds.h2}>Key terms</h2>
          <div className="flex flex-wrap gap-2">
            {terms.map((t) =>
              t ? (
                <Link
                  key={t.slug}
                  href={`/glossary/${t.slug}`}
                  className="rounded-md border border-border bg-white px-3 py-1.5 text-sm hover:border-primary/40 hover:text-primary"
                >
                  {t.term}
                </Link>
              ) : null
            )}
          </div>
        </section>
      ) : null}

      <section className={ds.section}>
        <h2 className={ds.h2}>FAQs</h2>
        <div className="space-y-3">
          {topic.faqs.map((f) => (
            <details
              key={f.q}
              className="rounded-lg border border-border bg-white px-4 py-3"
            >
              <summary className="cursor-pointer font-medium">{f.q}</summary>
              <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <TopicNavigation
        items={TOPIC_HUBS.filter((t) => t.slug !== topic.slug)
          .slice(0, 8)
          .map((t) => ({ href: `/${t.slug}`, title: t.title }))}
      />

      <SourcesBlock
        sources={[
          {
            label: "Calculator Methodology",
            href: "/methodology",
          },
          {
            label: "Editorial Policy",
            href: "/editorial-policy",
          },
          {
            label: "Official scheme / tax portals",
            note: "verify current rates and rules before acting",
          },
        ]}
      />

      <p className="text-xs text-muted-foreground">
        Illustrative content from {SITE_NAME}. Not personalised financial advice.
      </p>
    </div>
  );
}
