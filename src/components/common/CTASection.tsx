import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone } from 'lucide-react';
import { fadeUp, staggerContainer, viewport } from '@/animations/variants';
import { site } from '@/data/site';

interface CTASectionProps {
  eyebrow?: string;
  title: string;
  description: string;
  primaryLabel?: string;
  primaryHref?: string;
}

export function CTASection({
  eyebrow,
  title,
  description,
  primaryLabel = 'Book Appointment Online',
  primaryHref = site.bookingUrl,
}: CTASectionProps) {
  return (
    <section className="relative overflow-hidden bg-primary-800 text-white">
      {/* decorative glows */}
      <div className="absolute top-0 left-0 w-80 h-80 rounded-full bg-sky-300/10 blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-orange-500/15 blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="container-page relative py-16 sm:py-20">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="max-w-3xl mx-auto text-center"
        >
          {eyebrow && (
            <motion.span variants={fadeUp} className="eyebrow text-sky-300">
              {eyebrow}
            </motion.span>
          )}
          <motion.h2 variants={fadeUp} className="mt-3 text-3xl sm:text-4xl font-serif font-bold text-white text-balance">
            {title}
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 text-lg text-sky-100/75 leading-relaxed">
            {description}
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={primaryHref}
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-7 py-3.5 rounded-full shadow-lift transition-all duration-200 text-sm"
            >
              {primaryLabel}
            </Link>
            <a
              href={site.phoneHref}
              className="inline-flex items-center gap-2 border-2 border-white/30 hover:border-white text-white font-semibold px-7 py-3.5 rounded-full transition-all duration-200 text-sm hover:bg-white/10"
            >
              <Phone className="w-4 h-4" />
              {site.phone}
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
