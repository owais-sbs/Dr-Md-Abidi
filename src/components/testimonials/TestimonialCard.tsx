import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';
import { fadeUp, viewport } from '@/animations/variants';
import type { Testimonial } from '@/data/testimonials';

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <motion.figure
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      className="card p-6 sm:p-7 flex flex-col h-full"
    >
      <Quote className="w-9 h-9 text-primary-200" />
      <div className="mt-3 flex gap-0.5">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-accent-500 text-accent-500" />
        ))}
      </div>
      <blockquote className="mt-4 text-ink-700 leading-relaxed flex-1">“{testimonial.quote}”</blockquote>
      <figcaption className="mt-6 flex items-center gap-3">
        <img
          src={testimonial.image}
          alt={testimonial.name}
          loading="lazy"
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <div className="font-semibold text-ink-900">{testimonial.name}</div>
          <div className="text-sm text-ink-500">{testimonial.location}</div>
        </div>
      </figcaption>
    </motion.figure>
  );
}
