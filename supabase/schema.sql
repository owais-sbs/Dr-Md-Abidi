-- =============================================================================
-- MD Abidi Arthritis Institute — Appointment + Admin CMS schema
-- Run this entire script once in: Supabase Dashboard → SQL Editor → New query
-- Customer OTP + doctor confirmation emails are sent from the Node /api layer (SMTP).
-- Admin login after this script:  admin@gmail.com  /  admin123
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

-- ── Helpers ──────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT coalesce(auth.jwt() ->> 'email', '') = 'admin@gmail.com'
      OR coalesce((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin', false)
      OR coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false);
$$;

-- ── Appointments ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.appointments (
  id                text PRIMARY KEY,
  package_name      text NOT NULL DEFAULT '',
  package_slug      text NOT NULL DEFAULT '',
  location          text NOT NULL CHECK (location IN ('Freehold', 'Brick')),
  date              date NOT NULL,
  time              text NOT NULL,
  email             text NOT NULL,
  first_name        text NOT NULL DEFAULT '',
  last_name         text NOT NULL DEFAULT '',
  phone             text NOT NULL DEFAULT '',
  dob               text NOT NULL DEFAULT '',
  gender            text NOT NULL DEFAULT '',
  address           text NOT NULL DEFAULT '',
  insurance_name    text NOT NULL DEFAULT '',
  allergies         text NOT NULL DEFAULT '',
  medications       text NOT NULL DEFAULT '',
  medical_history   text NOT NULL DEFAULT '',
  reason_for_visit  text NOT NULL DEFAULT '',
  status            text NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'approved', 'hold', 'completed', 'cancelled', 'rejected')),
  admin_notes       text NOT NULL DEFAULT '',
  intake            jsonb NOT NULL DEFAULT '{}'::jsonb,
  email_verified    boolean NOT NULL DEFAULT false,
  approved_at       timestamptz,
  rejected_at       timestamptz,
  rejection_reason  text NOT NULL DEFAULT '',
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS appointments_slot_unique
  ON public.appointments (date, time, location)
  WHERE status NOT IN ('cancelled', 'rejected');

CREATE INDEX IF NOT EXISTS appointments_status_idx ON public.appointments (status);
CREATE INDEX IF NOT EXISTS appointments_date_idx   ON public.appointments (date);
CREATE INDEX IF NOT EXISTS appointments_created_idx ON public.appointments (created_at DESC);

