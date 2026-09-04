import test from 'node:test';
import assert from 'node:assert/strict';
import { verifyArtifact, verifyLive, migratedTopics } from './verify-current-routes.mjs';

const config = { ci: { collect: { url: ['http://localhost:8080/ko/'] } } };
const redirects = migratedTopics.map(t => `/:lang/${t}* https://oiyo.net/:lang/${t}:splat 301`).join('\n');
test('valid artifact retains migration contracts', () => assert.deepEqual(verifyArtifact(config, redirects, () => true), []));
test('retired Lighthouse URL fails fast', () => assert.match(verifyArtifact(config, redirects, () => false)[0], /Missing local/));
test('missing or wrong redirect fails', () => {
  assert.equal(verifyArtifact(config, '', () => true).length, 3);
  assert.equal(verifyArtifact(config, redirects.replaceAll('301', '302'), () => true).length, 3);
});
const source = 'https://wiki.oiyo.net/ko/meaning-of-big5/';
const target = 'https://oiyo.net/ko/meaning-of-big5/';
const reply = (status, location) => new Response(null, {status, headers: location ? {location} : {}});
test('live contract follows redirect to exact 200 destination', async () => {
  assert.equal((await verifyLive(source, target, async url => url === source ? reply(301, target) : reply(200))).length, 2);
});
test('404, soft replacement, loops and unrelated destinations fail', async () => {
  await assert.rejects(verifyLive(source, target, async () => reply(404)), /Migration failed/);
  await assert.rejects(verifyLive(source, target, async () => reply(200)), /Migration failed/);
  await assert.rejects(verifyLive(source, target, async () => reply(301, source)), /loop/);
  await assert.rejects(verifyLive(source, target, async () => reply(301, 'https://example.com/')), /Unexpected/);
  await assert.rejects(verifyLive(source, target, async url => url === source ? reply(301, 'https://oiyo.net/ko/') : reply(200)), /Migration failed/);
});
