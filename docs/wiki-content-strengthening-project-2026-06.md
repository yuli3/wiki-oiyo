# Wiki Content Strengthening Project — 2026-06

## 1. Purpose

This document defines the content-strengthening scope for `wiki-oiyo`.

`wiki-oiyo` should not become a second `blog-oiyo` or a second `oiyo-astro`.
Its job is to publish durable reference, dictionary, and education-wiki content that can link outward to the right execution or long-form surface.

## 2. Cross-Project Role Check

Before adding or strengthening content, assign the topic to exactly one primary project.

| Project | Domain | Primary Role | Content That Belongs There |
| --- | --- | --- | --- |
| `oiyo-astro` | `oiyo.net` | Interactive personality, fortune, and self-understanding hub | Tests, calculators, result pages, personality/fortune execution flows |
| `wiki-oiyo` | `wiki.oiyo.net` | Dictionary, encyclopedia, oracle, and education-wiki reference | Concept definitions, type dictionaries, evergreen reference pages, official-link explainers |
| `blog-oiyo` | `blog.oiyo.net` | Professional education, qualification, work-skills, and long-form academy | Korean certification content, job education, AI practice, tax/accounting/labor academy essays |
| `ahoxy-nextjs` | `ahoxy.com` | Tool hub and legacy traffic source | Standalone tools, calculators, games, redirects, traffic-preservation routes |

Rule:

1. If the page asks the user to run a test, calculate something, or get a result, it probably belongs to `oiyo-astro` or `ahoxy-nextjs`.
2. If the page explains what a concept means, it probably belongs to `wiki-oiyo`.
3. If the page teaches a professional subject in chapter form, it probably belongs to `blog-oiyo`.
4. If the topic is uncertain, create an inventory note first instead of publishing a new page.

## 3. Current Wiki Baseline

Snapshot from local audit on 2026-06-05:

| Signal | Count / Status |
| --- | ---: |
| MDX/MD files under `src/content` | 1750 |
| `track: academy` | 1501 |
| `track: magazine` | 90 |
| `track: dictionary` | 19 |
| Missing `track` | 140 |
| `academy` files missing `series` | 0 |
| Rows in `data/catalog/content-inventory.master.csv` | 282 |

Immediate implication:

1. The live content set and inventory CSV are still not aligned.
2. Missing `track` backfill must happen before broad new content expansion.
3. `dictionary` is still small compared with the intended wiki role.

## 4. Wiki-Appropriate Content Families

### 4.1 Keep and Strengthen

These are appropriate for `wiki-oiyo`:

1. `oracle-300`
2. personality dictionaries
3. enneagram dictionaries
4. psychology concept dictionaries
5. fortune and symbolic concept dictionaries
6. official-link explainers for public programs, consumer rights, tax basics, and support systems
7. short education-wiki chapters that define concepts rather than run full professional courses

### 4.2 Send Elsewhere

Do not grow these inside `wiki-oiyo` unless there is an explicit cross-project decision:

1. personality tests and result engines -> `oiyo-astro`
2. daily fortune, AI fortune, auth, payment, premium reports -> dormant `oiyo` Next.js
3. life calculators, tax calculators, salary calculators, real-estate tools -> `blog-oiyo` or `ahoxy-nextjs`
4. full Korean professional certification curricula -> `blog-oiyo`
5. standalone games or utility tools -> `ahoxy-nextjs`, unless wrapped as a reading-first article elsewhere

## 5. Workstreams

### A. Existing Work Closure

Purpose: close the deployment and SEO hardening work before content expansion.

Actions:

1. Keep `wiki-oiyo` static on Cloudflare Pages.
2. Keep `sitemap-index.xml` split into `sitemap-0.xml`, `sitemap-1.xml`, and `sitemap-2.xml`.
3. Keep root `/` as a noindex locale redirect shell.
4. Keep canonical English content under `/en/`.
5. Keep ko-only pages from emitting hreflang alternates for missing locales.

Verification:

```bash
npm run build
npm run type-check
npm run lint
npm run validate:i18n
npm run verify:harness
```

