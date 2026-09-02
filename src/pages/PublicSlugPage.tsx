import { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { getCondition } from '@/data/conditions';
import { getCmsConditions } from '@/data/cms';
import { ConditionDetail } from '@/pages/ConditionDetail';
import { CmsConditionDetail } from '@/pages/CmsConditionDetail';

const RESERVED = new Set([
  'about-us', 'conditions-we-treat', 'iv-packages', 'happy-patients',
  'blog', 'contact-us', 'disclaimer', 'privacy-policy', 'book-iv', 'admin',
]);

export function PublicSlugPage() {
  const { slug } = useParams<{ slug: string }>();
  const [mode, setMode] = useState<'loading' | 'static' | 'cms' | 'missing'>('loading');
  const [staticSlug, setStaticSlug] = useState(slug || '');

  useEffect(() => {
    if (!slug || RESERVED.has(slug)) { setMode('missing'); return; }
    if (getCondition(slug)) {
      setStaticSlug(slug);
      setMode('static');
      return;
    }
    let alive = true;
    getCmsConditions()
      .then(list => {
        if (!alive) return;
        const match = list.find(c => c.slug === slug && c.enabled);
        if (match?.id.startsWith('static-cond-')) {
          const original = match.id.replace(/^static-cond-/, '');
          if (getCondition(original)) {
            setStaticSlug(original);
            setMode('static');
            return;
          }
        }
        setMode(match && !match.id.startsWith('static-cond-') ? 'cms' : 'missing');
      })
      .catch(() => { if (alive) setMode('missing'); });
    return () => { alive = false; };
  }, [slug]);

  if (mode === 'loading') {
    return (
      <div className="min-h-[40vh] grid place-items-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-900" />
      </div>
    );
  }
  if (mode === 'static') return <ConditionDetail slug={staticSlug} />;
  if (mode === 'cms') return <CmsConditionDetail />;
  return <Navigate to="/conditions-we-treat/" replace />;
}
