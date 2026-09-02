-- =============================================================================
-- PATCH: live nav slugs, clinic doctor, approved calendar view
-- Safe to re-run after supabase/schema.sql
-- Paste into: Supabase Dashboard → SQL Editor → Run
-- =============================================================================

-- Doctor shown in calendar day boxes
CREATE TABLE IF NOT EXISTS public.clinic_settings (
  id          text PRIMARY KEY DEFAULT 'main',
  doctor_name text NOT NULL DEFAULT 'Dr. Abidi',
  updated_at  timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.clinic_settings (id, doctor_name)
VALUES ('main', 'Dr. Abidi')
ON CONFLICT (id) DO UPDATE SET doctor_name = EXCLUDED.doctor_name;

ALTER TABLE public.clinic_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS clinic_settings_public_read ON public.clinic_settings;
CREATE POLICY clinic_settings_public_read ON public.clinic_settings
  FOR SELECT TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS clinic_settings_admin_all ON public.clinic_settings;
CREATE POLICY clinic_settings_admin_all ON public.clinic_settings
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

GRANT SELECT ON public.clinic_settings TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.clinic_settings TO authenticated;

-- Public nav: renamed + new conditions (enabled only) — slug is the public URL
CREATE OR REPLACE VIEW public.nav_conditions AS
SELECT
  id,
  slug,
  title,
  '/' || slug || '/' AS href,
  enabled
FROM public.cms_conditions
WHERE enabled = true;

-- Public nav: renamed + new IV packages (enabled only) — slug is the public URL
CREATE OR REPLACE VIEW public.nav_packages AS
SELECT
  id,
  slug,
  name,
  '/iv-packages/' || slug || '/' AS href,
  enabled
FROM public.cms_iv_packages
WHERE enabled = true;

GRANT SELECT ON public.nav_conditions TO anon, authenticated;
GRANT SELECT ON public.nav_packages   TO anon, authenticated;

DO $$
BEGIN
  BEGIN
    ALTER VIEW public.nav_conditions SET (security_invoker = true);
  EXCEPTION WHEN others THEN NULL;
  END;
  BEGIN
    ALTER VIEW public.nav_packages SET (security_invoker = true);
  EXCEPTION WHEN others THEN NULL;
  END;
END $$;

-- Keep CMS realtime so dropdown names update without refresh
DO $$
BEGIN
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

-- Calendar: only doctor-approved appointments
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
