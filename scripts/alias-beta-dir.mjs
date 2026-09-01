// Write dist/beta/index.html as a byte-identical copy of dist/beta.html so
// BOTH /beta and /beta/ resolve on GitHub Pages (the trailing-slash form
// 404ed live on delete day, 1 Sep). A copy, not a redirect page: the download
// card must be present at either address for the rendered-checksum gate.
import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
const src = new URL('../dist/beta.html', import.meta.url);
const dir = new URL('../dist/beta/', import.meta.url);
const out = new URL('../dist/beta/index.html', import.meta.url);
readFileSync(src); // throws loudly if the build did not produce the page
mkdirSync(dir, { recursive: true });
copyFileSync(src, out);
console.log('beta alias written: dist/beta/index.html mirrors dist/beta.html');
