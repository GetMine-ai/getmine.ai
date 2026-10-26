/**
 * The wording of the visit-counting choice: the link at the end of the counting
 * sentence in the privacy policy's "What we hold", and the line shown once the
 * choice is made.
 *
 * These two strings belong with the counting sentence in the privacy
 * policy (src/data/regulatory.ts, which mirrors the regulatory pack). Change
 * them only together with that section, and write no other copy for this
 * feature here.
 *
 * The status is rendered in two parts: its first sentence as text, and the
 * rest as the link that turns counting back on.
 */
export const visitCounting = {
  action: 'Turn this off for this browser',
  status: 'Visit counting is off for this browser. Turn it back on.',
} as const;
