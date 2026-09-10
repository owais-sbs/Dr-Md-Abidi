import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { staggerContainer, staggerFast, fadeUp, fadeDown, scaleIn, viewport } from '@/animations/variants';
import { SectionHeading } from '@/components/common/SectionHeading';
import { ConditionCard } from '@/components/conditions/ConditionCard';
import { conditions } from '@/data/conditions';
import { getCmsConditions, cmsConditionToCondition, type CmsCondition } from '@/data/cms';
import { useCmsRealtime } from '@/lib/cmsLive';

export function ConditionsSection() {
  const [cmsConditions, setCmsConditions] = useState<CmsCondition[]>([]);
  const [overrides, setOverrides] = useState<CmsCondition[]>([]);

  async function loadCms() {
    try {
      const all = await getCmsConditions();
      setOverrides(all.filter(c => c.id.startsWith('static-cond-')));
      setCmsConditions(all.filter(c => c.enabled && !c.id.startsWith('static-cond-')).slice(0, 3));
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
      heroEyebrow: ov.heroEyebrow || c.heroEyebrow,
      href: `/${ov.slug || c.slug}/`,
    }];
  });
  return (
    <section className="bg-ink-50">
      <div className="container-page py-14 sm:py-16">

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <motion.div variants={fadeDown}>
            <SectionHeading
              eyebrow="What We Do"
              title="Conditions We Treat – Arthritis, Joint Pain & Autoimmune Diseases"
              description="Our experienced rheumatologists provide personalized care for a wide range of arthritis, joint, and autoimmune conditions, helping patients in Brick and Freehold, NJ find lasting relief."
            />
          </motion.div>
        </motion.div>

        <motion.div
          variants={staggerFast}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {displayConditions.map((c) => (
            <ConditionCard key={c.slug} condition={c} />
          ))}
          {cmsConditions.map((c) => (
            <ConditionCard key={c.id} condition={cmsConditionToCondition(c)} />
          ))}
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mt-10 text-center"
        >
          <Link to="/conditions-we-treat/" className="btn-primary">
            View All Conditions
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
