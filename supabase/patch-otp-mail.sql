-- =============================================================================
-- REQUIRED: run this in Supabase → SQL Editor → New query → Run
-- Fixes OTP booking ("email verification expired") and adds Decline status
-- Safe to re-run.
-- =============================================================================

-- Appointment status: add rejected + email/approval timestamps
ALTER TABLE public.appointments DROP CONSTRAINT IF EXISTS appointments_status_check;
ALTER TABLE public.appointments
  ADD CONSTRAINT appointments_status_check
  CHECK (status IN ('pending', 'approved', 'hold', 'completed', 'cancelled', 'rejected'));

ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS email_verified boolean NOT NULL DEFAULT false;
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS approved_at timestamptz;
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS rejected_at timestamptz;
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS rejection_reason text NOT NULL DEFAULT '';

-- Rejected bookings must free the slot (same as cancelled)
DROP INDEX IF EXISTS appointments_slot_unique;
CREATE UNIQUE INDEX appointments_slot_unique
  ON public.appointments (date, time, location)
  WHERE status NOT IN ('cancelled', 'rejected');

CREATE OR REPLACE VIEW public.booked_slots AS
SELECT date, time, location, status
FROM public.appointments
WHERE status NOT IN ('cancelled', 'rejected');

GRANT SELECT ON public.booked_slots TO anon, authenticated;
ALTER VIEW public.booked_slots SET (security_invoker = false);

-- Public clients cannot insert appointments directly. Creation goes through
-- the server API after OTP verification (service role).
DROP POLICY IF EXISTS appointments_public_insert ON public.appointments;
REVOKE INSERT ON public.appointments FROM anon;

-- Hashed one-time codes (service role only — no anon/authenticated grants)
CREATE TABLE IF NOT EXISTS public.email_otps (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email       text NOT NULL,
  code_hash   text NOT NULL,
  salt        text NOT NULL,
  ip          text NOT NULL DEFAULT '',
  attempts    integer NOT NULL DEFAULT 0,
  expires_at  timestamptz NOT NULL,
  used_at     timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS email_otps_email_created_idx ON public.email_otps (email, created_at DESC);
CREATE INDEX IF NOT EXISTS email_otps_ip_created_idx ON public.email_otps (ip, created_at DESC);

ALTER TABLE public.email_otps ENABLE ROW LEVEL SECURITY;

-- Short-lived proof that this email passed OTP (consumed when booking)
CREATE TABLE IF NOT EXISTS public.email_verifications (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email       text NOT NULL,
  token_hash  text NOT NULL UNIQUE,
  expires_at  timestamptz NOT NULL,
  used_at     timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS email_verifications_email_idx ON public.email_verifications (email, created_at DESC);

ALTER TABLE public.email_verifications ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.email_otps FROM anon, authenticated;
REVOKE ALL ON public.email_verifications FROM anon, authenticated;
