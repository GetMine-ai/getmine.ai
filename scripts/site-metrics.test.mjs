/**
 * Tests for the site's measurement contract (src/scripts/siteMetricsCore.ts):
 * the exact request body of every event, and the builder's refusal of
 * anything outside the contract. The server answers a body it does not
 * recognise with a fixed 400, so what the builder lets through is what counts.
 *
 * Node's built-in runner, no dependency: `pnpm test`.
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  DOWNLOAD_PLATFORMS,
  EVENTS,
  PAGES,
  buildEvent,
} from '../src/scripts/siteMetricsCore.ts';

test('the vocabularies are the ones the contract names', () => {
  assert.deepEqual(EVENTS, [
    'page_view',
    'download_click',
    'download_fallback_click',
    'invite_opened',
    'invite_copied',
  ]);
  assert.deepEqual(PAGES, ['home', 'beta', 'not-found']);
  assert.deepEqual(DOWNLOAD_PLATFORMS, ['mac', 'windows']);
});

test('each event builds its exact body', () => {
  const bodies = [
    [['page_view', { page: 'home' }], '{"event":"page_view","page":"home"}'],
    [['page_view', { page: 'beta' }], '{"event":"page_view","page":"beta"}'],
    [['page_view', { page: 'not-found' }], '{"event":"page_view","page":"not-found"}'],
    [['download_click', { platform: 'mac' }], '{"event":"download_click","platform":"mac"}'],
    [['download_click', { platform: 'windows' }], '{"event":"download_click","platform":"windows"}'],
    [
      ['download_fallback_click', { platform: 'mac' }],
      '{"event":"download_fallback_click","platform":"mac"}',
    ],
    [
      ['download_fallback_click', { platform: 'windows' }],
      '{"event":"download_fallback_click","platform":"windows"}',
    ],
    [['invite_opened', {}], '{"event":"invite_opened"}'],
    [['invite_opened'], '{"event":"invite_opened"}'],
    [['invite_copied', {}], '{"event":"invite_copied"}'],
  ];
  for (const [args, body] of bodies) {
    assert.equal(buildEvent(...args), body);
    // The endpoint refuses anything over 512 bytes before reading it.
    assert.ok(Buffer.byteLength(body) <= 512, body);
  }
});

test('a field given as undefined counts as absent', () => {
  assert.equal(buildEvent('invite_opened', { platform: undefined }), '{"event":"invite_opened"}');
  assert.equal(buildEvent('download_click', { platform: undefined }), null);
});

test('the builder refuses anything outside the contract', () => {
  const refused = [
    // Unknown or malformed events.
    [undefined],
    [null],
    [''],
    ['page-view', { page: 'home' }],
    ['PAGE_VIEW', { page: 'home' }],
    ['section_reached', { section: 'how-it-works' }],
    ['toString'],
    [['page_view'], { page: 'home' }],
    [{ event: 'invite_opened' }],
    // A required field missing.
    ['page_view'],
    ['page_view', {}],
    ['download_click', {}],
    ['download_fallback_click', {}],
    // A value outside its vocabulary.
    ['page_view', { page: 'privacy' }],
    ['page_view', { page: 'Home' }],
    ['page_view', { page: '/beta' }],
    ['page_view', { page: '' }],
    ['page_view', { page: ['home'] }],
    ['page_view', { page: 1 }],
    ['download_click', { platform: 'unsupported' }],
    ['download_click', { platform: 'linux' }],
    ['download_click', { platform: 'Mac' }],
    ['download_click', { platform: true }],
    ['download_fallback_click', { platform: '' }],
    // A field the event does not carry.
    ['page_view', { page: 'home', entry: true }],
    ['page_view', { page: 'home', referrer: 'https://example.com/' }],
    ['page_view', { page: 'beta', platform: 'mac' }],
    ['download_click', { platform: 'mac', src: 'invite' }],
    ['download_click', { platform: 'mac', page: 'beta' }],
    ['invite_opened', { page: 'home' }],
    ['invite_copied', { message: 'hello' }],
    ['invite_copied', { event: 'page_view' }],
    // Fields that are not a plain object.
    ['invite_opened', null],
    ['invite_opened', 'page=home'],
    ['invite_opened', ['page']],
    ['page_view', ['home']],
  ];
  for (const args of refused) {
    assert.equal(buildEvent(...args), null, JSON.stringify(args));
  }
});
