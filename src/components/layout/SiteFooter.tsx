import Link from "next/link";
import { TOPIC_HUBS } from "@/lib/content/topics";
import {
  POPULAR_CALCULATORS,
  SITE_NAME,
  SITE_TAGLINE,
  TRUST_LINKS,
} from "@/lib/brand";

export function SiteFooter() {
  const year = new Date().getFullYear();
  const calcLinks = [
    ...POPULAR_CALCULATORS.slice(0, 7).map((c) => ({
      href: `/calculators/${c.category}/${c.slug}`,
      label: c.title,
    })),
  ];

  return (
    <footer className="mt-auto border-t border-border bg-navy text-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-3">
            <p className="text-lg font-semibold text-white">{SITE_NAME}</p>
            <p className="text-sm text-white/70">{SITE_TAGLINE}</p>
            <p className="text-sm text-white/60">
              Free financial calculators and practical money guidance for Indian
              households — estimates only, not personalised advice.
            </p>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold text-white">Calculators</p>
            <ul className="space-y-2 text-sm text-white/70">
              {calcLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/calculators" className="hover:text-white">
                  All calculators
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold text-white">Topics</p>
            <ul className="space-y-2 text-sm text-white/70">
              {TOPIC_HUBS.slice(0, 8).map((t) => (
                <li key={t.slug}>
                  <Link href={`/${t.slug}`} className="hover:text-white">
                    {t.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/topics" className="hover:text-white">
                  All topics
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold text-white">Learn</p>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <Link href="/guides" className="hover:text-white">
                  Money Guides
                </Link>
              </li>
              <li>
                <Link href="/glossary" className="hover:text-white">
                  Glossary
                </Link>
              </li>
              <li>
                <Link href="/methodology" className="hover:text-white">
                  Methodology
                </Link>
              </li>
              <li>
                <Link href="/editorial-policy" className="hover:text-white">
                  Editorial Policy
                </Link>
              </li>
              <li>
                <Link href="/topics" className="hover:text-white">
                  Topic hubs
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold text-white">Company</p>
            <ul className="space-y-2 text-sm text-white/70">
              {TRUST_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/sitemap.xml" className="hover:text-white">
                  XML Sitemap
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/15 pt-6 text-xs text-white/55">
          <p>
            © {year} {SITE_NAME}. Calculators provide illustrative estimates
            based on stated assumptions. Not investment, tax, or legal advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
