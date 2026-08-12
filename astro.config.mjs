// @ts-check

import { readFileSync, readdirSync } from "node:fs";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import remarkGfm from "remark-gfm";
import remarkCjkFriendly from "remark-cjk-friendly";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import robotsTxt from "astro-robots-txt";

// Bridge pages are noindex stubs that canonicalize to blog.oiyo.net/oiyo.net —
// they must never appear in the sitemap.
const BRIDGE_SLUGS = new Set(
  JSON.parse(readFileSync(new URL("./src/config/bridge-slugs.json", import.meta.url), "utf8")),
);

// Crawl-budget policy: served to users, kept out of the index. Googlebot rations
// crawling on low-authority domains, and these locales consumed ~35% of wiki's
// submitted URLs while producing no clicks. Must stay in lockstep with
// SEO.astro's robots meta — sitemap-listed but noindex is a contradictory signal.
const DEINDEXED_LOCALES = new Set(
  JSON.parse(readFileSync(new URL("./src/config/deindexed-locales.json", import.meta.url), "utf8")),
);

/** @param {URL} directory @returns {string[]} */
function collectExcludedPageSlugs(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (!entry.isFile() || !entry.name.endsWith(".astro")) return [];
    const source = readFileSync(new URL(entry.name, directory), "utf8");
    if (!/(?:OiyoCanonicalRedirect|BlogCanonicalRedirect|<meta\s+name=["']robots["'][^>]*noindex|\bnoindex\b)/i.test(source)) return [];
    return [entry.name.replace(/\.astro$/, "")];
  });
}

const EXCLUDED_PAGE_SLUGS = new Set(
  collectExcludedPageSlugs(new URL("./src/pages/[...lang]/", import.meta.url)),
);

// https://astro.build/config
export default defineConfig({
  site: "https://wiki.oiyo.net",
  output: "static",
  integrations: [
    react(),
    mdx(),
    sitemap({
      // Keep sitemap files small enough for predictable Cloudflare Pages deploys
      // and split the current URL set into sitemap-0.xml, sitemap-1.xml, sitemap-2.xml.
      entryLimit: 2000,
      // Exclude dev/utility paths and underscore-prefixed routes
      filter: (page) => {
        const url = new URL(page);
        const path = url.pathname;
        // Root is a locale redirect shell; canonical English content lives at /en/.
        if (path === "/" || path === "") return false;
        // Exclude paths with underscore segments
        if (path.split("/").some((seg) => seg.startsWith("_"))) return false;
        // Exclude /index duplicate (trailing slash version is canonical)
        if (path.endsWith("/index/") || path === "/index") return false;
        // Exclude noindex bridge stubs (canonical lives on blog.oiyo.net/oiyo.net)
        const segs = path.split("/").filter(Boolean);
        if (segs.length === 2 && BRIDGE_SLUGS.has(segs[1])) return false;
        // Exclude deindexed locales (crawl budget).
        if (segs.length > 0 && DEINDEXED_LOCALES.has(segs[0])) return false;
        if (segs.length === 2 && EXCLUDED_PAGE_SLUGS.has(segs[1])) return false;
        return true;
      },
      // Do not stamp every URL with the build time. A trustworthy per-entry
      // source date may be added later; an unknown date is omitted.
      // Use serialize for per-URL priority and changefreq
      serialize: (item) => {
        const url = new URL(item.url);
        const path = url.pathname;
        // Homepage — highest priority
        if (path === "/en/") {
          return { ...item, priority: 1.0 };
        }
        // Locale homepages (e.g. /ko/, /ja/, /fr/)
        if (/^\/(ko|ja|fr|es|zh)\/$/.test(path)) {
          return { ...item, priority: 0.9 };
        }
        // Blog article pages
        if (/^\/(en|ko|ja|fr|es|zh)\/[^/]+\/$/.test(path)) {
          return { ...item, priority: 0.8 };
        }
        // Pagination pages (/2/, /3/, …)
        if (/\/\d+\/$/.test(path)) {
          return { ...item, priority: 0.4 };
        }
        // Everything else
        return { ...item, priority: 0.6 };
      },
    }),
    robotsTxt({
      host: true,
      policy: [
        {
          userAgent: "*",
          allow: "/",
          disallow: ["*/search?*", "/search", "/api/"],
        },
      ],
    }),
  ],
  image: {
    service: {
      entrypoint: "astro/assets/services/sharp",
    },
  },
  i18n: {
    defaultLocale: "en",
    locales: ["en", "ko", "ja", "fr", "es", "zh"],
    routing: "manual",
  },
  build: {
    format: "directory",
    concurrency: 1,
  },
  vite: {
    plugins: [/** @type {any} */ (tailwindcss())],
    build: {
      minify: "esbuild",
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules/recharts")) return "recharts";
            if (id.includes("node_modules/react-dom")) return "react-dom";
            if (id.includes("node_modules/react")) return "react-vendor";
            if (id.includes("node_modules/lucide-react")) return "lucide";
          },
        },
      },
    },
  },
  markdown: {
    // Disable built-in GFM so we can re-apply it with singleTilde: false.
    // Korean content uses ~ as a range character (e.g. "1~2번 12일~13일"),
    // which MDX would otherwise parse as strikethrough.
    // Intentional strikethrough should use <del>text</del> instead.
    gfm: false,
    shikiConfig: {
      theme: "github-dark",
      wrap: true,
    },
    remarkPlugins: [
      [remarkGfm, { singleTilde: false }],
      // Fixes CommonMark emphasis failing around CJK: **볼드(영문)**조사 patterns
      // rendered as literal ** on 458 pages (found 2026-07-07 audit).
      remarkCjkFriendly,
      remarkMath,
    ],
    rehypePlugins: [
      [rehypeKatex, { strict: "ignore" }],
    ],
  },
});
