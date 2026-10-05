/**
 * The pure half of the site's measurement: the event contract of
 * POST /site/v1/event, and the rules that turn what the browser reports into
 * the few values that contract allows. No DOM, no imports, no import.meta, so
 * scripts/site-metrics.test.mjs can run it under Node as it stands.
 *
 * The vocabularies are closed. The server answers anything outside them with
 * a fixed 400, so the builder refuses it here first and nothing malformed is
 * ever sent.
 */
export const EVENTS = [
  'page_view',
  'download_click',
  'download_fallback_click',
  'section_reached',
  'invite_opened',
  'invite_copied',
] as const;
export const PAGES = ['home', 'beta', 'privacy', 'terms', 'trust', 'welcome', 'not-found'] as const;
export const DOWNLOAD_PLATFORMS = ['mac', 'windows'] as const;
/** What the download page detects: a platform it can serve, or neither. */
export const PLATFORMS = [...DOWNLOAD_PLATFORMS, 'unsupported'] as const;
export const REGIONS = ['uk', 'europe', 'north-america', 'other'] as const;
export const SECTIONS = [
  'why-it-matters',
  'how-it-works',
  'meet-mina',
  'our-promise',
  'about-us',
  'closing',
] as const;

export type SiteEventName = (typeof EVENTS)[number];
export type SitePage = (typeof PAGES)[number];
export type DownloadPlatform = (typeof DOWNLOAD_PLATFORMS)[number];
export type Region = (typeof REGIONS)[number];

/** Where a visit came from: a campaign tag, a referring hostname, both or neither. */
export interface VisitSource {
  src?: string;
  ref?: string;
}

const isOneOf = <T extends string>(values: readonly T[], value: unknown): value is T =>
  typeof value === 'string' && (values as readonly string[]).includes(value);

const parseUrl = (value: unknown): URL | undefined => {
  if (typeof value !== 'string' || value === '') return undefined;
  try {
    return new URL(value);
  } catch {
    return undefined;
  }
};

/** The site's own redirect to the download page (src/pages/download.astro). It
 *  has no content of its own, so arriving through it is arriving from outside. */
const DOWNLOAD_REDIRECT_PATHS = ['/download', '/download/', '/download.html'];

/**
 * Whether this page was reached from outside the site: no referrer, a referrer
 * on another origin, or the site's own /download redirect.
 */
export function arrivedFromOutside(referrer: unknown, origin: string): boolean {
  const url = parseUrl(referrer);
  if (!url || url.origin !== origin) return true;
  return DOWNLOAD_REDIRECT_PATHS.includes(url.pathname);
}

/**
 * The entry test. A visit is a fresh navigation (not a reload, not back or
 * forward) that arrived from outside the site.
 */
export function isEntry(navigationType: unknown, referrer: unknown, origin: string): boolean {
  return navigationType === 'navigate' && arrivedFromOutside(referrer, origin);
}

const UK_ZONES = [
  'Europe/London',
  'Europe/Belfast',
  'Europe/Jersey',
  'Europe/Guernsey',
  'Europe/Isle_of_Man',
  'GB',
  'GB-Eire',
];

/** Zones outside Europe/ that are European territory. */
const EUROPEAN_ZONES_ELSEWHERE = [
  'Atlantic/Azores',
  'Atlantic/Madeira',
  'Atlantic/Canary',
  'Atlantic/Faroe',
  'Atlantic/Faeroe',
  'Atlantic/Reykjavik',
  'Atlantic/Jan_Mayen',
  'Arctic/Longyearbyen',
];

/** Every zone under these prefixes is in the United States or Canada. */
const NORTH_AMERICA_PREFIXES = [
  'America/Indiana/',
  'America/Kentucky/',
  'America/North_Dakota/',
  'Canada/',
];

/** The United States (the fifty states) and Canada, with the older names
 *  browsers still report. America/ alone is no test: it also holds Mexico, the
 *  Caribbean and South America. */
