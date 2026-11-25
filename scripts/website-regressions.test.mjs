import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import vm from 'node:vm';
import { releaseTargetErrors } from './assert-release-target.mjs';
import { whatsappNumber } from '../src/data/whatsapp.ts';

const root = new URL('../', import.meta.url);
const deviceScript = readFileSync(new URL('public/device-actions.js', root), 'utf8');
const device = navigator => {
  const document = { documentElement: { dataset: {} } };
  vm.runInNewContext(deviceScript, { navigator, document });
  return document.documentElement.dataset.deviceClass;
};

test('narrow computers and touch Windows remain installable; phones/tablets hand off directly', () => {
  // Width is deliberately absent: rotating or resizing must not change device type.
  assert.equal(device({ platform: 'MacIntel', userAgent: 'Macintosh', maxTouchPoints: 0 }), 'desktop');
  assert.equal(device({ platform: 'Win32', userAgent: 'Windows NT 10.0', maxTouchPoints: 10 }), 'desktop');
  assert.equal(device({ platform: 'iPhone', userAgent: 'iPhone', maxTouchPoints: 5 }), 'mobile');
  assert.equal(device({ platform: 'Linux armv8l', userAgent: 'Android', maxTouchPoints: 5 }), 'mobile');
  assert.equal(device({ platform: 'MacIntel', userAgent: 'Macintosh', maxTouchPoints: 5 }), 'mobile');
  assert.equal(device({ userAgentData: { mobile: true, platform: 'Android' } }), 'mobile');
});

test('publication refuses missing, obsolete or mismatched installer approval', () => {
  assert.ok(releaseTargetErrors('').length);
  assert.ok(releaseTargetErrors('wave-11').length);
  const group = { mac: { filename: 'GetMine-Installer.pkg', url: 'https://github.com/GetMine-ai/releases/releases/download/rc4-test/GetMine-Installer.pkg' } };
  assert.deepEqual(releaseTargetErrors('rc4-test', [group]), []);
  assert.ok(releaseTargetErrors('rc4-other', [group]).length);
  assert.ok(releaseTargetErrors('rc4-test', [{ mac: { ...group.mac, url: group.mac.url.replace('github.com', 'example.com') } }]).length);
});

test('every built WhatsApp recipient matches the destination Sabine approved for RC4', () => {
  assert.equal(whatsappNumber, '447746959359', 'Mike must explicitly update this approved release destination if routing changes');
  let count = 0;
  const scan = dir => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const file = new URL(entry.name + (entry.isDirectory() ? '/' : ''), dir);
      if (entry.isDirectory()) scan(file);
      else if (entry.name.endsWith('.html')) {
        const html = readFileSync(file, 'utf8');
        for (const [, recipient] of html.matchAll(/https:\/\/wa\.me\/([0-9]+)/g)) {
          count++;
          assert.equal(recipient, whatsappNumber, file.pathname);
        }
        assert.ok(!html.includes('__WHATSAPP_LINK__'), file.pathname);
      }
    }
  };
  scan(new URL('dist/', root));
  assert.ok(count > 10, 'audit must cover the whole built website');
});

test('published aliases, social canonical and intrinsic illustration sizes survive the build', () => {
  const read = path => readFileSync(new URL('dist/' + path, root), 'utf8');
  for (const route of ['website', 'privacy', 'terms', 'trust', 'press', 'welcome', 'download', 'press/pkb-2026-10-19']) {
    assert.equal(read(route + '/index.html'), read(route + '.html'));
  }
  assert.match(read('index.html'), /<title>GetMine/);
  assert.match(read('index.html'), /property="og:url" content="https:\/\/getmine.ai\/"/);
  const html = read('website.html');
  for (const [asset, width, height] of [['vault-app.webp',1641,850],['hero-monitor-greeting.jpg',888,870],['shingles-box.jpg',800,548]]) {
    const tag = html.match(new RegExp('<img[^>]+src="/assets/site/' + asset.replace('.', '\\.') + '"[^>]*>'))?.[0];
    assert.ok(tag, asset);
    assert.ok(tag.includes(`width="${width}"`) && tag.includes(`height="${height}"`), asset);
  }
});
