import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { footerPages } from '@/data/navigation';
import { site } from '@/data/site';
import { useLiveNav } from '@/lib/liveNav';
import { staggerContainer, staggerFast, fadeUp, slideRight, viewport } from '@/animations/variants';

export function Footer() {
  const nav = useLiveNav();
  const treatments = [
    ...(nav.find(i => i.href === '/conditions-we-treat/')?.children || []).slice(0, 4),
    { label: 'View All Treatments', href: '/conditions-we-treat/' },
  ];
  return (
    <footer className="bg-primary-900 text-sky-100">
      <div className="container-page py-12 sm:py-14">
        <motion.div
          variants={staggerFast}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10"
        >
          {/* Brand */}
          <motion.div variants={slideRight} className="sm:col-span-2 lg:col-span-1">
            {/* Logo on dark bg — use a white-friendly container */}
            <div className="bg-white rounded-xl px-4 py-3 inline-block mb-4">
              <img
                src={site.logo}
                alt="MD Abidi Arthritis Institute logo"
                className="h-10 w-auto"
                loading="lazy"
              />
            </div>
            <p className="text-sm text-sky-200/70 leading-relaxed max-w-xs">
              Trusted Arthritis Treatment, Rheumatology Care &amp; Joint Pain Relief in Brick and Freehold, NJ
            </p>
            {/* Mobile-only contact */}
            <div className="mt-5 flex flex-col gap-2 sm:hidden">
              <a href={site.phoneHref} className="inline-flex items-center gap-2 text-sm text-sky-200/80 hover:text-orange-400 transition-colors">
                <Phone className="w-4 h-4 text-orange-400 shrink-0" /> {site.phone}
              </a>
              <a href={site.emailHref} className="inline-flex items-center gap-2 text-sm text-sky-200/80 hover:text-orange-400 transition-colors">
                <Mail className="w-4 h-4 text-orange-400 shrink-0" /> {site.email}
              </a>
            </div>
          </motion.div>

          {/* Pages */}
          <motion.div variants={fadeUp}>
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-4">Pages</h4>
            <ul className="space-y-2.5 text-sm">
              {footerPages.map((p) => (
                <li key={p.href}>
                  <Link to={p.href} className="text-sky-200/70 hover:text-orange-400 transition-colors">{p.label}</Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Treatments */}
          <motion.div variants={fadeUp}>
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-4">Treatments</h4>
            <ul className="space-y-2.5 text-sm">
              {treatments.map((p) => (
                <li key={`${p.href}-${p.label}`}>
                  <Link to={p.href} className="text-sky-200/70 hover:text-orange-400 transition-colors">{p.label}</Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div variants={fadeUp} className="hidden sm:block">
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-4">Get In Touch</h4>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-orange-400 mt-0.5 shrink-0" />
                <span className="text-sky-200/70">{site.hours}</span>
              </li>
              {site.locations.map((loc) => (
                <li key={loc.label} className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-orange-400 mt-0.5 shrink-0" />
                  <span className="text-sky-200/70">
                    <span className="block font-medium text-sky-100">{loc.label}</span>
                    {loc.lines.map((l) => (<span key={l} className="block">{l}</span>))}
                  </span>
                </li>
              ))}
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-orange-400 shrink-0" />
                <a href={site.emailHref} className="text-sky-200/70 hover:text-orange-400 transition-colors break-all">{site.email}</a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-orange-400 shrink-0" />
                <a href={site.phoneHref} className="text-sky-200/70 hover:text-orange-400 transition-colors">{site.phone}</a>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        {/* Bottom bar */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-sky-200/50"
        >
          <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/disclaimer/" className="hover:text-orange-400 transition-colors">Disclaimer</Link>
            <Link to="/privacy-policy/" className="hover:text-orange-400 transition-colors">Privacy Policy</Link>
          </motion.div>
          <motion.p variants={fadeUp} className="text-center">
            © {new Date().getFullYear()} {site.name}. All Rights Reserved.
          </motion.p>
        </motion.div>
      </div>
    </footer>
  );
}
