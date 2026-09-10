import { useCallback, useEffect, useState } from 'react';
import { mainNav, type NavItem } from '@/data/navigation';
import { getCmsConditions, getCmsIVPackages, type CmsCondition, type CmsIVPackage } from '@/data/cms';
import { supabase } from '@/lib/supabase';
import {
  collectHiddenPackageSlugs,
  findStaticPackageOverride,
  IV_DELETED_TAG,
  publicCustomPackages,
} from '@/lib/ivPackageVisibility';

function slugFromHref(href: string): string {
  return href.replace(/^\/|\/$/g, '').split('/').filter(Boolean).pop() || '';
}

export function findConditionOverride(conds: CmsCondition[], originalSlug: string) {
  const byId = conds.find((c) => c.id === `static-cond-${originalSlug}`);
  if (byId) return byId;
  return conds.find((c) => c.id.startsWith('static-cond-') && c.slug === originalSlug);
}

export function findPackageOverride(pkgs: CmsIVPackage[], originalSlug: string) {
  return findStaticPackageOverride(pkgs, originalSlug);
}

export function mergeLiveNav(
  conds: CmsCondition[],
  pkgs: CmsIVPackage[],
): NavItem[] {
  const condCustom = conds.filter((c) => !c.id.startsWith('static-') && c.enabled);
  const pkgCustom = publicCustomPackages(pkgs);
  const hiddenPkgs = collectHiddenPackageSlugs(pkgs);

  return mainNav.map((item) => {
    if (item.href === '/conditions-we-treat/') {
      const children = (item.children || []).flatMap((ch) => {
        const original = slugFromHref(ch.href);
        const ov = findConditionOverride(conds, original);
        if (ov && !ov.enabled) return [];
        const slug = ov?.slug || original;
        return [{ label: (ov?.title || ch.label).trim() || ch.label, href: `/${slug}/` }];
      });
      return {
        ...item,
        children: [
          ...children,
          ...condCustom.map((c) => ({ label: c.title, href: `/${c.slug}/` })),
        ],
      };
    }
    if (item.href === '/iv-packages/') {
      const children = (item.children || []).flatMap((ch) => {
        const original = slugFromHref(ch.href);
        if (hiddenPkgs.has(original)) return [];
        const ov = findPackageOverride(pkgs, original);
        if (ov && (!ov.enabled || ov.tagline === IV_DELETED_TAG)) return [];
        const slug = ov?.slug || original;
        if (hiddenPkgs.has(slug)) return [];
        return [{ label: (ov?.name || ch.label).trim() || ch.label, href: `/iv-packages/${slug}/` }];
      });
      return {
        ...item,
        children: [
          ...children,
          ...pkgCustom.map((p) => ({
            label: p.name.replace(/\s*[-–]\s*\d+\s+for\s+\$[\d,]+/i, '').replace(/\s+\$[\d,]+$/, '').trim(),
            href: `/iv-packages/${p.slug}/`,
          })),
        ],
      };
    }
    return item;
  });
}

export function useLiveNav(): NavItem[] {
  const [nav, setNav] = useState<NavItem[]>(() => mergeLiveNav([], []));

  const load = useCallback(async () => {
    try {
      const [conds, pkgs] = await Promise.all([getCmsConditions(), getCmsIVPackages()]);
      setNav(mergeLiveNav(conds, pkgs));
    } catch {
      // Still apply local remembered deletes if CMS fetch fails
      setNav(mergeLiveNav([], []));
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  useEffect(() => {
    const channel = supabase
      .channel('live-nav')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cms_conditions' }, () => { void load(); })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cms_iv_packages' }, () => { void load(); })
      .subscribe();
    const onFocus = () => { void load(); };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onFocus);
    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onFocus);
    };
  }, [load]);

  return nav;
}
