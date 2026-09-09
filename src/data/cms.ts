import { supabase } from '@/lib/supabase';
import type { Condition } from '@/data/conditions';

export interface CmsCondition {
  id: string;
  slug: string;
  title: string;
  href: string;
  heroEyebrow: string;
  shortDescription: string;
  cardImage: string;
  heroImage: string;
  heroImageAlt: string;
  overview: string;
  sections: string;
  symptoms: string;
  treatmentIntro: string;
  ctaHeading: string;
  ctaBody: string;
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
    heroImageAlt: String(row.hero_image_alt ?? ''),
    overview: String(row.overview ?? ''),
    sections: String(row.sections ?? ''),
    symptoms: String(row.symptoms ?? ''),
    treatmentIntro: String(row.treatment_intro ?? ''),
    ctaHeading: String(row.cta_heading ?? ''),
    ctaBody: String(row.cta_body ?? ''),
    metaTitle: String(row.meta_title ?? ''),
    metaDescription: String(row.meta_description ?? ''),
    enabled: Boolean(row.enabled),
    createdAt: String(row.created_at ?? ''),
    updatedAt: String(row.updated_at ?? ''),
  };
}

/** Split overview into paragraphs (blank-line separated). */
export function parseOverview(raw: string): string[] {
  return raw
    .replace(/\r\n/g, '\n')
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\n/g, ' ').trim())
    .filter(Boolean);
}

