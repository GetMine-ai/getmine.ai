/**
 * Tests for the pure half of the site's measurement
 * (src/scripts/siteMetricsCore.ts): the entry test, the region bands, the
 * cleaning of a visit's source, the fragment that carries it to the download
 * page, and the exact request body of every event. The server answers a body
 * it does not recognise with a fixed 400, so what the builder lets through is
 * what counts.
 *
 * Node's built-in runner, no dependency: `pnpm test`.
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  DOWNLOAD_PLATFORMS,
  EVENTS,
  PAGES,
  PLATFORMS,
  REGIONS,
  SECTIONS,
  arrivedFromOutside,
  buildEvent,
  cleanRef,
  cleanSrc,
  countChoice,
  decodeVia,
  encodeVia,
  isEntry,
  isViaFragment,
  refFromReferrer,
  regionFromTimeZone,
  srcFromSearch,
} from '../src/scripts/siteMetricsCore.ts';

const ORIGIN = 'https://getmine.ai';

test('the vocabularies are the ones the contract names', () => {
  assert.deepEqual(EVENTS, [
    'page_view',
    'download_click',
    'download_fallback_click',
    'section_reached',
    'invite_opened',
    'invite_copied',
  ]);
  assert.deepEqual(PAGES, ['home', 'beta', 'privacy', 'terms', 'trust', 'welcome', 'not-found']);
  assert.deepEqual(DOWNLOAD_PLATFORMS, ['mac', 'windows']);
  assert.deepEqual(PLATFORMS, ['mac', 'windows', 'unsupported']);
  assert.deepEqual(REGIONS, ['uk', 'europe', 'north-america', 'other']);
  assert.deepEqual(SECTIONS, [
    'why-it-matters',
    'how-it-works',
    'meet-mina',
    'our-promise',
    'about-us',
    'closing',
  ]);
});

test('the entry test: a fresh navigation that arrived from outside the site', () => {
  const table = [
    // navigation type, referrer, entry
    ['navigate', '', true],
    ['navigate', 'https://news.ycombinator.com/item?id=1', true],
    ['navigate', 'https://www.google.com/', true],
    ['navigate', 'android-app://com.google.android.gm/', true],
    // Another origin, however close: scheme, host and port all count.
    ['navigate', 'http://getmine.ai/', true],
    ['navigate', 'https://www.getmine.ai/', true],
    ['navigate', 'https://api.getmine.ai/', true],
    ['navigate', 'https://getmine.ai:8443/', true],
    ['navigate', 'https://getmine.ai.example.com/', true],
    // The site's own /download redirect has no content of its own.
    ['navigate', 'https://getmine.ai/download', true],
    ['navigate', 'https://getmine.ai/download/', true],
    ['navigate', 'https://getmine.ai/download.html', true],
    ['navigate', 'https://getmine.ai/download?src=invite', true],
    // A move within the site.
    ['navigate', 'https://getmine.ai/', false],
    ['navigate', 'https://getmine.ai/beta', false],
    ['navigate', 'https://getmine.ai/privacy?count=off#visit-counting', false],
    ['navigate', 'https://getmine.ai/downloads', false],
    ['navigate', 'https://getmine.ai/beta/download', false],
    // A referrer that cannot be read is no referrer.
    ['navigate', 'not a url', true],
    ['navigate', undefined, true],
    // Never a reload, back or forward, or anything unrecognised.
    ['reload', '', false],
    ['reload', 'https://news.ycombinator.com/', false],
    ['back_forward', '', false],
    ['back_forward', 'https://www.google.com/', false],
    ['prerender', '', false],
    ['', '', false],
    [undefined, '', false],
    ['NAVIGATE', '', false],
  ];
  for (const [navigationType, referrer, entry] of table) {
    assert.equal(
      isEntry(navigationType, referrer, ORIGIN),
      entry,
      `${navigationType} from ${JSON.stringify(referrer)}`,
    );
  }
});

test('arriving from outside does not depend on the navigation type', () => {
  assert.equal(arrivedFromOutside('https://news.ycombinator.com/', ORIGIN), true);
  assert.equal(arrivedFromOutside('', ORIGIN), true);
  assert.equal(arrivedFromOutside('https://getmine.ai/', ORIGIN), false);
  // The origin is whatever serves the site, so a local preview behaves the same.
  assert.equal(arrivedFromOutside('http://localhost:3000/', 'http://localhost:3000'), false);
  assert.equal(arrivedFromOutside('https://getmine.ai/', 'http://localhost:3000'), true);
});

test('the region band comes from the time zone', () => {
  const table = [
    ['Europe/London', 'uk'],
    ['Europe/Belfast', 'uk'],
    ['Europe/Jersey', 'uk'],
    ['Europe/Guernsey', 'uk'],
    ['Europe/Isle_of_Man', 'uk'],
    ['GB', 'uk'],
    ['Europe/Dublin', 'europe'],
    ['Europe/Paris', 'europe'],
    ['Europe/Berlin', 'europe'],
    ['Europe/Kyiv', 'europe'],
    ['Europe/Istanbul', 'europe'],
    ['Europe/Gibraltar', 'europe'],
    ['Atlantic/Reykjavik', 'europe'],
    ['Atlantic/Azores', 'europe'],
    ['Atlantic/Madeira', 'europe'],
    ['Atlantic/Canary', 'europe'],
    ['Atlantic/Faroe', 'europe'],
    ['America/New_York', 'north-america'],
    ['America/Chicago', 'north-america'],
    ['America/Denver', 'north-america'],
    ['America/Phoenix', 'north-america'],
    ['America/Los_Angeles', 'north-america'],
    ['America/Anchorage', 'north-america'],
    ['Pacific/Honolulu', 'north-america'],
    ['America/Indiana/Indianapolis', 'north-america'],
    ['America/Kentucky/Louisville', 'north-america'],
    ['America/North_Dakota/Center', 'north-america'],
    ['US/Pacific', 'north-america'],
    ['America/Toronto', 'north-america'],
    ['America/Vancouver', 'north-america'],
    ['America/Halifax', 'north-america'],
    ['America/St_Johns', 'north-america'],
    ['America/Edmonton', 'north-america'],
    ['Canada/Eastern', 'north-america'],
    // America/ alone is not the test.
    ['America/Mexico_City', 'other'],
    ['America/Sao_Paulo', 'other'],
    ['America/Argentina/Buenos_Aires', 'other'],
    ['America/Puerto_Rico', 'other'],
    ['America/Havana', 'other'],
    // Atlantic/ alone is not the test either.
    ['Atlantic/Bermuda', 'other'],
    ['Atlantic/Stanley', 'other'],
    ['Atlantic/Cape_Verde', 'other'],
    ['Asia/Tokyo', 'other'],
    ['Asia/Kolkata', 'other'],
    ['Australia/Sydney', 'other'],
    ['Africa/Lagos', 'other'],
    ['Pacific/Auckland', 'other'],
    ['UTC', 'other'],
    ['Etc/GMT', 'other'],
    // Unknown, missing or malformed.
    ['Europe', 'other'],
    ['europe/london', 'other'],
    ['Mars/Olympus_Mons', 'other'],
    ['', 'other'],
    [undefined, 'other'],
    [null, 'other'],
    [0, 'other'],
    [{ timeZone: 'Europe/London' }, 'other'],
  ];
  for (const [timeZone, region] of table) {
    assert.equal(regionFromTimeZone(timeZone), region, String(timeZone));
    assert.ok(REGIONS.includes(regionFromTimeZone(timeZone)));
  }
});

test('src is a short plain token or nothing', () => {
  const table = [
    ['invite', 'invite'],
    ['Invite', 'invite'],
    ['NEWSLETTER_2026-10', 'newsletter_2026-10'],
    ['a', 'a'],
    ['7', '7'],
    ['a'.repeat(32), 'a'.repeat(32)],
    ['a'.repeat(33), undefined],
    ['', undefined],
    ['-invite', undefined],
    ['_invite', undefined],
    [' invite', undefined],
    ['invite ', undefined],
    ['invite\n', undefined],
    ['in vite', undefined],
    ['invite.friend', undefined],
    ['invite,r.evil.example', undefined],
    ['invite/../../etc/passwd', undefined],
    ['<script>alert(1)</script>', undefined],
    ['"onmouseover="alert(1)', undefined],
    ["'; DROP TABLE visits;--", undefined],
    ['invite%0d%0aSet-Cookie:x=1', undefined],
    ['jane@example.com', undefined],
    ['07700900123 call me', undefined],
    ['émail', undefined],
    ['İnvite', undefined],
    ['invite\u0000', undefined],
    [undefined, undefined],
    [null, undefined],
    [42, undefined],
    [['invite'], undefined],
    [{ toString: () => 'invite' }, undefined],
  ];
  for (const [value, src] of table) {
    assert.equal(cleanSrc(value), src, JSON.stringify(value));
  }
});

test('src is read from ?src=, or failing that utm_source', () => {
  const table = [
    ['?src=invite', 'invite'],
    ['?utm_source=newsletter', 'newsletter'],
    ['?src=invite&utm_source=newsletter', 'invite'],
    ['?utm_source=newsletter&src=invite', 'invite'],
    ['?src=%3Cscript%3E&utm_source=newsletter', 'newsletter'],
    ['?count=off&src=Invite', 'invite'],
    ['?src=invite&src=other', 'invite'],
    ['src=invite', 'invite'],
    ['?src=', undefined],
    ['?src=a+b', undefined],
    ['?src=jane%40example.com', undefined],
    ['?utm_campaign=launch', undefined],
    ['?SRC=invite', undefined],
    ['', undefined],
    [undefined, undefined],
  ];
  for (const [search, src] of table) {
    assert.equal(srcFromSearch(search), src, JSON.stringify(search));
  }
});

test('ref is a hostname or nothing', () => {
  const longest = `${'a'.repeat(60)}.com`;
  const table = [
    ['news.ycombinator.com', 'news.ycombinator.com'],
    ['www.google.com', 'google.com'],
    ['WWW.Example.CO.UK', 'example.co.uk'],
    ['www.www.example.com', 'www.example.com'],
    ['wwwexample.com', 'wwwexample.com'],
    ['t.co', 't.co'],
    ['localhost', undefined],
    ['intranet', undefined],
    ['192.168.1.10', undefined],
    ['10.0.0.1.example.com', '10.0.0.1.example.com'],
    ['getmine.ai', undefined],
    ['www.getmine.ai', undefined],
    ['api.getmine.ai', undefined],
    ['notgetmine.ai', 'notgetmine.ai'],
    ['xn--bcher-kva.example', 'xn--bcher-kva.example'],
    [longest, longest],
    [`a${longest}`, undefined],
    ['', undefined],
    ['www.', undefined],
    ['.example.com', undefined],
    ['example.com.', undefined],
    ['example..com', undefined],
    ['-example.com', undefined],
    ['example-.com', undefined],
    ['exa_mple.com', undefined],
    ['example.com/path', undefined],
    ['example.com?q=1', undefined],
    ['example.com#frag', undefined],
    ['example.com:8080', undefined],
    ['user@example.com', undefined],
    ['example.com,s.invite', undefined],
    ['[::1]', undefined],
    ['bücher.example', undefined],
    ['<script>alert(1)</script>', undefined],
    ['example.com\n', undefined],
    [' example.com', undefined],
    [undefined, undefined],
    [null, undefined],
    [42, undefined],
    [['example.com'], undefined],
  ];
  for (const [value, ref] of table) {
    assert.equal(cleanRef(value), ref, JSON.stringify(value));
  }
});

test('ref is the hostname of a referrer on another origin, never its path or query', () => {
  const table = [
    ['https://news.ycombinator.com/item?id=12345', 'news.ycombinator.com'],
    ['https://www.google.com/search?q=private+health+records', 'google.com'],
    ['https://user:secret@Example.com:8443/inbox/thread/42?token=abc#top', 'example.com'],
    ['http://localhost:4321/preview', undefined],
    ['https://www.getmine.ai/', undefined],
    ['http://192.168.1.10/wiki', undefined],
    ['android-app://com.google.android.gm/', 'com.google.android.gm'],
    ['https://bücher.example/', 'xn--bcher-kva.example'],
    // The site itself is not a referrer.
    ['https://getmine.ai/', undefined],
    ['https://getmine.ai/download', undefined],
    ['https://getmine.ai/beta#via=r.evil.example', undefined],
    // Nothing usable.
    ['', undefined],
    ['about:blank', undefined],
    ['javascript:alert(1)', undefined],
    ['data:text/html,<script>alert(1)</script>', undefined],
    ['file:///Users/someone/Documents/notes.html', undefined],
    ['https://[2001:db8::1]/', undefined],
    [`https://${'a'.repeat(62)}.example/`, undefined],
    ['https://exa_mple.com/', undefined],
    ['not a url', undefined],
    [undefined, undefined],
    [null, undefined],
    [{ href: 'https://example.com/' }, undefined],
  ];
  for (const [referrer, ref] of table) {
    assert.equal(refFromReferrer(referrer, ORIGIN), ref, JSON.stringify(referrer));
  }
});

test('the via fragment round-trips a source', () => {
  const table = [
    [{ src: 'invite' }, 'via=s.invite'],
    [{ ref: 'news.ycombinator.com' }, 'via=r.news.ycombinator.com'],
    [{ src: 'hn', ref: 'news.ycombinator.com' }, 'via=s.hn,r.news.ycombinator.com'],
    [{ src: 'a_b-c', ref: 'xn--bcher-kva.example' }, 'via=s.a_b-c,r.xn--bcher-kva.example'],
    [{ src: 's', ref: 'r.s' }, 'via=s.s,r.r.s'],
  ];
  for (const [source, fragment] of table) {
    assert.equal(encodeVia(source), fragment);
    assert.deepEqual(decodeVia(fragment), source);
    assert.deepEqual(decodeVia(`#${fragment}`), source);
    assert.equal(isViaFragment(`#${fragment}`), true);
  }
});

test('encoding cleans what it is given, and carries nothing when there is nothing clean', () => {
  assert.equal(encodeVia({ src: 'Invite', ref: 'WWW.Example.com' }), 'via=s.invite,r.example.com');
  assert.equal(encodeVia({ src: '<script>', ref: 'example.com' }), 'via=r.example.com');
  assert.equal(encodeVia({ src: 'invite', ref: 'example.com/path' }), 'via=s.invite');
  assert.equal(encodeVia({ src: undefined, ref: undefined }), undefined);
  assert.equal(encodeVia({ src: 'a b', ref: 'exa_mple.com' }), undefined);
  assert.equal(encodeVia({}), undefined);
});

test('a via fragment this site would not have written is rejected', () => {
  const rejected = [
    '',
    '#',
    'via',
    'via=',
    '#via=',
    'via=s.',
    'via=r.',
    'via=invite',
    'via=x.invite',
    'via=s.invite,',
    'via=,s.invite',
    'via=s.invite,s.other',
    'via=r.a.example,r.b.example',
    'via=r.example.com,s.invite',
    'via=s.invite,r.example.com,s.again',
    'via=s.Invite',
    'via=r.Example.com',
    'via=r.www.example.com',
    'via=s.invite r.example.com',
    'via=s.invite;r.example.com',
    'via=s.invite&via=s.other',
    'via=s.' + 'a'.repeat(33),
    'via=r.' + 'a'.repeat(62) + '.example',
    'via=r.example.com/path',
    'via=r.example.com?q=1',
    'via=s.%69nvite',
    'via=s.<script>alert(1)</script>',
    'via=r.javascript:alert(1)',
    'VIA=s.invite',
    ' via=s.invite',
    '##via=s.invite',
    'meet-mina',
    '#visit-counting',
    'xvia=s.invite',
    undefined,
    null,
    42,
    { src: 'invite' },
  ];
  for (const fragment of rejected) {
    assert.equal(decodeVia(fragment), undefined, JSON.stringify(fragment));
  }
  // Recognised as a via fragment (so it is cleared from the address bar) even
  // when its content is refused.
  assert.equal(isViaFragment('#via=s.<script>'), true);
  assert.equal(isViaFragment('via='), true);
  assert.equal(isViaFragment('#meet-mina'), false);
  assert.equal(isViaFragment(''), false);
  assert.equal(isViaFragment(undefined), false);
});

test('?count= is off, on, or nothing', () => {
  const table = [
    ['?count=off', 'off'],
    ['?count=on', 'on'],
    ['?src=invite&count=off', 'off'],
    ['?count=off&count=on', 'off'],
    ['?count=OFF', undefined],
    ['?count=', undefined],
    ['?count', undefined],
    ['?count=0', undefined],
    ['?count=off%20', undefined],
    ['?counting=off', undefined],
    ['', undefined],
    [undefined, undefined],
  ];
  for (const [search, choice] of table) {
    assert.equal(countChoice(search), choice, JSON.stringify(search));
  }
});

test('each event builds its exact body', () => {
  const bodies = [
    // The first release's bodies, unchanged.
    [['page_view', { page: 'home' }], '{"event":"page_view","page":"home"}'],
    [['download_click', { platform: 'mac' }], '{"event":"download_click","platform":"mac"}'],
    [
      ['download_fallback_click', { platform: 'windows' }],
      '{"event":"download_fallback_click","platform":"windows"}',
    ],
    [['invite_opened'], '{"event":"invite_opened"}'],
    [['invite_copied', {}], '{"event":"invite_copied"}'],
    // A page view inside the site.
    [
      ['page_view', { page: 'privacy', entry: false }],
      '{"event":"page_view","page":"privacy","entry":false}',
    ],
    [
      ['page_view', { page: 'beta', entry: false, platform: 'unsupported' }],
      '{"event":"page_view","page":"beta","entry":false,"platform":"unsupported"}',
    ],
    // A visit.
    [
      ['page_view', { page: 'home', entry: true, region: 'uk' }],
      '{"event":"page_view","page":"home","entry":true,"region":"uk"}',
    ],
    [
      ['page_view', { page: 'home', entry: true, region: 'europe', src: 'invite' }],
      '{"event":"page_view","page":"home","entry":true,"region":"europe","src":"invite"}',
    ],
    [
      ['page_view', { page: 'welcome', entry: true, region: 'other', ref: 'sibforms.com' }],
      '{"event":"page_view","page":"welcome","entry":true,"region":"other","ref":"sibforms.com"}',
    ],
    // Keys are written in contract order, whatever order they arrive in, and
    // undefined counts as absent.
    [
      [
        'page_view',
        {
          platform: 'mac',
          ref: 'news.ycombinator.com',
          src: undefined,
          region: 'north-america',
          entry: true,
          page: 'beta',
        },
      ],
      '{"event":"page_view","page":"beta","entry":true,"region":"north-america","ref":"news.ycombinator.com","platform":"mac"}',
    ],
    // A download press says where the visit came from, when the page knows.
    [
      ['download_click', { platform: 'windows', src: 'invite' }],
      '{"event":"download_click","platform":"windows","src":"invite"}',
    ],
    [
      ['download_click', { ref: 'news.ycombinator.com', src: 'hn', platform: 'mac' }],
      '{"event":"download_click","platform":"mac","src":"hn","ref":"news.ycombinator.com"}',
    ],
    [
      ['download_click', { platform: 'mac', src: undefined, ref: undefined }],
      '{"event":"download_click","platform":"mac"}',
    ],
    [
      ['section_reached', { section: 'how-it-works' }],
      '{"event":"section_reached","section":"how-it-works"}',
    ],
    [['section_reached', { section: 'closing' }], '{"event":"section_reached","section":"closing"}'],
  ];
  for (const [args, body] of bodies) {
    assert.equal(buildEvent(...args), body);
  }
});

test('every page, platform, region and section in the vocabulary is accepted', () => {
  for (const page of PAGES) {
    assert.ok(buildEvent('page_view', { page, entry: false }), page);
    for (const region of REGIONS) {
      assert.ok(buildEvent('page_view', { page, entry: true, region }), `${page} ${region}`);
    }
  }
  for (const platform of PLATFORMS) {
    assert.ok(buildEvent('page_view', { page: 'beta', entry: false, platform }), platform);
  }
  for (const platform of DOWNLOAD_PLATFORMS) {
    assert.ok(buildEvent('download_click', { platform }), platform);
    assert.ok(buildEvent('download_fallback_click', { platform }), platform);
  }
  for (const section of SECTIONS) {
    assert.ok(buildEvent('section_reached', { section }), section);
  }
});

test('the builder refuses anything outside the contract', () => {
  const visit = { page: 'home', entry: true, region: 'uk' };
  const refused = [
    // Unknown or malformed events.
    [undefined],
    [null],
    [''],
    ['page-view', { page: 'home' }],
    ['PAGE_VIEW', { page: 'home' }],
    ['visit', { page: 'home' }],
    ['toString'],
    [['page_view'], { page: 'home' }],
    [{ event: 'invite_opened' }],
    // A required field missing.
    ['page_view'],
    ['page_view', {}],
    ['page_view', { entry: false }],
    ['download_click', {}],
    ['download_click', { src: 'invite' }],
    ['download_fallback_click', {}],
    ['section_reached', {}],
    // A value outside its vocabulary.
    ['page_view', { page: 'pricing' }],
    ['page_view', { page: 'Home' }],
    ['page_view', { page: '/beta' }],
    ['page_view', { page: '' }],
    ['page_view', { page: ['home'] }],
    ['page_view', { page: 'home', entry: 'true' }],
    ['page_view', { page: 'home', entry: 1 }],
    ['page_view', { page: 'home', entry: null }],
    ['page_view', { ...visit, region: 'asia' }],
    ['page_view', { ...visit, region: 'UK' }],
    ['page_view', { ...visit, region: 'Europe/London' }],
    ['page_view', { page: 'beta', entry: false, platform: 'linux' }],
    ['page_view', { page: 'beta', entry: false, platform: '' }],
    ['download_click', { platform: 'unsupported' }],
    ['download_click', { platform: 'linux' }],
    ['download_click', { platform: 'Mac' }],
    ['download_click', { platform: true }],
    ['download_fallback_click', { platform: 'unsupported' }],
    ['section_reached', { section: 'hero' }],
    ['section_reached', { section: 'top' }],
    ['section_reached', { section: 'How-It-Works' }],
    ['section_reached', { section: 3 }],
    // src and ref must arrive clean: the builder refuses, it does not repair.
    ['page_view', { ...visit, src: 'Invite' }],
    ['page_view', { ...visit, src: 'a'.repeat(33) }],
    ['page_view', { ...visit, src: '' }],
    ['page_view', { ...visit, src: 'jane@example.com' }],
    ['page_view', { ...visit, src: '<script>alert(1)</script>' }],
    ['page_view', { ...visit, src: ['invite'] }],
    ['page_view', { ...visit, ref: 'www.google.com' }],
    ['page_view', { ...visit, ref: 'Google.com' }],
    ['page_view', { ...visit, ref: 'https://news.ycombinator.com/item?id=1' }],
    ['page_view', { ...visit, ref: 'example.com/inbox' }],
    ['page_view', { ...visit, ref: `${'a'.repeat(62)}.example` }],
    ['page_view', { ...visit, ref: '' }],
    ['page_view', { ...visit, ref: 42 }],
    ['download_click', { platform: 'mac', src: 'in vite' }],
    ['download_click', { platform: 'mac', ref: 'example.com?q=secret' }],
    // Region, src and ref describe a visit: only an entry carries them, and an
    // entry always has a region.
    ['page_view', { page: 'home', entry: true }],
    ['page_view', { page: 'home', entry: true, src: 'invite' }],
    ['page_view', { page: 'home', entry: false, region: 'uk' }],
    ['page_view', { page: 'home', entry: false, src: 'invite' }],
    ['page_view', { page: 'home', entry: false, ref: 'google.com' }],
    ['page_view', { page: 'home', region: 'uk' }],
    ['page_view', { page: 'home', ref: 'google.com' }],
    // Only the download page detects a platform.
    ['page_view', { page: 'home', entry: false, platform: 'mac' }],
    ['page_view', { ...visit, platform: 'unsupported' }],
    // A field the event does not carry.
    ['page_view', { page: 'home', referrer: 'https://example.com/' }],
    ['page_view', { page: 'home', section: 'closing' }],
    ['page_view', { ...visit, timeZone: 'Europe/London' }],
    ['page_view', { ...visit, url: 'https://getmine.ai/?src=invite' }],
    ['download_click', { platform: 'mac', page: 'beta' }],
    ['download_click', { platform: 'mac', region: 'uk' }],
    ['download_click', { platform: 'mac', entry: true }],
    ['download_fallback_click', { platform: 'mac', src: 'invite' }],
    ['section_reached', { section: 'closing', page: 'home' }],
    ['invite_opened', { page: 'home' }],
    ['invite_opened', { src: 'invite' }],
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

test('the longest body the builder can produce fits the 512-byte limit', () => {
  const body = buildEvent('page_view', {
    page: 'not-found',
    entry: true,
    region: 'north-america',
    src: 'a'.repeat(32),
    ref: `${'a'.repeat(60)}.com`,
  });
  assert.ok(body);
  assert.ok(Buffer.byteLength(body) <= 512, `${Buffer.byteLength(body)} bytes`);
  const click = buildEvent('download_click', {
    platform: 'windows',
    src: 'a'.repeat(32),
    ref: `${'a'.repeat(60)}.com`,
  });
  assert.ok(click);
  assert.ok(Buffer.byteLength(click) <= 512, `${Buffer.byteLength(click)} bytes`);
});
