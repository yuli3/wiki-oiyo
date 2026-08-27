# AGENTS.md

This file is the canonical agent harness for `wiki-oiyo`.

Before using this project-specific harness, read the cross-project harness:

1. [/Users/seuncho/coding/AGENTS.md](/Users/seuncho/coding/AGENTS.md)
2. [/Users/seuncho/coding/company-brain/AGENT_BOOTSTRAP.md](/Users/seuncho/coding/company-brain/AGENT_BOOTSTRAP.md)
3. [/Users/seuncho/coding/company-brain/NOW.md](/Users/seuncho/coding/company-brain/NOW.md)

All coding agents working in this repository should treat this file as the first operational document, then follow the linked control documents and verification commands.

## 1. Mission

`wiki-oiyo` is a source-backed reference and concept-graph surface. Definitions and
explanations may also live on Blog or an execution surface when that route is the
canonical owner. Content format alone never selects Wiki.

Preserve existing canonical owners. Create or move a route only when search intent,
existing authority, product adjacency, and maintenance cost support the change; record
that decision in the route-ownership contract.

1. `academy`
2. `magazine`
3. `interactive`

The operating goal is:

1. stable Cloudflare Pages publishing
2. controlled MDOC-style authoring
3. source-backed reference content with explicit provenance
4. content and metadata that stay understandable across tools and agents
5. no parallel page created merely to complete a definition/explanation/execution trio

## 2. Source of Truth Order

Read these in order before making substantial changes:

1. [Cross-project harness](/Users/seuncho/coding/AGENTS.md)
2. [Current work surface](/Users/seuncho/coding/company-brain/NOW.md)
3. [Route ownership contract](/Users/seuncho/coding/company-brain/projects/oiyo-ecosystem/contracts/route-ownership.json)
4. [Topic ownership contract](/Users/seuncho/coding/company-brain/projects/oiyo-ecosystem/contracts/knowledge/topics.json)
5. [Three-domain boundary repeal](/Users/seuncho/coding/company-brain/AI-Sessions/wiki/decisions/three-domain-boundary-abolished-2026-08-27.md) when selecting or moving a canonical owner
6. [Wiki category registry](/Users/seuncho/coding/wiki/data/catalog/category-registry.yaml)
7. [Wiki content inventory](/Users/seuncho/coding/wiki/data/catalog/content-inventory.master.csv)

## 3. Working Rules

### Core rules

1. registry before category growth
2. metadata before mass migration
3. renderer control before new component families
4. priority backfill before broad expansion
5. uncertain items go to `revisit-later`, not forced decisions

### Content rules

1. prefer explicit `track` over inferred track
2. `academy` content should be series-aware and chapter-aware
3. `magazine` should remain the narrowest rendering surface
4. `interactive` must be reading-first, not tool-only
5. do not add image-heavy assumptions; the design direction is image-light
6. **Prose Minimum (FAANG gate)**: any `track: interactive` article must contain ≥ 400 Korean characters of prose before the first component. Count only non-heading, non-import, non-component, non-table lines. Tool-dump articles without context paragraphs will be rejected.
7. **CSV-on-Create**: every new MDX article must have its row in `data/catalog/content-inventory.master.csv` created in the same commit. Run `verify:harness` immediately after; a missing CSV row is a blocking failure.
8. **Hreflang Gate (SEO)**: ko-only `interactive` articles must NOT emit hreflang alternate tags for locales without actual content. The `availableLocales` prop mechanism in `[...slug].astro` → `BaseLayout` → `SEO.astro` handles this automatically — do not bypass it by hardcoding locales in frontmatter or layouts.

### Rendering rules

1. do not add MDX components directly to route files
2. update [src/lib/mdx-component-registry.ts](/Users/seuncho/coding/blog/src/lib/mdx-component-registry.ts) instead
3. keep `magazine` narrower than `academy` and `interactive`
4. use the compatibility bridge only when needed to keep legacy content stable

### Data rules

1. new categories must be represented in `data/catalog/category-registry.yaml`
2. priority work should be reflected in `data/catalog/content-inventory.master.csv`
3. migration candidates should map back to `ahoxy-migration.audit.csv` or `revisit-later.csv`

## 4. Standard Commands

Use these commands as the default harness interface:

```bash
npm run build
npm run type-check
npm run lint
npm run validate:i18n
npm run validate:personality
npm run verify:harness
npm run audit:magazine-compat
```

## 5. Definition of Done

A task is not done just because files changed.

It is done when:

1. it matches the control documents
2. metadata and taxonomy are still coherent
3. the appropriate verification commands pass
4. any new category, track, or series logic is reflected in the registry or inventory
5. the final note explains what changed and what remains transitional

## 6. Red Flags

Pause and re-align if:

1. a new content family appears without category registry support
2. route files start accumulating direct component exposure again
3. `magazine` grows toward an unrestricted MDX surface
4. content is added without `track`, `series`, or `chapter` where required
5. an agent starts optimizing for speed over auditability
6. a new `interactive` article is created without a corresponding CSV row (see Content Rule 7)
7. `client:load` is used for the 2nd or later component on a multi-component page (use `client:visible` instead)
8. `dangerouslySetInnerHTML` is used without DOMPurify sanitization in any user-input component

## 7. Agent Adapters

Tool-specific instructions should stay thin.

The following files are adapters and should point back here:

1. [CLAUDE.md](/Users/seuncho/coding/wiki/CLAUDE.md)
2. [CURSOR.md](/Users/seuncho/coding/wiki/CURSOR.md)
3. [.cursor/rules/project-harness.mdc](/Users/seuncho/coding/wiki/.cursor/rules/project-harness.mdc)

## 8. Current State

Do not cache dated page counts or roadmap status in this harness. Read
`company-brain/NOW.md` for active goals and derive Wiki inventory state from
`data/catalog/content-inventory.master.csv` and the repository's verification scripts.
Before changing content ownership, inspect the current route contract and preserve the
existing owner unless route-level evidence supports an explicit change.
