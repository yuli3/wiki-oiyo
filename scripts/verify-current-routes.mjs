import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

export const locales = ['en', 'ko', 'ja', 'fr', 'es', 'zh'];
export const migratedTopics = ['meaning-of-saju-60gapja', 'meaning-of-big5', 'meaning-of-cognitive-load'];
// Final production owners verified 2026-09-04. The meaning-of bridge itself
// redirects again, so accepting that intermediate URL would miss broken chains.
export const destinationPaths = {
  'meaning-of-saju-60gapja': 'saju/60gapja/',
  'meaning-of-big5': 'big5/about/',
  'meaning-of-cognitive-load': 'cognitive-load/about/',
};

// http-server does not interpret Pages _redirects. Audit pages and migration
// contracts separately instead of expecting retired documents in dist.
export function verifyArtifact(config, redirects, hasFile) {
  const errors = [];
  for (const value of config.ci.collect.url) {
    const url = new URL(value);
    if (url.origin !== 'http://localhost:8080' || !hasFile(`dist${url.pathname}index.html`)) {
      errors.push(`Missing local audit page: ${value}`);
    }
  }
  const rows = redirects.split(/\r?\n/).map(line => line.trim().split(/\s+/));
  for (const topic of migratedTopics) {
    const expectedSource = `/:lang/${topic}*`;
    const expectedTarget = `https://oiyo.net/:lang/${topic}:splat`;
    if (!rows.some(([source, target, status]) => source === expectedSource && target === expectedTarget && status === '301')) {
      errors.push(`Missing migration contract: ${expectedSource} -> ${expectedTarget} 301`);
    }
  }
  return errors;
}

export async function verifyLive(source, expected, request = fetch) {
  let url = source;
  const chain = [];
  const seen = new Set();
  for (let hop = 0; hop <= 5; hop++) {
    if (seen.has(url)) throw new Error(`Redirect loop: ${url}`);
    seen.add(url);
    const response = await request(url, { method: 'GET', redirect: 'manual', signal: AbortSignal.timeout(20000) });
    const status = response.status;
    const location = response.headers.get('location');
    await response.body?.cancel();
    chain.push({ url, status });
    // 2026-10-05: GitHub 러너 IP는 Cloudflare 봇 차단으로 403을 받는다(09-07부터 매주 실패).
    // 403은 이전 경로가 깨졌다는 증거가 아니므로 실패가 아니라 '확인 불가'로 돌려준다.
    // 실제로 깨진 경우는 404·200·다른 목적지로 나타나고, 그건 아래에서 그대로 실패한다.
    if (status === 403) return { blocked: true, chain };
    if (status >= 300 && status < 400 && location) {
      const next = new URL(location, url);
      if (next.protocol !== 'https:' || !['wiki.oiyo.net', 'oiyo.net'].includes(next.hostname)) {
        throw new Error(`Unexpected redirect destination: ${next.href}`);
      }
      url = next.href;
      continue;
    }
    if (chain[0].status !== 301 || status !== 200 || url !== expected) {
      throw new Error(`Migration failed: ${JSON.stringify(chain)}; expected ${expected}`);
    }
    return chain;
  }
  throw new Error(`Too many redirects: ${source}`);
}

async function main() {
  const errors = verifyArtifact(JSON.parse(readFileSync('lighthouserc.json', 'utf8')), readFileSync('dist/_redirects', 'utf8'), existsSync);
  if (errors.length) throw new Error(errors.join('\n'));
  console.log('PASS: configured Lighthouse pages exist; 3 migrated-topic contracts retained');
  if (!process.argv.includes('--live')) return;
  // A live check is supplementary: it checks production, not the PR preview.
  const blocked = [];
  for (const locale of locales) {
    for (const topic of migratedTopics) {
      const source = `https://wiki.oiyo.net/${locale}/${topic}/`;
      const expected = `https://oiyo.net/${locale}/${destinationPaths[topic]}`;
      const result = await verifyLive(source, expected);
      if (result.blocked) blocked.push(source);
      console.log(JSON.stringify(result));
    }
  }
  if (blocked.length) {
    console.log(`::warning::Live migration check inconclusive: ${blocked.length}/18 URLs returned 403 to this runner (edge bot block). Verify from an unblocked network.`);
    return;
  }
  console.log('PASS: 18 production migration URLs reach the expected OIYO page with HTTP 200');
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
