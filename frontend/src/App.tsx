import React from 'react';
import { ReactLenis } from 'lenis/react';
import { Navbar } from './components/common/Navbar';
import { MobileNav } from './components/common/MobileNav';
import { Footer } from './components/common/Footer';
import { Interactive3DBg } from './components/canvas/Interactive3DBg';
import { ParticleDotField } from './components/canvas/ParticleDotField';
import { HomePage } from './pages/HomePage';
import { CustomCursor } from './components/common/CustomCursor';

export const App: React.FC = () => {
  return (
    <ReactLenis root>
      <div className="relative min-h-screen bg-[#F5F5DC] text-[#3E2723] font-body flex flex-col justify-between overflow-x-hidden">
        <CustomCursor />
        {/* Global Scroll-Driven 3D Background */}
        <Interactive3DBg />

        {/* Premium Interactive Dot Field Background */}
        <ParticleDotField />

        {/* Fixed Top Glassmorphic Navigation Header */}
        <Navbar />

        {/* Main Single Page Content */}
        <main className="relative z-10 flex-grow pb-16 md:pb-0">
          <HomePage />
        </main>

        {/* Standardized Editorial Footer */}
        <Footer />

        {/* Fixed Bottom Glassmorphic Mobile Navigation Bar */}
        <MobileNav />
      </div>
    </ReactLenis>
  );
};

export default App;

