import { useMemo, useState } from 'react';
import { Loader2, RefreshCw } from 'lucide-react';

/** Encode path segments so filenames with spaces work reliably on CDNs. */
export function encodeAssetSrc(src: string): string {
  if (!src) return '';
  if (src.startsWith('data:') || src.startsWith('blob:')) return src;
  try {
    if (/^https?:\/\//i.test(src)) {
      const u = new URL(src);
      u.pathname = u.pathname
        .split('/')
        .map((seg) => (seg ? encodeURIComponent(decodeURIComponent(seg)) : ''))
        .join('/');
      return u.toString();
    }
  } catch {
    /* fall through */
  }
  return src
    .split('/')
    .map((seg) => {
      if (!seg) return '';
      try {
        return encodeURIComponent(decodeURIComponent(seg));
      } catch {
        return encodeURIComponent(seg);
      }
    })
    .join('/');
}

type SoftImageProps = {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';
};

/**
 * Soft fade-in image with skeleton while loading and a retry control on failure.
 */
export function SoftImage({
  src,
  alt,
  className = '',
  imgClassName = '',
  loading = 'lazy',
  fetchPriority,
}: SoftImageProps) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [attempt, setAttempt] = useState(0);

  const resolved = useMemo(() => {
    const base = encodeAssetSrc(src);
    if (!base) return '';
    if (attempt === 0) return base;
    const join = base.includes('?') ? '&' : '?';
    return `${base}${join}retry=${attempt}`;
  }, [src, attempt]);

  function retry() {
    setStatus('loading');
    setAttempt((n) => n + 1);
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {status !== 'loaded' && (
        <div className="absolute inset-0 z-[1] flex flex-col items-center justify-center gap-2 bg-gradient-to-b from-sky-50 to-sky-100/80">
          {status === 'loading' ? (
            <>
              <div className="absolute inset-0 animate-pulse bg-sky-100/70" />
              <Loader2 className="relative w-6 h-6 text-sky-500 animate-spin" />
              <span className="relative text-[11px] font-medium text-sky-600">Loading image…</span>
            </>
          ) : (
            <>
              <p className="text-xs text-ink-500 px-4 text-center">Image didn’t load</p>
              <button
                type="button"
                onClick={retry}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-900 bg-white border border-ink-200 rounded-full px-3 py-1.5 shadow-sm hover:border-primary-900 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Reload
              </button>
            </>
          )}
        </div>
      )}
      {resolved ? (
        <img
          key={resolved}
          src={resolved}
          alt={alt}
          loading={loading}
          decoding="async"
          fetchPriority={fetchPriority}
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
          className={`${imgClassName} transition-opacity duration-500 ${
            status === 'loaded' ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ) : null}
    </div>
  );
}
