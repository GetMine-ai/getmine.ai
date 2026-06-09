// @ts-check
import { defineConfig } from 'astro/config';

// Static marketing site for getmine.ai.
// `site` powers absolute canonical URLs; output is static by default and the
// build emits a plain dist/ that GitHub Pages serves (CNAME ships via public/).
export default defineConfig({
  site: 'https://getmine.ai',
  // Emit `privacy.html` (not `privacy/index.html`) so the existing URLs and the
  // footer's `./privacy.html` links keep working unchanged.
  build: { format: 'file' },
  // Default dev/preview port (matches the sibling getmine app).
  server: { port: 3000 },
});
