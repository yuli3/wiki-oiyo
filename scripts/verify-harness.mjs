import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

// 2026-07-28 orphan 정리에서 `docs/implementation-control-board.md` 가 삭제됐다(2.5개월
// 미수정 + superseded 된 MASTER_PLAN.md 를 가리키던 문서). wiki 는 애초에 자기 사본을
// 참조한 적이 없고 blog 사본을 절대경로로 가리키고 있었다. 그런데 이 목록만 갱신되지 않아
// **CI 가 8일간 빨간불**이었다 — 문서 인용만 세면 orphan 이지만 이 스크립트가 소비처였다.
// 되돌리지 말 것: 문서는 죽었고, 계약을 문서에 맞춘 것이다.
  // 2026-08-18: `GEMINI.md` 를 이 목록에서 뺐다. 세운 지시로 wiki·game·blog 세 사본을
// 모두 삭제했기 때문이다(그 파일은 /Users/seuncho/coding/blog/AGENTS.md 를 절대경로로
// 가리켰고 — repo 밖 읽기 — Gemini 는 company-brain/runtimes.json 의 활성 런타임도 아니다).
// 삭제 커밋이 이 목록을 함께 고치지 않아 CI 가 곧바로 빨간불이 됐다. 위 2026-07-28 주석이
// 경고하던 바로 그 실패를 반복한 것이다: **이 스크립트가 소비처다.**
const requiredFiles = [
  "AGENTS.md",
  "CLAUDE.md",
  "CURSOR.md",
  ".cursor/rules/project-harness.mdc",
  // Internal prose moved to company-brain/AI-Sessions/raw/project-docs/wiki/docs/
  // on 2026-08-12 before this repo went public. Nothing here parsed those files —
  // this list only checked that they existed.
  "data/catalog/category-registry.yaml",
  "data/catalog/content-inventory.master.csv",
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
