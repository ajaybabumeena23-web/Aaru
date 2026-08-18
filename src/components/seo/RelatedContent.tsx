import Link from "next/link";
import { ds } from "@/lib/design-system";
import { cn } from "@/lib/utils";

export type RelatedLink = { href: string; title: string; blurb?: string };

export function RelatedCalculators({
  items,
  heading = "Related calculators",
}: {
  items: RelatedLink[];
  heading?: string;
}) {
  if (!items.length) return null;
  return (
    <section className={ds.section} aria-labelledby="related-calcs">
      <h2 id="related-calcs" className={ds.h2}>
        {heading}
      </h2>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              ds.cardInteractive,
              "block px-4 py-3 text-sm font-medium text-navy hover:text-primary"
            )}
          >
            {item.title}
            {item.blurb ? (
              <span className="mt-1 block text-xs font-normal text-muted-foreground">
                {item.blurb}
              </span>
            ) : null}
          </Link>
        ))}
      </div>
    </section>
  );
}

export function RelatedGuides({
  items,
  heading = "Related guides",
}: {
  items: RelatedLink[];
  heading?: string;
}) {
  if (!items.length) return null;
  return (
    <section className={ds.section} aria-labelledby="related-guides">
      <h2 id="related-guides" className={ds.h2}>
        {heading}
      </h2>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="font-medium text-primary hover:underline"
            >
              {item.title}
            </Link>
            {item.blurb ? (
              <span className="text-sm text-muted-foreground">
                {" "}
                — {item.blurb}
              </span>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function TopicNavigation({
  items,
  heading = "Related topics",
}: {
  items: RelatedLink[];
  heading?: string;
}) {
  if (!items.length) return null;
  return (
    <section className={ds.section}>
      <h2 className={ds.h2}>{heading}</h2>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-full border border-border bg-white px-3 py-1.5 text-sm font-medium text-navy hover:border-primary/40 hover:text-primary"
          >
            {item.title}
          </Link>
        ))}
      </div>
    </section>
  );
}

export function SourcesBlock({
  sources,
}: {
  sources: { label: string; href?: string; note?: string }[];
}) {
  if (!sources.length) return null;
  return (
    <section className={ds.section} aria-labelledby="sources">
      <h2 id="sources" className={ds.h2}>
        Sources & methodology
      </h2>
      <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
        {sources.map((s) => (
          <li key={s.label}>
            {s.href ? (
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {s.label}
              </a>
            ) : (
              <span className="text-foreground">{s.label}</span>
            )}
            {s.note ? ` — ${s.note}` : null}
          </li>
        ))}
      </ul>
      <p className="text-xs text-muted-foreground">
        Always verify current rates, slabs and scheme rules on official portals.
        Calculator outputs are illustrative estimates.
      </p>
    </section>
  );
}
