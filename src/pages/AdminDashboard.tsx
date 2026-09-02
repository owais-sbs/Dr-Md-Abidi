import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, CalendarDays, CheckCircle2, Clock, PauseCircle,
  XCircle, CheckCheck, Eye, X, ChevronDown, ChevronUp, RefreshCw,
  LogOut, Syringe, FileText, Search, MapPin, Mail, MessageSquare,
  Phone, TrendingUp, ArrowUpRight, Inbox, Activity, Plus, Pencil,
  Trash2, ToggleLeft, ToggleRight, Save, AlertCircle, Lock, Unlock,
  ChevronLeft, ChevronRight, List, CalendarRange, StickyNote, Loader2,
} from 'lucide-react';
import { Seo } from '@/components/common/Seo';
import {
  getAppointments, updateAppointment,
  getContactMessages, updateContactStatus,
  getSlotConfigs, saveSlotConfig,
  TIME_SLOTS,
  type Appointment, type AppointmentStatus,
  type ContactMessage, type ContactStatus, type SlotConfig,
} from '@/data/appointments';
import {
  getCmsConditions, saveCmsCondition, deleteCmsCondition,
  getCmsIVPackages, saveCmsIVPackage, deleteCmsIVPackage,
  newId, makeSlug,
  type CmsCondition, type CmsIVPackage,
} from '@/data/cms';
import { conditions as staticConditions } from '@/data/conditions';
import { IV_PACKAGES as staticIVPackages } from '@/data/appointments';
import { site } from '@/data/site';
import { supabase } from '@/lib/supabase';
import { AdminLogin } from '@/pages/AdminLogin';
import { clinicForDate } from '@/lib/cmsLive';
import { reviewBooking } from '@/lib/bookingApi';

/* ─── Types ─────────────────────────────── */
type NavPage = 'overview' | 'appointments' | 'calendar' | 'slots' | 'messages' | 'conditions' | 'iv-packages';
const NAV_PAGES: NavPage[] = ['overview', 'appointments', 'calendar', 'slots', 'messages', 'conditions', 'iv-packages'];
function isNavPage(v: string | undefined): v is NavPage {
  return !!v && (NAV_PAGES as string[]).includes(v);
}

/* ─── Status config ─────────────────────── */
const APPT_STATUS: Record<AppointmentStatus, { label: string; dot: string; text: string; bg: string; border: string; icon: React.ElementType }> = {
  pending:   { label: 'Pending',   dot: 'bg-orange-400', text: 'text-orange-600', bg: 'bg-orange-50',  border: 'border-orange-200', icon: Clock },
  approved:  { label: 'Approved',  dot: 'bg-green-500',  text: 'text-green-600',  bg: 'bg-green-50',   border: 'border-green-200',  icon: CheckCircle2 },
  hold:      { label: 'On Hold',   dot: 'bg-blue-500',   text: 'text-blue-600',   bg: 'bg-blue-50',    border: 'border-blue-200',   icon: PauseCircle },
  completed: { label: 'Completed', dot: 'bg-teal-500',   text: 'text-teal-600',   bg: 'bg-teal-50',    border: 'border-teal-200',   icon: CheckCheck },
  cancelled: { label: 'Cancelled', dot: 'bg-red-400',    text: 'text-red-600',    bg: 'bg-red-50',     border: 'border-red-200',    icon: XCircle },
  rejected:  { label: 'Declined',  dot: 'bg-rose-500',   text: 'text-rose-600',   bg: 'bg-rose-50',    border: 'border-rose-200',   icon: XCircle },
};

