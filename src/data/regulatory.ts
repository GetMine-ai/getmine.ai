/**
 * THE regulatory content module — one repository feeding every interface (Sabine's
 * ruling, 29 Jul 2026).
 *
 * Canon chain: the ratified regulatory pack (Documents/PHR/Getmine/Legal, reviewed
 * with the advisory board) is the human source of truth; this module mirrors it;
 * the site's /privacy and /trust pages RENDER this module. Every other surface —
 * the desktop app (demo: src/lib/regulatory.ts privacyNotice/trustNotice), the
 * gateway's emails, Brevo templates — LINKS https://getmine.ai/privacy and
 * /trust and never restates the content. Change wording here (after it is ruled
 * in the pack), and every interface is current on the next deploy.
 */
export const privacyPolicy = {
  title: 'Privacy policy',
  organisation: 'GetMine Ltd',
  version: 'Version 1.0',
  published: '27 July 2026',
  reviewStatus: '',
  scope: 'This one policy covers the GetMine desktop app and the getmine.ai website.',
  summary:
    'The short version: your health records live on your computer. The only personal data we hold about you is what it takes to run the beta: your email address and your status on the open beta.',
  beta: {
    heading: 'The beta, plainly',
    paragraphs: [
      'GetMine is early software for adults (18+). Mina organises your health information; she is not a doctor and does not diagnose. Check anything important with a clinician, and keep your own copies of anything you can’t afford to lose.',
    ],
  },
  vault: {
    heading: 'Your Health Vault: yours, on your computer',
    paragraphs: [
      'Everything you add or connect (electronic health records, documents, emails you choose to scan, photos, notes) lives in your Health Vault on your own computer. We hold no central copy, we cannot see it, and nothing in the product reports its contents to us.',
      'We can’t lose or leak what we don’t have. Your vault is encrypted and only you can open it: keeping your computer protected, and being careful with any export you choose to make, is in your hands.',
      'Deleting GetMine never deletes your health information. The app and Mina go.',
    ],
  },
  mina: {
    heading: 'When Mina answers a question',
    paragraphs: [
      'Mina is powered by our AI LLM provider. To answer a question, or to file a document, email or photo you’ve added, she sends the provider only the slice of your records relevant to that task. Never your whole vault, never your logins. And only after you’ve agreed on the first-open screen: no consent, no Mina.',
      'Requests either pass through GetMine’s server, which keeps none of the content and only counts them against the AI allowance included with the beta, or go straight from your computer to the provider under your own key, never touching a GetMine server.',
    ],
  },
  sources: {
    heading: 'Sources you connect',
    bullets: [
      'Electronic health records (in the UK, your NHS record) reach your vault through our health-records access partner, after you log in with them and authorise it.',
      'Email scanning is read-only. GetMine can never send, change or delete your email, and your mailbox is read on your computer, not by us. You can revoke the access you granted with your email provider at any time.',
      'The logins you grant are stored encrypted on your machine, separate from your health records. A copy of your vault, wherever it ends up, contains no usable login to anything.',
      'Disconnect any source at any time, in the app.',
    ],
  },
  holdings: {
    heading: 'What we hold',
    introduction: 'GetMine holds exactly this, and nothing else:',
    summaryParagraph:
      'GetMine holds exactly this, and nothing else: your email address and your beta status; the code in your invite link, if you sign up through one; your consent record, as proof we asked; and your AI usage counts, for the allowance included with the beta. Only if you opt in: which parts of the app you use (never health data), and any feedback you send. Everything is deleted within 6 months of the beta ending, except the consent record, which we keep for 6 years. No health information appears anywhere in this list.',
    columns: ['What', 'Why', 'Kept until'],
    rows: [
      ['Your email address', 'beta emails', 'you leave, or the beta ends'],
      ['Your beta status', 'running the beta', '6 months after it ends'],
      [
        'The code in your invite link, if you sign up through one',
        'managing access in order',
        '6 months after the beta ends',
      ],
      ['Your consent record', 'proving we asked', '6 years'],
      ['AI usage counts', 'your included allowance', 'the beta ends'],
      [
        'App usage (which parts of the app you use, never health data)',
        'improving the beta; only if you opt in',
        'the beta ends',
      ],
      [
        'Feedback you send',
        'improving the product; quoted without your name only if you opt in',
        'the beta ends',
      ],
    ],
    paragraphs: [
      'No health information appears in this table. When you apply on the website, your email goes straight to our email delivery provider, which holds it while it waits for your confirmation. Our own site stores nothing. Once you confirm, your address joins our beta access list: the first row of this table.',
      'Our lawful bases for this table: running the beta you asked to join (contract) and improving the product (legitimate interests). The AI processing of your health information happens on your instruction: there, we act as a processor of your content.',
    ],
  },
  exclusions: {
    heading: 'What we don’t do',
    bullets: [
      'We don’t sell personal data, and we never will.',
      'We don’t run advertising or personal tracking on the product or website.',
      'We don’t look at your vault. We built it so we can’t.',
      'We don’t send your data anywhere this page hasn’t told you about.',
    ],
  },
  rights: {
    heading: 'Your rights',
    paragraphs: [
      'For the data in the table above: ask what we hold, correct it, or have it deleted. Write to privacy@getmine.ai, or use “leave the beta” when it ships in the app. Your vault needs no rights from us: you hold the data.',
      'If you’re unhappy with how we’ve handled something, you can complain to the Information Commissioner’s Office (ico.org.uk). We’d appreciate the chance to fix it first.',
    ],
  },
  controller:
    'GetMine Ltd, registered in England and Wales, company number 17070331, is responsible for the personal data listed under “What we hold”. Contact: privacy@getmine.ai.',
  lastUpdated: '4 August 2026',
} as const;


