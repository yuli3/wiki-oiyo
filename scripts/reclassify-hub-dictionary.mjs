/**
 * Reclassify untracked `meaning-of-*` hub concepts as `track: dictionary`.
 *
 * These are top-level concept definitions (astrology, mbti, enneagram, numerology,
 * palja, big5 ...) that dictionary entries already point to via `broader`, but they
 * were never tagged with a track, so they were excluded from the knowledge catalog
 * and got no DefinedTerm JSON-LD.
 *
 * Safety: track resolution is `explicitTrack ?? inferTrackFromCategory(category)`.
 * Their categories (Mysticism, Mind & Psychology, ...) all infer to "magazine",
 * and getRegisteredMdxComponents("dictionary") also returns magazineMdxComponents,
 * so adding `track: dictionary` does NOT change rendering — only classification.
 *
 * Only touches files that:
 *   - match `meaning-of-*.{md,mdx}`
 *   - have NO existing `track:` field
 *
 * Usage:
 *   node scripts/reclassify-hub-dictionary.mjs           # dry-run
 *   node scripts/reclassify-hub-dictionary.mjs --write   # apply
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, basename } from "node:path";

const WRITE = process.argv.includes("--write");
const ROOT = new URL("../src/content/blog/", import.meta.url).pathname;

const files = readdirSync(ROOT, { recursive: true })
  .filter((f) => typeof f === "string" && /\.(md|mdx)$/.test(f))
  .filter((f) => /(^|\/)meaning-of-[^/]+\.(md|mdx)$/.test(f))
  .map((f) => join(ROOT, f));

let scanned = 0, changed = 0, hasTrack = 0;
const samples = [];

for (const file of files) {
  scanned++;
  const raw = readFileSync(file, "utf8");
  const lines = raw.split("\n");
  if (lines[0]?.trim() !== "---") continue;
  // find frontmatter end
  let end = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === "---") { end = i; break; }
  }
  if (end === -1) continue;
  const fm = lines.slice(1, end);
  if (fm.some((l) => /^track:\s*/.test(l))) { hasTrack++; continue; }

  // insert `track: dictionary` as first frontmatter line
  lines.splice(1, 0, "track: dictionary");
  if (samples.length < 6) samples.push(basename(file, ".mdx").replace(/\.md$/, ""));
  if (WRITE) writeFileSync(file, lines.join("\n"), "utf8");
  changed++;
}

console.log(JSON.stringify({ mode: WRITE ? "WRITE" : "DRY-RUN", scanned, alreadyTracked: hasTrack, reclassified: changed }, null, 2));
console.log("samples:", samples.join(", "));
