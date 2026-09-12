import React from 'react';
import { Link } from 'react-router-dom';
import { AnimatedLogo } from './AnimatedLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-surface-muted border-t border-border-metallic relative z-10 pt-20 pb-safe pb-32 md:pb-8">
      <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-20">
          
          {/* Brand & Vision */}
          <div className="md:col-span-5 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <AnimatedLogo />
              <p className="font-label-caps text-label-caps text-white tracking-[0.2em] mt-2">
                EST. 2026 — ESTABLISHED BY LEUKOTEX AND CO
              </p>
            </div>
            <p className="font-body-md text-white max-w-sm mt-4 text-balance">
              Pioneering immersive digital environments. We blend WebGL, generative design, and high-performance engineering to build next-generation web experiences.
            </p>
            <div className="flex gap-4 mt-2">
              <a href="#" className="w-10 h-10 rounded-full border border-border-metallic flex items-center justify-center text-white hover:text-white hover:border-secondary transition-all bg-surface hover:bg-surface-dim">
                <span className="sr-only">Twitter/X</span>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-border-metallic flex items-center justify-center text-white hover:text-white hover:border-secondary transition-all bg-surface hover:bg-surface-dim">
                <span className="sr-only">GitHub</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-border-metallic flex items-center justify-center text-white hover:text-white hover:border-secondary transition-all bg-surface hover:bg-surface-dim">
                <span className="sr-only">LinkedIn</span>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
          
          {/* Navigation */}
          <div className="md:col-span-2 md:col-start-7 flex flex-col gap-6">
            <h3 className="font-label-mono text-label-mono uppercase tracking-widest text-white">Navigation</h3>
            <ul className="flex flex-col gap-4">
              <li>
                <Link to="/#services" className="font-body-md text-white hover:text-white transition-colors inline-block relative group">
                  Services
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-secondary group-hover:w-full transition-all duration-300"></span>
                </Link>
              </li>
              <li>
                <Link to="/#about" className="font-body-md text-white hover:text-white transition-colors inline-block relative group">
                  About Studio
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-secondary group-hover:w-full transition-all duration-300"></span>
                </Link>
              </li>

              <li>
                <Link to="/#contact" className="font-body-md text-white hover:text-white transition-colors inline-block relative group">
                  Contact
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-secondary group-hover:w-full transition-all duration-300"></span>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact & Status */}
          <div className="md:col-span-3 md:col-start-10 flex flex-col gap-6">
            <h3 className="font-label-mono text-label-mono uppercase tracking-widest text-white">Founders</h3>
            <ul className="flex flex-col gap-5">
              <li className="flex flex-col gap-1">
                <span className="font-label-mono text-[10px] uppercase tracking-widest text-white/70">Founder</span>
                <span className="font-body-md text-white">S Dinesh</span>
                <a href="tel:6379323253" className="font-body-md text-white/80 hover:text-white transition-colors flex items-center gap-2 group text-sm">
                  <span className="material-symbols-outlined text-[16px]">call</span>
                  6379323253
                </a>
              </li>
              <li className="flex flex-col gap-1">
                <span className="font-label-mono text-[10px] uppercase tracking-widest text-white/70">Co-Founder</span>
                <span className="font-body-md text-white">Amarwin Jasan</span>
                <a href="tel:9994596987" className="font-body-md text-white/80 hover:text-white transition-colors flex items-center gap-2 group text-sm">
                  <span className="material-symbols-outlined text-[16px]">call</span>
                  9994596987
                </a>
              </li>
            </ul>
            
            <div className="mt-4 p-4 border border-border-metallic rounded-lg bg-surface flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 animate-pulse flex-shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
              <div>
                <p className="font-label-mono text-label-mono uppercase tracking-widest text-white mb-1">Availability</p>
                <p className="font-body-md text-sm text-white">Accepting new projects for Q3 2026.</p>
              </div>
            </div>
          </div>
          
        </div>
        
        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border-metallic flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-label-mono text-[10px] uppercase tracking-widest text-white">
            &copy; {new Date().getFullYear()} LEUKOTEX STUDIO. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-6">
            <Link to="/privacy" className="font-label-mono text-[10px] uppercase tracking-widest text-white hover:text-white/80 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="font-label-mono text-[10px] uppercase tracking-widest text-white hover:text-white/80 transition-colors">Terms of Service</Link>
          </div>
          <div className="font-label-mono text-[10px] uppercase tracking-widest text-white flex items-center gap-2">
            SYSTEM STATUS <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span> OPERATIONAL
          </div>
        </div>
      </div>
    </footer>
  );
};


