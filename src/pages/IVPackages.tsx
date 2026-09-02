import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { CheckCircle2, ArrowRight, Star } from 'lucide-react';
import { fadeUp, staggerContainer, staggerFast, scaleIn, viewport } from '@/animations/variants';
import { Seo } from '@/components/common/Seo';
import { PageHero } from '@/components/common/PageHero';
import { CTASection } from '@/components/common/CTASection';
import { getCmsIVPackages, type CmsIVPackage } from '@/data/cms';

const heroImg = 'https://images.pexels.com/photos/3683056/pexels-photo-3683056.jpeg?auto=compress&cs=tinysrgb&h=900&w=1600';

interface Package {
  name: string;
  price: number;
  totalValue?: number;
  badge?: string;
  image: string;
  description: string;
  includes: string[];
  slug: string;
}

const packages: Package[] = [
  {
    name: 'Saline',
    price: 125,
    image: '/saline.png',
    description: 'Fast, effective hydration delivered directly to you with our premium saline solution. The foundation of recovery — pure, simple, effective.',
    includes: [
      '1L Normal Saline (or Lactated Ringers)',
      'IV administration by a registered nurse',
      'Mobile delivery to your location',
    ],
    slug: 'saline',
  },
  {
    name: 'MTO',
    price: 160,
    totalValue: 165,
    image: '/MTO.png',
    description: 'The MTO is a fully customizable package designed to fit your exact needs. Choose 2 add-ons of your choice to create the perfect combination.',
    includes: [
      '1L IV fluid base',
      'Choose any 2 add-ons from our menu',
      'Personalized to your wellness goals',
      'Nurse-administered at your location',
    ],
    slug: 'mto',
  },
  {
    name: 'The Myers',
    price: 200,
    badge: 'Most Popular',
    image: '/Mysers.png',
    description: 'This classic cocktail developed by Dr. John Myers is tailored to replenish vital nutrients and help your body feel its absolute best — revive from illness, stress, or fatigue.',
    includes: [
      '1L IV fluid',
      'Magnesium',
      'B-Complex vitamins',
      'Vitamin B12',
      'Vitamin C',
      'Calcium gluconate',
    ],
    slug: 'the-myers',
  },
  {
    name: 'The After Party',
    price: 175,
    image: '/The after party.png',
    description: 'Detox, rehydrate, and feel revived with The After Party. Replenish vital nutrients lost from alcohol consumption and eliminate that headache and nausea fast.',
    includes: [
      '1L IV fluid',
      'Anti-nausea medication',
      'Anti-inflammatory medication',
      'B-Complex vitamins',
      'Vitamin B12',
    ],
    slug: 'the-after-party',
  },
  {
    name: 'Go With The Flow',
    price: 225,
    totalValue: 275,
    image: '/go with the flow.png',
    description: "It's that time of the month and you're feeling miserable. Life doesn't wait. This package is designed specifically with PMS symptoms in mind to get you feeling better, fast.",
    includes: [
      '1L IV fluid',
      'Magnesium',
      'Anti-nausea medication',
      'Anti-inflammatory medication',
      'B-Complex vitamins',
      'Vitamin B12',
    ],
    slug: 'go-with-the-flow',
  },
  {
    name: 'The Migraine Minimizer',
    price: 225,
    totalValue: 250,
    image: '/migranine minimizer.png',
    description: 'If you suffer from headaches or migraines, this package was designed for you. Instant relief with our specially formulated migraine cocktail.',
    includes: [
      '1L IV fluid',
      'Magnesium',
      'Anti-nausea medication',
      'Anti-inflammatory / pain relief medication',
      'B-Complex vitamins',
    ],
    slug: 'the-migraine-minimizer',
  },
  {
    name: 'The Defensive Line',
    price: 300,
    totalValue: 165,
    image: '/The Defnsive line.png',
    description: 'Myers cocktail with revolutionary NAD+ for optimum performance. Supports brain health, improves insulin resistance, decreases inflammation, and regulates circadian rhythm.',
    includes: [
      '1L IV fluid',
      'Full Myers cocktail',
      'NAD+ (high-dose)',
      'Glutathione',
      'B-Complex & B12',
    ],
    slug: 'the-grenade',
  },
];

