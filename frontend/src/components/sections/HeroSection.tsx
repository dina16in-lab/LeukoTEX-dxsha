import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const HeroSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity1 = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -300]);

  return (
    <section id="home" ref={containerRef} className="relative w-full flex flex-col bg-transparent">
      
      {/* Page 1: Main Landing */}
      <motion.div style={{ y: y1, opacity: opacity1 }} className="min-h-screen w-full flex flex-col items-center justify-center text-center px-4 pt-20">
        <span className="font-label-mono text-label-mono uppercase tracking-widest text-[#3E2723] mb-6">
          LEUKOTEX STUDIO
        </span>
        <h1 className="font-headline-display text-5xl md:text-7xl lg:text-[100px] uppercase tracking-tighter leading-none mb-6 drop-shadow-lg text-[#3E2723]">
          Engineering<br />Premium
        </h1>
        <p className="max-w-md font-body-md text-[#3E2723] text-lg">
          We blend spatial computing, WebGL, and cinematic design to build next-generation interactive websites.
        </p>
      </motion.div>

      {/* Page 2: Scroll Reveal */}
      <motion.div style={{ y: y2 }} className="min-h-screen w-full flex flex-col items-start justify-center text-left px-4 pl-[10vw] md:pl-[20vw]">
        <h2 className="font-headline-display text-4xl md:text-6xl uppercase tracking-tighter leading-none mb-4 drop-shadow-lg text-[#3E2723]">
          Interactive<br />Narratives
        </h2>
        <p className="max-w-sm font-body-md text-[#3E2723]">
          Scroll-linked 3D experiences that pull the user into a completely new dimension of web design.
        </p>
      </motion.div>

      {/* Page 3: Call to Action */}
      <motion.div style={{ y: y3 }} className="min-h-[80vh] w-full flex flex-col items-center justify-center text-center px-4 pb-20">
        <h2 className="font-headline-display text-5xl md:text-7xl uppercase tracking-tighter leading-none mb-8 drop-shadow-lg text-[#3E2723]">
          Digital<br />Experiences
        </h2>
        <div className="flex gap-4 pointer-events-auto">
          <a href="#services" className="px-8 py-3 bg-primary text-[#3E2723] font-label-caps uppercase rounded-full hover:bg-surface-bright hover:text-[#3E2723] transition-colors border border-transparent hover:border-border-metallic">
            Our Services
          </a>
        </div>
      </motion.div>
      
    </section>
  );
};

