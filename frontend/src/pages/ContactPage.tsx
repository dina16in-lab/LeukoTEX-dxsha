import React from 'react';
import { motion } from 'framer-motion';
import { ContactForm } from '../components/sections/ContactForm';

export const ContactPage: React.FC = () => {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Header */}
      <section className="flex flex-col gap-6 py-16 px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col gap-4 max-w-3xl"
        >
          <span className="font-label-mono text-label-mono text-[#3E2723] uppercase tracking-widest">
            START A PROJECT // LET'S TALK
          </span>
          <h1 className="font-headline-display text-4xl sm:text-5xl md:text-6xl lg:text-[76px] text-[#3E2723] uppercase font-bold tracking-tighter leading-tight">
            Have an idea?<br />
            Let's build it.
          </h1>
          <p className="font-body-md text-base sm:text-lg text-[#3E2723] max-w-xl leading-relaxed">
            Tell us what you have in mind. Whether you need a website, UI/UX design, product website, or an interactive 3D experience, LEUKOTEX can help turn your idea into a working digital experience.
          </p>
        </motion.div>
      </section>

      {/* Main Interactive Form & Graphic Split */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-section-gap px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto w-full items-start">
        {/* Form Container (7 cols) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="lg:col-span-7 w-full"
        >
          <ContactForm />
        </motion.div>

        {/* Conceptual Artwork & Quick Stats (5 cols) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="lg:col-span-5 flex flex-col gap-8 w-full"
        >
          {/* Wireframe Graphic Panel */}
          <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-surface-muted border border-border-metallic shadow-2xl">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-85 hover:scale-105 transition-transform duration-1000"
              style={{
                backgroundImage: "url('/contact_art_beige.jpg')",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#3E2723]/90 via-[#3E2723]/20 to-transparent opacity-80" />
            <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-2">
              <span className="font-label-mono text-xs text-white uppercase tracking-widest">
                LEUKOTEX // CONTACT
              </span>
              <p className="font-headline-lg-mobile text-lg text-white font-medium">
                Let's turn your idea into a possibility.
              </p>
              <span className="font-label-mono text-[10px] text-white">
                Available for new projects
              </span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Global HQ & Direct Line Footer Info */}
      <section className="border-t border-border-metallic py-section-gap px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Location */}
          <div className="flex flex-col gap-4">
            <span className="font-label-mono text-label-mono text-[#3E2723] uppercase tracking-widest">
              LOCATION
            </span>
            <div className="flex flex-col gap-1">
              <p className="font-body-md text-lg text-[#3E2723] font-semibold">LEUKOTEX</p>
              <p className="font-body-md text-[#3E2723]">Chennai</p>
              <p className="font-body-md text-[#3E2723]">Near Tambaram / Vandalur</p>
            </div>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-4">
            <span className="font-label-mono text-label-mono text-[#3E2723] uppercase tracking-widest">
              CONTACT
            </span>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:dina16in@gmail.com"
                className="font-headline-lg-mobile text-2xl sm:text-3xl text-[#3E2723] hover:text-[#3E2723] transition-colors group flex items-center gap-2"
              >
                <span>dina16in@gmail.com</span>
                <span className="material-symbols-outlined text-[24px] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-[#3E2723]">
                  arrow_outward
                </span>
              </a>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 pt-1">
                <a
                  href="tel:+916379323253"
                  className="font-body-md text-[#3E2723] hover:text-[#3E2723] transition-colors flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#3E2723]">call</span>
                  <span>6379323253</span>
                </a>
                <a
                  href="https://wa.me/916379323253"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body-md text-[#3E2723] hover:text-[#3E2723] transition-colors flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#3E2723]">chat</span>
                  <span>WhatsApp / 6379323253</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

