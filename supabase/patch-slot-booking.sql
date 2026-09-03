-- Run once in Supabase Dashboard -> SQL Editor.
-- This database-level lock prevents two requests from taking the same slot.

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM public.appointments
    WHERE status NOT IN ('cancelled', 'rejected')
    GROUP BY date, time, location
    HAVING count(*) > 1
  ) THEN
    RAISE EXCEPTION 'Duplicate active bookings exist. Resolve them before applying the slot lock.';
  END IF;
END $$;

DROP INDEX IF EXISTS public.appointments_slot_unique;
CREATE UNIQUE INDEX appointments_slot_unique
  ON public.appointments (date, time, location)
  WHERE status NOT IN ('cancelled', 'rejected');

CREATE OR REPLACE VIEW public.booked_slots AS
SELECT date, time, location, status
FROM public.appointments
WHERE status NOT IN ('cancelled', 'rejected');

GRANT SELECT ON public.booked_slots TO anon, authenticated;
