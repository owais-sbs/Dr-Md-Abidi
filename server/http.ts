export type ApiResult = { status: number; body: Record<string, unknown> };

export function ok(body: Record<string, unknown>, status = 200): ApiResult {
  return { status, body };
}

export function fail(message: string, status = 400): ApiResult {
  return { status, body: { error: message } };
}

export function normalizeEmail(raw: unknown): string | null {
  const email = String(raw || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return null;
  return email;
}

export function clientIp(headers: Record<string, string | string[] | undefined>, fallback = ''): string {
  const forwarded = headers['x-forwarded-for'];
  const raw = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  if (raw) return raw.split(',')[0].trim().slice(0, 64);
  const real = headers['x-real-ip'];
  const realRaw = Array.isArray(real) ? real[0] : real;
  return (realRaw || fallback || '').slice(0, 64);
}

export function header(headers: Record<string, string | string[] | undefined>, name: string): string {
  const v = headers[name] ?? headers[name.toLowerCase()];
  return Array.isArray(v) ? (v[0] || '') : (v || '');
}
