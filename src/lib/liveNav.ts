import { useCallback, useEffect, useState } from 'react';
import { mainNav, type NavItem } from '@/data/navigation';
import { getCmsConditions, getCmsIVPackages, type CmsCondition, type CmsIVPackage } from '@/data/cms';
import { supabase } from '@/lib/supabase';

function slugFromHref(href: string): string {
  return href.replace(/^\/|\/$/g, '').split('/').filter(Boolean).pop() || '';
}

export function findConditionOverride(conds: CmsCondition[], originalSlug: string) {
  return conds.find(c =>
    c.id === `static-cond-${originalSlug}` || c.slug === originalSlug
  );
}

export function findPackageOverride(pkgs: CmsIVPackage[], originalSlug: string) {
  return pkgs.find(p =>
    p.id === `static-pkg-${originalSlug}` || p.slug === originalSlug
  );
}

export function mergeLiveNav(
  conds: CmsCondition[],
  pkgs: CmsIVPackage[],
): NavItem[] {
  const condCustom = conds.filter(c => !c.id.startsWith('static-') && c.enabled);
  const pkgCustom = pkgs.filter(p => !p.id.startsWith('static-') && p.enabled);

  return mainNav.map(item => {
    if (item.href === '/conditions-we-treat/') {
      const children = (item.children || []).flatMap(ch => {
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
          ...condCustom.map(c => ({ label: c.title, href: `/${c.slug}/` })),
        ],
      };
    }
    if (item.href === '/iv-packages/') {
      const children = (item.children || []).flatMap(ch => {
        const original = slugFromHref(ch.href);
        const ov = findPackageOverride(pkgs, original);
        if (ov && !ov.enabled) return [];
        const slug = ov?.slug || original;
        return [{ label: (ov?.name || ch.label).trim() || ch.label, href: `/iv-packages/${slug}/` }];
      });
      return {
        ...item,
        children: [
          ...children,
          ...pkgCustom.map(p => ({ label: p.name, href: `/iv-packages/${p.slug}/` })),
        ],
      };
    }
    return item;
  });
}

export function useLiveNav(): NavItem[] {
  const [nav, setNav] = useState<NavItem[]>(mainNav);

  const load = useCallback(async () => {
    try {
      const [conds, pkgs] = await Promise.all([getCmsConditions(), getCmsIVPackages()]);
      setNav(mergeLiveNav(conds, pkgs));
    } catch {
      setNav(mainNav);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const channel = supabase
      .channel('live-nav')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cms_conditions' }, () => { load(); })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cms_iv_packages' }, () => { load(); })
      .subscribe();
    const onFocus = () => { load(); };
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
