import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from '@/animations/variants';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import type { Crumb } from '@/components/common/Breadcrumbs';

interface PageHeroProps {
  title: string;
  description?: string;
  eyebrow?: string;
  image: string;
  crumbs?: Crumb[];
}

export function PageHero({ title, description, eyebrow, image, crumbs }: PageHeroProps) {
  return (
    <>
      {crumbs && <Breadcrumbs items={crumbs} />}
      <section className="relative overflow-hidden bg-primary-900 text-white">
        <div
          className="absolute inset-0 opacity-25"
          style={{ backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/95 via-primary-900/80 to-primary-800/60" />
        <div className="container-page relative py-12 sm:py-20">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="max-w-2xl">
            {eyebrow && (
              <motion.span variants={fadeUp} className="eyebrow text-sky-300">
                {eyebrow}
              </motion.span>
            )}
            <motion.h1 variants={fadeUp} className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white text-balance leading-tight">
              {title}
            </motion.h1>
            {description && (
              <motion.p variants={fadeUp} className="mt-4 text-base sm:text-lg text-sky-100/80 leading-relaxed">
                {description}
              </motion.p>
            )}
          </motion.div>
        </div>
      </section>
    </>
  );
}
