import { BrowserRouter, Routes, Route, Outlet, Navigate, useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { TopBar } from '@/components/layout/TopBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ScrollToTop } from '@/components/common/ScrollToTop';
import { Home } from '@/pages/Home';
import { About } from '@/pages/About';
import { Conditions } from '@/pages/Conditions';
import { ConditionDetail } from '@/pages/ConditionDetail';
import { HappyPatients } from '@/pages/HappyPatients';
import { Blog } from '@/pages/Blog';
import { BlogPostPage } from '@/pages/BlogPostPage';
import { Contact } from '@/pages/Contact';
import { Disclaimer } from '@/pages/Disclaimer';
import { PrivacyPolicy } from '@/pages/PrivacyPolicy';
import { IVPackages } from '@/pages/IVPackages';
import { BookIV } from '@/pages/BookIV';
import { AdminDashboard } from '@/pages/AdminDashboard';
import { IVPackageRoute } from '@/pages/IVPackageRoute';
import { PublicSlugPage } from '@/pages/PublicSlugPage';
import { NotFound } from '@/pages/NotFound';

function RedirectIvCms() {
  const { slug } = useParams<{ slug: string }>();
  return <Navigate to={`/iv-packages/${slug}/`} replace />;
}
function RedirectConditionCms() {
  const { slug } = useParams<{ slug: string }>();
  return <Navigate to={`/${slug}/`} replace />;
}
function PublicLayout() {
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerH, setHeaderH] = useState(104);

  useEffect(() => {
    function measure() {
      if (headerRef.current) setHeaderH(headerRef.current.offsetHeight);
    }
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Fixed header — always on top across all pages */}
      <div ref={headerRef} className="fixed top-0 left-0 right-0 z-50 w-full bg-white shadow-sm">
        <TopBar />
        <Header />
      </div>
      {/* Push page content below the fixed header */}
      <div style={{ height: headerH }} className="shrink-0" />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Admin — no header/footer */}
        <Route path="/admin" element={<Navigate to="/admin/overview" replace />} />
        <Route path="/admin/:page" element={<AdminDashboard />} />

        {/* Public site — wrapped with header/footer */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about-us/" element={<About />} />
          <Route path="/conditions-we-treat/" element={<Conditions />} />
          <Route path="/carpal-tunnel-syndrome/" element={<ConditionDetail slug="carpal-tunnel-syndrome" />} />
          <Route path="/rheumatoid-arthritis/" element={<ConditionDetail slug="rheumatoid-arthritis" />} />
          <Route path="/psoriatic-arthritis/" element={<ConditionDetail slug="psoriatic-arthritis" />} />
          <Route path="/lupus/" element={<ConditionDetail slug="lupus" />} />
          <Route path="/sjogrens-syndrome/" element={<ConditionDetail slug="sjogrens-syndrome" />} />
          <Route path="/polymyositis-and-dermatomyositis/" element={<ConditionDetail slug="polymyositis-and-dermatomyositis" />} />
          <Route path="/vasculitis/" element={<ConditionDetail slug="vasculitis" />} />
          <Route path="/spondyloarthritis/" element={<ConditionDetail slug="spondyloarthritis" />} />
          <Route path="/gout/" element={<ConditionDetail slug="gout" />} />
          <Route path="/iv-packages/" element={<IVPackages />} />
          <Route path="/iv-packages/cms/:slug/" element={<RedirectIvCms />} />
          <Route path="/iv-packages/:slug/" element={<IVPackageRoute />} />
          <Route path="/book-iv/" element={<BookIV />} />
          <Route path="/cms-condition/:slug/" element={<RedirectConditionCms />} />
          <Route path="/happy-patients/" element={<HappyPatients />} />
          <Route path="/blog/" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/contact-us/" element={<Contact />} />
          <Route path="/disclaimer/" element={<Disclaimer />} />
          <Route path="/privacy-policy/" element={<PrivacyPolicy />} />
          <Route path="/:slug/" element={<PublicSlugPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
