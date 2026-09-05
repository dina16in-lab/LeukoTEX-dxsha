import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ReactLenis } from 'lenis/react';
import { Navbar } from './components/common/Navbar';
import { MobileNav } from './components/common/MobileNav';
import { Footer } from './components/common/Footer';
import { Interactive3DBg } from './components/canvas/Interactive3DBg';
import { ParticleDotField } from './components/canvas/ParticleDotField';
import { CustomCursor } from './components/common/CustomCursor';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { SkipToContent } from './components/common/SkipToContent';
import { ScrollToTop } from './components/common/ScrollToTop';
import { PageTransition } from './components/common/PageTransition';

// Eagerly loaded pages (critical path)
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';

// Lazy loaded pages (secondary routes)
const WorkPage = lazy(() => import('./pages/WorkPage').then(m => ({ default: m.WorkPage })));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage').then(m => ({ default: m.PrivacyPolicyPage })));
const TermsOfServicePage = lazy(() => import('./pages/TermsOfServicePage').then(m => ({ default: m.TermsOfServicePage })));

// Loading fallback for lazy-loaded routes
const PageLoader: React.FC = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <span className="material-symbols-outlined animate-spin text-[#3E2723]/40 text-[32px]">
        progress_activity
      </span>
      <span className="font-label-mono text-label-mono text-[#3E2723]/40 uppercase tracking-widest">
        Loading
      </span>
    </div>
  </div>
);

export const App: React.FC = () => {
  return (
    <ReactLenis root>
      <div className="relative min-h-screen bg-[#F5F5DC] text-[#3E2723] font-body flex flex-col justify-between overflow-x-hidden">
        <SkipToContent />
        <CustomCursor />

        {/* Global Scroll-Driven 3D Background */}
        <Interactive3DBg />

        {/* Premium Interactive Dot Field Background */}
        <ParticleDotField />

        {/* Fixed Top Glassmorphic Navigation Header */}
        <Navbar />

        {/* Main Routed Content */}
        <ErrorBoundary>
          <main id="main-content" className="relative z-10 flex-grow pb-16 md:pb-0">
            <ScrollToTop />
            <Suspense fallback={<PageLoader />}>
              <PageTransition>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/work" element={<WorkPage />} />
                  <Route path="/privacy" element={<PrivacyPolicyPage />} />
                  <Route path="/terms" element={<TermsOfServicePage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </PageTransition>
            </Suspense>
          </main>
        </ErrorBoundary>

        {/* Standardized Editorial Footer */}
        <Footer />

        {/* Fixed Bottom Glassmorphic Mobile Navigation Bar */}
        <MobileNav />
      </div>
    </ReactLenis>
  );
};

export default App;
