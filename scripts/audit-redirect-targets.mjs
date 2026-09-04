#!/usr/bin/env node
/**
 * `public/_redirects` 와 Bulk SSOT 의 **목적지**를 끝까지 따라가 검사한다.
 *
 * 왜 있나
 * -------
 * 2026-09-04: wiki 콘텐츠를 다른 사이트로 이관한 뒤 카테고리 페이지가 더 이상
 * 빌드되지 않는데 `_redirects` 는 그대로 남아, 고유 목적지 337개 중 **44개가
 * 301 → 404** 였다. 소스가 아니라 목적지가 썩은 것이라 링크 감사로는 안 잡히고,
 * 404 지표로도 안 잡힌다 — 사람이 그 URL 을 실제로 밟아야 세션이 남는다.
 *
 * 301 → 404 는 그냥 404 보다 나쁘다. 크롤러가 홉을 하나 더 쓰고도 빈손이다.
 *
 * 네트워크를 타므로 CI 기본 경로에는 두지 않는다. 리다이렉트를 손댄 뒤,
 * 그리고 콘텐츠를 사이트 밖으로 옮긴 뒤에 손으로 돌린다.
 */
import { readFileSync, existsSync } from "node:fs";

const LOCALES = ["ko", "en", "ja", "fr", "es", "zh"];
const LINE = /^(\s*)(\S+)(\s+)(\S+)(\s+)(\d{3})(\s*)$/;
const SELF = "https://wiki.oiyo.net";

function targetsFrom(path, { splitFields = true } = {}) {
  if (!existsSync(path)) return [];
  const out = [];
  for (const raw of readFileSync(path, "utf8").split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const m = LINE.exec(raw);
    if (!m) continue;
    const target = m[4];
    // 와일드카드가 남는 목적지는 요청마다 달라져 정적으로 못 짚는다.
    if (target.includes(":splat") || target.includes("*")) continue;
    const absolute = target.includes("://") ? target : `${SELF}${target}`;
    if (absolute.includes(":lang")) {
      for (const l of LOCALES) out.push(absolute.replaceAll(":lang", l));
    } else {
      out.push(absolute);
    }
  }
  return out;
}

const targets = [
  ...new Set([
    ...targetsFrom("public/_redirects"),
    ...targetsFrom("data/redirects/canonical-redirects.txt"),
  ]),
].sort();

async function trace(url) {
  const chain = [];
  let current = url;
  for (let hop = 0; hop <= 5; hop += 1) {
    let res;
    try {
      res = await fetch(current, {
        method: "HEAD",
        redirect: "manual",
        signal: AbortSignal.timeout(20_000),
      });
    } catch (error) {
      return { url, status: "ERR", hops: chain.length, note: error.message };
    }
    chain.push(res.status);
    const location = res.headers.get("location");
    if (res.status >= 300 && res.status < 400 && location) {
      current = new URL(location, current).href;
      continue;
    }
    return { url, status: String(res.status), hops: chain.length - 1, final: current };
  }
  return { url, status: "LOOP", hops: 6 };
}

const results = [];
const queue = [...targets];
await Promise.all(
  Array.from({ length: 16 }, async () => {
    for (let next = queue.pop(); next; next = queue.pop()) results.push(await trace(next));
  }),
);

const dead = results.filter((r) => r.status !== "200");
const extraHops = results.filter((r) => r.status === "200" && r.hops > 1);

console.log(
  `고유 목적지 ${results.length} · 최종 200 ${results.length - dead.length} · ` +
    `200 아님 ${dead.length} · 여분 홉 ${extraHops.length}`,
);
for (const r of dead.sort((a, b) => a.url.localeCompare(b.url))) {
  console.log(`  [${r.status}] ${r.url}${r.note ? ` (${r.note})` : ""}`);
}
for (const r of extraHops.sort((a, b) => a.url.localeCompare(b.url))) {
  console.log(`  [홉 ${r.hops}] ${r.url} → ${r.final}`);
}
if (dead.length) process.exitCode = 1;
