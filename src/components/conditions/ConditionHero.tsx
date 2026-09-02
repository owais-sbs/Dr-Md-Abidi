import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from '@/animations/variants';
import type { Condition } from '@/data/conditions';
import { Link } from 'react-router-dom';
import { CalendarDays, Phone } from 'lucide-react';
import { site } from '@/data/site';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';

export function ConditionHero({ condition }: { condition: Condition }) {
  return (
    <>
      <Breadcrumbs items={[{ label: 'Conditions We Treat', href: '/conditions-we-treat/' }, { label: condition.title }]} />
      <section className="relative overflow-hidden bg-ink-950 text-white">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: `url(${condition.heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950/95 via-ink-950/80 to-primary-900/50" />
        <div className="container-page relative py-16 sm:py-24">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="max-w-2xl">
            <motion.span variants={fadeUp} className="eyebrow text-teal-300">
              {condition.heroEyebrow}
            </motion.span>
            <motion.h1 variants={fadeUp} className="mt-3 text-4xl sm:text-5xl font-bold text-white text-balance">
              {condition.title}
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-5 text-lg text-ink-200 leading-relaxed">
              {condition.shortDescription}
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Link to={site.bookingUrl} className="btn bg-white text-primary-700 px-6 py-3 hover:bg-primary-50 hover:shadow-lift">
                <CalendarDays className="w-5 h-5" />
                Book Appointment Online
              </Link>
              <a href={site.phoneHref} className="btn-outline">
                <Phone className="w-5 h-5" />
                {site.phone}
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
