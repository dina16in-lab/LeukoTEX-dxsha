import React from 'react';
import { motion } from 'framer-motion';
import { Logo3DCanvas } from '../components/canvas/Logo3DCanvas';
import { TiltCard } from '../components/common/TiltCard';
import { SERVICES_DATA } from '../data/services';

export const ServicesPage: React.FC = () => {
  return (
    <div className="flex flex-col w-full relative">
      {/* Hero Section with 3D Geometric "L" Sculpture */}
      <section className="px-margin-mobile md:px-margin-desktop py-section-gap flex flex-col justify-center min-h-[70vh] relative overflow-hidden max-w-7xl mx-auto w-full">
        {/* Background 3D Logo Canvas */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-full md:w-1/2 h-[450px] z-0 opacity-70 pointer-events-auto">
          <Logo3DCanvas />
        </div>

        <div className="absolute top-0 right-0 w-80 h-80 bg-glow-accent rounded-full blur-[120px] opacity-20 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col gap-6 max-w-2xl relative z-10"
        >
          <span className="font-label-mono text-label-mono text-[#3E2723] uppercase tracking-widest">
            WHAT WE OFFER
          </span>
          <h1 className="font-headline-display text-5xl sm:text-6xl md:text-7xl lg:text-[84px] text-[#3E2723] uppercase tracking-tighter mix-blend-difference font-bold leading-none">
            What We<br />Create
          </h1>
          <p className="font-body-md text-base sm:text-lg text-[#3E2723] max-w-xl bg-background/50 backdrop-blur-md p-6 rounded-2xl border border-white/5 leading-relaxed">
            LEUKOTEX creates modern websites, UI/UX experiences, product websites, and interactive 3D experiences for individuals, businesses, startups, and students. We combine design and development to turn ideas into useful, engaging digital experiences.
          </p>
        </motion.div>
      </section>

      {/* Deep-dive Alternating Service Articles */}
      <section className="flex flex-col px-margin-mobile md:px-margin-desktop gap-section-gap pb-section-gap max-w-7xl mx-auto w-full">
        {SERVICES_DATA.map((service, index) => {
          const isEven = index % 2 === 1;
          return (
            <React.Fragment key={service.id}>
              <motion.article
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.8 }}
                className={`flex flex-col md:flex-row gap-12 md:gap-20 group relative items-center p-6 md:p-12 rounded-3xl transition-colors duration-500 hover:glass-panel ${
                  isEven ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Ambient Glow */}
                <div className="absolute -left-12 top-1/2 -translate-y-1/2 w-48 h-48 bg-secondary-container/10 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

                {/* Text Content */}
                <div className="flex-1 flex flex-col gap-6 order-2 md:order-1 z-10">
                  <div className="flex items-center gap-4">
                    <span className="font-label-mono text-label-mono text-[#3E2723] uppercase tracking-widest">
                      {service.number}
                    </span>
                    <div className="h-[1px] w-12 bg-border-metallic group-hover:bg-primary transition-colors duration-500" />
                  </div>

                  <h2 className="font-headline-lg text-3xl sm:text-4xl md:text-5xl text-[#3E2723] tracking-tight font-medium">
                    {service.title}
                  </h2>

                  <p className="font-body-md text-base sm:text-lg text-[#3E2723] group-hover:text-[#3E2723] transition-colors duration-500 leading-relaxed">
                    {service.fullDesc}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {service.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-4 py-1.5 rounded-full border border-border-metallic font-label-mono text-label-mono text-[#3E2723] group-hover:text-[#3E2723] group-hover:border-primary/50 uppercase bg-surface-muted/50 transition-colors duration-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Image Container with 3D Tilt */}
                <div className="w-full md:w-1/2 aspect-square relative order-1 md:order-2 overflow-hidden rounded-2xl bg-surface-muted border border-border-metallic group-hover:border-outline-variant transition-all duration-500 shadow-2xl">
                  <TiltCard className="w-full h-full">
                    <div
                      className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-[1200ms] ease-out"
                      style={{ backgroundImage: `url('${service.image}')` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none" />
                  </TiltCard>
                </div>
              </motion.article>

              {index < SERVICES_DATA.length - 1 && (
                <div className="w-full h-[1px] bg-border-metallic/50" />
              )}
            </React.Fragment>
          );
        })}
      </section>
    </div>
  );
};

