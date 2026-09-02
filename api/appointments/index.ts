import { handleCreateAppointment } from '../../server/appointments';
import { runVercel } from '../../server/runVercel';

export default async function handler(
  req: { method?: string; body?: unknown },
  res: { status: (n: number) => { json: (b: unknown) => void } },
) {
  await runVercel(req, res, () => handleCreateAppointment(req.body));
}
