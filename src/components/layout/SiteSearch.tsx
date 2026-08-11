"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { CALCULATOR_CATEGORIES } from "@/lib/calculators";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Hit = {
  href: string;
  title: string;
  category: string;
};

function searchCatalog(query: string): Hit[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const hits: Hit[] = [];
  for (const category of CALCULATOR_CATEGORIES) {
    for (const calc of category.calculators) {
      const hay = `${calc.title} ${calc.h1} ${calc.description} ${category.label}`.toLowerCase();
      if (hay.includes(q)) {
        hits.push({
          href: `/calculators/${category.id}/${calc.slug}`,
          title: calc.title,
          category: category.label,
        });
      }
    }
  }
  return hits.slice(0, 8);
}

export function SiteSearch({
  onNavigate,
  compact,
  className,
  autoFocus,
  large,
}: {
  onNavigate?: () => void;
  compact?: boolean;
  className?: string;
  autoFocus?: boolean;
  large?: boolean;
}) {
  const [query, setQuery] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const rootRef = React.useRef<HTMLDivElement>(null);
  const hits = React.useMemo(() => searchCatalog(query), [query]);

  React.useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    setQuery("");
    onNavigate?.();
    router.push(href);
  };

  return (
    <div ref={rootRef} className={cn("relative w-full", className)}>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          autoFocus={autoFocus}
          placeholder={
            large
              ? "What do you want to calculate? SIP, EMI, Tax…"
              : compact
                ? "Search…"
                : "Search calculators…"
          }
          className={cn(
            "border-border/70 bg-navy/40 pl-9 text-foreground placeholder:text-muted-foreground",
            large && "h-12 text-base"
          )}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && hits[0]) {
              e.preventDefault();
              go(hits[0].href);
            }
            if (e.key === "Escape") setOpen(false);
          }}
          aria-label="Search calculators"
          autoComplete="off"
        />
      </div>
      {open && query.trim() ? (
        <ul className="absolute z-50 mt-1 max-h-72 w-full overflow-auto rounded-md border border-border bg-popover py-1 shadow-card">
          {hits.length === 0 ? (
            <li className="px-3 py-2 text-sm text-muted-foreground">
              No matches. Try SIP, EMI, PPF, tax…
            </li>
          ) : (
            hits.map((hit) => (
              <li key={hit.href}>
                <button
                  type="button"
                  className="flex w-full flex-col px-3 py-2 text-left hover:bg-gold/10"
                  onClick={() => go(hit.href)}
                >
                  <span className="text-sm font-medium text-foreground">
                    {hit.title}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {hit.category}
                  </span>
                </button>
              </li>
            ))
          )}
          <li className="border-t border-border/60">
            <Link
              href="/calculators"
              className="block px-3 py-2 text-sm text-gold hover:bg-gold/10"
              onClick={() => {
                setOpen(false);
                onNavigate?.();
              }}
            >
              Browse all calculators
            </Link>
          </li>
        </ul>
      ) : null}
    </div>
  );
}
