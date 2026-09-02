export async function apiPost<T = Record<string, unknown>>(
  path: string,
  body: Record<string, unknown>,
  headers: Record<string, string> = {},
): Promise<T> {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
  let data: Record<string, unknown> = {};
  try {
    data = await res.json();
  } catch {
    data = {};
  }
  if (!res.ok) {
    throw new Error(String(data.error || 'Something went wrong. Please try again.'));
  }
  return data as T;
}

export function sendBookingOtp(email: string) {
  return apiPost<{ sent: boolean; retryAfterSeconds?: number; message?: string }>('/api/otp/send', { email });
}

export function verifyBookingOtp(email: string, code: string) {
  return apiPost<{ verified: boolean; verificationToken: string; email: string }>('/api/otp/verify', { email, code });
}

export function createBookingRequest(payload: Record<string, unknown>) {
  return apiPost<{ id: string; status: string }>('/api/appointments', payload);
}

export function reviewBooking(id: string, action: 'approve' | 'reject', accessToken: string, reason = '') {
  return apiPost<{ id: string; status: string; emailSent?: boolean; warning?: string }>(
    '/api/appointments/review',
    { id, action, reason },
    { Authorization: `Bearer ${accessToken}` },
  );
}
