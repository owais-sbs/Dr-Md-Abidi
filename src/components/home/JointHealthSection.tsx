import { motion } from 'framer-motion';
import { fadeUp, fadeDown, scaleInBounce, staggerContainer, staggerFast, viewport } from '@/animations/variants';
import { HeartPulse, ShieldCheck, Activity, Footprints } from 'lucide-react';

const features = [
  {
    icon: HeartPulse,
    title: 'Personalized Arthritis & Autoimmune Disease Care',
    body: 'Treatment plans tailored to your specific condition, symptoms, and long-term health goals.',
  },
  {
    icon: ShieldCheck,
    title: 'Effective Pain Management & Joint Pain Relief',
    body: 'Advanced therapies that reduce inflammation and relieve pain so you can return to daily activities.',
  },
  {
    icon: Activity,
    title: 'Prevent Long-Term Joint Damage',
    body: 'Early, expert intervention protects your joints and prevents irreversible damage from ongoing inflammation.',
  },
  {
    icon: Footprints,
    title: 'Restore Mobility & Live More Comfortably',
    body: 'Comprehensive care designed to improve movement, restore function, and enhance your quality of life.',
  },
];

export function JointHealthSection() {
  return (
    <section className="bg-white overflow-hidden">
      <div className="container-page py-12 sm:py-20">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewport} className="max-w-2xl mx-auto text-center">
          <motion.span variants={fadeDown} className="eyebrow">Why Arthritis &amp; Joint Health Matters</motion.span>
          <motion.h2 variants={fadeUp} className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-ink-900 text-balance">Don't Delay Arthritis &amp; Joint Pain Treatment</motion.h2>
          <motion.p variants={fadeUp} className="mt-4 text-base sm:text-lg text-ink-600 leading-relaxed">Untreated arthritis and autoimmune disease can cause lasting joint damage and reduce your mobility. Early, expert care protects your joints, relieves pain, and helps you stay active.</motion.p>
        </motion.div>
        <motion.div variants={staggerFast} initial="hidden" whileInView="visible" viewport={viewport} className="mt-10 grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div key={f.title} variants={scaleInBounce} custom={i} whileHover={{ y: -6 }} className="card p-5 sm:p-6 cursor-default transition-shadow">
              <div className="grid place-items-center w-11 h-11 rounded-xl bg-primary-50 text-primary-600 mb-4">
                <f.icon className="w-5 h-5" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-ink-900 leading-snug">{f.title}</h3>
              <p className="mt-2 text-xs sm:text-sm text-ink-600 leading-relaxed">{f.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
