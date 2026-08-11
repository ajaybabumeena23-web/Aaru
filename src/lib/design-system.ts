/**
 * Design tokens & section helpers for Aaru Wealth UI.
 * Prefer these classes over one-off spacing.
 */

export const ds = {
  /** Vertical rhythm for a full page */
  page: "space-y-8 sm:space-y-10",
  /** Standard content section */
  section: "space-y-4 sm:space-y-5",
  sectionTight: "space-y-3",
  /** Max-width content column (rare — layout already constrains) */
  container: "mx-auto w-full max-w-6xl",
  /** Calculator input | results split */
  calcGrid: "grid gap-6 lg:grid-cols-2",
  /** Typography */
  h1: "text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl",
  h2: "text-lg font-semibold tracking-tight text-foreground sm:text-xl",
  h3: "text-base font-semibold text-foreground",
  lead: "max-w-2xl text-sm text-muted-foreground sm:text-base",
  muted: "text-sm text-muted-foreground",
  label: "text-xs font-semibold uppercase tracking-wide text-muted-foreground",
  /** Surfaces */
  panel:
    "rounded-xl border border-border/70 bg-card/80 p-4 sm:p-6 illustrative-gradient",
  cardInteractive:
    "rounded-lg border border-border/70 bg-card/80 transition-colors hover:border-gold/40",
  /** Forms */
  fieldStack: "space-y-6",
  input:
    "h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground",
  /** CTAs */
  ctaRow: "flex flex-col gap-3 sm:flex-row sm:items-center",
  /** Breakpoint notes (documentation only — use Tailwind in className) */
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
  },
} as const;
