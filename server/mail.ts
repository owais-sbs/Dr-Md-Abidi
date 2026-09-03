import { createRequire } from 'node:module';
import { setDefaultResultOrder } from 'node:dns';
import { optionalEnv, smtpPass, smtpPort, smtpSecure } from './env.js';

try {
  setDefaultResultOrder('ipv4first');
} catch {
  /* older Node runtimes */
}

type Transport = {
  sendMail: (opts: Record<string, unknown>) => Promise<unknown>;
  close?: () => void;
};

type Factory = (opts: Record<string, unknown>) => Transport;

let factory: Factory | null = null;

async function loadFactory(): Promise<Factory> {
  if (factory) return factory;
  try {
    const mod = await import('nodemailer');
    const nm = mod as unknown as { createTransport?: Factory; default?: { createTransport?: Factory } };
    const create = nm.createTransport || nm.default?.createTransport;
    if (create) {
      factory = create;
      return create;
    }
  } catch (err) {
    console.error('[mail] ESM nodemailer import failed', err instanceof Error ? err.message : err);
  }
  const require = createRequire(import.meta.url);
  const nm = require('nodemailer') as { createTransport?: Factory; default?: { createTransport?: Factory } };
  const create = nm.createTransport || nm.default?.createTransport;
  if (!create) throw new Error('Could not load the email library.');
  factory = create;
  return create;
}

function smtpUser(): string {
  return optionalEnv('SMTP_USER');
}

function fromAddress(user: string): string {
  const configured = optionalEnv('SMTP_FROM');
  const clinic = 'MD Abidi Arthritis Institute';
  if (!configured) return `"${clinic}" <${user}>`;
  const address = (configured.match(/<([^>]+)>/)?.[1] || configured).trim().toLowerCase();
  if (address === user.toLowerCase()) return configured;
  // Gmail rejects From addresses that are not the authenticated account.
  if (user.toLowerCase().endsWith('@gmail.com') && !address.endsWith('@gmail.com')) {
    return `"${clinic}" <${user}>`;
  }
  return configured;
}

function transportOptions(port: number, secure: boolean) {
  const user = smtpUser();
  const host = optionalEnv('SMTP_HOST') || 'smtp.gmail.com';
  return {
    host,
    port,
    secure,
    requireTLS: !secure,
    auth: { user, pass: smtpPass() },
    family: 4,
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 12000,
    tls: {
      minVersion: 'TLSv1.2',
      servername: host,
    },
  };
}

function attemptConfigs(): Array<{ port: number; secure: boolean }> {
  const preferred = { port: smtpPort(), secure: smtpSecure() };
  const gmailSsl = { port: 465, secure: true };
  const gmailStartTls = { port: 587, secure: false };
  // Vercel IPv6/587 STARTTLS often hangs until the platform returns 500.
  const ordered = process.env.VERCEL
    ? [gmailSsl, gmailStartTls, preferred]
    : [preferred, gmailSsl, gmailStartTls];
  const seen = new Set<string>();
  const list: Array<{ port: number; secure: boolean }> = [];
  for (const cfg of ordered) {
    const key = `${cfg.port}:${cfg.secure}`;
    if (seen.has(key)) continue;
    seen.add(key);
    list.push(cfg);
  }
  return list;
}

async function sendWithConfig(
  create: Factory,
  cfg: { port: number; secure: boolean },
  mail: Record<string, unknown>,
): Promise<void> {
  const transport = create(transportOptions(cfg.port, cfg.secure));
  try {
    await transport.sendMail(mail);
  } finally {
    try {
      transport.close?.();
    } catch {
      /* ignore */
    }
  }
}

export async function sendMail(opts: { to: string; subject: string; html: string; text: string }): Promise<void> {
  const user = smtpUser();
  if (!user || !optionalEnv('SMTP_PASS')) {
    throw new Error('Missing SMTP_USER or SMTP_PASS');
  }
  const create = await loadFactory();
  const mail = {
    from: fromAddress(user),
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
    text: opts.text,
    envelope: { from: user, to: opts.to },
  };
  const configs = attemptConfigs();
  let lastError: unknown;
  for (const cfg of configs) {
    try {
      await sendWithConfig(create, cfg, mail);
      return;
    } catch (err) {
      lastError = err;
      console.error(
        `[mail] SMTP ${cfg.port}/${cfg.secure ? 'ssl' : 'starttls'} failed:`,
        err instanceof Error ? err.message : err,
      );
    }
  }
  throw lastError instanceof Error ? lastError : new Error('Could not send email.');
}
