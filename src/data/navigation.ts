import { site } from './site';

export interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

export const mainNav: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about-us/' },
  {
    label: 'Conditions We Treat',
    href: '/conditions-we-treat/',
    children: [
      { label: 'Carpal Tunnel Syndrome', href: '/carpal-tunnel-syndrome/' },
      { label: 'Rheumatoid Arthritis', href: '/rheumatoid-arthritis/' },
      { label: 'Psoriatic Arthritis', href: '/psoriatic-arthritis/' },
      { label: 'Lupus', href: '/lupus/' },
      { label: "Sjogren's Syndrome", href: '/sjogrens-syndrome/' },
      { label: 'Polymyositis And Dermatomyositis', href: '/polymyositis-and-dermatomyositis/' },
      { label: 'Vasculitis', href: '/vasculitis/' },
      { label: 'Spondyloarthritis', href: '/spondyloarthritis/' },
      { label: 'Gout', href: '/gout/' },
    ],
  },
  {
    label: 'IV Packages',
    href: '/iv-packages/',
    children: [
      { label: 'Saline',                 href: '/iv-packages/saline/' },
      { label: 'The Myers',              href: '/iv-packages/the-myers/' },
      { label: 'The After Party',        href: '/iv-packages/the-after-party/' },
      { label: 'MTO',                    href: '/iv-packages/mto/' },
      { label: 'Go With The Flow',       href: '/iv-packages/go-with-the-flow/' },
      { label: 'The Migraine Minimizer', href: '/iv-packages/the-migraine-minimizer/' },
      { label: 'The Defensive Line',     href: '/iv-packages/the-defensive-line/' },
      { label: 'The Kitchen Sink',       href: '/iv-packages/the-kitchen-sink/' },
      { label: 'The greNADe',            href: '/iv-packages/the-grenade/' },
    ],
  },
  { label: 'Happy Patients', href: '/happy-patients/' },
  { label: 'Blog', href: '/blog/' },
  { label: 'Contact Us', href: '/contact-us/' },
];

export const footerPages = [
  { label: 'Home',           href: '/' },
  { label: 'About Us',       href: '/about-us/' },
  { label: 'IV Packages',    href: '/iv-packages/' },
  { label: 'Happy Patients', href: '/happy-patients/' },
  { label: 'Blog',           href: '/blog/' },
  { label: 'Contact Us',     href: '/contact-us/' },
];

export const footerTreatments = [
  { label: 'Rheumatoid Arthritis',  href: '/rheumatoid-arthritis/' },
  { label: 'Psoriatic Arthritis',   href: '/psoriatic-arthritis/' },
  { label: 'Lupus',                 href: '/lupus/' },
  { label: "Sjogren's Syndrome",    href: '/sjogrens-syndrome/' },
  { label: 'View All Treatments',   href: '/conditions-we-treat/' },
];

export const bookingHref = site.bookingUrl;
