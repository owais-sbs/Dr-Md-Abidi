import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle2 } from 'lucide-react';
import { fadeUp, viewport } from '@/animations/variants';
import { saveContactMessage, generateId, type ContactMessage } from '@/data/appointments';

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg: ContactMessage = {
      id: generateId(),
      name: form.name,
      email: form.email,
      phone: form.phone,
      message: form.message,
      status: 'new',
      createdAt: new Date().toISOString(),
    };
    saveContactMessage(msg);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <motion.div initial="hidden" whileInView="visible" viewport={viewport} variants={fadeUp} className="card p-8 text-center">
        <div className="grid place-items-center w-14 h-14 rounded-full bg-green-50 text-green-600 mx-auto">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <h3 className="mt-4 text-xl font-bold text-ink-900">Thank you for reaching out</h3>
        <p className="mt-2 text-ink-600">Our team will get back to you shortly. For urgent needs, please call us directly.</p>
      </motion.div>
    );
  }

  return (
    <motion.form
      onSubmit={onSubmit}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={fadeUp}
      className="card p-6 sm:p-8 space-y-5"
    >
      <h3 className="text-xl font-bold text-ink-900">Send Us a Message</h3>
      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Full Name" name="name" value={form.name} onChange={onChange} required />
        <Field label="Email" name="email" type="email" value={form.email} onChange={onChange} required />
      </div>
      <Field label="Phone" name="phone" type="tel" value={form.phone} onChange={onChange} />
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-ink-700 mb-1.5">Message</label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          value={form.message}
          onChange={onChange}
          className="w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-ink-800 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
          placeholder="How can we help you?"
        />
      </div>
      <button type="submit" className="btn-primary w-full sm:w-auto">
        Send Message
        <Send className="w-4 h-4" />
      </button>
    </motion.form>
  );
}

function Field({
  label, name, type = 'text', value, onChange, required,
}: {
  label: string; name: string; type?: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-ink-700 mb-1.5">{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-ink-800 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      />
    </div>
  );
}
