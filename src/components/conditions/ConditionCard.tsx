import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { fadeUp, viewport, hoverLift } from '@/animations/variants';
import type { Condition } from '@/data/conditions';

export function ConditionCard({ condition }: { condition: Condition }) {
  return (
    <motion.article
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      whileHover={hoverLift}
      className="group card overflow-hidden flex flex-col hover:shadow-card transition-shadow duration-300"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={condition.cardImage}
          alt={condition.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/50 via-transparent to-transparent" />
        <span className="absolute top-3 left-3 rounded-full bg-white/90 backdrop-blur px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary-700 shadow-sm">
          {condition.heroEyebrow}
        </span>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-ink-900 group-hover:text-primary-700 transition-colors">{condition.title}</h3>
        <p className="mt-2 text-sm text-ink-600 leading-relaxed line-clamp-3">{condition.shortDescription}</p>
        <Link
          to={condition.href}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 group-hover:gap-2.5 transition-all"
        >
          Learn More <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.article>
  );
}
