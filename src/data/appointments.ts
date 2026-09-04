import { supabase } from '@/lib/supabase';

/* ─── Types ─────────────────────────────────────────────── */

export type AppointmentStatus = 'pending' | 'approved' | 'hold' | 'completed' | 'cancelled' | 'rejected';

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
  intake?: Record<string, unknown>;
  emailVerified?: boolean;
  approvedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
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

export interface SlotConfig {
  date: string;
  location: 'Freehold' | 'Brick';
  dayBlocked: boolean;
  blockedTimes: string[];
}

export interface BookedSlot {
  date: string;
  time: string;
  location: 'Freehold' | 'Brick';
  status: AppointmentStatus;
}

export interface TimeSlotAvailability {
  time: string;
  available: boolean;
  reason?: 'booked' | 'blocked';
}

function throwApi(error: { message: string; code?: string } | null, fallback: string): never {
  if (error?.code === '23505') {
    throw new Error('This time slot was just booked. Please choose another time.');
  }
  throw new Error(error?.message || fallback);
}

function asDate(value: string | null | undefined): string {
  if (!value) return '';
  return String(value).slice(0, 10);
}

function localIsoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function rowToAppointment(row: Record<string, unknown>): Appointment {
  return {
    id: String(row.id),
    packageName: String(row.package_name ?? ''),
    packageSlug: String(row.package_slug ?? ''),
    location: (row.location === 'Brick' ? 'Brick' : 'Freehold'),
    date: asDate(row.date as string),
    time: String(row.time ?? ''),
    email: String(row.email ?? ''),
    firstName: String(row.first_name ?? ''),
    lastName: String(row.last_name ?? ''),
    phone: String(row.phone ?? ''),
    dob: String(row.dob ?? ''),
    gender: String(row.gender ?? ''),
    address: String(row.address ?? ''),
    insuranceName: String(row.insurance_name ?? ''),
    allergies: String(row.allergies ?? ''),
    medications: String(row.medications ?? ''),
    medicalHistory: String(row.medical_history ?? ''),
    reasonForVisit: String(row.reason_for_visit ?? ''),
    status: (row.status as AppointmentStatus) || 'pending',
    adminNotes: String(row.admin_notes ?? ''),
    intake: (row.intake as Record<string, unknown>) || {},
    emailVerified: Boolean(row.email_verified),
    approvedAt: row.approved_at ? String(row.approved_at) : undefined,
    rejectedAt: row.rejected_at ? String(row.rejected_at) : undefined,
    rejectionReason: String(row.rejection_reason ?? ''),
    createdAt: String(row.created_at ?? ''),
    updatedAt: row.updated_at ? String(row.updated_at) : undefined,
  };
}

function appointmentToRow(appt: Appointment) {
  return {
    id: appt.id,
    package_name: appt.packageName,
    package_slug: appt.packageSlug,
    location: appt.location,
    date: appt.date,
    time: appt.time,
    email: appt.email,
    first_name: appt.firstName,
    last_name: appt.lastName,
    phone: appt.phone,
    dob: appt.dob,
    gender: appt.gender,
    address: appt.address || '',
    insurance_name: appt.insuranceName || '',
    allergies: appt.allergies || '',
    medications: appt.medications || '',
    medical_history: appt.medicalHistory || '',
    reason_for_visit: appt.reasonForVisit || '',
    status: appt.status,
    admin_notes: appt.adminNotes || '',
    intake: appt.intake || {},
  };
}

function rowToSlot(row: Record<string, unknown>): SlotConfig {
  return {
    date: asDate(row.date as string),
    location: (row.location === 'Brick' ? 'Brick' : 'Freehold'),
    dayBlocked: Boolean(row.day_blocked),
    blockedTimes: Array.isArray(row.blocked_times) ? (row.blocked_times as string[]) : [],
  };
}

