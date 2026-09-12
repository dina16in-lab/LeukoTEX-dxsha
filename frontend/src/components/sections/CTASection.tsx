import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../common/Button';

interface CTASectionProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
}

export const CTASection: React.FC<CTASectionProps> = ({
  title = "Have an idea?\nLet's build it.",
  subtitle = 'We build websites, UI/UX experiences, product websites, and interactive 3D experiences around your goals.',
  buttonText = 'Start the Conversation',
}) => {
  return (
    <section className="w-full py-section-gap px-margin-mobile md:px-margin-desktop flex flex-col items-center justify-center text-center gap-8 relative overflow-hidden bg-transparent">
      {/* Abstract radial cyan aura blur behind CTA */}
      <div className="absolute inset-0 bg-glow-accent opacity-10 blur-[120px] rounded-full w-[140%] h-[140%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex flex-col items-center gap-6 max-w-3xl"
      >
        <span className="font-label-mono text-label-mono text-[#99FF99] uppercase tracking-widest">
          Initiate Sequence
        </span>

        <h2 className="font-headline-lg text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#99FF99] uppercase tracking-tighter leading-tight whitespace-pre-line font-semibold">
          {title}
        </h2>

        <p className="font-body-md text-base sm:text-lg text-[#99FF99] max-w-xl">
          {subtitle}
        </p>

        <div className="mt-4">
          <Button to="/#contact" variant="primary" size="lg" icon="arrow_forward">
            {buttonText}
          </Button>
        </div>
      </motion.div>
    </section>
  );
};

