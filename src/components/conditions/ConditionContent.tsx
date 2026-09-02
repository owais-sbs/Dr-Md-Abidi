import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { fadeUp, staggerContainer, viewport } from '@/animations/variants';
import type { Condition } from '@/data/conditions';

export function ConditionContent({ condition }: { condition: Condition }) {
  return (
    <section className="bg-white">
      <div className="container-page py-16 sm:py-20">
        <div className="grid lg:grid-cols-3 gap-10 lg:gap-14">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="lg:col-span-2 space-y-6"
          >
            <motion.h2 variants={fadeUp} className="text-2xl sm:text-3xl font-bold text-ink-900">
              Overview
            </motion.h2>
            {condition.overview.map((p, i) => (
              <motion.p key={i} variants={fadeUp} className="text-ink-600 leading-relaxed">
                {p}
              </motion.p>
            ))}

            {condition.sections.map((s) => (
              <motion.div key={s.heading} variants={fadeUp} className="pt-4">
                <h3 className="text-xl sm:text-2xl font-bold text-ink-900">{s.heading}</h3>
                {s.body.map((b, i) => (
                  <p key={i} className="mt-3 text-ink-600 leading-relaxed">{b}</p>
                ))}
              </motion.div>
            ))}

            {condition.symptoms && (
              <motion.div variants={fadeUp} className="pt-4">
                <h3 className="text-xl sm:text-2xl font-bold text-ink-900">Common Symptoms</h3>
                <ul className="mt-4 space-y-2.5">
                  {condition.symptoms.map((s) => (
                    <li key={s} className="flex items-start gap-2.5 text-ink-700">
                      <CheckCircle2 className="w-5 h-5 text-teal-600 mt-0.5 shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            <motion.div variants={fadeUp} className="pt-4">
              <h3 className="text-xl sm:text-2xl font-bold text-ink-900">Treatment</h3>
              <p className="mt-3 text-ink-600 leading-relaxed">{condition.treatmentIntro}</p>
            </motion.div>
          </motion.div>

          <motion.aside
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="lg:col-span-1"
          >
            <div className="card p-6 sticky top-28">
              <img
                src={condition.heroImage}
                alt={condition.heroImageAlt}
                loading="lazy"
                className="w-full aspect-[4/3] rounded-xl object-cover"
              />
              <h3 className="mt-5 text-lg font-bold text-ink-900">{condition.ctaHeading}</h3>
              <p className="mt-2 text-sm text-ink-600 leading-relaxed">{condition.ctaBody}</p>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
