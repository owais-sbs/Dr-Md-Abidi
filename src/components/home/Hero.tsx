import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarDays, Phone, ShieldCheck, Star, MapPin, Award, Users } from 'lucide-react';
import { fadeUp, staggerContainer, scaleIn } from '@/animations/variants';
import { site } from '@/data/site';
const stats = [
  { icon: Award,        value: '15+',   label: 'Years of Experience' },
  { icon: Users,        value: '5,000+',label: 'Patients Treated'   },
  { icon: ShieldCheck,  value: '2',     label: 'Convenient Locations'},
];
export function Hero() {
  return (
    <section className="relative overflow-hidden bg-primary-900 text-white min-h-[600px] lg:min-h-[680px] flex items-center">

      {/* Background video */}
      <div className="absolute inset-0">
        <video autoPlay muted loop playsInline className="w-full h-full object-cover">
          <source src="/home.mp4" type="video/mp4" />
        </video>
        {/* Light deep-blue overlay so video shows through */}
        <div className="absolute inset-0 bg-primary-900/60" />
      </div>

      {/* Decorative circle */}
      <div className="absolute right-0 top-0 w-[600px] h-[600px] rounded-full bg-sky-300/10 blur-3xl -translate-y-1/4 translate-x-1/4 pointer-events-none" />
      <div className="absolute right-32 bottom-0 w-48 h-48 rounded-full bg-orange-500/20 blur-2xl pointer-events-none" />

      {/* Content */}
      <div className="container-page relative py-16 lg:py-20 w-full">
        <div className="max-w-3xl">

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {/* Eyebrow */}
            <motion.span variants={fadeUp} className="eyebrow text-sky-300">
              
              {site.tagline}
            </motion.span>

            {/* Heading */}
            <motion.h1
              variants={fadeUp}
              className="mt-4 text-4xl sm:text-5xl lg:text-[3.25rem] font-serif font-black leading-[1.1] text-white tracking-tight text-balance"
            >
              Expert Rheumatological and Arthritis<br className="hidden sm:block" />
              Care in Freehold and Brick
            </motion.h1>

            {/* Sub */}
            <motion.p
              variants={fadeUp}
              className="mt-5 text-lg text-sky-100/80 leading-relaxed max-w-xl"
            >
              Board-certified specialist treating arthritis, joint pain, autoimmune &amp; inflammatory conditions in Brick and Freehold, NJ.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to={site.bookingUrl}
                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-7 py-3.5 rounded-full shadow-lift transition-all duration-200 text-sm"
              >
                <CalendarDays className="w-4 h-4" />
                Book Appointment
              </Link>
              <a
                href={site.phoneHref}
                className="inline-flex items-center gap-2 border-2 border-white/40 hover:border-white text-white font-semibold px-7 py-3.5 rounded-full transition-all duration-200 text-sm hover:bg-white/10"
              >
                <Phone className="w-4 h-4" />
                {site.phone}
              </a>
            </motion.div>

            {/* Trust badges */}
            <motion.div variants={fadeUp} className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm text-sky-100/70">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-sky-300" /> Board-Certified Rheumatologist
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Star className="w-4 h-4 text-sky-300" /> 15+ Years Experience
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-sky-300" /> Brick &amp; Freehold, NJ
              </span>
            </motion.div>
          </motion.div>

          {/* Stats row */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="mt-10 grid grid-cols-3 gap-3 max-w-sm sm:max-w-xl"
          >
            {stats.map((s) => (
              <motion.div
                key={s.label}
                variants={scaleIn}
                className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl px-2 sm:px-4 py-3 sm:py-4 text-center"
              >
                <s.icon className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400 mx-auto mb-1" />
                <div className="text-lg sm:text-2xl font-bold text-white leading-none">{s.value}</div>
                <div className="text-[10px] sm:text-[11px] text-sky-200 mt-1 leading-tight">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Wave */}
      <svg className="absolute bottom-0 left-0 w-full text-white" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true">
        <path fill="currentColor" d="M0,60 L1440,60 L1440,20 C1080,50 720,0 360,30 L0,20 Z" />
      </svg>
    </section>
  );
}
