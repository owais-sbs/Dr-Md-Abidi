import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Activity, CalendarDays, Clock, Eye, EyeOff, Lock, MessageSquare,
  Shield, Syringe, Loader2, AlertCircle,
} from 'lucide-react';
import { site } from '@/data/site';
import { supabase, supabaseReady } from '@/lib/supabase';

const FEATURE_CARDS = [
  { title: 'Pending → Approved', body: 'Every booking request lands as Pending until you confirm it.', icon: CalendarDays, color: '#3b82f6', bg: '#eff6ff' },
  { title: 'Slot Protection', body: 'A requested time is removed from the public calendar immediately.', icon: Clock, color: '#d97706', bg: '#fffbeb' },
  { title: 'Live Clinic Calendar', body: 'Approved visits appear in the day box with the exact time.', icon: CalendarDays, color: '#16a34a', bg: '#f0fdf4' },
  { title: 'IV Packages CMS', body: 'Change a price or name and the live website updates at once.', icon: Syringe, color: '#0ea5e9', bg: '#f0f9ff' },
  { title: 'Conditions We Treat', body: 'Edit condition pages from this portal — patients see it live.', icon: Activity, color: '#7c3aed', bg: '#faf5ff' },
  { title: 'Contact Inbox', body: 'Website “Book / Send message” forms arrive here, not in email.', icon: MessageSquare, color: '#db2777', bg: '#fdf2f8' },
];

function shuffle<T>(list: T[]): T[] {
  const next = [...list];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

export function AdminLogin({ onReady }: { onReady: () => void }) {
  const [email, setEmail] = useState('admin@gmail.com');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const cards = useMemo(() => shuffle(FEATURE_CARDS), []);

  useEffect(() => {
    // Do not make an auth request against the fallback client when the
    // browser build has not received its public Supabase configuration.
    if (!supabaseReady) return;

    let alive = true;
    supabase.auth.getSession().then(({ data }) => {
      if (alive && data.session) onReady();
    });
    return () => { alive = false; };
  }, [onReady]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!supabaseReady) {
      setError(
        'Admin sign-in is not configured. Set VITE_SUPABASE_URL and ' +
        'VITE_SUPABASE_ANON_KEY, then restart or redeploy the application.'
      );
      return;
    }

    setLoading(true);
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (authError) {
        setError(authError.message === 'Invalid login credentials'
          ? 'Invalid email or password.'
          : authError.message);
        return;
      }
      onReady();
    } catch {
      setError('Unable to reach the authentication service. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2" style={{ background: '#f8fafc' }}>
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16">
        <div className="max-w-md w-full mx-auto">
          <div className="bg-white rounded-2xl px-4 py-3 inline-block mb-8 border border-slate-100 shadow-sm">
            <img src={site.logo} alt={site.name} className="h-10 w-auto" />
          </div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-orange-500 mb-2">Admin Portal</p>
          <h1 className="text-3xl font-serif font-black text-slate-900 leading-tight">
            Sign in to manage the clinic
          </h1>
          <p className="mt-3 text-sm text-slate-500 leading-relaxed">
            Review booking requests, protect slots, and publish live changes to conditions and IV packages.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email</label>
              <input
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-11 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-600">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary-900 hover:bg-primary-800 disabled:opacity-60 text-white font-semibold text-sm px-5 py-3.5 transition-all"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div className="mt-6 flex items-center gap-2 text-xs text-slate-400">
            <Shield className="w-3.5 h-3.5" />
            Secured with Supabase Auth. No email / SMTP is used.
          </div>
        </div>
      </div>

      <div className="hidden lg:flex relative overflow-hidden" style={{ background: '#0f172a' }}>
        <div className="absolute inset-0 opacity-40"
          style={{ background: 'radial-gradient(ellipse at 20% 10%, #1d4ed8 0%, transparent 50%), radial-gradient(ellipse at 90% 90%, #ea580c 0%, transparent 40%)' }} />
        <div className="relative z-10 flex flex-col justify-between p-10 w-full">
          <div>
            <div className="bg-white rounded-2xl px-4 py-3 inline-block mb-8">
              <img src={site.logo} alt={site.name} className="h-9 w-auto" />
            </div>
            <h2 className="text-3xl font-serif font-black text-white leading-tight max-w-md">
              One portal for bookings, slots, and live website content.
            </h2>
            <p className="mt-3 text-sm text-slate-300 max-w-sm leading-relaxed">
              Approve appointments, lock times, and publish condition or IV package edits without leaving this screen.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-10">
            {cards.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * i, duration: 0.35 }}
                className="rounded-2xl p-4 border border-white/10 bg-white/5 backdrop-blur-sm"
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: card.bg }}>
                  <card.icon className="w-4 h-4" style={{ color: card.color }} />
                </div>
                <div className="text-sm font-bold text-white">{card.title}</div>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{card.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
