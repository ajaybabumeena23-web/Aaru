import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TopicHubView } from "@/components/content/TopicHubView";
import { getTopic } from "@/lib/content/topics";
import { getSiteUrl } from "@/lib/site";
import { SITE_NAME } from "@/lib/brand";

const SLUG = "sip";

export function generateMetadata(): Metadata {
  const topic = getTopic(SLUG);
  if (!topic) return { title: "Topic" };
  const url = `${getSiteUrl()}/sip`;
  return {
    title: { absolute: `${topic.title} | ${SITE_NAME}` },
    description: topic.description,
    alternates: { canonical: url },
    openGraph: { title: topic.h1, description: topic.description, url },
  };
}

export default function Page() {
  const topic = getTopic(SLUG);
  if (!topic) notFound();
  return <TopicHubView slug={SLUG} />;
}
