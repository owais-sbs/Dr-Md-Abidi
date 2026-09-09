-- CMS images + blog posts + storage policies
-- Run this in the Supabase SQL Editor.

-- ── Public CMS images bucket (conditions, IV packages, blog) ──
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

-- Legacy bucket (keep public if it already exists)
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

-- Public read
DROP POLICY IF EXISTS "cms_images_public_read" ON storage.objects;
CREATE POLICY "cms_images_public_read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id IN ('cms-images', 'iv-package-images'));

-- Authenticated upload/update/delete
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

-- ── Blog CMS table ──
-- If an older uuid version of this table exists, drop it first:
-- DROP TABLE IF EXISTS public.cms_blog_posts;

CREATE TABLE IF NOT EXISTS public.cms_blog_posts (
  id text PRIMARY KEY,
  slug text NOT NULL,
  title text NOT NULL DEFAULT '',
  excerpt text NOT NULL DEFAULT '',
  author text NOT NULL DEFAULT 'MD Abidi Arthritis Institute',
  featured_image text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  published_at date,
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS cms_blog_posts_slug_idx ON public.cms_blog_posts (slug);

DROP TRIGGER IF EXISTS cms_blog_posts_updated_at ON public.cms_blog_posts;
CREATE TRIGGER cms_blog_posts_updated_at
  BEFORE UPDATE ON public.cms_blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.cms_blog_posts ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.cms_blog_posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cms_blog_posts TO authenticated;

DROP POLICY IF EXISTS blog_public_read ON public.cms_blog_posts;
CREATE POLICY blog_public_read ON public.cms_blog_posts
  FOR SELECT TO anon, authenticated
  USING (enabled = true OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS blog_admin_all ON public.cms_blog_posts;
CREATE POLICY blog_admin_all ON public.cms_blog_posts
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.cms_blog_posts;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
