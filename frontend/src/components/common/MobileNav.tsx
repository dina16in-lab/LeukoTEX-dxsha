import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

export const MobileNav: React.FC = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

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
    { name: 'Home', id: 'home', icon: 'home', path: '/' },
    { name: 'Work', id: 'work', icon: 'work', path: '/work' },
    { name: 'Services', id: 'services', icon: 'layers', path: '/#services' },
    { name: 'Contact', id: 'contact', icon: 'mail', path: '/#contact' },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 pb-safe bg-background/85 backdrop-blur-2xl border-t border-border-metallic/60 md:hidden"
      aria-label="Bottom Navigation"
    >
      <div className="h-16 flex justify-around items-center px-4 max-w-md mx-auto">
        {tabs.map((tab) => {
          const isHashLink = tab.path.startsWith('/#');

          // Hash links on home page → scroll, on other pages → navigate
          if (isHashLink) {
            if (isHomePage) {
              return (
                <a
                  key={tab.id}
                  href={`#${tab.id}`}
                  onClick={(e) => scrollToSection(e, tab.id)}
                  className="flex flex-col items-center gap-1 transition-all duration-300 py-1 px-3 rounded-lg relative text-white hover:text-white active:scale-95"
                  aria-label={tab.name}
                >
                  <span className="material-symbols-outlined text-[22px]">{tab.icon}</span>
                  <span className="font-label-mono text-[9px] uppercase tracking-wider">
                    {tab.name}
                  </span>
                </a>
              );
            }

            return (
              <NavLink
                key={tab.id}
                to={tab.path}
                className="flex flex-col items-center gap-1 transition-all duration-300 py-1 px-3 rounded-lg relative text-white hover:text-white active:scale-95"
                aria-label={tab.name}
              >
                <span className="material-symbols-outlined text-[22px]">{tab.icon}</span>
                <span className="font-label-mono text-[9px] uppercase tracking-wider">
                  {tab.name}
                </span>
              </NavLink>
            );
          }

          // Regular route links
          return (
            <NavLink
              key={tab.id}
              to={tab.path}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 transition-all duration-300 py-1 px-3 rounded-lg relative ${
                  isActive
                    ? 'text-white scale-110'
                    : 'text-white hover:text-white active:scale-95'
                }`
              }
              aria-label={tab.name}
            >
              {({ isActive }) => (
                <>
                  <span className="material-symbols-outlined text-[22px]">{tab.icon}</span>
                  <span className="font-label-mono text-[9px] uppercase tracking-wider">
                    {tab.name}
                  </span>
                  {isActive && (
                    <span className="absolute -bottom-1 w-1.5 h-1.5 bg-secondary-container rounded-full shadow-[0_0_6px_#007bff]" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
