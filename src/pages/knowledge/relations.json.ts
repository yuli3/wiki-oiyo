import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { siteConfig } from "../../config/site.config";
// In-repo copy of the route-ownership seed (see topics.json.ts / sync-seed.sh).
import seedData from "../../data/knowledge-seed.json";

/**
 * Public concept graph for the dictionary (definition) layer.
 * Output: /knowledge/relations.json
 *
 * Edges are expressed compactly to stay O(n):
 *  - sets:    cluster memberships (same series, or same mystic topic, per locale)
 *  - sameAs:  cross-locale translation tuples (same concept, different language)
 *  - hubs:    cross-site concept ownership graph (which site owns the definition,
 *             explanation and execution of each top-level topic) + topic↔topic
 *             relations, sourced from the route-ownership seed.
 *
 * Consumers can derive pairwise relations from set membership. This keeps the
 * file small even when a series has hundreds of members.
 */

type SeedTopic = {
  id: string;
  name?: Record<string, string>;
  primaryOwner?: string;
  definitionOwner?: string;
  explanationOwner?: string;
  marketPolicy?: string;
  aliases?: string[];
  routeIds?: string[];
  relatedTopicIds?: string[];
};

function readAllSeedTopics(): SeedTopic[] {
  return (seedData as { topics?: SeedTopic[] }).topics ?? [];
}

