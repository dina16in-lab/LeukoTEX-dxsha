import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-margin-mobile md:px-margin-desktop py-20 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center gap-8 max-w-lg"
      >
        {/* Large 404 Number */}
        <div className="relative">
          <span className="font-headline-display text-[120px] sm:text-[160px] md:text-[200px] font-bold leading-none text-[#3E2723]/10 select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span className="material-symbols-outlined text-[64px] text-[#3E2723]/60">
                explore_off
              </span>
            </motion.div>
          </div>
        </div>

        {/* Message */}
        <div className="flex flex-col gap-3">
          <span className="font-label-mono text-label-mono text-[#3E2723]/60 uppercase tracking-widest">
            PAGE NOT FOUND
          </span>
          <h1 className="font-headline-lg text-3xl sm:text-4xl text-[#3E2723] font-medium">
            This page doesn't exist
          </h1>
          <p className="font-body-md text-[#3E2723]/70 text-base max-w-sm mx-auto">
            The page you're looking for may have been moved, deleted, or never existed.
            Let's get you back on track.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#3E2723] text-[#F5F5DC] font-label-caps text-label-caps uppercase tracking-widest rounded-full hover:shadow-[0_0_20px_rgba(62,39,35,0.3)] transition-all duration-300"
          >
            <span className="material-symbols-outlined text-[16px]">home</span>
            Go Home
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-[#3E2723]/30 text-[#3E2723] font-label-caps text-label-caps uppercase tracking-widest rounded-full hover:border-[#3E2723] transition-all duration-300"
          >
            <span className="material-symbols-outlined text-[16px]">mail</span>
            Contact Us
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
