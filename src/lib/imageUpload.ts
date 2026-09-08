import { supabase } from '@/lib/supabase';

const BUCKET = 'iv-package-images';

/**
 * Uploads an image file to Supabase Storage and returns its public URL.
 * Throws on error.
 */
export async function uploadPackageImage(file: File): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const path = `pkg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { upsert: false, contentType: file.type });

  if (error) throw new Error(`Image upload failed: ${error.message}`);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Deletes an image from Supabase Storage given its public URL.
 * Silently ignores errors (e.g. already deleted or URL is external).
 */
export async function deletePackageImage(publicUrl: string): Promise<void> {
  try {
    // Extract the path after the bucket name in the URL
    const marker = `/${BUCKET}/`;
    const idx = publicUrl.indexOf(marker);
    if (idx === -1) return; // not our bucket — skip
    const path = publicUrl.slice(idx + marker.length);
    await supabase.storage.from(BUCKET).remove([path]);
  } catch {
    // non-critical — ignore
  }
}