export function IVPackages() {
  const [cmsPackages,   setCmsPackages]   = useState<CmsIVPackage[]>([]);
  const [overridePkgs,  setOverridePkgs]  = useState<CmsIVPackage[]>([]);

  function loadCms() {
    const all = getCmsIVPackages().filter(p => p.enabled);
    setOverridePkgs(all.filter(p => p.id.startsWith('static-pkg-')));
    setCmsPackages(all.filter(p => !p.id.startsWith('static-pkg-')));
  }

  useEffect(() => {
    loadCms();
    window.addEventListener('focus', loadCms);
    window.addEventListener('storage', loadCms);
    return () => {
      window.removeEventListener('focus', loadCms);
      window.removeEventListener('storage', loadCms);
    };
  }, []);

  // Merge overrides into static packages — override wins on matching slug
  const displayPackages = packages.map(p => {
    const ov = overridePkgs.find(o => o.slug === p.slug);
    if (!ov) return p;
    return {
      ...p,
      name:       ov.name       || p.name,
      price:      ov.price      || p.price,
      totalValue: ov.totalValue ?? p.totalValue,
      badge:      ov.badge      || p.badge,
      image:      ov.image      || p.image,
      description:ov.description|| p.description,
    };
  });

  return (
    <>
      <Seo
        title="IV Therapy Packages | MD Abidi Arthritis Institute"
        description="Browse our full range of IV therapy packages — from hydration and immune support to migraine relief and NAD+ therapy. Delivered by registered nurses."
      />
      <PageHero
        eyebrow="IV Packages"
        title="Browse Our IV Therapy Packages"
        description="Physician-designed, nurse-administered IV therapy delivered directly to you. Choose the package that fits your wellness goals."
        image={heroImg}
        crumbs={[{ label: 'IV Packages' }]}
      />

      {/* Disclaimer */}
      <div className="bg-sky-50 border-b border-sky-100">
        <div className="container-page py-4">
          <p className="text-xs text-sky-800 text-center leading-relaxed max-w-3xl mx-auto">
            <strong>Disclaimer:</strong> Lactated Ringers may be used as an alternative to Normal Saline due to the ongoing national fluid shortage. Both are commonly used intravenous fluids and are safe and effective for hydration and electrolyte replacement.
          </p>
        </div>
      </div>

      {/* Packages grid */}
      <section className="bg-white">
        <div className="container-page py-16 sm:py-20">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="text-center max-w-2xl mx-auto mb-14"
          >
            <motion.span variants={fadeUp} className="eyebrow">
              
              Our Packages
            </motion.span>
            <motion.h2 variants={fadeUp} className="mt-3 text-3xl sm:text-4xl font-serif font-bold text-ink-900">
              Find the Right IV Package for You
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-4 text-ink-500 leading-relaxed">
              Every package is administered by a licensed registered nurse. We come to your home, hotel, office, or event.
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggerFast}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {displayPackages.map((pkg) => (
              <motion.div
                key={pkg.slug}
                variants={scaleIn}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.2 }}
                className="card overflow-hidden flex flex-col group"
              >
                {/* Image */}
                <div className="relative bg-sky-50 flex items-center justify-center h-48 overflow-hidden">
                  <img
                    src={pkg.image}
                    alt={`${pkg.name} IV therapy package`}
                    className="h-40 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  {pkg.badge && (
                    <span className="absolute top-3 right-3 inline-flex items-center gap-1 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      <Star className="w-3 h-3" />
                      {pkg.badge}
                    </span>
                  )}
                </div>

                {/* Body */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="text-lg font-bold text-ink-900">{pkg.name}</h3>
                    <div className="text-right shrink-0">
                      <div className="text-2xl font-black text-primary-900">${pkg.price}</div>
                      {pkg.totalValue && (
                        <div className="text-xs text-ink-400 line-through">Value ${pkg.totalValue}</div>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-ink-500 leading-relaxed mb-4">{pkg.description}</p>

                  <ul className="space-y-1.5 mb-6">
                    {pkg.includes.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-ink-600">
                        <CheckCircle2 className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto flex flex-col gap-2">
                    <Link
                      to={`/iv-packages/${pkg.slug}/`}
                      className="inline-flex items-center gap-2 w-full justify-center bg-primary-900 hover:bg-primary-800 text-white font-semibold text-sm px-5 py-3 rounded-full transition-all duration-200"
                    >
                      View Details
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      to="/contact-us/"
                      className="inline-flex items-center gap-2 w-full justify-center border-2 border-primary-900 text-primary-900 hover:bg-primary-50 font-semibold text-sm px-5 py-3 rounded-full transition-all duration-200"
                    >
                      Book This Package
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CMS-added packages — dynamic from admin */}
      {cmsPackages.length > 0 && (
        <section className="bg-white">
          <div className="container-page py-10">
            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewport} className="text-center max-w-xl mx-auto mb-10">
              <motion.span variants={fadeUp} className="eyebrow">Additional Packages</motion.span>
              <motion.h2 variants={fadeUp} className="mt-2 text-2xl font-serif font-bold text-ink-900">More IV Packages Available</motion.h2>
            </motion.div>
            <motion.div variants={staggerFast} initial="hidden" whileInView="visible" viewport={viewport} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {cmsPackages.map(pkg => (
                <motion.div key={pkg.id} variants={scaleIn} whileHover={{ y: -5 }} className="card overflow-hidden flex flex-col group">
                  <div className="relative bg-sky-50 flex items-center justify-center h-44 overflow-hidden">
                    {pkg.image && <img src={pkg.image} alt={pkg.name} className="h-36 w-auto object-contain group-hover:scale-105 transition-transform duration-500" loading="lazy" />}
                    {pkg.badge && <span className="absolute top-3 right-3 inline-flex items-center gap-1 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full"><Star className="w-3 h-3"/>{pkg.badge}</span>}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-bold text-ink-900 text-base">{pkg.name}</h3>
                      <div className="text-right shrink-0">
                        <div className="text-xl font-black text-primary-900">${pkg.price}</div>
                        {pkg.totalValue && <div className="text-xs text-ink-400 line-through">Value ${pkg.totalValue}</div>}
                      </div>
                    </div>
                    <p className="text-sm text-ink-500 leading-relaxed mb-4 flex-1">{pkg.tagline || pkg.description}</p>
                    <Link to={`/iv-packages/cms/${pkg.slug}/`} className="inline-flex items-center gap-2 w-full justify-center bg-primary-900 hover:bg-primary-800 text-white font-semibold text-sm px-5 py-3 rounded-full transition-all">
                      View Details <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* How it works */}
      <section className="bg-ink-50">
        <div className="container-page py-16 sm:py-20">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="text-center max-w-xl mx-auto mb-12"
          >
            <motion.span variants={fadeUp} className="eyebrow">
              
              Simple Process
            </motion.span>
            <motion.h2 variants={fadeUp} className="mt-3 text-3xl font-serif font-bold text-ink-900">
              How It Works
            </motion.h2>
          </motion.div>

          <motion.div
            variants={staggerFast}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="grid gap-6 sm:grid-cols-3 max-w-3xl mx-auto"
          >
            {[
              { step: '01', title: 'Choose Your Package', body: 'Browse our packages and pick the one that matches your wellness needs.' },
              { step: '02', title: 'Book Your Appointment', body: 'Contact us to schedule. We come to your home, office, or hotel.' },
              { step: '03', title: 'Feel the Difference', body: 'A licensed nurse administers your IV. Most sessions take 30–60 minutes.' },
            ].map((s) => (
              <motion.div key={s.step} variants={scaleIn} className="card p-6 text-center">
                <div className="text-4xl font-black text-primary-100 leading-none mb-2">{s.step}</div>
                <div className="w-8 h-1 bg-orange-500 rounded-full mx-auto mb-4" />
                <h3 className="font-bold text-ink-900 mb-2">{s.title}</h3>
                <p className="text-sm text-ink-500 leading-relaxed">{s.body}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <CTASection
        eyebrow="Ready to Feel Better?"
        title="Book Your IV Therapy Session Today"
        description="Our registered nurses come directly to you. Fast, safe, and effective IV therapy tailored to your needs."
        primaryLabel="Book an Appointment"
      />
    </>
  );
}
