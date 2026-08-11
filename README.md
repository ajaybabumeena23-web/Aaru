# Aaru Wealth

Smart financial tools for India — free SIP, EMI, tax, retirement and government scheme calculators.

**Site:** https://aaruwealth.com

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Recharts, jsPDF, Lucide React

## Getting Started

```bash
npm install
npm run dev
```

Set `NEXT_PUBLIC_SITE_URL=https://aaruwealth.com` for production sitemap/OG URLs.

## SEO

- `/sitemap.xml` — home, trust pages, categories, all calculators
- `/robots.txt`
- Organization + WebSite JSON-LD

## Structure

```
src/app/                 # routes (calculators, about, disclaimer, …)
src/components/layout/   # header, footer, search
src/utils/financial-math # pure calculation engine
```
