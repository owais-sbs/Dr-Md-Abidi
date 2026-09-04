import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { CheckCircle2, ArrowRight, Star } from 'lucide-react';
import { fadeUp, staggerContainer, staggerFast, scaleIn, viewport } from '@/animations/variants';
import { Seo } from '@/components/common/Seo';
import { PageHero } from '@/components/common/PageHero';
import { CTASection } from '@/components/common/CTASection';
import { IV_PACKAGES } from '@/data/ivPackages';
import { getCmsIVPackages, type CmsIVPackage } from '@/data/cms';
import { useCmsRealtime } from '@/lib/cmsLive';

const heroImg = 'https://images.pexels.com/photos/3683056/pexels-photo-3683056.jpeg?auto=compress&cs=tinysrgb&h=900&w=1600';

export function IVPackages() {
  const [overridePkgs, setOverridePkgs] = useState<CmsIVPackage[]>([]);

  async function loadCms() {
    try {
      const all = (await getCmsIVPackages()).filter(p => p.enabled);
      setOverridePkgs(all.filter(p => p.id.startsWith('static-pkg-')));
    } catch {
      setOverridePkgs([]);
    }
  }

  useEffect(() => {
    loadCms();
  }, []);
  useCmsRealtime(loadCms);

  const displayPackages = IV_PACKAGES.map(p => {
    const ov = overridePkgs.find(o => o.slug === p.slug || o.id === `static-pkg-${p.slug}`);
    if (!ov) return p;
    return {
      ...p,
      slug: ov.slug || p.slug,
      name: ov.name || p.name,
      price: ov.price || p.price,
      totalValue: ov.totalValue ?? p.totalValue,
      badge: ov.badge || p.badge,
      image: ov.image || p.image,
      description: ov.description || p.description,
    };
  });

  return (
    <>
      <Seo
        title="IV Therapy Packages | MD Abidi Arthritis Institute"
        description="Browse our full range of IV therapy packages - from hydration and immune support to migraine relief and NAD+ therapy. Delivered by registered nurses."
      />
      <PageHero
        eyebrow="IV Packages"
        title="Browse Our IV Therapy Packages"
        description="Physician-designed, nurse-administered IV therapy delivered directly to you. Choose the package that fits your wellness goals."
        image={heroImg}
        crumbs={[{ label: 'IV Packages' }]}
      />

      <div className="bg-sky-50 border-b border-sky-100">
        <div className="container-page py-4">
          <p className="text-xs text-sky-800 text-center leading-relaxed max-w-3xl mx-auto">
            <strong>Disclaimer:</strong> Lactated Ringers may be used as an alternative to Normal Saline due to the ongoing national fluid shortage. Both are commonly used intravenous fluids and are safe and effective for hydration and electrolyte replacement.
          </p>
        </div>
      </div>

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
                whileHover={{ y: -8, boxShadow: '0 24px 60px -18px rgba(20,38,87,0.18)' }}
                transition={{ duration: 0.25 }}
                className="group"
              >
                <div className="card overflow-hidden h-full flex flex-col">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={pkg.image}
                      alt={pkg.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-950/60 via-transparent to-transparent" />
                    {pkg.badge && (
                      <span className="absolute top-4 left-4 inline-flex items-center gap-1 rounded-full bg-white/90 backdrop-blur px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary-700 shadow-sm">
                        <Star className="w-3 h-3 fill-current" />
                        {pkg.badge}
                      </span>
                    )}
                    <div className="absolute bottom-4 left-4 text-white">
                      <div className="text-2xl font-black">${pkg.price}</div>
                      {pkg.totalValue && (
                        <div className="text-xs text-white/80 line-through">Value ${pkg.totalValue}</div>
                      )}
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-lg font-bold text-ink-900 group-hover:text-primary-700 transition-colors">
                      {pkg.name}
                    </h3>
                    <p className="mt-2 text-sm text-ink-600 leading-relaxed line-clamp-3">
                      {pkg.description}
                    </p>
                    <ul className="mt-4 space-y-2">
                      {pkg.includes.slice(0, 4).map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-ink-600">
                          <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      to={`/book-iv/?package=${pkg.slug}`}
                      className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 group-hover:gap-2.5 transition-all"
                    >
                      Book This Package <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <CTASection
        title="Need help choosing the right package?"
        description="Our team can help you select the most appropriate IV therapy option based on your goals and symptoms."
        buttonText="Contact Us"
        buttonLink="/contact-us/"
      />
    </>
  );
}