/** Parse ## Heading blocks into Condition.sections */
export function parseSections(raw: string): { heading: string; body: string[] }[] {
  const text = raw.replace(/\r\n/g, '\n').trim();
  if (!text) return [];
  const parts = text.split(/^##\s+/m).map((p) => p.trim()).filter(Boolean);
  return parts.map((block) => {
    const nl = block.indexOf('\n');
    const heading = (nl === -1 ? block : block.slice(0, nl)).trim();
    const rest = nl === -1 ? '' : block.slice(nl + 1).trim();
    const body = rest
      ? rest.split(/\n\s*\n/).map((p) => p.replace(/\n/g, ' ').trim()).filter(Boolean)
      : [];
    return { heading, body: body.length ? body : [''] };
  }).filter((s) => s.heading);
}

export function parseSymptoms(raw: string): string[] {
  if (!raw.trim()) return [];
  if (raw.includes('\n')) {
    return raw.split(/\n/).map((s) => s.replace(/^[-*•]\s*/, '').trim()).filter(Boolean);
  }
  return raw.split(',').map((s) => s.trim()).filter(Boolean);
}

/** Map a CMS condition row into the same shape used by static condition pages. */
export function cmsConditionToCondition(c: CmsCondition): Condition {
  const image = c.heroImage || c.cardImage;
  return {
    slug: c.slug,
    title: c.title,
    href: c.href || `/${c.slug}/`,
    shortDescription: c.shortDescription,
    heroEyebrow: c.heroEyebrow || 'Condition We Treat',
    heroImage: image,
    heroImageAlt: c.heroImageAlt || `${c.title} treatment at MD Abidi Arthritis Institute`,
    cardImage: c.cardImage || c.heroImage || image,
    overview: parseOverview(c.overview),
    sections: parseSections(c.sections),
    symptoms: parseSymptoms(c.symptoms),
    treatmentIntro: c.treatmentIntro,
    ctaHeading: c.ctaHeading || `Specialist ${c.title} Care in Brick & Freehold, NJ`,
    ctaBody: c.ctaBody || 'Our rheumatology team can help identify the cause and build a personalized treatment plan.',
    metaTitle: c.metaTitle || `${c.title} | MD Abidi Arthritis Institute`,
    metaDescription: c.metaDescription || c.shortDescription,
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
  const cardImage = c.cardImage || c.heroImage || '';
  const heroImage = c.heroImage || c.cardImage || '';
  const { error } = await supabase.from('cms_conditions').upsert({
    id: c.id,
    slug: c.slug,
    title: c.title,
    href: c.href || '',
    hero_eyebrow: c.heroEyebrow || '',
    short_description: c.shortDescription || '',
    card_image: cardImage,
    hero_image: heroImage,
    hero_image_alt: c.heroImageAlt || '',
    overview: c.overview || '',
    sections: c.sections || '',
    symptoms: c.symptoms || '',
    treatment_intro: c.treatmentIntro || '',
    cta_heading: c.ctaHeading || '',
    cta_body: c.ctaBody || '',
    meta_title: c.metaTitle || '',
    meta_description: c.metaDescription || '',
    enabled: c.enabled,
    created_at: c.createdAt,
    updated_at: new Date().toISOString(),
  });
  if (error) throwApi(error, 'Could not save the condition.');
}

export async function deleteCmsCondition(id: string): Promise<void> {
  const { data, error } = await supabase
    .from('cms_conditions')
    .delete()
    .eq('id', id)
    .select('id');
  if (error) throwApi(error, 'Could not delete the condition.');
  if (!data?.length) {
    throw new Error(
      'Delete blocked by database permissions. Run supabase/patch-cms-delete-rls.sql in Supabase, then try again.',
    );
  }
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
  const { data, error } = await supabase
    .from('cms_iv_packages')
    .delete()
    .eq('id', id)
    .select('id');
  if (error) throwApi(error, 'Could not delete the IV package.');
  if (!data?.length) {
    throw new Error(
      'Delete blocked by database permissions. Run supabase/patch-cms-delete-rls.sql in Supabase, then try again.',
    );
  }
}

/** Delete CMS package by id, or by slug if the id row is missing. */
export async function deleteCmsIVPackageHard(id: string, slug?: string): Promise<void> {
  try {
    await deleteCmsIVPackage(id);
    return;
  } catch (err) {
    if (!slug) throw err;
  }
  const { data, error } = await supabase
    .from('cms_iv_packages')
    .delete()
    .eq('slug', slug)
    .select('id');
  if (error) throwApi(error, 'Could not delete the IV package.');
  if (!data?.length) {
    throw new Error(
      'Could not delete this package. It may already be gone, or delete is blocked by RLS.',
    );
  }
}

export interface CmsBlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  featuredImage: string;
  content: string;
  publishedAt: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

function rowToBlog(row: Record<string, unknown>): CmsBlogPost {
  return {
    id: String(row.id),
    slug: String(row.slug ?? ''),
    title: String(row.title ?? ''),
    excerpt: String(row.excerpt ?? ''),
    author: String(row.author ?? 'MD Abidi Arthritis Institute'),
    featuredImage: String(row.featured_image ?? ''),
    content: String(row.content ?? ''),
    publishedAt: String(row.published_at ?? ''),
    enabled: Boolean(row.enabled),
    createdAt: String(row.created_at ?? ''),
    updatedAt: String(row.updated_at ?? ''),
  };
}

export async function getCmsBlogPosts(): Promise<CmsBlogPost[]> {
  const { data, error } = await supabase
    .from('cms_blog_posts')
    .select('*')
    .order('published_at', { ascending: false });
  if (error) throwApi(error, 'Could not load blog posts.');
  return (data || []).map(row => rowToBlog(row as Record<string, unknown>));
}

export async function saveCmsBlogPost(p: CmsBlogPost): Promise<void> {
  const { error } = await supabase.from('cms_blog_posts').upsert({
    id: p.id,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    author: p.author,
    featured_image: p.featuredImage,
    content: p.content,
    published_at: p.publishedAt || null,
    enabled: p.enabled,
    updated_at: new Date().toISOString(),
  });
  if (error) throwApi(error, 'Could not save the blog post.');
}

export async function deleteCmsBlogPost(id: string): Promise<void> {
  const { error } = await supabase.from('cms_blog_posts').delete().eq('id', id);
  if (error) throwApi(error, 'Could not delete the blog post.');
}

export function newId(): string {
  return `CMS-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

function slug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
export function makeSlug(title: string): string { return slug(title); }
