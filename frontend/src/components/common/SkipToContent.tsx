import React from 'react';

export const SkipToContent: React.FC = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-6 focus:py-3 focus:bg-[#99FF99] focus:text-[#2a0a3a] focus:rounded-full focus:font-label-caps focus:text-label-caps focus:uppercase focus:tracking-widest focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#99FF99] focus:ring-offset-2 focus:ring-offset-[#2a0a3a]"
    >
      Skip to main content
    </a>
  );
};
