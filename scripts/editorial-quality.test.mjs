import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { inspectArticle, loadTiersConfig } from "./lib/editorial-quality.mjs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const tiers = loadTiersConfig(root);

test("wiki dictionary gold vs fake reviewer", () => {
  const load = (slug) => {
    const rel = path.join("ko", `${slug}.mdx`);
    const text = fs.readFileSync(path.join(root, "src/content/blog", rel), "utf8");
    return inspectArticle({ rel, text, tiers });
  };

  const gold = load("meaning-of-cognitive-load");
  assert.equal(gold.tier, "A");
  assert.equal(gold.axes.fakeAuthority, null);

  const fake = load("meaning-of-mbti");
  assert.equal(fake.tier, "A");
  assert.match(fake.axes.fakeAuthority ?? "", /Research Institute/);
});
