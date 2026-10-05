/**
 * The site's measurement, and the only code that knows where events go:
 * anonymous first-party counts of visits, page loads, home-page section reach,
 * download presses and invite use. No cookie, no identifier, and nothing sent
 * that could single out a visitor.
 *
 * What it reads from the browser, in full. The privacy policy's "Visit
 * counting" section describes this list, so the two must stay in step:
 *   - the referring page (document.referrer): tells a visit from a move within
 *     the site, and gives the referring hostname, never its path
 *   - a campaign tag in the address (?src=, or utm_source)
 *   - the #via= fragment this site adds to its own download links
 *   - the platform the download page has already detected for its own layout
 *   - the time zone, reduced at once to one of four region bands
 *   - which home-page sections scroll into view
 *   - the navigation type, the prerender state and the automation flag:
 *     reloads, back and forward, pages prerendered but never shown, and
 *     automated browsers are not counted
 *   - one flag in local storage, which remembers that visit counting is off.
 *     It is the only thing this site stores.
 *
 * Every send is fire-and-forget, so a failure can never affect the page. The
 * contract and the rules behind each value are in siteMetricsCore.ts.
 */
import { visitCounting } from '../data/visitCounting';
import {
  arrivedFromOutside,
  buildEvent,
  countChoice,
  decodeVia,
  encodeVia,
  isEntry,
  isViaFragment,
  refFromReferrer,
  regionFromTimeZone,
  srcFromSearch,
  type SiteEventName,
  type VisitSource,
} from './siteMetricsCore';

const SITE_METRICS_ENDPOINT = String(
  import.meta.env.PUBLIC_SITE_METRICS_ENDPOINT
    || 'https://api.getmine.ai/site/v1/event',
).trim();

/** The site itself. A preview, or a copy served anywhere else, sends nothing
 *  unless an endpoint was configured for it at build time. */
const SITE_HOSTS = ['getmine.ai', 'www.getmine.ai'];
const sendsFromHere = () =>
  Boolean(import.meta.env.PUBLIC_SITE_METRICS_ENDPOINT)
  || SITE_HOSTS.includes(window.location.hostname);

const COUNTING_FLAG = 'getmine.visit-counting';
const DOWNLOAD_PAGE_PATH = '/beta';

type SiteEventFields = Readonly<Record<string, string | boolean | undefined>>;

function countingIsOff(): boolean {
  try {
    return window.localStorage.getItem(COUNTING_FLAG) === 'off';
  } catch {
    // Storage is blocked, so this browser could never remember an objection:
    // treat it as having made one.
    return true;
  }
}

/**
 * Send one event. The body is JSON sent as text/plain with no other header,
 * so the browser sends no CORS preflight. Production builds on getmine.ai
 * only: `astro dev` and a local preview never send. Nothing is sent from an
 * automated browser or once visit counting is off, and anything outside the
 * contract is dropped.
 */
