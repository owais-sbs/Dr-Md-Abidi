import { findValidVerification, markVerificationUsed } from './otp';
import { sendMail } from './mail';
import { approvedEmail, rejectedEmail, requestReceivedEmail } from './templates';
import { isAdminUser, supabaseAdmin } from './supabaseAdmin';
import { fail, header, normalizeEmail, ok, type ApiResult } from './http';

const TIME_SLOTS = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '1:00 PM', '1:30 PM',
  '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
  '4:00 PM', '4:30 PM',
];

function generateId(): string {
  return `ID-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

function str(v: unknown, max = 500): string {
  return String(v ?? '').trim().slice(0, max);
}

async function requireAdmin(headers: Record<string, string | string[] | undefined>): Promise<{ ok: true } | ApiResult> {
  const auth = header(headers, 'authorization');
  const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';
  if (!token) return fail('Please sign in as an administrator.', 401);
  const { data, error } = await supabaseAdmin().auth.getUser(token);
  if (error || !data.user) return fail('Your admin session is invalid. Please sign in again.', 401);
  const meta = {
    ...(data.user.user_metadata || {}),
    ...(data.user.app_metadata || {}),
  } as Record<string, unknown>;
  if (!isAdminUser(data.user.email, meta)) return fail('You are not authorized to manage appointments.', 403);
  return { ok: true };
}

async function slotIsOpen(date: string, time: string, location: string): Promise<string | null> {
  const { data: cfg } = await supabaseAdmin()
    .from('slot_configs')
    .select('day_blocked, blocked_times')
    .eq('date', date)
    .eq('location', location)
    .maybeSingle();
  if (cfg?.day_blocked) return 'That date is not available. Please choose another day.';
  const blocked = Array.isArray(cfg?.blocked_times) ? cfg.blocked_times as string[] : [];
  if (blocked.includes(time)) return 'That time is blocked. Please choose another time.';

  const { data: taken, error } = await supabaseAdmin()
    .from('appointments')
    .select('id, status')
    .eq('date', date)
    .eq('time', time)
    .eq('location', location);
  if (error) {
    console.error('[appointments] slot check failed', error.message);
    return 'Could not confirm slot availability. Please try again.';
  }
  const conflict = (taken || []).some(r => r.status !== 'cancelled' && r.status !== 'rejected');
  if (conflict) return 'This time slot was just booked. Please choose another time.';
  return null;
}

async function insertAppointment(row: Record<string, unknown>) {
  const first = await supabaseAdmin().from('appointments').insert(row);
  if (!first.error) return first;
  if (!/email_verified|approved_at|rejected_at|rejection_reason|schema cache/i.test(first.error.message)) {
    return first;
  }
  const fallback = {
    id: row.id,
    package_name: row.package_name,
    package_slug: row.package_slug,
    location: row.location,
    date: row.date,
    time: row.time,
    email: row.email,
    first_name: row.first_name,
    last_name: row.last_name,
    phone: row.phone,
    dob: row.dob,
    gender: row.gender,
    address: row.address,
    insurance_name: row.insurance_name,
    allergies: row.allergies,
    medications: row.medications,
    medical_history: row.medical_history,
    reason_for_visit: row.reason_for_visit,
    status: 'pending',
    admin_notes: row.admin_notes,
    intake: row.intake,
  };
  return supabaseAdmin().from('appointments').insert(fallback);
}

export async function handleCreateAppointment(body: unknown): Promise<ApiResult> {
  const p = (body || {}) as Record<string, unknown>;
  const email = normalizeEmail(p.email);
  const token = str(p.verificationToken, 128);
  if (!email) return fail('A verified email is required.');
  if (!token) return fail('Please verify your email before submitting the booking.');

  const verified = await findValidVerification(email, token);
  if ('error' in verified) return fail(verified.error);

  const location = str(p.location, 20);
  const date = str(p.date, 10);
  const time = str(p.time, 20);
  const packageName = str(p.packageName, 120);
  const packageSlug = str(p.packageSlug, 120);
  const firstName = str(p.firstName, 80);
  const lastName = str(p.lastName, 80);
  const phone = str(p.phone, 40);

  if (!packageName || !packageSlug) return fail('Please select an IV package.');
  if (location !== 'Freehold' && location !== 'Brick') return fail('Please choose a valid location.');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return fail('Please choose a valid date.');
  if (!TIME_SLOTS.includes(time)) return fail('Please choose a valid time.');
  if (!firstName || !phone) return fail('Name and phone are required.');

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const chosen = new Date(`${date}T12:00:00`);
  if (Number.isNaN(chosen.getTime()) || chosen < today) return fail('Please choose a future date.');

  const slotError = await slotIsOpen(date, time, location);
  if (slotError) return fail(slotError);

  const id = generateId();
  const intake = p.intake && typeof p.intake === 'object' ? p.intake : {};
  const row = {
    id,
    package_name: packageName,
    package_slug: packageSlug,
    location,
    date,
    time,
    email,
    first_name: firstName,
    last_name: lastName,
    phone,
    dob: str(p.dob, 40),
    gender: str(p.gender, 40),
    address: str(p.address, 200),
    insurance_name: str(p.insuranceName, 120),
    allergies: str(p.allergies, 500),
    medications: str(p.medications, 500),
    medical_history: str(p.medicalHistory, 1000),
    reason_for_visit: str(p.reasonForVisit, 1000),
    status: 'pending',
    admin_notes: '',
    intake,
    email_verified: true,
  };

  const inserted = await insertAppointment(row);
  if (inserted.error) {
    if (inserted.error.code === '23505') return fail('This time slot was just booked. Please choose another time.');
    console.error('[appointments] insert failed', inserted.error.message);
    return fail('Could not submit your booking request. Please try again.', 500);
  }

  await markVerificationUsed(verified.id);

  const name = [firstName, lastName].filter(Boolean).join(' ') || 'there';
  try {
    const mail = requestReceivedEmail({ name, packageName, date, time, location, id });
    await sendMail({ to: email, ...mail });
  } catch (err) {
    console.error('[appointments] request-received email failed', err instanceof Error ? err.message : err);
  }

  return ok({ id, status: 'pending' }, 201);
}

export async function handleReviewAppointment(
  body: unknown,
  headers: Record<string, string | string[] | undefined>,
): Promise<ApiResult> {
  const admin = await requireAdmin(headers);
  if (!('ok' in admin) || admin.ok !== true) return admin as ApiResult;

  const p = (body || {}) as Record<string, unknown>;
  const id = str(p.id, 80);
  const action = str(p.action, 20);
  const reason = str(p.reason, 500);
  if (!id) return fail('A valid appointment ID is required.');
  if (action !== 'approve' && action !== 'reject') return fail('Action must be approve or reject.');

  const { data: appt, error } = await supabaseAdmin()
    .from('appointments')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) {
    console.error('[appointments] review lookup failed', error.message);
    return fail('Could not load that appointment.', 500);
  }
  if (!appt) return fail('Appointment not found.', 404);

  const nextStatus = action === 'approve' ? 'approved' : 'rejected';
  if (appt.status === nextStatus) {
    return ok({ id, status: nextStatus, emailSent: false, message: `Appointment is already ${nextStatus}.` });
  }

  const now = new Date().toISOString();
  const patch = action === 'approve'
    ? { status: 'approved', approved_at: now, rejected_at: null, rejection_reason: '' }
    : { status: 'rejected', rejected_at: now, rejection_reason: reason };

  const { error: updateError } = await supabaseAdmin().from('appointments').update(patch).eq('id', id);
  if (updateError) {
    const fallback = await supabaseAdmin().from('appointments').update({ status: nextStatus }).eq('id', id);
    if (fallback.error) {
      console.error('[appointments] review update failed', updateError.message);
      return fail('Could not update the appointment. If Decline fails, run supabase/patch-otp-mail.sql in Supabase, then try again.', 500);
    }
  }

  const name = [appt.first_name, appt.last_name].filter(Boolean).join(' ') || 'there';
  const details = {
    name,
    packageName: String(appt.package_name || ''),
    date: String(appt.date || '').slice(0, 10),
    time: String(appt.time || ''),
    location: String(appt.location || ''),
    id,
  };

  let emailSent = true;
  try {
    const mail = action === 'approve' ? approvedEmail(details) : rejectedEmail(details);
    await sendMail({ to: String(appt.email), ...mail });
  } catch (err) {
    emailSent = false;
    console.error('[appointments] decision email failed', err instanceof Error ? err.message : err);
  }

  return ok({
    id,
    status: nextStatus,
    emailSent,
    warning: emailSent ? undefined : 'Status was updated, but the customer email could not be sent. Please try again or contact the patient directly.',
  });
}
