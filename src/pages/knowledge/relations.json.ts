import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { siteConfig } from "../../config/site.config";

/**
 * Public concept graph for the dictionary (definition) layer.
 * Output: /knowledge/relations.json
 *
 * Edges are expressed compactly to stay O(n):
 *  - sets:    cluster memberships (same series, or same mystic topic, per locale)
 *  - sameAs:  cross-locale translation tuples (same concept, different language)
 *
 * Consumers can derive pairwise relations from set membership. This keeps the
 * file small even when a series has hundreds of members.
 */

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

  for (const p of posts) {
    const locale = p.data.locale ?? p.slug.split("/")[0];
    const concept = p.slug.split("/").slice(1).join("/");

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

  const body = {
    "@context": "https://schema.org",
    name: `${siteConfig.name} — Concept Graph`,
    url: `${siteConfig.url}/knowledge/relations.json`,
    description:
      "Concept relationships for the dictionary layer: cluster memberships (series, topic) and cross-locale translation links.",
    dateModified: new Date().toISOString(),
    setCount: sets.length,
    sameAsCount: sameAs.length,
    edgeCount: edges.length,
    sets,
    edges: edges.sort((a, b) => a.from.localeCompare(b.from) || a.to.localeCompare(b.to)),
    sameAs,
  };

  return new Response(JSON.stringify(body, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
