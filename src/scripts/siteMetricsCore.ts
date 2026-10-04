/**
 * The pure half of the site's measurement: the event contract of
 * POST /site/v1/event, and nothing else. No DOM, no imports, no import.meta,
 * so scripts/site-metrics.test.mjs can run it under Node as it stands.
 *
 * The vocabularies are closed. The server answers anything outside them with
 * a fixed 400, so the builder refuses it here first and nothing malformed is
 * ever sent.
 */
export const EVENTS = [
  'page_view',
  'download_click',
  'download_fallback_click',
  'invite_opened',
  'invite_copied',
] as const;
export const PAGES = ['home', 'beta', 'not-found'] as const;
export const DOWNLOAD_PLATFORMS = ['mac', 'windows'] as const;

export type SiteEventName = (typeof EVENTS)[number];
export type SitePage = (typeof PAGES)[number];
export type DownloadPlatform = (typeof DOWNLOAD_PLATFORMS)[number];

/** The fields each event carries, in the order they are written. */
const FIELDS: Record<SiteEventName, readonly string[]> = {
  page_view: ['page'],
  download_click: ['platform'],
  download_fallback_click: ['platform'],
  invite_opened: [],
  invite_copied: [],
};

const isOneOf = <T extends string>(values: readonly T[], value: unknown): value is T =>
  typeof value === 'string' && (values as readonly string[]).includes(value);

function isValidField(key: string, value: unknown): boolean {
  if (key === 'page') return isOneOf(PAGES, value);
  if (key === 'platform') return isOneOf(DOWNLOAD_PLATFORMS, value);
  return false;
}

/**
 * The request body for one event, or null for anything outside the contract:
 * an unknown event, an unknown or missing field, a value outside its
 * vocabulary. A field given as undefined counts as absent. Keys are always
 * written in the same order, whatever order they arrive in.
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
    if (!isValidField(key, given[key])) return null;
    body[key] = given[key];
  }
  return JSON.stringify(body);
}
