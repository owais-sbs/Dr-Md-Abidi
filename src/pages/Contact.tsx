import { motion } from 'framer-motion';
import { Seo } from '@/components/common/Seo';
import { PageHero } from '@/components/common/PageHero';
import { ContactInfo } from '@/components/contact/ContactInfo';
import { ContactForm } from '@/components/contact/ContactForm';
import { site } from '@/data/site';
import { fadeUp, staggerContainer, viewport } from '@/animations/variants';

const heroImg = 'https://images.pexels.com/photos/6129444/pexels-photo-6129444.jpeg?auto=compress&cs=tinysrgb&h=900&w=1600';

export function Contact() {
  return (
    <>
      <Seo
        title="Contact Us | MD Abidi Arthritis Institute"
        description="Contact MD Abidi Arthritis Institute in Brick and Freehold, NJ. Call 732-840-8402 or email admin@mdabidi.com to schedule an appointment."
      />
      <PageHero
        eyebrow="Get In Touch"
        title="Contact Us"
        description="Have questions about arthritis, joint pain, autoimmune diseases, or treatment options? Our experienced rheumatology team is here to help. Contact us today to schedule an appointment and receive personalized care tailored to your needs."
        image={heroImg}
        crumbs={[{ label: 'Contact Us' }]}
      />

      <section className="bg-white">
        <div className="container-page py-16 sm:py-20">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14">
            <ContactInfo />
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport}>
              <ContactForm />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-ink-50">
        <div className="container-page py-16 sm:py-20">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewport} className="grid gap-6 md:grid-cols-2">
            {site.locations.map((loc) => (
              <motion.div key={loc.label} variants={fadeUp} className="card overflow-hidden">
                <iframe
                  title={`Map of ${loc.label} office`}
                  src={`https://www.google.com/maps?q=${encodeURIComponent(loc.mapQuery)}&output=embed`}
                  width="100%"
                  height="320"
                  loading="lazy"
                  className="border-0"
                />
                <div className="p-5">
                  <h3 className="text-lg font-bold text-ink-900">{loc.label} Office</h3>
                  {loc.lines.map((l) => (<p key={l} className="text-sm text-ink-600">{l}</p>))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}
