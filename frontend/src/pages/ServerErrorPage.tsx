import React from 'react';
import { motion } from 'framer-motion';

export const ServerErrorPage: React.FC = () => {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-margin-mobile md:px-margin-desktop py-20 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center gap-8 max-w-lg"
      >
        {/* Large 500 Number */}
        <div className="relative">
          <span className="font-headline-display text-[120px] sm:text-[160px] md:text-[200px] font-bold leading-none text-[#99FF99]/10 select-none">
            500
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span className="material-symbols-outlined text-[64px] text-[#99FF99]/60">
                error_outline
              </span>
            </motion.div>
          </div>
        </div>

        {/* Message */}
        <div className="flex flex-col gap-3">
          <span className="font-label-mono text-label-mono text-[#99FF99]/60 uppercase tracking-widest">
            SERVER ERROR
          </span>
          <h1 className="font-headline-lg text-3xl sm:text-4xl text-[#99FF99] font-medium">
            Something went wrong
          </h1>
          <p className="font-body-md text-[#99FF99]/70 text-base max-w-sm mx-auto">
            We're experiencing a temporary issue. Please try again in a moment.
            If the problem persists, feel free to reach out.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <button
            onClick={handleRetry}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#99FF99] text-[#2a0a3a] font-label-caps text-label-caps uppercase tracking-widest rounded-full hover:shadow-[0_0_20px_rgba(153, 255, 153,0.3)] transition-all duration-300 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">refresh</span>
            Try Again
          </button>
          <a
            href="mailto:dina16in@gmail.com"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-[#99FF99]/30 text-[#99FF99] font-label-caps text-label-caps uppercase tracking-widest rounded-full hover:border-[#99FF99] transition-all duration-300"
          >
            <span className="material-symbols-outlined text-[16px]">mail</span>
            Report Issue
          </a>
        </div>
      </motion.div>
    </div>
  );
};
