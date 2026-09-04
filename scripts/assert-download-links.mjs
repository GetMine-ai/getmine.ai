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
import { runInNewContext } from 'node:vm';
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
    for (const required of [
      'data-download-progress',
      'Downloading GetMine',
      'browser’s Downloads button shows the exact progress',
    ]) {
      if (!html.includes(required)) {
        failures.push(`download progress state is missing: ${required}`);
      }
    }
    // This handler deliberately lives before the links. A large installer can
    // navigate before the deferred module hydrates, so a listener added later
    // would leave the page static on the first, most important click.
    const earlyListener = html.indexOf("r.addEventListener('click'");
    const firstRenderedChild = html.indexOf('<div class="download-glow"');
    if (earlyListener < 0 || firstRenderedChild < 0 || earlyListener > firstRenderedChild) {
      failures.push('download progress click listener is not installed before the rendered download UI');
    }
    const moduleStart = html.lastIndexOf('<main', earlyListener);
    const scriptOpen = html.lastIndexOf('<script>', earlyListener);
    const scriptClose = html.indexOf('</script>', earlyListener);
    if (moduleStart < 0 || scriptOpen < moduleStart || scriptClose < 0 || scriptClose > firstRenderedChild) {
      failures.push('early download listener is not an inline child of the download module before its UI');
    } else {
      const listeners = new Map();
      const action = { dataset: {} };
      class FakeElement {
        constructor(kind) {
          this.kind = kind;
        }

        closest(selector) {
          if (selector === '[data-download-link]') return this.kind === 'target' ? link : null;
          if (selector === '[data-download-action]') return this.kind === 'link' ? action : null;
          return null;
        }
      }
      const link = new FakeElement('link');
      const target = new FakeElement('target');
      const root = {
        dataset: {},
        addEventListener(type, listener) {
          listeners.set(type, listener);
        },
      };
      const currentScript = { closest: selector => selector === '[data-download-module]' ? root : null };
      try {
        runInNewContext(html.slice(scriptOpen + '<script>'.length, scriptClose), {
          document: { currentScript },
          navigator: { platform: 'MacIntel', maxTouchPoints: 0 },
          Element: FakeElement,
        });
        const click = listeners.get('click');
        if (typeof click !== 'function') {
          failures.push('early download script does not register its click listener');
        } else {
          click({ target });
          if (action.dataset.started !== 'true') {
            failures.push('clicking a rendered download link does not activate its progress state');
          }
        }
      } catch (error) {
        failures.push(`early download script could not execute against the rendered hierarchy: ${describe(error)}`);
      }
    }
    const cssHrefs = [...html.matchAll(/href="([^"]+\.css)"/g)].map(match => match[1]);
    let renderedCss = '';
    for (const href of cssHrefs) {
      try {
        renderedCss += await readFile(new URL(`../dist${href}`, import.meta.url), 'utf8');
      } catch (error) {
        failures.push(`rendered stylesheet ${href} could not be read: ${describe(error)}`);
      }
    }
    if (!/@media\(prefers-reduced-motion:reduce\)[\s\S]*?download-action[^{}]*data-started=true[^{}]*download-progress[^{}]*\{display:none\}/.test(renderedCss)) {
      failures.push('reduced-motion download state still presents an unmoving percentage-like bar');
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
    ? 'Rendered checksum assertion passed: both checksums appear in dist/beta.html.'
    : 'Download release assertion passed for macOS and Windows (links and sidecar checksums).',
);
