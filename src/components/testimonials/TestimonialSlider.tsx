import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TestimonialCard } from '@/components/testimonials/TestimonialCard';
import { testimonials } from '@/data/testimonials';
import { fadeUp, viewport } from '@/animations/variants';

export function TestimonialSlider() {
  const [index, setIndex] = useState(0);
  const count = testimonials.length;
  const prev = () => setIndex((i) => (i - 1 + count) % count);
  const next = () => setIndex((i) => (i + 1) % count);

  return (
    <div>
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <TestimonialCard testimonial={testimonials[index]} />
          </motion.div>
        </AnimatePresence>
      </div>

      <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport} className="mt-6 flex items-center justify-center gap-4">
        <button onClick={prev} aria-label="Previous testimonial" className="grid place-items-center w-10 h-10 rounded-full bg-white border border-ink-200 text-ink-700 hover:bg-primary-50 hover:text-primary-700 hover:border-primary-300">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to testimonial ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-2.5 rounded-full transition-all ${i === index ? 'w-8 bg-primary-600' : 'w-2.5 bg-ink-200 hover:bg-ink-300'}`}
            />
          ))}
        </div>
        <button onClick={next} aria-label="Next testimonial" className="grid place-items-center w-10 h-10 rounded-full bg-white border border-ink-200 text-ink-700 hover:bg-primary-50 hover:text-primary-700 hover:border-primary-300">
          <ChevronRight className="w-5 h-5" />
        </button>
      </motion.div>
    </div>
  );
}
