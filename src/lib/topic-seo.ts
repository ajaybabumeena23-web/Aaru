import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/brand";
import { getTopic } from "@/lib/content/topics";
import { getAliasForCanonical } from "@/lib/hub-aliases";
import { getSiteUrl } from "@/lib/site";

/**
 * Shared metadata for topic hub pages.
 * Canonical always points at /{slug} — never at an alias path.
 */
export function buildTopicMetadata(slug: string): Metadata {
  const topic = getTopic(slug);
  if (!topic) return { title: "Topic" };

  const base = getSiteUrl();
  const url = `${base}/${slug}`;
  const title = `${topic.title} — Calculators, Guides & Planning | ${SITE_NAME}`;
  const description = topic.description;
  const alias = getAliasForCanonical(slug);

  return {
    title: { absolute: title },
    description,
    keywords: [
      topic.title,
      `${topic.title} calculator India`,
      "personal finance India",
      SITE_NAME,
      ...(alias ? [alias.label] : []),
    ],
    alternates: { canonical: url },
    openGraph: {
      title: topic.h1,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title: topic.h1,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
