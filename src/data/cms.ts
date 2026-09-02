import { supabase } from '@/lib/supabase';

export interface CmsCondition {
  id: string;
  slug: string;
  title: string;
  href: string;
  heroEyebrow: string;
  shortDescription: string;
  cardImage: string;
  heroImage: string;
  overview: string;
  symptoms: string;
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
  image: string;
  tagline: string;
  description: string;
  dosages: string;
  bestFor: string;
  ingredients: string;
  addOns: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

function throwApi(error: { message: string } | null, fallback: string): never {
  throw new Error(error?.message || fallback);
}

function rowToCondition(row: Record<string, unknown>): CmsCondition {
  return {
    id: String(row.id),
    slug: String(row.slug ?? ''),
    title: String(row.title ?? ''),
    href: String(row.href ?? ''),
    heroEyebrow: String(row.hero_eyebrow ?? ''),
    shortDescription: String(row.short_description ?? ''),
    cardImage: String(row.card_image ?? ''),
    heroImage: String(row.hero_image ?? ''),
    overview: String(row.overview ?? ''),
    symptoms: String(row.symptoms ?? ''),
    treatmentIntro: String(row.treatment_intro ?? ''),
    metaTitle: String(row.meta_title ?? ''),
    metaDescription: String(row.meta_description ?? ''),
    enabled: Boolean(row.enabled),
    createdAt: String(row.created_at ?? ''),
    updatedAt: String(row.updated_at ?? ''),
  };
}

function rowToPackage(row: Record<string, unknown>): CmsIVPackage {
  return {
    id: String(row.id),
    slug: String(row.slug ?? ''),
    name: String(row.name ?? ''),
    price: Number(row.price ?? 0),
    totalValue: row.total_value == null ? undefined : Number(row.total_value),
    badge: String(row.badge ?? ''),
    image: String(row.image ?? ''),
    tagline: String(row.tagline ?? ''),
    description: String(row.description ?? ''),
    dosages: String(row.dosages ?? ''),
    bestFor: String(row.best_for ?? ''),
    ingredients: String(row.ingredients ?? ''),
    addOns: String(row.add_ons ?? ''),
    enabled: Boolean(row.enabled),
    createdAt: String(row.created_at ?? ''),
    updatedAt: String(row.updated_at ?? ''),
  };
}

export async function getCmsConditions(): Promise<CmsCondition[]> {
  const { data, error } = await supabase
    .from('cms_conditions')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throwApi(error, 'Could not load conditions.');
  return (data || []).map(row => rowToCondition(row as Record<string, unknown>));
}

export async function saveCmsCondition(c: CmsCondition): Promise<void> {
  const { error } = await supabase.from('cms_conditions').upsert({
    id: c.id,
    slug: c.slug,
    title: c.title,
    href: c.href || '',
    hero_eyebrow: c.heroEyebrow || '',
    short_description: c.shortDescription || '',
    card_image: c.cardImage || '',
    hero_image: c.heroImage || '',
    overview: c.overview || '',
    symptoms: c.symptoms || '',
    treatment_intro: c.treatmentIntro || '',
    meta_title: c.metaTitle || '',
    meta_description: c.metaDescription || '',
    enabled: c.enabled,
    created_at: c.createdAt,
    updated_at: new Date().toISOString(),
  });
  if (error) throwApi(error, 'Could not save the condition.');
}

export async function deleteCmsCondition(id: string): Promise<void> {
  const { error } = await supabase.from('cms_conditions').delete().eq('id', id);
  if (error) throwApi(error, 'Could not delete the condition.');
}

export async function getCmsIVPackages(): Promise<CmsIVPackage[]> {
  const { data, error } = await supabase
    .from('cms_iv_packages')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throwApi(error, 'Could not load IV packages.');
  return (data || []).map(row => rowToPackage(row as Record<string, unknown>));
}

export async function saveCmsIVPackage(p: CmsIVPackage): Promise<void> {
  const { error } = await supabase.from('cms_iv_packages').upsert({
    id: p.id,
    slug: p.slug,
    name: p.name,
    price: p.price,
    total_value: p.totalValue ?? null,
    badge: p.badge || '',
    image: p.image || '',
    tagline: p.tagline || '',
    description: p.description || '',
    dosages: p.dosages || '',
    best_for: p.bestFor || '',
    ingredients: p.ingredients || '',
    add_ons: p.addOns || '',
    enabled: p.enabled,
    created_at: p.createdAt,
    updated_at: new Date().toISOString(),
  });
  if (error) throwApi(error, 'Could not save the IV package.');
}

export async function deleteCmsIVPackage(id: string): Promise<void> {
  const { error } = await supabase.from('cms_iv_packages').delete().eq('id', id);
  if (error) throwApi(error, 'Could not delete the IV package.');
}

export function newId(): string {
  return `CMS-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

function slug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
export function makeSlug(title: string): string { return slug(title); }
