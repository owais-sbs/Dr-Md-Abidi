import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CalendarDays } from 'lucide-react';
import { fadeUp, viewport, hoverLift } from '@/animations/variants';
import type { BlogPost } from '@/data/blogPosts';

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <motion.article
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      whileHover={hoverLift}
      className="group card overflow-hidden flex flex-col hover:shadow-card transition-shadow duration-300"
    >
      <Link to={`/blog/${post.slug}/`} className="relative aspect-[16/9] overflow-hidden block">
        <img
          src={post.featuredImage}
          alt={post.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </Link>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 text-xs text-ink-500">
          <CalendarDays className="w-4 h-4 text-primary-500" />
          {post.date}
        </div>
        <h3 className="mt-3 text-lg font-bold text-ink-900 leading-snug">
          <Link to={`/blog/${post.slug}/`} className="group-hover:text-primary-700 transition-colors">{post.title}</Link>
        </h3>
        <p className="mt-2 text-sm text-ink-600 leading-relaxed line-clamp-3">{post.excerpt}</p>
        <Link
          to={`/blog/${post.slug}/`}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 group-hover:gap-2.5 transition-all"
        >
          Read More <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.article>
  );
}
