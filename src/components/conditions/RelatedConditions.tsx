import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { fadeUp, staggerContainer, viewport } from '@/animations/variants';
import { SectionHeading } from '@/components/common/SectionHeading';
import { ConditionCard } from '@/components/conditions/ConditionCard';
import type { Condition } from '@/data/conditions';

export function RelatedConditions({ conditions, currentSlug }: { conditions: Condition[]; currentSlug: string }) {
  const related = conditions.filter((c) => c.slug !== currentSlug).slice(0, 3);
  if (related.length === 0) return null;
  return (
    <section className="bg-ink-50">
      <div className="container-page py-16 sm:py-20">
        <SectionHeading eyebrow="Related Conditions" title="Explore More Conditions We Treat" />
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mt-12 grid gap-6 md:grid-cols-3"
        >
          {related.map((c) => (
            <ConditionCard key={c.slug} condition={c} />
          ))}
        </motion.div>
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport} className="mt-10 text-center">
          <Link to="/conditions-we-treat/" className="btn-primary">
            View All Conditions
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
