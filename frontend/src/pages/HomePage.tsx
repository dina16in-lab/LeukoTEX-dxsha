import React from 'react';
import { motion } from 'framer-motion';
import { HeroSection } from '../components/sections/HeroSection';
import { ServicesPage } from './ServicesPage';
import { AboutPage } from './AboutPage';
import { ContactPage } from './ContactPage';

const SectionWrapper: React.FC<{ children: React.ReactNode; id: string }> = ({ children, id }) => (
  <section id={id} className="relative z-10 bg-transparent">
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  </section>
);

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

