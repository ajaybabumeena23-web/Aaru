import { cn, formatPercent } from "@/lib/utils";

export type SensitivityBand = {
  label: string;
  /** e.g. "8%" or "10 yrs" */
  hint: string;
  /** Formatted primary value */
  value: string;
  /** Highlight the user's current assumption */
  emphasize?: boolean;
  /** Optional secondary line under the value */
  sub?: string;
};

export type SensitivityBandsProps = {
  title?: string;
  /** What is being varied, e.g. "Expected return (p.a.)" */
  parameterLabel: string;
  bands: SensitivityBand[];
  footnote?: string;
  className?: string;
};

/**
 * Side-by-side what-if bands (typically rate ± Δ).
 * Values must come from re-running the existing math engine.
 */
export function SensitivityBands({
  title = "Sensitivity",
  parameterLabel,
  bands,
  footnote = "Compare assumptions — markets and rates can differ from any scenario.",
  className,
}: SensitivityBandsProps) {
  if (bands.length === 0) return null;

  return (
    <section
      className={cn(
        "rounded-xl border border-border/80 bg-card p-4 shadow-sm sm:p-5",
        className
      )}
      aria-label={title}
    >
      <div className="mb-3 space-y-1">
        <h3 className="text-sm font-semibold tracking-tight text-foreground">
          {title}
        </h3>
        <p className="text-xs text-muted-foreground">
          How the result changes when{" "}
          <span className="font-medium text-foreground/80">{parameterLabel}</span>{" "}
          moves
        </p>
      </div>

      <div
        className={cn(
          "grid gap-2",
          bands.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"
        )}
      >
        {bands.map((b) => (
          <div
            key={`${b.label}-${b.hint}`}
            className={cn(
              "rounded-lg border px-3 py-3",
              b.emphasize
                ? "border-accent/40 bg-accent/5 shadow-sm"
                : "border-border/70 bg-secondary/40"
            )}
          >
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              {b.label}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">{b.hint}</p>
            <p
              className={cn(
                "mt-2 text-lg font-semibold tabular-nums tracking-tight",
                b.emphasize ? "text-accent" : "text-foreground"
              )}
            >
              {b.value}
            </p>
            {b.sub ? (
              <p className="mt-1 text-xs text-muted-foreground">{b.sub}</p>
            ) : null}
          </div>
        ))}
      </div>

      {footnote ? (
        <p className="mt-3 text-xs text-muted-foreground">{footnote}</p>
      ) : null}
    </section>
  );
}

/** Format a rate band hint consistently. */
export function rateBandHint(ratePct: number): string {
  return formatPercent(ratePct, ratePct % 1 === 0 ? 0 : 1);
}
