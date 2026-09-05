import React from 'react';
import { motion } from 'framer-motion';
import { TiltCard } from '../components/common/TiltCard';
import { TimelineSection } from '../components/sections/TimelineSection';
import { BentoArsenalSection } from '../components/sections/BentoArsenalSection';


export const AboutPage: React.FC = () => {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="w-full min-h-[50vh] md:min-h-[60vh] flex flex-col justify-center px-margin-mobile md:px-margin-desktop py-16 relative overflow-hidden max-w-7xl mx-auto">
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_50%_50%,rgba(24,160,251,0.3)_0%,transparent_60%)] blur-[80px]" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl"
        >
          <span className="font-label-caps text-label-caps text-[#3E2723] uppercase tracking-widest block mb-6">
            About LEUKOTEX
          </span>
          <h1 className="font-headline-display text-4xl sm:text-5xl md:text-6xl lg:text-[76px] text-[#3E2723] uppercase font-semibold leading-tight mb-6">
            Turning ideas into digital experiences.
          </h1>
          <p className="font-body-md text-base sm:text-lg text-[#3E2723] max-w-2xl leading-relaxed">
            LEUKOTEX is a creative web studio focused on building modern websites, thoughtful UI/UX, product experiences, and immersive 3D websites. We combine design and development to turn ideas into websites that look great, work smoothly, and fit the people they're built for.
          </p>
        </motion.div>
      </section>

      {/* Split Panel: Story & Portrait */}
      <section className="w-full px-margin-mobile md:px-margin-desktop py-12 grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto items-center">
        {/* Story Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col gap-6 order-2 lg:order-1"
        >
          <span className="font-label-mono text-label-mono text-[#3E2723] uppercase flex items-center gap-2 tracking-widest">
            <span className="w-4 h-[1px] bg-primary block" />
            THE STORY
          </span>
          <h2 className="font-headline-lg text-3xl sm:text-4xl text-[#3E2723] font-medium">
            Built to turn ideas into possibilities.
          </h2>
          <p className="font-body-md text-[#3E2723] text-base sm:text-lg leading-relaxed">
            LEUKOTEX was started on 26 August 2026 with a simple goal: help individuals, businesses, startups, and students turn their ideas into useful and engaging digital experiences.
          </p>
          <p className="font-body-md text-[#3E2723] text-base leading-relaxed">
            We work across website development, UI/UX design, product websites, interactive experiences, and 3D websites. We focus on understanding the requirement first, designing the right experience, and then building it into a responsive and functional website.
          </p>
        </motion.div>

        {/* Portrait Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="order-1 lg:order-2 relative aspect-[3/4] sm:aspect-square w-full rounded-2xl overflow-hidden group shadow-2xl border border-border-metallic"
        >
          <TiltCard className="w-full h-full">
            <div
              className="w-full h-full bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105 bg-surface-muted"
              style={{
                backgroundImage: `url('/images/founder_portrait_light_1788330360984.jpg')`,
              }}
            />
            {/* Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-80 pointer-events-none" />
            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <span className="font-label-mono text-label-mono text-[#3E2723] uppercase tracking-widest bg-background/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                LEUKOTEX CREATIVE DEVELOPMENT
              </span>
              <span className="material-symbols-outlined text-[#3E2723] text-[20px]">arrow_outward</span>
            </div>
          </TiltCard>
        </motion.div>
      </section>

      {/* Methodology Timeline */}
      <TimelineSection />

      {/* Bento Grid Capabilities */}
      <BentoArsenalSection />

    </div>
  );
};

