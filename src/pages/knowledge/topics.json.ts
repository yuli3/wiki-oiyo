import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { siteConfig } from "../../config/site.config";

/**
 * Public machine-citable catalog of every dictionary (definition-layer) entry.
 * This is the "data foundation" index: a stable, source-of-record list of
 * defined terms that humans, other sites, and AI agents can cite.
 *
 * Output: /knowledge/topics.json  — a schema.org DefinedTermSet.
 * Additive endpoint: does not touch any page rendering.
 */
type SeedTopic = {
  id: string;
  name?: Record<string, string>;
  definitionOwner?: string;
  primaryOwner?: string;
  explanationOwner?: string;
  marketPolicy?: string;
  aliases?: string[];
  routeIds?: string[];
  relatedTopicIds?: string[];
};

const SEED_TOPIC_PATH = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../../../../docs/knowledge/topics.json",
);

function readWikiSeedTopics(): SeedTopic[] {
  try {
    const parsed = JSON.parse(readFileSync(SEED_TOPIC_PATH, "utf-8")) as { topics?: SeedTopic[] };
    return parsed.topics?.filter((topic) => topic.definitionOwner === "wiki") ?? [];
  } catch (error) {
    console.warn(`[knowledge/topics] failed to read seed topics: ${String(error)}`);
    return [];
  }
}

export const GET: APIRoute = async () => {
  const posts = await getCollection("blog", ({ data }) => data.draft !== true);

  const dictionaryTopics = posts
    .filter((p) => p.data.track === "dictionary")
    .map((p) => {
      const localeFromSlug = p.slug.split("/")[0];
      const concept = p.slug.split("/").slice(1).join("/"); // slug without locale prefix
      const modified = p.data.reviewedDate ?? p.data.updatedDate ?? p.data.pubDate;
      return {
        id: p.slug,
        concept,
        url: new URL(`/${p.slug}/`, siteConfig.url).href,
        term: p.data.title,
        definition: p.data.definition ?? p.data.description,
        category: p.data.category ?? null,
        series: p.data.series ?? null,
        locale: p.data.locale ?? localeFromSlug,
        tags: p.data.tags ?? [],
        relatedTerms: p.data.relatedTerms ?? [],
        broader: p.data.broader ?? null,
        narrower: p.data.narrower ?? [],
        author: p.data.author ?? "Oiyo",
        reviewer: p.data.reviewer ?? null,
        datePublished: p.data.pubDate?.toISOString().slice(0, 10) ?? null,
        dateModified: modified?.toISOString().slice(0, 10) ?? null,
      };
    });

  const existingConcepts = new Set(dictionaryTopics.map((topic) => topic.concept));
  const seedUpdatedDate = "2026-06-14";
  const hubTopics = readWikiSeedTopics()
    .filter((topic) => !existingConcepts.has(topic.id))
    .flatMap((topic) =>
      Object.entries(topic.name ?? {}).map(([locale, term]) => ({
        id: `hub/${locale}/${topic.id}`,
        concept: topic.id,
        url: `${siteConfig.url}/knowledge/topics.json#${topic.id}`,
        term,
        definition: null,
        category: "hub",
        series: null,
        locale,
        tags: topic.aliases ?? [],
        relatedTerms: topic.relatedTopicIds ?? [],
        broader: null,
        narrower: [],
        author: "Oiyo",
        reviewer: "OIYO Research Institute",
        datePublished: seedUpdatedDate,
        dateModified: seedUpdatedDate,
        isHub: true,
        source: {
          primaryOwner: topic.primaryOwner ?? null,
          definitionOwner: topic.definitionOwner ?? null,
          explanationOwner: topic.explanationOwner ?? null,
          marketPolicy: topic.marketPolicy ?? null,
          routeIds: topic.routeIds ?? [],
        },
      })),
    );

  const topics = [...dictionaryTopics, ...hubTopics].sort((a, b) => a.id.localeCompare(b.id));

  const body = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: `${siteConfig.name} — Knowledge Catalog`,
    url: `${siteConfig.url}/knowledge/topics.json`,
    description:
      "Canonical, source-cited catalog of defined terms across astrology, saju, tarot, personality, psychology and more. Stable identifiers for human and machine citation.",
    publisher: { "@type": "Organization", name: siteConfig.seo.organization.name },
    license: `${siteConfig.url}/en/about`,
    dateModified: new Date().toISOString(),
    count: topics.length,
    hubCount: hubTopics.length,
    hasDefinedTerm: topics,
  };

  return new Response(JSON.stringify(body, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
