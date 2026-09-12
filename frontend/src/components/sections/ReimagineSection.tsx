import React from 'react';
import { motion } from 'framer-motion';

export const ReimagineSection: React.FC = () => {
  return (
    <section id="reimagine" className="relative w-full min-h-screen bg-[#2a0a3a] flex flex-col items-center justify-center py-24 overflow-hidden">
      
      {/* Background Neon Squiggle */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50">
        <svg viewBox="0 0 800 800" className="w-[800px] h-[800px]">
          <motion.path
            d="M170 700 C 60 640, 90 480, 220 470 C 350 460, 300 620, 410 610 C 520 600, 480 380, 560 320 C 640 260, 700 300, 660 250"
            fill="none"
            stroke="url(#neon)"
            strokeWidth="26"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        </svg>
      </div>

      {/* Phone Mockup Container */}
      <div className="relative z-10 w-64 h-[500px] md:w-80 md:h-[600px] bg-gray-900 rounded-[3rem] p-3 shadow-2xl border-4 border-gray-800">
        <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden bg-[#2a0a3a]">
          {/* Photo Image */}
          <img 
            src="https://picsum.photos/seed/oodles-people/900/1600" 
            alt="Original" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          
          {/* Doodle Image (Cartoon Filtered) */}
          <motion.div 
            className="absolute inset-0 w-full h-full"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 1.5 }}
          >
            <img 
              src="https://picsum.photos/seed/oodles-people/900/1600" 
              alt="Cartoon" 
              className="absolute inset-0 w-full h-full object-cover toon-filter"
            />
          </motion.div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 glass-pill text-[#99FF99] text-sm font-semibold">
            reimagine
          </div>
        </div>
      </div>

      {/* Heading */}
      <h2 className="relative z-10 font-display text-5xl md:text-7xl text-[#99FF99] mt-16 drop-shadow-[0_0_15px_rgba(255,138,212,0.5)]">
        artistic intelligence
      </h2>
      
    </section>
  );
};

