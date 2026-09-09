import { Seo } from '@/components/common/Seo';
import { PageHero } from '@/components/common/PageHero';
import { site } from '@/data/site';

const heroImg = 'https://images.pexels.com/photos/6129444/pexels-photo-6129444.jpeg?auto=compress&cs=tinysrgb&h=900&w=1600';

export function TermsConditions() {
  return (
    <>
      <Seo
        title="Terms & Conditions | MD Abidi Arthritis Institute"
        description="Terms and conditions for using the MD Abidi Arthritis Institute website and services."
      />
      <PageHero
        eyebrow="Legal"
        title="Terms & Conditions"
        description="Please read these terms carefully before using our website or requesting services."
        image={heroImg}
        crumbs={[{ label: 'Terms & Conditions' }]}
      />
      <section className="bg-white">
        <div className="container-page py-16 sm:py-20">
          <div className="prose-legal max-w-3xl mx-auto space-y-6 text-ink-600 leading-relaxed">
            <p>
              By accessing or using the MD Abidi Arthritis Institute website, booking forms, or related digital services,
              you agree to these Terms &amp; Conditions. If you do not agree, please do not use this website.
            </p>

            <h2 className="text-xl font-bold text-ink-900 pt-2">Medical Disclaimer</h2>
            <p>
              Content on this website is for general educational purposes only and is not a substitute for professional
              medical advice, diagnosis, or treatment. Always seek the advice of a qualified healthcare provider with any
              questions you may have regarding a medical condition.
            </p>

            <h2 className="text-xl font-bold text-ink-900 pt-2">Appointments &amp; IV Therapy Requests</h2>
            <p>
              Submitting an appointment or IV therapy request does not guarantee availability or approval. Requests are
              reviewed by the clinic and may be approved, declined, or rescheduled based on clinical judgment and capacity.
            </p>

            <h2 className="text-xl font-bold text-ink-900 pt-2">User Responsibilities</h2>
            <p>
              You agree to provide accurate information in forms and communications. You must not misuse the website,
              attempt unauthorized access, or submit harmful or unlawful content.
            </p>

            <h2 className="text-xl font-bold text-ink-900 pt-2">Privacy</h2>
            <p>
              Personal information collected through this website is handled according to our Privacy Policy. By using
              our forms, you acknowledge that policy.
            </p>

            <h2 className="text-xl font-bold text-ink-900 pt-2">Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, MD Abidi Arthritis Institute is not liable for damages arising from
              use of this website or reliance on its content. Website availability may be interrupted for maintenance or
              reasons beyond our control.
            </p>

            <h2 className="text-xl font-bold text-ink-900 pt-2">Contact</h2>
            <p>
              Questions about these terms can be sent to {site.email} or {site.phone}.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
