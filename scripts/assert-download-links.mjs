/**
 * Release assertions for the download links, in two stages, on both download
 * pages: /beta, and PKB's /pkb, which hands out PKB's copies of the installers
 * (PKB install tagging, ruled 6 Oct 2026; pkbBuilds in src/data/builds.ts):
 *
 *   links     (default) network checks against the published release assets:
 *             each URL resolves, is served as an attachment, carries the
 *             configured version, and its published `.sha256` sidecar matches
 *             the checksum configured in src/data/builds.ts.
 *   rendered  inspection of the BUILT site: dist/beta.html and dist/pkb.html
 *             must exist and must contain each configured checksum verbatim.
 *             This stage can only run after `astro build`, so build:release
 *             invokes it as a separate post-build step (assert:downloads, then
 *             astro build, then assert:rendered).
 */
import { readFile } from 'node:fs/promises';
import { builds, pkbBuilds } from '../src/data/builds.ts';

const stage = process.argv[2] ?? 'links';
// Each page, the files it offers, and the files it must never offer: a PKB file
// on /beta would count a stranger as PKB's, and a standard file on /pkb would
// lose PKB an install that came through its link.
const pages = [
  { page: 'beta', label: '', offered: builds, foreign: pkbBuilds },
  { page: 'pkb', label: 'pkb ', offered: pkbBuilds, foreign: builds },
];
const failures = [];

const describe = (error) => (error instanceof Error ? error.message : String(error));