function conceptSlug(value: string): string {
  return "meaning-of-" + value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// Mystic topic inference from slug (mirrors src/config/mystic-trinity.json topics).
const TOPIC_PATTERNS: [string, RegExp][] = [
  ["chinese-zodiac", /chinese-zodiac|zodiac-animal|\bsibijisin\b/],
  ["saju", /\bsaju\b|four-pillars|palja|four-pillar/],
  ["tarot", /\btarot\b|major-arcana|minor-arcana/],
  ["astrology", /astrolog|birth-chart|natal|horoscope|planet|house-of|aspect/],
  ["zodiac", /zodiac-sign|\bzodiac\b|star-sign/],
  ["numerology", /numerolog|life-path-number|destiny-number/],
  ["blood-type", /blood-type/],
  ["dream", /dream-(meaning|interpretation|of)|meaning-of-dream/],
  ["palmistry", /palmistry|palm-reading/],
  ["physiognomy", /physiognomy|face-reading/],
  ["oracle", /\boracle\b|gracian|meditations/],
  ["fortune", /\bfortune\b|\bluck\b/],
];

function inferTopic(concept: string): string | null {
  for (const [topic, re] of TOPIC_PATTERNS) {
    if (re.test(concept)) return topic;
  }
  return null;
}

export const GET: APIRoute = async () => {
  const posts = (await getCollection("blog", ({ data }) => data.draft !== true)).filter(
    (p) => p.data.track === "dictionary",
  );

  const url = (slug: string) => new URL(`/${slug}/`, siteConfig.url).href;

  // --- cluster sets: keyed by (locale + kind + name) ---
  const setMap = new Map<
    string,
    { id: string; kind: "series" | "topic"; locale: string; name: string; members: string[] }
  >();
  const addToSet = (
    key: string,
    kind: "series" | "topic",
    locale: string,
    name: string,
    slug: string,
  ) => {
    let s = setMap.get(key);
    if (!s) {
      s = { id: key, kind, locale, name, members: [] };
      setMap.set(key, s);
    }
    s.members.push(slug);
  };

  // --- translation tuples: keyed by concept (slug without locale) ---
  const sameAsMap = new Map<string, Record<string, string>>();

  // --- explicit edges from frontmatter (broader / narrower / relatedTerms) ---
  const edges: { from: string; to: string; type: "broader" | "narrower" | "related"; locale: string }[] = [];

  // --- per-locale concept → URL index (for resolving hub definition links) ---
  const conceptUrlByLocale = new Map<string, Map<string, string>>();

  for (const p of posts) {
    const locale = p.data.locale ?? p.slug.split("/")[0];
    const concept = p.slug.split("/").slice(1).join("/");

    let cu = conceptUrlByLocale.get(locale);
    if (!cu) conceptUrlByLocale.set(locale, (cu = new Map()));
    cu.set(concept, url(p.slug));

    if (p.data.broader) {
      edges.push({ from: concept, to: p.data.broader, type: "broader", locale });
    }
    for (const n of p.data.narrower ?? []) {
      edges.push({ from: concept, to: n, type: "narrower", locale });
    }
    for (const r of p.data.relatedTerms ?? []) {
      edges.push({ from: concept, to: r, type: "related", locale });
    }

    if (p.data.series) {
      addToSet(`series:${locale}:${p.data.series}`, "series", locale, p.data.series, p.slug);
    }
    const topic = inferTopic(concept);
    if (topic) {
      addToSet(`topic:${locale}:${topic}`, "topic", locale, topic, p.slug);
    }

    const tuple = sameAsMap.get(concept) ?? {};
    tuple[locale] = url(p.slug);
    sameAsMap.set(concept, tuple);
  }

  const sets = [...setMap.values()]
    .filter((s) => s.members.length >= 2)
    .map((s) => ({ ...s, members: s.members.sort() }))
    .sort((a, b) => a.id.localeCompare(b.id));

  const sameAs = [...sameAsMap.entries()]
    .filter(([, urls]) => Object.keys(urls).length >= 2)
    .map(([concept, urls]) => ({ concept, urls }))
    .sort((a, b) => a.concept.localeCompare(b.concept));

  // Topic-cluster index: concept → { locale → member count } and cluster ids,
  // so a hub can link to all dictionary definitions under it (e.g. astrology → 34).
  const memberCountByConcept = new Map<string, Record<string, number>>();
  const clusterIdsByConcept = new Map<string, string[]>();
  for (const s of setMap.values()) {
    if (s.kind !== "topic") continue;
    const counts = memberCountByConcept.get(s.name) ?? {};
    counts[s.locale] = s.members.length;
    memberCountByConcept.set(s.name, counts);
    const ids = clusterIdsByConcept.get(s.name) ?? [];
    ids.push(s.id);
    clusterIdsByConcept.set(s.name, ids);
  }

  // --- hub concept graph (cross-site ownership) from the route-ownership seed ---
  const seedTopics = readAllSeedTopics();
  const seedIds = new Set(seedTopics.map((t) => t.id));
  const hubs = seedTopics
    .map((t) => {
      // resolve same-locale wiki definition URL for each locale (id or alias)
      const definitionUrls: Record<string, string> = {};
      for (const [locale, cu] of conceptUrlByLocale) {
        for (const candidate of [t.id, ...(t.aliases ?? [])]) {
          const u = cu.get(conceptSlug(candidate));
          if (u) {
            definitionUrls[locale] = u;
            break;
          }
        }
      }
      return {
        concept: t.id,
        names: t.name ?? {},
        primaryOwner: t.primaryOwner ?? null,
        definitionOwner: t.definitionOwner ?? null,
        explanationOwner: t.explanationOwner ?? null,
        marketPolicy: t.marketPolicy ?? null,
        definitionUrls,
        routeIds: t.routeIds ?? [],
        related: (t.relatedTopicIds ?? []).filter((r) => seedIds.has(r)),
        // dictionary definitions under this hub (via topic inference), so the
        // hub links to its whole subtree, not just one representative page.
        definitionMemberCounts: memberCountByConcept.get(t.id) ?? {},
        definitionClusters: (clusterIdsByConcept.get(t.id) ?? []).sort(),
      };
    })
    .sort((a, b) => a.concept.localeCompare(b.concept));

  // hub↔hub relation edges (concept-level, locale-agnostic), de-duplicated
  const hubEdgeSet = new Set<string>();
  const hubEdges: { from: string; to: string; type: "related" }[] = [];
  for (const h of hubs) {
    for (const r of h.related) {
      const key = [h.concept, r].sort().join("::");
      if (hubEdgeSet.has(key)) continue;
      hubEdgeSet.add(key);
      hubEdges.push({ from: h.concept, to: r, type: "related" });
    }
  }

  const body = {
    "@context": "https://schema.org",
    name: `${siteConfig.name} — Concept Graph`,
    url: `${siteConfig.url}/knowledge/relations.json`,
    description:
      "Concept relationships: dictionary cluster memberships (series, topic), cross-locale translation links, frontmatter edges, and the cross-site hub ownership graph.",
    dateModified: new Date().toISOString(),
    setCount: sets.length,
    sameAsCount: sameAs.length,
    edgeCount: edges.length,
    hubCount: hubs.length,
    hubEdgeCount: hubEdges.length,
    sets,
    edges: edges.sort((a, b) => a.from.localeCompare(b.from) || a.to.localeCompare(b.to)),
    sameAs,
    hubs,
    hubEdges: hubEdges.sort((a, b) => a.from.localeCompare(b.from) || a.to.localeCompare(b.to)),
  };

  return new Response(JSON.stringify(body, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
