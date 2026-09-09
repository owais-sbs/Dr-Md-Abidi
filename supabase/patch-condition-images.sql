-- Condition / CMS images — run in Supabase SQL Editor
-- Fixes: uploaded condition images not visible on the public site

-- 1) Ensure image columns exist on cms_conditions
ALTER TABLE public.cms_conditions
  ADD COLUMN IF NOT EXISTS card_image text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS hero_image text NOT NULL DEFAULT '';

-- 2) Public storage bucket for CMS uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'cms-images',
  'cms-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE
SET public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'iv-package-images',
  'iv-package-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE
SET public = true;

-- 3) Storage policies (public read, authenticated write)
DROP POLICY IF EXISTS "cms_images_public_read" ON storage.objects;
CREATE POLICY "cms_images_public_read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id IN ('cms-images', 'iv-package-images'));

DROP POLICY IF EXISTS "cms_images_admin_insert" ON storage.objects;
CREATE POLICY "cms_images_admin_insert"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id IN ('cms-images', 'iv-package-images'));

DROP POLICY IF EXISTS "cms_images_admin_update" ON storage.objects;
CREATE POLICY "cms_images_admin_update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id IN ('cms-images', 'iv-package-images'));

DROP POLICY IF EXISTS "cms_images_admin_delete" ON storage.objects;
CREATE POLICY "cms_images_admin_delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id IN ('cms-images', 'iv-package-images'));

-- 4) Public can read published conditions (needed for card_image URLs in CMS rows)
ALTER TABLE public.cms_conditions ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.cms_conditions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cms_conditions TO authenticated;

DROP POLICY IF EXISTS conditions_public_read ON public.cms_conditions;
CREATE POLICY conditions_public_read ON public.cms_conditions
  FOR SELECT TO anon, authenticated
  USING (enabled = true OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS conditions_admin_all ON public.cms_conditions;
CREATE POLICY conditions_admin_all ON public.cms_conditions
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);
