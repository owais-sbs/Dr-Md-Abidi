import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarDays, Phone, CheckCircle2, Plus, ArrowRight } from 'lucide-react';
import { Seo } from '@/components/common/Seo';
import { CTASection } from '@/components/common/CTASection';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { getCmsIVPackages } from '@/data/cms';
import { fadeUp, staggerContainer, staggerFast, scaleIn, viewport } from '@/animations/variants';
import { site } from '@/data/site';

export function CmsIVPackageDetail() {
  const { slug } = useParams<{ slug: string }>();
  const pkg = getCmsIVPackages().find(p => p.slug === slug && p.enabled);

  if (!pkg) return <Navigate to="/iv-packages/" replace />;

  const bestFor = pkg.bestFor ? pkg.bestFor.split(',').map(s => s.trim()).filter(Boolean) : [];

  // Parse ingredients: "abbr|name|description|dosage"
  const ingredients = pkg.ingredients
    ? pkg.ingredients.split('\n').map(l => {
        const [abbr, name, description, dosage] = l.split('|').map(s => s.trim());
        return { abbr, name, description, dosage };
      }).filter(i => i.name)
    : [];

  // Parse addOns: "name|price|description"
  const addOns = pkg.addOns
    ? pkg.addOns.split('\n').map(l => {
        const [name, price, description] = l.split('|').map(s => s.trim());
        return { name, price, description };
      }).filter(a => a.name)
    : [];

  const dosageSummary = pkg.dosages && pkg.dosages.length > 90 ? pkg.dosages.slice(0, 87) + '…' : pkg.dosages;

  return (
    <>
      <Seo
        title={`${pkg.name} IV Therapy Package | MD Abidi Arthritis Institute`}
        description={pkg.tagline}
      />

      <Breadcrumbs items={[{ label: 'IV Packages', href: '/iv-packages/' }, { label: pkg.name }]} />

      {/* Hero */}
      <section className="bg-white overflow-hidden">
        <div className="h-1.5 w-full bg-gradient-to-r from-primary-900 via-sky-300 to-orange-500" />
        <div className="container-page py-10 lg:py-14">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            {/* Left */}
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="order-2 lg:order-1">
              <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-2 mb-5">
                <span className="inline-flex items-center gap-1.5 bg-sky-50 border border-sky-200 text-sky-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                  IV Therapy Package
                </span>
                {pkg.badge && (
                  <span className="inline-flex items-center gap-1.5 bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                    ★ {pkg.badge}
                  </span>
                )}
              </motion.div>
              <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl font-serif font-black text-ink-900 leading-tight tracking-tight">
                {pkg.name}
              </motion.h1>
              <motion.p variants={fadeUp} className="mt-4 text-base text-ink-500 leading-relaxed max-w-md">{pkg.tagline}</motion.p>
              <motion.div variants={fadeUp} className="mt-5 flex items-baseline gap-3">
                <span className="text-5xl font-black text-primary-900 leading-none">${pkg.price}</span>
                {pkg.totalValue && (
                  <div>
                    <div className="text-sm text-ink-400 line-through">Value ${pkg.totalValue}</div>
                    <div className="text-xs text-orange-500 font-semibold">Save ${pkg.totalValue - pkg.price}</div>
                  </div>
                )}
              </motion.div>
              {bestFor.length > 0 && (
                <motion.div variants={fadeUp} className="mt-5 flex flex-wrap gap-2">
                  {bestFor.map(b => (
                    <span key={b} className="inline-flex items-center gap-1.5 bg-ink-50 border border-ink-100 text-ink-600 text-xs font-medium px-2.5 py-1 rounded-full">
                      <CheckCircle2 className="w-3 h-3 text-sky-400 flex-shrink-0" /> {b}
                    </span>
                  ))}
                </motion.div>
              )}
              <motion.div variants={fadeUp} className="mt-7 flex flex-wrap gap-3">
                <Link to={`/book-iv/?package=${pkg.slug}`}
                  className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm px-7 py-3.5 rounded-full shadow-lift transition-all">
                  <CalendarDays className="w-4 h-4" /> Book This Package
                </Link>
                <a href={site.phoneHref}
                  className="inline-flex items-center gap-2 border-2 border-ink-200 hover:border-primary-900 text-ink-700 font-semibold text-sm px-7 py-3.5 rounded-full transition-all">
                  <Phone className="w-4 h-4" /> {site.phone}
                </a>
              </motion.div>
            </motion.div>

            {/* Right — IV bag card */}
            <motion.div variants={scaleIn} initial="hidden" animate="visible" transition={{ delay: 0.2 }} className="order-1 lg:order-2 flex justify-center">
              <div className="relative w-full max-w-[400px]">
                <div className="rounded-3xl overflow-hidden shadow-card border border-ink-100">
                  <div className="flex items-center justify-center h-64 overflow-hidden"
                    style={{ background: 'radial-gradient(ellipse at 60% 40%, #dbeafe 0%, #eff6ff 40%, #f0f9ff 100%)' }}>
                    {pkg.image
                      ? <img src={pkg.image} alt={pkg.name} className="h-52 w-auto object-contain drop-shadow-xl" loading="eager" />
                      : <div className="w-20 h-20 rounded-full bg-sky-100 flex items-center justify-center text-sky-400 text-4xl">💉</div>
                    }
                  </div>
                  {dosageSummary && (
                    <div className="bg-white px-6 py-4 border-t border-ink-100">
                      <p className="text-xs font-bold text-primary-900 uppercase tracking-wider mb-1">Active Ingredients</p>
                      <p className="text-xs text-ink-500 leading-relaxed">{dosageSummary}</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="border-t border-ink-100 bg-ink-50">
          <div className="container-page">
            <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-ink-100">
              {[
                { value: '~100%', label: 'Nutrient Absorption' },
                { value: '45–60 min', label: 'Session Duration' },
                { value: 'Mobile', label: 'We Come to You' },
                { value: 'RN Administered', label: 'Licensed Nurses' },
              ].map(s => (
                <div key={s.label} className="py-4 px-6 text-center">
                  <div className="text-base font-black text-primary-900">{s.value}</div>
                  <div className="text-xs text-ink-500 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      {pkg.description && (
        <section className="bg-white">
          <div className="container-page py-14">
            <div className="max-w-2xl">
              <motion.span variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport} className="eyebrow">About This Package</motion.span>
              <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport} className="mt-4 text-ink-600 leading-relaxed">{pkg.description}</motion.p>
            </div>
          </div>
        </section>
      )}

      {/* Ingredients */}
      {ingredients.length > 0 && (
        <section className="bg-ink-50">
          <div className="container-page py-14">
            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewport} className="text-center max-w-xl mx-auto mb-10">
              <motion.span variants={fadeUp} className="eyebrow">Active Ingredients</motion.span>
              <motion.h2 variants={fadeUp} className="mt-2 text-2xl font-serif font-bold text-ink-900">What's Inside</motion.h2>
            </motion.div>
            <motion.div variants={staggerFast} initial="hidden" whileInView="visible" viewport={viewport} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {ingredients.map((ing, i) => (
                <motion.div key={i} variants={scaleIn} whileHover={{ y: -4 }} className="card p-5 flex gap-4 items-start">
                  <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-primary-900 text-white flex items-center justify-center text-xs font-black">{ing.abbr || '+'}</div>
                  <div>
                    <h3 className="font-bold text-ink-900 text-sm">{ing.name}</h3>
                    {ing.dosage && <p className="text-xs text-orange-500 font-semibold mt-0.5 mb-1">Dosage: {ing.dosage}</p>}
                    <p className="text-xs text-ink-500 leading-relaxed">{ing.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Add-Ons */}
      {addOns.length > 0 && (
        <section className="bg-white">
          <div className="container-page py-14">
            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewport} className="text-center max-w-xl mx-auto mb-10">
              <motion.span variants={fadeUp} className="eyebrow">Enhance Your Treatment</motion.span>
              <motion.h2 variants={fadeUp} className="mt-2 text-2xl font-serif font-bold text-ink-900">Need an Extra Boost?</motion.h2>
            </motion.div>
            <motion.div variants={staggerFast} initial="hidden" whileInView="visible" viewport={viewport} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {addOns.map((a, i) => (
                <motion.div key={i} variants={scaleIn} whileHover={{ y: -4 }} className="card p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded-full bg-sky-50 border border-sky-100 flex items-center justify-center"><Plus className="w-4 h-4 text-sky-500" /></div>
                    <span className="text-orange-500 font-black text-sm">{a.price}</span>
                  </div>
                  <h3 className="font-bold text-ink-900 text-sm">{a.name}</h3>
                  <p className="text-xs text-ink-500 mt-1.5 leading-relaxed">{a.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      <CTASection
        eyebrow="Ready to Feel Better?"
        title={`Book ${pkg.name} Today`}
        description="Our registered nurses come directly to you. Fast, safe, and effective IV therapy tailored to your needs."
        primaryLabel="Book an Appointment"
      />
    </>
  );
}
