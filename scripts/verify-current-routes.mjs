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
  for (const locale of locales) {
    for (const topic of migratedTopics) {
      const source = `https://wiki.oiyo.net/${locale}/${topic}/`;
      const expected = `https://oiyo.net/${locale}/${destinationPaths[topic]}`;
      console.log(JSON.stringify(await verifyLive(source, expected)));
    }
  }
  console.log('PASS: 18 production migration URLs reach the expected OIYO page with HTTP 200');
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
