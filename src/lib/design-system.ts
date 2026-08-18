/**
 * Central design tokens for Aaru Wealth.
 * Change colours here / in globals.css :root to retheme globally.
 */
export const theme = {
  primary: "#0B5ED7",
  darkBlue: "#083B7A",
  mediumBlue: "#3B82F6",
  lightBlue: "#EAF3FF",
  veryLightBlue: "#F5F9FF",
  white: "#FFFFFF",
  text: "#172033",
  muted: "#667085",
  success: "#198754",
  warning: "#F59E0B",
  danger: "#DC3545",
  border: "#D0D5DD",
} as const;

/**
 * Design system section helpers (Tailwind class strings).
 * Prefer these over one-off spacing.
 */
export const ds = {
  page: "space-y-8 sm:space-y-10",
  section: "space-y-4 sm:space-y-5",
  sectionTight: "space-y-3",
  container: "mx-auto w-full max-w-6xl",
  calcGrid: "grid gap-6 lg:grid-cols-2",
  h1: "text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl",
  h2: "text-lg font-semibold tracking-tight text-foreground sm:text-xl",
  h3: "text-base font-semibold text-foreground",
  lead: "max-w-2xl text-sm text-muted-foreground sm:text-base",
  muted: "text-sm text-muted-foreground",
  label: "text-xs font-semibold uppercase tracking-wide text-muted-foreground",
  panel:
    "rounded-xl border border-border/80 bg-card p-4 shadow-sm sm:p-6",
  cardInteractive:
    "rounded-lg border border-border/80 bg-card shadow-sm transition-colors hover:border-primary/40 hover:shadow-md",
  fieldStack: "space-y-6",
  input:
    "h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground",
  ctaRow: "flex flex-col gap-3 sm:flex-row sm:items-center",
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
  },
} as const;
