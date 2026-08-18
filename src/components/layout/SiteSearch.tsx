"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { CALCULATOR_CATEGORIES } from "@/lib/calculators";
import { GUIDES } from "@/lib/content/guides";
import { GLOSSARY } from "@/lib/content/glossary";
import { TOPIC_HUBS } from "@/lib/content/topics";
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
      const hay =
        `${calc.title} ${calc.h1} ${calc.description} ${category.label}`.toLowerCase();
      if (hay.includes(q)) {
        hits.push({
          href: `/calculators/${category.id}/${calc.slug}`,
          title: calc.title,
          category: "Calculator",
        });
      }
    }
  }

  for (const topic of TOPIC_HUBS) {
    const hay = `${topic.title} ${topic.h1} ${topic.description}`.toLowerCase();
    if (hay.includes(q)) {
      hits.push({
        href: `/${topic.slug}`,
        title: `${topic.title} hub`,
        category: "Topic",
      });
    }
  }

  for (const guide of GUIDES) {
    const hay =
      `${guide.title} ${guide.description} ${guide.category}`.toLowerCase();
    if (hay.includes(q)) {
      hits.push({
        href: `/guides/${guide.slug}`,
        title: guide.title,
        category: "Guide",
      });
    }
  }

  for (const term of GLOSSARY) {
    const hay = `${term.term} ${term.short} ${term.definition}`.toLowerCase();
    if (hay.includes(q)) {
        hits.push({
          href: `/glossary/${term.slug}`,
          title: term.term,
          category: "Glossary",
        });
    }
  }

  // Prefer calculators, then topics, then guides
  const rank = (c: string) =>
    c === "Calculator" ? 0 : c === "Topic" ? 1 : c === "Guide" ? 2 : 3;
  hits.sort((a, b) => rank(a.category) - rank(b.category));
  return hits.slice(0, 10);
}

export function SiteSearch({
  onNavigate,
  compact,
  className,
  autoFocus,
  large,
  placeholder,
}: {
  onNavigate?: () => void;
  compact?: boolean;
  className?: string;
  autoFocus?: boolean;
  large?: boolean;
  placeholder?: string;
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

  const resolvedPlaceholder =
    placeholder ??
    (large
      ? "Search calculators, guides, glossary…"
      : compact
        ? "Search…"
        : "Search calculators & guides…");

  return (
    <div ref={rootRef} className={cn("relative w-full", className)}>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          autoFocus={autoFocus}
          placeholder={resolvedPlaceholder}
          className={cn(
            "border-border bg-white pl-9 text-foreground placeholder:text-muted-foreground",
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
          aria-label="Search site"
        />
      </div>
      {open && query.trim() && (
        <ul className="absolute z-50 mt-1 max-h-80 w-full overflow-auto rounded-lg border border-border bg-white py-1 shadow-xl">
          {hits.length === 0 ? (
            <li className="px-3 py-2 text-sm text-muted-foreground">
              No matches
            </li>
          ) : (
            hits.map((hit) => (
              <li key={`${hit.category}-${hit.href}`}>
                <button
                  type="button"
                  className="flex w-full flex-col items-start gap-0.5 px-3 py-2 text-left text-sm hover:bg-secondary"
                  onClick={() => go(hit.href)}
                >
                  <span className="font-medium text-foreground">{hit.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {hit.category}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
