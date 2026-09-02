import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { fadeUp, slideRight, slideLeft, scaleInBounce, staggerContainer, viewport } from '@/animations/variants';
import { SectionHeading } from '@/components/common/SectionHeading';

const aboutImg =
  'https://images.pexels.com/photos/5215006/pexels-photo-5215006.jpeg?auto=compress&cs=tinysrgb&h=700&w=900';
const badgeImg =
  'https://mdabidi.com/wp-content/uploads/2026/04/dr-abidi-1709x2048.webp';

const points = [
  'Rheumatoid arthritis, psoriatic arthritis, lupus & gout',
  'Autoimmune disease & inflammatory condition care',
  'Joint injections, PRP therapy & pain management',
  'Personalized treatment plans & Medicare accepted',
];

export function AboutSection() {
  return (
    <section className="bg-white overflow-hidden">
      <div className="container-page py-12 sm:py-20">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Image column */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="relative pt-6 pb-8 px-4 sm:px-0"
          >
            <motion.div variants={slideRight} className="relative rounded-3xl overflow-hidden shadow-card">
              <img
                src={aboutImg}
                alt="Rheumatology care at MD Abidi Arthritis Institute"
                loading="lazy"
                className="w-full aspect-[4/3] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-900/20 to-transparent pointer-events-none" />
            </motion.div>

            {/* Doctor badge — tucked inside on mobile */}
            <motion.div
              variants={scaleInBounce}
              className="absolute bottom-0 right-4 sm:-bottom-4 sm:right-6 w-28 sm:w-40 rounded-2xl overflow-hidden shadow-lift border-4 border-white"
            >
              <img
                src={badgeImg}
                alt="Dr. Mutahir Abidi — Board-Certified Rheumatologist"
                loading="lazy"
                className="w-full aspect-[3/4] object-cover object-top"
              />
            </motion.div>

            {/* Floating stat pill */}
            <motion.div
              variants={scaleInBounce}
              className="absolute top-0 left-4 sm:-top-4 sm:left-4 bg-primary-900 text-white rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 shadow-lift"
            >
              <div className="text-xl sm:text-2xl font-bold leading-none">15+</div>
              <div className="text-xs text-sky-200 mt-0.5">Years of Expertise</div>
            </motion.div>
          </motion.div>

          {/* Text column */}
          <motion.div variants={slideLeft} initial="hidden" whileInView="visible" viewport={viewport}>
            <SectionHeading
              align="left"
              eyebrow="About Us"
              title="Helping Patients Find Relief from Arthritis, Joint Pain & Autoimmune Diseases"
            />
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              className="mt-5 space-y-4 text-ink-600 leading-relaxed text-sm sm:text-base"
            >
              <motion.p variants={fadeUp}>
                At MD Abidi Arthritis Institute, we specialize in the diagnosis and treatment of arthritis, joint pain, autoimmune diseases, and inflammatory conditions. Led by Dr. Mutahir Abidi, a board-certified rheumatologist, our practice provides personalized care for patients in Brick and Freehold, NJ.
              </motion.p>
              <motion.p variants={fadeUp}>
                We treat rheumatoid arthritis, psoriatic arthritis, lupus, gout, osteoporosis, and other autoimmune disorders helping you find lasting relief and restore your quality of life.
              </motion.p>
            </motion.div>

            <motion.ul
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5"
            >
              {points.map((p) => (
                <motion.li key={p} variants={fadeUp} className="flex items-start gap-2 text-sm text-ink-700">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
                  {p}
                </motion.li>
              ))}
            </motion.ul>

            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport} className="mt-7">
              <Link to="/about-us/" className="inline-flex items-center gap-2 bg-primary-900 hover:bg-primary-800 text-white font-semibold px-6 py-3 rounded-full text-sm transition-all">
                Learn More About Us
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
