import { Clock, Mail, Phone } from 'lucide-react';
import { site } from '@/data/site';

export function TopBar() {
  return (
    <div className="hidden lg:block bg-primary-900 text-sky-100 text-sm">
      <div className="container-page flex items-center justify-between py-2.5">
        <div className="flex items-center gap-6">
          <span className="inline-flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-400" />
            Daily Timings&nbsp;&nbsp;{site.hours}
          </span>
          <a href={site.emailHref} className="inline-flex items-center gap-2 hover:text-sky-300 transition-colors">
            <Mail className="w-4 h-4 text-orange-400" />
            {site.email}
          </a>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sky-200/70">Trusted Arthritis &amp; Rheumatology Care in Brick &amp; Freehold, NJ</span>
          <a href={site.phoneHref} className="inline-flex items-center gap-2 font-semibold hover:text-sky-300 transition-colors">
            <Phone className="w-4 h-4 text-orange-400" />
            {site.phone}
          </a>
        </div>
      </div>
    </div>
  );
}
