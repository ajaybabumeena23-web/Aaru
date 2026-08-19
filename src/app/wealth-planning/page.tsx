import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TopicHubView } from "@/components/content/TopicHubView";
import { getTopic } from "@/lib/content/topics";
import { buildTopicMetadata } from "@/lib/topic-seo";

const SLUG = "wealth-planning";

export function generateMetadata(): Metadata {
  return buildTopicMetadata(SLUG);
}

export default function Page() {
  const topic = getTopic(SLUG);
  if (!topic) notFound();
  return <TopicHubView slug={SLUG} />;
}
