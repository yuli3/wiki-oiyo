/**
 * Deterministic backfill of machine-citable knowledge fields for dictionary
 * entries. NO LLM — pure derivation, so it is free, safe, and reproducible.
 *
 * For each `track: dictionary` entry missing the fields, append to frontmatter:
 *   - definition   = first sentence of `description`
 *   - reviewer     = `author`
 *   - reviewedDate = `updatedDate` ?? `pubDate`  (YYYY-MM-DD)
 *
 * Existing values are never overwritten. Writing is done by TEXT INSERTION
 * before the closing `---`, so existing frontmatter formatting is preserved
 * (gray-matter is used only for read-side parsing).
 *
 * Usage:
 *   node scripts/backfill-knowledge-fields.mjs           # dry-run (no writes)
 *   node scripts/backfill-knowledge-fields.mjs --write   # apply
 *   LIMIT=5 node scripts/backfill-knowledge-fields.mjs    # sample first 5
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";

const WRITE = process.argv.includes("--write");
const LIMIT = process.env.LIMIT ? parseInt(process.env.LIMIT, 10) : Infinity;
const ROOT = new URL("../src/content/blog/", import.meta.url).pathname;

function firstSentence(desc) {
  const clean = String(desc).replace(/\s+/g, " ").trim();
  const m = clean.match(/^(.*?[.!?。！？])(\s|$)/u);
  let s = m ? m[1] : clean;
  if (s.length > 300) s = clean.slice(0, 297).trimEnd() + "…";
  return s;
}

function yamlDq(str) {
  return '"' + String(str).replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '"';
}

function ymd(d) {
  if (!d) return null;
  const dt = d instanceof Date ? d : new Date(d);
  if (isNaN(dt)) return null;
  return dt.toISOString().slice(0, 10);
}

const files = readdirSync(ROOT, { recursive: true })
  .filter((f) => typeof f === "string" && /\.(md|mdx)$/.test(f))
  .map((f) => join(ROOT, f));

let scanned = 0, dict = 0, changed = 0, skipped = 0;
const samples = [];

for (const file of files) {
  if (changed >= LIMIT) break;
  const raw = readFileSync(file, "utf8");
  let parsed;
  try {
    parsed = matter(raw);
  } catch {
    continue;
  }
  scanned++;
  const d = parsed.data;
  if (d.track !== "dictionary") continue;
  dict++;

  const additions = [];
  if (d.definition == null && d.description) {
    additions.push(`definition: ${yamlDq(firstSentence(d.description))}`);
  }
  if (d.reviewer == null && d.author) {
    additions.push(`reviewer: ${yamlDq(d.author)}`);
  }
  if (d.reviewedDate == null) {
    const rd = ymd(d.updatedDate) ?? ymd(d.pubDate);
    if (rd) additions.push(`reviewedDate: '${rd}'`);
  }
  if (additions.length === 0) {
    skipped++;
    continue;
  }

  // Insert before the closing '---' of the frontmatter block.
  const lines = raw.split("\n");
  // first line is '---'; find the next '---'
  let end = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === "---") { end = i; break; }
  }
  if (end === -1) { skipped++; continue; }
  lines.splice(end, 0, ...additions);
  const out = lines.join("\n");

  if (samples.length < 3) {
    samples.push({ file: file.replace(ROOT, ""), additions });
  }
  if (WRITE) writeFileSync(file, out, "utf8");
  changed++;
}

console.log(JSON.stringify({ mode: WRITE ? "WRITE" : "DRY-RUN", scanned, dict, changed, skipped }, null, 2));
console.log("--- samples ---");
for (const s of samples) {
  console.log(s.file);
  s.additions.forEach((a) => console.log("  + " + a));
}
