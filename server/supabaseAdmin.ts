import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { supabaseServiceKey, supabaseUrl } from './env.js';

let admin: SupabaseClient | null = null;

export function supabaseAdmin(): SupabaseClient {
  if (admin) return admin;
  const url = supabaseUrl();
  const key = supabaseServiceKey();
  if (!url || !key) {
    throw new Error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  }
  admin = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return admin;
}

export function isAdminUser(email: string | undefined, metadata: Record<string, unknown> | undefined): boolean {
  const e = (email || '').toLowerCase();
  if (e === 'admin@gmail.com') return true;
  const role = String(metadata?.role || '').toLowerCase();
  return role === 'admin';
}
