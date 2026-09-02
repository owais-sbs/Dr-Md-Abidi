export function requiredEnv(name: string): string {
  const value = (process.env[name] || '').trim();
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

export function optionalEnv(name: string, fallback = ''): string {
  return (process.env[name] || SERVER_FALLBACKS[name] || fallback).trim();
}

const SERVER_FALLBACKS: Record<string, string> = {
  VITE_SUPABASE_URL: 'https://dnlrcwlhirpbucroptla.supabase.co',
  SUPABASE_URL: 'https://dnlrcwlhirpbucroptla.supabase.co',
  SUPABASE_SERVICE_ROLE_KEY:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRubHJjd2xoaXJwYnVjcm9wdGxhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODMzMzQwOSwiZXhwIjoyMTAzOTA5NDA5fQ.LoZdB56ZpZFytoLnY5z_ABcxTpvS4C4S7Fw-TQ0HrPs',
  SMTP_HOST: 'smtp.gmail.com',
  SMTP_USER: 'onepathbs@gmail.com',
  SMTP_PASS: 'twjrqhqzhdechmoa',
};

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
  const value = optionalEnv('SMTP_PASS').replace(/\s+/g, '');
  if (!value) throw new Error('Missing required environment variable: SMTP_PASS');
  return value;
}

export function smtpSecure(): boolean {
  const raw = optionalEnv('SMTP_SECURE');
  if (raw) {
    const value = raw.toLowerCase();
    return value === 'true' || value === '1';
  }
  return smtpPort() === 465;
}

export function smtpPort(): number {
  const configured = optionalEnv('SMTP_PORT');
  if (configured) {
    const n = Number(configured);
    if (Number.isFinite(n) && n > 0) return n;
  }
  return process.env.VERCEL ? 465 : 587;
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