function rowToMessage(row: Record<string, unknown>): ContactMessage {
  return {
    id: String(row.id),
    name: String(row.name ?? ''),
    email: String(row.email ?? ''),
    phone: String(row.phone ?? ''),
    message: String(row.message ?? ''),
    status: (row.status as ContactStatus) || 'new',
    createdAt: String(row.created_at ?? ''),
  };
}

/* ─── Slot Management ──────────────────────────────────── */

export async function getSlotConfigs(): Promise<SlotConfig[]> {
  const { data, error } = await supabase
    .from('slot_configs')
    .select('date, location, day_blocked, blocked_times')
    .order('date', { ascending: true });
  if (error) throwApi(error, 'Could not load slot settings.');
  return (data || []).map(row => rowToSlot(row as Record<string, unknown>));
}

export async function saveSlotConfig(cfg: SlotConfig): Promise<void> {
  const { error } = await supabase.from('slot_configs').upsert(
    {
      date: cfg.date,
      location: cfg.location,
      day_blocked: cfg.dayBlocked,
      blocked_times: cfg.blockedTimes,
    },
    { onConflict: 'date,location' },
  );
  if (error) throwApi(error, 'Could not save slot settings.');
}

export async function getSlotConfig(date: string, location: 'Freehold' | 'Brick'): Promise<SlotConfig> {
  const { data, error } = await supabase
    .from('slot_configs')
    .select('date, location, day_blocked, blocked_times')
    .eq('date', date)
    .eq('location', location)
    .maybeSingle();
  if (error) throwApi(error, 'Could not load this day\'s slots.');
  if (!data) return { date, location, dayBlocked: false, blockedTimes: [] };
  return rowToSlot(data as Record<string, unknown>);
}

/* ─── Appointments ──────────────────────────────────────── */

export async function getAppointments(): Promise<Appointment[]> {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throwApi(error, 'Could not load appointments.');
  return (data || []).map(row => rowToAppointment(row as Record<string, unknown>));
}

export async function getBookedSlots(): Promise<BookedSlot[]> {
  const { data, error } = await supabase
    .from('booked_slots')
    .select('date, time, location, status');
  if (error) throwApi(error, 'Could not load booked slots.');
  return (data || []).map(row => ({
    date: asDate(row.date as string),
    time: String(row.time ?? ''),
    location: (row.location === 'Brick' ? 'Brick' : 'Freehold') as 'Freehold' | 'Brick',
    status: (row.status as AppointmentStatus) || 'pending',
  }));
}

export async function saveAppointment(appt: Appointment): Promise<void> {
  const { error } = await supabase.from('appointments').insert(appointmentToRow(appt));
  if (error) throwApi(error, 'Could not submit your booking request. Please try again.');
}

export async function updateAppointment(id: string, patch: Partial<Appointment>): Promise<void> {
  const row: Record<string, unknown> = {};
  if (patch.packageName !== undefined) row.package_name = patch.packageName;
  if (patch.packageSlug !== undefined) row.package_slug = patch.packageSlug;
  if (patch.location !== undefined) row.location = patch.location;
  if (patch.date !== undefined) row.date = patch.date;
  if (patch.time !== undefined) row.time = patch.time;
  if (patch.email !== undefined) row.email = patch.email;
  if (patch.firstName !== undefined) row.first_name = patch.firstName;
  if (patch.lastName !== undefined) row.last_name = patch.lastName;
  if (patch.phone !== undefined) row.phone = patch.phone;
  if (patch.dob !== undefined) row.dob = patch.dob;
  if (patch.gender !== undefined) row.gender = patch.gender;
  if (patch.address !== undefined) row.address = patch.address;
  if (patch.insuranceName !== undefined) row.insurance_name = patch.insuranceName;
  if (patch.allergies !== undefined) row.allergies = patch.allergies;
  if (patch.medications !== undefined) row.medications = patch.medications;
  if (patch.medicalHistory !== undefined) row.medical_history = patch.medicalHistory;
  if (patch.reasonForVisit !== undefined) row.reason_for_visit = patch.reasonForVisit;
  if (patch.status !== undefined) row.status = patch.status;
  if (patch.adminNotes !== undefined) row.admin_notes = patch.adminNotes;
  if (patch.intake !== undefined) row.intake = patch.intake;

  const { error } = await supabase.from('appointments').update(row).eq('id', id);
  if (error) throwApi(error, 'Could not update the appointment.');
}

