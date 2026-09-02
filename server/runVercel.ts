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
    console.error('[api]', err instanceof Error ? err.message : err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}
