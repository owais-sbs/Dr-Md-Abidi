import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { staggerContainer, staggerFast, fadeUp, fadeDown, scaleIn, viewport } from '@/animations/variants';
import { SectionHeading } from '@/components/common/SectionHeading';
import { ConditionCard } from '@/components/conditions/ConditionCard';
import { conditions } from '@/data/conditions';
import { getCmsConditions, type CmsCondition } from '@/data/cms';

export function ConditionsSection() {
  const [cmsConditions, setCmsConditions] = useState<CmsCondition[]>([]);

  function loadCms() {
    setCmsConditions(getCmsConditions().filter(c => c.enabled).slice(0, 3));
  }

  useEffect(() => {
    loadCms();
    window.addEventListener('focus', loadCms);
    window.addEventListener('storage', loadCms);
    return () => {
      window.removeEventListener('focus', loadCms);
      window.removeEventListener('storage', loadCms);
    };
  }, []);
  return (
    <section className="bg-ink-50 overflow-hidden">
      <div className="container-page py-20">

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
          {conditions.map((c, i) => (
            <motion.div
              key={c.slug}
              variants={scaleIn}
              custom={i}
              whileHover={{ y: -6, boxShadow: '0 20px 48px -12px rgba(20,38,87,0.18)' }}
              transition={{ duration: 0.25 }}
            >
              <ConditionCard condition={c} />
            </motion.div>
          ))}
          {/* CMS-added conditions */}
          {cmsConditions.map((c, i) => (
            <motion.div key={c.id} variants={scaleIn} custom={conditions.length + i}
              whileHover={{ y: -6, boxShadow: '0 20px 48px -12px rgba(20,38,87,0.18)' }} transition={{ duration: 0.25 }}>
              <div className="card overflow-hidden flex flex-col group hover:shadow-card transition-shadow">
                {c.cardImage && (
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img src={c.cardImage} alt={c.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-950/50 via-transparent to-transparent" />
                    {c.heroEyebrow && <span className="absolute top-3 left-3 rounded-full bg-white/90 backdrop-blur px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary-700 shadow-sm">{c.heroEyebrow}</span>}
                  </div>
                )}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-lg font-bold text-ink-900 group-hover:text-primary-700 transition-colors">{c.title}</h3>
                  <p className="mt-2 text-sm text-ink-600 leading-relaxed line-clamp-3">{c.shortDescription}</p>
                  <Link to={`/cms-condition/${c.slug}/`} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 group-hover:gap-2.5 transition-all">
                    Learn More <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
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
