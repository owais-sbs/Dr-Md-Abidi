import { handleOtpVerify } from '../../server/otp';
import { runVercel } from '../../server/runVercel';

export const config = { maxDuration: 30 };

export default async function handler(
  req: { method?: string; body?: unknown },
  res: { status: (n: number) => { json: (b: unknown) => void } },
) {
  await runVercel(req, res, (body) => handleOtpVerify(body));
}