const MSG_STATUS: Record<ContactStatus, { label: string; text: string; bg: string; border: string }> = {
  new:     { label: 'New',     text: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-200' },
  read:    { label: 'Read',    text: 'text-ink-500',    bg: 'bg-ink-50',    border: 'border-ink-200' },
  replied: { label: 'Replied', text: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-200' },
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}
function fmtTs(iso: string) {
  return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}
function isoDate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/* ─── SIDEBAR ───────────────────────────── */
const NAV_SECTIONS = [
  { title: 'Main',    items: [{ id: 'overview'    as NavPage, label: 'Overview',           icon: LayoutDashboard }] },
  { title: 'Bookings',items: [
    { id: 'appointments' as NavPage, label: 'Appointments', icon: List },
    { id: 'calendar'     as NavPage, label: 'Calendar',     icon: CalendarRange },
    { id: 'slots'        as NavPage, label: 'Slot Management', icon: Clock },
  ]},
  { title: 'Content', items: [
    { id: 'conditions'  as NavPage, label: 'Conditions We Treat', icon: Activity },
    { id: 'iv-packages' as NavPage, label: 'IV Packages',         icon: Syringe },
  ]},
  { title: 'Enquiries', items: [{ id: 'messages' as NavPage, label: 'Contact Messages', icon: MessageSquare }] },
];

function Sidebar({ page, setPage, counts, onLogout }: {
  page: NavPage; setPage: (p: NavPage) => void;
  counts: Record<string, number>;
  onLogout: () => void;
}) {
  function badge(id: NavPage) {
    if (id === 'appointments') return counts.pending;
    if (id === 'messages')     return counts.newMessages;
    return 0;
  }
  return (
    <aside className="w-60 shrink-0 flex flex-col h-full overflow-hidden" style={{ background: '#0f172a' }}>
      {/* Logo */}
      <div className="px-5 py-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
        <div className="bg-white rounded-xl px-3 py-2.5 inline-block mb-3">
          <img src={site.logo} alt="MD Abidi" className="h-8 w-auto" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <p className="text-xs font-semibold text-slate-400">Admin Portal</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto hide-scrollbar">
        {NAV_SECTIONS.map(sec => (
          <div key={sec.title}>
            <p className="text-[10px] font-bold uppercase tracking-widest px-3 mb-2" style={{ color: 'rgba(255,255,255,0.2)' }}>{sec.title}</p>
            <div className="space-y-0.5">
              {sec.items.map(item => {
                const active = page === item.id;
                const b = badge(item.id);
                return (
                  <button key={item.id} onClick={() => setPage(item.id)}
                    className="w-full flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-xl text-left transition-all group"
                    style={{
                      background: active ? 'rgba(59,130,246,0.2)' : 'transparent',
                      border: active ? '1px solid rgba(59,130,246,0.3)' : '1px solid transparent',
                    }}>
                    <span className="flex items-center gap-2.5">
                      <item.icon className="w-4 h-4 shrink-0 transition-colors"
                        style={{ color: active ? '#60a5fa' : 'rgba(255,255,255,0.35)' }} />
                      <span className="text-xs font-medium transition-colors"
                        style={{ color: active ? '#f1f5f9' : 'rgba(255,255,255,0.55)' }}>
                        {item.label}
                      </span>
                    </span>
                    {b > 0 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center"
                        style={{ background: active ? '#3b82f6' : 'rgba(255,255,255,0.1)', color: active ? '#fff' : 'rgba(255,255,255,0.4)' }}>
                        {b}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 space-y-1" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="px-3.5 py-2 rounded-xl text-xs font-medium" style={{ color: 'rgba(255,255,255,0.3)' }}>
          <div className="font-semibold mb-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>MD Abidi Arthritis Institute</div>
          <div>Admin v1.0</div>
        </div>
        <a href="/" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition-all text-xs font-medium"
          style={{ color: 'rgba(255,255,255,0.35)' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}>
          <ArrowUpRight className="w-3.5 h-3.5" /> View Website
        </a>
        <button onClick={onLogout}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition-all text-xs font-medium text-left"
          style={{ color: 'rgba(255,255,255,0.35)' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#fca5a5')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}>
          <LogOut className="w-3.5 h-3.5" /> Sign out
        </button>
      </div>
    </aside>
  );
}

/* ─── KPI CARD ──────────────────────────── */
function KpiCard({ label, value, icon: Icon, color, bg, borderColor, sub, onClick }: {
  label: string; value: number | string; icon: React.ElementType;
  color: string; bg: string; borderColor: string; sub?: string; onClick?: () => void;
}) {
  return (
    <button onClick={onClick}
      className="bg-white rounded-2xl p-5 text-left transition-all w-full group hover:-translate-y-0.5"
      style={{ border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', borderLeft: `4px solid ${borderColor}` }}>
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: bg }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
      </div>
      <div className="text-3xl font-black text-slate-900 leading-none">{value}</div>
      <div className="text-sm text-slate-500 mt-1.5 font-medium">{label}</div>
      {sub && <div className="text-xs font-semibold mt-0.5" style={{ color }}>{sub}</div>}
    </button>
  );
}

/* ─── APPT STATUS BADGE ─────────────────── */
function ApptBadge({ status }: { status: AppointmentStatus }) {
  const c = APPT_STATUS[status];
  return <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${c.bg} ${c.border} ${c.text}`}><span className={`w-1.5 h-1.5 rounded-full shrink-0 ${c.dot}`}/>{c.label}</span>;
}

/* ─── APPOINTMENT ROW ───────────────────── */
function ApptRow({ appt, expanded, onToggle, onAction }: {
  appt: Appointment; expanded: boolean;
  onToggle: () => void;
  onAction: (id: string, patch: Partial<Appointment>) => void;
}) {
  const [notes, setNotes] = useState(appt.adminNotes || '');

  return (
    <div className="bg-white rounded-2xl overflow-hidden transition-shadow hover:shadow-md" style={{ border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
      <div className="px-5 py-4 flex flex-wrap items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-700 to-primary-900 text-white flex items-center justify-center font-bold text-sm shrink-0">
          {(appt.firstName?.[0]||'?').toUpperCase()}
        </div>
        <div className="min-w-[140px]">
          <div className="font-bold text-ink-900 text-sm">{appt.firstName} {appt.lastName}</div>
          <div className="text-[10px] text-ink-400 font-mono">{appt.id}</div>
        </div>
        <ApptBadge status={appt.status} />
        <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-ink-500 flex-1">
          <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3 text-sky-400"/>{fmtDate(appt.date)} · {appt.time}</span>
          <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-sky-400"/>{appt.location}</span>
          <span className="flex items-center gap-1"><Syringe className="w-3 h-3 text-sky-400"/>{appt.packageName}</span>
          <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-sky-400"/>{appt.email}</span>
        </div>
        <div className="text-[10px] text-ink-400 shrink-0">{fmtTs(appt.createdAt)}</div>
        <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
          {appt.status==='pending'   && <><button onClick={()=>onAction(appt.id,{status:'approved'})}  className="h-7 px-3 text-[11px] font-bold bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/>Approve</button><button onClick={()=>onAction(appt.id,{status:'hold'})} className="h-7 px-3 text-[11px] font-bold bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center gap-1"><PauseCircle className="w-3 h-3"/>Hold</button><button onClick={()=>onAction(appt.id,{status:'rejected'})} className="h-7 px-3 text-[11px] font-bold bg-rose-500 hover:bg-rose-600 text-white rounded-full flex items-center gap-1"><XCircle className="w-3 h-3"/>Decline</button></>}
          {appt.status==='approved'  && <><button onClick={()=>onAction(appt.id,{status:'completed'})} className="h-7 px-3 text-[11px] font-bold bg-teal-500 hover:bg-teal-600 text-white rounded-full flex items-center gap-1"><CheckCheck className="w-3 h-3"/>Complete</button><button onClick={()=>onAction(appt.id,{status:'cancelled'})} className="h-7 px-3 text-[11px] font-bold bg-red-400 hover:bg-red-500 text-white rounded-full flex items-center gap-1"><XCircle className="w-3 h-3"/>Cancel</button></>}
          {appt.status==='hold'      && <><button onClick={()=>onAction(appt.id,{status:'approved'})}  className="h-7 px-3 text-[11px] font-bold bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/>Approve</button><button onClick={()=>onAction(appt.id,{status:'rejected'})} className="h-7 px-3 text-[11px] font-bold bg-rose-500 hover:bg-rose-600 text-white rounded-full flex items-center gap-1"><XCircle className="w-3 h-3"/>Decline</button></>}
          {(appt.status==='completed'||appt.status==='cancelled'||appt.status==='rejected') && <button onClick={()=>onAction(appt.id,{status:'pending'})} className="h-7 px-3 text-[11px] font-bold bg-orange-400 hover:bg-orange-500 text-white rounded-full flex items-center gap-1"><Clock className="w-3 h-3"/>Reopen</button>}
          <button onClick={onToggle} className="h-7 w-7 flex items-center justify-center border border-ink-200 hover:border-primary-900 text-ink-500 hover:text-primary-900 rounded-full transition-all">
            {expanded?<ChevronUp className="w-3.5 h-3.5"/>:<ChevronDown className="w-3.5 h-3.5"/>}
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} transition={{duration:0.28}} className="overflow-hidden">
            <div className="border-t border-ink-100 bg-ink-50/50 p-5">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2"><FileText className="w-4 h-4" style={{ color: '#1d4ed8' }}/>Patient Intake Form</h4>
                <button onClick={onToggle} className="text-ink-400 hover:text-ink-700 w-6 h-6 flex items-center justify-center rounded-full hover:bg-ink-100 transition-all"><X className="w-3.5 h-3.5"/></button>
              </div>
              <div className="grid sm:grid-cols-3 gap-2.5 mb-3">
                {[['Full Name',`${appt.firstName} ${appt.lastName}`],['Email',appt.email],['Phone',appt.phone],['Date of Birth',appt.dob],['Gender',appt.gender],['Email verified',appt.emailVerified?'Yes':'No']].map(([l,v])=>(
                  <div key={l} className="bg-white rounded-xl p-3 border border-ink-100">
                    <div className="text-[10px] text-ink-400 uppercase tracking-wider mb-0.5">{l}</div>
                    <div className="font-semibold text-ink-800 text-xs">{v||'—'}</div>
                  </div>
                ))}
              </div>
              <div className="grid sm:grid-cols-2 gap-2.5 mb-4">
                {[['Allergies',appt.allergies],['Medications',appt.medications],['Medical History',appt.medicalHistory],['Reason / Goal',appt.reasonForVisit]].map(([l,v])=>(
                  <div key={l} className="bg-white rounded-xl p-3 border border-ink-100">
                    <div className="text-[10px] text-ink-400 uppercase tracking-wider mb-0.5">{l}</div>
                    <div className="text-xs text-ink-700 leading-relaxed">{v||'—'}</div>
                  </div>
                ))}
              </div>
              {/* Admin notes */}
              <div className="bg-white rounded-xl border border-ink-200 p-3 mb-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <StickyNote className="w-3.5 h-3.5 text-orange-400"/>
                  <span className="text-[10px] text-ink-500 font-bold uppercase tracking-wider">Admin Notes</span>
                </div>
                <textarea rows={2} value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Add internal notes..."
                  className="w-full text-xs text-ink-700 resize-none outline-none border-0 bg-transparent leading-relaxed"/>
                <button onClick={()=>onAction(appt.id,{adminNotes:notes})} className="mt-2 h-7 px-3 text-[11px] font-bold bg-primary-900 hover:bg-primary-800 text-white rounded-full flex items-center gap-1">
                  <Save className="w-3 h-3"/>Save Notes
                </button>
              </div>
              {/* Quick status change */}
              <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-ink-200">
                <span className="text-xs text-ink-400 mr-1 font-medium">Change status:</span>
                {(Object.keys(APPT_STATUS) as AppointmentStatus[]).map(s=>(
                  <button key={s} onClick={()=>onAction(appt.id,{status:s})} disabled={appt.status===s}
                    className={`h-7 px-3 text-[11px] font-bold rounded-full transition-all disabled:opacity-35 disabled:cursor-not-allowed ${APPT_STATUS[s].bg} ${APPT_STATUS[s].border} ${APPT_STATUS[s].text} border`}>
                    {APPT_STATUS[s].label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── MESSAGE ROW ───────────────────────── */
function MsgRow({ msg, expanded, onToggle, onStatus }: {
  msg: ContactMessage; expanded: boolean;
  onToggle: () => void; onStatus: (id: string, s: ContactStatus) => void;
}) {
  return (
    <div className={`bg-white rounded-2xl border shadow-soft overflow-hidden hover:shadow-card transition-shadow ${msg.status==='new'?'border-violet-200':'border-ink-100'}`}>
      <div className="px-5 py-4 flex flex-wrap items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-violet-700 text-white flex items-center justify-center font-bold text-sm shrink-0">{(msg.name?.[0]||'?').toUpperCase()}</div>
        <div className="min-w-[140px]"><div className="font-bold text-ink-900 text-sm">{msg.name}</div><div className="text-xs text-ink-400">{msg.email}</div></div>
        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${MSG_STATUS[msg.status].bg} ${MSG_STATUS[msg.status].border} ${MSG_STATUS[msg.status].text}`}>{MSG_STATUS[msg.status].label}</span>
        <div className="flex-1 text-xs text-ink-500 truncate max-w-xs">{msg.message}</div>
        {msg.phone && <span className="flex items-center gap-1 text-xs text-ink-400"><Phone className="w-3 h-3"/>{msg.phone}</span>}
        <div className="text-[10px] text-ink-400 shrink-0">{fmtTs(msg.createdAt)}</div>
        <div className="flex items-center gap-1.5 shrink-0">
          {msg.status!=='replied' && <button onClick={()=>onStatus(msg.id,'replied')} className="h-7 px-3 text-[11px] font-bold bg-green-500 hover:bg-green-600 text-white rounded-full">Mark Replied</button>}
          {msg.status!=='read'    && <button onClick={()=>onStatus(msg.id,'read')}    className="h-7 px-3 text-[11px] font-bold bg-ink-200 hover:bg-ink-300 text-ink-700 rounded-full">Mark Read</button>}
          <button onClick={onToggle} className="h-7 w-7 flex items-center justify-center border border-ink-200 hover:border-primary-900 rounded-full transition-all text-ink-500">
            {expanded?<ChevronUp className="w-3.5 h-3.5"/>:<Eye className="w-3.5 h-3.5"/>}
          </button>
        </div>
      </div>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} transition={{duration:0.28}} className="overflow-hidden">
            <div className="border-t border-ink-100 bg-ink-50/50 p-5">
              <div className="flex justify-between mb-3"><h4 className="font-bold text-ink-900 text-sm">Full Message</h4><button onClick={onToggle}><X className="w-3.5 h-3.5 text-ink-400"/></button></div>
              <div className="bg-white rounded-xl border border-ink-100 p-4 text-sm text-ink-700 leading-relaxed whitespace-pre-wrap">{msg.message}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── CALENDAR VIEW ─────────────────────── */
function CalendarView({ appointments }: { appointments: Appointment[] }) {
  const today = new Date();
  const [cur, setCur] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [selDay, setSelDay] = useState<number | null>(today.getDate());

  const daysInMonth = new Date(cur.year, cur.month + 1, 0).getDate();
  const firstDay    = new Date(cur.year, cur.month, 1).getDay();
  const monthName   = new Date(cur.year, cur.month).toLocaleString('en-US', { month: 'long', year: 'numeric' });

  function dateStrFor(d: number) {
    return `${cur.year}-${String(cur.month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
  }
  function apptsByDate(d: number) {
    return appointments.filter(a => a.date === dateStrFor(d) && a.status === 'approved');
  }

  const statusColors: Record<AppointmentStatus, string> = {
    pending: 'bg-orange-400', approved: 'bg-green-500', hold: 'bg-blue-400',
    completed: 'bg-teal-500', cancelled: 'bg-red-400', rejected: 'bg-rose-500',
  };

  const selectedAppts = selDay ? apptsByDate(selDay) : [];

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-ink-100 shadow-soft overflow-hidden">
        <div className="px-6 py-4 border-b border-ink-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={()=>setCur(p=>{ const d=new Date(p.year,p.month-1); return {year:d.getFullYear(),month:d.getMonth()}; })}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-ink-50 border border-ink-100 transition-all">
              <ChevronLeft className="w-4 h-4"/>
            </button>
            <div>
              <h2 className="font-bold text-ink-900 text-base">{monthName}</h2>
              <p className="text-[10px] text-ink-400 font-medium">Approved appointments only</p>
            </div>
            <button onClick={()=>setCur(p=>{ const d=new Date(p.year,p.month+1); return {year:d.getFullYear(),month:d.getMonth()}; })}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-ink-50 border border-ink-100 transition-all">
              <ChevronRight className="w-4 h-4"/>
            </button>
          </div>
          <button onClick={()=>{setCur({year:today.getFullYear(),month:today.getMonth()}); setSelDay(today.getDate());}}
            className="text-xs font-semibold text-primary-900 hover:text-orange-500 border border-ink-200 hover:border-primary-900 px-3 py-1.5 rounded-full transition-all">
            Today
          </button>
        </div>

        <div className="grid grid-cols-7 border-b border-ink-100">
          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d=>(
            <div key={d} className="text-center py-2 text-xs font-bold text-ink-400 uppercase tracking-wider">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {Array.from({length: firstDay}).map((_,i)=>(
            <div key={`e${i}`} className="min-h-[108px] border-b border-r border-ink-50 bg-ink-50/30"/>
          ))}
          {Array.from({length: daysInMonth}).map((_,i)=>{
            const day = i + 1;
            const appts = apptsByDate(day);
            const clinic = clinicForDate(cur.year, cur.month, day);
            const isToday = day===today.getDate() && cur.month===today.getMonth() && cur.year===today.getFullYear();
            const isSel = selDay === day;
            return (
              <button key={day} type="button" onClick={()=>setSelDay(day)}
                className={`min-h-[108px] p-1.5 border-b border-r border-ink-100 text-left transition-colors ${isToday?'bg-primary-50/40':''} ${isSel?'ring-2 ring-inset ring-primary-400':''}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-1 ${isToday?'bg-primary-900 text-white':'text-ink-700'}`}>{day}</div>
                {clinic && (
                  <div className="text-[9px] font-semibold text-ink-500 leading-tight mb-1 truncate" title={`${clinic.doctor} · ${clinic.location}`}>
                    {clinic.doctor}
                    <span className="block text-[8px] font-medium text-ink-400">{clinic.location}</span>
                  </div>
                )}
                <div className="space-y-0.5">
                  {appts.slice(0,3).map(a=>(
                    <div key={a.id} className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md truncate text-white ${statusColors[a.status]}`}
                      title={`${a.time} · ${clinic?.doctor || 'Dr. Abidi'} · ${a.firstName} ${a.lastName}`}>
                      {a.time}
                    </div>
                  ))}
                  {appts.length>3 && <div className="text-[10px] text-ink-400 font-medium">+{appts.length-3} more</div>}
                </div>
              </button>
            );
          })}
        </div>

        <div className="px-6 py-3 border-t border-ink-100 flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs text-ink-500">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500"/>
            Approved
          </span>
          <span className="text-[10px] text-ink-400">Pending and on-hold requests appear in Appointments until the doctor approves them.</span>
        </div>
      </div>

      {selDay && (
        <div className="bg-white rounded-2xl border border-ink-100 shadow-soft p-5">
          <h3 className="font-bold text-ink-900 text-sm mb-3">
            {new Date(dateStrFor(selDay)).toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric', year:'numeric' })}
          </h3>
          {selectedAppts.length===0 ? (
            <p className="text-sm text-ink-400">No approved appointments on this day.</p>
          ) : (
            <div className="space-y-2">
              {selectedAppts.sort((a,b)=>a.time.localeCompare(b.time)).map(a=>(
                <div key={a.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-ink-100 px-4 py-3">
                  <span className={`text-xs font-black text-white px-2.5 py-1 rounded-md ${statusColors[a.status]}`}>{a.time}</span>
                  <ApptBadge status={a.status}/>
                  <span className="text-sm font-semibold text-ink-800">{a.firstName} {a.lastName}</span>
                  <span className="text-xs text-ink-400">Dr. Abidi · {a.packageName} · {a.location}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── SLOT MANAGEMENT ───────────────────── */
function SlotManagement({ appointments, slotConfigs, onSaved }: {
  appointments: Appointment[];
  slotConfigs: SlotConfig[];
  onSaved: () => void;
}) {
  const today = new Date();
  const [selDate, setSelDate] = useState(isoDate(today));
  const [selLoc,  setSelLoc]  = useState<'Freehold'|'Brick'>('Freehold');
  const [cfg, setCfg] = useState<SlotConfig>({ date: isoDate(today), location: 'Freehold', dayBlocked: false, blockedTimes: [] });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [blockingKey, setBlockingKey] = useState('');
  const [slotError, setSlotError] = useState('');

  function findCfg(date: string, loc: 'Freehold'|'Brick'): SlotConfig {
    return slotConfigs.find(s => s.date === date && s.location === loc)
      || { date, location: loc, dayBlocked: false, blockedTimes: [] };
  }

  useEffect(() => {
    setCfg(findCfg(selDate, selLoc));
  }, [slotConfigs, selDate, selLoc]);

  function load(date: string, loc: 'Freehold'|'Brick') {
    setSelDate(date); setSelLoc(loc);
    setCfg(findCfg(date, loc));
    setSaved(false);
    setSlotError('');
  }

  function toggleDay() {
    setCfg(p=>({...p, dayBlocked: !p.dayBlocked})); setSaved(false);
  }

  async function toggleDateBlock(date: string, loc: 'Freehold'|'Brick') {
    const current = findCfg(date, loc);
    const next: SlotConfig = { ...current, date, location: loc, dayBlocked: !current.dayBlocked };
    setBlockingKey(`${date}-${loc}`);
    setSlotError('');
    try {
      await saveSlotConfig(next);
      if (date === selDate && loc === selLoc) setCfg(next);
      onSaved();
    } catch (err) {
      setSlotError(err instanceof Error ? err.message : 'Could not update this date.');
    } finally {
      setBlockingKey('');
    }
  }

  function toggleSlot(t: string) {
    setCfg(p=>({
      ...p,
      blockedTimes: p.blockedTimes.includes(t) ? p.blockedTimes.filter(x=>x!==t) : [...p.blockedTimes, t],
    })); setSaved(false);
  }

  async function save() {
    setSaving(true);
    setSlotError('');
    try {
      await saveSlotConfig({...cfg, date: selDate, location: selLoc});
      setSaved(true);
      onSaved();
      setTimeout(()=>setSaved(false), 2000);
    } catch (err) {
      setSlotError(err instanceof Error ? err.message : 'Could not save slots.');
    } finally {
      setSaving(false);
    }
  }

  const bookedForDay = appointments.filter(a => a.date===selDate && a.location===selLoc && a.status!=='cancelled' && a.status!=='rejected').map(a=>a.time);

  const days: {date:string; loc:'Freehold'|'Brick'}[] = [];
  const d = new Date(today);
  d.setDate(d.getDate());
  while (days.length < 21) {
    const dow = d.getDay();
    const dateStr = isoDate(d);
    if (dow===1||dow===3||dow===5) days.push({date:dateStr, loc:'Freehold'});
    else if (dow===2||dow===4)     days.push({date:dateStr, loc:'Brick'});
    d.setDate(d.getDate()+1);
  }

  return (
    <div className="grid lg:grid-cols-3 gap-5">
      <div className="bg-white rounded-2xl border border-ink-100 shadow-soft p-5">
        <h3 className="font-bold text-ink-900 text-sm mb-4 flex items-center gap-2"><CalendarDays className="w-4 h-4 text-primary-900"/>Select Date</h3>
        <div className="space-y-1.5 max-h-96 overflow-y-auto hide-scrollbar pr-1">
          {days.map(({date,loc})=>{
            const dayCfg = findCfg(date, loc);
            const isSelected = date===selDate && loc===selLoc;
            const rowKey = `${date}-${loc}`;
            return (
              <div key={rowKey}
                className={`w-full flex items-center gap-1 rounded-xl border transition-all ${isSelected?'border-primary-900 bg-primary-50':'border-ink-100 hover:border-primary-200'}`}>
                <button type="button" onClick={()=>load(date,loc)}
                  className="flex-1 min-w-0 flex items-center justify-between px-3 py-2.5 text-left text-sm">
                  <div>
                    <div className={`font-semibold text-xs ${isSelected?'text-primary-900':'text-ink-800'}`}>
                      {new Date(date).toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'})}
                    </div>
                    <div className={`text-[10px] mt-0.5 ${isSelected?'text-primary-600':'text-ink-400'}`}>{loc}</div>
                  </div>
                  {dayCfg.dayBlocked
                    ? <span className="text-[10px] font-bold text-red-500 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">Blocked</span>
                    : <span className="text-[10px] font-bold text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">Open</span>}
                </button>
                <button type="button"
                  title={dayCfg.dayBlocked ? 'Unblock this entire date' : 'Block this entire date'}
                  disabled={blockingKey===rowKey}
                  onClick={()=>toggleDateBlock(date, loc)}
                  className={`shrink-0 mr-2 w-8 h-8 rounded-lg flex items-center justify-center border transition-all ${
                    dayCfg.dayBlocked
                      ? 'border-red-200 bg-red-50 text-red-500 hover:bg-red-100'
                      : 'border-ink-200 bg-white text-ink-400 hover:border-red-300 hover:text-red-500'
                  }`}>
                  {blockingKey===rowKey
                    ? <Loader2 className="w-3.5 h-3.5 animate-spin"/>
                    : dayCfg.dayBlocked ? <Unlock className="w-3.5 h-3.5"/> : <Lock className="w-3.5 h-3.5"/>}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Slot editor */}
      <div className="lg:col-span-2 bg-white rounded-2xl border border-ink-100 shadow-soft p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-bold text-ink-900 text-sm">
              {new Date(selDate).toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'})} · {selLoc}
            </h3>
            <p className="text-xs text-ink-400 mt-0.5">{cfg.dayBlocked ? 'Entire day is blocked' : `${cfg.blockedTimes.length} slots blocked`}</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={toggleDay} className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border transition-all ${cfg.dayBlocked?'bg-red-50 border-red-200 text-red-600 hover:bg-red-100':'bg-ink-50 border-ink-200 text-ink-600 hover:border-red-300 hover:text-red-500'}`}>
              {cfg.dayBlocked ? <><Unlock className="w-3.5 h-3.5"/>Unblock Day</> : <><Lock className="w-3.5 h-3.5"/>Block Entire Day</>}
            </button>
          </div>
        </div>

        {cfg.dayBlocked ? (
          <div className="text-center py-10 text-ink-400">
            <Lock className="w-8 h-8 mx-auto mb-2 opacity-30"/>
            <p className="text-sm font-medium">This day is blocked</p>
            <p className="text-xs mt-1">Click "Unblock Day" to re-open all slots</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
            {TIME_SLOTS.map(t => {
              const isBooked   = bookedForDay.includes(t);
              const isBlocked  = cfg.blockedTimes.includes(t);
              return (
                <button key={t} onClick={()=>!isBooked && toggleSlot(t)} disabled={isBooked}
                  className={`py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                    isBooked   ? 'border-orange-200 bg-orange-50 text-orange-600 cursor-not-allowed' :
                    isBlocked  ? 'border-red-200 bg-red-50 text-red-500' :
                                 'border-ink-100 bg-white hover:border-primary-300 text-ink-700'
                  }`}>
                  <div>{t}</div>
                  <div className={`text-[9px] mt-0.5 font-medium ${isBooked?'text-orange-400':isBlocked?'text-red-400':'text-ink-300'}`}>
                    {isBooked ? 'Booked' : isBlocked ? 'Blocked' : 'Available'}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        <div className="flex items-center gap-3 pt-4 border-t border-ink-100">
          <div className="flex flex-wrap gap-3 flex-1 text-xs text-ink-400">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-orange-100 border border-orange-200"/>Booked</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-red-100 border border-red-200"/>Blocked</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-white border border-ink-200"/>Available</span>
          </div>
          {slotError && <span className="text-xs text-red-500">{slotError}</span>}
          <button onClick={save} disabled={saving} className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all disabled:opacity-60 ${saved?'bg-green-500 text-white':'bg-primary-900 hover:bg-primary-800 text-white'}`}>
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin"/> : <Save className="w-3.5 h-3.5"/>}
            {saved ? 'Saved ✓' : saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── EMPTY STATE ───────────────────────── */
function EmptyState({ icon: Icon, text }: { icon: React.ElementType; text: string }) {
  return (
    <div className="text-center py-14">
      <Icon className="w-9 h-9 mx-auto mb-3 text-ink-200"/>
      <p className="text-sm font-medium text-ink-400">{text}</p>
      <p className="text-xs text-ink-300 mt-1">Items will appear here automatically.</p>
    </div>
  );
}

/* ─── CMS FORMS (condition/IV package) ─── */
const EMPTY_COND: Omit<CmsCondition,'id'|'createdAt'|'updatedAt'> = { slug:'',title:'',href:'',heroEyebrow:'',shortDescription:'',cardImage:'',heroImage:'',overview:'',symptoms:'',treatmentIntro:'',metaTitle:'',metaDescription:'',enabled:true };
const EMPTY_PKG:  Omit<CmsIVPackage,'id'|'createdAt'|'updatedAt'> = { slug:'',name:'',price:0,badge:'',image:'',tagline:'',description:'',dosages:'',bestFor:'',ingredients:'',addOns:'',enabled:true };

function ConditionForm({ initial, onSave, onCancel }: { initial?: CmsCondition; onSave:(c:CmsCondition)=>void|Promise<void>; onCancel:()=>void }) {
  const [f,setF]=useState(initial?{...initial}:{...EMPTY_COND});
  const [err,setErr]=useState('');
  const [saving,setSaving]=useState(false);
  const inp="w-full border border-ink-200 focus:border-primary-900 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors";
  const lbl="block text-xs font-semibold text-ink-700 mb-1.5";
  function handle(e:React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>){setF(p=>({...p,[e.target.name]:e.target.value}));}
  async function handleSubmit(e:React.FormEvent){
    e.preventDefault();
    if(!f.title.trim()){setErr('Title required');return;}
    setSaving(true); setErr('');
    const now=new Date().toISOString();
    const slug = (f.slug || makeSlug(f.title)).trim();
    try {
      await onSave({...f,slug,href:`/${slug}/`,id:initial?.id||newId(),createdAt:initial?.createdAt||now,updatedAt:now});
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : 'Could not save.');
    } finally {
      setSaving(false);
    }
  }
  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-ink-100 shadow-soft overflow-hidden">
      <div className="sticky top-0 z-20 px-6 py-3 border-b border-ink-100 flex items-center justify-between gap-3 bg-white">
        <h3 className="font-bold text-ink-900 text-sm flex items-center gap-2 min-w-0">
          <Activity className="w-4 h-4 text-primary-900 shrink-0"/>
          <span className="truncate">{initial ? 'Edit Condition' : 'Add Condition'}</span>
        </h3>
        <div className="flex items-center gap-2 shrink-0">
          <button type="button" onClick={onCancel} className="h-9 px-4 text-xs font-semibold border border-ink-200 hover:border-ink-400 text-ink-700 rounded-full transition-all">Discard</button>
          <button type="submit" disabled={saving} className="h-9 px-5 text-xs font-bold bg-primary-900 hover:bg-primary-800 disabled:opacity-60 text-white rounded-full inline-flex items-center gap-1.5">
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin"/> : <Save className="w-3.5 h-3.5"/>}
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
      <div className="p-6 grid sm:grid-cols-2 gap-4">
        <div><label className={lbl}>Title *</label><input name="title" required value={f.title} onChange={handle} className={inp}/></div>
        <div><label className={lbl}>URL slug</label><input name="slug" value={f.slug} onChange={handle} className={inp} placeholder="auto-generated from title"/><p className="text-[10px] text-ink-400 mt-1">/{f.slug || 'slug'}/</p></div>
        <div><label className={lbl}>Eyebrow</label><input name="heroEyebrow" value={f.heroEyebrow} onChange={handle} className={inp}/></div>
        <div><label className={lbl}>Short Description</label><input name="shortDescription" value={f.shortDescription} onChange={handle} className={inp}/></div>
        <div><label className={lbl}>Card Image</label><input name="cardImage" value={f.cardImage} onChange={handle} className={inp} placeholder="/image.jpeg"/></div>
        <div><label className={lbl}>Hero Image</label><input name="heroImage" value={f.heroImage} onChange={handle} className={inp} placeholder="/image.jpeg"/></div>
        <div className="sm:col-span-2"><label className={lbl}>Overview</label><textarea name="overview" rows={3} value={f.overview} onChange={handle} className={inp+" resize-none"}/></div>
        <div className="sm:col-span-2"><label className={lbl}>Symptoms (comma separated)</label><input name="symptoms" value={f.symptoms} onChange={handle} className={inp}/></div>
        <div className="sm:col-span-2"><label className={lbl}>Treatment Introduction</label><textarea name="treatmentIntro" rows={2} value={f.treatmentIntro} onChange={handle} className={inp+" resize-none"}/></div>
        <div><label className={lbl}>Meta Title</label><input name="metaTitle" value={f.metaTitle} onChange={handle} className={inp}/></div>
        <div><label className={lbl}>Meta Description</label><input name="metaDescription" value={f.metaDescription} onChange={handle} className={inp}/></div>
        <div className="flex items-center gap-3"><label className={lbl+" mb-0"}>Published</label><button type="button" onClick={()=>setF(p=>({...p,enabled:!p.enabled}))} className={f.enabled?'text-green-500':'text-ink-300'}>{f.enabled?<ToggleRight className="w-8 h-8"/>:<ToggleLeft className="w-8 h-8"/>}</button><span className={`text-xs font-semibold ${f.enabled?'text-green-600':'text-ink-400'}`}>{f.enabled?'Published':'Draft'}</span></div>
        {err&&<div className="sm:col-span-2 text-red-500 text-sm flex items-center gap-2"><AlertCircle className="w-4 h-4"/>{err}</div>}
      </div>
    </form>
  );
}

function IVPackageForm({ initial, onSave, onCancel }: { initial?: CmsIVPackage; onSave:(p:CmsIVPackage)=>void|Promise<void>; onCancel:()=>void }) {
  const [f,setF]=useState(initial?{...initial}:{...EMPTY_PKG});
  const [err,setErr]=useState('');
  const [saving,setSaving]=useState(false);
  const inp="w-full border border-ink-200 focus:border-primary-900 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors";
  const lbl="block text-xs font-semibold text-ink-700 mb-1.5";
  function handle(e:React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>){const{name,value}=e.target;setF(p=>({...p,[name]:name==='price'||name==='totalValue'?Number(value):value}));}
  async function handleSubmit(e:React.FormEvent){
    e.preventDefault();
    if(!f.name.trim()){setErr('Name required');return;}
    if(!f.price){setErr('Price required');return;}
    setSaving(true); setErr('');
    const now=new Date().toISOString();
    const slug = (f.slug || makeSlug(f.name)).trim();
    try {
      await onSave({...f,slug,id:initial?.id||newId(),createdAt:initial?.createdAt||now,updatedAt:now});
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : 'Could not save.');
    } finally {
      setSaving(false);
    }
  }
  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-ink-100 shadow-soft overflow-hidden">
      <div className="sticky top-0 z-20 px-6 py-3 border-b border-ink-100 flex items-center justify-between gap-3 bg-white">
        <h3 className="font-bold text-ink-900 text-sm flex items-center gap-2 min-w-0">
          <Syringe className="w-4 h-4 text-primary-900 shrink-0"/>
          <span className="truncate">{initial ? 'Edit Package' : 'Add Package'}</span>
        </h3>
        <div className="flex items-center gap-2 shrink-0">
          <button type="button" onClick={onCancel} className="h-9 px-4 text-xs font-semibold border border-ink-200 hover:border-ink-400 text-ink-700 rounded-full transition-all">Discard</button>
          <button type="submit" disabled={saving} className="h-9 px-5 text-xs font-bold bg-primary-900 hover:bg-primary-800 disabled:opacity-60 text-white rounded-full inline-flex items-center gap-1.5">
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin"/> : <Save className="w-3.5 h-3.5"/>}
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
      <div className="p-6 grid sm:grid-cols-2 gap-4">
        <div><label className={lbl}>Name *</label><input name="name" required value={f.name} onChange={handle} className={inp}/></div>
        <div><label className={lbl}>URL slug</label><input name="slug" value={f.slug} onChange={handle} className={inp} placeholder="auto-generated from name"/><p className="text-[10px] text-ink-400 mt-1">/iv-packages/{f.slug || 'slug'}/</p></div>
        <div><label className={lbl}>Price ($) *</label><input name="price" type="number" required value={f.price||''} onChange={handle} className={inp}/></div>
        <div><label className={lbl}>Total Value ($)</label><input name="totalValue" type="number" value={f.totalValue||''} onChange={handle} className={inp}/></div>
        <div><label className={lbl}>Badge</label><input name="badge" value={f.badge||''} onChange={handle} className={inp} placeholder="Most Popular"/></div>
        <div><label className={lbl}>Image</label><input name="image" value={f.image} onChange={handle} className={inp} placeholder="/image.png"/></div>
        <div className="sm:col-span-2"><label className={lbl}>Tagline</label><input name="tagline" value={f.tagline} onChange={handle} className={inp}/></div>
        <div className="sm:col-span-2"><label className={lbl}>Description</label><textarea name="description" rows={3} value={f.description} onChange={handle} className={inp+" resize-none"}/></div>
        <div className="sm:col-span-2"><label className={lbl}>Dosages</label><input name="dosages" value={f.dosages} onChange={handle} className={inp}/></div>
        <div className="sm:col-span-2"><label className={lbl}>Best For (comma separated)</label><input name="bestFor" value={f.bestFor} onChange={handle} className={inp}/></div>
        <div className="sm:col-span-2"><label className={lbl}>Ingredients (abbr|name|desc|dosage — one per line)</label><textarea name="ingredients" rows={4} value={f.ingredients} onChange={handle} className={inp+" resize-none font-mono text-xs"}/></div>
        <div className="sm:col-span-2"><label className={lbl}>Add-Ons (name|price|desc — one per line)</label><textarea name="addOns" rows={3} value={f.addOns} onChange={handle} className={inp+" resize-none font-mono text-xs"}/></div>
        <div className="flex items-center gap-3"><label className={lbl+" mb-0"}>Published</label><button type="button" onClick={()=>setF(p=>({...p,enabled:!p.enabled}))} className={f.enabled?'text-green-500':'text-ink-300'}>{f.enabled?<ToggleRight className="w-8 h-8"/>:<ToggleLeft className="w-8 h-8"/>}</button><span className={`text-xs font-semibold ${f.enabled?'text-green-600':'text-ink-400'}`}>{f.enabled?'Published':'Draft'}</span></div>
        {err&&<div className="sm:col-span-2 text-red-500 text-sm flex items-center gap-2"><AlertCircle className="w-4 h-4"/>{err}</div>}
      </div>
    </form>
  );
}

/* ─── MAIN DASHBOARD ────────────────────── */
export function AdminDashboard() {
  const [sessionReady, setSessionReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [messages,     setMessages]     = useState<ContactMessage[]>([]);
  const [conditions,   setConditions]   = useState<CmsCondition[]>([]);
  const [ivPackages,   setIVPackages]   = useState<CmsIVPackage[]>([]);
  const [slotConfigs,  setSlotConfigs]  = useState<SlotConfig[]>([]);
  const navigate = useNavigate();
  const { page: pageParam } = useParams<{ page: string }>();
  const page: NavPage = isNavPage(pageParam) ? pageParam : 'overview';
  const setPage = useCallback((p: NavPage) => { navigate(`/admin/${p}`); }, [navigate]);
  const [expanded,  setExpanded]  = useState<string|null>(null);
  const [search,    setSearch]    = useState('');
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus|'all'>('all');
  const [editingCond, setEditingCond] = useState<CmsCondition|null|'new'>(null);
  const [editingPkg,  setEditingPkg]  = useState<CmsIVPackage|null|'new'>(null);
  const [delConfirm,  setDelConfirm]  = useState<string|null>(null);
  const [loadError, setLoadError] = useState('');
  const [actionError, setActionError] = useState('');

  const load = useCallback(async () => {
    try {
      setLoadError('');
      const [appts, msgs, conds, pkgs, slots] = await Promise.all([
        getAppointments(),
        getContactMessages(),
        getCmsConditions(),
        getCmsIVPackages(),
        getSlotConfigs(),
      ]);
      setAppointments(appts.sort((a,b)=>new Date(b.createdAt).getTime()-new Date(a.createdAt).getTime()));
      setMessages(msgs.sort((a,b)=>new Date(b.createdAt).getTime()-new Date(a.createdAt).getTime()));
      setConditions(conds);
      setIVPackages(pkgs);
      setSlotConfigs(slots);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Could not load admin data.');
    }
  }, []);

  useEffect(() => {
    let alive = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!alive) return;
      setAuthed(!!data.session);
      setSessionReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthed(!!session);
      setSessionReady(true);
    });
    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!authed) return;
    load();
    const channel = supabase
      .channel('admin-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, () => { load(); })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contact_messages' }, () => { load(); })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'slot_configs' }, () => { load(); })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cms_conditions' }, () => { load(); })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cms_iv_packages' }, () => { load(); })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [authed, load]);

  useEffect(() => {
    if (pageParam && !isNavPage(pageParam)) navigate('/admin/overview', { replace: true });
  }, [pageParam, navigate]);

  async function handleAppt(id: string, patch: Partial<Appointment>) {
    setActionError('');
    try {
      if (patch.status === 'approved' || patch.status === 'rejected') {
        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token;
        if (!token) throw new Error('Please sign in again to review appointments.');
        const result = await reviewBooking(id, patch.status === 'approved' ? 'approve' : 'reject', token, patch.rejectionReason || '');
        if (result.warning) setActionError(result.warning);
      } else {
        await updateAppointment(id, patch);
      }
      await load();
    }
    catch (err) { setActionError(err instanceof Error ? err.message : 'Could not update appointment.'); }
  }
  async function handleMsg(id: string, s: ContactStatus) {
    setActionError('');
    try { await updateContactStatus(id, s); await load(); }
    catch (err) { setActionError(err instanceof Error ? err.message : 'Could not update message.'); }
  }
  async function saveCond(c: CmsCondition) {
    setActionError('');
    try {
      await saveCmsCondition(c);
      setEditingCond(null);
      await load();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Could not save condition.');
      throw err;
    }
  }
  async function savePkg(p: CmsIVPackage) {
    setActionError('');
    try {
      await saveCmsIVPackage(p);
      setEditingPkg(null);
      await load();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Could not save package.');
      throw err;
    }
  }
  async function delCond(id: string) {
    try { await deleteCmsCondition(id); setDelConfirm(null); await load(); }
    catch (err) { setActionError(err instanceof Error ? err.message : 'Could not delete condition.'); }
  }
  async function delPkg(id: string) {
    try { await deleteCmsIVPackage(id); setDelConfirm(null); await load(); }
    catch (err) { setActionError(err instanceof Error ? err.message : 'Could not delete package.'); }
  }
  async function handleLogout() {
    await supabase.auth.signOut();
    setAuthed(false);
  }

  const todayStr = isoDate(new Date());
  const counts = {
    total:       appointments.length,
    pending:     appointments.filter(a=>a.status==='pending').length,
    approved:    appointments.filter(a=>a.status==='approved').length,
    hold:        appointments.filter(a=>a.status==='hold').length,
    completed:   appointments.filter(a=>a.status==='completed').length,
    cancelled:   appointments.filter(a=>a.status==='cancelled').length,
    rejected:    appointments.filter(a=>a.status==='rejected').length,
    today:       appointments.filter(a=>a.date===todayStr && a.status==='approved').length,
    newMessages: messages.filter(m=>m.status==='new').length,
    liveConditions: staticConditions.length + conditions.filter(c=>c.enabled && !c.id.startsWith('static-')).length,
    livePackages: staticIVPackages.length + ivPackages.filter(p=>p.enabled && !p.id.startsWith('static-')).length,
  };

  const filteredAppts = appointments.filter(a => {
    const matchStatus = statusFilter==='all' || a.status===statusFilter;
    if (!search) return matchStatus;
    const q = search.toLowerCase();
    return matchStatus && (`${a.firstName} ${a.lastName} ${a.email} ${a.packageName} ${a.id}`.toLowerCase().includes(q));
  });
  const filteredMsgs = messages.filter(m => !search || `${m.name} ${m.email} ${m.message}`.toLowerCase().includes(search));

  const PAGE_TITLE: Record<NavPage,string> = {
    overview:'Overview', appointments:'Appointments', calendar:'Calendar',
    slots:'Slot Management', messages:'Contact Messages',
    conditions:'Conditions We Treat', 'iv-packages':'IV Packages',
  };

  if (!sessionReady) {
    return (
      <div className="min-h-screen grid place-items-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-primary-900"/>
      </div>
    );
  }
  if (!authed) return <AdminLogin onReady={() => setAuthed(true)} />;

  return (
    <>
      <Seo title="Admin | MD Abidi Arthritis Institute" description="Admin dashboard."/>
      <div className="flex h-screen overflow-hidden" style={{ background: '#f1f5f9' }}>
        <Sidebar page={page} setPage={setPage} counts={counts} onLogout={handleLogout}/>

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Header */}
          <header className="bg-white px-7 py-4 flex items-center justify-between gap-4 shrink-0 z-10" style={{ borderBottom: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#1e3a5f' }}>
                {page==='overview' && <LayoutDashboard className="w-4 h-4 text-white"/>}
                {page==='appointments' && <List className="w-4 h-4 text-white"/>}
                {page==='calendar' && <CalendarRange className="w-4 h-4 text-white"/>}
                {page==='slots' && <Clock className="w-4 h-4 text-white"/>}
                {page==='messages' && <MessageSquare className="w-4 h-4 text-white"/>}
                {page==='conditions' && <Activity className="w-4 h-4 text-white"/>}
                {page==='iv-packages' && <Syringe className="w-4 h-4 text-white"/>}
              </div>
              <div>
                <h1 className="font-bold text-slate-800 text-sm leading-tight">{PAGE_TITLE[page]}</h1>
                <p className="text-xs text-slate-400 mt-0.5">MD Abidi Arthritis Institute</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="relative hidden md:block">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#94a3b8' }}/>
                <input type="text" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search appointments, patients…"
                  className="rounded-lg pl-9 pr-4 py-2 text-xs outline-none w-56 transition-all"
                  style={{ border: '1px solid #e2e8f0', background: '#f8fafc', color: '#1e293b' }}
                  onFocus={e=>{ e.currentTarget.style.background='#fff'; e.currentTarget.style.borderColor='#3b82f6'; }}
                  onBlur={e=>{ e.currentTarget.style.background='#f8fafc'; e.currentTarget.style.borderColor='#e2e8f0'; }}
                />
              </div>
              <button onClick={load} title="Refresh"
                className="w-8 h-8 flex items-center justify-center rounded-lg transition-all"
                style={{ border: '1px solid #e2e8f0', background: '#fff', color: '#64748b' }}
                onMouseEnter={e=>{ e.currentTarget.style.borderColor='#3b82f6'; e.currentTarget.style.color='#3b82f6'; }}
                onMouseLeave={e=>{ e.currentTarget.style.borderColor='#e2e8f0'; e.currentTarget.style.color='#64748b'; }}>
                <RefreshCw className="w-3.5 h-3.5"/>
              </button>
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: 'linear-gradient(135deg,#1e3a5f,#3b82f6)' }}>
                A
              </div>
            </div>
          </header>

          <main className="flex-1 px-6 py-6 overflow-y-auto">
            {(loadError || actionError) && (
              <div className="mb-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5"/>
                {loadError || actionError}
              </div>
            )}

            {/* ── OVERVIEW ── */}
            {page==='overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <KpiCard label="Total Bookings" value={counts.total}       icon={CalendarDays} color="#1d4ed8" bg="#eff6ff" borderColor="#3b82f6" onClick={()=>{setPage('appointments');setStatusFilter('all');}}/>
                  <KpiCard label="Pending"        value={counts.pending}     icon={Clock}        color="#d97706" bg="#fffbeb" borderColor="#f59e0b" sub={counts.pending>0?`${counts.pending} need action`:undefined} onClick={()=>{setPage('appointments');setStatusFilter('pending');}}/>
                  <KpiCard label="Approved"       value={counts.approved}    icon={CheckCircle2} color="#16a34a" bg="#f0fdf4" borderColor="#22c55e" onClick={()=>{setPage('appointments');setStatusFilter('approved');}}/>
                  <KpiCard label="Today"          value={counts.today}       icon={CalendarRange} color="#0f766e" bg="#f0fdfa" borderColor="#14b8a6" sub="On the calendar" onClick={()=>setPage('calendar')}/>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <KpiCard label="Completed"      value={counts.completed}   icon={CheckCheck}   color="#0f766e" bg="#f0fdfa" borderColor="#14b8a6" onClick={()=>{setPage('appointments');setStatusFilter('completed');}}/>
                  <KpiCard label="On Hold"        value={counts.hold}        icon={PauseCircle}  color="#2563eb" bg="#eff6ff" borderColor="#3b82f6" onClick={()=>{setPage('appointments');setStatusFilter('hold');}}/>
                  <KpiCard label="Live Conditions" value={counts.liveConditions} icon={Activity} color="#7c3aed" bg="#faf5ff" borderColor="#8b5cf6" sub={`${counts.livePackages} IV packages`} onClick={()=>setPage('conditions')}/>
                  <KpiCard label="New Messages"   value={counts.newMessages} icon={Inbox}        color="#7c3aed" bg="#faf5ff" borderColor="#8b5cf6" sub={counts.newMessages>0?`${counts.newMessages} unread`:undefined} onClick={()=>setPage('messages')}/>
                </div>
                {/* Recent */}
                <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <h2 className="font-bold text-slate-800 text-sm flex items-center gap-2"><TrendingUp className="w-4 h-4" style={{ color: '#1d4ed8' }}/>Recent Appointments</h2>
                    <button onClick={()=>setPage('appointments')} className="text-xs font-semibold transition-colors" style={{ color: '#3b82f6' }}
                      onMouseEnter={e=>e.currentTarget.style.color='#1d4ed8'} onMouseLeave={e=>e.currentTarget.style.color='#3b82f6'}>View All →</button>
                  </div>
                  <div className="p-5 space-y-3">
                    {appointments.length===0 ? <EmptyState icon={CalendarDays} text="No appointments yet."/> :
                      appointments.slice(0,5).map(a=><ApptRow key={a.id} appt={a} expanded={expanded===a.id} onToggle={()=>setExpanded(expanded===a.id?null:a.id)} onAction={handleAppt}/>)}
                  </div>
                </div>
              </div>
            )}

            {/* ── APPOINTMENTS ── */}
            {page==='appointments' && (
              <div className="space-y-4">
                {/* Status filter tabs */}
                <div className="flex flex-wrap gap-2 bg-white rounded-2xl p-3" style={{ border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  {([['all','All Appointments',counts.total],['pending','Pending',counts.pending],['approved','Approved',counts.approved],['hold','On Hold',counts.hold],['completed','Completed',counts.completed],['cancelled','Cancelled',counts.cancelled],['rejected','Declined',counts.rejected]] as [AppointmentStatus|'all',string,number][]).map(([s,l,c])=>(
                    <button key={s} onClick={()=>setStatusFilter(s)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all"
                      style={{
                        background: statusFilter===s ? '#1e3a5f' : '#f8fafc',
                        color: statusFilter===s ? '#fff' : '#64748b',
                        border: statusFilter===s ? '1px solid #1e3a5f' : '1px solid #e2e8f0',
                      }}>
                      {l}
                      <span className="font-black text-[10px] px-1.5 py-0.5 rounded-md" style={{ background: statusFilter===s ? 'rgba(255,255,255,0.2)' : '#e2e8f0', color: statusFilter===s ? '#fff' : '#94a3b8' }}>{c}</span>
                    </button>
                  ))}
                </div>
                <div className="space-y-3">
                  {filteredAppts.length===0 ? <EmptyState icon={CalendarDays} text="No appointments found."/> :
                    filteredAppts.map(a=><ApptRow key={a.id} appt={a} expanded={expanded===a.id} onToggle={()=>setExpanded(expanded===a.id?null:a.id)} onAction={handleAppt}/>)}
                </div>
              </div>
            )}

            {/* ── CALENDAR ── */}
            {page==='calendar' && <CalendarView appointments={appointments}/>}

            {/* ── SLOTS ── */}
            {page==='slots' && <SlotManagement appointments={appointments} slotConfigs={slotConfigs} onSaved={load}/>}

            {/* ── MESSAGES ── */}
            {page==='messages' && (
              <div className="space-y-3">
                {filteredMsgs.length===0 ? <EmptyState icon={MessageSquare} text="No messages yet."/> :
                  filteredMsgs.map(m=><MsgRow key={m.id} msg={m} expanded={expanded===m.id} onToggle={()=>setExpanded(expanded===m.id?null:m.id)} onStatus={handleMsg}/>)}
              </div>
            )}

            {/* ── CONDITIONS ── */}
            {page==='conditions' && (
              <div className="space-y-4">
                {!editingCond && (
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-ink-500">{staticConditions.length} built-in · {conditions.filter(c=>!c.id.startsWith('static-')).length} custom</p>
                    <button onClick={()=>setEditingCond('new')} className="inline-flex items-center gap-2 bg-primary-900 hover:bg-primary-800 text-white font-semibold text-xs px-5 py-2.5 rounded-full transition-all"><Plus className="w-3.5 h-3.5"/>Add Condition</button>
                  </div>
                )}
                {editingCond && <ConditionForm initial={editingCond==='new'?undefined:editingCond} onSave={saveCond} onCancel={()=>setEditingCond(null)}/>}
                {!editingCond && (
                <>
                <div>
                  <p className="text-[10px] font-bold text-ink-400 uppercase tracking-widest mb-2">Built-in (9)</p>
                  <div className="grid gap-2">
                    {staticConditions.map(c=>{
                      const stableId=`static-cond-${c.slug}`;
                      const existing=conditions.find(x=>x.id===stableId);
                      return (
                        <div key={c.slug} className={`bg-white rounded-xl border p-4 flex items-center gap-4 shadow-soft ${existing?'border-orange-200':'border-ink-100'}`}>
                          {c.cardImage&&<img src={c.cardImage} alt={c.title} className="w-12 h-9 rounded-lg object-cover shrink-0"/>}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-ink-900 text-xs">{existing?.title || c.title}</h3>
                              {existing&&<span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-200">Edited</span>}
                            </div>
                            <p className="text-[10px] text-ink-400">{existing ? `/${existing.slug}/` : c.href}</p>
                          </div>
                          <button onClick={()=>setEditingCond(existing||{id:stableId,slug:c.slug,title:c.title,href:c.href,heroEyebrow:c.heroEyebrow,shortDescription:c.shortDescription,cardImage:c.cardImage,heroImage:c.heroImage,overview:Array.isArray(c.overview)?c.overview.join('\n'):'',symptoms:(c.symptoms||[]).join(', '),treatmentIntro:c.treatmentIntro,metaTitle:c.metaTitle,metaDescription:c.metaDescription,enabled:true,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()})}
                            className="h-7 px-3 text-[11px] font-bold border border-ink-200 hover:border-primary-900 text-ink-600 hover:text-primary-900 rounded-full flex items-center gap-1.5 shrink-0 transition-all"><Pencil className="w-3 h-3"/>Edit</button>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {conditions.filter(c=>!c.id.startsWith('static-')).length>0&&(
                  <div>
                    <p className="text-[10px] font-bold text-ink-400 uppercase tracking-widest mb-2 mt-4">Custom ({conditions.filter(c=>!c.id.startsWith('static-')).length})</p>
                    <div className="grid gap-2">
                      {conditions.filter(c=>!c.id.startsWith('static-')).map(c=>(
                        <div key={c.id} className="bg-white rounded-xl border border-ink-100 p-4 flex items-center gap-4 shadow-soft">
                          {c.cardImage&&<img src={c.cardImage} alt={c.title} className="w-12 h-9 rounded-lg object-cover shrink-0"/>}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2"><h3 className="font-bold text-ink-900 text-xs">{c.title}</h3><span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${c.enabled?'bg-green-50 text-green-600 border border-green-200':'bg-ink-100 text-ink-500'}`}>{c.enabled?'Published':'Draft'}</span></div>
                            <p className="text-[10px] text-ink-400">/{c.slug}/</p>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button onClick={()=>setEditingCond(c)} className="h-7 px-3 text-[11px] font-bold border border-ink-200 hover:border-primary-900 text-ink-600 hover:text-primary-900 rounded-full flex items-center gap-1.5 transition-all"><Pencil className="w-3 h-3"/>Edit</button>
                            {delConfirm===c.id?<><button onClick={()=>delCond(c.id)} className="h-7 px-3 text-[11px] font-bold bg-red-500 hover:bg-red-600 text-white rounded-full">Confirm</button><button onClick={()=>setDelConfirm(null)} className="h-7 px-3 text-[11px] border border-ink-200 rounded-full text-ink-500">Cancel</button></>:<button onClick={()=>setDelConfirm(c.id)} className="h-7 w-7 flex items-center justify-center border border-ink-200 hover:border-red-300 text-ink-400 hover:text-red-500 rounded-full transition-all"><Trash2 className="w-3.5 h-3.5"/></button>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                </>
                )}
              </div>
            )}

            {/* ── IV PACKAGES ── */}
            {page==='iv-packages' && (
              <div className="space-y-4">
                {!editingPkg && (
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-ink-500">{staticIVPackages.length} built-in · {ivPackages.filter(p=>!p.id.startsWith('static-')).length} custom</p>
                    <button onClick={()=>setEditingPkg('new')} className="inline-flex items-center gap-2 bg-primary-900 hover:bg-primary-800 text-white font-semibold text-xs px-5 py-2.5 rounded-full transition-all"><Plus className="w-3.5 h-3.5"/>Add Package</button>
                  </div>
                )}
                {editingPkg && <IVPackageForm initial={editingPkg==='new'?undefined:editingPkg} onSave={savePkg} onCancel={()=>setEditingPkg(null)}/>}
                {!editingPkg && (
                <>
                <div>
                  <p className="text-[10px] font-bold text-ink-400 uppercase tracking-widest mb-2">Built-in (9)</p>
                  <div className="grid gap-2">
                    {staticIVPackages.map(p=>{
                      const stableId=`static-pkg-${p.slug}`;
                      const existing=ivPackages.find(x=>x.id===stableId);
                      return (
                        <div key={p.slug} className={`bg-white rounded-xl border p-4 flex items-center gap-4 shadow-soft ${existing?'border-orange-200':'border-ink-100'}`}>
                          <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center shrink-0">💉</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-ink-900 text-xs">{existing?.name||p.name}</h3>
                              <span className="font-black text-primary-900 text-xs">${existing?.price||p.price}</span>
                              {existing&&<span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-200">Edited</span>}
                            </div>
                            <p className="text-[10px] text-ink-400">/iv-packages/{existing?.slug || p.slug}/</p>
                          </div>
                          <button onClick={()=>setEditingPkg(existing||{id:stableId,slug:p.slug,name:p.name,price:p.price,badge:'',image:'',tagline:'',description:'',dosages:'',bestFor:'',ingredients:'',addOns:'',enabled:true,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()})}
                            className="h-7 px-3 text-[11px] font-bold border border-ink-200 hover:border-primary-900 text-ink-600 hover:text-primary-900 rounded-full flex items-center gap-1.5 shrink-0 transition-all"><Pencil className="w-3 h-3"/>Edit</button>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {ivPackages.filter(p=>!p.id.startsWith('static-')).length>0&&(
                  <div>
                    <p className="text-[10px] font-bold text-ink-400 uppercase tracking-widest mb-2 mt-4">Custom ({ivPackages.filter(p=>!p.id.startsWith('static-')).length})</p>
                    <div className="grid gap-2">
                      {ivPackages.filter(p=>!p.id.startsWith('static-')).map(p=>(
                        <div key={p.id} className="bg-white rounded-xl border border-ink-100 p-4 flex items-center gap-4 shadow-soft">
                          {p.image&&<img src={p.image} alt={p.name} className="w-10 h-10 rounded-xl object-contain bg-sky-50 p-1 shrink-0"/>}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2"><h3 className="font-bold text-ink-900 text-xs">{p.name}</h3><span className="font-black text-primary-900 text-xs">${p.price}</span>{p.badge&&<span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-200">{p.badge}</span>}<span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${p.enabled?'bg-green-50 text-green-600 border border-green-200':'bg-ink-100 text-ink-500'}`}>{p.enabled?'Published':'Draft'}</span></div>
                            <p className="text-[10px] text-ink-400">/iv-packages/{p.slug}/</p>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button onClick={()=>setEditingPkg(p)} className="h-7 px-3 text-[11px] font-bold border border-ink-200 hover:border-primary-900 text-ink-600 hover:text-primary-900 rounded-full flex items-center gap-1.5 transition-all"><Pencil className="w-3 h-3"/>Edit</button>
                            {delConfirm===p.id?<><button onClick={()=>delPkg(p.id)} className="h-7 px-3 text-[11px] font-bold bg-red-500 hover:bg-red-600 text-white rounded-full">Confirm</button><button onClick={()=>setDelConfirm(null)} className="h-7 px-3 text-[11px] border border-ink-200 rounded-full text-ink-500">Cancel</button></>:<button onClick={()=>setDelConfirm(p.id)} className="h-7 w-7 flex items-center justify-center border border-ink-200 hover:border-red-300 text-ink-400 hover:text-red-500 rounded-full transition-all"><Trash2 className="w-3.5 h-3.5"/></button>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                </>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
