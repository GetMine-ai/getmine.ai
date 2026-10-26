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
  version: 'Version 2.0',
  published: '27 July 2026',
  reviewStatus: '',
  scope: 'This policy covers the GetMine app and the getmine.ai website.',
  summary:
    'In short: your health records stay on your computer. We store none of them, and we train no AI model on them. We hold only what we need to run the beta.',
  beta: {
    heading: 'The beta, plainly',
    paragraphs: [
      'GetMine is early software for adults (18 and over). Mina helps you organise your health information. She is not a doctor and does not diagnose, so check anything important with a clinician. Keep your own copies of anything you can’t afford to lose.',
    ],
  },
  vault: {
    heading: 'Your Health Vault: yours, on your computer',
    paragraphs: [
      'Everything you add or connect, such as health records, documents, emails, photos and notes, is kept in your Health Vault on your own computer. We have no copy and we can’t see it. The app only tells us counts, like how many records you have, never what they say.',
      'Your vault is encrypted, so only you can open it, with your password or the twelve recovery words you get when you create it. Keep those words somewhere safe. We can’t lose or leak what we don’t have, so keeping your computer protected, and being careful with any export you choose to make, is in your hands.',
      'If you delete GetMine, your health records stay on your computer’s hard disk. Only the GetMine app and Mina go.',
    ],
  },
  mina: {
    heading: 'When Mina helps you',
    paragraphs: [
      'Mina uses an AI service, Anthropic. To answer a question, or to file something you’ve added, she sends only the part of your records the task needs. Never your whole vault, and never your passwords.',
      'Before Mina can help, you give your consent once, in the app. Her requests then pass through our server, which keeps none of what you sent and only counts them against your credit.',
    ],
  },
  sources: {
    heading: 'Sources you connect',
    bullets: [
      'Your health records (in the UK, your NHS record) come from our partner Patients Know Best, once you’ve registered with them.',
      'Email scanning is read-only: GetMine only looks for your health emails, and can never send, change or delete anything. Your mailbox is read on your computer, not by us.',
      'You can disconnect your email at any time, in the app. To sync your NHS record, you’ll usually need to sign in to Patients Know Best first.',
    ],
  },
  holdings: {
    heading: 'What we hold',
    /** The website-counting sentence ends this paragraph; privacy.astro adds the
     *  turn-off link after it (src/data/visitCounting.ts). */
    summaryParagraph:
      'We hold only what we need to run the beta: your account details, such as your email address and your consent; where your GetMine installer came from, to administer referrals; how much you use Mina, and any credit you buy; how the app is used, never your records, questions or answers; and your feedback, if you send it. None of this is health information, so please keep health details out of your feedback. On our website, we count how many people visit and what they read, as daily totals only: no cookies, and nothing that identifies you.',
    paragraphs: [
      'We keep this while you’re in the beta and delete it when you leave. For legal reasons, two things stay longer: the record of your consent, for 6 years, and a record of payments that doesn’t name you, for our accounts. Card details go to our payment provider, Stripe, never to us.',
      'A few third-party providers help us run the beta: Stripe for payments, an email provider for our emails, and hosting providers for our website and server. They only hold the details above, never your health records. Where a provider is based outside the UK, we use the UK’s approved safeguards. We hold this to run the beta you joined, to improve GetMine, and to keep the accounts the law requires.',
    ],
  },
  rights: {
    heading: 'Your rights',
    paragraphs: [
      'You can ask to see, correct or delete what we hold, limit how we use it, object to it, or take a copy elsewhere. For this, or any question about this policy, email privacy@getmine.ai, or use Leave the beta in the app, which also withdraws your consent. Your vault is already yours.',
      'You can also complain to the Information Commissioner’s Office (ico.org.uk).',
    ],
  },
  controller:
    'Who we are: GetMine Ltd, registered in England and Wales, company number 17070331. We are responsible for what is listed under “What we hold”. Contact: privacy@getmine.ai.',
  lastUpdated: '12 October 2026',
} as const;


export const trustPage = {
  title: 'Your vault stays with you.',
  eyebrow: 'Trust & Security',
  version: 'Version 1.1',
  published: '11 October 2026',
  summary:
    'The short version: your vault lives on your computer, encrypted, and we hold no central copy of your records. Only what is needed to answer your question, or to organise what you bring into the vault, is shared, relayed but never kept by us. We store no health records on our servers, and we train no AI model on them.',
  lead:
    'GetMine is built so your health information can work for you without giving up control. This page is how we approach security today, what we are building toward, and, just as important, what we do not yet claim.',
  sections: [
    {
      heading: 'Secure by design',
      paragraphs: [
        'Your vault lives on your local device, and the day-to-day work of storing and searching your records happens locally, on hardware you own. We hold no central copy of your records.',
        'That architecture is the first layer of security: there is no central store of vaults to breach. What we do not hold cannot be lost, leaked or demanded from us.',
      ],
    },
    {
      heading: 'An encrypted vault',
      paragraphs: [
        'Your vault is an encrypted store on your computer, protected by one password that only you hold. A recovery phrase, issued when your vault is created, is the only other way back in.',
        'Should you choose to export your records, the export is ordinary readable files, and it is as safe as the computer it sits on.',
      ],
    },
    {
      heading: 'Only what Mina needs is shared',
      paragraphs: [
        'When Mina helps you, only the slice of your records the task needs is sent to the AI provider, relayed through GetMine’s server, which keeps none of the content. Never your whole vault, and never your logins. Nothing is shared until you’ve given your consent, which we ask for when you start adding your records.',
      ],
    },
    {
      heading: 'You set the terms',
      paragraphs: [
        'You choose which sources to connect, and you can see them in the app. You can disconnect your email at any time, in the app. To sync your NHS record, you’ll usually need to sign in to Patients Know Best first. To withdraw your consent, leave the beta. Nothing more is sent after that, but an answer Mina has already given cannot be taken back.',
      ],
    },
    {
      heading: 'The logins you grant',
      paragraphs: [
        'The logins you grant are kept locked on your computer, apart from your health records. A copy of your vault, wherever it ends up, contains no usable login to anything.',
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
    'the beta is free and comes with credit for Mina, you can top up with more credit if you want it, Mina is not a doctor, and your vault is yours, on your computer, and it stays there whatever you decide about us.',
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
      body: 'Your records live on your computer, in an encrypted vault only you can open. We never hold a central copy. Deleting GetMine never deletes your health information: the app and Mina go. Keep your own copies of anything you can’t afford to lose. We store no health records on our servers, and we train no AI model on them.',
    },
    {
      heading: 'The AI that’s included',
      body: 'The beta includes free credit for Mina. Top-ups are in Settings, Billing: Stripe takes the payment, and we never see your card. What Mina sends, and to whom, is in the privacy policy, and happens only after you’ve given your consent, which we ask for when you start adding your records.',
    },
    {
      id: 'refunds',
      heading: 'Refunds',
      body: 'If a payment went wrong, or you change your mind, write to hello@getmine.ai within 14 days and we’ll refund the credit you haven’t used. Refunds go back to the card you paid with.',
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
  lastUpdated: '11 October 2026',
} as const;
