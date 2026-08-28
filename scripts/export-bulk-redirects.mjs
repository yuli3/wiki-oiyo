#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const HOST = "wiki.oiyo.net";
const LOCALES = ["en", "ko", "ja", "zh", "fr", "es"];
const LIMIT = 10_000;
const root = process.cwd();
const inputPath = path.join(root, "data/redirects/canonical-redirects.txt");
const outputDir = path.join(root, "reports/cloudflare-bulk-redirects");
const checkOnly = process.argv.includes("--check");

function csvCell(value) {
  return /[",\r\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
}

const source = await readFile(inputPath, "utf8");
const rules = [];
const errors = [];

source.split(/\r?\n/).forEach((raw, index) => {
  const line = raw.trim();
  if (!line || line.startsWith("#")) return;
  const fields = line.split(/\s+/);
  if (fields.length !== 3 || fields[2] !== "301") {
    errors.push(`Malformed rule at line ${index + 1}: ${raw}`);
    return;
  }
  const match = fields[0].match(/^\/:lang\/(.+)\*$/);
  if (!match || !fields[1].includes(":lang")) {
    errors.push(`Unsupported locale rule at line ${index + 1}: ${raw}`);
    return;
  }
  rules.push({ slug: match[1], target: fields[1], line: index + 1 });
});

const items = [];
const seen = new Set();
for (const rule of rules) {
  for (const locale of LOCALES) {
    const target = rule.target.replaceAll(":lang", locale);
    for (const slash of ["", "/"]) {
      const sourceUrl = `${HOST}/${locale}/${rule.slug}${slash}`;
      if (seen.has(sourceUrl)) {
        errors.push(`Duplicate generated source: ${sourceUrl}`);
        continue;
      }
      seen.add(sourceUrl);
      try {
        new URL(`https://${sourceUrl}`);
        new URL(target);
      } catch (error) {
        errors.push(`Invalid URL from line ${rule.line}: ${error.message}`);
      }
      items.push({
        redirect: {
          source_url: sourceUrl,
          target_url: target,
          status_code: 301,
          include_subdomains: false,
          subpath_matching: false,
          preserve_query_string: true,
          preserve_path_suffix: false,
        },
      });
    }
  }
}

if (items.length > LIMIT) errors.push(`Bulk item count ${items.length} exceeds ${LIMIT}`);
if (errors.length) {
  console.error(errors.map((error) => `ERROR: ${error}`).join("\n"));
  process.exit(1);
}

if (!checkOnly) {
  await mkdir(outputDir, { recursive: true });
  const csv = items
    .map(({ redirect }) =>
      [
        redirect.source_url,
        redirect.target_url,
        redirect.status_code,
        redirect.preserve_query_string,
        redirect.include_subdomains,
        redirect.subpath_matching,
        redirect.preserve_path_suffix,
      ]
        .map(csvCell)
        .join(","),
    )
    .join("\n");
  await Promise.all([
    writeFile(path.join(outputDir, "bulk-redirect-items.csv"), `${csv}\n`),
    writeFile(path.join(outputDir, "bulk-redirect-items.json"), `${JSON.stringify(items, null, 2)}\n`),
  ]);
}

console.log(`Wiki Bulk Redirect ${checkOnly ? "check" : "export"}: rules=${rules.length}, items=${items.length}, remaining=${LIMIT - items.length}`);
