// Central place for personal details and site settings.
export const SITE = {
  name: 'Sam Labenne',
  fullName: 'Samuel Labenne',
  tagline: 'From pixel to pipeline',
  role: 'Digital builder, available for projects',
  description:
    'Sam Labenne builds websites, webshops (Wix & Shopify), and implements Odoo & Salesforce. One partner from first pixel to signed invoice.',
  email: 'labenne.sam@gmail.com',
  // TODO: add a LinkedIn profile URL.
  linkedin: '',
  work: { name: 'Ksara Events', url: 'https://ksaraevents.com' },
  // Keep search engines out while the site lives on the github.io staging URL.
  // Flip to true at domain launch.
  indexable: false,
  // Google Analytics 4 measurement ID (e.g. 'G-XXXXXXXXXX'). Only loaded after a
  // visitor accepts cookies in the consent banner. Empty = no analytics at all.
  analyticsId: '',
  // Optional business details shown in the privacy policy (e.g. a VAT or
  // company number once you invoice under one).
  legal: {
    registration: '',
    address: '',
  },
  policiesUpdated: '2026-09-28',
};

export const NAV = [
  { label: 'Services', href: '/services/' },
  { label: 'Work', href: '/#work' },
  { label: 'About', href: '/about/' },
  { label: 'Insights', href: '/insights/' },
  { label: 'Contact', href: '/contact/' },
];

/** Prefix an internal path with the configured base (e.g. /SamuelLabenneOnline on GitHub Pages). */
export function url(path = '/'): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

/** mailto: link with an optional pre-filled subject. */
export function mailto(subject = 'New project'): string {
  return `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}`;
}
