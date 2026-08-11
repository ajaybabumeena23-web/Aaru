import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SITE_NAME } from "@/lib/brand";

export function TrustPage({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <article className="prose-invert mx-auto max-w-3xl space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      {description ? (
        <p className="text-muted-foreground">{description}</p>
      ) : null}
      <div className="space-y-4 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {children}
      </div>
      <p className="border-t border-border/60 pt-6 text-xs text-muted-foreground">
        Last reviewed: August 2026 · {SITE_NAME}
      </p>
    </article>
  );
}

export function trustMetadata(
  title: string,
  description: string,
  path: string
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
  };
}
