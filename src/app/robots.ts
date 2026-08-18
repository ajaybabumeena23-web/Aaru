import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

/**
 * Allow valuable public content. Calculator query-string state is de-duplicated
 * via self-referencing canonicals on calculator pages (not blocked here, so
 * CSS/JS and share links stay crawlable when needed).
 */
export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/static/chunks/pages/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
