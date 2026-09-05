import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatedLogo } from './AnimatedLogo';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  // On homepage, nav items scroll to sections; on other pages, they navigate to home with hash
  const navLinks = [
    { name: 'Services', id: 'services', path: '/#services' },
    { name: 'Work', id: 'work', path: '/work' },
    { name: 'About', id: 'about', path: '/#about' },
    { name: 'Contact', id: 'contact', path: '/#contact' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, link: typeof navLinks[0]) => {
    if (isHomePage && link.path.startsWith('/#')) {
      scrollToSection(e, link.id);
    }
    // For non-hash routes (like /work), let React Router handle it naturally
    // For hash routes on non-home pages, navigate to home then scroll (handled by ScrollToTop)
  };

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 pt-safe transition-all duration-500 nav-blur ${
          scrolled
            ? 'bg-background/80 border-b border-border-metallic/40 shadow-sm backdrop-blur-xl'
            : 'bg-background/40 border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto h-20 px-margin-mobile md:px-margin-desktop flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" aria-label="LEUKOTEX Home">
            <AnimatedLogo />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-10" aria-label="Main navigation">
            {navLinks.map((link) => {
              const isHashLink = link.path.startsWith('/#');
              
              if (isHashLink) {
                return (
                  <a
                    key={link.id}
                    href={link.path}
                    onClick={(e) => handleNavClick(e, link)}
                    className="font-label-caps text-[13px] uppercase tracking-[0.18em] transition-all duration-300 relative py-1 group text-white hover:text-white"
                  >
                    {link.name}
                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-outline group-hover:w-full transition-all duration-300" />
                  </a>
                );
              }

              return (
                <NavLink
                  key={link.id}
                  to={link.path}
                  className={({ isActive }) =>
                    `font-label-caps text-[13px] uppercase tracking-[0.18em] transition-all duration-300 relative py-1 group ${
                      isActive ? 'text-white' : 'text-white hover:text-white'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {link.name}
                      {isActive ? (
                        <span className="absolute bottom-0 left-0 w-full h-[2px] bg-secondary-container rounded-full shadow-[0_0_8px_rgba(0,123,255,0.4)]" />
                      ) : (
                        <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-outline group-hover:w-full transition-all duration-300" />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Right Action Items */}
          <div className="flex items-center gap-4">
            {isHomePage ? (
              <a
                href="#contact"
                onClick={(e) => scrollToSection(e, 'contact')}
                className="hidden sm:inline-flex items-center gap-2 px-5 py-2 rounded-full border border-border-metallic text-white hover:text-white hover:border-secondary transition-all duration-300 font-label-mono text-label-mono uppercase bg-surface-muted/40 backdrop-blur-sm group"
              >
                <span>Initiate Project</span>
                <span className="material-symbols-outlined text-[14px] text-white group-hover:translate-x-0.5 transition-transform">
                  north_east
                </span>
              </a>
            ) : (
              <Link
                to="/#contact"
                className="hidden sm:inline-flex items-center gap-2 px-5 py-2 rounded-full border border-border-metallic text-white hover:text-white hover:border-secondary transition-all duration-300 font-label-mono text-label-mono uppercase bg-surface-muted/40 backdrop-blur-sm group"
              >
                <span>Initiate Project</span>
                <span className="material-symbols-outlined text-[14px] text-white group-hover:translate-x-0.5 transition-transform">
                  north_east
                </span>
              </Link>
            )}

            {/* Profile Avatar Icon */}
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-md">
              <span className="material-symbols-outlined text-white text-[18px]">person</span>
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-white hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded-lg"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              <span className="material-symbols-outlined text-[30px]">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/95 backdrop-blur-2xl md:hidden pt-28 px-margin-mobile flex flex-col justify-between pb-12 animate-in fade-in duration-300"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div className="flex flex-col gap-6">
            <span className="font-label-mono text-label-mono text-white uppercase tracking-widest">
              Navigation Menu
            </span>
            <div className="flex flex-col gap-4">
              {navLinks.map((link, idx) => {
                const isHashLink = link.path.startsWith('/#');
                
                if (isHashLink && isHomePage) {
                  return (
                    <a
                      key={link.id}
                      href={`#${link.id}`}
                      onClick={(e) => scrollToSection(e, link.id)}
                      className="font-headline-display text-3xl uppercase tracking-tight py-2 border-b border-border-metallic/40 flex justify-between items-center text-white"
                    >
                      <span>{link.name}</span>
                      <span className="font-label-mono text-sm text-white">0{idx + 1}</span>
                    </a>
                  );
                }

                return (
                  <Link
                    key={link.id}
                    to={isHashLink ? link.path : link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`font-headline-display text-3xl uppercase tracking-tight py-2 border-b border-border-metallic/40 flex justify-between items-center ${
                      location.pathname === link.path ? 'text-white font-bold' : 'text-white'
                    }`}
                  >
                    <span>{link.name}</span>
                    <span className="font-label-mono text-sm text-white">0{idx + 1}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-4 pt-8 border-t border-border-metallic/50">
            {isHomePage ? (
              <a
                href="#contact"
                onClick={(e) => scrollToSection(e, 'contact')}
                className="w-full bg-primary text-white font-label-caps uppercase py-4 rounded-full text-center flex items-center justify-center gap-2"
              >
                Start a Project
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </a>
            ) : (
              <Link
                to="/#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full bg-primary text-white font-label-caps uppercase py-4 rounded-full text-center flex items-center justify-center gap-2"
              >
                Start a Project
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            )}
            <div className="flex justify-between items-center text-white font-label-mono text-xs pt-2">
              <span>LEUKOTEX STUDIO</span>
              <span>CHENNAI, INDIA</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
