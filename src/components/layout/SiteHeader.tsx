"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calculator, ChevronDown, Menu, Search, X } from "lucide-react";
import { CALCULATOR_CATEGORIES } from "@/lib/calculators";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/brand";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SiteSearch } from "@/components/layout/SiteSearch";

function MobileNav({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>(() =>
    Object.fromEntries(CALCULATOR_CATEGORIES.map((c) => [c.id, false]))
  );

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
      <button
        type="button"
        className="absolute inset-0 bg-black/60"
        aria-label="Close menu"
        onClick={onClose}
      />
      <aside className="absolute inset-y-0 left-0 flex w-[min(100%,20rem)] max-w-full flex-col bg-[#0f1422] text-white shadow-2xl">
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-white/10 px-4">
          <Link href="/" onClick={onClose} className="font-semibold text-gold">
            {SITE_NAME}
          </Link>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
            aria-label="Close menu"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain px-3 py-4">
          <div className="mb-4 px-1">
            <SiteSearch onNavigate={onClose} compact />
          </div>
          <nav className="space-y-1">
            <Link
              href="/calculators"
              onClick={onClose}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium",
                pathname === "/calculators"
                  ? "bg-gold/15 text-gold"
                  : "hover:bg-white/5"
              )}
            >
              <Calculator className="h-4 w-4" />
              All Calculators
            </Link>
            {CALCULATOR_CATEGORIES.map((category) => {
              const Icon = category.icon;
              const isOpen = expanded[category.id];
              return (
                <div key={category.id}>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-left text-sm font-semibold hover:bg-white/5"
                    onClick={() =>
                      setExpanded((p) => ({
                        ...p,
                        [category.id]: !p[category.id],
                      }))
                    }
                  >
                    <Icon className="h-4 w-4 opacity-80" />
                    <span className="flex-1">{category.label}</span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 opacity-60 transition-transform",
                        isOpen && "rotate-180"
                      )}
                    />
                  </button>
                  {isOpen ? (
                    <ul className="ml-4 space-y-0.5 border-l border-white/10 pl-2 pb-2">
                      {category.calculators.map((calc) => {
                        const href = `/calculators/${category.id}/${calc.slug}`;
                        return (
                          <li key={calc.slug}>
                            <Link
                              href={href}
                              onClick={onClose}
                              className={cn(
                                "block rounded-md px-2.5 py-2 text-sm",
                                pathname === href
                                  ? "bg-gold/15 text-gold"
                                  : "text-white/70 hover:bg-white/5 hover:text-white"
                              )}
                            >
                              {calc.title}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}
                </div>
              );
            })}
            <Link
              href="/guides"
              onClick={onClose}
              className="block rounded-md px-3 py-2.5 text-sm hover:bg-white/5"
            >
              Money Guides
            </Link>
            <Link
              href="/glossary"
              onClick={onClose}
              className="block rounded-md px-3 py-2.5 text-sm hover:bg-white/5"
            >
              Glossary
            </Link>
            <Link
              href="/sip"
              onClick={onClose}
              className="block rounded-md px-3 py-2.5 text-sm hover:bg-white/5"
            >
              SIP Hub
            </Link>
            <Link
              href="/about"
              onClick={onClose}
              className="block rounded-md px-3 py-2.5 text-sm hover:bg-white/5"
            >
              About
            </Link>
            <Link
              href="/disclaimer"
              onClick={onClose}
              className="block rounded-md px-3 py-2.5 text-sm hover:bg-white/5"
            >
              Disclaimer
            </Link>
            <Link
              href="/contact"
              onClick={onClose}
              className="block rounded-md px-3 py-2.5 text-sm hover:bg-white/5"
            >
              Contact
            </Link>
          </nav>
        </div>
      </aside>
    </div>
  );
}

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const pathname = usePathname();

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-2 px-4 sm:h-16 sm:gap-4 sm:px-6 lg:px-8">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="shrink-0 lg:hidden"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <Link href="/" className="min-w-0 shrink">
            <span className="block truncate text-base font-semibold text-gold sm:text-lg">
              {SITE_NAME}
            </span>
            <span className="hidden text-xs text-muted-foreground sm:block">
              {SITE_TAGLINE}
            </span>
          </Link>

          <nav className="ml-4 hidden items-center gap-1 lg:flex">
            {CALCULATOR_CATEGORIES.map((category) => (
              <Link
                key={category.id}
                href={`/calculators/${category.id}`}
                className={cn(
                  "rounded-md px-2.5 py-1.5 text-sm transition-colors hover:text-gold",
                  pathname.startsWith(`/calculators/${category.id}`)
                    ? "text-gold"
                    : "text-muted-foreground"
                )}
              >
                {category.label.split(" ")[0]}
              </Link>
            ))}
            <Link
              href="/guides"
              className={cn(
                "rounded-md px-2.5 py-1.5 text-sm transition-colors hover:text-gold",
                pathname.startsWith("/guides")
                  ? "text-gold"
                  : "text-muted-foreground"
              )}
            >
              Guides
            </Link>
            <Link
              href="/about"
              className="rounded-md px-2.5 py-1.5 text-sm text-muted-foreground hover:text-gold"
            >
              About
            </Link>
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <div className="hidden w-56 md:block lg:w-72">
              <SiteSearch />
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="md:hidden"
              aria-label="Search"
              onClick={() => setSearchOpen((v) => !v)}
            >
              <Search className="h-4 w-4" />
            </Button>
            <Button asChild size="sm" className="hidden sm:inline-flex">
              <Link href="/calculators">Calculators</Link>
            </Button>
          </div>
        </div>

        {searchOpen ? (
          <div className="border-t border-border/60 px-4 py-3 md:hidden">
            <SiteSearch onNavigate={() => setSearchOpen(false)} />
          </div>
        ) : null}
      </header>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
