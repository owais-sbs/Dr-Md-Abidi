export const site = {
  name: 'MD Abidi Arthritis Institute',
  shortName: 'MD Abidi',
  tagline: 'Trusted Arthritis & Rheumatology Specialists',
  logo: 'https://mdabidi.com/wp-content/uploads/2025/05/Arthritis-Institute-new-logo-1-1024x387.webp',
  logoDark: 'https://mdabidi.com/wp-content/uploads/2025/05/Arthritis-Institute-new-logo-1-1024x387.webp',
  phone: '732-840-8402',
  phoneHref: 'tel:732-840-8402',
  email: 'admin@mdabidi.com',
  emailHref: 'mailto:admin@mdabidi.com',
  bookingUrl: '/contact-us/',
  hours: '08:00 AM – 05:00 PM',
  locations: [
    {
      label: 'Brick',
      lines: ['206 Jack Martin Blvd Suite C2', 'Brick, NJ 08724'],
      mapQuery: '206 Jack Martin Blvd Suite C2, Brick, NJ 08724',
    },
    {
      label: 'Freehold',
      lines: ['495 Iron Bridge Rd Suite 5', 'Freehold, NJ 07728'],
      mapQuery: '495 Iron Bridge Rd Suite 5, Freehold, NJ 07728',
    },
  ],
  social: [
    { name: 'Facebook', href: 'https://www.facebook.com/', icon: 'facebook' },
    { name: 'Instagram', href: 'https://www.instagram.com/', icon: 'instagram' },
    { name: 'LinkedIn', href: 'https://www.linkedin.com/', icon: 'linkedin' },
  ],
};

export type SiteData = typeof site;
