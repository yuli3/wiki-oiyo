import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { siteConfig } from "../../config/site.config";

/**
 * Public machine-citable catalog of every dictionary (definition-layer) entry.
 * This is the "data foundation" index: a stable, source-of-record list of
 * defined terms that humans, other sites, and AI agents can cite.
 *
 * Output: /knowledge/topics.json  — a schema.org DefinedTermSet.
 * Additive endpoint: does not touch any page rendering.
 */
export const GET: APIRoute = async () => {
  const posts = await getCollection("blog", ({ data }) => data.draft !== true);

  const topics = posts
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
    })
    .sort((a, b) => a.id.localeCompare(b.id));

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
    hasDefinedTerm: topics,
  };

  return new Response(JSON.stringify(body, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
