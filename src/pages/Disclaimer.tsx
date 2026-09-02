import { Seo } from '@/components/common/Seo';
import { PageHero } from '@/components/common/PageHero';
import { site } from '@/data/site';

const heroImg = 'https://images.pexels.com/photos/7659869/pexels-photo-7659869.jpeg?auto=compress&cs=tinysrgb&h=900&w=1600';

export function Disclaimer() {
  return (
    <>
      <Seo title="Disclaimer | MD Abidi Arthritis Institute" description="Disclaimer for the MD Abidi Arthritis Institute website." />
      <PageHero
        eyebrow="Legal"
        title="Disclaimer"
        description="The information provided on this website is for general informational purposes only."
        image={heroImg}
        crumbs={[{ label: 'Disclaimer' }]}
      />
      <section className="bg-white">
        <div className="container-page py-16 sm:py-20">
          <div className="prose-legal max-w-3xl mx-auto space-y-6 text-ink-600 leading-relaxed">
            <p>The information provided on this website is for general informational and educational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment.</p>
            <p>Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read on this website.</p>
            <p>MD Abidi Arthritis Institute does not recommend or endorse any specific tests, physicians, products, procedures, opinions, or other information that may be mentioned on this website. Reliance on any information provided by this website is solely at your own risk.</p>
            <p>The content on this website is not intended to be a substitute for professional medical advice, diagnosis, or treatment. If you think you may have a medical emergency, call your doctor or 911 immediately.</p>
            <p>For appointments or medical questions, please contact our office directly at {site.phone} or {site.email}.</p>
          </div>
        </div>
      </section>
    </>
  );
}
