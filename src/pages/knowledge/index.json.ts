import type { APIRoute } from "astro";
import { siteConfig } from "../../config/site.config";

/**
 * Discovery manifest for the knowledge foundation.
 * Output: /knowledge/index.json — a single entry point that lists the
 * machine-citable catalogs available on this site.
 */
export const GET: APIRoute = async () => {
  const base = siteConfig.url;
  const body = {
    name: `${siteConfig.name} — Knowledge Foundation`,
    role: "definition",
    description:
      "Machine-citable, source-cited reference data for astrology, saju, tarot, personality, psychology and related domains. The definition layer of the Oiyo knowledge network.",
    publisher: { name: siteConfig.seo.organization.name, url: base },
    locales: siteConfig.locales,
    resources: {
      topics: {
        url: `${base}/knowledge/topics.json`,
        description: "DefinedTermSet: every dictionary term with definition, sources, locale.",
      },
      relations: {
        url: `${base}/knowledge/relations.json`,
        description: "Concept graph: series/topic cluster memberships and cross-locale translations.",
      },
      feed: { url: `${base}/rss.xml`, description: "Recent updates feed." },
      sitemap: { url: `${base}/sitemap-index.xml`, description: "Full URL index." },
    },
    network: {
      description: "Part of the Oiyo knowledge network (definitions · explanations · tools).",
      sites: [
        { role: "definition", name: "Oiyo Wiki", url: "https://wiki.oiyo.net", knowledge: "https://wiki.oiyo.net/knowledge/index.json" },
        { role: "explanation", name: "Oiyo Blog", url: "https://blog.oiyo.net", knowledge: "https://blog.oiyo.net/knowledge/index.json" },
        { role: "execution", name: "Oiyo", url: "https://oiyo.net", knowledge: "https://oiyo.net/knowledge/index.json" },
      ],
    },
    citation:
      "Cite individual terms by their stable URL (see topics.json `url`). Attribution: Oiyo Wiki (wiki.oiyo.net).",
    dateModified: new Date().toISOString(),
  };

  return new Response(JSON.stringify(body, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
