import React, { useState, useEffect } from 'react';

export const MobileNav: React.FC = () => {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'services', 'about', 'contact'];
      let current = '';
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && window.scrollY >= (element.offsetTop - 150)) {
          current = section;
        }
      }
      if (current) {
        setActiveSection(current);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  const tabs = [
    { name: 'Services', id: 'services', icon: 'layers' },
    { name: 'About', id: 'about', icon: 'info' },
    { name: 'Contact', id: 'contact', icon: 'mail' },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 pb-safe bg-background/85 backdrop-blur-2xl border-t border-border-metallic/60 md:hidden"
      aria-label="Bottom Navigation"
    >
      <div className="h-16 flex justify-around items-center px-4 max-w-md mx-auto">
        {tabs.map((tab) => {
          const isActive = activeSection === tab.id;
          return (
            <a
              key={tab.id}
              href={`#${tab.id}`}
              onClick={(e) => scrollToSection(e, tab.id)}
              className={`flex flex-col items-center gap-1 transition-all duration-300 py-1 px-3 rounded-lg relative ${
                isActive
                  ? 'text-white scale-110'
                  : 'text-white hover:text-white active:scale-95'
              }`}
            >
              <span className="material-symbols-outlined text-[22px]">{tab.icon}</span>
              <span className="font-label-mono text-[9px] uppercase tracking-wider">
                {tab.name}
              </span>
              {isActive && (
                <span className="absolute -bottom-1 w-1.5 h-1.5 bg-secondary-container rounded-full shadow-[0_0_6px_#007bff]" />
              )}
            </a>
          );
        })}
      </div>
    </nav>
  );
};


