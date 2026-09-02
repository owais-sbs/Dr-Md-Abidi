import { motion } from 'framer-motion';
import { fadeUp, staggerContainer, viewport } from '@/animations/variants';
import { CalendarDays, Clock, Mail, MapPin, Phone } from 'lucide-react';
import { site } from '@/data/site';

export function ContactInfo() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      className="space-y-6"
    >
      <motion.div variants={fadeUp}>
        <h2 className="text-2xl sm:text-3xl font-bold text-ink-900">Let's Get In Touch With Our Great Of Team Work</h2>
        <p className="mt-3 text-ink-600 leading-relaxed">
          Have questions about arthritis, joint pain, autoimmune diseases, or treatment options? Our experienced rheumatology team is here to help. Contact us today to schedule an appointment and receive personalized care tailored to your needs.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 gap-4">
        <motion.div variants={fadeUp} className="card p-5">
          <div className="flex items-center gap-3">
            <div className="grid place-items-center w-10 h-10 rounded-lg bg-primary-50 text-primary-600">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-ink-900">Our Office</h3>
          </div>
          <div className="mt-3 text-sm text-ink-600 space-y-3">
            {site.locations.map((loc) => (
              <div key={loc.label}>
                <div className="font-semibold text-ink-800">{loc.label}</div>
                {loc.lines.map((l) => (<div key={l}>{l}</div>))}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="card p-5">
          <div className="flex items-center gap-3">
            <div className="grid place-items-center w-10 h-10 rounded-lg bg-teal-50 text-teal-600">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-ink-900">Office Hours</h3>
          </div>
          <p className="mt-3 text-sm text-ink-600">Daily Timings &nbsp;&nbsp;{site.hours}</p>
          <p className="mt-1 text-sm text-ink-500">Monday – Friday</p>
        </motion.div>

        <motion.div variants={fadeUp} className="card p-5">
          <div className="flex items-center gap-3">
            <div className="grid place-items-center w-10 h-10 rounded-lg bg-accent-50 text-accent-600">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-ink-900">Email Official</h3>
          </div>
          <a href={site.emailHref} className="mt-3 block text-sm text-primary-700 hover:text-primary-800">{site.email}</a>
        </motion.div>

        <motion.div variants={fadeUp} className="card p-5">
          <div className="flex items-center gap-3">
            <div className="grid place-items-center w-10 h-10 rounded-lg bg-primary-50 text-primary-600">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-ink-900">Telephone</h3>
          </div>
          <a href={site.phoneHref} className="mt-3 block text-sm text-primary-700 hover:text-primary-800">{site.phone}</a>
        </motion.div>
      </div>

      <motion.div variants={fadeUp} className="rounded-2xl bg-primary-700 text-white p-6">
        <h3 className="text-lg font-bold text-white">Let's Get Talkback From Our Professionals Team</h3>
        <p className="mt-2 text-primary-100 text-sm">Get expert feedback from our professional medical team — contact us now.</p>
        <a href={site.phoneHref} className="mt-4 inline-flex items-center gap-2 btn bg-white text-primary-700 px-5 py-2.5 hover:bg-primary-50 text-sm">
          <CalendarDays className="w-4 h-4" />
          {site.phone}
        </a>
      </motion.div>
    </motion.div>
  );
}
