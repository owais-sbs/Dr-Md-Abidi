import { isAdminUser, supabaseAdmin } from './supabaseAdmin.js';
import { fail, header, ok, type ApiResult } from './http.js';

async function requireAdmin(headers: Record<string, string | string[] | undefined>) {
  const auth = header(headers, 'authorization');
  const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';
  if (!token) return fail('Please sign in as an administrator.', 401);
  const { data, error } = await supabaseAdmin().auth.getUser(token);
  if (error || !data.user) return fail('Your admin session is invalid. Please sign in again.', 401);
  const meta = {
    ...(data.user.user_metadata || {}),
    ...(data.user.app_metadata || {}),
  } as Record<string, unknown>;
  if (!isAdminUser(data.user.email, meta)) return fail('You are not authorized to manage users.', 403);
  return { ok: true as const, user: data.user };
}

export async function handleAdminUsers(
  method: string,
  body: unknown,
  headers: Record<string, string | string[] | undefined>,
): Promise<ApiResult> {
  try {
    const gate = await requireAdmin(headers);
    if (!('ok' in gate) || gate.ok !== true) return gate as ApiResult;

    const p = (body || {}) as Record<string, unknown>;
    const action = String(p.action || 'list');

    if (action === 'list') {
      const { data, error } = await supabaseAdmin().auth.admin.listUsers({ perPage: 100 });
      if (error) {
        console.error('[adminUsers] list failed', error.message);
        return fail(error.message || 'Could not load admin users.', 500);
      }
      const users = (data.users || [])
        .filter((u) => {
          const meta = { ...(u.user_metadata || {}), ...(u.app_metadata || {}) } as Record<string, unknown>;
          return isAdminUser(u.email, meta);
        })
        .map((u) => ({
          id: u.id,
          email: u.email || '',
          createdAt: u.created_at,
          lastSignInAt: u.last_sign_in_at,
        }));
      return ok({ users });
    }

    if (action === 'create') {
      const email = String(p.email || '').trim().toLowerCase();
      const password = String(p.password || '');
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail('Enter a valid email.');
      if (password.length < 8) return fail('Password must be at least 8 characters.');
      const { data, error } = await supabaseAdmin().auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { role: 'admin' },
        app_metadata: { role: 'admin' },
      });
      if (error) {
        console.error('[adminUsers] create failed', error.message);
        return fail(error.message || 'Could not create admin user.', 500);
      }
      return ok({ id: data.user?.id, email: data.user?.email, created: true });
    }

    if (action === 'delete') {
      const id = String(p.id || '').trim();
      if (!id) return fail('User id is required.');
      if (gate.user.id === id) return fail('You cannot delete your own account while signed in.');
      const { error } = await supabaseAdmin().auth.admin.deleteUser(id);
      if (error) {
        console.error('[adminUsers] delete failed', error.message);
        return fail(error.message || 'Could not delete user.', 500);
      }
      return ok({ deleted: true, id });
    }

    return fail('Unknown action.', 400);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[adminUsers]', message);
    if (/Missing .*SUPABASE|service.?role/i.test(message)) {
      return fail('Server is missing Supabase admin credentials. Set SUPABASE_SERVICE_ROLE_KEY on the host.', 500);
    }
    return fail(message || 'Could not manage admin users.', 500);
  }
}
