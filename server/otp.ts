import { createHash, createHmac, randomBytes, randomInt, timingSafeEqual } from 'node:crypto';
import { otpPepper, missingServerEnv } from './env';
import { sendMail } from './mail';
import { otpEmail } from './templates';
import { supabaseAdmin } from './supabaseAdmin';
import { fail, normalizeEmail, ok, type ApiResult } from './http';

const OTP_TTL_MS = 10 * 60 * 1000;
const TOKEN_TTL_MS = 45 * 60 * 1000;
const RESEND_MS = 60 * 1000;
const MAX_SENDS_EMAIL = 4;
const MAX_SENDS_IP = 10;
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

function hashWithSalt(value: string, salt: string): string {
  return createHmac('sha256', otpPepper()).update(`${salt}:${value}`).digest('hex');
}

function sha256(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

function safeEqualHex(a: string, b: string): boolean {
  const ba = Buffer.from(a, 'hex');
  const bb = Buffer.from(b, 'hex');
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

async function countRecent(table: 'email_otps', column: 'email' | 'ip', value: string): Promise<number> {
  const since = new Date(Date.now() - WINDOW_MS).toISOString();
  const { count, error } = await supabaseAdmin()
    .from(table)
    .select('id', { count: 'exact', head: true })
    .eq(column, value)
    .gte('created_at', since);
  if (error) {
    console.error('[otp] rate-limit count failed', error.message);
    return 0;
  }
  return count || 0;
}

export async function handleOtpSend(body: unknown, ip: string): Promise<ApiResult> {
  const missing = missingServerEnv();
  if (missing.length) {
    console.error('[otp] missing env:', missing.join(', '));
    return fail('Email sending is not configured on the live server. Add SMTP and Supabase keys in Vercel Environment Variables, then redeploy.', 503);
  }

  const payload = (body || {}) as Record<string, unknown>;
  const email = normalizeEmail(payload.email);
  if (!email) return fail('Please enter a valid email address.');

  const recentEmail = await countRecent('email_otps', 'email', email);
  if (recentEmail >= MAX_SENDS_EMAIL) {
    return fail('Too many codes were sent to this email. Please wait 15 minutes and try again.', 429);
  }
  if (ip) {
    const recentIp = await countRecent('email_otps', 'ip', ip);
    if (recentIp >= MAX_SENDS_IP) {
      return fail('Too many verification requests from this device. Please wait and try again.', 429);
    }
  }

  const { data: latest } = await supabaseAdmin()
    .from('email_otps')
    .select('created_at')
    .eq('email', email)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (latest?.created_at) {
    const elapsed = Date.now() - new Date(latest.created_at).getTime();
    if (elapsed < RESEND_MS) {
      const retryAfter = Math.ceil((RESEND_MS - elapsed) / 1000);
      return fail(`Please wait ${retryAfter} seconds before requesting another code.`, 429);
    }
  }

  const code = String(randomInt(100000, 1000000));
  const salt = randomBytes(16).toString('hex');
  const codeHash = hashWithSalt(code, salt);
  const expiresAt = new Date(Date.now() + OTP_TTL_MS).toISOString();

  const { error: insertError } = await supabaseAdmin().from('email_otps').insert({
    email,
    code_hash: codeHash,
    salt,
    ip: ip || '',
    expires_at: expiresAt,
  });
  if (insertError) {
    console.error('[otp] insert failed', insertError.message);
    return fail('Could not start verification. Please try again.', 500);
  }

  try {
    const mail = otpEmail(code);
    await sendMail({ to: email, ...mail });
  } catch (err) {
    console.error('[otp] SMTP send failed', err instanceof Error ? err.message : err);
    return fail('We could not send the verification email. Please try again in a moment.', 502);
  }

  return ok({
    sent: true,
    expiresInSeconds: OTP_TTL_MS / 1000,
    retryAfterSeconds: RESEND_MS / 1000,
    message: `A 6-digit code was sent to ${email}.`,
  });
}

export async function handleOtpVerify(body: unknown): Promise<ApiResult> {
  const payload = (body || {}) as Record<string, unknown>;
  const email = normalizeEmail(payload.email);
  const code = String(payload.code || '').replace(/\D/g, '');
  if (!email) return fail('Please enter a valid email address.');
  if (!/^\d{6}$/.test(code)) return fail('Enter the 6-digit code from your email.');

  const { data: row, error } = await supabaseAdmin()
    .from('email_otps')
    .select('id, code_hash, salt, attempts, expires_at, used_at')
    .eq('email', email)
    .is('used_at', null)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('[otp] lookup failed', error.message);
    return fail('Could not verify the code. Please try again.', 500);
  }
  if (!row) return fail('No active code found. Please request a new code.');
  if (row.used_at) return fail('That code was already used. Please request a new code.');
  if (new Date(row.expires_at).getTime() < Date.now()) return fail('That code has expired. Please request a new code.');
  if ((row.attempts || 0) >= MAX_ATTEMPTS) return fail('Too many incorrect attempts. Please request a new code.');

  const expected = String(row.code_hash);
  const actual = hashWithSalt(code, String(row.salt));
  if (!safeEqualHex(expected, actual)) {
    await supabaseAdmin().from('email_otps').update({ attempts: (row.attempts || 0) + 1 }).eq('id', row.id);
    return fail('Incorrect code. Please try again.');
  }

  await supabaseAdmin().from('email_otps').update({ used_at: new Date().toISOString() }).eq('id', row.id);

  const token = randomBytes(32).toString('hex');
  const tokenHash = sha256(token);
  const { error: tokenError } = await supabaseAdmin().from('email_verifications').insert({
    email,
    token_hash: tokenHash,
    expires_at: new Date(Date.now() + TOKEN_TTL_MS).toISOString(),
  });
  if (tokenError) {
    console.error('[otp] verification token insert failed', tokenError.message);
    return fail('Code was correct but we could not complete verification. Please try again.', 500);
  }

  return ok({ verified: true, verificationToken: token, email });
}

export async function findValidVerification(email: string, token: string): Promise<{ id: string } | { error: string }> {
  const tokenHash = sha256(token);
  const { data, error } = await supabaseAdmin()
    .from('email_verifications')
    .select('id, email, expires_at, used_at')
    .eq('token_hash', tokenHash)
    .maybeSingle();

  if (error) {
    console.error('[otp] verification lookup failed', error.message);
    if (/schema cache|does not exist|email_verifications/i.test(error.message)) {
      return { error: 'Email verification is not set up in the database yet. Run supabase/patch-otp-mail.sql in the Supabase SQL Editor, then try again.' };
    }
    return { error: 'Could not check email verification. Please try again.' };
  }
  if (!data) return { error: 'Please verify your email again before submitting.' };
  if (String(data.email).toLowerCase() !== email) {
    return { error: 'Please verify your email again before submitting.' };
  }
  if (new Date(data.expires_at).getTime() < Date.now()) {
    return { error: 'Your email verification expired. Please verify your email again.' };
  }
  if (data.used_at) {
    const { count } = await supabaseAdmin()
      .from('appointments')
      .select('id', { count: 'exact', head: true })
      .eq('email', email)
      .gte('created_at', data.used_at);
    if ((count || 0) > 0) {
      return { error: 'This verification was already used. Please request a new code.' };
    }
  }
  return { id: String(data.id) };
}

export async function markVerificationUsed(id: string): Promise<void> {
  const { error } = await supabaseAdmin()
    .from('email_verifications')
    .update({ used_at: new Date().toISOString() })
    .eq('id', id);
  if (error) console.error('[otp] could not mark verification used', error.message);
}
