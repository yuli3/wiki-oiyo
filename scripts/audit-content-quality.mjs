import fs from "node:fs";
import path from "node:path";
import {
  applyBaseline,
  baselineFromSummary,
  inspectArticle,
  loadTiersConfig,
  summarize,
} from "./lib/editorial-quality.mjs";

const root = process.cwd();
const contentRoot = path.join(root, "src/content/blog");
const editorialBaselinePath = path.join(root, "config/editorial-quality-baseline.json");
const writeBaseline = process.argv.includes("--write-baseline");
const inventoryOnly = process.argv.includes("--inventory");
const editorialTiers = loadTiersConfig(root);

function listMdxFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return listMdxFiles(full);
    return entry.isFile() && entry.name.endsWith(".mdx") ? [full] : [];
  });
}

const editorialResults = [];
for (const file of listMdxFiles(contentRoot)) {
  const text = fs.readFileSync(file, "utf8");
  editorialResults.push(
    inspectArticle({
      rel: path.relative(contentRoot, file),
      text,
      tiers: editorialTiers,
    }),
  );
}

const editorialSummary = summarize(editorialResults);
if (inventoryOnly) {
  console.log(
    JSON.stringify(
      {
        files: editorialSummary.counts.files,
        tiers: editorialSummary.counts.tiers,
        axes: Object.fromEntries(
          ["completenessTitle", "homepageSources", "fakeAuthority", "imageAlt", "workedExample"].map(
            (axis) => [axis, editorialSummary.counts[axis]],
          ),
        ),
      },
      null,
      2,
    ),
  );
  process.exit(0);
}

if (writeBaseline) {
  const next = baselineFromSummary(editorialSummary);
  fs.writeFileSync(editorialBaselinePath, `${JSON.stringify(next, null, 2)}\n`);
  console.log(
    `wrote ${path.relative(root, editorialBaselinePath)} ceilings: ` +
      `completenessTitle ${next.axes.completenessTitle.maxViolations}, ` +
      `homepageSources ${next.axes.homepageSources.maxViolations}, ` +
      `fakeAuthority ${next.axes.fakeAuthority.maxViolations}, ` +
      `imageAlt ${next.axes.imageAlt.maxViolations}, ` +
      `workedExample ${next.axes.workedExample.maxViolations}`,
  );
}

const hardFailures = [];
const editorialBaseline = fs.existsSync(editorialBaselinePath)
  ? JSON.parse(fs.readFileSync(editorialBaselinePath, "utf8"))
  : null;
if (!editorialBaseline) {
  console.warn(
    `warning: no baseline at config/editorial-quality-baseline.json. ` +
      `Current editorial violations: fakeAuthority ${editorialSummary.counts.fakeAuthority}. ` +
      `Create the baseline with: node scripts/audit-content-quality.mjs --write-baseline`,
  );
} else {
  const { failures, missingBaseline } = applyBaseline(editorialSummary, editorialBaseline);
  if (!missingBaseline) hardFailures.push(...failures);
}

if (hardFailures.length) {
  for (const failure of hardFailures) {
    console.error(`error: ${failure}`);
  }
  console.error(`content quality audit failed: ${hardFailures.length} blocking issue(s)`);
  process.exit(1);
}

console.log(
  `content quality audit passed; editorial A/B/C ${editorialSummary.counts.tiers.A}/${editorialSummary.counts.tiers.B}/${editorialSummary.counts.tiers.C}` +
    `; completenessTitle ${editorialSummary.counts.completenessTitle}` +
    (editorialBaseline ? `/${editorialBaseline.axes.completenessTitle.maxViolations}` : "") +
    `, homepageSources ${editorialSummary.counts.homepageSources}` +
    (editorialBaseline ? `/${editorialBaseline.axes.homepageSources.maxViolations}` : "") +
    `, fakeAuthority ${editorialSummary.counts.fakeAuthority}` +
    (editorialBaseline ? `/${editorialBaseline.axes.fakeAuthority.maxViolations}` : "") +
    `, imageAlt ${editorialSummary.counts.imageAlt}` +
    (editorialBaseline ? `/${editorialBaseline.axes.imageAlt.maxViolations}` : "") +
    `, workedExample ${editorialSummary.counts.workedExample}` +
    (editorialBaseline ? `/${editorialBaseline.axes.workedExample.maxViolations}` : ""),
);
