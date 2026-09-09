import { supabase } from '@/lib/supabase';

const BUCKET = 'cms-images';

/**
 * Uploads an image file to Supabase Storage and returns its public URL.
 * Throws on error.
 */
export async function uploadPackageImage(file: File): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { upsert: false, contentType: file.type });

  if (error) {
    // Fallback to legacy bucket name if cms-images is not created yet
    if (/bucket|not found|does not exist/i.test(error.message)) {
      const legacy = 'iv-package-images';
      const legacyPath = `pkg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;
      const { error: e2 } = await supabase.storage
        .from(legacy)
        .upload(legacyPath, file, { upsert: false, contentType: file.type });
      if (e2) throw new Error(`Image upload failed: ${e2.message}`);
      const { data } = supabase.storage.from(legacy).getPublicUrl(legacyPath);
      return data.publicUrl;
    }
    throw new Error(`Image upload failed: ${error.message}`);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Deletes an image from Supabase Storage given its public URL.
 * Silently ignores errors (e.g. already deleted or URL is external).
 */
export async function deletePackageImage(publicUrl: string): Promise<void> {
  try {
    for (const bucket of [BUCKET, 'iv-package-images']) {
      const marker = `/${bucket}/`;
      const idx = publicUrl.indexOf(marker);
      if (idx === -1) continue;
      const path = publicUrl.slice(idx + marker.length);
      await supabase.storage.from(bucket).remove([path]);
      return;
    }
  } catch {
    // non-critical — ignore
  }
}
