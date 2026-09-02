import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fadeUp, fadeDown, staggerContainer, viewport } from '@/animations/variants';
import { SectionHeading } from '@/components/common/SectionHeading';
import { TestimonialMarquee } from '@/components/testimonials/TestimonialMarquee';
import { testimonials } from '@/data/testimonials';

export function TestimonialsSection() {
  return (
    <section className="bg-white overflow-hidden">
      <div className="container-page py-20">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <motion.div variants={fadeDown}>
            <SectionHeading
              eyebrow="Patient Success Stories"
              title="Trusted Arthritis Specialists & Rheumatologists in Brick and Freehold, NJ"
              description="Our patients share their experience working with our rheumatology team to find relief from arthritis, joint pain, and autoimmune disease."
            />
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true, amount: 0.1 }}
        className="mt-4"
      >
        <TestimonialMarquee testimonials={testimonials} />
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        className="mt-10 text-center container-page pb-20"
      >
        <Link to="/happy-patients/" className="btn-ghost">
          Read More Patient Stories
        </Link>
      </motion.div>
    </section>
  );
}
