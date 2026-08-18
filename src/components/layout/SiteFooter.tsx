import Link from "next/link";
import {
  SITE_NAME,
  SITE_TAGLINE,
  TRUST_LINKS,
} from "@/lib/brand";
import {
  FOOTER_CALCULATORS,
  LEARN_LINKS,
  MONEY_LINKS,
} from "@/lib/nav";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-navy text-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-3 sm:col-span-2 lg:col-span-1">
            <p className="font-serif text-xl font-normal text-white">
              {SITE_NAME}
            </p>
            <p className="text-sm text-white/70">{SITE_TAGLINE}</p>
            <p className="text-sm leading-relaxed text-white/55">
              Calculate, understand and plan money decisions with transparent
              tools for Indian households. Estimates only — not personalised
              advice.
            </p>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/50">
              Calculators
            </p>
            <ul className="space-y-2 text-sm text-white/70">
              {FOOTER_CALCULATORS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/50">
              Money
            </p>
            <ul className="space-y-2 text-sm text-white/70">
              {MONEY_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/50">
              Learn
            </p>
            <ul className="space-y-2 text-sm text-white/70">
              {LEARN_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/50">
              Aaru Wealth
            </p>
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

        <div className="mt-10 border-t border-white/15 pt-6 text-xs text-white/50">
          <p>
            © {year} {SITE_NAME}. Illustrative estimates based on stated
            assumptions. Not investment, tax, or legal advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
