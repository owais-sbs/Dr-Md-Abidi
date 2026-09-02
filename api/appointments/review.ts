import { handleReviewAppointment } from '../../server/appointments';
import { runVercel } from '../../server/runVercel';

export default async function handler(
  req: { method?: string; body?: unknown; headers: Record<string, string | string[] | undefined> },
  res: { status: (n: number) => { json: (b: unknown) => void } },
) {
  await runVercel(req, res, () => handleReviewAppointment(req.body, req.headers));
}
