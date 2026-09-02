import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Phone, X } from 'lucide-react';
import { site } from '@/data/site';
import { useLiveNav } from '@/lib/liveNav';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const { pathname } = useLocation();
  const nav = useLiveNav();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setExpanded(null);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <>
      <header className="bg-white border-b border-ink-100 w-full">
        <div className="container-page flex items-center justify-between gap-4 py-3">
          <Link to="/" className="flex items-center gap-2.5" aria-label={site.name}>
            <img
              src={site.logo}
              alt="MD Abidi Arthritis Institute logo"
              className="h-12 w-auto"
              loading="eager"
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-1 relative">
            {nav.map((item) => (
              <div key={item.href} className="relative group">
                <Link
                  to={item.href}
                  className={`inline-flex items-center gap-1 px-3.5 py-2 rounded-full text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-primary-900 bg-primary-50'
                      : 'text-ink-700 hover:text-primary-900 hover:bg-primary-50/60'
                  }`}
                >
                  {item.label}
                  {item.children && <ChevronDown className="w-4 h-4 opacity-70" />}
                </Link>
                {item.children && (
                  <div className="absolute left-0 top-full pt-2 opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 z-[9999]">
                    <div className="bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.15)] border border-ink-100 p-2 w-64">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          to={child.href}
                          className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                            isActive(child.href)
                              ? 'text-primary-900 bg-primary-50 font-semibold'
                              : 'text-ink-600 hover:text-primary-900 hover:bg-primary-50/70'
                          }`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <a href={site.phoneHref} className="inline-flex items-center gap-2 text-ink-700 hover:text-primary-900 font-medium text-sm">
              <Phone className="w-4 h-4 text-primary-900" />
              {site.phone}
            </a>
            <Link to={site.bookingUrl} className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-full transition-all duration-200 text-sm shadow-soft">
              Book Now
            </Link>
          </div>

          <button
            type="button"
            className="lg:hidden grid place-items-center w-10 h-10 rounded-lg text-ink-800 hover:bg-ink-50"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="w-6 h-6" /> : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-ink-950/40" onClick={() => setOpen(false)} />
            <motion.nav
              className="absolute right-0 top-0 h-full w-[86%] max-w-sm bg-white shadow-lift overflow-y-auto pt-20 pb-6"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              aria-label="Mobile navigation"
            >
              <div className="px-5 space-y-1">
                {nav.map((item) => (
                  <div key={item.href}>
                    {item.children ? (
                      <>
                        <button
                          type="button"
                          className="w-full flex items-center justify-between px-3 py-3 rounded-lg text-ink-800 font-medium hover:bg-primary-50"
                          onClick={() => setExpanded((v) => (v === item.label ? null : item.label))}
                          aria-expanded={expanded === item.label}
                        >
                          {item.label}
                          <ChevronDown
                            className={`w-5 h-5 transition-transform ${expanded === item.label ? 'rotate-180' : ''}`}
                          />
                        </button>
                        <AnimatePresence initial={false}>
                          {expanded === item.label && (
                            <motion.div
                              className="pl-3 mt-1 space-y-1"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25 }}
                            >
                              {item.children.map((child) => (
                                <Link
                                  key={child.href}
                                  to={child.href}
                                  className={`block px-3 py-2.5 rounded-lg text-sm ${
                                    isActive(child.href) ? 'text-primary-700 bg-primary-50 font-medium' : 'text-ink-600 hover:bg-primary-50/60'
                                  }`}
                                >
                                  {child.label}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        to={item.href}
                        className={`block px-3 py-3 rounded-lg font-medium ${
                          isActive(item.href) ? 'text-primary-700 bg-primary-50' : 'text-ink-800 hover:bg-primary-50/60'
                        }`}
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
              <div className="px-5 mt-6 space-y-3">
                <a href={site.phoneHref} className="flex items-center justify-center gap-2 w-full border-2 border-primary-900 text-primary-900 font-semibold px-5 py-3 rounded-full text-sm hover:bg-primary-50 transition-all">
                  <Phone className="w-4 h-4" />
                  {site.phone}
                </a>
                <Link to={site.bookingUrl} className="flex items-center justify-center gap-2 w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-3 rounded-full text-sm transition-all">
                  Book Now
                </Link>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
