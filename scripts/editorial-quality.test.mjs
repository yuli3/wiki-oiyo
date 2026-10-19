import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { inspectArticle, loadTiersConfig } from "./lib/editorial-quality.mjs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const tiers = loadTiersConfig(root);

test("wiki dictionary gold vs fake reviewer", () => {
  // 2026-10-18: published-page deduplication must not delete the test's evidence.
  // Only the reviewer differs, so the positive/negative authority check stays equally strict.
  const sample = (reviewer) => `---\ntrack: dictionary\ntitle: "개념 표본"\nauthor: "OIYO 편집부"\nreviewer: "${reviewer}"\n---\n\n개념을 설명하는 독립 표본입니다.\n`;
  const inspect = (reviewer) => inspectArticle({ rel: "ko/authority-fixture.mdx", text: sample(reviewer), tiers });
  const gold = inspect("OIYO 편집부");
  assert.equal(gold.tier, "A");
  assert.equal(gold.axes.fakeAuthority, null);

  const fake = inspect("OIYO Research Institute");
  assert.equal(fake.tier, "A");
  assert.match(fake.axes.fakeAuthority ?? "", /Research Institute/);
});
