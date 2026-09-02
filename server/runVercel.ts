import type { ApiResult } from './http';

type VercelReq = {
  method?: string;
  body?: unknown;
  headers?: Record<string, string | string[] | undefined>;
  socket?: { remoteAddress?: string };
};
type VercelRes = { status: (n: number) => { json: (b: unknown) => void } };

export async function runVercel(req: VercelReq, res: VercelRes, fn: (body: unknown) => Promise<ApiResult>): Promise<void> {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed.' });
      return;
    }
    let body: unknown = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch { body = {}; }
    }
    const result = await fn(body ?? {});
    res.status(result.status).json(result.body);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[api]', message);
    if (/smtp|econnection|etimedout|esocket|eauth|invalid login|authentication|greeting never received|could not send email/i.test(message)) {
      res.status(502).json({ error: 'We could not send the verification email. Please try again in a moment.' });
      return;
    }
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}
