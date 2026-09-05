import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TIMELINE_PHASES } from '../../data/timeline';

export const TimelineSection: React.FC = () => {
  const [activePhase, setActivePhase] = useState<number>(0);

  return (
    <section className="w-full bg-surface-container-low/70 backdrop-blur-md py-section-gap px-margin-mobile md:px-margin-desktop relative overflow-hidden border-y border-border-metallic/40">
      <div className="max-w-4xl mx-auto flex flex-col gap-16 relative z-10">
        <div className="text-center flex flex-col gap-3">
          <span className="font-label-caps text-label-caps text-[#3E2723] uppercase tracking-widest block">
            OUR PROCESS
          </span>
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-[#3E2723]">
            From Idea to Launch.
          </h2>
          <p className="font-body-md text-[#3E2723] max-w-lg mx-auto text-sm sm:text-base">
            We understand the idea, shape the experience, design the interface, and build the final website with the right balance of design, usability, and technology.
          </p>
        </div>

        {/* Timeline Items */}
        <div className="flex flex-col gap-12 border-l border-border-metallic ml-4 pl-8 md:ml-12 md:pl-16 relative">
          {TIMELINE_PHASES.map((item, index) => {
            const isActive = activePhase === index;
            return (
              <motion.div
                key={item.phase}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                onMouseEnter={() => setActivePhase(index)}
                className="relative group cursor-pointer"
              >
                {/* Glowing Timeline Marker */}
                <div
                  className={`absolute -left-[37px] md:-left-[69px] top-1.5 w-3.5 h-3.5 rounded-full border transition-all duration-400 ${
                    isActive
                      ? 'bg-primary border-secondary-container shadow-[0_0_18px_#18a0fb] scale-125'
                      : 'bg-surface-variant border-border-metallic group-hover:bg-primary group-hover:shadow-[0_0_12px_rgba(24,160,251,0.5)]'
                  }`}
                />

                <span className="font-label-mono text-label-mono text-[#3E2723] uppercase mb-2 block tracking-wider">
                  {item.phase}
                </span>

                <h3
                  className={`font-headline-lg-mobile text-2xl md:text-3xl mb-3 transition-colors duration-400 ${
                    isActive ? 'text-[#3E2723]' : 'text-[#3E2723] group-hover:text-[#3E2723]-fixed'
                  }`}
                >
                  {item.title}
                </h3>

                <p className="font-body-md text-[#3E2723] max-w-xl leading-relaxed text-sm sm:text-base">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

