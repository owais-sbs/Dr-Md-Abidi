import { handleAdminUsers } from '../../server/adminUsers.js';
import { runVercel } from '../../server/runVercel.js';

export const config = { maxDuration: 30 };

export default async function handler(
  req: {
    method?: string;
    body?: unknown;
    headers: Record<string, string | string[] | undefined>;
  },
  res: { status: (n: number) => { json: (b: unknown) => void } },
) {
  await runVercel(req, res, (body) =>
    handleAdminUsers(req.method || 'POST', body, req.headers || {}),
  );
}
