import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, Stethoscope } from 'lucide-react';
import { fadeUp, staggerContainer, viewport } from '@/animations/variants';
import { site } from '@/data/site';

const bgImg =
  'https://images.pexels.com/photos/7108401/pexels-photo-7108401.jpeg?auto=compress&cs=tinysrgb&h=900&w=1600';

export function SpecialistCTA() {
  return (
    <section className="relative overflow-hidden bg-ink-950 text-white">
      <div className="absolute inset-0 opacity-25" style={{ backgroundImage: `url(${bgImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
      <div className="absolute inset-0 bg-gradient-to-r from-ink-950/95 via-ink-950/85 to-primary-900/60" />
      <div className="container-page relative py-20">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="max-w-2xl"
        >
          <motion.span variants={fadeUp} className="eyebrow text-teal-300">
            
            <Stethoscope className="w-4 h-4" />
            Specialist Care
          </motion.span>
          <motion.h2 variants={fadeUp} className="mt-3 text-3xl sm:text-4xl font-bold text-white text-balance">
            Arthritis Specialist, Rheumatologist &amp; Joint Pain Doctor in Brick and Freehold, NJ
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 text-lg text-ink-200 leading-relaxed">
            From joint pain and stiffness to complex autoimmune disease, our rheumatology team provides expert diagnosis and personalized treatment. Book your appointment to start your path to relief.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Link to={site.bookingUrl} className="btn bg-white text-primary-700 px-6 py-3.5 hover:bg-primary-50 hover:shadow-lift text-base">
              Book Appointment Online
            </Link>
            <a href={site.phoneHref} className="btn-outline text-base">
              <Phone className="w-5 h-5" />
              {site.phone}
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
