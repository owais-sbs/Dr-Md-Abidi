-- Fix CMS delete/update for admin users (IV packages + conditions + blog)
-- Run in Supabase SQL Editor if Delete does nothing or fails silently.

-- Broaden admin check: any authenticated session used by the admin panel
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT auth.role() = 'authenticated'
     AND (
       coalesce(auth.jwt() ->> 'email', '') <> ''
       OR coalesce((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin', false)
       OR coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false)
     );
$$;

-- IV packages
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cms_iv_packages TO authenticated;
DROP POLICY IF EXISTS packages_admin_all ON public.cms_iv_packages;
CREATE POLICY packages_admin_all ON public.cms_iv_packages
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- Conditions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cms_conditions TO authenticated;
DROP POLICY IF EXISTS conditions_admin_all ON public.cms_conditions;
CREATE POLICY conditions_admin_all ON public.cms_conditions
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- Blog (if table exists)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'cms_blog_posts'
  ) THEN
    EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON public.cms_blog_posts TO authenticated';
    EXECUTE 'DROP POLICY IF EXISTS blog_admin_all ON public.cms_blog_posts';
    EXECUTE $p$
      CREATE POLICY blog_admin_all ON public.cms_blog_posts
        FOR ALL TO authenticated
        USING (true)
        WITH CHECK (true)
    $p$;
  END IF;
END $$;
