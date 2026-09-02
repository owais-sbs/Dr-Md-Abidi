import { useRef } from 'react';
import { useInView } from 'framer-motion';
import { viewport } from '@/animations/variants';

export function useScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, viewport);
  return { ref, inView };
}