### B. Metadata and Inventory Recovery

Purpose: make the content base auditable again.

Actions:

1. Backfill `track` on the 140 missing-track content files.
2. Rebuild `data/catalog/content-inventory.master.csv` from actual content or create a controlled sync script.
3. Compare real categories against `data/catalog/category-registry.yaml`.
4. Keep uncertain items in a review queue rather than forcing categories.

Completed in this batch:

1. `src/content/blog/ko/lecture-civil-law-01.mdx`
2. `src/content/blog/ko/lecture-civil-law-02.mdx`
3. `src/content/blog/ko/lecture-civil-law-03.mdx`
4. `src/content/blog/ko/lecture-civil-law-04.mdx`
5. `src/content/blog/ko/lecture-civil-law-05.mdx`

### C. Dictionary Expansion

Purpose: make `wiki-oiyo` feel like a reference destination, not only an academy mirror.

First dictionary candidates:

1. MBTI overview and 16 type reference pages
2. Enneagram overview and 9 type reference pages
3. Big Five, RIASEC, TCI, HEXACO, HSP, attachment theory
4. Astrology, numerology, biorhythm, yin-yang, saju, palja
5. Cognitive bias and decision-making glossary

Each dictionary page should include:

1. definition
2. why it matters
3. common misunderstandings
4. related concepts
5. link to the relevant `oiyo.net` test or hub when one exists

### D. Official-Link Explainers

Purpose: keep public-information pages useful without pretending to replace official sources.

Suitable topics:

1. tax filing basics
2. consumer rights
3. government support programs
4. youth and senior support programs
5. policy finance and public funds

Rule:

1. Link official sources first.
2. Explain eligibility and terms in plain language.
3. Avoid over-specific date claims unless the source and date are verified.

### E. Internal Linking and SEO

Purpose: connect wiki pages to the right ecosystem surface.

Linking rules:

1. Dictionary -> `oiyo.net` when the next action is a test or self-understanding flow.
2. Dictionary -> `blog.oiyo.net` when the next action is long-form study.
3. Academy wiki page -> related dictionary pages for definitions.
4. Official-link explainer -> official source plus related wiki explainers.

SEO rules:

1. One canonical topic per page.
2. Do not create duplicate wiki/blog pages with the same intent.
3. Use `updatedDate` when material is refreshed.
4. For ko-only content, do not emit hreflang alternates without actual translated content.

## 6. New Content Bundle Ideas

### Bundle 1 — Personality Dictionary Core

1. MBTI
2. Big Five
3. Enneagram
4. RIASEC
5. Attachment theory
6. Cognitive bias

### Bundle 2 — MBTI Type Reference

1. INTJ, INTP, ENTJ, ENTP
2. INFJ, INFP, ENFJ, ENFP
3. ISTJ, ISFJ, ESTJ, ESFJ
4. ISTP, ISFP, ESTP, ESFP

### Bundle 3 — Enneagram Reference

1. enneagram type 1 through type 9
2. wings overview
3. growth and stress direction
4. instinctual variants overview

### Bundle 4 — Official Life Admin

1. consumer rights
2. tax basics
3. government support
4. youth support
5. senior support
6. public finance terms

### Bundle 5 — Investment Glossary

1. sector rotation
2. dividend ETF
3. covered call ETF
4. total return
5. rebalancing
6. investment risk terms

## 7. Near-Term Execution Order

1. Finish and commit deployment/SEO hardening as a standalone batch.
2. Create a metadata audit report for missing `track` and inventory drift.
3. Backfill the 140 missing `track` files in controlled topic groups.
4. Re-sync `content-inventory.master.csv`.
5. Add the first dictionary bundle only after the inventory gate is green.

## 8. Definition of Done

A wiki content batch is complete when:

1. the topic belongs to `wiki-oiyo` by the role table above
2. every new MDX file has a matching CSV row
3. category and track are registered or explicitly mapped
4. academy content has `series` and `chapter`
5. dictionary content links to related concepts and the correct project surface
6. verification commands pass
