"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calculator, ChevronDown, Menu, Search, Target, X } from "lucide-react";
import { CALCULATOR_CATEGORIES } from "@/lib/calculators";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/brand";
import {
  DESKTOP_NAV,
  FINANCIAL_GOALS,
  LEARN_LINKS,
  isNavActive,
} from "@/lib/nav";
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
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({
    calculators: true,
    goals: false,
  });

  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
      <button
        type="button"
        className="absolute inset-0 bg-navy/50"
        aria-label="Close menu"
        onClick={onClose}
      />
      <aside className="absolute inset-y-0 left-0 flex w-[min(100%,20rem)] max-w-full flex-col bg-white text-foreground shadow-2xl">
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4">
          <Link
            href="/"
            onClick={onClose}
            className="font-semibold text-navy"
          >
            {SITE_NAME}
          </Link>
          <Button
            type="button"
            variant="ghost"
            size="icon"
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

          <nav className="space-y-4">
            {/* Calculators */}
            <div>
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-left text-sm font-semibold text-navy hover:bg-secondary"
                onClick={() =>
                  setExpanded((p) => ({ ...p, calculators: !p.calculators }))
                }
              >
                <Calculator className="h-4 w-4 text-accent" />
                <span className="flex-1">Calculators</span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 opacity-60 transition-transform",
                    expanded.calculators && "rotate-180"
                  )}
                />
              </button>
              {expanded.calculators ? (
                <div className="mt-1 space-y-1 pl-1">
                  <Link
                    href="/calculators"
                    onClick={onClose}
                    className={cn(
                      "block rounded-md px-3 py-2 text-sm",
                      pathname === "/calculators"
                        ? "bg-navy/5 font-medium text-navy"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    All calculators
                  </Link>
                  {CALCULATOR_CATEGORIES.map((category) => {
                    const short =
                      category.id === "investment"
                        ? "Investment"
                        : category.id === "debt"
                          ? "Loans"
                          : category.id === "taxation"
                            ? "Tax"
                            : category.id === "retirement"
                              ? "Retirement"
                              : category.id === "government"
                                ? "Savings"
                                : category.label;
                    return (
                      <details key={category.id} className="group">
                        <summary className="cursor-pointer list-none rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary marker:content-none [&::-webkit-details-marker]:hidden">
                          <span className="flex items-center justify-between gap-2">
                            {short}
                            <ChevronDown className="h-3.5 w-3.5 opacity-50 transition group-open:rotate-180" />
                          </span>
                        </summary>
                        <ul className="ml-3 space-y-0.5 border-l border-border py-1 pl-2">
                          {category.calculators.map((calc) => {
                            const href = `/calculators/${category.id}/${calc.slug}`;
                            return (
                              <li key={calc.slug}>
                                <Link
                                  href={href}
                                  onClick={onClose}
                                  className={cn(
                                    "block rounded-md px-2.5 py-1.5 text-sm",
                                    pathname === href
                                      ? "bg-navy/5 font-medium text-navy"
                                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                                  )}
                                >
                                  {calc.title}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </details>
                    );
                  })}
                </div>
              ) : null}
            </div>

            {/* Financial goals */}
            <div>
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-left text-sm font-semibold text-navy hover:bg-secondary"
                onClick={() =>
                  setExpanded((p) => ({ ...p, goals: !p.goals }))
                }
              >
                <Target className="h-4 w-4 text-accent" />
                <span className="flex-1">Financial Goals</span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 opacity-60 transition-transform",
                    expanded.goals && "rotate-180"
                  )}
                />
              </button>
              {expanded.goals ? (
                <ul className="mt-1 space-y-0.5 border-l border-border pl-3">
                  {FINANCIAL_GOALS.map((g) => (
                    <li key={g.href}>
                      <Link
                        href={g.href}
                        onClick={onClose}
                        className="block rounded-md px-2.5 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
                      >
                        {g.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            <div className="border-t border-border pt-3">
              <p className="mb-1 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Learn
              </p>
              {LEARN_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={onClose}
                  className="block rounded-md px-3 py-2.5 text-sm hover:bg-secondary"
                >
                  {l.label}
                </Link>
              ))}
              <Link
                href="/about"
                onClick={onClose}
                className="block rounded-md px-3 py-2.5 text-sm hover:bg-secondary"
              >
                About
              </Link>
              <Link
                href="/contact"
                onClick={onClose}
                className="block rounded-md px-3 py-2.5 text-sm hover:bg-secondary"
              >
                Contact
              </Link>
            </div>
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
      <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-2 px-4 sm:h-16 sm:gap-3 sm:px-6 lg:px-8">
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
            <span className="block truncate text-base font-semibold tracking-tight text-navy sm:text-lg">
              {SITE_NAME}
            </span>
            <span className="hidden max-w-[14rem] truncate text-[11px] text-muted-foreground xl:block">
              {SITE_TAGLINE}
            </span>
          </Link>

          <nav
            className="ml-2 hidden items-center gap-0.5 lg:flex xl:ml-4 xl:gap-1"
            aria-label="Primary"
          >
            {DESKTOP_NAV.map((item) => {
              const active = isNavActive(pathname, item.match ?? item.href);
              return (
                <Link
                  key={item.href + item.label}
                  href={item.href}
                  className={cn(
                    "rounded-md px-2 py-1.5 text-[13px] transition-colors xl:px-2.5 xl:text-sm",
                    active
                      ? "font-medium text-navy"
                      : "text-muted-foreground hover:text-navy"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <div className="hidden w-48 md:block lg:w-56 xl:w-64">
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
          </div>
        </div>

        {searchOpen ? (
          <div className="border-t border-border px-4 py-3 md:hidden">
            <SiteSearch onNavigate={() => setSearchOpen(false)} />
          </div>
        ) : null}
      </header>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
