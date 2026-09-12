import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const TermsOfServicePage: React.FC = () => {
  return (
    <div className="flex flex-col w-full">
      {/* Header */}
      <section className="w-full px-margin-mobile md:px-margin-desktop py-16 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col gap-4"
        >
          <Link
            to="/"
            className="font-label-mono text-label-mono text-[#99FF99]/60 uppercase tracking-widest hover:text-[#99FF99] transition-colors flex items-center gap-2 w-fit"
          >
            <span className="material-symbols-outlined text-[14px]">arrow_back</span>
            Back to Home
          </Link>
          <span className="font-label-mono text-label-mono text-[#99FF99]/60 uppercase tracking-widest">
            LEGAL // TERMS
          </span>
          <h1 className="font-headline-display text-4xl sm:text-5xl md:text-6xl text-[#99FF99] uppercase font-semibold tracking-tighter leading-tight">
            Terms of Service
          </h1>
          <p className="font-body-md text-[#99FF99]/70 text-base">
            Last updated: September 2026
          </p>
        </motion.div>
      </section>

      {/* Content */}
      <section className="w-full px-margin-mobile md:px-margin-desktop pb-section-gap max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="flex flex-col gap-12"
        >
          <article className="flex flex-col gap-4">
            <h2 className="font-headline-lg-mobile text-2xl text-[#99FF99] font-medium">
              1. Acceptance of Terms
            </h2>
            <p className="font-body-md text-[#99FF99]/80 leading-relaxed">
              By accessing and using the LEUKOTEX website and services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
          </article>

          <article className="flex flex-col gap-4">
            <h2 className="font-headline-lg-mobile text-2xl text-[#99FF99] font-medium">
              2. Services
            </h2>
            <p className="font-body-md text-[#99FF99]/80 leading-relaxed">
              LEUKOTEX provides website development, UI/UX design, product website creation, and interactive 3D experience development services. Specific project terms, timelines, and deliverables are agreed upon separately for each engagement.
            </p>
          </article>

          <article className="flex flex-col gap-4">
            <h2 className="font-headline-lg-mobile text-2xl text-[#99FF99] font-medium">
              3. Intellectual Property
            </h2>
            <p className="font-body-md text-[#99FF99]/80 leading-relaxed">
              All content on this website, including but not limited to designs, text, graphics, logos, icons, images, and code, is the property of LEUKOTEX or its content suppliers and is protected by applicable intellectual property laws.
            </p>
          </article>

          <article className="flex flex-col gap-4">
            <h2 className="font-headline-lg-mobile text-2xl text-[#99FF99] font-medium">
              4. User Responsibilities
            </h2>
            <p className="font-body-md text-[#99FF99]/80 leading-relaxed">
              When using our contact form or engaging with our services, you agree to:
            </p>
            <ul className="list-disc list-inside font-body-md text-[#99FF99]/80 leading-relaxed space-y-2 pl-4">
              <li>Provide accurate and truthful information</li>
              <li>Not misuse or attempt to exploit our services</li>
              <li>Respect the intellectual property rights of LEUKOTEX and third parties</li>
              <li>Not use our website for any unlawful purpose</li>
            </ul>
          </article>

          <article className="flex flex-col gap-4">
            <h2 className="font-headline-lg-mobile text-2xl text-[#99FF99] font-medium">
              5. Limitation of Liability
            </h2>
            <p className="font-body-md text-[#99FF99]/80 leading-relaxed">
              LEUKOTEX shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use our services. Our total liability shall not exceed the amount paid by you for the specific service giving rise to the claim.
            </p>
          </article>

          <article className="flex flex-col gap-4">
            <h2 className="font-headline-lg-mobile text-2xl text-[#99FF99] font-medium">
              6. Changes to Terms
            </h2>
            <p className="font-body-md text-[#99FF99]/80 leading-relaxed">
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to this page. Your continued use of our services after changes constitutes acceptance of the updated terms.
            </p>
          </article>

          <article className="flex flex-col gap-4">
            <h2 className="font-headline-lg-mobile text-2xl text-[#99FF99] font-medium">
              7. Contact
            </h2>
            <p className="font-body-md text-[#99FF99]/80 leading-relaxed">
              For any questions regarding these Terms of Service, please contact us:
            </p>
            <div className="p-6 rounded-2xl bg-white/30 border border-[#99FF99]/10 backdrop-blur-sm">
              <p className="font-body-md text-[#99FF99] font-semibold">LEUKOTEX Studio</p>
              <p className="font-body-md text-[#99FF99]/70">Chennai, Near Tambaram / Vandalur</p>
              <a href="mailto:dina16in@gmail.com" className="font-body-md text-[#99FF99] underline underline-offset-4 hover:text-[#99FF99]/70 transition-colors">
                dina16in@gmail.com
              </a>
            </div>
          </article>
        </motion.div>
      </section>
    </div>
  );
};
