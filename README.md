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
    layout.tsx
  components/
    calculators/   # reusable calculator UI
    layout/        # sidebar, nav
    ui/            # shadcn primitives
  lib/
    utils.ts
  utils/           # financial-math (Step 3)
```