export const trustPage = {
  title: 'Your vault stays with you.',
  eyebrow: 'Trust & security',
  version: 'Version 1.1',
  published: '4 August 2026',
  summary:
    'The short version: your vault lives on your computer, encrypted, and we hold no central copy of your records. What leaves is decided by your question, relayed but never kept by us.',
  lead:
    'GetMine is built so your health information can work for you without giving up control. This page is how we approach security today, what we are building toward, and, just as important, what we do not yet claim.',
  sections: [
    {
      heading: 'Secure by design',
      paragraphs: [
        'Your vault lives on your local device, and the day-to-day work of organising and recalling your information happens locally, on hardware you own. We hold no central copy of your records, and nothing leaves your device on its own.',
        'That architecture is the first layer of security: there is no central store of vaults to breach. What we do not hold cannot be lost, leaked or demanded from us.',
      ],
    },
    {
      heading: 'An encrypted vault',
      paragraphs: [
        'Your vault is an encrypted store on your computer, protected by one password that only you hold. A recovery phrase, issued when your vault is created, is the only other way back in.',
        'Should you choose to export your records as a zip file, you can password protect it, or keep the export as ordinary readable files. An ordinary export is as safe as the computer it sits on.',
      ],
    },
    {
      heading: 'Your question decides what is shared',
      paragraphs: [
        'When Mina answers, only the slice of your records that the question needs is sent to the AI provider, relayed through GetMine’s server, which keeps none of the content. Never your whole vault, and never your logins. Nothing leaves at rest, and nothing leaves without a question that requires it.',
      ],
    },
    {
      heading: 'You set the terms',
      paragraphs: [
        'Sharing happens by choice, per source and per permission, and what you have chosen is always visible in the app. You can disconnect a source or withdraw a consent whenever you choose, and doing so stops any further use immediately. An answer already given cannot be unsaid, so what changes is what happens next, which is the honest shape of any consent.',
      ],
    },
    {
      heading: 'The logins you grant',
      paragraphs: [
        'Credentials for the sources you connect are stored encrypted on your machine, separate from your health records. A copy of your vault, wherever it ends up, contains no usable login to anything.',
      ],
    },
    {
      heading: 'What we do not claim today',
      paragraphs: ['Being useful about security means being exact about its limits.'],
      bullets: [
        'We cannot reset your password. If you lose both your password and your recovery phrase, nobody can open your vault, us included. That is the price of a vault only you can read.',
        'We hold no formal certifications. We have not sought SOC 2 or ISO 27001, and we do not make claims we cannot back up. We will pursue the right ones as the product and the team grow.',
      ],
    },
    {
      heading: 'A foundation, not a destination',
      paragraphs: [
        'We are a small team in open beta. Security is foundational and we treat it that way: as GetMine matures our posture will deepen, with more controls, more transparency, and progressively more of the architecture running at the edge.',
      ],
    },
  ],
  questions: {
    heading: 'Questions',
    paragraphs: [
      'Write to security@getmine.ai for any trust or security question. We will answer honestly, and if our answer is “not yet”, we will say so.',
    ],
  },
} as const;