const NORTH_AMERICA_ZONES = [
  // United States
  'America/New_York',
  'America/Detroit',
  'America/Chicago',
  'America/Menominee',
  'America/Denver',
  'America/Boise',
  'America/Phoenix',
  'America/Los_Angeles',
  'America/Anchorage',
  'America/Juneau',
  'America/Sitka',
  'America/Metlakatla',
  'America/Yakutat',
  'America/Nome',
  'America/Adak',
  'Pacific/Honolulu',
  'America/Indianapolis',
  'America/Fort_Wayne',
  'America/Louisville',
  'America/Knox_IN',
  'America/Shiprock',
  'America/Atka',
  'US/Eastern',
  'US/Central',
  'US/Mountain',
  'US/Pacific',
  'US/Alaska',
  'US/Aleutian',
  'US/Arizona',
  'US/Hawaii',
  'US/Michigan',
  'US/East-Indiana',
  'US/Indiana-Starke',
  // Canada
  'America/St_Johns',
  'America/Halifax',
  'America/Glace_Bay',
  'America/Moncton',
  'America/Goose_Bay',
  'America/Blanc-Sablon',
  'America/Toronto',
  'America/Montreal',
  'America/Nipigon',
  'America/Thunder_Bay',
  'America/Iqaluit',
  'America/Pangnirtung',
  'America/Atikokan',
  'America/Coral_Harbour',
  'America/Winnipeg',
  'America/Rainy_River',
  'America/Resolute',
  'America/Rankin_Inlet',
  'America/Regina',
  'America/Swift_Current',
  'America/Edmonton',
  'America/Yellowknife',
  'America/Cambridge_Bay',
  'America/Inuvik',
  'America/Creston',
  'America/Dawson_Creek',
  'America/Fort_Nelson',
  'America/Whitehorse',
  'America/Dawson',
  'America/Vancouver',
];

/**
 * The region band for a time zone name, as the browser reports it. The bands
 * are the app's own world_region bands. Unknown or missing is 'other'.
 */
export function regionFromTimeZone(timeZone: unknown): Region {
  if (typeof timeZone !== 'string') return 'other';
  if (UK_ZONES.includes(timeZone)) return 'uk';
  if (timeZone.startsWith('Europe/') || EUROPEAN_ZONES_ELSEWHERE.includes(timeZone)) {
    return 'europe';
  }
  if (
    NORTH_AMERICA_ZONES.includes(timeZone)
    || NORTH_AMERICA_PREFIXES.some((prefix) => timeZone.startsWith(prefix))
  ) {
    return 'north-america';
  }
  return 'other';
}

const SRC_PATTERN = /^[a-z0-9][a-z0-9_-]{0,31}$/;
// At least two labels: the server refuses a bare name such as "localhost", and a
// refused event loses the visit it describes.
const HOSTNAME_PATTERN = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/;
const REF_MAX_LENGTH = 64;
/** The site's own names. A move between them is not a referral. */
const OWN_HOSTS = ['getmine.ai', 'api.getmine.ai'];

/** A campaign tag, lower-cased; undefined unless it is a short plain token. */
export function cleanSrc(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const src = value.toLowerCase();
  return SRC_PATTERN.test(src) ? src : undefined;
}

/** A referring hostname, lower-cased and without a leading www.; undefined
 *  unless it is a named host of at most 64 characters that is not this site.
 *  These are exactly the server's rules, so nothing it would refuse is sent. */
export function cleanRef(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const ref = value.toLowerCase().replace(/^www\./, '');
  if (ref.length > REF_MAX_LENGTH || !HOSTNAME_PATTERN.test(ref)) return undefined;
  // A name, never an address: the last label of an IP literal has no letter.
  if (!/[a-z]/.test(ref.slice(ref.lastIndexOf('.') + 1))) return undefined;
  return OWN_HOSTS.includes(ref) ? undefined : ref;
}

/** The campaign tag in an address's query: ?src=, or failing that utm_source. */
export function srcFromSearch(search: unknown): string | undefined {
  if (typeof search !== 'string') return undefined;
  const params = new URLSearchParams(search);
  return cleanSrc(params.get('src')) ?? cleanSrc(params.get('utm_source'));
}

/** The hostname of a referrer on another origin. Never its path or query. */
export function refFromReferrer(referrer: unknown, origin: string): string | undefined {
  const url = parseUrl(referrer);
  if (!url || url.origin === origin) return undefined;
  return cleanRef(url.hostname);
}

const VIA_PREFIX = 'via=';
const withoutHash = (fragment: string) => (fragment.startsWith('#') ? fragment.slice(1) : fragment);

/** Whether an address fragment is one this site adds to its download links. */
export function isViaFragment(fragment: unknown): boolean {
  return typeof fragment === 'string' && withoutHash(fragment).startsWith(VIA_PREFIX);
}

