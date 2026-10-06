// Write dist/beta/index.html as a byte-identical copy of dist/beta.html so
// BOTH /beta and /beta/ resolve on GitHub Pages (the trailing-slash form
// 404ed live on delete day, 1 Sep). A copy, not a redirect page: the download
// card must be present at either address for the rendered-checksum gate.
// /pkb gets the same alias: it is the one address PKB is given, and a link
// that gains a slash on its way through PKB's pages must still download.
import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
for (const page of ['beta', 'pkb']) {
  const src = new URL(`../dist/${page}.html`, import.meta.url);
  const dir = new URL(`../dist/${page}/`, import.meta.url);
  const out = new URL(`../dist/${page}/index.html`, import.meta.url);
  readFileSync(src); // throws loudly if the build did not produce the page
  mkdirSync(dir, { recursive: true });
  copyFileSync(src, out);
  console.log(`${page} alias written: dist/${page}/index.html mirrors dist/${page}.html`);
}
