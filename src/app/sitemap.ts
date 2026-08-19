import type { MetadataRoute } from "next";
import { CALCULATOR_CATEGORIES } from "@/lib/calculators";
import { GUIDES } from "@/lib/content/guides";
import { GUIDE_CATEGORIES } from "@/lib/content/guide-categories";
import { TOPIC_HUBS } from "@/lib/content/topics";
import { SCENARIOS } from "@/lib/content/scenarios";
import { GLOSSARY } from "@/lib/content/glossary";
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
  "/guides",
  "/glossary",
  "/topics",
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
        priority:
          path === "/calculators" || path === "/guides" ? 0.9 : 0.4,
      })),
    ];

    const topicRoutes: MetadataRoute.Sitemap = TOPIC_HUBS.map((t) => ({
      url: `${base}/${t.slug}`,
      lastModified,
      changeFrequency: "weekly" as const,
      /* Core money hubs rank slightly above niche hubs */
      priority: ["sip", "loans", "income-tax", "retirement", "wealth-planning"].includes(
        t.slug
      )
        ? 0.9
        : 0.85,
    }));

    const scenarioRoutes: MetadataRoute.Sitemap = SCENARIOS.map((s) => ({
      url: `${base}/${s.hub}/${s.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.65,
    }));

    const guideCategoryRoutes: MetadataRoute.Sitemap = GUIDE_CATEGORIES.map(
      (c) => ({
        url: `${base}/guides/${c.slug}`,
        lastModified,
        changeFrequency: "weekly" as const,
        priority: 0.75,
      })
    );

    const guideRoutes: MetadataRoute.Sitemap = GUIDES.map((g) => ({
      url: `${base}/guides/${g.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

    const glossaryRoutes: MetadataRoute.Sitemap = GLOSSARY.map((t) => ({
      url: `${base}/glossary/${t.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.55,
    }));

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

    return [
      ...staticRoutes,
      ...topicRoutes,
      ...scenarioRoutes,
      ...guideCategoryRoutes,
      ...guideRoutes,
      ...glossaryRoutes,
      ...categoryRoutes,
      ...calculatorRoutes,
    ];
  } catch {
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
