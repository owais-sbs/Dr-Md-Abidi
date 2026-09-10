import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { CheckCircle2, ArrowRight, Star, Plus, Tag } from 'lucide-react';
import { fadeUp, staggerContainer, staggerFast, scaleIn, viewport } from '@/animations/variants';
import { Seo } from '@/components/common/Seo';
import { PageHero } from '@/components/common/PageHero';
import { CTASection } from '@/components/common/CTASection';
import { IV_PACKAGES, IV_ADD_ONS, IV_PACKAGE_DEALS } from '@/data/ivPackages';
import { getCmsIVPackages, type CmsIVPackage } from '@/data/cms';
import { useCmsRealtime } from '@/lib/cmsLive';

const heroImg = 'https://images.pexels.com/photos/3683056/pexels-photo-3683056.jpeg?auto=compress&cs=tinysrgb&h=900&w=1600';

export function IVPackages() {
  const [overridePkgs, setOverridePkgs] = useState<CmsIVPackage[]>([]);

  async function loadCms() {
    try {
      const all = await getCmsIVPackages();
      setOverridePkgs(all.filter(p => p.id.startsWith('static-pkg-')));
    } catch {
      setOverridePkgs([]);
    }
  }

  useEffect(() => {
    loadCms();
  }, []);
  useCmsRealtime(loadCms);

  const hiddenSlugs = new Set(
    overridePkgs.filter(p => !p.enabled || p.tagline === '__DELETED__').map(p => p.slug),
  );

  const displayPackages = IV_PACKAGES
    .filter(p => !hiddenSlugs.has(p.slug))
    .map(p => {
    const ov = overridePkgs.find(o => o.enabled && (o.slug === p.slug || o.id === `static-pkg-${p.slug}`));
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
        description="Browse our official IV therapy packages - Power-Up, Immunify, Go With The Flow, Fountain Of Youth, Myers Cocktail, 1,000 cc Saline, and specialized add-ons. Administered by registered nurses."
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
            <strong>Disclaimer:</strong> All IV Hydration infusions are strictly out of pocket and will not be covered by insurance. Lactated Ringers may be used as an alternative to Normal Saline due to the ongoing national fluid shortage. Both are commonly used intravenous fluids and are safe and effective for hydration and electrolyte replacement.
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
            animate="visible"
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {displayPackages.map((pkg) => (
              <motion.div
                key={pkg.slug}
                variants={scaleIn}
                className="group h-full"
              >
                <div className="card h-full flex flex-col hover:shadow-card transition-shadow">
                  <div className="relative aspect-[4/3] overflow-hidden bg-sky-50 flex items-center justify-center"
                    style={{ background: 'radial-gradient(ellipse at 60% 40%, #dbeafe 0%, #eff6ff 50%, #f0f9ff 100%)' }}>
                    <img
                      src={pkg.image}
                      alt={pkg.name}
                      loading="lazy"
                      className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                    />
                    {pkg.badge && (
                      <span className="absolute top-4 left-4 inline-flex items-center gap-1 rounded-full bg-white/90 backdrop-blur px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary-700 shadow-sm">
                        <Star className="w-3 h-3 fill-current" />
                        {pkg.badge}
                      </span>
                    )}
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-lg font-bold text-ink-900 group-hover:text-primary-700 transition-colors">
                        {pkg.name}
                      </h3>
                      <div className="text-right shrink-0">
                        <div className="text-xl font-black text-primary-900">${pkg.price}</div>
                        {pkg.totalValue && (
                          <div className="text-xs text-ink-400 line-through">Value ${pkg.totalValue}</div>
                        )}
                      </div>
                    </div>
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
                      {pkg.includes.length > 4 && (
                        <li className="text-xs font-semibold text-primary-700 pl-6">
                          +{pkg.includes.length - 4} more ingredients
                        </li>
                      )}
                    </ul>
                    <Link
                      to={`/book/?package=${pkg.slug}`}
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

      {/* ── Add-Ons Section ── */}
      <section className="bg-sky-50/50 border-t border-sky-100 py-16 sm:py-20">
        <div className="container-page">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <motion.span variants={fadeUp} className="eyebrow">
              Enhance Your Hydration
            </motion.span>
            <motion.h2 variants={fadeUp} className="mt-3 text-3xl sm:text-4xl font-serif font-bold text-ink-900">
              Available IV Add-Ons
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-3 text-ink-500 leading-relaxed">
              Customize any IV infusion package with our specialized nutrient add-ons for targeted wellness results.
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggerFast}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="grid gap-6 sm:grid-cols-2 max-w-3xl mx-auto"
          >
            {IV_ADD_ONS.map((addon) => (
              <motion.div key={addon.name} variants={scaleIn} whileHover={{ y: -4 }} className="card p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-full bg-sky-100 border border-sky-200 flex items-center justify-center">
                      <Plus className="w-5 h-5 text-sky-600" />
                    </div>
                    <span className="text-orange-500 font-black text-xl">{addon.price}</span>
                  </div>
                  <h3 className="font-bold text-ink-900 text-lg">{addon.name}</h3>
                  <p className="text-xs text-ink-600 mt-2 leading-relaxed">{addon.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Package Deals Section ── */}
      <section className="bg-white border-t border-ink-100 py-16 sm:py-20">
        <div className="container-page">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <motion.span variants={fadeUp} className="eyebrow">
              Special Bundles
            </motion.span>
            <motion.h2 variants={fadeUp} className="mt-3 text-3xl sm:text-4xl font-serif font-bold text-ink-900">
              Official Package Deals
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-3 text-ink-500 leading-relaxed">
              Save on multi-session IV therapy packages for ongoing hydration and wellness maintenance.
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggerFast}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto"
          >
            {IV_PACKAGE_DEALS.map((deal) => (
              <motion.div
                key={deal.title}
                variants={scaleIn}
                whileHover={{ y: -4 }}
                className="card p-6 border-2 border-sky-100 bg-gradient-to-br from-sky-50/50 to-white flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-100 text-primary-800 px-3 py-1 text-xs font-bold uppercase tracking-wider">
                      <Tag className="w-3.5 h-3.5" /> Package Deal
                    </span>
                    <span className="text-2xl font-black text-primary-900">{deal.dealPrice}</span>
                  </div>
                  <h3 className="font-serif font-bold text-ink-900 text-xl mt-1">{deal.title}</h3>
                  {deal.pricePerUnit && <p className="text-xs text-ink-500 font-semibold mt-1">{deal.pricePerUnit}</p>}
                  <p className="text-sm text-ink-600 mt-3 leading-relaxed">{deal.description}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-sky-100 flex items-center justify-between">
                  <span className="text-xs text-ink-400 font-medium">Includes 3 IV Infusions</span>
                  <Link
                    to="/book/"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-500 hover:text-orange-600 transition-colors"
                  >
                    Book Package Deal <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <CTASection
        title="Need help choosing the right package?"
        description="Our team can help you select the most appropriate IV therapy option based on your goals and symptoms."
        primaryLabel="Contact Us"
        primaryHref="/contact-us/"
      />
    </>
  );
}

