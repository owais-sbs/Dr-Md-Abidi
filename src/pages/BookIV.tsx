import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2, CalendarDays, Clock, MapPin, ChevronRight,
  ArrowLeft, Mail, Loader2, Shield, Syringe,
} from 'lucide-react';
import { Seo } from '@/components/common/Seo';
import {
  IV_PACKAGES, getAvailableDates, getAvailableTimesForSlot,
} from '@/data/appointments';
import { getCmsIVPackages } from '@/data/cms';
import { supabase } from '@/lib/supabase';
import { createBookingRequest, sendBookingOtp, verifyBookingOtp } from '@/lib/bookingApi';

/* ─────────────────────────────────────────────
   STEP SIDEBAR
───────────────────────────────────────────── */
const STEPS = [
  { num: 1, label: 'Select Package',  sub: 'Choose your IV infusion type' },
  { num: 2, label: 'Choose Slot',     sub: 'Pick date, location & time' },
  { num: 3, label: 'Verify Email',    sub: 'OTP confirmation' },
  { num: 4, label: 'Medical Form',    sub: 'Patient intake & history' },
];

function Sidebar({ current }: { current: number }) {
  return (
    <aside className="hidden lg:flex flex-col gap-0 w-64 shrink-0">
      <div className="bg-primary-900 rounded-2xl p-6 text-white sticky top-8">
        <div className="flex items-center gap-2 mb-6">
          <Syringe className="w-5 h-5 text-orange-400" />
          <span className="font-bold text-sm">IV Therapy Booking</span>
        </div>
        <div className="space-y-1">
          {STEPS.map((s, i) => {
            const done    = s.num < current + 1;
            const active  = s.num === current + 1;
            return (
              <div key={s.num} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
                    done   ? 'bg-green-400 text-white' :
                    active ? 'bg-orange-500 text-white ring-4 ring-orange-500/30' :
                             'bg-white/10 text-white/50'
                  }`}>
                    {done ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`w-px flex-1 my-1 ${done ? 'bg-green-400/50' : 'bg-white/10'}`} style={{ minHeight: 28 }} />
                  )}
                </div>
                <div className="pb-6 pt-1">
                  <div className={`text-sm font-semibold ${active ? 'text-white' : done ? 'text-green-300' : 'text-white/50'}`}>{s.label}</div>
                  <div className={`text-xs mt-0.5 ${active ? 'text-sky-200' : 'text-white/30'}`}>{s.sub}</div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-2 pt-4 border-t border-white/10 text-xs text-sky-300 leading-relaxed">
          <Shield className="w-3.5 h-3.5 inline mr-1 text-sky-400" />
          We'll email a 6-digit code to verify your address.
        </div>
      </div>
    </aside>
  );
}

/* mobile step bar */
function MobileSteps({ current }: { current: number }) {
  return (
    <div className="lg:hidden flex items-center justify-center gap-2 mb-6">
      {STEPS.map((s, i) => (
        <div key={s.num} className="flex items-center gap-1">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
            s.num < current + 1 ? 'bg-green-500 text-white' :
            s.num === current + 1 ? 'bg-orange-500 text-white' : 'bg-ink-200 text-ink-500'
          }`}>
            {s.num < current + 1 ? <CheckCircle2 className="w-3.5 h-3.5" /> : s.num}
          </div>
          {i < STEPS.length - 1 && <div className={`w-8 h-px ${s.num <= current ? 'bg-green-400' : 'bg-ink-200'}`} />}
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN
───────────────────────────────────────────── */
export function BookIV() {
  const [params] = useSearchParams();
  const navigate  = useNavigate();
  const preselected = params.get('package') || '';

  const [allPackages, setAllPackages] = useState(IV_PACKAGES);
  const [dates, setDates] = useState<{ date: string; location: 'Freehold' | 'Brick' }[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [submitError, setSubmitError] = useState('');

  async function loadPackages() {
    try {
      const all = await getCmsIVPackages();
      const cms = all
        .filter(p => p.enabled && !p.id.startsWith('static-pkg-'))
        .map(p => ({ name: p.name, slug: p.slug, price: p.price }));
      const overrides = all.filter(p => p.enabled && p.id.startsWith('static-pkg-'));
      const merged = IV_PACKAGES.map(p => {
        const ov = overrides.find(o => o.slug === p.slug || o.id === `static-pkg-${p.slug}`);
        return ov ? { name: ov.name || p.name, slug: ov.slug || p.slug, price: ov.price || p.price } : p;
      });
      setAllPackages([...merged, ...cms]);
    } catch {
      setAllPackages(IV_PACKAGES);
    }
  }

  async function loadDates() {
    try {
      setDates(await getAvailableDates());
    } catch {
      setDates([]);
    }
  }

  useEffect(() => {
    loadPackages();
    loadDates();
    const channel = supabase
      .channel('booking-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'slot_configs' }, () => { loadDates(); })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cms_iv_packages' }, () => { loadPackages(); })
      .subscribe();
    const onFocus = () => { loadDates(); loadPackages(); };
    window.addEventListener('focus', onFocus);
    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener('focus', onFocus);
    };
  }, []);

  const [step, setStep] = useState(0);

  // Step 0 — package
  const [selectedPkg, setSelectedPkg] = useState(preselected);

  // Step 1 — slot
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  // Step 2 — OTP
  const [email, setEmail]           = useState(() => {
    try { return sessionStorage.getItem('iv-verify-email') || ''; } catch { return ''; }
  });
  const [otp, setOtp]               = useState('');
  const [otpSent, setOtpSent]       = useState(false);
  const [otpError, setOtpError]     = useState('');
  const [otpInfo, setOtpInfo]       = useState('');
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [resendIn, setResendIn]     = useState(0);
  const [verificationToken, setVerificationToken] = useState(() => {
    try { return sessionStorage.getItem('iv-verify-token') || ''; } catch { return ''; }
  });
  const stepCardRef = useRef<HTMLDivElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const otpInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [guideEmail, setGuideEmail] = useState(false);

  // Step 3 — medical intake form (exact form from spec)
  const [form, setForm] = useState({
    // basic
    name: '', dob: '', gender: '', phone: '',
    allergies: '', medications: '',
    // Q1 — prior IV infusion
    priorIV: '' as '' | 'no' | 'yes',
    priorIVDetail: '',
    priorIVProblems: '',
    // Q2 — treatment goal
    treatmentGoal: '',
    // Q3 — conditions checklist
    conditions: [] as string[],
    // Q4-Q7 yes/no
    dialysis: '' as '' | 'yes' | 'no',
    digoxin: '' as '' | 'yes' | 'no',
    africanDescentG6PD: '' as '' | 'yes' | 'no',
    decreasedGFR: '' as '' | 'yes' | 'no',
    decreasedGFRDetail: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [savedId, setSavedId]       = useState('');

  const pkgObj  = allPackages.find(p => p.slug === selectedPkg);
  const slotObj = dates.find(d => d.date === selectedDate);

  useEffect(() => {
    if (!selectedDate || !slotObj) {
      setAvailableTimes([]);
      return;
    }
    let alive = true;
    getAvailableTimesForSlot(selectedDate, slotObj.location)
      .then(times => { if (alive) setAvailableTimes(times); })
      .catch(() => { if (alive) setAvailableTimes([]); });
    return () => { alive = false; };
  }, [selectedDate, slotObj?.location]);

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  }

  function setF<K extends keyof typeof form>(k: K, v: typeof form[K]) {
    setForm(p => ({ ...p, [k]: v }));
  }

  function toggleCondition(c: string) {
    setForm(p => ({
      ...p,
      conditions: p.conditions.includes(c)
        ? p.conditions.filter(x => x !== c)
        : [...p.conditions, c],
    }));
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const header = document.getElementById('site-header');
      const offset = (header?.offsetHeight || 104) + 16;
      let target: HTMLElement | null = null;
      if (step === 2) target = otpSent ? otpInputRef.current : emailInputRef.current;
      else if (step === 3) target = nameInputRef.current;
      if (!target) target = stepCardRef.current;
      if (!target) return;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
      if (step === 2 && !otpSent) {
        emailInputRef.current?.focus({ preventScroll: true });
        setGuideEmail(true);
        window.setTimeout(() => setGuideEmail(false), 2200);
      } else if (step === 2 && otpSent) {
        otpInputRef.current?.focus({ preventScroll: true });
      } else if (step === 3) {
        nameInputRef.current?.focus({ preventScroll: true });
      }
    }, 360);
    return () => window.clearTimeout(timer);
  }, [step, otpSent]);

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = window.setTimeout(() => setResendIn(v => Math.max(0, v - 1)), 1000);
    return () => window.clearTimeout(t);
  }, [resendIn]);

  function resetOtp() {
    setOtpSent(false);
    setOtp('');
    setOtpError('');
    setOtpInfo('');
    setVerificationToken('');
    setResendIn(0);
    try { sessionStorage.removeItem('iv-verify-token'); sessionStorage.removeItem('iv-verify-email'); } catch { /* ignore */ }
  }

  // OTP send
  async function handleSendOtp() {
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setOtpError('Please enter a valid email address.'); return;
    }
    setSendingOtp(true);
    setOtpError('');
    try {
      const result = await sendBookingOtp(email);
      setOtpSent(true);
      setOtpInfo(result.message || `A 6-digit code was sent to ${email}.`);
      setResendIn(result.retryAfterSeconds || 60);
      setVerificationToken('');
      setOtp('');
    } catch (err) {
      setOtpError(err instanceof Error ? err.message : 'Could not send the verification code.');
    } finally {
      setSendingOtp(false);
    }
  }

  async function handleVerifyOtp() {
    setVerifyingOtp(true);
    setOtpError('');
    try {
      const result = await verifyBookingOtp(email, otp);
      setVerificationToken(result.verificationToken);
      try {
        sessionStorage.setItem('iv-verify-token', result.verificationToken);
        sessionStorage.setItem('iv-verify-email', result.email || email);
      } catch { /* ignore */ }
      setOtpInfo('Email verified. Continue to the medical form.');
      setStep(3);
    } catch (err) {
      setOtpError(err instanceof Error ? err.message : 'Could not verify the code.');
    } finally {
      setVerifyingOtp(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');
    let tokenFromStore = '';
    try { tokenFromStore = sessionStorage.getItem('iv-verify-token') || ''; } catch { tokenFromStore = ''; }
    const token = verificationToken || tokenFromStore;
    if (!token) {
      setSubmitError('Please verify your email before submitting.');
      setStep(2);
      setSubmitting(false);
      return;
    }
    const names = form.name.trim().split(/\s+/);
    try {
      const result = await createBookingRequest({
        verificationToken: token,
        email,
        packageName: pkgObj?.name || '',
        packageSlug: selectedPkg,
        location: slotObj?.location || 'Freehold',
        date: selectedDate,
        time: selectedTime,
        firstName: names[0] || '',
        lastName: names.slice(1).join(' '),
        phone: form.phone,
        dob: form.dob,
        gender: form.gender,
        allergies: form.allergies,
        medications: form.medications,
        medicalHistory: form.conditions.join(', '),
        reasonForVisit: form.treatmentGoal,
        intake: {
          priorIV: form.priorIV,
          priorIVDetail: form.priorIVDetail,
          priorIVProblems: form.priorIVProblems,
          dialysis: form.dialysis,
          digoxin: form.digoxin,
          africanDescentG6PD: form.africanDescentG6PD,
          decreasedGFR: form.decreasedGFR,
          decreasedGFRDetail: form.decreasedGFRDetail,
        },
      });
      setSavedId(result.id);
      try { sessionStorage.removeItem('iv-verify-token'); sessionStorage.removeItem('iv-verify-email'); } catch { /* ignore */ }
      setStep(4);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Could not submit your booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  const CONDITIONS = [
    'End Stage Renal Disease','Cerebral Hemorrhage','HYPERparathyroidism','G6PD Deficiency',
    'CHF (Congestive Heart Failure)','Myasthenia Gravis','HYPERmagnesium','Kidney/Renal Disease',
    'Hemolytic Anemia','Myxedema','Current UTI','Cardiac Arrhythmia','Low Blood Pressure',
  ];

  const TREATABLE = [
    'Asthma mild to moderate exacerbation','Asthma maintenance','Fatigue (min 3–4 infusions)',
    'Fibromyalgia/polyalgia rheumatic','Migraine, Acute','Depression','Cardiovascular disease',
    'Upper respiratory infection','Sinusitis, chronic','Allergic rhinitis','Narcotic withdrawal',
    'Urticaria, chronic','Athletic performance','Hyperthyroidism symptoms',
  ];

  return (
    <>
      <Seo title="Book IV Therapy | MD Abidi Arthritis Institute" description="Book your IV therapy session — select package, choose a slot, verify email, complete intake form." />

      {/* Top bar */}
      <div className="bg-primary-900 text-white py-4 border-b border-white/10">
        <div className="container-page flex items-center justify-between">
          <button onClick={() => navigate('/iv-packages/')} className="inline-flex items-center gap-1.5 text-sky-200 hover:text-white text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" /> IV Packages
          </button>
          <span className="font-serif font-bold text-base">Book IV Therapy Appointment</span>
          <span className="text-sky-300 text-sm hidden sm:block">Step {Math.min(step + 1, 4)} of 4</span>
        </div>
      </div>

      <div className="min-h-screen bg-ink-50 py-8">
        <div className="container-page">
          {step < 4 ? (
            <div className="flex gap-8 items-start">
              {/* Sidebar */}
              <Sidebar current={step} />

              {/* Main card */}
              <div ref={stepCardRef} className="flex-1 min-w-0 scroll-mt-36">
                <MobileSteps current={step} />
                <AnimatePresence mode="wait">

                  {/* ══ STEP 0: Package ══ */}
                  {step === 0 && (
                    <motion.div key="s0" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                      <div className="bg-white rounded-2xl shadow-soft border border-ink-100 p-8">
                        <h2 className="text-xl font-serif font-bold text-ink-900 mb-1">Select Your IV Package</h2>
                        <p className="text-sm text-ink-500 mb-6">Choose the IV infusion type you'd like to book</p>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {allPackages.map(pkg => (
                            <button key={pkg.slug} type="button" onClick={() => setSelectedPkg(pkg.slug)}
                              className={`flex items-center justify-between px-5 py-4 rounded-xl border-2 transition-all text-left ${
                                selectedPkg === pkg.slug ? 'border-primary-900 bg-primary-50' : 'border-ink-100 hover:border-primary-200 bg-white'
                              }`}
                            >
                              <div>
                                <div className={`font-semibold text-sm ${selectedPkg === pkg.slug ? 'text-primary-900' : 'text-ink-800'}`}>{pkg.name}</div>
                                <div className="text-xs text-ink-400 mt-0.5">IV Therapy Package</div>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className={`font-black text-lg ${selectedPkg === pkg.slug ? 'text-primary-900' : 'text-ink-600'}`}>${pkg.price}</span>
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPkg === pkg.slug ? 'border-primary-900 bg-primary-900' : 'border-ink-300'}`}>
                                  {selectedPkg === pkg.slug && <CheckCircle2 className="w-3 h-3 text-white" />}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                        <button onClick={() => selectedPkg && setStep(1)} disabled={!selectedPkg}
                          className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-6 py-3.5 rounded-full transition-all text-sm">
                          Continue <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* ══ STEP 1: Slot ══ */}
                  {step === 1 && (
                    <motion.div key="s1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                      <div className="bg-white rounded-2xl shadow-soft border border-ink-100 p-8">
                        <div className="flex items-center justify-between bg-primary-50 border border-primary-100 rounded-xl px-4 py-3 mb-6">
                          <div>
                            <div className="text-xs text-primary-600 font-semibold uppercase tracking-wider">Package</div>
                            <div className="font-bold text-primary-900 text-sm mt-0.5">{pkgObj?.name}</div>
                          </div>
                          <span className="font-black text-primary-900 text-xl">${pkgObj?.price}</span>
                        </div>
                        <h2 className="text-xl font-serif font-bold text-ink-900 mb-1">Choose Date & Time</h2>
                        <p className="text-sm text-ink-500 mb-5">Freehold: Mon / Wed / Fri &nbsp;·&nbsp; Brick: Tue / Thu</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
                          {dates.map(d => (
                            <button key={d.date} type="button" onClick={() => { setSelectedDate(d.date); setSelectedTime(''); }}
                              className={`rounded-xl border-2 px-3 py-3 text-left transition-all ${selectedDate === d.date ? 'border-primary-900 bg-primary-50' : 'border-ink-100 hover:border-primary-200'}`}>
                              <div className={`flex items-center gap-1 text-xs font-semibold mb-1 ${selectedDate === d.date ? 'text-primary-700' : 'text-ink-400'}`}>
                                <MapPin className="w-3 h-3" /> {d.location}
                              </div>
                              <div className={`font-bold text-sm ${selectedDate === d.date ? 'text-primary-900' : 'text-ink-800'}`}>
                                {new Date(d.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                              </div>
                            </button>
                          ))}
                        </div>
                        {selectedDate && (
                          <div>
                            <div className="flex items-center gap-2 text-sm font-semibold text-ink-700 mb-3"><Clock className="w-4 h-4 text-sky-400" /> Select a time</div>
                            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                              {availableTimes.length === 0 ? (
                                <p className="col-span-4 text-sm text-ink-400">No times left for this date. Please pick another day.</p>
                              ) : availableTimes.map(t => (
                                <button key={t} type="button" onClick={() => setSelectedTime(t)}
                                  className={`rounded-lg border-2 py-2 text-xs font-semibold transition-all ${selectedTime === t ? 'border-primary-900 bg-primary-900 text-white' : 'border-ink-100 hover:border-primary-300 text-ink-700'}`}>
                                  {t}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="flex gap-3 mt-6">
                          <button onClick={() => setStep(0)} className="flex-1 inline-flex items-center justify-center gap-2 border-2 border-ink-200 text-ink-700 font-semibold px-5 py-3.5 rounded-full text-sm hover:border-primary-900 transition-all">
                            <ArrowLeft className="w-4 h-4" /> Back
                          </button>
                          <button onClick={() => selectedDate && selectedTime && setStep(2)} disabled={!selectedDate || !selectedTime}
                            className="flex-[2] inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-6 py-3.5 rounded-full transition-all text-sm">
                            Continue <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* ══ STEP 2: OTP ══ */}
                  {step === 2 && (
                    <motion.div key="s2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                      <div className="bg-white rounded-2xl shadow-soft border border-ink-100 p-8">
                        <div className="w-14 h-14 rounded-2xl bg-sky-50 flex items-center justify-center mx-auto mb-4">
                          <Mail className="w-7 h-7 text-sky-500" />
                        </div>
                        <h2 className="text-xl font-serif font-bold text-ink-900 text-center mb-1">Verify Your Email</h2>
                        <p className="text-sm text-ink-500 text-center mb-6">We'll send a 6-digit code to the email you enter below</p>

                        <div className="max-w-md mx-auto space-y-4">
                          <div>
                            <label className="block text-xs font-semibold text-ink-700 mb-1.5">Email Address <span className="text-red-400">*</span></label>
                            <div className="flex gap-2">
                              <input ref={emailInputRef} type="email" value={email} onChange={e => { setEmail(e.target.value); if (otpSent) resetOtp(); }} placeholder="your@email.com"
                                className={`flex-1 border-2 rounded-xl px-4 py-3 text-sm outline-none transition-all duration-500 ${
                                  guideEmail
                                    ? 'border-orange-500 ring-4 ring-orange-400/40 bg-orange-50/40'
                                    : 'border-ink-200 focus:border-primary-900'
                                }`}
                                disabled={otpSent && !verificationToken} />
                              <button onClick={handleSendOtp} disabled={sendingOtp || (otpSent && resendIn > 0)}
                                className="inline-flex items-center gap-1.5 bg-primary-900 hover:bg-primary-800 disabled:opacity-50 text-white font-semibold text-xs px-4 py-3 rounded-xl transition-all whitespace-nowrap">
                                {sendingOtp ? <Loader2 className="w-4 h-4 animate-spin" /> : otpSent ? (resendIn > 0 ? `Resend in ${resendIn}s` : 'Resend OTP') : 'Send OTP'}
                              </button>
                            </div>
                          </div>

                          {otpSent && (
                            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                              className="bg-sky-50 border-2 border-sky-200 rounded-xl p-4 text-center">
                              <p className="text-xs text-sky-600 font-semibold uppercase tracking-wider mb-1">Check your inbox</p>
                              <p className="text-sm text-sky-800">{otpInfo || `A verification code was sent to ${email}.`}</p>
                              <p className="text-xs text-sky-500 mt-2">The code expires in 10 minutes and can be used only once. Check spam if you don't see it.</p>
                              <button type="button" onClick={resetOtp} className="mt-2 text-xs font-semibold text-primary-800 underline">
                                Use a different email
                              </button>
                            </motion.div>
                          )}

                          {otpSent && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                              <label className="block text-xs font-semibold text-ink-700 mb-1.5">Enter the 6-digit code</label>
                              <input ref={otpInputRef} type="text" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="_ _ _ _ _ _" maxLength={6}
                                className="w-full border-2 border-ink-200 focus:border-primary-900 rounded-xl px-4 py-3 text-sm outline-none transition-colors tracking-[0.5em] text-center font-bold text-2xl" />
                              {otpError && <p className="text-xs text-red-500 mt-1.5">{otpError}</p>}
                            </motion.div>
                          )}
                          {!otpSent && otpError && <p className="text-xs text-red-500">{otpError}</p>}
                        </div>

                        <div className="flex gap-3 mt-6 max-w-md mx-auto">
                          <button onClick={() => setStep(1)} className="flex-1 inline-flex items-center justify-center gap-2 border-2 border-ink-200 text-ink-700 font-semibold px-5 py-3.5 rounded-full text-sm hover:border-primary-900 transition-all">
                            <ArrowLeft className="w-4 h-4" /> Back
                          </button>
                          {otpSent && (
                            <button onClick={handleVerifyOtp} disabled={otp.length !== 6 || verifyingOtp}
                              className="flex-[2] inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-6 py-3.5 rounded-full transition-all text-sm">
                              {verifyingOtp ? <><Loader2 className="w-4 h-4 animate-spin" /> Verifying…</> : <>Verify & Continue <ChevronRight className="w-4 h-4" /></>}
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* ══ STEP 3: Medical Intake Form ══ */}
                  {step === 3 && (
                    <motion.div key="s3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                      <form onSubmit={handleSubmit}>
                        {/* Booking summary strip */}
                        <div className="bg-primary-900 text-white rounded-2xl px-6 py-4 mb-5 grid sm:grid-cols-4 gap-3 text-sm">
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-orange-400 mt-0.5 shrink-0" />
                            <div><div className="text-xs text-sky-300">Package</div><div className="font-bold">{pkgObj?.name} — ${pkgObj?.price}</div></div>
                          </div>
                          <div className="flex items-start gap-2">
                            <CalendarDays className="w-4 h-4 text-orange-400 mt-0.5 shrink-0" />
                            <div><div className="text-xs text-sky-300">Date</div><div className="font-bold">{formatDate(selectedDate)}</div></div>
                          </div>
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-orange-400 mt-0.5 shrink-0" />
                            <div><div className="text-xs text-sky-300">Location · Time</div><div className="font-bold">{slotObj?.location} · {selectedTime}</div></div>
                          </div>
                          <div className="flex items-start gap-2">
                            <Mail className="w-4 h-4 text-orange-400 mt-0.5 shrink-0" />
                            <div><div className="text-xs text-sky-300">Verified email</div><div className="font-bold break-all">{email}</div></div>
                          </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-soft border border-ink-100 overflow-hidden">
                          {/* Form header */}
                          <div className="border-b border-ink-100 px-8 py-5 flex items-center justify-between">
                            <div>
                              <h2 className="text-lg font-serif font-bold text-ink-900">IV Hydration Medical History Form</h2>
                              <p className="text-xs text-ink-500 mt-0.5">Date: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                            </div>
                            <div className="text-right text-xs text-ink-500">
                              <div className="font-bold text-ink-900 text-sm">MD ABIDI</div>
                              <div>Arthritis Institute</div>
                            </div>
                          </div>

                          <div className="p-8 space-y-8">

                            {/* ── Basic Info ── */}
                            <div className="grid sm:grid-cols-2 gap-5">
                              <div>
                                <label className="block text-xs font-semibold text-ink-700 mb-1.5">Full Name <span className="text-red-400">*</span></label>
                                <input ref={nameInputRef} required type="text" value={form.name} onChange={e => setF('name', e.target.value)} placeholder="First Last" className="w-full border-b-2 border-ink-300 focus:border-primary-900 px-0 py-2 text-sm outline-none transition-colors bg-transparent" />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-ink-700 mb-1.5">Phone Number <span className="text-red-400">*</span></label>
                                <input required type="tel" value={form.phone} onChange={e => setF('phone', e.target.value)} placeholder="(555) 000-0000" className="w-full border-b-2 border-ink-300 focus:border-primary-900 px-0 py-2 text-sm outline-none transition-colors bg-transparent" />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-ink-700 mb-1.5">Date of Birth <span className="text-red-400">*</span></label>
                                <input required type="date" value={form.dob} onChange={e => setF('dob', e.target.value)} className="w-full border-b-2 border-ink-300 focus:border-primary-900 px-0 py-2 text-sm outline-none transition-colors bg-transparent" />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-ink-700 mb-1.5">Gender</label>
                                <select value={form.gender} onChange={e => setF('gender', e.target.value)} className="w-full border-b-2 border-ink-300 focus:border-primary-900 px-0 py-2 text-sm outline-none transition-colors bg-transparent">
                                  <option value="">Select</option>
                                  <option>Male</option><option>Female</option><option>Non-binary</option><option>Prefer not to say</option>
                                </select>
                              </div>
                              <div className="sm:col-span-2">
                                <label className="block text-xs font-semibold text-ink-700 mb-1.5">Allergies</label>
                                <input type="text" value={form.allergies} onChange={e => setF('allergies', e.target.value)} placeholder="List any known allergies, or 'None'" className="w-full border-b-2 border-ink-300 focus:border-primary-900 px-0 py-2 text-sm outline-none transition-colors bg-transparent" />
                              </div>
                              <div className="sm:col-span-2">
                                <label className="block text-xs font-semibold text-ink-700 mb-1.5">Current Medications</label>
                                <input type="text" value={form.medications} onChange={e => setF('medications', e.target.value)} placeholder="List current medications, or 'None'" className="w-full border-b-2 border-ink-300 focus:border-primary-900 px-0 py-2 text-sm outline-none transition-colors bg-transparent" />
                              </div>
                            </div>

                            <hr className="border-ink-200" />

                            {/* ── Q1 ── */}
                            <div>
                              <p className="text-sm font-semibold text-ink-900 mb-3">
                                <span className="text-primary-900 mr-2">1.</span>
                                Have you ever had a <strong>nutrient IV infusion</strong>?
                              </p>
                              <div className="flex gap-6 mb-3">
                                {(['no', 'yes'] as const).map(v => (
                                  <label key={v} className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="priorIV" value={v} checked={form.priorIV === v} onChange={() => setF('priorIV', v)} className="w-4 h-4 accent-primary-900" />
                                    <span className="text-sm text-ink-700 capitalize">{v === 'yes' ? 'Yes (when and what)' : 'No'}</span>
                                  </label>
                                ))}
                              </div>
                              {form.priorIV === 'yes' && (
                                <input type="text" value={form.priorIVDetail} onChange={e => setF('priorIVDetail', e.target.value)} placeholder="When and what type of infusion?" className="w-full border-b-2 border-ink-300 focus:border-primary-900 px-0 py-2 text-sm outline-none transition-colors bg-transparent mb-3" />
                              )}
                              <div>
                                <label className="block text-xs text-ink-500 mb-1">Problems with prior infusions including reactions, allergies or access issues?</label>
                                <input type="text" value={form.priorIVProblems} onChange={e => setF('priorIVProblems', e.target.value)} placeholder="Describe or 'None'" className="w-full border-b-2 border-ink-300 focus:border-primary-900 px-0 py-2 text-sm outline-none transition-colors bg-transparent" />
                              </div>
                            </div>

                            {/* ── Q2 ── */}
                            <div>
                              <p className="text-sm font-semibold text-ink-900 mb-3">
                                <span className="text-primary-900 mr-2">2.</span>
                                What condition are you treating and/or what is your treatment goal?
                              </p>
                              <textarea required rows={2} value={form.treatmentGoal} onChange={e => setF('treatmentGoal', e.target.value)} placeholder="Describe your condition or treatment goal" className="w-full border-b-2 border-ink-300 focus:border-primary-900 px-0 py-2 text-sm outline-none transition-colors bg-transparent resize-none" />
                              <div className="mt-3 bg-sky-50 border border-sky-100 rounded-xl p-4">
                                <p className="text-xs font-semibold text-sky-800 mb-2">IV Nutrition Cocktails have been known to treat:</p>
                                <div className="grid sm:grid-cols-2 gap-x-6 gap-y-0.5">
                                  {TREATABLE.map(t => (
                                    <span key={t} className="text-xs text-sky-700 flex items-start gap-1.5 py-0.5">
                                      <span className="text-sky-400 mt-0.5">•</span> {t}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* ── Q3 ── */}
                            <div>
                              <p className="text-sm font-semibold text-ink-900 mb-3">
                                <span className="text-primary-900 mr-2">3.</span>
                                Do you have any of the following conditions?
                                <span className="ml-2 text-xs text-ink-400 font-normal">(Check all that apply, or leave blank if None)</span>
                              </p>
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {CONDITIONS.map(c => (
                                  <label key={c} className="flex items-start gap-2 cursor-pointer group">
                                    <input type="checkbox" checked={form.conditions.includes(c)} onChange={() => toggleCondition(c)} className="w-4 h-4 accent-primary-900 mt-0.5 shrink-0" />
                                    <span className="text-xs text-ink-700 group-hover:text-primary-900 leading-snug">{c}</span>
                                  </label>
                                ))}
                              </div>
                            </div>

                            <hr className="border-ink-200" />

                            {/* ── Q4–Q7 Yes/No ── */}
                            <div className="space-y-4">
                              {[
                                { key: 'dialysis'         as const, q: 'Have you been told you need to start dialysis or are you currently on dialysis?' },
                                { key: 'digoxin'          as const, q: 'Are you taking or have you been told you need to take Digoxin?' },
                                { key: 'africanDescentG6PD' as const, q: 'Are you of African, Middle Eastern or Asian descent? (G6PD screening for Vitamin C infusion)' },
                                { key: 'decreasedGFR'     as const, q: 'Have you been told you have a decreased GFR or kidney problem?' },
                              ].map((item, idx) => (
                                <div key={item.key}>
                                  <div className="flex items-start justify-between gap-4">
                                    <p className="text-sm text-ink-800 flex-1">
                                      <span className="text-primary-900 font-semibold mr-2">{idx + 4}.</span>
                                      {item.q}
                                    </p>
                                    <div className="flex gap-4 shrink-0">
                                      {(['yes', 'no'] as const).map(v => (
                                        <label key={v} className="flex items-center gap-1.5 cursor-pointer">
                                          <input type="radio" name={item.key} value={v} checked={form[item.key] === v} onChange={() => setF(item.key, v)} className="w-4 h-4 accent-primary-900" />
                                          <span className="text-sm font-medium text-ink-700 capitalize">{v.charAt(0).toUpperCase() + v.slice(1)}</span>
                                        </label>
                                      ))}
                                    </div>
                                  </div>
                                  {item.key === 'decreasedGFR' && form.decreasedGFR === 'yes' && (
                                    <div className="mt-2 pl-4">
                                      <input type="text" value={form.decreasedGFRDetail} onChange={e => setF('decreasedGFRDetail', e.target.value)} placeholder="If Yes, please explain" className="w-full border-b-2 border-ink-300 focus:border-primary-900 px-0 py-1.5 text-sm outline-none transition-colors bg-transparent" />
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>

                            <hr className="border-ink-200" />

                            {/* ── Disclaimer ── */}
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 leading-relaxed">
                              <strong>Please note:</strong> This is a <strong>booking request</strong>, not a confirmed appointment. Dr. Abidi will review your medical history form and approve or decline it in the admin portal. Approved times appear on the clinic calendar.
                            </div>

                            {submitError && (
                              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-600">{submitError}</div>
                            )}

                            {/* ── Submit ── */}
                            <div className="flex gap-3 pt-2">
                              <button type="button" onClick={() => setStep(2)} className="flex-1 inline-flex items-center justify-center gap-2 border-2 border-ink-200 text-ink-700 font-semibold px-5 py-3.5 rounded-full text-sm hover:border-primary-900 transition-all">
                                <ArrowLeft className="w-4 h-4" /> Back
                              </button>
                              <button type="submit" disabled={submitting} className="flex-[2] inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold px-6 py-3.5 rounded-full transition-all text-sm">
                                {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</> : <>Submit Booking Request <ChevronRight className="w-4 h-4" /></>}
                              </button>
                            </div>
                          </div>
                        </div>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            /* ══ STEP 4: Acknowledgement ══ */
            <div className="max-w-lg mx-auto">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} className="bg-white rounded-2xl shadow-soft border border-ink-100 p-10 text-center">
                <div className="w-20 h-20 rounded-full bg-green-50 border-4 border-green-100 flex items-center justify-center mx-auto mb-5">
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-ink-900 mb-2">Request Received!</h2>
                <p className="text-ink-500 leading-relaxed max-w-md mx-auto mb-6">
                  Thank you, <strong>{form.name.split(' ')[0]}</strong>. Your booking request has been submitted. Dr. Abidi will review your intake form and confirm your appointment via email.
                </p>
                <div className="bg-ink-50 border border-ink-100 rounded-xl p-5 mb-6 text-left space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-ink-500">Booking ID</span><span className="font-bold text-primary-900">{savedId}</span></div>
                  <div className="flex justify-between"><span className="text-ink-500">Package</span><span className="font-semibold">{pkgObj?.name}</span></div>
                  <div className="flex justify-between"><span className="text-ink-500">Date</span><span className="font-semibold">{formatDate(selectedDate)}</span></div>
                  <div className="flex justify-between"><span className="text-ink-500">Time</span><span className="font-semibold">{selectedTime}</span></div>
                  <div className="flex justify-between"><span className="text-ink-500">Location</span><span className="font-semibold">{slotObj?.location}, NJ</span></div>
                  <div className="flex justify-between"><span className="text-ink-500">Status</span><span className="font-semibold text-orange-500">Pending Doctor Review</span></div>
                </div>
                <p className="text-xs text-ink-400 mb-8">An acknowledgement has been sent to <strong>{email}</strong>. You'll receive confirmation once the doctor approves.</p>
                <div className="flex flex-wrap justify-center gap-3">
                  <button onClick={() => navigate('/iv-packages/')} className="inline-flex items-center gap-2 border-2 border-ink-200 hover:border-primary-900 text-ink-700 font-semibold px-6 py-3 rounded-full text-sm transition-all">
                    Back to IV Packages
                  </button>
                  <button onClick={() => navigate('/')} className="inline-flex items-center gap-2 bg-primary-900 hover:bg-primary-800 text-white font-semibold px-6 py-3 rounded-full text-sm transition-all">
                    Go to Home
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
