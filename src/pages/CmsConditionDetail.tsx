import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarDays, Phone, CheckCircle2, ArrowRight } from 'lucide-react';
import { Seo } from '@/components/common/Seo';
import { CTASection } from '@/components/common/CTASection';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { getCmsConditions } from '@/data/cms';
import { fadeUp, staggerContainer, viewport } from '@/animations/variants';
import { site } from '@/data/site';

export function CmsConditionDetail() {
  const { slug } = useParams<{ slug: string }>();
  const condition = getCmsConditions().find(c => c.slug === slug && c.enabled);

  if (!condition) return <Navigate to="/conditions-we-treat/" replace />;

  const symptoms = condition.symptoms ? condition.symptoms.split(',').map(s => s.trim()).filter(Boolean) : [];
  const paragraphs = condition.overview ? condition.overview.split('\n').filter(Boolean) : [];

  return (
    <>
      <Seo
        title={condition.metaTitle || `${condition.title} | MD Abidi Arthritis Institute`}
        description={condition.metaDescription || condition.shortDescription}
      />

      <Breadcrumbs items={[{ label: 'Conditions We Treat', href: '/conditions-we-treat/' }, { label: condition.title }]} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-primary-900 text-white">
        {condition.heroImage && (
          <div className="absolute inset-0 opacity-25"
            style={{ backgroundImage: `url(${condition.heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/95 via-primary-900/80 to-primary-800/60" />
        <div className="container-page relative py-14 sm:py-20">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="max-w-2xl">
            {condition.heroEyebrow && (
              <motion.span variants={fadeUp} className="eyebrow text-sky-300">{condition.heroEyebrow}</motion.span>
            )}
            <motion.h1 variants={fadeUp} className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white text-balance leading-tight">
              {condition.title}
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-4 text-base sm:text-lg text-sky-100/80 leading-relaxed">
              {condition.shortDescription}
            </motion.p>
            <motion.div variants={fadeUp} className="mt-7 flex flex-wrap gap-3">
              <Link to={site.bookingUrl}
                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-7 py-3.5 rounded-full shadow-lift transition-all text-sm">
                <CalendarDays className="w-4 h-4" /> Book Appointment Online
              </Link>
              <a href={site.phoneHref}
                className="inline-flex items-center gap-2 border-2 border-white/30 hover:border-white text-white font-semibold px-7 py-3.5 rounded-full transition-all text-sm hover:bg-white/10">
                <Phone className="w-4 h-4" /> {site.phone}
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Overview */}
      {paragraphs.length > 0 && (
        <section className="bg-white">
          <div className="container-page py-14">
            <div className="max-w-3xl">
              <motion.span variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport} className="eyebrow">Overview</motion.span>
              <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewport} className="mt-4 space-y-4 text-ink-600 leading-relaxed">
                {paragraphs.map((p, i) => (
                  <motion.p key={i} variants={fadeUp}>{p}</motion.p>
                ))}
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Symptoms */}
      {symptoms.length > 0 && (
        <section className="bg-ink-50">
          <div className="container-page py-14">
            <motion.span variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport} className="eyebrow">Common Symptoms</motion.span>
            <motion.ul variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewport}
              className="mt-6 grid sm:grid-cols-2 gap-3 max-w-2xl">
              {symptoms.map(s => (
                <motion.li key={s} variants={fadeUp} className="flex items-start gap-2.5 text-sm text-ink-700">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" /> {s}
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </section>
      )}

      {/* Treatment */}
      {condition.treatmentIntro && (
        <section className="bg-white">
          <div className="container-page py-14">
            <div className="max-w-3xl">
              <motion.span variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport} className="eyebrow">Treatment</motion.span>
              <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport} className="mt-4 text-ink-600 leading-relaxed">
                {condition.treatmentIntro}
              </motion.p>
            </div>
          </div>
        </section>
      )}

      <CTASection
        eyebrow="Get Expert Care"
        title={condition.title + ' Treatment in Brick & Freehold, NJ'}
        description="Our rheumatology team can help. Schedule a consultation today."
      />
    </>
  );
}
