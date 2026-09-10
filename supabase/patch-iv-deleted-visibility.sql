-- Allow the public site to READ static IV package overrides that are
-- disabled or marked deleted. Without this, tombstones are invisible to
-- anon users and deleted built-in packages reappear from static nav/code.
--
-- Run once in the Supabase SQL editor.

DROP POLICY IF EXISTS packages_public_read ON public.cms_iv_packages;
CREATE POLICY packages_public_read ON public.cms_iv_packages
  FOR SELECT
  TO anon, authenticated
  USING (
    enabled = true
    OR id LIKE 'static-pkg-%'
    OR tagline = '__DELETED__'
  );

-- Same pattern for conditions (draft/hide built-ins must stay readable)
DROP POLICY IF EXISTS conditions_public_read ON public.cms_conditions;
CREATE POLICY conditions_public_read ON public.cms_conditions
  FOR SELECT
  TO anon, authenticated
  USING (
    enabled = true
    OR id LIKE 'static-cond-%'
  );

-- Optional cleanup: ensure any existing tombstones are consistent
UPDATE public.cms_iv_packages
SET enabled = false,
    tagline = '__DELETED__',
    updated_at = now()
WHERE tagline = '__DELETED__'
  AND enabled = true;
