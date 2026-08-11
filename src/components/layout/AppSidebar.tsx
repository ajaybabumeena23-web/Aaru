"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calculator, ChevronDown, Menu, X } from "lucide-react";
import { CALCULATOR_CATEGORIES } from "@/lib/calculators";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState<Record<string, boolean>>(() =>
    Object.fromEntries(CALCULATOR_CATEGORIES.map((c) => [c.id, true]))
  );

  return (
    <nav className="space-y-1 px-2 pb-8">
      <Link
        href="/"
        onClick={onNavigate}
        className={cn(
          "mb-3 flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
          pathname === "/"
            ? "bg-gold/15 text-gold ring-1 ring-gold/30"
            : "text-[hsl(var(--sidebar-foreground))] hover:bg-white/5 hover:text-gold"
        )}
      >
        <Calculator className="h-4 w-4" />
        All Calculators
      </Link>

      {CALCULATOR_CATEGORIES.map((category) => {
        const Icon = category.icon;
        const isOpen = open[category.id];
        const categoryActive = pathname.startsWith(
          `/calculators/${category.id}`
        );

        return (
          <div key={category.id} className="mb-1">
            <button
              type="button"
              onClick={() =>
                setOpen((prev) => ({ ...prev, [category.id]: !prev[category.id] }))
              }
              className={cn(
                "flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-semibold transition-colors",
                categoryActive
                  ? "text-white"
                  : "text-[hsl(var(--sidebar-foreground))] hover:bg-white/5"
              )}
            >
              <Icon className="h-4 w-4 shrink-0 opacity-80" />
              <span className="flex-1 truncate">{category.label}</span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 shrink-0 opacity-60 transition-transform",
                  isOpen && "rotate-180"
                )}
              />
            </button>

            {isOpen ? (
              <ul className="ml-3 space-y-0.5 border-l border-white/10 pl-2">
                {category.calculators.map((calc) => {
                  const href = `/calculators/${category.id}/${calc.slug}`;
                  const active = pathname === href;
                  return (
                    <li key={calc.slug}>
                      <Link
                        href={href}
                        onClick={onNavigate}
                        className={cn(
                          "block rounded-md px-2.5 py-1.5 text-sm transition-colors",
                          active
                            ? "bg-gold/15 font-medium text-gold ring-1 ring-gold/25"
                            : "text-[hsl(var(--sidebar-muted))] hover:bg-white/5 hover:text-[hsl(var(--sidebar-foreground))]"
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
    </nav>
  );
}

export function AppSidebar() {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <>
      <div className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b bg-background px-4 lg:hidden">
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Open navigation"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2 font-semibold">
          <Calculator className="h-5 w-5 text-gold" />
          Aaru Wealth
        </div>
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label="Close navigation overlay"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-72 flex-col bg-[hsl(var(--sidebar))] text-[hsl(var(--sidebar-foreground))] shadow-xl">
            <div className="flex h-14 items-center justify-between border-b border-white/10 px-4">
              <span className="font-semibold text-gold">Aaru Wealth</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
                aria-label="Close navigation"
                onClick={() => setMobileOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto py-3">
              <NavLinks onNavigate={() => setMobileOpen(false)} />
            </div>
          </aside>
        </div>
      ) : null}

      <aside className="hidden w-72 shrink-0 flex-col border-r border-white/10 bg-[hsl(var(--sidebar))] text-[hsl(var(--sidebar-foreground))] lg:flex">
        <div className="flex h-16 items-center gap-2 border-b border-white/10 px-5">
          <Calculator className="h-5 w-5 text-gold" />
          <div>
            <p className="font-semibold leading-tight text-gold">Aaru Wealth</p>
            <p className="text-xs text-[hsl(var(--sidebar-muted))]">
              Indian finance tools
            </p>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto py-3">
          <NavLinks />
        </div>
      </aside>
    </>
  );
}
