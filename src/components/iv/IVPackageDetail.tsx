import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Plus, ArrowRight, Star, CalendarDays, Phone, Shield, Clock, Zap, ChevronDown } from 'lucide-react';
import { fadeUp, slideRight, staggerContainer, staggerFast, scaleIn, viewport } from '@/animations/variants';
import { Seo } from '@/components/common/Seo';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { CTASection } from '@/components/common/CTASection';
import { site } from '@/data/site';
import { getCmsIVPackages } from '@/data/cms';

export interface Ingredient { abbr: string; name: string; description: string; dosage?: string; }
export interface AddOn { name: string; price: string; description: string; }
export interface RelatedPkg {
  name: string; price: number; totalValue?: number;
  image: string; description: string; href: string;
}
export interface IVPackageDetailProps {
  slug: string; name: string; price: number; totalValue?: number; badge?: string;
  image: string; heroSubtitle: string; tagline: string; description: string;
  dosages: string; bestFor: string[]; ingredients: Ingredient[];
  addOns: AddOn[]; related: RelatedPkg[];
}

const howItWorks = [
  { step: '01', title: 'Schedule Your Appointment', body: 'Pick the date and time that works for you via our booking page or call us directly.' },
  { step: '02', title: 'Confirm the Details', body: "You'll receive a confirmation asking for final details and to confirm your date and time." },
  { step: '03', title: 'We Arrive at Your Location', body: 'We arrive at your chosen location and deliver your treatment ensuring maximum comfort.' },
];

const faqs = [
  { q: 'Does insurance cover IV therapy?', a: 'IV therapy is not covered by insurance. We provide high quality mobile IV therapy at affordable prices to avoid high emergency room bills and co-pays.' },
  { q: 'How do I pay?', a: 'We accept cash, card, or HSA/FSA.' },
  { q: 'What are the benefits of IV therapy?', a: 'IV therapy is the most efficient way to deliver fluids, vitamins and medications. It bypasses the digestive system allowing close to 100% nutrient absorption.' },
  { q: 'Is there a travel fee?', a: 'No, all costs are as advertised as long as you are in our service area.' },
  { q: 'How does this work?', a: 'A licensed registered nurse, supervised by our board certified physician, comes to your home, gym, hotel or office. They assess vitals, place the IV and administer your package in approximately 45–60 minutes.' },
  { q: 'Do you offer group rates?', a: 'Yes! 5% off or a free add-in for groups of 2+, and 10% off for groups of 3+. We also offer a 10% military discount.' },
  { q: 'Do I need a prescription?', a: 'No, but we always recommend consulting your physician before starting any new regimen.' },
];

