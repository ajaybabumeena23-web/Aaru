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
 * Displays key calculator outputs (maturity, interest, EMI, etc.).
 */
export function CalculationResultCard({
  title = "Results",
  metrics,
  children,
  className,
  footer,
  badge,
}: CalculationResultCardProps) {
  return (
    <Card
      className={cn(
        "overflow-hidden illustrative-gradient border-border/70 shadow-card",
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
        <dl className="grid gap-3 sm:grid-cols-2">
          {metrics.map((m) => (
            <div
              key={m.label}
              className={cn(
                "rounded-md border border-border/60 bg-navy/40 px-3 py-3",
                m.emphasize &&
                  "border-gold/40 bg-gold/5 sm:col-span-2 shadow-[inset_0_0_0_1px_rgba(247,198,21,0.08)]"
              )}
            >
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {m.label}
              </dt>
              <dd
                className={cn(
                  "mt-1 font-semibold tabular-nums",
                  m.emphasize
                    ? "text-3xl text-gold sm:text-4xl"
                    : "text-xl text-card-foreground"
                )}
              >
                {m.value}
              </dd>
              {m.hint ? (
                <p className="mt-1 text-xs text-muted-foreground">{m.hint}</p>
              ) : null}
            </div>
          ))}
        </dl>
        {children}
        {footer}
      </CardContent>
    </Card>
  );
}
