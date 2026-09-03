import { handleReviewAppointment } from '../../server/appointments.js';
import { runVercel } from '../../server/runVercel.js';

export const config = { maxDuration: 30 };

export default async function handler(
  req: { method?: string; body?: unknown; headers: Record<string, string | string[] | undefined> },
  res: { status: (n: number) => { json: (b: unknown) => void } },
) {
  await runVercel(req, res, (body) => handleReviewAppointment(body, req.headers));
}
