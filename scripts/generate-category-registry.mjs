import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const sourcePath = resolve(root, "data/catalog/category-registry.yaml");
const outputPath = resolve(root, "src/generated/category-registry.ts");
const source = readFileSync(sourcePath, "utf8");

const entries = [];
let current = null;
for (const line of source.split(/\r?\n/)) {
  const id = line.match(/^\s{2}- id:\s*(.+?)\s*$/);
  if (id) {
    if (current) entries.push(current);
    current = { id: id[1], labels: [] };
    continue;
  }
  if (!current) continue;
  const label = line.match(/^\s{4}label_(?:ko|en):\s*(.+?)\s*$/);
  if (label) current.labels.push(label[1]);
}
if (current) entries.push(current);

const aliases = new Map();
for (const entry of entries) {
  for (const label of [entry.id, ...entry.labels]) {
    const existing = aliases.get(label);
    if (existing && existing !== entry.id) {
      throw new Error(`Category alias collision: "${label}" maps to ${existing} and ${entry.id}`);
    }
    aliases.set(label, entry.id);
  }
}

const generated = `// Generated from data/catalog/category-registry.yaml. Do not edit directly.\n` +
  `export const CATEGORY_SLUG_BY_LABEL: Readonly<Record<string, string>> = ${JSON.stringify(
    Object.fromEntries([...aliases].sort(([a], [b]) => a.localeCompare(b))),
    null,
    2,
  )};\n`;

if (process.argv.includes("--check")) {
  const existing = readFileSync(outputPath, "utf8");
  if (existing !== generated) {
    console.error("Generated category registry is stale. Run npm run sync:category-registry.");
    process.exit(1);
  }
  console.log(`category registry check PASS: ${entries.length} categories, ${aliases.size} aliases`);
} else {
  mkdirSync(resolve(root, "src/generated"), { recursive: true });
  writeFileSync(outputPath, generated);
  console.log(`category registry generated: ${entries.length} categories, ${aliases.size} aliases`);
}
