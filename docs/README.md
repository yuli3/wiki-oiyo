# wiki-oiyo Documentation Index

This directory defines how `wiki-oiyo` should grow as a documented, stable reference and education-wiki platform centered on Cloudflare Pages.

## Document Map

1. [Content Charter](../../blog/docs/content-charter.md)
   Platform direction, track structure, naming rules, UI/UX principles, image policy, and project boundaries.

2. [MDOC Authoring Spec](../../blog/docs/mdoc-authoring-spec.md)
   Future-safe writing format, inline emphasis rules, allowlist, disallowlist, and rendering policy.

3. [Lecture System Blueprint](../../blog/docs/lecture-system-blueprint.md)
   Academy series design, chapter planning, lecture metadata, chapter template, and subject rollout priorities.

4. [Credential Catalog Blueprint](../../blog/docs/credential-catalog-blueprint.md)
   Professional-qualification information architecture, collection scope, content model, and data storage rules.

5. [Content Inventory Blueprint](../../blog/docs/content-inventory-blueprint.md)
   How all articles, lectures, and interactive posts should be tracked in one master inventory.

6. [AI-Native OS Northstar](../../company-brain/AI-Native-OS-Northstar.md)
   Cross-project long-term direction; current goals remain in `company-brain/goals.json`.

7. [Component Allowlist](./component-allowlist.md)
   Approved authoring surface for prose, lecture, chart, reference, and interactive blocks.

8. [Component Disallowlist](../../blog/docs/component-disallowlist.md)
   Components and patterns that should not spread further without explicit review.

9. [Lecture Series Registry](../../blog/docs/lecture-series-registry.md)
   Planned academy series map, chapter architecture, and rollout priority.

10. [Qualification Family Map](../../blog/docs/qualification-family-map.md)
    Qualification grouping model, related subjects, and linked lecture families.

11. [Content Schema Draft](../../blog/docs/content-schema-draft.md)
    Proposed metadata fields for content, series, migration state, and structured catalogs.

12. [Cross-Project Standardization Manual](../../blog/docs/cross-project-standardization-manual.md)
    Unified standards for `blog-oiyo` and `ahoxy-nextjs`, including formatting, migration, and governance rules.

13. [Content Style Examples](../../blog/docs/content-style-examples.md)
    Concrete writing and layout examples for academy, magazine, and interactive pages.

14. [Interactive Migration Map](../../blog/docs/interactive-migration-map.md)
    Migration rules and domain-level mapping from Ahoxy assets into `blog-oiyo` interactive content.

15. [Ahoxy Content Domain Map](../../blog/docs/ahoxy-content-domain-map.md)
    Domain catalog for Ahoxy slugs, grouped into migration families.

16. [Category and Track Map](../../blog/docs/category-and-track-map.md)
    Canonical mapping from editorial domains to `academy`, `magazine`, and `interactive`.

17. [Internal Linking Playbook](../../blog/docs/internal-linking-playbook.md)
    Rules for linking between tracks, projects, and qualification or lecture families.

18. [GA4 Review Checklist](../../blog/docs/ga4-review-checklist.md)
    Analytics review checklist for migration, traffic growth, and internal navigation measurement.

19. [Content Inventory Blueprint](../../blog/docs/content-inventory-blueprint.md)
    Canonical inventory structure and manual review policy.

20. [Content Schema Implementation Draft](../../blog/docs/content-schema-implementation-draft.md)
    File-by-file implementation draft for bringing the schema and taxonomy into the codebase.


22. [Component Registry by Track](./component-registry-by-track.md)
    Connects the authoring allowlist to the actual centralized MDX component registry in code.

23. [AGENTS Harness](../AGENTS.md)
    Canonical cross-agent harness for Codex, Claude Code, Gemini, Cursor, and other repository agents.

## Working Principle

The order of operations from now on is:

1. Define before building.
2. Standardize before scaling.
3. Store content metadata separately from article body.
4. Prefer simple, inspectable formats over ad hoc logic.
5. Keep `wiki-oiyo` optimized for static publishing on Cloudflare Pages.
