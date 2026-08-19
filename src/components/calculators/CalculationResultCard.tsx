import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type ResultMetric = {
  label: string;
  value: string;
  hint?: string;
  emphasize?: boolean;
};

export type CalculationResultCardProps = {
  title?: string;
  metrics: ResultMetric[];
  children?: React.ReactNode;
  className?: string;
  footer?: React.ReactNode;
  /** Optional badge rendered beside the title (e.g. FIRE goal callout). */
  badge?: React.ReactNode;
};

/**
 * Displays key calculator outputs with a clear primary → secondary hierarchy.
 */
export function CalculationResultCard({
  title = "Results",
  metrics,
  children,
  className,
  footer,
  badge,
}: CalculationResultCardProps) {
  const primary = metrics.find((m) => m.emphasize);
  const secondary = metrics.filter((m) => !m.emphasize);

  return (
    <Card
      className={cn(
        "overflow-hidden border-border/80 shadow-sm",
        className
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center gap-3">
          <CardTitle className="text-lg text-card-foreground">{title}</CardTitle>
          {badge}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {primary ? (
          <div className="rounded-xl border border-navy/20 bg-navy px-3 py-4 text-white sm:px-5 sm:py-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/70">
              {primary.label}
            </p>
            <p className="mt-1 break-words font-serif text-2xl font-normal tracking-tight tabular-nums sm:text-3xl lg:text-4xl">
              {primary.value}
            </p>
            {primary.hint ? (
              <p className="mt-2 text-sm leading-snug text-white/75">{primary.hint}</p>
            ) : null}
          </div>
        ) : null}

        {secondary.length > 0 ? (
          <dl
            className={cn(
              "grid gap-3",
              secondary.length === 1 ? "grid-cols-1" : "sm:grid-cols-2"
            )}
          >
            {secondary.map((m) => (
              <div
                key={m.label}
                className="rounded-lg border border-border/70 bg-secondary/50 px-3 py-3"
              >
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {m.label}
                </dt>
                <dd className="mt-1 break-words text-lg font-semibold tabular-nums text-foreground sm:text-xl">
                  {m.value}
                </dd>
                {m.hint ? (
                  <p className="mt-1 text-xs text-muted-foreground">{m.hint}</p>
                ) : null}
              </div>
            ))}
          </dl>
        ) : null}

        {children}
        {footer}
      </CardContent>
    </Card>
  );
}
