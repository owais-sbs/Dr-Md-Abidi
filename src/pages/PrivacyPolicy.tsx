import { Seo } from '@/components/common/Seo';
import { PageHero } from '@/components/common/PageHero';
import { site } from '@/data/site';

const heroImg = 'https://images.pexels.com/photos/6129444/pexels-photo-6129444.jpeg?auto=compress&cs=tinysrgb&h=900&w=1600';

export function PrivacyPolicy() {
  return (
    <>
      <Seo title="Privacy Policy | MD Abidi Arthritis Institute" description="Privacy policy for the MD Abidi Arthritis Institute website." />
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        description="How MD Abidi Arthritis Institute protects and handles your personal information."
        image={heroImg}
        crumbs={[{ label: 'Privacy Policy' }]}
      />
      <section className="bg-white">
        <div className="container-page py-16 sm:py-20">
          <div className="prose-legal max-w-3xl mx-auto space-y-6 text-ink-600 leading-relaxed">
            <p>At MD Abidi Arthritis Institute, we respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard information when you visit our website.</p>

            <h2 className="text-xl font-bold text-ink-900 pt-2">Information We Collect</h2>
            <p>We may collect information you voluntarily provide, such as your name, email address, phone number, and any details you submit through our contact or appointment forms. We may also collect non-personal information such as browser type and pages visited to help improve our website.</p>

            <h2 className="text-xl font-bold text-ink-900 pt-2">How We Use Your Information</h2>
            <p>We use the information you provide to respond to inquiries, schedule appointments, and improve the content and functionality of our website. We do not sell or rent your personal information to third parties.</p>

            <h2 className="text-xl font-bold text-ink-900 pt-2">Data Security</h2>
            <p>We take reasonable measures to protect your personal information from unauthorized access, use, or disclosure. However, no method of transmission over the internet is completely secure, and we cannot guarantee absolute security.</p>

            <h2 className="text-xl font-bold text-ink-900 pt-2">Third-Party Links</h2>
            <p>Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of those sites. We encourage you to review the privacy policies of any third-party sites you visit.</p>

            <h2 className="text-xl font-bold text-ink-900 pt-2">Your Consent</h2>
            <p>By using our website, you consent to the terms of this Privacy Policy. If you have questions about this policy or how your information is handled, please contact us at {site.email} or {site.phone}.</p>

            <h2 className="text-xl font-bold text-ink-900 pt-2">Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date.</p>
          </div>
        </div>
      </section>
    </>
  );
}
