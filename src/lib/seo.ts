import { site } from '@/data/site';

/** Canonical production origin. Override with VITE_PUBLIC_SITE_URL when a custom domain is attached. */
export const SITE_URL = String(
  import.meta.env.VITE_PUBLIC_SITE_URL || 'https://dr-md-abidi.vercel.app',
).replace(/\/$/, '');

export const DEFAULT_OG_IMAGE = site.logo;

export function absoluteUrl(path = '/'): string {
  if (!path || path === '/') return `${SITE_URL}/`;
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}

export function upsertMeta(
  attr: 'name' | 'property',
  key: string,
  content: string | undefined,
): void {
  if (!content) return;
  const selector = `meta[${attr}="${key}"]`;
  let el = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export function upsertLink(rel: string, href: string): void {
  let el = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export function upsertJsonLd(id: string, data: Record<string, unknown> | Record<string, unknown>[]): void {
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

export function removeJsonLd(id: string): void {
  document.getElementById(id)?.remove();
}

/** Shared MedicalClinic + Physician + WebSite graph (facts already on the site). */
export function organizationGraph(): Record<string, unknown> {
  const brick = site.locations[0];
  const freehold = site.locations[1];

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: site.name,
        description: site.tagline,
        publisher: { '@id': `${SITE_URL}/#clinic` },
        inLanguage: 'en-US',
      },
      {
        '@type': ['MedicalClinic', 'MedicalBusiness', 'LocalBusiness'],
        '@id': `${SITE_URL}/#clinic`,
        name: site.name,
        url: `${SITE_URL}/`,
        image: site.logo,
        logo: site.logo,
        description: site.tagline,
        telephone: site.phone,
        email: site.email,
        medicalSpecialty: 'Rheumatology',
        address: [
          {
            '@type': 'PostalAddress',
            streetAddress: '206 Jack Martin Blvd Suite C2',
            addressLocality: 'Brick',
            addressRegion: 'NJ',
            postalCode: '08724',
            addressCountry: 'US',
          },
          {
            '@type': 'PostalAddress',
            streetAddress: '495 Iron Bridge Rd Suite 5',
            addressLocality: 'Freehold',
            addressRegion: 'NJ',
            postalCode: '07728',
            addressCountry: 'US',
          },
        ],
        location: [
          {
            '@type': 'Place',
            name: `${site.name} — ${brick.label}`,
            address: {
              '@type': 'PostalAddress',
              streetAddress: '206 Jack Martin Blvd Suite C2',
              addressLocality: 'Brick',
              addressRegion: 'NJ',
              postalCode: '08724',
              addressCountry: 'US',
            },
          },
          {
            '@type': 'Place',
            name: `${site.name} — ${freehold.label}`,
            address: {
              '@type': 'PostalAddress',
              streetAddress: '495 Iron Bridge Rd Suite 5',
              addressLocality: 'Freehold',
              addressRegion: 'NJ',
              postalCode: '07728',
              addressCountry: 'US',
            },
          },
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: site.phone,
          contactType: 'customer service',
          email: site.email,
          areaServed: 'US',
          availableLanguage: 'English',
        },
        employee: { '@id': `${SITE_URL}/#physician` },
      },
      {
        '@type': ['Person', 'Physician'],
        '@id': `${SITE_URL}/#physician`,
        name: 'Dr. Mutahir Abidi',
        honorificPrefix: 'Dr.',
        jobTitle: 'Board-certified Rheumatologist',
        description:
          'Board-certified rheumatologist and arthritis specialist with more than 15 years of experience diagnosing and treating arthritis, joint pain, and autoimmune diseases.',
        worksFor: { '@id': `${SITE_URL}/#clinic` },
        medicalSpecialty: 'Rheumatology',
        url: absoluteUrl('/about-us/'),
        image: site.logo,
      },
    ],
  };
}
