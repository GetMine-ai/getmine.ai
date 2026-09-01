// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Static marketing site for getmine.ai.
// `site` powers absolute canonical URLs; output is static by default and the
// build emits a plain dist/ that GitHub Pages serves (CNAME ships via public/).
export default defineConfig({
  site: 'https://getmine.ai',
  // 'file' keeps every published address exactly as it is (Brevo lands on
  // /welcome.html — an external contract). The one trailing-slash gap this
  // leaves, /beta/ 404ing, is closed by a targeted alias the build writes
  // (scripts/alias-beta-dir.mjs), not by changing every route's shape.
  build: { format: 'file' },
  integrations: [
    sitemap({
      filter: (page) => !page.endsWith('/download'),
    }),
  ],
  // Default dev/preview port (matches the sibling getmine app).
  server: { port: 3000 },
});
