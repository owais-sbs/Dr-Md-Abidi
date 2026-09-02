import { motion } from 'framer-motion';
import { fadeUp, staggerContainer, viewport } from '@/animations/variants';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  light?: boolean;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  light = false,
}: SectionHeadingProps) {
  const alignClass = align === 'center' ? 'items-center text-center mx-auto' : 'items-start text-left';
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      className={`flex flex-col ${alignClass} max-w-2xl ${align === 'center' ? 'mx-auto' : ''}`}
    >
      {eyebrow && (
        <motion.span variants={fadeUp} className={`eyebrow ${light ? 'text-teal-300' : ''}`}>
          {eyebrow}
        </motion.span>
      )}
      <motion.h2
        variants={fadeUp}
        className={`mt-3 text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-balance leading-tight ${light ? 'text-white' : 'text-ink-900'}`}
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p
          variants={fadeUp}
          className={`mt-4 text-base sm:text-lg leading-relaxed ${light ? 'text-ink-200' : 'text-ink-600'}`}
        >
          {description}
        </motion.p>
      )}
    </motion.div>
  );
}