DROP TRIGGER IF EXISTS appointments_updated_at ON public.appointments;
CREATE TRIGGER appointments_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── Contact messages ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id         text PRIMARY KEY,
  name       text NOT NULL,
  email      text NOT NULL,
  phone      text NOT NULL DEFAULT '',
  message    text NOT NULL,
  status     text NOT NULL DEFAULT 'new'
             CHECK (status IN ('new', 'read', 'replied')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS contact_messages_status_idx  ON public.contact_messages (status);
CREATE INDEX IF NOT EXISTS contact_messages_created_idx ON public.contact_messages (created_at DESC);

-- ── Slot management (live on the public booking page) ────────────────────────
CREATE TABLE IF NOT EXISTS public.slot_configs (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date          date NOT NULL,
  location      text NOT NULL CHECK (location IN ('Freehold', 'Brick')),
  day_blocked   boolean NOT NULL DEFAULT false,
  blocked_times text[] NOT NULL DEFAULT '{}',
  updated_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (date, location)
);

CREATE INDEX IF NOT EXISTS slot_configs_date_idx ON public.slot_configs (date);

DROP TRIGGER IF EXISTS slot_configs_updated_at ON public.slot_configs;
CREATE TRIGGER slot_configs_updated_at
  BEFORE UPDATE ON public.slot_configs
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── Conditions CMS ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.cms_conditions (
  id                 text PRIMARY KEY,
  slug               text NOT NULL,
  title              text NOT NULL,
  href               text NOT NULL DEFAULT '',
  hero_eyebrow       text NOT NULL DEFAULT '',
  short_description  text NOT NULL DEFAULT '',
  card_image         text NOT NULL DEFAULT '',
  hero_image         text NOT NULL DEFAULT '',
  overview           text NOT NULL DEFAULT '',
  symptoms           text NOT NULL DEFAULT '',
  treatment_intro    text NOT NULL DEFAULT '',
  meta_title         text NOT NULL DEFAULT '',
  meta_description   text NOT NULL DEFAULT '',
  enabled            boolean NOT NULL DEFAULT true,
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS cms_conditions_slug_idx ON public.cms_conditions (slug);

DROP TRIGGER IF EXISTS cms_conditions_updated_at ON public.cms_conditions;
CREATE TRIGGER cms_conditions_updated_at
  BEFORE UPDATE ON public.cms_conditions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── IV packages CMS ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.cms_iv_packages (
  id          text PRIMARY KEY,
  slug        text NOT NULL,
  name        text NOT NULL,
  price       numeric NOT NULL DEFAULT 0,
  total_value numeric,
  badge       text NOT NULL DEFAULT '',
  image       text NOT NULL DEFAULT '',
  tagline     text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  dosages     text NOT NULL DEFAULT '',
  best_for    text NOT NULL DEFAULT '',
  ingredients text NOT NULL DEFAULT '',
  add_ons     text NOT NULL DEFAULT '',
  enabled     boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS cms_iv_packages_slug_idx ON public.cms_iv_packages (slug);

DROP TRIGGER IF EXISTS cms_iv_packages_updated_at ON public.cms_iv_packages;
CREATE TRIGGER cms_iv_packages_updated_at
  BEFORE UPDATE ON public.cms_iv_packages
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS public.clinic_settings (
  id          text PRIMARY KEY DEFAULT 'main',
  doctor_name text NOT NULL DEFAULT 'Dr. Abidi',
  updated_at  timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.clinic_settings (id, doctor_name)
VALUES ('main', 'Dr. Abidi')
ON CONFLICT (id) DO NOTHING;

-- ── Grants ───────────────────────────────────────────────────────────────────
GRANT USAGE ON SCHEMA public TO anon, authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.appointments TO authenticated;

GRANT INSERT ON public.contact_messages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_messages TO authenticated;

GRANT SELECT ON public.slot_configs TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.slot_configs TO authenticated;

GRANT SELECT ON public.cms_conditions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cms_conditions TO authenticated;

GRANT SELECT ON public.cms_iv_packages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cms_iv_packages TO authenticated;

GRANT SELECT ON public.clinic_settings TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.clinic_settings TO authenticated;

-- ── Row Level Security ───────────────────────────────────────────────────────
ALTER TABLE public.appointments      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.slot_configs      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_conditions    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_iv_packages   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinic_settings   ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS appointments_public_insert ON public.appointments;
DROP POLICY IF EXISTS appointments_public_read_slots ON public.appointments;

DROP POLICY IF EXISTS appointments_admin_all ON public.appointments;
CREATE POLICY appointments_admin_all ON public.appointments
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS contact_public_insert ON public.contact_messages;
CREATE POLICY contact_public_insert ON public.contact_messages
  FOR INSERT TO anon
  WITH CHECK (status = 'new');

DROP POLICY IF EXISTS contact_admin_all ON public.contact_messages;
CREATE POLICY contact_admin_all ON public.contact_messages
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS slots_public_read ON public.slot_configs;
CREATE POLICY slots_public_read ON public.slot_configs
  FOR SELECT TO anon
  USING (true);

DROP POLICY IF EXISTS slots_admin_all ON public.slot_configs;
CREATE POLICY slots_admin_all ON public.slot_configs
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS conditions_public_read ON public.cms_conditions;
CREATE POLICY conditions_public_read ON public.cms_conditions
  FOR SELECT TO anon
  USING (enabled = true);

DROP POLICY IF EXISTS conditions_admin_all ON public.cms_conditions;
CREATE POLICY conditions_admin_all ON public.cms_conditions
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS packages_public_read ON public.cms_iv_packages;
CREATE POLICY packages_public_read ON public.cms_iv_packages
  FOR SELECT TO anon
  USING (enabled = true);

DROP POLICY IF EXISTS packages_admin_all ON public.cms_iv_packages;
CREATE POLICY packages_admin_all ON public.cms_iv_packages
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS clinic_settings_public_read ON public.clinic_settings;
CREATE POLICY clinic_settings_public_read ON public.clinic_settings
  FOR SELECT TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS clinic_settings_admin_all ON public.clinic_settings;
CREATE POLICY clinic_settings_admin_all ON public.clinic_settings
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Hide patient PII from anonymous slot lookups. Bookings are created by the server API.
REVOKE SELECT ON public.appointments FROM anon;
REVOKE INSERT ON public.appointments FROM anon;

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
REVOKE ALL ON public.email_otps FROM anon, authenticated;

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
REVOKE ALL ON public.email_verifications FROM anon, authenticated;

CREATE OR REPLACE VIEW public.booked_slots AS
SELECT date, time, location, status
FROM public.appointments
WHERE status NOT IN ('cancelled', 'rejected');

GRANT SELECT ON public.booked_slots TO anon, authenticated;
ALTER VIEW public.booked_slots SET (security_invoker = false);

-- Calendar: doctor-approved visits only (pending/hold stay off the calendar)
CREATE OR REPLACE VIEW public.calendar_appointments AS
SELECT *
FROM public.appointments
WHERE status = 'approved';

GRANT SELECT ON public.calendar_appointments TO authenticated;
DO $$
BEGIN
  BEGIN
    ALTER VIEW public.calendar_appointments SET (security_invoker = true);
  EXCEPTION WHEN others THEN NULL;
  END;
END $$;

CREATE OR REPLACE VIEW public.nav_conditions AS
SELECT
  id, slug, title,
  '/' || slug || '/' AS href,
  enabled
FROM public.cms_conditions
WHERE enabled = true;

CREATE OR REPLACE VIEW public.nav_packages AS
SELECT
  id, slug, name,
  '/iv-packages/' || slug || '/' AS href,
  enabled
FROM public.cms_iv_packages
WHERE enabled = true;

GRANT SELECT ON public.nav_conditions TO anon, authenticated;
GRANT SELECT ON public.nav_packages   TO anon, authenticated;

-- ── Realtime (live admin + live public slot/CMS updates) ─────────────────────
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.appointments;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.contact_messages;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.slot_configs;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.cms_conditions;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.cms_iv_packages;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.clinic_settings;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
END $$;

-- ── Admin login (no SMTP) ────────────────────────────────────────────────────
-- Email: admin@gmail.com
-- Password: admin123
DO $$
DECLARE
  uid uuid;
BEGIN
  SELECT id INTO uid FROM auth.users WHERE email = 'admin@gmail.com';

  IF uid IS NULL THEN
    uid := gen_random_uuid();

    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      recovery_sent_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      uid,
      'authenticated',
      'authenticated',
      'admin@gmail.com',
      extensions.crypt('admin123', extensions.gen_salt('bf')),
      now(),
      now(),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"role":"admin","full_name":"Clinic Admin"}'::jsonb,
      now(),
      now(),
      '',
      '',
      '',
      ''
    );
  ELSE
    UPDATE auth.users
    SET encrypted_password = extensions.crypt('admin123', extensions.gen_salt('bf')),
        email_confirmed_at = coalesce(email_confirmed_at, now()),
        raw_user_meta_data = coalesce(raw_user_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb,
        raw_app_meta_data  = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"provider":"email","providers":["email"]}'::jsonb,
        updated_at = now()
    WHERE id = uid;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM auth.identities WHERE user_id = uid AND provider = 'email'
  ) THEN
    INSERT INTO auth.identities (
      id,
      user_id,
      provider_id,
      identity_data,
      provider,
      last_sign_in_at,
      created_at,
      updated_at
    ) VALUES (
      gen_random_uuid(),
      uid,
      uid::text,
      jsonb_build_object('sub', uid::text, 'email', 'admin@gmail.com'),
      'email',
      now(),
      now(),
      now()
    );
  END IF;
END $$;
