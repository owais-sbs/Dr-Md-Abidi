import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { requiredEnv } from './env';

let admin: SupabaseClient | null = null;

export function supabaseAdmin(): SupabaseClient {
  if (admin) return admin;
  admin = createClient(requiredEnv('VITE_SUPABASE_URL'), requiredEnv('SUPABASE_SERVICE_ROLE_KEY'), {
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
