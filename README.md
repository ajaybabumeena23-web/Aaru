# Indian Finance Calculators

High-performance, client-side financial calculators tailored for the Indian market.

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui-style components
- Recharts, jsPDF, Lucide React

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
  app/
    calculators/[category]/[calculator-slug]/
    sitemap.ts     # /sitemap.xml
    robots.ts      # /robots.txt
    layout.tsx
  components/
    calculators/   # reusable calculator UI
    layout/        # sidebar, nav
    ui/            # shadcn primitives
  lib/
    utils.ts
    site.ts        # NEXT_PUBLIC_SITE_URL helper
  utils/           # financial-math
```

## SEO: Sitemap & Google Search Console

1. Set your live domain (no trailing slash):

```bash
# .env.local or host env
NEXT_PUBLIC_SITE_URL=https://aaruwealth.com
```

2. Deploy, then open:
   - `https://aaruwealth.com/sitemap.xml`
   - `https://aaruwealth.com/robots.txt`

The sitemap includes the home page, 5 category pages, and all 24 calculator URLs.

3. Submit in [Google Search Console](https://search.google.com/search-console):
   - Add property → URL prefix → `https://aaruwealth.com`
   - Verify ownership (HTML tag, DNS, or Google Analytics)
   - **Sitemaps** → enter `sitemap.xml` → **Submit**
