import { Link } from 'react-router-dom';
import { Seo } from '@/components/common/Seo';
import { Home as HomeIcon } from 'lucide-react';

export function NotFound() {
  return (
    <>
      <Seo title="Page Not Found | MD Abidi Arthritis Institute" />
      <section className="bg-white">
        <div className="container-page py-24 sm:py-32 text-center">
          <div className="text-7xl font-bold text-primary-600 font-serif">404</div>
          <h1 className="mt-4 text-2xl sm:text-3xl font-bold text-ink-900">Page Not Found</h1>
          <p className="mt-3 text-ink-600 max-w-md mx-auto">The page you are looking for may have been moved or no longer exists. Let's get you back on track.</p>
          <Link to="/" className="btn-primary mt-8 inline-flex">
            <HomeIcon className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </section>
    </>
  );
}
