import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const { pathname } = useLocation();
  return (
    <nav aria-label="Breadcrumb" className="container-page pt-6">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-ink-500">
        <li>
          <Link to="/" className="hover:text-primary-700">Home</Link>
        </li>
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          const active = isLast || (item.href ? pathname === item.href : false);
          return (
            <li key={i} className="flex items-center gap-1.5">
              <ChevronRight className="w-4 h-4 text-ink-300" />
              {item.href && !isLast ? (
                <Link to={item.href} className="hover:text-primary-700">{item.label}</Link>
              ) : (
                <span className={active ? 'text-ink-800 font-medium' : ''}>{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
