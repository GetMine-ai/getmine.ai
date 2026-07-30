// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Static marketing site for getmine.ai.
// `site` powers absolute canonical URLs; output is static by default and the
// build emits a plain dist/ that GitHub Pages serves (CNAME ships via public/).
export default defineConfig({
  site: 'https://getmine.ai',
  build: { format: 'file' },
  integrations: [sitemap()],
  // Default dev/preview port (matches the sibling getmine app).
  server: { port: 3000 },
});
