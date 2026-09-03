import { handleCreateAppointment } from '../../server/appointments.js';
import { runVercel } from '../../server/runVercel.js';

export const config = { maxDuration: 30 };

export default async function handler(
  req: { method?: string; body?: unknown },
  res: { status: (n: number) => { json: (b: unknown) => void } },
) {
  await runVercel(req, res, (body) => handleCreateAppointment(body));
}
