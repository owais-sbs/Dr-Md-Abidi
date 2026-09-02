import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Seo } from '@/components/common/Seo';
import { PageHero } from '@/components/common/PageHero';
import { SectionHeading } from '@/components/common/SectionHeading';
import { CTASection } from '@/components/common/CTASection';
import { ConditionCard } from '@/components/conditions/ConditionCard';
import { conditions } from '@/data/conditions';
import { staggerContainer, staggerFast, scaleIn, fadeUp, viewport } from '@/animations/variants';
import { getCmsConditions, type CmsCondition } from '@/data/cms';

const heroImg = 'https://images.pexels.com/photos/3992806/pexels-photo-3992806.jpeg?auto=compress&cs=tinysrgb&h=900&w=1600';

export function Conditions() {
  const [cmsConditions, setCmsConditions] = useState<CmsCondition[]>([]);

  function loadCms() {
    setCmsConditions(getCmsConditions().filter(c => c.enabled));
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
            {conditions.map((c) => (
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
                <motion.div key={c.id} variants={scaleIn} whileHover={{ y: -5 }} className="card overflow-hidden flex flex-col group">
                  {c.cardImage && (
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img src={c.cardImage} alt={c.title} loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink-950/40 via-transparent to-transparent" />
                      {c.heroEyebrow && (
                        <span className="absolute top-3 left-3 rounded-full bg-white/90 backdrop-blur px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary-700 shadow-sm">
                          {c.heroEyebrow}
                        </span>
                      )}
                    </div>
                  )}
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-base font-bold text-ink-900 group-hover:text-primary-700 transition-colors">{c.title}</h3>
                    <p className="mt-2 text-sm text-ink-600 leading-relaxed line-clamp-3 flex-1">{c.shortDescription}</p>
                    <motion.div variants={fadeUp} className="mt-4">
                      {c.href ? (
                        <Link to={`/cms-condition/${c.slug}/`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 hover:gap-2.5 transition-all">
                          Learn More <ArrowRight className="w-4 h-4" />
                        </Link>
                      ) : (
                        <Link to="/contact-us/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 hover:gap-2.5 transition-all">
                          Contact Us <ArrowRight className="w-4 h-4" />
                        </Link>
                      )}
                    </motion.div>
                  </div>
                </motion.div>
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
