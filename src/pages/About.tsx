import { motion } from 'framer-motion';
import { fadeUp, staggerContainer, viewport } from '@/animations/variants';
import { Seo } from '@/components/common/Seo';
import { PageHero } from '@/components/common/PageHero';
import { SectionHeading } from '@/components/common/SectionHeading';
import { CTASection } from '@/components/common/CTASection';
import { CheckCircle2 } from 'lucide-react';

const heroImg = 'https://images.pexels.com/photos/5215006/pexels-photo-5215006.jpeg?auto=compress&cs=tinysrgb&h=900&w=1600';
const drImg = 'https://mdabidi.com/wp-content/uploads/2026/04/dr-abidi-1709x2048.webp';

const credentials = [
  'Board-certified rheumatologist',
  '15+ years of experience',
  'Treats rheumatoid arthritis, lupus, gout & more',
  'Joint injections, PRP therapy & pain management',
  'Accepts Medicare and most major insurance plans',
];

export function About() {
  return (
    <>
      <Seo
        title="About Us | MD Abidi Arthritis Institute"
        description="Dr. Mutahir Abidi provides expert arthritis treatment, rheumatology care, and pain management in Brick and Freehold, NJ. Board-certified rheumatologist with 15+ years of experience."
      />
      <PageHero
        eyebrow="About Us"
        title="Leading Arthritis Specialists & Rheumatology Experts in Brick and Freehold, NJ"
        description="Expert arthritis treatment, rheumatology care, and pain management for patients throughout Brick and Freehold, NJ."
        image={heroImg}
        crumbs={[{ label: 'About Us' }]}
      />

      <section className="bg-white">
        <div className="container-page py-16 sm:py-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewport}>
              <motion.img variants={fadeUp} src={drImg} alt="Dr. Mutahir Abidi, board-certified rheumatologist" loading="lazy" className="w-full rounded-3xl shadow-card object-cover object-top aspect-[4/5]" />
            </motion.div>
            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewport} className="space-y-5 text-ink-600 leading-relaxed">
              <motion.p variants={fadeUp}>
                At MD Abidi Arthritis Institute, Dr. Mutahir Abidi provides expert arthritis treatment, rheumatology care, and pain management services for patients throughout Brick and Freehold, NJ. As a board-certified rheumatologist with over 15 years of experience, he specializes in diagnosing and treating arthritis, rheumatoid arthritis, psoriatic arthritis, lupus, gout, osteoporosis, and other autoimmune diseases.
              </motion.p>
              <motion.p variants={fadeUp}>
                Our goal is to help patients find lasting relief from joint pain, inflammation, stiffness, and mobility limitations through personalized treatment plans tailored to their specific needs. We combine advanced rheumatology care with evidence-based treatments, including joint injections, PRP therapy, regenerative medicine, and comprehensive pain management solutions.
              </motion.p>
              <motion.p variants={fadeUp}>
                Whether you are searching for an arthritis doctor, rheumatologist, or joint pain specialist near you, our team is committed to delivering compassionate care that improves mobility, restores function, and enhances quality of life. We accept most major insurance plans, including Medicare, and proudly serve patients across New Jersey.
              </motion.p>
              <motion.ul variants={staggerContainer} className="mt-4 space-y-2.5">
                {credentials.map((c) => (
                  <motion.li key={c} variants={fadeUp} className="flex items-start gap-2.5 text-ink-700">
                    <CheckCircle2 className="w-5 h-5 text-teal-600 mt-0.5 shrink-0" /> {c}
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-ink-50">
        <div className="container-page py-16 sm:py-20">
          <SectionHeading
            eyebrow="Our Team"
            title="Meet Our Arthritis Specialists & Rheumatology Experts"
            description="Our experienced rheumatologists provide expert arthritis treatment, pain management, and autoimmune disease care for patients throughout Brick and Freehold, NJ. We are committed to delivering personalized treatment plans that help patients reduce pain, improve mobility, and achieve long-term joint health."
          />
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport} className="card overflow-hidden">
              <img src={drImg} alt="Dr. Mutahir Abidi" loading="lazy" className="w-full aspect-[4/3] object-cover object-top" />
              <div className="p-6">
                <h3 className="text-xl font-bold text-ink-900">Dr. Mutahir Abidi</h3>
                <p className="text-sm font-medium text-primary-600 mt-1">Board-Certified Rheumatologist &amp; Arthritis Specialist</p>
                <div className="mt-4 space-y-3 text-sm text-ink-600 leading-relaxed">
                  <p>Dr. Mutahir Abidi is a board-certified rheumatologist and arthritis specialist with more than 15 years of experience diagnosing and treating arthritis, joint pain, and autoimmune diseases. Throughout his career, he has helped patients find relief from chronic pain, improve mobility, and better manage conditions that affect their daily lives.</p>
                  <p>He specializes in the treatment of rheumatoid arthritis, psoriatic arthritis, lupus, gout, osteoporosis, and other inflammatory and autoimmune conditions. Using a personalized approach, Dr. Abidi carefully evaluates each patient's symptoms and develops treatment plans tailored to their specific needs and long-term health goals.</p>
                  <p>At MD Abidi Arthritis Institute, Dr. Abidi provides comprehensive rheumatology care, arthritis treatment, and pain management solutions designed to reduce inflammation, protect joint function, and improve overall quality of life. His commitment to compassionate, patient-centered care has made him a trusted choice for patients seeking expert arthritis and autoimmune disease treatment in Brick and Freehold, NJ.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <CTASection
        eyebrow="Schedule a Visit"
        title="Ready to Find Relief from Arthritis & Joint Pain?"
        description="Book an appointment with our rheumatology team in Brick or Freehold, NJ and take the first step toward lasting relief."
      />
    </>
  );
}
