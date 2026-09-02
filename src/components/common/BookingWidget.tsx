import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CalendarDays } from 'lucide-react';

const drImg = '/mrabidi.png';

export function BookingWidget() {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  return (
    <>
      {/* ── Expanded card ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ delay: 1.2, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-60 sm:w-64 bg-white rounded-2xl overflow-visible"
            style={{ boxShadow: '0 8px 40px rgba(2,41,142,0.18)' }}
          >
            {/* Doctor avatar */}
            <div className="flex justify-center">
              <div className="-mt-6 w-12 h-12 rounded-full overflow-hidden border-4 border-white shadow-md ring-2 ring-primary-100">
                <img src={drImg} alt="Dr. Mutahir Abidi" className="w-full h-full object-cover object-top" />
              </div>
            </div>

            {/* Dismiss */}
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute top-2.5 right-2.5 w-6 h-6 flex items-center justify-center rounded-full text-ink-400 hover:text-ink-700 hover:bg-ink-100 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            {/* Body */}
            <div className="px-5 pt-2 pb-4 text-center">
              <p className="text-ink-900 font-semibold text-sm leading-snug">
                Book an appointment with Dr. Abidi right here.
              </p>
              <p className="text-ink-400 text-xs mt-1">Free, fast &amp; secure.</p>
            </div>

            {/* CTA */}
            <button
              onClick={() => navigate('/contact-us/')}
              className="w-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700 transition-colors text-white font-bold text-sm py-3 rounded-b-2xl"
            >
              Book Online
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Collapsed pill ── */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.25 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm px-5 py-3 rounded-full"
            style={{ boxShadow: '0 4px 20px rgba(242,138,36,0.4)' }}
          >
            <CalendarDays className="w-4 h-4" />
            Book Online
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
