#!/usr/bin/env node
// 같은 slug의 로케일 버전이 ko 원문과 같은 주제인지 선별하는 감사.
// 2026-10-17 감사(content-design-3s S3): ko 미세먼지 ↔ ja·zh·fr·es 체감온도처럼 같은 URL에 다른 주제가
// 올라가 hreflang으로 묶여 있었다. 번역은 숫자·약어·법령 번호를 대부분 그대로 옮기므로
// 본문의 숫자·라틴 약어 집합을 언어 무관 지문으로 쓴다.
//   의심 = ko와의 지문 유사도 < THRESHOLD
// 의심 쌍은 src/config/locale-topic-parity.json의 mismatch(차단) 또는 reviewedMatch(사람이 같은 주제로 판정)
// 중 하나에 반드시 있어야 한다. --check는 미분류 의심이 있으면 실패한다. 임계값을 올려 통과시키지 않는다.
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const DIR = path.join(ROOT, "src/content/blog");
const CONFIG = JSON.parse(fs.readFileSync(path.join(ROOT, "src/config/locale-topic-parity.json"), "utf8"));
const REF = CONFIG.reference ?? "ko";
const THRESHOLD = 0.25;
const check = process.argv.includes("--check");
const asJson = process.argv.includes("--json");

const signature = (text) => {
  const body = text.replace(/^---[\s\S]*?---/, "");
  const nums = (body.match(/\d+(?:[.,]\d+)?/g) ?? []).map((n) => n.replace(",", ".")).filter((n) => n.length >= 2);
  const latin = body.match(/\b[A-Z][A-Za-z0-9.\-]*[A-Z0-9][A-Za-z0-9.\-]*\b/g) ?? [];
  return new Set([...nums, ...latin]);
};
const jaccard = (a, b) => {
  const inter = [...a].filter((x) => b.has(x)).length;
  const union = new Set([...a, ...b]).size;
  return union ? inter / union : 0;
};
const titleOf = (text) => (text.match(/^title:\s*"?(.*?)"?\s*$/m) ?? [])[1] ?? "";
const h2Of = (text) => (text.match(/^## .*/gm) ?? []).map((h) => h.slice(3));

const classified = (list) => {
  const map = new Map();
  for (const e of list ?? []) for (const l of e.locales) map.set(`${e.slug}|${l}`, e.note);
  return map;
};
const mismatch = classified(CONFIG.mismatch);
const reviewed = classified(CONFIG.reviewedMatch);

const locales = fs.readdirSync(DIR).filter((d) => fs.statSync(path.join(DIR, d)).isDirectory() && d !== REF);
const rows = [];
for (const locale of locales) {
  for (const file of fs.readdirSync(path.join(DIR, locale)).filter((f) => f.endsWith(".mdx"))) {
    const slug = file.replace(/\.mdx$/, "");
    const refPath = path.join(DIR, REF, file);
    if (!fs.existsSync(refPath)) continue; // 로케일 전용 글은 대조 대상이 아니다
    const ref = fs.readFileSync(refPath, "utf8");
    const own = fs.readFileSync(path.join(DIR, locale, file), "utf8");
    const similarity = jaccard(signature(ref), signature(own));
    const key = `${slug}|${locale}`;
    const status = mismatch.has(key) ? "mismatch" : reviewed.has(key) ? "reviewed-match" : similarity < THRESHOLD ? "UNCLASSIFIED" : "auto-match";
    rows.push({ slug, locale, similarity: Number(similarity.toFixed(2)), status, refTitle: titleOf(ref), title: titleOf(own), refH2: h2Of(ref).length, h2: h2Of(own).length });
  }
}

if (asJson) console.log(JSON.stringify(rows, null, 2));
else {
  for (const r of rows.sort((a, b) => a.slug.localeCompare(b.slug) || a.locale.localeCompare(b.locale))) {
    console.log(`${r.status.padEnd(14)} ${r.slug.padEnd(28)} ${r.locale}  sim=${r.similarity.toFixed(2)}  h2 ${r.refH2}→${r.h2}  ${r.title.slice(0, 60)}`);
  }
  const count = (s) => rows.filter((r) => r.status === s).length;
  console.log(`\npairs=${rows.length} mismatch=${count("mismatch")} reviewed-match=${count("reviewed-match")} auto-match=${count("auto-match")} unclassified=${count("UNCLASSIFIED")}`);
}

const stale = [...mismatch.keys(), ...reviewed.keys()].filter((k) => !rows.some((r) => `${r.slug}|${r.locale}` === k));
if (check) {
  const bad = rows.filter((r) => r.status === "UNCLASSIFIED");
  if (bad.length || stale.length) {
    for (const r of bad) console.error(`미분류 의심: ${r.locale}/${r.slug} (sim ${r.similarity})`);
    for (const k of stale) console.error(`설정에만 있는 항목: ${k}`);
    process.exit(1);
  }
}
