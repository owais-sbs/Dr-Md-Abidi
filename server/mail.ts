import nodemailer from 'nodemailer';
import { optionalEnv, requiredEnv, smtpPass, smtpPort, smtpSecure } from './env';

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (transporter) return transporter;
  transporter = nodemailer.createTransport({
    host: requiredEnv('SMTP_HOST'),
    port: smtpPort(),
    secure: smtpSecure(),
    auth: {
      user: requiredEnv('SMTP_USER'),
      pass: smtpPass(),
    },
  });
  return transporter;
}

export async function sendMail(opts: { to: string; subject: string; html: string; text: string }): Promise<void> {
  const from = optionalEnv('SMTP_FROM') || requiredEnv('SMTP_USER');
  await getTransporter().sendMail({
    from,
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
    text: opts.text,
  });
}
