import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuideArticle } from "@/components/content/GuideArticle";
import { GUIDES, getGuide } from "@/lib/content/guides";
import { getSiteUrl } from "@/lib/site";
import { SITE_NAME } from "@/lib/brand";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
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
  const guide = getGuide(params.slug);
  if (!guide) notFound();
  return <GuideArticle guide={guide} />;
}
