export const CLINIC = {
  name: 'MD Abidi Arthritis Institute',
  tagline: 'Trusted Arthritis & Rheumatology Care',
  phone: '732-840-8402',
  email: 'admin@mdabidi.com',
  hours: '08:00 AM – 05:00 PM',
  logo: 'https://mdabidi.com/wp-content/uploads/2025/05/Arthritis-Institute-new-logo-1-1024x387.webp',
  locations: {
    Brick: '206 Jack Martin Blvd Suite C2, Brick, NJ 08724',
    Freehold: '495 Iron Bridge Rd Suite 5, Freehold, NJ 07728',
  } as Record<string, string>,
};

export function formatLongDate(iso: string): string {
  const d = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

function layout(title: string, inner: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Georgia,'Times New Roman',serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
          <tr>
            <td style="background:#142657;padding:20px 28px;text-align:center;">
              <img src="${CLINIC.logo}" alt="${CLINIC.name}" height="42" style="height:42px;width:auto;background:#ffffff;padding:8px 12px;border-radius:10px;"/>
              <p style="margin:12px 0 0;color:#bae6fd;font-size:12px;font-family:Arial,sans-serif;letter-spacing:0.08em;text-transform:uppercase;">${CLINIC.tagline}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 28px;color:#0f172a;font-family:Arial,sans-serif;font-size:15px;line-height:1.6;">
              ${inner}
            </td>
          </tr>
          <tr>
            <td style="background:#f8fafc;padding:20px 28px;border-top:1px solid #e2e8f0;font-family:Arial,sans-serif;font-size:12px;color:#64748b;line-height:1.6;">
              <strong style="color:#142657;">${CLINIC.name}</strong><br/>
              Brick, NJ · Freehold, NJ<br/>
              Phone: ${CLINIC.phone} · ${CLINIC.email}<br/>
              Hours: ${CLINIC.hours}<br/><br/>
              This message was sent regarding your IV Therapy appointment request. Please do not reply with medical emergencies.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function detailsTable(rows: [string, string][]): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
    ${rows.map(([k, v], i) => `
      <tr>
        <td style="padding:10px 14px;background:${i % 2 ? '#ffffff' : '#f8fafc'};font-size:13px;color:#64748b;width:38%;font-family:Arial,sans-serif;">${k}</td>
        <td style="padding:10px 14px;background:${i % 2 ? '#ffffff' : '#f8fafc'};font-size:14px;color:#0f172a;font-weight:700;font-family:Arial,sans-serif;">${v}</td>
      </tr>`).join('')}
  </table>`;
}

export function otpEmail(code: string): { subject: string; html: string; text: string } {
  const subject = `Your ${CLINIC.name} verification code`;
  const html = layout(subject, `
    <p style="margin:0 0 12px;font-size:13px;color:#0369a1;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">Email verification</p>
    <h1 style="margin:0 0 16px;font-size:22px;color:#142657;">Verify your email</h1>
    <p>Use this one-time code to continue booking your IV Therapy appointment. It expires in 10 minutes and can be used only once.</p>
    <p style="margin:24px 0;text-align:center;">
      <span style="display:inline-block;letter-spacing:0.35em;font-size:32px;font-weight:800;color:#142657;background:#eff6ff;border:2px solid #bfdbfe;border-radius:12px;padding:14px 22px;">${code}</span>
    </p>
    <p style="font-size:13px;color:#64748b;">If you did not request this code, you can ignore this email.</p>
  `);
  const text = `Your verification code is ${code}. It expires in 10 minutes. If you did not request this, ignore this email. — ${CLINIC.name}`;
  return { subject, html, text };
}

export function requestReceivedEmail(d: {
  name: string; packageName: string; date: string; time: string; location: string; id: string;
}): { subject: string; html: string; text: string } {
  const subject = `We received your IV Therapy booking request`;
  const html = layout(subject, `
    <h1 style="margin:0 0 16px;font-size:22px;color:#142657;">Request received</h1>
    <p>Hello ${d.name},</p>
    <p>Thank you for requesting an IV Therapy appointment. This is <strong>not a confirmation</strong> yet. Dr. Abidi will review your intake form and we will email you once a decision is made.</p>
    ${detailsTable([
      ['Package', d.packageName],
      ['Date', formatLongDate(d.date)],
      ['Time', d.time],
      ['Location', `${d.location}, NJ`],
      ['Request ID', d.id],
      ['Status', 'Pending doctor review'],
    ])}
    <p>If you have questions, call us at ${CLINIC.phone}.</p>
    <p>Regards,<br/><strong>${CLINIC.name}</strong><br/>${CLINIC.tagline}</p>
  `);
  const text = `Hello ${d.name}, we received your IV Therapy request (${d.id}) for ${d.packageName} on ${formatLongDate(d.date)} at ${d.time} in ${d.location}. Status: pending doctor review. — ${CLINIC.name}`;
  return { subject, html, text };
}

export function approvedEmail(d: {
  name: string; packageName: string; date: string; time: string; location: string; id: string;
}): { subject: string; html: string; text: string } {
  const subject = 'Your IV Therapy Appointment Has Been Confirmed';
  const address = CLINIC.locations[d.location] || `${d.location}, NJ`;
  const html = layout(subject, `
    <p style="margin:0 0 12px;font-size:13px;color:#15803d;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">Appointment confirmed</p>
    <h1 style="margin:0 0 16px;font-size:22px;color:#142657;">We're pleased to confirm your visit</h1>
    <p>Hello ${d.name},</p>
    <p>We're pleased to confirm that your IV Therapy appointment has been approved.</p>
    ${detailsTable([
      ['Package', d.packageName],
      ['Date', formatLongDate(d.date)],
      ['Time', d.time],
      ['Location', address],
      ['Appointment ID', d.id],
    ])}
    <p style="background:#fff7ed;border:1px solid #fed7aa;border-radius:12px;padding:14px;font-size:13px;color:#9a3412;">
      <strong>Please arrive at the scheduled time.</strong> Eat a light meal, drink water beforehand, and bring a photo ID. If you feel unwell, contact the clinic before your visit.
    </p>
    <p>If you have any questions, please contact our team at ${CLINIC.phone} or ${CLINIC.email}.</p>
    <p>Regards,<br/><strong>${CLINIC.name}</strong><br/>${CLINIC.tagline}</p>
  `);
  const text = `Hello ${d.name}, your IV Therapy appointment is confirmed. Package: ${d.packageName}. Date: ${formatLongDate(d.date)}. Time: ${d.time}. Location: ${address}. Appointment ID: ${d.id}. Please arrive on time. — ${CLINIC.name}`;
  return { subject, html, text };
}

export function rejectedEmail(d: {
  name: string; packageName: string; date: string; time: string; location: string; id: string;
}): { subject: string; html: string; text: string } {
  const subject = 'Update on your IV Therapy appointment request';
  const html = layout(subject, `
    <h1 style="margin:0 0 16px;font-size:22px;color:#142657;">Update on your request</h1>
    <p>Hello ${d.name},</p>
    <p>Thank you for your interest in IV Therapy at ${CLINIC.name}. After review, we are unable to approve the requested appointment at this time.</p>
    ${detailsTable([
      ['Package', d.packageName],
      ['Requested date', formatLongDate(d.date)],
      ['Requested time', d.time],
      ['Location', `${d.location}, NJ`],
      ['Request ID', d.id],
    ])}
    <p>This decision is based on clinical review of the information provided. You are welcome to contact our office if you would like to discuss other options or request a different time.</p>
    <p>Phone: ${CLINIC.phone}<br/>Email: ${CLINIC.email}</p>
    <p>Regards,<br/><strong>${CLINIC.name}</strong><br/>${CLINIC.tagline}</p>
  `);
  const text = `Hello ${d.name}, we are unable to approve your IV Therapy request (${d.id}) for ${d.packageName} on ${formatLongDate(d.date)} at ${d.time}. Please contact ${CLINIC.phone} if you have questions. — ${CLINIC.name}`;
  return { subject, html, text };
}
