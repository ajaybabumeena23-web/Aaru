"use client";

import { Suspense, type ReactNode } from "react";
import Link from "next/link";

export type CalculatorPageLayoutProps = {
  categoryHref: string;
  categoryLabel: string;
  crumb: string;
  title: string;
  description: string;
  children: ReactNode;
};

export function CalculatorPageLayout({
  categoryHref,
  categoryLabel,
  crumb,
  title,
  description,
  children,
}: CalculatorPageLayoutProps) {
  return (
    <div className="space-y-6">
      <nav className="text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href={categoryHref} className="hover:text-foreground">
          {categoryLabel}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{crumb}</span>
      </nav>

      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h1>
        <p className="max-w-2xl text-muted-foreground">{description}</p>
      </header>

      {children}
    </div>
  );
}

export function withCalculatorSuspense(node: ReactNode) {
  return (
    <Suspense
      fallback={
        <div className="text-sm text-muted-foreground">Loading calculator…</div>
      }
    >
      {node}
    </Suspense>
  );
}
