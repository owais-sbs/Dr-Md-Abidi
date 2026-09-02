export function requiredEnv(name: string): string {
  const value = (process.env[name] || '').trim();
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

export function optionalEnv(name: string, fallback = ''): string {
  return (process.env[name] || fallback).trim();
}

export function supabaseUrl(): string {
  return optionalEnv('VITE_SUPABASE_URL') || optionalEnv('SUPABASE_URL');
}

export function supabaseServiceKey(): string {
  return optionalEnv('SUPABASE_SERVICE_ROLE_KEY');
}

export function missingServerEnv(): string[] {
  const missing: string[] = [];
  if (!supabaseUrl()) missing.push('VITE_SUPABASE_URL');
  if (!supabaseServiceKey()) missing.push('SUPABASE_SERVICE_ROLE_KEY');
  if (!optionalEnv('SMTP_HOST')) missing.push('SMTP_HOST');
  if (!optionalEnv('SMTP_USER')) missing.push('SMTP_USER');
  if (!optionalEnv('SMTP_PASS')) missing.push('SMTP_PASS');
  return missing;
}

export function smtpPass(): string {
  return requiredEnv('SMTP_PASS').replace(/\s+/g, '');
}

export function smtpSecure(): boolean {
  const raw = optionalEnv('SMTP_SECURE', 'false').toLowerCase();
  return raw === 'true' || raw === '1';
}

export function smtpPort(): number {
  const n = Number(optionalEnv('SMTP_PORT', '587'));
  return Number.isFinite(n) && n > 0 ? n : 587;
}

export function otpPepper(): string {
  return optionalEnv('OTP_PEPPER') || supabaseServiceKey() || 'otp-dev-pepper';
}

export function publicAppUrl(): string {
  const site = optionalEnv('PUBLIC_SITE_URL') || optionalEnv('VITE_PUBLIC_SITE_URL');
  if (site) return site.replace(/\/$/, '');
  const vercel = optionalEnv('VERCEL_URL');
  if (vercel) return `https://${vercel.replace(/^https?:\/\//, '')}`;
  return 'https://mdabidi.com';
}
