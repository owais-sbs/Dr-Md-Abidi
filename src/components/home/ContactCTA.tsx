import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, ArrowRight } from 'lucide-react';
import { fadeUp, staggerContainer, viewport } from '@/animations/variants';
import { site } from '@/data/site';

export function ContactCTA() {
  return (
    <section className="relative overflow-hidden bg-primary-800 text-white">
      {/* decorative glows */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-sky-300/10 blur-3xl translate-x-1/3 -translate-y-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-orange-500/15 blur-3xl -translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="container-page relative py-12 sm:py-20">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewport} className="max-w-2xl">
          <motion.span variants={fadeUp} className="eyebrow text-sky-300">
            Get In Touch
          </motion.span>
          <motion.h2 variants={fadeUp} className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-white text-balance">
            Looking for an Arthritis Doctor or Rheumatologist Near You?
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 text-base sm:text-lg text-sky-100/75 leading-relaxed">
            Our experienced rheumatology team is ready to help you find relief from arthritis, joint pain, and autoimmune disease. Reach out today to schedule your appointment.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-7 flex flex-col sm:flex-row gap-3">
            <Link to="/contact-us/" className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-7 py-3.5 rounded-full shadow-lift transition-all text-sm">
              Contact Us <ArrowRight className="w-4 h-4" />
            </Link>
            <a href={site.phoneHref} className="inline-flex items-center justify-center gap-2 border-2 border-white/30 hover:border-white text-white font-semibold px-7 py-3.5 rounded-full transition-all text-sm hover:bg-white/10">
              <Phone className="w-4 h-4" /> {site.phone}
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
