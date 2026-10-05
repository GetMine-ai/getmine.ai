/**
 * The site's measurement, and the only code that knows where events go:
 * anonymous first-party counts of page loads, download presses and invite use.
 *
 * It reads nothing from the browser and stores nothing: no referrer, no
 * address, no device details, no cookie, no storage. The page name is written
 * into the markup at build time. Every send is fire-and-forget, so a failure
 * can never affect the page. A change to what is sent here must first be
 * checked against the privacy page.
 *
 * The contract itself (events, fields, vocabularies) is siteMetricsCore.ts.
 */
import { buildEvent, type SiteEventName } from './siteMetricsCore';

const SITE_METRICS_ENDPOINT = String(
  import.meta.env.PUBLIC_SITE_METRICS_ENDPOINT
    || 'https://api.getmine.ai/site/v1/event',
).trim();

type SiteEventFields = Readonly<Record<string, string | undefined>>;

/**
 * Send one event. The body is JSON sent as text/plain with no other header,
 * so the browser sends no CORS preflight. Production builds only: `astro dev`
 * never sends. Anything outside the contract is dropped, not sent.
 */
export function track(event: SiteEventName, fields: SiteEventFields = {}) {
  const body = buildEvent(event, fields);
  if (body === null || !import.meta.env.PROD) return;
  try {
    void fetch(SITE_METRICS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body,
      credentials: 'omit',
      referrerPolicy: 'no-referrer',
      keepalive: true,
    }).catch(() => undefined);
  } catch {
    // Counting must never affect the page.
  }
}

let started = false;

/** Count this page load, once. The layout names the page in data-site-page. */
export function startSiteMetrics() {
  if (started) return;
  started = true;
  const page = document.body.dataset.sitePage;
  if (page) track('page_view', { page });
}
