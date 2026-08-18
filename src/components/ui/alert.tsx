import * as React from "react";
import { cn } from "@/lib/utils";

type AlertVariant = "default" | "info" | "warning";

const variantClass: Record<AlertVariant, string> = {
  default: "border-border bg-secondary/80",
  info: "border-accent/20 bg-accent/5",
  warning: "border-amber-500/25 bg-amber-50",
};

export function AlertBox({
  title,
  children,
  variant = "default",
  className,
}: {
  title?: string;
  children: React.ReactNode;
  variant?: AlertVariant;
  className?: string;
}) {
  return (
    <div
      role="note"
      className={cn(
        "rounded-lg border px-4 py-3 text-sm text-foreground",
        variantClass[variant],
        className
      )}
    >
      {title ? (
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
        </p>
      ) : null}
      <div className="leading-relaxed text-foreground/90">{children}</div>
    </div>
  );
}

export function GoalCardShell({
  eyebrow,
  title,
  description,
  className,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border/80 bg-card p-5 shadow-sm transition-colors hover:border-accent/30 hover:shadow-md",
        className
      )}
    >
      {eyebrow ? <p className="ds-eyebrow mb-2">{eyebrow}</p> : null}
      <h3 className="font-serif text-lg font-normal tracking-tight text-foreground">
        {title}
      </h3>
      {description ? (
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
      {children}
    </div>
  );
}
