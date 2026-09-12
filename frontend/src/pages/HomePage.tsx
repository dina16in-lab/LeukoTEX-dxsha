import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { HeroSection } from '../components/sections/HeroSection';
import { ServicesPage } from './ServicesPage';
import { AboutPage } from './AboutPage';
import { ContactPage } from './ContactPage';

/**
 * Buttery section reveal — transform + opacity only (GPU, no layout).
 * Small travel distance + expo-out easing + early viewport trigger =
 * seamless, never janky. Offscreen sections use content-visibility
 * (see .reveal-section) so layout cost stays near zero.
 */
const SectionWrapper: React.FC<{ children: React.ReactNode; id: string }> = ({ children, id }) => {
  const reduce = useReducedMotion();
  if (reduce) {
    return (
      <section id={id} className="relative z-10 bg-transparent">
        {children}
      </section>
    );
  }
  return (
    <section id={id} className="reveal-section relative z-10 bg-transparent">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15, margin: '0px 0px -8% 0px' }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="transform-gpu-smooth"
      >
        {children}
      </motion.div>
    </section>
  );
};

export const HomePage: React.FC = () => {

  return (
    <div className="flex flex-col w-full relative bg-transparent">
      {/* Home Section (Hero handles its own scroll animations) */}
      <section id="home">
        <HeroSection />
      </section>

      {/* Services Section */}
      <SectionWrapper id="services">
        <ServicesPage />
      </SectionWrapper>
      
      {/* About Section */}
      <SectionWrapper id="about">
        <AboutPage />
      </SectionWrapper>

      {/* Contact Section */}
      <SectionWrapper id="contact">
        <ContactPage />
      </SectionWrapper>
    </div>
  );
};

export default HomePage;
