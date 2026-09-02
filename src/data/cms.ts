/* ─────────────────────────────────────────────────────────
   CMS Store — dynamic Conditions & IV Packages
   Data is persisted in localStorage so changes made in
   /admin are instantly reflected on the public website.
───────────────────────────────────────────────────────── */

export interface CmsCondition {
  id: string;
  slug: string;
  title: string;
  href: string;
  heroEyebrow: string;
  shortDescription: string;
  cardImage: string;      // path or URL
  heroImage: string;
  overview: string;       // free-text, newline separated
  symptoms: string;       // comma separated
  treatmentIntro: string;
  metaTitle: string;
  metaDescription: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CmsIVPackage {
  id: string;
  slug: string;
  name: string;
  price: number;
  totalValue?: number;
  badge?: string;
  image: string;          // path or URL
  tagline: string;
  description: string;
  dosages: string;
  bestFor: string;        // comma separated
  ingredients: string;    // newline sep: "abbr|name|description|dosage"
  addOns: string;         // newline sep: "name|price|description"
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

const COND_KEY = 'cms_conditions';
const PKG_KEY  = 'cms_iv_packages';

/* ── Conditions ── */
export function getCmsConditions(): CmsCondition[] {
  try { return JSON.parse(localStorage.getItem(COND_KEY) || '[]'); } catch { return []; }
}
export function saveCmsCondition(c: CmsCondition): void {
  const list = getCmsConditions().filter(x => x.id !== c.id);
  list.push(c);
  localStorage.setItem(COND_KEY, JSON.stringify(list));
  // Notify other components in the same tab
  window.dispatchEvent(new Event('storage'));
}
export function deleteCmsCondition(id: string): void {
  const list = getCmsConditions().filter(x => x.id !== id);
  localStorage.setItem(COND_KEY, JSON.stringify(list));
  window.dispatchEvent(new Event('storage'));
}

/* ── IV Packages ── */
export function getCmsIVPackages(): CmsIVPackage[] {
  try { return JSON.parse(localStorage.getItem(PKG_KEY) || '[]'); } catch { return []; }
}
export function saveCmsIVPackage(p: CmsIVPackage): void {
  const list = getCmsIVPackages().filter(x => x.id !== p.id);
  list.push(p);
  localStorage.setItem(PKG_KEY, JSON.stringify(list));
  window.dispatchEvent(new Event('storage'));
}
export function deleteCmsIVPackage(id: string): void {
  const list = getCmsIVPackages().filter(x => x.id !== id);
  localStorage.setItem(PKG_KEY, JSON.stringify(list));
  window.dispatchEvent(new Event('storage'));
}

export function newId(): string {
  return `CMS-${Date.now()}-${Math.random().toString(36).slice(2,6).toUpperCase()}`;
}

function slug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
export function makeSlug(title: string): string { return slug(title); }
