/**
 * Release assertions for the download links, in two stages:
 *
 *   links     (default) network checks against the published release assets:
 *             each URL resolves, is served as an attachment, carries the
 *             configured version, and its published `.sha256` sidecar matches
 *             the checksum configured in src/data/builds.ts.
 *   rendered  inspection of the BUILT site: dist/beta.html must exist and
 *             must contain each configured checksum verbatim. This stage can
 *             only run after `astro build`, so build:release invokes it as a
 *             separate post-build step (assert:downloads, then astro build,
 *             then assert:rendered).
 */
import { readFile } from 'node:fs/promises';
import { builds } from '../src/data/builds.ts';

const stage = process.argv[2] ?? 'links';
const platforms = Object.entries(builds);
const failures = [];

const describe = (error) => (error instanceof Error ? error.message : String(error));

if (stage === 'links') {
  for (const [platform, build] of platforms) {
    if (!build.url) {
      failures.push(`${platform}: no release URL configured`);
      continue;
    }

    let response;
    try {
      response = await fetch(build.url, {
        method: 'HEAD',
        redirect: 'follow',
        signal: AbortSignal.timeout(15_000),
      });
    } catch (error) {
      failures.push(`${platform}: ${describe(error)}`);
      continue;
    }

    if (response.status !== 200) {
      failures.push(`${platform}: release URL returned HTTP ${response.status}`);
      continue;
    }

    const disposition = response.headers.get('content-disposition') ?? '';
    if (!/\battachment\b/i.test(disposition)) {
      failures.push(`${platform}: response is not marked as an attachment`);
    }

    const releaseIdentity = `${response.url} ${disposition} ${build.filename}`;
    if (!releaseIdentity.includes(build.version)) {
      failures.push(
        `${platform}: configured version ${build.version} is absent from the resolved release identity`,
      );
    }

    // The published `.sha256` sidecar must agree with the configured checksum,
    // so the site can never claim a checksum the release does not carry.
    if (!build.sha256) {
      failures.push(`${platform}: no sha256 configured`);
      continue;
    }
    try {
      const sidecar = await fetch(`${build.url}.sha256`, {
        redirect: 'follow',
        signal: AbortSignal.timeout(15_000),
      });
      if (sidecar.status !== 200) {
        failures.push(`${platform}: checksum sidecar returned HTTP ${sidecar.status}`);
      } else {
        const published = (await sidecar.text()).trim().split(/\s+/)[0]?.toLowerCase() ?? '';
        if (published !== build.sha256.toLowerCase()) {
          failures.push(
            `${platform}: published checksum ${published || '(empty)'} does not match configured ${build.sha256}`,
          );
        }
      }
    } catch (error) {
      failures.push(`${platform}: checksum sidecar fetch failed: ${describe(error)}`);
    }
  }
} else if (stage === 'rendered') {
  // Runs against the BUILT site: astro build must have completed first.
  const distPath = new URL('../dist/beta.html', import.meta.url);
  let html;
  try {
    html = await readFile(distPath, 'utf8');
  } catch (error) {
    failures.push(`dist/beta.html could not be read (run astro build first): ${describe(error)}`);
  }

  if (html !== undefined) {
    for (const [platform, build] of platforms) {
      if (!build.sha256) {
        failures.push(`${platform}: no sha256 configured`);
        continue;
      }
      if (!html.includes(build.sha256)) {
        failures.push(`${platform}: checksum ${build.sha256} is not rendered in dist/beta.html`);
      }
    }

    // The platform cards are the download actions themselves. Keep the release
    // page to one click per operating system rather than restoring the former
    // selector-then-download interaction.
    const downloadActions = html.match(/<a\b[^>]*\bdata-download-link\b[^>]*>/g) ?? [];
    if (downloadActions.length !== 2) {
      failures.push(`rendered page has ${downloadActions.length} platform download actions, expected 2`);
    }
    if (html.includes('data-platform-tab')) {
      failures.push('rendered page contains the retired platform selector');
    }
    for (const platform of ['mac', 'windows']) {
      if (!html.includes(`data-platform-panel="${platform}"`)) {
        failures.push(`${platform}: direct platform card is absent from dist/beta.html`);
      }
    }
    if (!html.includes('Choose macOS or Windows. Your download starts with one click.')) {
      failures.push('one-click platform guidance is absent from dist/beta.html');
    }
    // The receipt (MINION-21, 5 Sep): two lines, nothing else in the box.
    for (const line of ['Download started', 'Your browser is bringing it in.']) {
      if (!html.includes(line)) failures.push(`the receipt line "${line}" is absent from dist/beta.html`);
    }
    // Mina's second message names the file the visitor is about to open, per
    // platform, and stays conditional: the page cannot know the file landed.
    // A shared sentence here would send Windows visitors looking for a .pkg
    // (ruled 4 Sep).
    for (const [platform, build] of platforms) {
      const opening = `When it’s downloaded, open ${build.filename}.`;
      if (!html.includes(opening)) {
        failures.push(`${platform}: Mina’s message naming ${build.filename} is absent from dist/beta.html`);
      }
    }
    if (!html.includes('While you’re waiting') || !html.includes('Invite a friend')) {
      failures.push('Mina’s waiting section or the invite section is absent from dist/beta.html');
    }
    // Without JavaScript the waiting section and both of Mina's messages render
    // at once (MINION-21 §4c): the static HTML must not hide them.
    const waiting = html.match(/<section\b[^>]*\bdata-waiting\b[^>]*>/)?.[0] ?? '';
    if (!waiting) failures.push('the waiting section is absent from dist/beta.html');
    else if (/\bhidden\b/.test(waiting)) failures.push('the waiting section is hidden in static HTML; only JavaScript may hide it');
    const laterMessages = html.match(/<p\b[^>]*data-mina-message="2"[^>]*>/g) ?? [];
    if (laterMessages.length !== 2) failures.push(`expected 2 static second messages (one per platform), found ${laterMessages.length}`);
    if (laterMessages.some((m) => /\bhidden\b/.test(m))) failures.push('a second message is hidden in static HTML; only JavaScript may hide it');
    // The browser owns a native cross-origin download; the page cannot observe
    // its progress, so it must never claim to (Sabine, 4 Sep). Carried from main.
    if (html.includes('data-download-progress') || html.includes('Downloading GetMine')) {
      failures.push('the page has restored a progress claim it cannot observe');
    }
    for (const retired of ['What happens next', 'What to expect', 'Your privacy is built in']) {
      if (html.includes(retired)) failures.push(`retired section "${retired}" is still rendered in dist/beta.html`);
    }
  }
} else {
  failures.push(`unknown stage '${stage}' (expected 'links' or 'rendered')`);
}

if (failures.length > 0) {
  console.error(`Download release assertion (${stage}) failed:`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(
  stage === 'rendered'
    ? 'Rendered download assertion passed: direct platform actions, the receipt, Mina’s minute and checksums are present.'
    : 'Download release assertion passed for macOS and Windows (links and sidecar checksums).',
);
