import { pressPublished } from './press';

export const footerLinks = [
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Terms' },
  { href: '/trust', label: 'Trust & Security' },
  ...(pressPublished ? [{ href: '/press', label: 'Press' }] : []),
  { href: 'mailto:hello@getmine.ai', label: 'Contact' },
];
