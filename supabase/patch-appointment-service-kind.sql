-- Distinguish IV package bookings from Conditions We Treat consultations.
-- Run once in the Supabase SQL editor.

ALTER TABLE public.appointments
  ADD COLUMN IF NOT EXISTS service_kind text;

UPDATE public.appointments
SET service_kind = 'iv'
WHERE service_kind IS NULL OR service_kind = '';

ALTER TABLE public.appointments
  ALTER COLUMN service_kind SET DEFAULT 'iv';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'appointments_service_kind_check'
  ) THEN
    ALTER TABLE public.appointments
      ADD CONSTRAINT appointments_service_kind_check
      CHECK (service_kind IN ('iv', 'condition'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS appointments_service_kind_idx
  ON public.appointments (service_kind);

COMMENT ON COLUMN public.appointments.service_kind IS
  'iv = IV therapy package booking; condition = Conditions We Treat consultation';
