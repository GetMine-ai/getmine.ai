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
    'The short version: your health records live on your computer, in a folder you own. We never have a copy. The website does not ask for an account or email before download and measures only anonymous page views and download clicks.',
  beta: {
    heading: 'The beta, plainly',
    paragraphs: [
      'GetMine is experimental software for adults (18+). Mina organises your health information; she is not a doctor and does not diagnose. Check anything important with a clinician, and keep your own copies of anything you can’t afford to lose.',
    ],
  },
  website: {
    heading: 'The website and downloads',
    paragraphs: [
      'You can download the open beta without creating an account or giving us an email address. The website sends two anonymous counts to GetMine: that the download page was viewed and that a download link was clicked. Those counts contain no email address, health information, cookie, account identifier or device identifier, and are not stored in your browser.',
      'The installer itself comes from GetMine’s release service. Your computer verifies the publisher before it installs: GETMINE LTD, notarised by Apple on macOS and publisher-verified by Microsoft on Windows.',
    ],
  },
  vault: {
    heading: 'Your Health Vault: yours, on your computer',
    paragraphs: [
      'Everything you add or connect (electronic health records, documents, emails you choose to scan, photos, notes) lives in the Health Vault folder on your own computer. We hold no copy, we cannot see it, and nothing in the product reports its contents to us.',
      'We can’t lose or leak what we don’t have. Your records are as safe as your computer: keeping it protected, and being careful where you copy or share your vault folder, is in your hands, as it would be with paper records.',
      'Deleting GetMine never deletes your vault. The app and Mina go; your folder stays, readable without us. Want it gone too? Put it in the Bin.',
    ],
  },
  mina: {
    heading: 'When Mina answers a question',
    paragraphs: [
      'Mina is powered by our AI LLM provider. To answer a question, or to file a document, email or photo you’ve added, she sends the provider only the slice of your records relevant to that task. Never your whole vault, never your logins. And only after you’ve agreed on the first-open screen: no consent, no Mina.',
      'Requests either pass through GetMine’s server, which keeps none of the content and only counts them against the AI allowance included with the beta, or go straight from your computer to the provider under your own key, never touching a GetMine server.',
      'About our AI LLM provider: whoever it is, our terms with them must meet three conditions. Your content is never used to train AI models, operational logs delete automatically within days, and data leaving the UK travels under lawful safeguards.',
    ],
  },
  sources: {
    heading: 'Sources you connect',
    bullets: [
      'Electronic health records (in the UK, your NHS record) reach your vault through our health-records access partner, after you log in with them and authorise it.',
      'Email scanning is read-only. GetMine can never send, change or delete your email, and your mailbox is read on your computer, not by us. You can revoke the access you granted with your email provider at any time.',
      'The logins you grant are stored encrypted on your machine, with the key kept outside the vault folder. A copy of your folder, wherever it ends up, contains no usable login to anything.',
      'Disconnect any source at any time, in the app.',
    ],
  },
  holdings: {
    heading: 'What we hold',
    introduction: 'GetMine holds exactly this, and nothing else:',
    summaryParagraph:
      'GetMine holds exactly this, and nothing else: anonymous website page-view and download-click totals; any email address and beta status kept from the earlier invitation-only beta; your consent record, as proof we asked; and your AI usage counts, for the allowance included with the beta. Only if you opt in: which parts of the app you use (never health data), and any feedback you send. Everything is deleted within 6 months of the beta ending, except the consent record, which we keep for 6 years. No health information appears anywhere in this list.',
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
      'No health information appears in this table. The current website asks for no email before download. It counts only anonymous download-page views and download-link clicks. If you joined during the earlier invitation-only beta, the email and beta-status entries above still describe those records.',
      'Our lawful bases: running the beta you asked to join (contract), improving the product (legitimate interests), and your explicit consent for the AI processing of health information described above.',
    ],
  },
  exclusions: {
    heading: 'What we don’t do',
    bullets: [
      'We don’t sell personal data, and we never will.',
      'We don’t run advertising or personal tracking on the product or website.',
      'We don’t look at your vault. We built it so we can’t.',
      'We don’t send your data anywhere this page hasn’t told you about.',
      'We don’t change this page quietly: if it changes, we tell you before it applies to you.',
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
  lastUpdated: '27 July 2026',
} as const;


export const trustPage = {
  title: 'Your vault stays with you.',
  eyebrow: 'Trust & security',
  version: 'Version 1.0',
  published: '29 July 2026',
  summary:
    'The short version: your vault lives on your computer and we hold no copy. What leaves is decided by your question, relayed but never kept by us — and where security is still being built, this page says so plainly.',
  lead:
    'GetMine is built so your health information can work for you without giving up control. This page is how we approach security today, what we are building toward, and — just as important — what we do not yet claim.',
  sections: [
    {
      heading: 'Local-first by design',
      paragraphs: [
        'Your vault lives on your device. The day-to-day work of organising and recalling your information happens locally, on hardware you own. We hold no copy of your records, and nothing leaves your device on its own.',
      ],
    },
    {
      heading: 'Your question decides what is shared',
      paragraphs: [
        'When Mina answers, only the slice of your records that the question needs is sent to the AI provider — relayed through GetMine\u2019s server, which keeps none of the content. Never your whole vault, and never your logins. Nothing leaves at rest, and nothing leaves without a question that requires it.',
      ],
    },
    {
      heading: 'You set the terms',
      paragraphs: [
        'Sharing happens by choice, per source and per permission, and what you have chosen is always visible in the app. You can disconnect a source or withdraw a consent whenever you choose, and doing so stops any further use immediately. An answer already given cannot be unsaid — so what changes is what happens next, which is the honest shape of any consent.',
      ],
    },
    {
      heading: 'The logins you grant',
      paragraphs: [
        'Credentials for the sources you connect are stored encrypted on your machine, with the key kept outside the vault folder. A copy of your vault folder, wherever it ends up, contains no usable login to anything.',
      ],
    },
    {
      heading: 'A verified installer',
      paragraphs: [
        'The installer is signed by GETMINE LTD — notarised by Apple, publisher-verified by Microsoft. Your computer checks that signature before anything installs.',
      ],
    },
    {
      heading: 'What we do not claim today',
      paragraphs: ['Being useful about security means being exact about its limits.'],
      bullets: [
        'The vault folder is not encrypted by the app. It relies on your operating system\u2019s own disk encryption (FileVault on macOS, BitLocker on Windows) — which we recommend you switch on. Application-level encryption of the vault is future work, not a property we have today.',
        'Your records are as safe as your computer. Keeping it protected, and being careful where you copy or share your vault folder, is in your hands, as it would be with paper records.',
        'We hold no formal certifications. We have not sought SOC 2 or ISO 27001, and we do not make claims we cannot back up. We will pursue the right ones as the product and the team grow.',
      ],
    },
    {
      heading: 'A foundation, not a destination',
      paragraphs: [
        'We are a small team in open beta. Security is foundational and we treat it that way: as GetMine matures our posture will deepen — more controls, more transparency, and progressively more of the architecture running at the edge. We will keep publishing plain-English documentation as that happens, and we will say when something changes.',
      ],
    },
  ],
  governing:
    'The privacy policy is the governing statement; where the two could be read differently, the privacy policy prevails.',
} as const;
