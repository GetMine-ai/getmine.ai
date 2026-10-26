/**
 * Press: the announcements list at /press and one page per release under it.
 *
 * `pressPublished` is the Monday switch. On the release branch it is false:
 * the About us "In the news" line and the footer Press link do not render,
 * and the two press routes show the not-found page with noindex, so nothing
 * leaks before the partner's embargo lifts. Flipping it to true is the only
 * change needed on the morning of the announcement.
 */
export const pressPublished = true;

export type ReleaseBlock =
  | { kind: 'lead' | 'p'; html: string }
  | { kind: 'quote'; text: string; by: string };

export interface Release {
  /** The URL under /press/. */
  slug: string;
  /** ISO date for <time>. */
  date: string;
  /** The date as printed. */
  dateLabel: string;
  headline: string;
  /** The list card's summary. */
  summary: string;
  /** Under /assets/press/. */
  image: string;
  /** The social crop, 1200 × 630, under /assets/press/. */
  ogImage: string;
  imageAlt: string;
  body: ReleaseBlock[];
  about: { heading: string; text: string; linkLabel: string; href: string };
}

export const releases: Release[] = [
  {
    slug: 'pkb-2026-10-19',
    date: '2026-10-19',
    dateLabel: '19 October 2026',
    headline:
      'Patients Know Best and GetMine partner to launch a patient-owned AI intelligent health vault',
    summary:
      'GetMine, an intelligent health vault on a person’s own computer with an AI health companion, today announces a partnership with Patients Know Best, the world’s largest personal health record and patient engagement platform, with almost 9 million registered patients. PKB users can choose to connect their health and care records to GetMine and ask Mina, a personal AI health companion, about them, with answers that link back to the source. Their information stays in an encrypted vault on their own computer.',
    image: '/assets/press/pkb-getmine-launch-1920.png',
    ogImage: '/assets/press/pkb-getmine-launch-og.png',
    imageAlt:
      'Patients Know Best and GetMine: your health records and everyday health information in one intelligent vault on your computer',
    body: [
      {
        kind: 'lead',
        html: '<strong>London, 19 October 2026.</strong> GetMine, an intelligent health vault on a person’s own computer with an AI health companion, today announces a partnership with Patients Know Best (PKB), the world’s largest personal health record and patient engagement platform, with almost 9 million registered patients.',
      },
      {
        kind: 'p',
        html: 'GetMine offers Mina, a personal AI health companion, which helps people make sense of their health information. The new partnership means patients can enable Mina to draw on their connected PKB health &amp; care records, uploaded results, letters, photos and other user-generated health information, using the context they choose to share. Her answers link back to source records so people can check the details.',
      },
      {
        kind: 'p',
        html: 'With Mina, people can prepare for appointments, follow their results over time and keep track of their health history. She also helps them record symptoms and organise their thoughts, questions and observations ahead of a conversation about their health.',
      },
      {
        kind: 'p',
        html: 'People remain in control. PKB connects their records only when they choose to share them. Their information is held in an encrypted vault on their own computer and stays with them, with or without GetMine.',
      },
      {
        kind: 'quote',
        text: 'Doesn’t it make sense to have one place where all your health information comes together, yours to own, control and use freely? That is agency. GetMine brings it together, and Mina helps you make sense of it and put it to work. I am delighted to partner with Patients Know Best to help take this forward. Your health. Your data. Your rules.',
        by: 'Sabine Azancot, CEO and Co-Founder, GetMine',
      },
      {
        kind: 'quote',
        text: 'Hundreds of millions of people are manually uploading fragments of their records into public AI platforms. They do this despite the privacy problems and the inaccurate advice from incomplete data because they have a genuine need to understand their health. Our partnership helps solve this by enabling PKB users to safely connect their PKB record with GetMine’s AI capabilities. Patients gain an intelligent companion, all while keeping their data completely private on their own computer.',
        by: 'Dr Mohammad Al-Ubaydli, CEO and Co-Founder, Patients Know Best',
      },
      {
        kind: 'p',
        html: 'People can register with PKB, then choose to connect their health records to GetMine. GetMine keeps no central copy of their health records and does not use their health data to train AI models.',
      },
      {
        kind: 'p',
        html: 'GetMine has been in open beta in the UK since 7 September 2026 for adults aged 18 and over, on Mac and Windows. It is free to download and includes an AI allowance, with optional paid top-ups for additional use. Users can leave the beta at any time and keep their vault. GetMine does not diagnose or provide medical advice.',
      },
      {
        kind: 'p',
        html: 'Beta users are invited to help shape the product by sharing what they need, what gets in the way and what is missing. GetMine will also be available through the PKB patient portal later this year.',
      },
    ],
    about: {
      heading: 'About Patients Know Best',
      text: 'Patients Know Best is the world’s largest Personal Health Record solution, with almost 9 million registered patients, one in six adults across England and Wales. Founded as a social enterprise in 2008, PKB brings together data from NHS and private providers, GP records, medical devices, wearables and the patient’s own entries into a single patient record. It is integrated into the NHS App and NHS Wales App, and lets patients securely share their record with anyone, anywhere. PKB is expanding internationally, including Canada and Lagos State, Nigeria.',
      linkLabel: 'patientsknowbest.com',
      href: 'https://www.patientsknowbest.com',
    },
  },
];
