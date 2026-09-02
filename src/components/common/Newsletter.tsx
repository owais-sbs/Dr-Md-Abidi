import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send } from 'lucide-react';
import { fadeUp, staggerContainer, viewport } from '@/animations/variants';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setEmail('');
  };

  return (
    <section className="bg-ink-50">
      <div className="container-page py-16 sm:py-20">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="max-w-3xl mx-auto text-center"
        >
          <motion.span variants={fadeUp} className="eyebrow">
            
            Arthritis, Joint Health &amp; Rheumatology Insights
          </motion.span>
          <motion.h2 variants={fadeUp} className="mt-3 text-3xl sm:text-4xl font-bold text-ink-900 text-balance">
            Get Expert Arthritis &amp; Joint Pain Treatment Updates
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 text-lg text-ink-600 leading-relaxed">
            Stay informed with the latest insights on arthritis treatment, rheumatology care, and joint health from our team of specialists in Brick and Freehold, NJ.
          </motion.p>
          <motion.form variants={fadeUp} onSubmit={onSubmit} className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-xl mx-auto">
            <div className="relative w-full sm:flex-1">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                aria-label="Email address"
                className="w-full rounded-full border border-ink-200 bg-white pl-12 pr-4 py-3 text-ink-800 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <button type="submit" className="btn-primary w-full sm:w-auto whitespace-nowrap">
              Subscribe
              <Send className="w-4 h-4" />
            </button>
          </motion.form>
          {submitted && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-sm text-teal-700 bg-teal-50 rounded-full px-4 py-2 inline-block"
            >
              Thank you for subscribing. Watch your inbox for updates from our team.
            </motion.p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