export async function updateAppointmentStatus(id: string, status: AppointmentStatus): Promise<void> {
  await updateAppointment(id, { status });
}

/* ─── Contact Messages ──────────────────────────────────── */

export async function getContactMessages(): Promise<ContactMessage[]> {
  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throwApi(error, 'Could not load contact messages.');
  return (data || []).map(row => rowToMessage(row as Record<string, unknown>));
}

export async function saveContactMessage(msg: ContactMessage): Promise<void> {
  const { error } = await supabase.from('contact_messages').insert({
    id: msg.id,
    name: msg.name,
    email: msg.email,
    phone: msg.phone || '',
    message: msg.message,
    status: 'new',
  });
  if (error) throwApi(error, 'Could not send your message. Please try again.');
}

export async function updateContactStatus(id: string, status: ContactStatus): Promise<void> {
  const { error } = await supabase.from('contact_messages').update({ status }).eq('id', id);
  if (error) throwApi(error, 'Could not update the message.');
}

/* ─── Shared utils ──────────────────────────────────────── */

export function generateId(): string {
  return `ID-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

export async function getAvailableDates(): Promise<{ date: string; location: 'Freehold' | 'Brick' }[]> {
  // Fetch blocked-day configs — fall back to empty list so dates still show
  let configs: SlotConfig[] = [];
  try {
    configs = await getSlotConfigs();
  } catch (err) {
    console.warn('[appointments] Could not load slot configs, showing all dates:', err);
  }

  const results: { date: string; location: 'Freehold' | 'Brick' }[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(today);
  d.setDate(d.getDate() + 1);
  while (results.length < 20) {
    const dow = d.getDay();
    let loc: 'Freehold' | 'Brick' | null = null;
    if (dow === 1 || dow === 3 || dow === 5) loc = 'Freehold';
    else if (dow === 2 || dow === 4) loc = 'Brick';
    if (loc) {
      const dateStr = localIsoDate(d);
      const cfg = configs.find(s => s.date === dateStr && s.location === loc);
      if (!cfg?.dayBlocked) {
        results.push({ date: dateStr, location: loc });
      }
    }
    d.setDate(d.getDate() + 1);
  }
  return results;
}

export async function getAvailableTimesForSlot(date: string, location: 'Freehold' | 'Brick'): Promise<string[]> {
  const slots = await getTimeSlotAvailability(date, location);
  return slots.filter(slot => slot.available).map(slot => slot.time);
}

export async function getTimeSlotAvailability(
  date: string,
  location: 'Freehold' | 'Brick',
): Promise<TimeSlotAvailability[]> {
  let cfg: SlotConfig = { date, location, dayBlocked: false, blockedTimes: [] };
  let booked: BookedSlot[] = [];
  try {
    [cfg, booked] = await Promise.all([
      getSlotConfig(date, location),
      getBookedSlots(),
    ]);
  } catch (err) {
    console.warn('[appointments] Could not load slot availability:', err);
  }
  const taken = new Set(booked
    .filter(a => a.date === date && a.location === location)
    .map(a => a.time));
  return TIME_SLOTS.map(time => {
    if (cfg.dayBlocked || cfg.blockedTimes.includes(time)) {
      return { time, available: false, reason: 'blocked' };
    }
    if (taken.has(time)) return { time, available: false, reason: 'booked' };
    return { time, available: true };
  });
}

export const TIME_SLOTS = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '1:00 PM', '1:30 PM',
  '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
  '4:00 PM', '4:30 PM',
];

export { IV_PACKAGES } from './ivPackages';
