import * as nodemailer from 'nodemailer';
import { optionalEnv, smtpPass, smtpPort, smtpSecure } from './env';

type Transport = {
  sendMail: (opts: Record<string, unknown>) => Promise<unknown>;
};

let transporter: Transport | null = null;

function createTransport(): Transport {
  const nm = nodemailer as unknown as {
    createTransport?: (opts: Record<string, unknown>) => Transport;
    default?: { createTransport?: (opts: Record<string, unknown>) => Transport };
  };
  const factory = nm.createTransport || nm.default?.createTransport;
  if (!factory) throw new Error('Could not load the email library.');
  const user = optionalEnv('SMTP_USER');
  if (!user || !optionalEnv('SMTP_PASS')) {
    throw new Error('Missing SMTP_USER or SMTP_PASS');
  }
  return factory({
    host: optionalEnv('SMTP_HOST') || 'smtp.gmail.com',
    port: smtpPort(),
    secure: smtpSecure(),
    requireTLS: !smtpSecure(),
    auth: { user, pass: smtpPass() },
    connectionTimeout: 20000,
    greetingTimeout: 20000,
    socketTimeout: 25000,
    tls: { minVersion: 'TLSv1.2' },
  });
}

function getTransporter(): Transport {
  if (!transporter) transporter = createTransport();
  return transporter;
}

export async function sendMail(opts: { to: string; subject: string; html: string; text: string }): Promise<void> {
  const from = optionalEnv('SMTP_FROM') || optionalEnv('SMTP_USER');
  await getTransporter().sendMail({
    from,
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
    text: opts.text,
  });
}
