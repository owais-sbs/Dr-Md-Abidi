import { useParams, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Seo } from '@/components/common/Seo';
import { ConditionHero } from '@/components/conditions/ConditionHero';
import { ConditionContent } from '@/components/conditions/ConditionContent';
import { RelatedConditions } from '@/components/conditions/RelatedConditions';
import { CTASection } from '@/components/common/CTASection';
import { getCondition, conditions, type Condition } from '@/data/conditions';
import { getCmsConditions } from '@/data/cms';

export function ConditionDetail({ slug: slugProp }: { slug?: string }) {
  const { slug: slugParam } = useParams<{ slug: string }>();
  const slug = slugProp ?? slugParam;
  const base = slug ? getCondition(slug) : undefined;

  // Read CMS override for this slug (stored as static-cond-{slug})
  const [ov, setOv] = useState(() =>
    getCmsConditions().find(c => c.id === `static-cond-${slug}`)
  );

  useEffect(() => {
    function reload() {
      setOv(getCmsConditions().find(c => c.id === `static-cond-${slug}`));
    }
    window.addEventListener('storage', reload);
    window.addEventListener('focus', reload);
    return () => {
      window.removeEventListener('storage', reload);
      window.removeEventListener('focus', reload);
    };
  }, [slug]);

  if (!base) return <Navigate to="/conditions-we-treat/" replace />;

  // Merge CMS override fields into the static condition
  const condition: Condition = ov ? {
    ...base,
    title:           ov.title           || base.title,
    shortDescription:ov.shortDescription|| base.shortDescription,
    heroEyebrow:     ov.heroEyebrow     || base.heroEyebrow,
    heroImage:       ov.heroImage       || base.heroImage,
    cardImage:       ov.cardImage       || base.cardImage,
    treatmentIntro:  ov.treatmentIntro  || base.treatmentIntro,
    metaTitle:       ov.metaTitle       || base.metaTitle,
    metaDescription: ov.metaDescription || base.metaDescription,
    // Merge overview paragraphs if provided
    overview: ov.overview
      ? ov.overview.split('\n').filter(Boolean)
      : base.overview,
    symptoms: ov.symptoms
      ? ov.symptoms.split(',').map(s => s.trim()).filter(Boolean)
      : base.symptoms,
  } : base;

  return (
    <>
      <Seo title={condition.metaTitle} description={condition.metaDescription} />
      <ConditionHero condition={condition} />
      <ConditionContent condition={condition} />
      <RelatedConditions conditions={conditions} currentSlug={condition.slug} />
      <CTASection eyebrow="Schedule a Visit" title={condition.ctaHeading} description={condition.ctaBody} />
    </>
  );
}
