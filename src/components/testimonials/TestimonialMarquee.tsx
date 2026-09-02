import { TestimonialCard } from '@/components/testimonials/TestimonialCard';
import type { Testimonial } from '@/data/testimonials';

interface TestimonialMarqueeProps {
  testimonials: Testimonial[];
  reverse?: boolean;
}

export function TestimonialMarquee({ testimonials, reverse = false }: TestimonialMarqueeProps) {
  const doubled = [...testimonials, ...testimonials];
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 sm:w-32 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 sm:w-32 bg-gradient-to-l from-white to-transparent" />
      <div className={`marquee ${reverse ? 'marquee-reverse' : ''} gap-6 px-3`}>
        {doubled.map((t, i) => (
          <div key={`${t.name}-${i}`} className="w-[340px] sm:w-[380px] shrink-0">
            <TestimonialCard testimonial={t} />
          </div>
        ))}
      </div>
    </div>
  );
}
