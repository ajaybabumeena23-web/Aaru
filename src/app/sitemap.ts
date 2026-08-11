import type { MetadataRoute } from "next";
import { CALCULATOR_CATEGORIES } from "@/lib/calculators";
import { getSiteUrl } from "@/lib/site";

const TRUST_PATHS = [
  "/about",
  "/methodology",
  "/editorial-policy",
  "/disclaimer",
  "/privacy",
  "/terms",
  "/contact",
  "/calculators",
];

export default function sitemap(): MetadataRoute.Sitemap {
  try {
    const base = getSiteUrl();
    const lastModified = new Date();

    const staticRoutes: MetadataRoute.Sitemap = [
      {
        url: base,
        lastModified,
        changeFrequency: "weekly",
        priority: 1,
      },
      ...TRUST_PATHS.map((path) => ({
        url: `${base}${path}`,
        lastModified,
        changeFrequency: "monthly" as const,
        priority: path === "/calculators" ? 0.9 : 0.4,
      })),
    ];

    const categoryRoutes: MetadataRoute.Sitemap = CALCULATOR_CATEGORIES.map(
      (category) => ({
        url: `${base}/calculators/${category.id}`,
        lastModified,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })
    );

    const calculatorRoutes: MetadataRoute.Sitemap =
      CALCULATOR_CATEGORIES.flatMap((category) =>
        category.calculators.map((calc) => ({
          url: `${base}/calculators/${category.id}/${calc.slug}`,
          lastModified,
          changeFrequency: "monthly" as const,
          priority: 0.7,
        }))
      );

    return [...staticRoutes, ...categoryRoutes, ...calculatorRoutes];
  } catch {
    // Never 500 the sitemap endpoint — return at least the homepage.
    return [
      {
        url: "https://aaruwealth.com",
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 1,
      },
    ];
  }
}
