# Wiki Content Audit — 2026-06-05

## 1. Scope

This report captures the local `wiki-oiyo` content state before the next content-strengthening batch.

It should be used with:

1. [Wiki Content Strengthening Project](./wiki-content-strengthening-project-2026-06.md)
2. [Implementation Control Board](./implementation-control-board.md)
3. [Content Inventory Blueprint](./content-inventory-blueprint.md)

## 2. Current Counts

| Signal | Count |
| --- | ---: |
| MDX/MD files under `src/content` | 1750 |
| Rows in `data/catalog/content-inventory.master.csv` | 282 |
| `track: academy` | 1501 |
| `track: magazine` | 90 |
| `track: dictionary` | 19 |
| Missing `track` | 140 |
| `academy` files missing `series` | 0 |

## 3. Locale Distribution

| Locale | Content files |
| --- | ---: |
| ko | 1088 |
| en | 351 |
| ja | 285 |
| es | 7 |
| fr | 7 |
| zh | 6 |
| cn | 6 |

Notes:

1. `zh` and `cn` both exist. Do not merge, delete, or redirect them without a separate locale decision.
2. `ko` is the master content surface.
3. `en` and `ja` contain many migrated education files that need metadata checks.

## 4. Top Categories by File Count

| Category | Files |
| --- | ---: |
| 오라클 300 | 300 |
| Economics | 87 |
| Business | 80 |
| Finance | 60 |
| Social Science | 50 |
| Psychology | 49 |
| Mysticism | 49 |
| Public Admin | 45 |
| English Grammar | 45 |
| Accounting | 45 |
| Investment | 44 |
| Music History | 42 |
| Nursing | 39 |
| Computer Science | 37 |
| Financial Engineering | 36 |
| Natural Science | 34 |
| Art Psychotherapy | 33 |
| Mind & Psychology | 32 |
| 30일 마인드셋 | 31 |
| Zoology | 30 |

## 5. Blocking Metadata Issues

### A. Inventory Drift

`content-inventory.master.csv` has 277 rows, while the repository has 1750 content files.

This is now the largest auditability gap. New content should not be added broadly until either:

1. the inventory is regenerated from frontmatter, or
2. a controlled sync script is introduced and verified.

### B. Missing Track

There are 140 files without explicit `track`.

Observed pattern:

1. Most missing-track files are `en` education or `meaning-of-*` pages.
2. These should be classified in topic batches, not with a blind global replacement.
3. Likely assignments:
   - `education-*` -> `academy`
   - `meaning-of-*` -> `dictionary` or `magazine`, depending on whether the page is reference-style or essay-style

### C. Academy Without Series

Resolved in this batch. These 5 files now have `series: 민법총칙`, sequential `chapter` values, and matching inventory rows:

1. `src/content/blog/ko/lecture-civil-law-01.mdx`
2. `src/content/blog/ko/lecture-civil-law-02.mdx`
3. `src/content/blog/ko/lecture-civil-law-03.mdx`
4. `src/content/blog/ko/lecture-civil-law-04.mdx`
5. `src/content/blog/ko/lecture-civil-law-05.mdx`

### D. One-Article Series

These series currently have only one file:

| Series | File |
| --- | --- |
| 소비자 권리 가이드 | `src/content/blog/ko/consumer-rights-ch1.mdx` |
| 디지털 리터러시 가이드 | `src/content/blog/ko/digital-ch1.mdx` |
| 게임이론 | `src/content/blog/ko/education-game-theory-ch6.mdx` |
| 협상학 | `src/content/blog/ko/education-negotiation-ch6.mdx` |

Recommended handling:

1. `소비자 권리 가이드` and `디지털 리터러시 가이드` fit `wiki-oiyo` as official-link explainers.
2. `게임이론` and `협상학` may belong more naturally to `blog-oiyo` if expanded as full academy curricula. In `wiki-oiyo`, keep them only if framed as concise education-wiki references.

## 6. Next Batch Proposal

### Batch 1 — Metadata Closure

1. Generate a full missing-track list.
2. Backfill `track` for safe `education-*` patterns.
3. Run `npm run verify:harness`.

### Batch 2 — Inventory Recovery

1. Decide whether inventory is source-of-truth or generated artifact.
2. Sync all 1750 content files into `content-inventory.master.csv`.
3. Add guard checks for missing rows.

### Batch 3 — Dictionary Core

Only after metadata and inventory gates are green:

1. MBTI
2. Enneagram
3. Big Five
4. Attachment theory
5. Cognitive bias

Each page should link to `oiyo.net` when there is a relevant test or execution flow.

## 7. Regeneration Command

Use this read-only audit pattern to refresh the counts:

```bash
node <<'NODE'
const fs = require('fs');
const cp = require('child_process');
const files = cp.execSync("rg --files src/content | rg '\\\\.(mdx|md)$'", { encoding: 'utf8' }).trim().split(/\n/).filter(Boolean);
const byTrack = {};
for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');
  const fm = text.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
  const track = (fm.match(/^track:\s*(.*)$/m)?.[1] ?? '').trim().replace(/^['"]|['"]$/g, '');
  byTrack[track || '(missing)'] = (byTrack[track || '(missing)'] || 0) + 1;
}
console.log({ files: files.length, byTrack });
NODE
```
