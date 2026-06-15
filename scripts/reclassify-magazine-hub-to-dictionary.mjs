/**
 * Unify hub concept track: change `track: magazine` → `track: dictionary` for
 * `meaning-of-*` concept pages, so the same concept is `dictionary` in ALL
 * locales (en/ja were already dictionary; ko/fr/es/zh were magazine).
 *
 * Rationale: `meaning-of-X` = definition of X = wiki's native dictionary track;
 * dictionary is what makes a concept citable (topics.json + DefinedTerm).
 * Rendering is unchanged (both magazine and dictionary → magazineMdxComponents).
 *
 * Scope guard: ONLY touches files matching `meaning-of-*` with `track: magazine`.
 * Other magazine essays are untouched.
 *
 * Usage:
 *   node scripts/reclassify-magazine-hub-to-dictionary.mjs           # dry-run
 *   node scripts/reclassify-magazine-hub-to-dictionary.mjs --write   # apply
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const WRITE = process.argv.includes("--write");
const ROOT = new URL("../src/content/blog/", import.meta.url).pathname;

const files = readdirSync(ROOT, { recursive: true })
  .filter((f) => typeof f === "string" && /\.(md|mdx)$/.test(f))
  .filter((f) => /(^|\/)meaning-of-[^/]+\.(md|mdx)$/.test(f));

let scanned = 0, changed = 0;
const byLocale = {};
const concepts = new Set();

for (const rel of files) {
  scanned++;
  const file = join(ROOT, rel);
  const raw = readFileSync(file, "utf8");
  const lines = raw.split("\n");
  if (lines[0]?.trim() !== "---") continue;
  let end = -1;
  for (let i = 1; i < lines.length; i++) { if (lines[i].trim() === "---") { end = i; break; } }
  if (end === -1) continue;

  let touched = false;
  for (let i = 1; i < end; i++) {
    if (/^track:\s*["']?magazine["']?\s*$/.test(lines[i])) {
      lines[i] = "track: dictionary";
      touched = true;
      break;
    }
  }
  if (!touched) continue;

  const locale = rel.split("/")[0];
  const concept = rel.split("/").slice(1).join("/").replace(/\.(md|mdx)$/, "");
  byLocale[locale] = (byLocale[locale] || 0) + 1;
  concepts.add(concept);
  if (WRITE) writeFileSync(file, lines.join("\n"), "utf8");
  changed++;
}

console.log(JSON.stringify({ mode: WRITE ? "WRITE" : "DRY-RUN", scanned, changed, byLocale }, null, 2));
console.log("unique concepts (", concepts.size, "):", [...concepts].sort().join(", "));
