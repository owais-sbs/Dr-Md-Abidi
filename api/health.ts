export default function handler(
  req: { method?: string },
  res: { status: (n: number) => { json: (body: unknown) => void } },
) {
  res.status(200).json({
    ok: true,
    smtp: Boolean(
      (process.env.SMTP_HOST || 'smtp.gmail.com') &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS,
    ),
    supabase: Boolean(
      (process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL) &&
      process.env.SUPABASE_SERVICE_ROLE_KEY,
    ),
  });
}
