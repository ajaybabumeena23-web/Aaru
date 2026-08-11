import Link from "next/link";
import { CALCULATOR_CATEGORIES } from "@/lib/calculators";
import { TOPIC_HUBS } from "@/lib/content/topics";
import {
  POPULAR_CALCULATORS,
  SITE_NAME,
  SITE_TAGLINE,
  TRUST_LINKS,
} from "@/lib/brand";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border/60 bg-[#0f1422]">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-3 lg:col-span-1">
            <p className="text-lg font-semibold text-gold">{SITE_NAME}</p>
            <p className="text-sm text-muted-foreground">{SITE_TAGLINE}</p>
            <p className="text-sm text-muted-foreground">
              Free financial calculators and practical money guidance for Indian
              households — estimates only, not personalised advice.
            </p>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold text-foreground">
              Categories
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {CALCULATOR_CATEGORIES.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/calculators/${c.id}`}
                    className="hover:text-gold"
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold text-foreground">
              Topic hubs
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {TOPIC_HUBS.map((t) => (
                <li key={t.slug}>
                  <Link href={`/${t.slug}`} className="hover:text-gold">
                    {t.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold text-foreground">
              Popular tools
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {POPULAR_CALCULATORS.slice(0, 8).map((c) => (
                <li key={`${c.category}-${c.slug}`}>
                  <Link
                    href={`/calculators/${c.category}/${c.slug}`}
                    className="hover:text-gold"
                  >
                    {c.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold text-foreground">Learn</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/guides" className="hover:text-gold">
                  Money Guides
                </Link>
              </li>
              <li>
                <Link href="/glossary" className="hover:text-gold">
                  Glossary
                </Link>
              </li>
              {TRUST_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-gold">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/sitemap.xml" className="hover:text-gold">
                  XML Sitemap
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-xs text-muted-foreground">
          <p>
            © {year} {SITE_NAME}. Calculators provide illustrative estimates
            based on stated assumptions. Not investment, tax, or legal advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
