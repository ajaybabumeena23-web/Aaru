import Link from "next/link";
import {
  type GuideCategory,
  guidesForCategory,
} from "@/lib/content/guide-categories";
import { ds } from "@/lib/design-system";
import { cn } from "@/lib/utils";
import { SITE_NAME } from "@/lib/brand";
import { RelatedGuides } from "@/components/seo/RelatedContent";

export function GuideCategoryView({ category }: { category: GuideCategory }) {
  const guides = guidesForCategory(category);

  return (
    <div className={ds.page}>
      <nav className="text-sm text-muted-foreground">
        <Link href="/" className="hover:text-primary">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/guides" className="hover:text-primary">
          Guides
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{category.label}</span>
      </nav>

      <header className={ds.sectionTight}>
        <h1 className={ds.h1}>{category.title}</h1>
        <p className={ds.lead}>{category.description}</p>
      </header>

      <section className={ds.section}>
        <h2 className={ds.h2}>Guides in this cluster</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {guides.map((g) => (
            <Link
              key={g.slug}
              href={`/guides/${g.slug}`}
              className={cn(ds.cardInteractive, "block px-4 py-3")}
            >
              <p className="font-medium text-navy">{g.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {g.description}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                {g.readingMinutes} min read · Updated {g.lastUpdated}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <RelatedGuides
        heading="Browse all money guides"
        items={[
          {
            href: "/guides",
            title: `All ${SITE_NAME} guides`,
            blurb: "Every topic cluster in one place",
          },
        ]}
      />
    </div>
  );
}