/**
 * The fragment that carries a visit's source to the download page:
 * via=s.<src>, via=r.<ref>, or both joined by a comma. Undefined when there
 * is nothing to carry.
 */
export function encodeVia(source: VisitSource): string | undefined {
  const src = cleanSrc(source.src);
  const ref = cleanRef(source.ref);
  const parts = [src && `s.${src}`, ref && `r.${ref}`].filter(Boolean);
  return parts.length ? `${VIA_PREFIX}${parts.join(',')}` : undefined;
}

/**
 * Read a via fragment back, with or without its leading #. The values go
 * through the same cleaners as on the way in, and only a fragment exactly as
 * encodeVia would have written it is honoured; anything else is undefined.
 */
export function decodeVia(fragment: unknown): VisitSource | undefined {
  if (typeof fragment !== 'string' || !isViaFragment(fragment)) return undefined;
  const text = withoutHash(fragment);
  const source: VisitSource = {};
  for (const part of text.slice(VIA_PREFIX.length).split(',')) {
    const value = part.slice(2);
    if (part.startsWith('s.') && source.src === undefined) source.src = cleanSrc(value);
    else if (part.startsWith('r.') && source.ref === undefined) source.ref = cleanRef(value);
    else return undefined;
  }
  return encodeVia(source) === text ? source : undefined;
}

/** What ?count= asks for: 'off', 'on', or nothing this site understands. */
export function countChoice(search: unknown): 'off' | 'on' | undefined {
  if (typeof search !== 'string') return undefined;
  const choice = new URLSearchParams(search).get('count');
  return choice === 'off' || choice === 'on' ? choice : undefined;
}

/** The fields each event may carry, in the order they are written. */
const FIELDS: Record<SiteEventName, readonly string[]> = {
  page_view: ['page', 'entry', 'region', 'src', 'ref', 'platform'],
  download_click: ['platform', 'src', 'ref'],
  download_fallback_click: ['platform'],
  section_reached: ['section'],
  invite_opened: [],
  invite_copied: [],
};

/** The fields an event can be sent without. */
const OPTIONAL: Record<SiteEventName, readonly string[]> = {
  page_view: ['entry', 'region', 'src', 'ref', 'platform'],
  download_click: ['src', 'ref'],
  download_fallback_click: [],
  section_reached: [],
  invite_opened: [],
  invite_copied: [],
};

function isValidField(event: SiteEventName, key: string, value: unknown): boolean {
  if (key === 'page') return isOneOf(PAGES, value);
  if (key === 'entry') return typeof value === 'boolean';
  if (key === 'region') return isOneOf(REGIONS, value);
  // src and ref must already be clean: the builder refuses, it does not repair.
  if (key === 'src') return typeof value === 'string' && cleanSrc(value) === value;
  if (key === 'ref') return typeof value === 'string' && cleanRef(value) === value;
  if (key === 'platform') {
    return isOneOf(event === 'page_view' ? PLATFORMS : DOWNLOAD_PLATFORMS, value);
  }
  if (key === 'section') return isOneOf(SECTIONS, value);
  return false;
}

/**
 * The request body for one event, or null for anything outside the contract:
 * an unknown event, an unknown or missing field, a value outside its
 * vocabulary, a field where the contract does not allow it. A field given as
 * undefined counts as absent. Keys are always written in the same order,
 * whatever order they arrive in.
 */
export function buildEvent(event: unknown, fields: unknown = {}): string | null {
  if (!isOneOf(EVENTS, event)) return null;
  if (typeof fields !== 'object' || fields === null || Array.isArray(fields)) return null;

  const given = fields as Record<string, unknown>;
  const expected = FIELDS[event];
  const present = Object.keys(given).filter((key) => given[key] !== undefined);
  if (present.some((key) => !expected.includes(key))) return null;

  const body: Record<string, unknown> = { event };
  for (const key of expected) {
    const value = given[key];
    if (value === undefined && OPTIONAL[event].includes(key)) continue;
    if (!isValidField(event, key, value)) return null;
    body[key] = value;
  }

  if (event === 'page_view') {
    // Region, src and ref describe a visit, so they travel only with an entry,
    // and an entry always says its region.
    const describesVisit = 'region' in body || 'src' in body || 'ref' in body;
    if (body.entry === true ? !('region' in body) : describesVisit) return null;
    // Only the download page detects a platform.
    if ('platform' in body && body.page !== 'beta') return null;
  }
  return JSON.stringify(body);
}
