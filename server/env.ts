export function requiredEnv(name: string): string {
  const value = (process.env[name] || '').trim();
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

export function optionalEnv(name: string, fallback = ''): string {
  return (process.env[name] || fallback).trim();
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
  return optionalEnv('OTP_PEPPER') || requiredEnv('SUPABASE_SERVICE_ROLE_KEY');
}

export function publicAppUrl(): string {
  const site = optionalEnv('PUBLIC_SITE_URL') || optionalEnv('VITE_PUBLIC_SITE_URL');
  if (site) return site.replace(/\/$/, '');
  const vercel = optionalEnv('VERCEL_URL');
  if (vercel) return `https://${vercel.replace(/^https?:\/\//, '')}`;
  return 'https://mdabidi.com';
}
