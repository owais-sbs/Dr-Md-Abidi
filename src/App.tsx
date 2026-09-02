import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
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
import { Saline } from '@/pages/iv/Saline';
import { TheMyers } from '@/pages/iv/TheMyers';
import { TheAfterParty } from '@/pages/iv/TheAfterParty';
import { MTO } from '@/pages/iv/MTO';
import { GoWithTheFlow } from '@/pages/iv/GoWithTheFlow';
import { TheMigraineMinimizer } from '@/pages/iv/TheMigraineMinimizer';
import { TheDefensiveLine } from '@/pages/iv/TheDefensiveLine';
import { TheKitchenSink } from '@/pages/iv/TheKitchenSink';
import { TheGrenade } from '@/pages/iv/TheGrenade';
import { BookIV } from '@/pages/BookIV';
import { AdminDashboard } from '@/pages/AdminDashboard';
import { CmsConditionDetail } from '@/pages/CmsConditionDetail';
import { CmsIVPackageDetail } from '@/pages/CmsIVPackageDetail';
import { NotFound } from '@/pages/NotFound';

// Layout wrapper — renders header/footer for all public routes
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
        <Route path="/admin" element={<AdminDashboard />} />

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
          <Route path="/iv-packages/saline/" element={<Saline />} />
          <Route path="/iv-packages/the-myers/" element={<TheMyers />} />
          <Route path="/iv-packages/the-after-party/" element={<TheAfterParty />} />
          <Route path="/iv-packages/mto/" element={<MTO />} />
          <Route path="/iv-packages/go-with-the-flow/" element={<GoWithTheFlow />} />
          <Route path="/iv-packages/the-migraine-minimizer/" element={<TheMigraineMinimizer />} />
          <Route path="/iv-packages/the-defensive-line/" element={<TheDefensiveLine />} />
          <Route path="/iv-packages/the-kitchen-sink/" element={<TheKitchenSink />} />
          <Route path="/iv-packages/the-grenade/" element={<TheGrenade />} />
          <Route path="/book-iv/" element={<BookIV />} />
          <Route path="/iv-packages/cms/:slug/" element={<CmsIVPackageDetail />} />
          <Route path="/cms-condition/:slug/" element={<CmsConditionDetail />} />
          <Route path="/happy-patients/" element={<HappyPatients />} />
          <Route path="/blog/" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/contact-us/" element={<Contact />} />
          <Route path="/disclaimer/" element={<Disclaimer />} />
          <Route path="/privacy-policy/" element={<PrivacyPolicy />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
