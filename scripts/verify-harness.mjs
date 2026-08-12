import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

// 2026-07-28 orphan 정리에서 `docs/implementation-control-board.md` 가 삭제됐다(2.5개월
// 미수정 + superseded 된 MASTER_PLAN.md 를 가리키던 문서). wiki 는 애초에 자기 사본을
// 참조한 적이 없고 blog 사본을 절대경로로 가리키고 있었다. 그런데 이 목록만 갱신되지 않아
// **CI 가 8일간 빨간불**이었다 — 문서 인용만 세면 orphan 이지만 이 스크립트가 소비처였다.
// 되돌리지 말 것: 문서는 죽었고, 계약을 문서에 맞춘 것이다.
const requiredFiles = [
  "AGENTS.md",
  "CLAUDE.md",
  "GEMINI.md",
  "CURSOR.md",
  ".cursor/rules/project-harness.mdc",
  // Internal prose moved to company-brain/AI-Sessions/raw/project-docs/wiki/docs/
  // on 2026-08-12 before this repo went public. Nothing here parsed those files —
  // this list only checked that they existed.
  "data/catalog/category-registry.yaml",
  "data/catalog/content-inventory.master.csv",
  "data/catalog/workboard.yaml",
  "src/lib/mdx-component-registry.ts",
];

const requiredScripts = [
  "build",
  "type-check",
  "lint",
  "validate:i18n",
  "validate:personality",
  "verify:harness",
];

let ok = true;

for (const rel of requiredFiles) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) {
    console.error(`missing file: ${rel}`);
    ok = false;
  }
}

const pkgPath = path.join(root, "package.json");
if (!fs.existsSync(pkgPath)) {
  console.error("missing file: package.json");
  ok = false;
} else {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  const scripts = pkg.scripts ?? {};
  for (const name of requiredScripts) {
    if (!scripts[name]) {
      console.error(`missing package script: ${name}`);
      ok = false;
    }
  }
}

if (!ok) {
  console.error("harness verification failed");
  process.exit(1);
}

console.log("harness verification passed");
