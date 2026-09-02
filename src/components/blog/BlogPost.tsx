import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarDays, ArrowLeft, User } from 'lucide-react';
import { fadeUp, staggerContainer, viewport } from '@/animations/variants';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import type { BlogPost as BlogPostType } from '@/data/blogPosts';

export function BlogPost({ post }: { post: BlogPostType }) {
  return (
    <>
      <Breadcrumbs items={[{ label: 'Blog', href: '/blog/' }, { label: post.title }]} />
      <article>
        <header className="relative overflow-hidden bg-ink-950 text-white">
          <div className="absolute inset-0 opacity-40" style={{ backgroundImage: `url(${post.featuredImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/70 to-ink-950/40" />
          <div className="container-page relative py-16 sm:py-20">
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="max-w-3xl">
              <motion.div variants={fadeUp} className="flex items-center gap-4 text-sm text-ink-200">
                <span className="inline-flex items-center gap-1.5"><CalendarDays className="w-4 h-4 text-teal-300" />{post.date}</span>
                <span className="inline-flex items-center gap-1.5"><User className="w-4 h-4 text-teal-300" />{post.author}</span>
              </motion.div>
              <motion.h1 variants={fadeUp} className="mt-4 text-3xl sm:text-5xl font-bold text-white text-balance leading-tight">
                {post.title}
              </motion.h1>
            </motion.div>
          </div>
        </header>

        <div className="container-page py-14 sm:py-20">
          <div className="max-w-3xl mx-auto">
            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewport} className="space-y-6">
              {post.content.map((block, i) => {
                if (block.type === 'heading') {
                  return (
                    <motion.h2 key={i} variants={fadeUp} className="text-2xl sm:text-3xl font-bold text-ink-900 pt-4">
                      {block.text}
                    </motion.h2>
                  );
                }
                if (block.type === 'list') {
                  return (
                    <motion.ul key={i} variants={fadeUp} className="space-y-2.5 pl-1">
                      {block.items?.map((item) => (
                        <li key={item} className="flex items-start gap-3 text-ink-700">
                          <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary-500 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </motion.ul>
                  );
                }
                return (
                  <motion.p key={i} variants={fadeUp} className="text-ink-600 leading-relaxed text-lg">
                    {block.text}
                  </motion.p>
                );
              })}
            </motion.div>

            <div className="mt-12 pt-8 border-t border-ink-100">
              <Link to="/blog/" className="inline-flex items-center gap-2 text-primary-700 font-semibold hover:gap-3 transition-all">
                <ArrowLeft className="w-4 h-4" />
                Back to Blog
              </Link>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
