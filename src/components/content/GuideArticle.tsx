import Link from "next/link";
import type { Guide } from "@/lib/content/guides";
import { getGuide } from "@/lib/content/guides";
import { ds } from "@/lib/design-system";
import { SITE_NAME } from "@/lib/brand";

export function GuideArticle({ guide }: { guide: Guide }) {
  return (
    <article className={ds.page}>
      <nav className="text-sm text-muted-foreground">
        <Link href="/" className="hover:text-gold">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/guides" className="hover:text-gold">
          Guides
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{guide.title}</span>
      </nav>

      <header className={ds.sectionTight}>
        <p className={ds.label}>{guide.category}</p>
        <h1 className={ds.h1}>{guide.title}</h1>
        <p className={ds.lead}>{guide.description}</p>
        <p className="text-xs text-muted-foreground">
          {guide.readingMinutes} min read · Updated {guide.lastUpdated}
        </p>
      </header>

      {guide.sections.map((section) => (
        <section key={section.h2} className={ds.section}>
          <h2 className={ds.h2}>{section.h2}</h2>
          {section.paragraphs.map((p) => (
            <p key={p.slice(0, 40)} className="text-sm text-foreground/90 sm:text-base">
              {p}
            </p>
          ))}
          {section.bullets?.length ? (
            <ul className="list-disc space-y-1 pl-5 text-sm text-foreground/90">
              {section.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}

      <section className={ds.section}>
        <h2 className={ds.h2}>Related calculators</h2>
        <ul className="flex flex-wrap gap-2">
          {guide.relatedCalculators.map((c) => (
            <li key={c.href}>
              <Link
                href={c.href}
                className="inline-block rounded-md border border-border/60 px-3 py-2 text-sm hover:border-gold/40 hover:text-gold"
              >
                {c.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {guide.relatedGuides.length ? (
        <section className={ds.section}>
          <h2 className={ds.h2}>Keep reading</h2>
          <ul className="space-y-2 text-sm">
            {guide.relatedGuides.map((slug) => {
              const g = getGuide(slug);
              if (!g) return null;
              return (
                <li key={slug}>
                  <Link href={`/guides/${slug}`} className="text-gold hover:underline">
                    {g.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      <p className="rounded-lg border border-border/50 bg-navy/30 p-4 text-xs text-muted-foreground">
        Educational content from {SITE_NAME}. Not investment, tax or legal advice.
      </p>
    </article>
  );
}
