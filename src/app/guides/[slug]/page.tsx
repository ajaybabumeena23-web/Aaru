import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuideArticle } from "@/components/content/GuideArticle";
import { GuideCategoryView } from "@/components/content/GuideCategoryView";
import { GUIDES, getGuide } from "@/lib/content/guides";
import {
  GUIDE_CATEGORIES,
  getGuideCategory,
} from "@/lib/content/guide-categories";
import { getSiteUrl } from "@/lib/site";
import { SITE_NAME } from "@/lib/brand";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return [
    ...GUIDES.map((g) => ({ slug: g.slug })),
    ...GUIDE_CATEGORIES.map((c) => ({ slug: c.slug })),
  ];
}

export function generateMetadata({ params }: Props): Metadata {
  const category = getGuideCategory(params.slug);
  if (category) {
    const url = `${getSiteUrl()}/guides/${category.slug}`;
    return {
      title: { absolute: `${category.title} | ${SITE_NAME}` },
      description: category.description,
      alternates: { canonical: url },
      openGraph: {
        title: category.title,
        description: category.description,
        url,
        type: "website",
      },
    };
  }

  const guide = getGuide(params.slug);
  if (!guide) return { title: "Guide" };
  const url = `${getSiteUrl()}/guides/${guide.slug}`;
  return {
    title: { absolute: `${guide.title} | ${SITE_NAME}` },
    description: guide.description,
    alternates: { canonical: url },
    openGraph: {
      title: guide.title,
      description: guide.description,
      url,
      type: "article",
    },
  };
}

export default function GuidePage({ params }: Props) {
  const category = getGuideCategory(params.slug);
  if (category) return <GuideCategoryView category={category} />;

  const guide = getGuide(params.slug);
  if (!guide) notFound();
  return <GuideArticle guide={guide} />;
}
