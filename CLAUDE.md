# CLAUDE.md — wiki-oiyo

This is **wiki.oiyo.net** — an Astro + Cloudflare Pages site for SEO-focused reference/wiki content.
It shares the same architecture as blog-oiyo but is a separate deployment with its own content.

## Project Identity
- Site URL: https://wiki.oiyo.net
- Cloudflare Pages project: wiki-oiyo (to be created)
- Content type: SEO wiki/reference articles

## Default Verification

```bash
npm run build
npm run type-check
npm run validate:i18n
npm run verify:harness
```

## Key Differences from blog-oiyo
- `site.config.ts`: name="Oiyo Wiki", url="https://wiki.oiyo.net"
- `astro.config.mjs`: site="https://wiki.oiyo.net"
- Content in `src/content/blog/` is wiki-specific, separate from blog-oiyo
