import { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { getCmsIVPackages } from '@/data/cms';
import { CmsIVPackageDetail } from '@/pages/CmsIVPackageDetail';
import { Saline } from '@/pages/iv/Saline';
import { TheMyers } from '@/pages/iv/TheMyers';
import { TheAfterParty } from '@/pages/iv/TheAfterParty';
import { MTO } from '@/pages/iv/MTO';
import { GoWithTheFlow } from '@/pages/iv/GoWithTheFlow';
import { TheMigraineMinimizer } from '@/pages/iv/TheMigraineMinimizer';
import { TheDefensiveLine } from '@/pages/iv/TheDefensiveLine';
import { TheKitchenSink } from '@/pages/iv/TheKitchenSink';
import { TheGrenade } from '@/pages/iv/TheGrenade';

const STATIC_IV: Record<string, React.ComponentType> = {
  saline: Saline,
  'the-myers': TheMyers,
  'the-after-party': TheAfterParty,
  mto: MTO,
  'go-with-the-flow': GoWithTheFlow,
  'the-migraine-minimizer': TheMigraineMinimizer,
  'the-defensive-line': TheDefensiveLine,
  'the-kitchen-sink': TheKitchenSink,
  'the-grenade': TheGrenade,
};

export function IVPackageRoute() {
  const { slug } = useParams<{ slug: string }>();
  const [mode, setMode] = useState<'loading' | 'static' | 'cms' | 'missing'>('loading');
  const [staticSlug, setStaticSlug] = useState(slug || '');

  useEffect(() => {
    if (!slug) { setMode('missing'); return; }
    if (STATIC_IV[slug]) {
      setStaticSlug(slug);
      setMode('static');
      return;
    }
    let alive = true;
    getCmsIVPackages()
      .then(list => {
        if (!alive) return;
        const match = list.find(p => p.slug === slug && p.enabled);
        if (match?.id.startsWith('static-pkg-')) {
          const original = match.id.replace(/^static-pkg-/, '');
          if (STATIC_IV[original]) {
            setStaticSlug(original);
            setMode('static');
            return;
          }
        }
        setMode(match && !match.id.startsWith('static-pkg-') ? 'cms' : 'missing');
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
  if (mode === 'static') {
    const Page = STATIC_IV[staticSlug];
    return Page ? <Page /> : <Navigate to="/iv-packages/" replace />;
  }
  if (mode === 'cms') return <CmsIVPackageDetail />;
  return <Navigate to="/iv-packages/" replace />;
}
