import type { CmsIVPackage } from '@/data/cms';

export const IV_DELETED_TAG = '__DELETED__';

const MEMORY_KEY = 'iv-deleted-slugs-v1';

/** Prefer the stable static override row for a built-in slug. */
export function findStaticPackageOverride(
  pkgs: CmsIVPackage[],
  originalSlug: string,
): CmsIVPackage | undefined {
  const byId = pkgs.find((p) => p.id === `static-pkg-${originalSlug}`);
  if (byId) return byId;
  return pkgs.find(
    (p) => p.id.startsWith('static-pkg-') && p.slug === originalSlug,
  );
}

export function isPackageTombstone(p: Pick<CmsIVPackage, 'tagline' | 'enabled' | 'id'>): boolean {
  return p.tagline === IV_DELETED_TAG;
}

/** Hidden from public site: deleted forever OR drafted static override. */
export function isPackageHiddenFromPublic(p: CmsIVPackage): boolean {
  if (isPackageTombstone(p)) return true;
  if (p.id.startsWith('static-pkg-') && !p.enabled) return true;
  return false;
}

/** Collect every slug that must not appear in nav / listing / book. */
export function collectHiddenPackageSlugs(pkgs: CmsIVPackage[]): Set<string> {
  const set = new Set<string>(readRememberedDeletedSlugs());
  for (const p of pkgs) {
    if (!isPackageHiddenFromPublic(p)) continue;
    if (p.slug) set.add(p.slug);
    if (p.id.startsWith('static-pkg-')) {
      const fromId = p.id.slice('static-pkg-'.length);
      if (fromId) set.add(fromId);
    }
  }
  return set;
}

export function rememberDeletedSlug(slug: string) {
  if (!slug || typeof window === 'undefined') return;
  try {
    const next = new Set(readRememberedDeletedSlugs());
    next.add(slug);
    localStorage.setItem(MEMORY_KEY, JSON.stringify([...next]));
  } catch {
    /* ignore quota / private mode */
  }
}

export function forgetRememberedDeletedSlug(slug: string) {
  if (!slug || typeof window === 'undefined') return;
  try {
    const next = new Set(readRememberedDeletedSlugs());
    next.delete(slug);
    localStorage.setItem(MEMORY_KEY, JSON.stringify([...next]));
  } catch {
    /* ignore */
  }
}

function readRememberedDeletedSlugs(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(MEMORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(String).filter(Boolean) : [];
  } catch {
    return [];
  }
}

/** Custom CMS packages that should appear in public nav/listing. */
export function publicCustomPackages(pkgs: CmsIVPackage[]): CmsIVPackage[] {
  const hidden = collectHiddenPackageSlugs(pkgs);
  return pkgs.filter(
    (p) =>
      p.enabled &&
      !isPackageTombstone(p) &&
      !p.id.startsWith('static-pkg-') &&
      !hidden.has(p.slug),
  );
}
