import { useEffect, useRef } from 'react';
import { supabase, supabaseReady } from '@/lib/supabase';

/** Reload CMS-backed pages when admin saves conditions or IV packages. */
export function useCmsRealtime(reload: () => void) {
  const reloadRef = useRef(reload);
  reloadRef.current = reload;

  useEffect(() => {
    if (!supabaseReady) return;
    const channel = supabase
      .channel(`cms-content-${Math.random().toString(36).slice(2, 7)}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cms_conditions' }, () => { reloadRef.current(); })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cms_iv_packages' }, () => { reloadRef.current(); })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);
}

export function clinicForDate(year: number, month: number, day: number): { doctor: string; location: 'Freehold' | 'Brick' } | null {
  const dow = new Date(year, month, day).getDay();
  if (dow === 1 || dow === 3 || dow === 5) return { doctor: 'Dr. Abidi', location: 'Freehold' };
  if (dow === 2 || dow === 4) return { doctor: 'Dr. Abidi', location: 'Brick' };
  return null;
}