if (stage === 'links') {
  for (const { label, offered } of pages) {
    for (const [key, build] of Object.entries(offered)) {
      const platform = `${label}${key}`;
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
      // so the site can never claim a checksum the release does not carry. For
      // PKB's copies the configured checksum is the original's, so this is also
      // the proof that each copy is the same bytes.
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
  }
} else if (stage === 'rendered') {
  // Runs against the BUILT site: astro build must have completed first.
  for (const { page, label, offered, foreign } of pages) {
    const file = `dist/${page}.html`;
    const platforms = Object.entries(offered);
    let html;
    try {
      html = await readFile(new URL(`../${file}`, import.meta.url), 'utf8');
    } catch (error) {
      failures.push(`${file} could not be read (run astro build first): ${describe(error)}`);
      continue;
    }

    for (const [key, build] of platforms) {
      const platform = `${label}${key}`;
      if (!build.sha256) {
        failures.push(`${platform}: no sha256 configured`);
        continue;
      }
      if (!html.includes(build.sha256)) {
        failures.push(`${platform}: checksum ${build.sha256} is not rendered in ${file}`);
      }
      if (build.url && !html.includes(`href="${build.url}"`)) {
        failures.push(`${platform}: ${file} does not link ${build.filename}`);
      }
    }
    for (const build of Object.values(foreign)) {
      if (html.includes(build.filename)) {
        failures.push(`${file} names ${build.filename}, which belongs to the other download page`);
      }
    }

    // A visitor on a phone takes THIS page's address to their computer: from
    // /pkb that must be PKB's page, or PKB loses the install.
    const shown = new RegExp(`<strong\\b[^>]*>getmine\\.ai/${page}</strong>`).test(html);
    if (!shown || !html.includes(`data-page-url="https://getmine.ai/${page}"`)) {
      failures.push(`${file}: the link a visitor takes to their computer is not getmine.ai/${page}`);
    }
    // Only PKB's page stays out of search results; the public download page must not.
    const noindex = /<meta\b[^>]*name="robots"[^>]*noindex/.test(html);
    if (page === 'pkb' && !noindex) failures.push(`${file} is not marked noindex`);
    if (page !== 'pkb' && noindex) failures.push(`${file} is marked noindex`);

    // The platform cards are the download actions themselves. Keep the release
    // page to one click per operating system rather than restoring the former
    // selector-then-download interaction.
    const downloadActions = html.match(/<a\b[^>]*\bdata-download-link\b[^>]*>/g) ?? [];
    if (downloadActions.length !== 2) {
      failures.push(`${file} has ${downloadActions.length} platform download actions, expected 2`);
    }
    if (html.includes('data-platform-tab')) {
      failures.push(`${file} contains the retired platform selector`);
    }
    for (const key of ['mac', 'windows']) {
      if (!html.includes(`data-platform-panel="${key}"`)) {
        failures.push(`${label}${key}: direct platform card is absent from ${file}`);
      }
    }
    if (!html.includes('Choose macOS or Windows. Your download starts with one click.')) {
      failures.push(`one-click platform guidance is absent from ${file}`);
    }
    // The receipt (MINION-21, 5 Sep): two lines, nothing else in the box.
    for (const line of ['Download started', 'Your browser is bringing it in.']) {
      if (!html.includes(line)) failures.push(`the receipt line "${line}" is absent from ${file}`);
    }
    // Mina's second message stays per-platform and conditional: the page cannot
    // know the file landed. The danger it guards is a SHARED sentence sending
    // Windows visitors looking for a .pkg (ruled 4 Sep) — so what must hold is
    // that neither message names the other platform's file, not that both name
    // their own. Windows names no file at all (ruled 18 Sep): the sentence spends
    // its words on the SmartScreen warning instead, and nobody mistakes which
    // file they just downloaded.
    const macBuild = offered.mac;
    if (macBuild && !html.includes(`When it’s downloaded, open ${macBuild.filename}.`)) {
      failures.push(`${label}mac: Mina’s message naming ${macBuild.filename} is absent from ${file}`);
    }
    for (const [key] of platforms) {
      const message = (html.match(
        new RegExp(`<p\\b[^>]*data-message-platform="${key}"[^>]*>([\\s\\S]*?)</p>`),
      ) ?? [])[1];
      if (!message) {
        failures.push(`${label}${key}: Mina’s second message is absent from ${file}`);
        continue;
      }
      for (const [other, otherBuild] of platforms) {
        if (other !== key && message.includes(otherBuild.filename)) {
          failures.push(`${label}${key}: Mina’s message names ${otherBuild.filename}, the ${other} file`);
        }
      }
    }
    // The Windows warning is the one thing that message exists to carry (18 Sep):
    // almost every Windows tester meets SmartScreen before they meet Mina.
    if (!html.includes('Windows may say it doesn’t recognise us')) {
      failures.push(`the Windows SmartScreen warning is absent from Mina’s second message in ${file}`);
    }
    if (!html.includes('While you’re waiting') || !html.includes('Invite a friend')) {
      failures.push(`Mina’s waiting section or the invite section is absent from ${file}`);
    }
    // Without JavaScript the waiting section and both of Mina's messages render
    // at once (MINION-21 §4c): the static HTML must not hide them.
    const waiting = html.match(/<section\b[^>]*\bdata-waiting\b[^>]*>/)?.[0] ?? '';
    if (!waiting) failures.push(`the waiting section is absent from ${file}`);
    else if (/\bhidden\b/.test(waiting)) failures.push(`the waiting section is hidden in the static ${file}; only JavaScript may hide it`);
    const laterMessages = html.match(/<p\b[^>]*data-mina-message="2"[^>]*>/g) ?? [];
    if (laterMessages.length !== 2) failures.push(`expected 2 static second messages in ${file} (one per platform), found ${laterMessages.length}`);
    if (laterMessages.some((m) => /\bhidden\b/.test(m))) failures.push(`a second message is hidden in the static ${file}; only JavaScript may hide it`);
    // The browser owns a native cross-origin download; the page cannot observe
    // its progress, so it must never claim to (Sabine, 4 Sep). Carried from main.
    if (html.includes('data-download-progress') || html.includes('Downloading GetMine')) {
      failures.push(`${file} has restored a progress claim it cannot observe`);
    }
    for (const retired of ['What happens next', 'What to expect', 'Your privacy is built in']) {
      if (html.includes(retired)) failures.push(`retired section "${retired}" is still rendered in ${file}`);
    }
  }

  // Out of search results means out of the sitemap too.
  try {
    const sitemap = await readFile(new URL('../dist/sitemap-0.xml', import.meta.url), 'utf8');
    if (/getmine\.ai\/pkb\b/.test(sitemap)) failures.push('the sitemap lists /pkb');
  } catch (error) {
    failures.push(`dist/sitemap-0.xml could not be read: ${describe(error)}`);
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
    ? 'Rendered download assertion passed on /beta and /pkb: direct platform actions, the receipt, Mina’s minute and checksums are present.'
    : 'Download release assertion passed for macOS and Windows on /beta and /pkb (links and sidecar checksums).',
);