/**
 * The beta terms — ruled by Sabine 31 Jul 2026 (lawyer-lens pass applied).
 * Rendered by /terms; joins the regulatory pack as document 10. The privacy
 * policy governs data; these terms defer to it explicitly.
 */
export const termsPage = {
  summary:
    'the beta is free, Mina is not a doctor, and your vault is yours, on your computer, and it stays there whatever you decide about us.',
  title: 'Plain terms for the open beta',
  eyebrow: 'Terms',
  organisation: 'GetMine Ltd',
  lead:
    'A short, plain-English set of terms for using GetMine during the open beta. GetMine Ltd, England and Wales, company number 17070331. The privacy policy governs everything about your data; where these terms and the policy could be read differently, the policy prevails.',
  sections: [
    {
      heading: 'What the open beta is',
      body: 'GetMine is early software, free to use during the beta. Features will evolve and parts of what you see today will change.',
    },
    {
      heading: 'Who it’s for',
      body: 'Adults, 18 or over. The app will ask you to confirm this.',
    },
    {
      heading: 'Not a medical service',
      body: 'GetMine organises your health information. Mina is not a doctor: she does not diagnose, assess or triage, and nothing in GetMine is medical advice. Check anything important with a clinician.',
    },
    {
      heading: 'Your vault is yours',
      body: 'Your records live on your computer, in an encrypted vault only you can open. We never hold a central copy. Deleting GetMine never deletes your health information: the app and Mina go. Keep your own copies of anything you can’t afford to lose.',
    },
    {
      heading: 'The AI that’s included',
      body: 'The beta includes a GetMine AI allowance: Mina works without any key or account of your own. Heavy users may later be asked to add their own API key; that’s a choice made in Settings. What Mina sends, and to whom, is described precisely in the privacy policy, and only happens after you’ve agreed on the first-open screen.',
    },
    {
      heading: 'Use it responsibly',
      body: 'Use GetMine for health information you have the right to hold, and don’t add someone else’s records without their consent. We can pause a beta place that’s clearly being misused, and we’d tell you why.',
    },
    {
      heading: 'Feedback',
      body: 'The app has a feedback channel, and more ways may follow. Using it is always your choice: what you send helps us build a better product, and the privacy policy describes how it’s held.',
    },
    {
      heading: 'As-is, while we build',
      body: 'GetMine is provided as-is during the beta. We’ll do our best to fix problems quickly, but we can’t promise error-free software while it’s being built. Nothing in these terms limits the rights consumer law gives you.',
    },
    {
      heading: 'Leaving, and endings',
      body: 'You can leave whenever you like: the app has an exit, and the privacy policy describes the erasure you’re entitled to. If we ever end the beta, we’ll tell you clearly and in advance: Mina would stop working, but your health information stays on your computer, and export keeps it readable anywhere.',
    },
    {
      heading: 'Questions',
      body: 'Write to hello@getmine.ai. These terms are governed by the law of England and Wales.',
    },
  ],
  lastUpdated: '4 August 2026',
} as const;
