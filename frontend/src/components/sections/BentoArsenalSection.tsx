import React from 'react';
import { motion } from 'framer-motion';
import { TECH_STACK, DISCIPLINES } from '../../data/arsenal';

export const BentoArsenalSection: React.FC = () => {
  return (
    <section className="w-full px-margin-mobile md:px-margin-desktop py-section-gap flex flex-col gap-12 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col gap-3">
        <span className="font-label-mono text-label-mono text-[#99FF99] uppercase flex items-center gap-2 tracking-widest">
          <span className="w-4 h-[1px] bg-primary block" />
          WHAT WE DO
        </span>
        <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-[#99FF99]">
          Our Capabilities.
        </h2>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1: Technologies List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="col-span-1 md:col-span-2 lg:col-span-1 bg-surface-muted/90 border border-border-metallic p-8 flex flex-col justify-between hover:bg-surface-container-high transition-colors duration-500 rounded-xl relative overflow-hidden group backdrop-blur-sm min-h-[260px]"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-glow-accent to-transparent opacity-0 group-hover:opacity-15 transition-opacity duration-700 pointer-events-none" />
          <span className="font-label-caps text-label-caps text-[#99FF99] uppercase relative z-10">
            Technologies
          </span>
          <ul className="flex flex-col gap-3 relative z-10 mt-6">
            {TECH_STACK.map((tech, i) => (
              <li
                key={tech.name}
                className={`font-label-mono text-[13px] text-[#99FF99] flex items-center justify-between ${
                  i !== TECH_STACK.length - 1 ? 'border-b border-border-metallic/60 pb-2.5' : ''
                }`}
              >
                <span>{tech.name}</span>
                <span className="material-symbols-outlined text-[16px] text-[#99FF99] group-hover:text-[#99FF99] transition-colors">
                  {tech.icon}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Card 2: Visual Graphic Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="col-span-1 md:col-span-1 lg:col-span-1 bg-surface-muted/90 border border-border-metallic p-6 flex items-center justify-center relative overflow-hidden rounded-xl group min-h-[260px]"
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 opacity-40 filter grayscale contrast-125"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBrTlzCMdCqFo6VYJaBxO_2yMeaMaAjNv5a-ygddqzDn0ITGqjuwZ7nTJk-5F8_mLnnAotqcjjt7zxkuIQB4gC7KYSgd2ury-_nX1_uMMXytfhBEXmowDA8UsnerQswMFi_Hpdb8CbqkER4bV0aHcbvUZisgelAnAQFDBdBp1x2rZltwILy_BM87rCxmKGT0t2lY6tNvFuO3lWj1cAC6KFJ3fSQzqDjbGc-EoCTL8fWhdcLq939cdOD')",
            }}
          />
          <div className="absolute inset-0 bg-background/50 group-hover:bg-background/30 transition-colors duration-500" />
          <span className="relative z-10 font-headline-display text-7xl font-extrabold text-[#99FF99] opacity-60 group-hover:opacity-100 transition-opacity duration-500 tracking-tighter">
            LTX
          </span>
        </motion.div>

        {/* Card 3: Services */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="col-span-1 md:col-span-1 lg:col-span-1 bg-surface-muted/90 border border-border-metallic p-8 flex flex-col justify-between hover:bg-surface-container-high transition-colors duration-500 rounded-xl relative overflow-hidden group backdrop-blur-sm min-h-[260px]"
        >
          <div className="absolute inset-0 bg-gradient-to-bl from-glow-accent to-transparent opacity-0 group-hover:opacity-15 transition-opacity duration-700 pointer-events-none" />
          <span className="font-label-caps text-label-caps text-[#99FF99] uppercase relative z-10">
            Services
          </span>
          <div className="flex flex-wrap gap-2 relative z-10 mt-6">
            {DISCIPLINES.map((d) => (
              <span
                key={d}
                className="px-3.5 py-1.5 bg-background/80 border border-border-metallic text-[#99FF99] font-label-mono text-[11px] uppercase rounded-full hover:border-secondary transition-colors"
              >
                {d}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Card 4: Manifesto Quote Card (Span Full Width) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="col-span-1 md:col-span-2 lg:col-span-3 bg-primary text-[#99FF99] p-8 md:p-14 flex flex-col justify-center items-center text-center rounded-xl hover:shadow-[0_0_50px_rgba(255,255,255,0.12)] transition-shadow duration-700 group"
        >
          <span className="material-symbols-outlined text-[36px] text-[#99FF99]-fixed-variant mb-4 opacity-60">
            format_quote
          </span>
          <p className="font-headline-display text-2xl sm:text-3xl md:text-4xl leading-snug max-w-4xl font-normal text-[#99FF99]">
            "Every idea starts somewhere. We turn your problems into possibilities through design, technology, and the web."
          </p>
        </motion.div>
      </div>
    </section>
  );
};

