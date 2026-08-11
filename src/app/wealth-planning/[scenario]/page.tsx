import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ScenarioArticle } from "@/components/content/ScenarioArticle";
import { getScenariosForHub, getScenario } from "@/lib/content/scenarios";
import { getSiteUrl } from "@/lib/site";
import { SITE_NAME } from "@/lib/brand";

type Props = { params: { scenario: string } };

const HUB = "wealth-planning";

export function generateStaticParams() {
  return getScenariosForHub(HUB).map((s) => ({ scenario: s.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const s = getScenario(params.scenario);
  if (!s || s.hub !== HUB) return { title: "Scenario" };
  const url = `${getSiteUrl()}/${HUB}/${s.slug}`;
  return {
    title: { absolute: `${s.title} | ${SITE_NAME}` },
    description: s.description,
    alternates: { canonical: url },
    openGraph: { title: s.h1, description: s.description, url },
  };
}

export default function Page({ params }: Props) {
  const s = getScenario(params.scenario);
  if (!s || s.hub !== HUB) notFound();
  return <ScenarioArticle scenario={s} />;
}
