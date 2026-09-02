import { clientIp } from '../../server/http';
import { handleOtpSend } from '../../server/otp';
import { runVercel } from '../../server/runVercel';

export const config = { maxDuration: 30 };

export default async function handler(
  req: { method?: string; body?: unknown; headers: Record<string, string | string[] | undefined>; socket?: { remoteAddress?: string } },
  res: { status: (n: number) => { json: (b: unknown) => void } },
) {
  await runVercel(req, res, (body) => handleOtpSend(body, clientIp(req.headers, req.socket?.remoteAddress || '')));
}
