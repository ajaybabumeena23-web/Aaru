import type { MetadataRoute } from "next";
import { CALCULATOR_CATEGORIES } from "@/lib/calculators";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: base,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
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
}
