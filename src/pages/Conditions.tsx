import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Seo } from '@/components/common/Seo';
import { PageHero } from '@/components/common/PageHero';
import { SectionHeading } from '@/components/common/SectionHeading';
import { CTASection } from '@/components/common/CTASection';
import { ConditionCard } from '@/components/conditions/ConditionCard';
import { conditions } from '@/data/conditions';
import { staggerContainer, staggerFast, viewport } from '@/animations/variants';
import { getCmsConditions, cmsConditionToCondition, type CmsCondition } from '@/data/cms';
import { useCmsRealtime } from '@/lib/cmsLive';

const heroImg = 'https://images.pexels.com/photos/3992806/pexels-photo-3992806.jpeg?auto=compress&cs=tinysrgb&h=900&w=1600';

export function Conditions() {
  const [cmsConditions, setCmsConditions] = useState<CmsCondition[]>([]);
  const [overrides, setOverrides] = useState<CmsCondition[]>([]);

  async function loadCms() {
    try {
      const all = await getCmsConditions();
      setOverrides(all.filter(c => c.id.startsWith('static-cond-')));
      setCmsConditions(all.filter(c => c.enabled && !c.id.startsWith('static-cond-')));
    } catch {
      setOverrides([]);
      setCmsConditions([]);
    }
  }

  useEffect(() => {
    loadCms();
  }, []);
  useCmsRealtime(loadCms);

  const displayConditions = conditions.flatMap(c => {
    const ov = overrides.find(o => o.slug === c.slug || o.id === `static-cond-${c.slug}`);
    if (ov && !ov.enabled) return [];
    if (!ov) return [c];
    return [{
      ...c,
      title: ov.title || c.title,
      shortDescription: ov.shortDescription || c.shortDescription,
      cardImage: ov.cardImage || ov.heroImage || c.cardImage,
      heroImage: ov.heroImage || ov.cardImage || c.heroImage,
      heroEyebrow: ov.heroEyebrow || c.heroEyebrow,
      href: `/${ov.slug || c.slug}/`,
    }];
  });

  return (
    <>
      <Seo
        title="Conditions We Treat | MD Abidi Arthritis Institute"
        description="We specialize in diagnosing and treating arthritis, joint pain, autoimmune diseases, and inflammatory conditions in Brick and Freehold, NJ."
      />
      <PageHero
        eyebrow="Our Services"
        title="Conditions We Treat"
        description="At MD Abidi Arthritis Institute, we specialize in diagnosing and treating arthritis, joint pain, autoimmune diseases, and inflammatory conditions."
        image={heroImg}
        crumbs={[{ label: 'Conditions We Treat' }]}
      />

      {/* Static conditions */}
      <section className="bg-white">
        <div className="container-page py-14 sm:py-20">
          <SectionHeading
            eyebrow="What We Treat"
            title="Arthritis, Autoimmune Disease & Joint Pain Conditions"
            description="Explore the conditions our rheumatology team treats. Click any condition to learn more about symptoms, diagnosis, and treatment options."
          />
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {displayConditions.map((c) => (
              <ConditionCard key={c.slug} condition={c} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* CMS-added conditions — dynamic from admin */}
      {cmsConditions.length > 0 && (
        <section className="bg-ink-50">
          <div className="container-page py-12 sm:py-16">
            <SectionHeading
              eyebrow="Additional Conditions"
              title="More Conditions We Treat"
            />
            <motion.div
              variants={staggerFast}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {cmsConditions.map(c => (
                <ConditionCard key={c.id} condition={cmsConditionToCondition(c)} />
              ))}
            </motion.div>
          </div>
        </section>
      )}

      <CTASection
        eyebrow="Get Started Today"
        title="Take the First Step Toward Lasting Relief from Arthritis & Joint Pain"
        description="Schedule a consultation with our rheumatology team in Brick or Freehold, NJ."
      />
    </>
  );
}