export function IVPackageDetail({
  slug, name: nameProp, price: priceProp, totalValue: tvProp, badge: badgeProp,
  image: imageProp, heroSubtitle, tagline: taglineProp, description: descProp,
  dosages: dosagesProp, bestFor, ingredients, addOns, related,
}: IVPackageDetailProps) {

  // Apply CMS override if admin has edited this static package
  const [ov, setOv] = useState(() => getCmsIVPackages().find(p => p.id === `static-pkg-${slug}`));

  useEffect(() => {
    function reload() { setOv(getCmsIVPackages().find(p => p.id === `static-pkg-${slug}`)); }
    window.addEventListener('storage', reload);
    window.addEventListener('focus', reload);
    return () => { window.removeEventListener('storage', reload); window.removeEventListener('focus', reload); };
  }, [slug]);

  const name        = ov?.name        || nameProp;
  const price       = ov?.price       || priceProp;
  const totalValue  = ov?.totalValue  ?? tvProp;
  const badge       = ov?.badge       || badgeProp;
  const image       = ov?.image       || imageProp;
  const tagline     = ov?.tagline     || taglineProp;
  const description = ov?.description || descProp;
  const dosages     = ov?.dosages     || dosagesProp;

  const dosageSummary = dosages.length > 90 ? dosages.slice(0, 87) + '…' : dosages;
  const [openFaq, setOpenFaq] = useState<number>(0);

  return (
    <>
      <Seo
        title={`${name} IV Therapy Package | MD Abidi Arthritis Institute`}
        description={tagline}
      />

      {/* ── Breadcrumbs ── */}
      <div className="bg-white">
        <Breadcrumbs items={[{ label: 'IV Packages', href: '/iv-packages/' }, { label: name }]} />
      </div>

      {/* ══════════════════════════════════════
          HERO — clean white, professional
      ══════════════════════════════════════ */}
      <section className="bg-white overflow-hidden">
        <div className="container-page py-8 lg:py-14">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-center">

            {/* ── LEFT: text ── */}
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="order-2 lg:order-1">

              {/* Tag row */}
              <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-2 mb-5">
                <span className="inline-flex items-center gap-1.5 bg-sky-50 border border-sky-200 text-sky-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                  <Shield className="w-3 h-3" /> IV Therapy Package
                </span>
                {badge && (
                  <span className="inline-flex items-center gap-1.5 bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                    <Star className="w-3 h-3" /> {badge}
                  </span>
                )}
              </motion.div>

              {/* Title */}
              <motion.h1
                variants={fadeUp}
                className="text-4xl sm:text-5xl font-serif font-black text-ink-900 leading-[1.05] tracking-tight"
              >
                {name}
              </motion.h1>

              {/* Tagline */}
              <motion.p variants={fadeUp} className="mt-4 text-base text-ink-500 leading-relaxed max-w-md">
                {tagline}
              </motion.p>

              {/* Price */}
              <motion.div variants={fadeUp} className="mt-5 flex items-baseline gap-3">
                <span className="text-5xl font-black text-primary-900 leading-none">${price}</span>
                {totalValue && (
                  <div className="flex flex-col">
                    <span className="text-sm text-ink-400 line-through leading-none">Value ${totalValue}</span>
                    <span className="text-xs text-orange-500 font-semibold mt-0.5">Save ${totalValue - price}</span>
                  </div>
                )}
              </motion.div>

              {/* Best-for pills */}
              <motion.div variants={fadeUp} className="mt-5 flex flex-wrap gap-2">
                {bestFor.slice(0, 5).map(b => (
                  <span key={b} className="inline-flex items-center gap-1.5 bg-ink-50 border border-ink-100 text-ink-600 text-xs font-medium px-2.5 py-1 rounded-full">
                    <CheckCircle2 className="w-3 h-3 text-sky-400 flex-shrink-0" /> {b}
                  </span>
                ))}
                {bestFor.length > 5 && (
                  <span className="self-center text-xs text-ink-400">+{bestFor.length - 5} more</span>
                )}
              </motion.div>

              {/* CTAs */}
              <motion.div variants={fadeUp} className="mt-7 flex flex-wrap gap-3">
                <Link
                  to={`/book-iv/?package=${slug}`}
                  className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm px-7 py-3.5 rounded-full shadow-lift transition-all duration-200"
                >
                  <CalendarDays className="w-4 h-4" /> Book This Package
                </Link>
                <a
                  href={site.phoneHref}
                  className="inline-flex items-center gap-2 border-2 border-ink-200 hover:border-primary-900 text-ink-700 hover:text-primary-900 font-semibold text-sm px-7 py-3.5 rounded-full transition-all duration-200"
                >
                  <Phone className="w-4 h-4" /> {site.phone}
                </a>
              </motion.div>

              {/* Trust row */}
              <motion.div variants={fadeUp} className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs text-ink-400">
                <span className="inline-flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-sky-400" /> Physician Supervised</span>
                <span className="inline-flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-sky-400" /> 45–60 Min Session</span>
                <span className="inline-flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-sky-400" /> HSA / FSA Accepted</span>
              </motion.div>
            </motion.div>

            {/* ── RIGHT: IV bag card ── */}
            <motion.div
              variants={slideRight}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.15 }}
              className="order-1 lg:order-2 flex justify-center"
            >
              <div className="relative w-full max-w-[420px]">
                {/* Card */}
                <div className="rounded-3xl overflow-hidden shadow-card border border-ink-100">
                  {/* Blue water-splash bg area */}
                  <div
                    className="relative flex items-center justify-center h-72 overflow-hidden"
                    style={{
                      background: 'radial-gradient(ellipse at 60% 40%, #dbeafe 0%, #eff6ff 40%, #f0f9ff 100%)',
                    }}
                  >
                    {/* IV bag image */}
                    <motion.img
                      src={image}
                      alt={`${name} IV therapy bag`}
                      className="relative h-52 w-auto object-contain drop-shadow-xl z-10"
                      loading="eager"
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  </div>

                  {/* Active Ingredients summary strip */}
                  <div className="bg-white px-6 py-4 border-t border-ink-100">
                    <p className="text-xs font-bold text-primary-900 uppercase tracking-wider mb-1">Active Ingredients</p>
                    <p className="text-xs text-ink-500 leading-relaxed">{dosageSummary}</p>
                  </div>
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

      {/* ── About + Best For ── */}
      <section className="bg-white">
        <div className="container-page py-14">
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <motion.span variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport} className="eyebrow">
                 About This Package
              </motion.span>
              <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport} className="mt-2 text-2xl font-serif font-bold text-ink-900">{heroSubtitle}</motion.h2>
              <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport} className="mt-4 text-ink-600 leading-relaxed">{description}</motion.p>
            </div>
            <motion.div variants={scaleIn} initial="hidden" whileInView="visible" viewport={viewport}
              className="bg-sky-50 border border-sky-100 rounded-2xl p-6">
              <h3 className="font-bold text-primary-900 mb-4 text-xs uppercase tracking-widest">This IV is Best For</h3>
              <div className="flex flex-wrap gap-2">
                {bestFor.map(b => (
                  <span key={b} className="inline-flex items-center gap-1.5 bg-white border border-sky-100 text-primary-800 text-xs font-semibold px-3 py-1.5 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" /> {b}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Active Ingredients ── */}
      <section className="bg-ink-50">
        <div className="container-page py-14">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewport} className="text-center max-w-xl mx-auto mb-10">
            <motion.span variants={fadeUp} className="eyebrow"> Active Ingredients</motion.span>
            <motion.h2 variants={fadeUp} className="mt-2 text-2xl font-serif font-bold text-ink-900">What's Inside</motion.h2>
            <motion.p variants={fadeUp} className="mt-2 text-sm text-ink-500">Every ingredient is physician-selected for maximum effectiveness</motion.p>
          </motion.div>
          <motion.div variants={staggerFast} initial="hidden" whileInView="visible" viewport={viewport} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ingredients.map(ing => (
              <motion.div key={ing.name} variants={scaleIn} whileHover={{ y: -4 }} className="card p-5 flex gap-4 items-start">
                <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-primary-900 text-white flex items-center justify-center text-xs font-black">{ing.abbr}</div>
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

      {/* ── Add-Ons ── */}
      <section className="bg-white">
        <div className="container-page py-14">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewport} className="text-center max-w-xl mx-auto mb-10">
            <motion.span variants={fadeUp} className="eyebrow"> Enhance Your Treatment</motion.span>
            <motion.h2 variants={fadeUp} className="mt-2 text-2xl font-serif font-bold text-ink-900">Need an Extra Boost?</motion.h2>
            <motion.p variants={fadeUp} className="mt-2 text-sm text-ink-500">Add any of the following to your IV package for targeted results</motion.p>
          </motion.div>
          <motion.div variants={staggerFast} initial="hidden" whileInView="visible" viewport={viewport} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {addOns.map(a => (
              <motion.div key={a.name} variants={scaleIn} whileHover={{ y: -4 }} className="card p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-full bg-sky-50 border border-sky-100 flex items-center justify-center">
                    <Plus className="w-4 h-4 text-sky-500" />
                  </div>
                  <span className="text-orange-500 font-black text-sm">{a.price}</span>
                </div>
                <h3 className="font-bold text-ink-900 text-sm">{a.name}</h3>
                <p className="text-xs text-ink-500 mt-1.5 leading-relaxed">{a.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="bg-ink-50">
        <div className="container-page py-14">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewport} className="text-center max-w-xl mx-auto mb-10">
            <motion.span variants={fadeUp} className="eyebrow"> Simple Process</motion.span>
            <motion.h2 variants={fadeUp} className="mt-2 text-2xl font-serif font-bold text-ink-900">How It Works</motion.h2>
            <motion.p variants={fadeUp} className="mt-2 text-sm text-ink-500">We've made IV therapy simple, convenient and affordable.</motion.p>
          </motion.div>
          <motion.div variants={staggerFast} initial="hidden" whileInView="visible" viewport={viewport} className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {howItWorks.map(s => (
              <motion.div key={s.step} variants={scaleIn} className="card text-center p-6">
                <div className="text-4xl font-black text-primary-100 leading-none">{s.step}</div>
                <div className="w-8 h-1 bg-orange-500 rounded-full mx-auto my-3" />
                <h3 className="font-bold text-ink-900 text-sm">{s.title}</h3>
                <p className="text-xs text-ink-500 mt-2 leading-relaxed">{s.body}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FAQs ── */}
      <section className="bg-white">
        <div className="container-page py-14">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewport} className="text-center max-w-xl mx-auto mb-10">
            <motion.span variants={fadeUp} className="eyebrow"> FAQ</motion.span>
            <motion.h2 variants={fadeUp} className="mt-2 text-2xl font-serif font-bold text-ink-900">Frequently Asked Questions</motion.h2>
          </motion.div>
          <div className="max-w-2xl mx-auto">
            {faqs.map((f, i) => (
              <div key={f.q} className={`border-b border-ink-100 ${i === 0 ? 'border-t' : ''}`}>
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                  className="w-full flex items-center justify-between gap-4 py-4 text-left group"
                >
                  <span className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-50 text-primary-900 flex items-center justify-center text-xs font-black">
                      {i + 1}
                    </span>
                    <span className={`font-semibold text-sm transition-colors ${openFaq === i ? 'text-primary-900' : 'text-ink-800 group-hover:text-primary-900'}`}>
                      {f.q}
                    </span>
                  </span>
                  <motion.span
                    animate={{ rotate: openFaq === i ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown className={`w-4 h-4 transition-colors ${openFaq === i ? 'text-orange-500' : 'text-ink-400'}`} />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-4 pl-9 text-sm text-ink-500 leading-relaxed">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Related Packages ── */}
      {related.length > 0 && (
        <section className="bg-ink-50">
          <div className="container-page py-14">
            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewport} className="text-center max-w-xl mx-auto mb-10">
              <motion.span variants={fadeUp} className="eyebrow"> More Options</motion.span>
              <motion.h2 variants={fadeUp} className="mt-2 text-2xl font-serif font-bold text-ink-900">Other Packages You May Like</motion.h2>
            </motion.div>
            <motion.div variants={staggerFast} initial="hidden" whileInView="visible" viewport={viewport} className="grid gap-6 sm:grid-cols-3">
              {related.map(r => (
                <motion.div key={r.href} variants={scaleIn} whileHover={{ y: -5 }} className="card overflow-hidden group cursor-pointer">
                  <div className="flex items-center justify-center h-44 overflow-hidden"
                    style={{ background: 'radial-gradient(ellipse at 60% 40%, #dbeafe 0%, #eff6ff 60%, #f0f9ff 100%)' }}>
                    <img src={r.image} alt={r.name} className="h-36 object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-md" loading="lazy" />
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-ink-900 text-sm">{r.name}</h3>
                      <div className="text-right">
                        <div className="font-black text-primary-900 text-lg leading-none">${r.price}</div>
                        {r.totalValue && <div className="text-[10px] text-ink-400 line-through">Value ${r.totalValue}</div>}
                      </div>
                    </div>
                    <p className="text-xs text-ink-500 leading-relaxed mb-4">{r.description}</p>
                    <Link to={r.href} className="inline-flex items-center gap-1.5 text-primary-900 hover:text-orange-500 font-semibold text-xs transition-colors">
                      View Details <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            <div className="text-center mt-8">
              <Link to="/iv-packages/" className="inline-flex items-center gap-2 bg-primary-900 hover:bg-primary-800 text-white font-semibold px-6 py-3 rounded-full text-sm transition-all">
                View All IV Packages <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      <CTASection
        eyebrow="Ready to Feel Better?"
        title="Book Your IV Therapy Session Today"
        description="Our registered nurses come directly to you. Fast, safe, and effective IV therapy tailored to your needs."
        primaryLabel="Book an Appointment"
      />
    </>
  );
}
