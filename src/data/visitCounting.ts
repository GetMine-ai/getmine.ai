/**
 * The wording of the visit-counting choice: the footer link, the action in the
 * privacy policy, and the line shown once the choice is made.
 *
 * These three strings belong with the "Visit counting" section of the privacy
 * policy (src/data/regulatory.ts, which mirrors the regulatory pack). Change
 * them only together with that section, and write no other copy for this
 * feature here.
 *
 * The status is rendered in two parts: its first sentence as text, and the
 * rest as the link that turns counting back on.
 */
export const visitCounting = {
  label: 'Visit counting',
  action: 'Turn off visit counting in this browser',
  status: 'Visit counting is off in this browser. Turn it back on.',
} as const;
