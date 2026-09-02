import { Seo } from '@/components/common/Seo';
import { Hero } from '@/components/home/Hero';
import { AboutSection } from '@/components/home/AboutSection';
import { ConditionsSection } from '@/components/home/ConditionsSection';
import { SpecialistCTA } from '@/components/home/SpecialistCTA';
import { JointHealthSection } from '@/components/home/JointHealthSection';
import { Newsletter } from '@/components/common/Newsletter';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { BlogSection } from '@/components/home/BlogSection';
import { ContactCTA } from '@/components/home/ContactCTA';
import { BookingWidget } from '@/components/common/BookingWidget';

export function Home() {
  return (
    <>
      <Seo
        title="MD Abidi Arthritis Institute — Expert Rheumatology Care in Brick & Freehold, NJ"
        description="Diagnosis and treatment for arthritis, joint pain, autoimmune disease, and inflammatory conditions. Trusted rheumatology specialists serving Brick and Freehold, NJ."
      />
      <Hero />
      <AboutSection />
      <ConditionsSection />
      <SpecialistCTA />
      <JointHealthSection />
      <TestimonialsSection />
      <Newsletter />
      <BlogSection />
      <ContactCTA />
      <BookingWidget />
    </>
  );
}
