/* ─── Types ─────────────────────────────────────────────── */

export type AppointmentStatus = 'pending' | 'approved' | 'hold' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  packageName: string;
  packageSlug: string;
  location: 'Freehold' | 'Brick';
  date: string;
  time: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  dob: string;
  gender: string;
  address: string;
  insuranceName: string;
  allergies: string;
  medications: string;
  medicalHistory: string;
  reasonForVisit: string;
  status: AppointmentStatus;
  adminNotes?: string;
  createdAt: string;
  updatedAt?: string;
}

export type ContactStatus = 'new' | 'read' | 'replied';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: ContactStatus;
  createdAt: string;
}

/* ─── Slot Management ──────────────────────────────────── */
export interface SlotConfig {
  /** ISO date string e.g. "2026-08-25" */
  date: string;
  location: 'Freehold' | 'Brick';
  /** If true, entire day is blocked */
  dayBlocked: boolean;
  /** Individual time slots that are blocked */
  blockedTimes: string[];
}

const SLOT_KEY = 'slot_config';

export function getSlotConfigs(): SlotConfig[] {
  try { return JSON.parse(localStorage.getItem(SLOT_KEY) || '[]'); } catch { return []; }
}

export function saveSlotConfig(cfg: SlotConfig): void {
  const list = getSlotConfigs().filter(s => !(s.date === cfg.date && s.location === cfg.location));
  list.push(cfg);
  localStorage.setItem(SLOT_KEY, JSON.stringify(list));
  window.dispatchEvent(new Event('storage'));
}

export function getSlotConfig(date: string, location: 'Freehold' | 'Brick'): SlotConfig {
  return getSlotConfigs().find(s => s.date === date && s.location === location)
    || { date, location, dayBlocked: false, blockedTimes: [] };
}

/* ─── Appointments ──────────────────────────────────────── */
const APPT_KEY = 'iv_appointments';

export function getAppointments(): Appointment[] {
  try { return JSON.parse(localStorage.getItem(APPT_KEY) || '[]'); } catch { return []; }
}

export function saveAppointment(appt: Appointment): void {
  const list = getAppointments();
  list.push(appt);
  localStorage.setItem(APPT_KEY, JSON.stringify(list));
}

export function updateAppointment(id: string, patch: Partial<Appointment>): void {
  const list = getAppointments();
  const idx = list.findIndex(a => a.id === id);
  if (idx !== -1) {
    list[idx] = { ...list[idx], ...patch, updatedAt: new Date().toISOString() };
    localStorage.setItem(APPT_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event('storage'));
  }
}

export function updateAppointmentStatus(id: string, status: AppointmentStatus): void {
  updateAppointment(id, { status });
}

/* ─── Contact Messages ──────────────────────────────────── */
const MSG_KEY = 'contact_messages';

export function getContactMessages(): ContactMessage[] {
  try { return JSON.parse(localStorage.getItem(MSG_KEY) || '[]'); } catch { return []; }
}

export function saveContactMessage(msg: ContactMessage): void {
  const list = getContactMessages();
  list.push(msg);
  localStorage.setItem(MSG_KEY, JSON.stringify(list));
}

export function updateContactStatus(id: string, status: ContactStatus): void {
  const list = getContactMessages();
  const idx = list.findIndex(m => m.id === id);
  if (idx !== -1) {
    list[idx].status = status;
    localStorage.setItem(MSG_KEY, JSON.stringify(list));
  }
}

/* ─── Shared utils ──────────────────────────────────────── */
export function generateId(): string {
  return `ID-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

/** Available appointment dates: Freehold = Mon/Wed/Fri, Brick = Tue/Thu */
export function getAvailableDates(): { date: string; location: 'Freehold' | 'Brick' }[] {
  const results: { date: string; location: 'Freehold' | 'Brick' }[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(today);
  d.setDate(d.getDate() + 1);
  const configs = getSlotConfigs();
  while (results.length < 20) {
    const dow = d.getDay();
    let loc: 'Freehold' | 'Brick' | null = null;
    if (dow === 1 || dow === 3 || dow === 5) loc = 'Freehold';
    else if (dow === 2 || dow === 4) loc = 'Brick';
    if (loc) {
      const dateStr = d.toISOString().split('T')[0];
      const cfg = configs.find(s => s.date === dateStr && s.location === loc);
      if (!cfg?.dayBlocked) {
        results.push({ date: dateStr, location: loc });
      }
    }
    d.setDate(d.getDate() + 1);
  }
  return results;
}

export function getAvailableTimesForSlot(date: string, location: 'Freehold' | 'Brick'): string[] {
  const cfg = getSlotConfig(date, location);
  const booked = getAppointments()
    .filter(a => a.date === date && a.location === location && a.status !== 'cancelled')
    .map(a => a.time);
  return TIME_SLOTS.filter(t => !cfg.blockedTimes.includes(t) && !booked.includes(t));
}

export const TIME_SLOTS = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '1:00 PM', '1:30 PM',
  '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
  '4:00 PM', '4:30 PM',
];

export const IV_PACKAGES = [
  { name: 'Saline',                 slug: 'saline',                 price: 125 },
  { name: 'MTO',                    slug: 'mto',                    price: 160 },
  { name: 'The Myers',              slug: 'the-myers',              price: 200 },
  { name: 'The After Party',        slug: 'the-after-party',        price: 175 },
  { name: 'Go With The Flow',       slug: 'go-with-the-flow',       price: 225 },
  { name: 'The Migraine Minimizer', slug: 'the-migraine-minimizer', price: 225 },
  { name: 'The Defensive Line',     slug: 'the-defensive-line',     price: 300 },
  { name: 'The Kitchen Sink',       slug: 'the-kitchen-sink',       price: 400 },
  { name: 'The greNADe',            slug: 'the-grenade',            price: 450 },
];
