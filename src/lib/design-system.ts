/**
 * Central design tokens for Aaru Wealth 2.0.
 * Change colours here / in globals.css :root to retheme globally.
 */
export const theme = {
  navy: "#0B1F33",
  slate: "#263746",
  background: "#F8FAFC",
  accent: "#0F766E",
  text: "#17202A",
  muted: "#64748B",
  white: "#FFFFFF",
  border: "#E2E8F0",
  success: "#0F766E",
  warning: "#D97706",
  danger: "#DC2626",
  /* Legacy aliases used across older components */
  primary: "#0B1F33",
  darkBlue: "#0B1F33",
  mediumBlue: "#263746",
  lightBlue: "#F1F5F9",
  veryLightBlue: "#F8FAFC",
  turquoise: "#0F766E",
} as const;

/**
 * Design system section helpers (Tailwind class strings).
 * Prefer these over one-off spacing so future pages stay consistent.
 */
export const ds = {
  page: "space-y-8 sm:space-y-10",
  section: "space-y-4 sm:space-y-5",
  sectionTight: "space-y-3",
  container: "mx-auto w-full max-w-6xl",
  calcGrid: "grid min-w-0 gap-6 lg:grid-cols-2 [&>*]:min-w-0",
  /** Editorial display heading (serif) */
  display:
    "font-serif text-3xl font-normal tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]",
  h1: "font-serif text-2xl font-normal tracking-tight text-foreground sm:text-3xl lg:text-4xl",
  h2: "text-lg font-semibold tracking-tight text-foreground sm:text-xl",
  h3: "text-base font-semibold text-foreground",
  eyebrow: "ds-eyebrow",
  lead: "max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base",
  muted: "text-sm text-muted-foreground",
  label: "text-xs font-semibold uppercase tracking-wide text-muted-foreground",
  panel:
    "rounded-xl border border-border/80 bg-card p-4 shadow-sm sm:p-6",
  cardInteractive:
    "rounded-xl border border-border/80 bg-card shadow-sm transition-colors hover:border-navy/20 hover:shadow-md",
  goalCard:
    "rounded-xl border border-border/80 bg-card p-5 shadow-sm transition-colors hover:border-accent/30 hover:shadow-md",
  resultHero:
    "rounded-xl border border-border bg-navy p-5 text-white shadow-sm sm:p-6",
  alert: "ds-alert",
  alertInfo: "ds-alert-info",
  fieldStack: "space-y-6",
  input:
    "h-11 w-full rounded-md border border-input bg-white px-3 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
  ctaRow: "flex flex-col gap-3 sm:flex-row sm:items-center",
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
  },
} as const;
