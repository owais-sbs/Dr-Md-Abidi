import { Seo } from '@/components/common/Seo';
import { PageHero } from '@/components/common/PageHero';
import { SectionHeading } from '@/components/common/SectionHeading';
import { TestimonialSlider } from '@/components/testimonials/TestimonialSlider';
import { TestimonialMarquee } from '@/components/testimonials/TestimonialMarquee';
import { CTASection } from '@/components/common/CTASection';
import { testimonials } from '@/data/testimonials';

const heroImg = 'https://images.pexels.com/photos/6129035/pexels-photo-6129035.jpeg?auto=compress&cs=tinysrgb&h=900&w=1600';

export function HappyPatients() {
  return (
    <>
      <Seo
        title="Happy Patients | MD Abidi Arthritis Institute"
        description="Read patient success stories from MD Abidi Arthritis Institute. Trusted arthritis specialists and rheumatologists in Brick and Freehold, NJ."
      />
      <PageHero
        eyebrow="Patient Success Stories"
        title="Trusted Arthritis Specialists & Rheumatologists in Brick and Freehold, NJ"
        description="Our patients share their experience working with our rheumatology team to find relief from arthritis, joint pain, and autoimmune disease."
        image={heroImg}
        crumbs={[{ label: 'Happy Patients' }]}
      />

      <section className="bg-white">
        <div className="container-page py-16 sm:py-20">
          <SectionHeading eyebrow="Featured Story" title="What Our Patients Are Saying" />
          <div className="mt-12 max-w-3xl mx-auto">
            <TestimonialSlider />
          </div>
        </div>
      </section>

      <section className="bg-ink-50 overflow-hidden">
        <div className="container-page py-16 sm:py-20">
          <SectionHeading eyebrow="All Stories" title="More Patient Success Stories" />
        </div>
        <div className="mt-4 pb-16 sm:pb-20">
          <TestimonialMarquee testimonials={testimonials} reverse />
        </div>
      </section>

      <CTASection
        eyebrow="Join Our Patients"
        title="Ready to Start Your Journey to Relief?"
        description="Schedule an appointment with our rheumatology team and find out why patients across Brick and Freehold, NJ trust MD Abidi Arthritis Institute."
      />
    </>
  );
}
