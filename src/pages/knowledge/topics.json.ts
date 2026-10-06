import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { siteConfig } from "../../config/site.config";
// In-repo copy of the route-ownership seed (SSOT: docs/knowledge/topics.json,
// synced via docs/knowledge/sync-seed.sh). Imported so it is bundled at build —
// each repo is built independently on Cloudflare and cannot read outside files.
import seedData from "../../data/knowledge-seed.json";

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

function readWikiSeedTopics(): SeedTopic[] {
  const topics = (seedData as { topics?: SeedTopic[] }).topics ?? [];
  return topics.filter((topic) => topic.definitionOwner === "wiki");
}

function conceptSlug(value: string): string {
  return "meaning-of-" + value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/**
 * Resolve a hub topic to its actual wiki definition page in the SAME locale, if
 * one exists. Tries the topic id then its aliases (e.g. saju → meaning-of-palja).
 * Returns null when no wiki definition exists yet — honest, no fabricated links.
 */
function resolveDefinitionUrl(
  topic: SeedTopic,
  locale: string,
  conceptUrlByLocale: Map<string, Map<string, string>>,
): string | null {
  const localeConcepts = conceptUrlByLocale.get(locale);
  if (!localeConcepts) return null;
  for (const candidate of [topic.id, ...(topic.aliases ?? [])]) {
    const url = localeConcepts.get(conceptSlug(candidate));
    if (url) return url;
  }
  return null;
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

  // Per-locale concept → URL index, used to link hub nodes to their actual wiki
  // definition page (e.g. hub "saju" → /<locale>/meaning-of-palja/).
  const conceptUrlByLocale = new Map<string, Map<string, string>>();
  for (const topic of dictionaryTopics) {
    let m = conceptUrlByLocale.get(topic.locale);
    if (!m) conceptUrlByLocale.set(topic.locale, (m = new Map()));
    m.set(topic.concept, topic.url);
  }

  // 2026-10-06 (audit S4 / 2026-09-28 P0-4): the route-ownership seed used to be
  // emitted here as DefinedTerm rows with `definition: null` and a reviewer
  // string the editorial test classifies as fake authority, so an empty wiki
  // advertised 60 "source-cited" definitions. Ownership rows are routing data,
  // not definitions: they now live under `topicOwnership`, and `hasDefinedTerm`
  // only lists terms that have a published page with a definition.
  const seedUpdatedDate = "2026-06-14";
  const topicOwnership = readWikiSeedTopics()
    .filter((topic) => !existingConcepts.has(topic.id))
    .map((topic) => {
      const definitionUrls = Object.fromEntries(
        Object.keys(topic.name ?? {})
          .map((locale) => [locale, resolveDefinitionUrl(topic, locale, conceptUrlByLocale)] as const)
          .filter(([, url]) => url !== null),
      );
      return {
        topicId: topic.id,
        names: topic.name ?? {},
        aliases: topic.aliases ?? [],
        relatedTopicIds: topic.relatedTopicIds ?? [],
        primaryOwner: topic.primaryOwner ?? null,
        definitionOwner: topic.definitionOwner ?? null,
        explanationOwner: topic.explanationOwner ?? null,
        marketPolicy: topic.marketPolicy ?? null,
        routeIds: topic.routeIds ?? [],
        definitionUrls,
        seedUpdated: seedUpdatedDate,
      };
    })
    .sort((a, b) => a.topicId.localeCompare(b.topicId));

  const topics = dictionaryTopics
    .filter((topic) => typeof topic.definition === "string" && topic.definition.trim().length > 0)
    .sort((a, b) => a.id.localeCompare(b.id));

  const body = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: `${siteConfig.name} — Knowledge Catalog`,
    url: `${siteConfig.url}/knowledge/topics.json`,
    description:
      topics.length > 0
        ? "Catalog of defined terms published on Oiyo Wiki, each with its definition and a stable canonical URL. topicOwnership lists which Oiyo site owns each topic."
        : "No defined terms are published on Oiyo Wiki at this time, so hasDefinedTerm is empty. topicOwnership is routing data only: it lists which Oiyo site owns each topic and carries no definitions.",
    publisher: { "@type": "Organization", name: siteConfig.seo.organization.name },
    license: `${siteConfig.url}/en/about`,
    dateModified: new Date().toISOString(),
    count: topics.length,
    hubCount: topicOwnership.length,
    hasDefinedTerm: topics,
    topicOwnership,
  };

  return new Response(JSON.stringify(body, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