export function track(event: SiteEventName, fields: SiteEventFields = {}) {
  const body = buildEvent(event, fields);
  if (body === null || !import.meta.env.PROD) return;
  try {
    if (!sendsFromHere() || navigator.webdriver || countingIsOff()) return;
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

let source: VisitSource = {};

/** Where this visit came from, as far as this page knows: its own source if it
 *  is where the visit began, or the one a link from that page carried here. */
export function visitSource(): VisitSource {
  return source;
}

// Rewrites the address bar in place: no navigation, no new history entry.
function replaceAddress(search: string, hash: string) {
  window.history.replaceState(
    window.history.state,
    '',
    `${window.location.pathname}${search}${hash}`,
  );
}

/**
 * The one status line, shown after ?count=off or ?count=on has been handled:
 * what the choice now is, and a plain link that reverses it.
 */
function showCountingStatus() {
  const off = countingIsOff();
  const status = document.createElement('p');
  status.className = 'visit-counting-status';
  status.setAttribute('role', 'status');
  document.body.prepend(status);
  // Filled a moment after it is added: a status region is announced when its
  // content changes, not when it arrives already full. It also keeps the link
  // out of main.ts's pass over in-page links, which would swallow its click.
  window.setTimeout(() => {
    const link = document.createElement('a');
    link.href = `${window.location.pathname}?count=${off ? 'on' : 'off'}${window.location.hash}`;
    if (off) {
      const cut = visitCounting.status.indexOf('. ') + 1;
      status.append(visitCounting.status.slice(0, cut), ' ');
      link.textContent = visitCounting.status.slice(cut).trim();
    } else {
      link.textContent = visitCounting.action;
    }
    status.append(link);
  }, 100);
}

function applyCountChoice(choice: 'off' | 'on') {
  try {
    if (choice === 'off') window.localStorage.setItem(COUNTING_FLAG, 'off');
    else window.localStorage.removeItem(COUNTING_FLAG);
  } catch {
    // Storage is blocked: countingIsOff() already answers true.
  }
  const params = new URLSearchParams(window.location.search);
  params.delete('count');
  const search = params.toString();
  replaceAddress(search ? `?${search}` : '', window.location.hash);
  showCountingStatus();
}

function navigationType(): string | undefined {
  const [navigation] = performance.getEntriesByType('navigation');
  return (navigation as PerformanceNavigationTiming | undefined)?.type;
}

function timeZone(): string | undefined {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return undefined;
  }
}

// The download page's inline script has already worked out the platform for
// its own layout; the count reuses that answer rather than detecting again.
function detectedPlatform(): string | undefined {
  const root = document.querySelector<HTMLElement>('[data-download-module]');
  return root?.dataset.detectedPlatform || undefined;
}

// The source travels to the download page in the link itself, so nothing has
// to be stored to credit a download to the visit it came from.
function tagDownloadLinks(fragment: string) {
  document.querySelectorAll<HTMLAnchorElement>('a[href]').forEach((link) => {
    if (link.origin !== window.location.origin) return;
    if (link.pathname !== DOWNLOAD_PAGE_PATH || link.hash) return;
    link.hash = fragment;
  });
}

// Each marked section counts once per page load, the first time it is properly
// in view: past the bottom fifth of the window, not merely touching its edge.
function observeSections() {
  if (!('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        track('section_reached', { section: (entry.target as HTMLElement).dataset.siteSection });
      });
    },
    { rootMargin: '0px 0px -20% 0px' },
  );
  document.querySelectorAll<HTMLElement>('[data-site-section]').forEach((section) => {
    observer.observe(section);
  });
}

function start() {
  const choice = countChoice(window.location.search);
  if (choice) applyCountChoice(choice);

  // A via fragment is read once and never left in the address bar, whether or
  // not it is honoured: a copied link must not carry someone else's source.
  const fragment = window.location.hash;
  const carried = isViaFragment(fragment);
  if (carried) replaceAddress(window.location.search, '');

  if (navigator.webdriver || countingIsOff()) return;

  const origin = window.location.origin;
  const referrer = document.referrer;
  if (arrivedFromOutside(referrer, origin)) {
    source = {
      src: srcFromSearch(window.location.search),
      ref: refFromReferrer(referrer, origin),
    };
  } else if (carried) {
    // Only this site's own links carry the fragment, so it is honoured only on
    // a move within the site, and only as encodeVia would have written it.
    source = decodeVia(fragment) ?? {};
  }

  const page = document.body.dataset.sitePage;
  const via = encodeVia(source);
  if (via && page !== 'beta') tagDownloadLinks(via);

  // Only a fresh navigation is a page view: not a reload, not back or forward.
  const navigation = navigationType();
  if (!page || navigation !== 'navigate') return;

  const entry = isEntry(navigation, referrer, origin);
  track('page_view', {
    page,
    entry,
    ...(entry ? { region: regionFromTimeZone(timeZone()), ...source } : {}),
    platform: page === 'beta' ? detectedPlatform() : undefined,
  });
  if (page === 'home') observeSections();
}

let started = false;

/** Start counting for this page load, once. The layout names the page in
 *  data-site-page; a page without a name is not counted. */
export function startSiteMetrics() {
  if (started) return;
  started = true;
  const run = () => {
    try {
      start();
    } catch {
      // Counting must never affect the page.
    }
  };
  // A prerendered page has not been seen by anyone: wait until it is shown,
  // which for most prerenders is never.
  if ((document as Document & { prerendering?: boolean }).prerendering) {
    document.addEventListener('prerenderingchange', run, { once: true });
  } else {
    run();
  }
}
