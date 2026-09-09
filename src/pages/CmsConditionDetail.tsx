import { useParams, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Seo } from '@/components/common/Seo';
import { ConditionHero } from '@/components/conditions/ConditionHero';
import { ConditionContent } from '@/components/conditions/ConditionContent';
import { RelatedConditions } from '@/components/conditions/RelatedConditions';
import { CTASection } from '@/components/common/CTASection';
import { conditions as staticConditions, type Condition } from '@/data/conditions';
import { getCmsConditions, cmsConditionToCondition, type CmsCondition } from '@/data/cms';

export function CmsConditionDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [cmsRow, setCmsRow] = useState<CmsCondition | null | undefined>(undefined);
  const [related, setRelated] = useState<Condition[]>(staticConditions);

  useEffect(() => {
    let alive = true;
    getCmsConditions()
      .then((list) => {
        if (!alive) return;
        const match = list.find((c) => c.slug === slug && c.enabled && !c.id.startsWith('static-cond-')) || null;
        setCmsRow(match);

        const disabledStatic = new Set(
          list
            .filter((c) => c.id.startsWith('static-cond-') && !c.enabled)
            .map((c) => c.slug),
        );
        const visibleStatic = staticConditions.filter((c) => !disabledStatic.has(c.slug));
        const cmsExtras = list
          .filter((c) => c.enabled && !c.id.startsWith('static-cond-') && c.slug !== slug)
          .map(cmsConditionToCondition);
        setRelated([...visibleStatic, ...cmsExtras]);
      })
      .catch(() => {
        if (alive) {
          setCmsRow(null);
          setRelated(staticConditions);
        }
      });
    return () => { alive = false; };
  }, [slug]);

  if (cmsRow === undefined) {
    return (
      <div className="min-h-[40vh] grid place-items-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-900" />
      </div>
    );
  }
  if (!cmsRow) return <Navigate to="/conditions-we-treat/" replace />;

  const condition = cmsConditionToCondition(cmsRow);
  if (!condition.overview.length && condition.shortDescription) {
    condition.overview = [condition.shortDescription];
  }

  return (
    <>
      <Seo
        title={condition.metaTitle}
        description={condition.metaDescription}
        image={condition.heroImage || undefined}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'MedicalWebPage',
          name: condition.metaTitle,
          description: condition.metaDescription,
          about: {
            '@type': 'MedicalCondition',
            name: condition.title,
            description: condition.shortDescription || condition.metaDescription,
          },
          specialty: 'Rheumatology',
          audience: { '@type': 'Patient' },
        }}
      />
      <ConditionHero condition={condition} />
      <ConditionContent condition={condition} />
      <RelatedConditions conditions={related} currentSlug={condition.slug} />
      <CTASection eyebrow="Schedule a Visit" title={condition.ctaHeading} description={condition.ctaBody} />
    </>
  );
}
