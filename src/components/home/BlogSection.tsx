import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { staggerContainer, staggerFast, fadeUp, fadeDown, scaleIn, viewport } from '@/animations/variants';
import { SectionHeading } from '@/components/common/SectionHeading';
import { BlogCard } from '@/components/blog/BlogCard';
import { blogPosts } from '@/data/blogPosts';

export function BlogSection() {
  return (
    <section className="bg-ink-50 overflow-hidden">
      <div className="container-page py-20">

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <motion.div variants={fadeDown}>
            <SectionHeading
              eyebrow="Now Reading"
              title="Our Blog Content"
              description="Helpful insights on arthritis, rheumatology, and joint health from our team of specialists."
            />
          </motion.div>
        </motion.div>

        <motion.div
          variants={staggerFast}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mt-12 grid gap-6 md:grid-cols-3"
        >
          {blogPosts.map((p, i) => (
            <motion.div
              key={p.slug}
              variants={scaleIn}
              custom={i}
              whileHover={{ y: -6, boxShadow: '0 20px 48px -12px rgba(20,38,87,0.18)' }}
              transition={{ duration: 0.25 }}
            >
              <BlogCard post={p} />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mt-10 text-center"
        >
          <Link to="/blog/" className="btn-primary">
            View All Articles
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
