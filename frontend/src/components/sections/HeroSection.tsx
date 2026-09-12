import React, { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform, useReducedMotion } from 'framer-motion';

/**
 * Buttery hero parallax — original scroll animation restored, passed
 * through a soft spring so fast flicks glide instead of jumping.
 * All output is transform/opacity (GPU-only).
 */
export const HeroSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const smooth = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    mass: 0.6,
  });

  const y1 = useTransform(smooth, [0, 1], [0, 200]);
  const opacity1 = useTransform(smooth, [0, 0.3], [1, 0]);
  const y2 = useTransform(smooth, [0, 1], [0, -150]);
  const y3 = useTransform(smooth, [0, 1], [0, -300]);

  if (reduce) {
    return (
      <section id="home" className="relative w-full flex flex-col bg-transparent">
        <div className="min-h-screen w-full flex flex-col items-center justify-center text-center px-4 pt-20">
          <span className="font-label-mono text-label-mono uppercase tracking-widest text-[#99FF99] mb-6">
            LEUKOTEX STUDIO
          </span>
          <h1 className="font-headline-display text-5xl md:text-7xl lg:text-[100px] uppercase tracking-tighter leading-none mb-6 drop-shadow-lg text-[#99FF99]">
            Engineering<br />Premium
          </h1>
          <p className="max-w-md font-body-md text-[#99FF99] text-lg">
            We blend spatial computing, WebGL, and cinematic design to build next-generation interactive websites.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="home" ref={containerRef} className="relative w-full flex flex-col bg-transparent">

      {/* Page 1: Main Landing */}
      <motion.div style={{ y: y1, opacity: opacity1 }} className="transform-gpu-smooth min-h-screen w-full flex flex-col items-center justify-center text-center px-4 pt-20">
        <span className="font-label-mono text-label-mono uppercase tracking-widest text-[#99FF99] mb-6">
          LEUKOTEX STUDIO
        </span>
        <h1 className="font-headline-display text-5xl md:text-7xl lg:text-[100px] uppercase tracking-tighter leading-none mb-6 drop-shadow-lg text-[#99FF99]">
          Engineering<br />Premium
        </h1>
        <p className="max-w-md font-body-md text-[#99FF99] text-lg">
          We blend spatial computing, WebGL, and cinematic design to build next-generation interactive websites.
        </p>
      </motion.div>

      {/* Page 2: Scroll Reveal */}
      <motion.div style={{ y: y2 }} className="transform-gpu-smooth min-h-screen w-full flex flex-col items-start justify-center text-left px-4 pl-[10vw] md:pl-[20vw]">
        <h2 className="font-headline-display text-4xl md:text-6xl uppercase tracking-tighter leading-none mb-4 drop-shadow-lg text-[#99FF99]">
          Interactive<br />Narratives
        </h2>
        <p className="max-w-sm font-body-md text-[#99FF99]">
          Scroll-linked 3D experiences that pull the user into a completely new dimension of web design.
        </p>
      </motion.div>

      {/* Page 3: Call to Action */}
      <motion.div style={{ y: y3 }} className="transform-gpu-smooth min-h-[80vh] w-full flex flex-col items-center justify-center text-center px-4 pb-20">
        <h2 className="font-headline-display text-5xl md:text-7xl uppercase tracking-tighter leading-none mb-8 drop-shadow-lg text-[#99FF99]">
          Digital<br />Experiences
        </h2>
        <div className="flex gap-4 pointer-events-auto">
          <a href="#services" className="px-8 py-3 bg-primary text-[#99FF99] font-label-caps uppercase rounded-full hover:bg-surface-bright hover:text-[#99FF99] transition-colors border border-transparent hover:border-border-metallic">
            Our Services
          </a>
        </div>
      </motion.div>

    </section>
  );
};

