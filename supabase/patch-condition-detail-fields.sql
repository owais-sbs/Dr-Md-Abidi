-- Extra fields so CMS conditions match the full static condition page UI
-- Run in Supabase SQL Editor

ALTER TABLE public.cms_conditions
  ADD COLUMN IF NOT EXISTS sections text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS cta_heading text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS cta_body text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS hero_image_alt text NOT NULL DEFAULT '';
