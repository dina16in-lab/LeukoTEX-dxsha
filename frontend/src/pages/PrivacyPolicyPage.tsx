import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const PrivacyPolicyPage: React.FC = () => {
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
            LEGAL // PRIVACY
          </span>
          <h1 className="font-headline-display text-4xl sm:text-5xl md:text-6xl text-[#99FF99] uppercase font-semibold tracking-tighter leading-tight">
            Privacy Policy
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
              1. Information We Collect
            </h2>
            <p className="font-body-md text-[#99FF99]/80 leading-relaxed">
              When you use our contact form, we collect the following information: your name, email address, project type, project description, and budget range. This information is provided voluntarily and is necessary for us to understand and respond to your inquiry.
            </p>
          </article>

          <article className="flex flex-col gap-4">
            <h2 className="font-headline-lg-mobile text-2xl text-[#99FF99] font-medium">
              2. How We Use Your Information
            </h2>
            <p className="font-body-md text-[#99FF99]/80 leading-relaxed">
              We use the information you provide to:
            </p>
            <ul className="list-disc list-inside font-body-md text-[#99FF99]/80 leading-relaxed space-y-2 pl-4">
              <li>Respond to your project inquiry</li>
              <li>Communicate with you about potential projects</li>
              <li>Send you relevant follow-up information</li>
              <li>Improve our services and website experience</li>
            </ul>
          </article>

          <article className="flex flex-col gap-4">
            <h2 className="font-headline-lg-mobile text-2xl text-[#99FF99] font-medium">
              3. Data Storage & Security
            </h2>
            <p className="font-body-md text-[#99FF99]/80 leading-relaxed">
              Your data is stored securely on our servers. We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>
          </article>

          <article className="flex flex-col gap-4">
            <h2 className="font-headline-lg-mobile text-2xl text-[#99FF99] font-medium">
              4. Third-Party Sharing
            </h2>
            <p className="font-body-md text-[#99FF99]/80 leading-relaxed">
              We do not sell, trade, or otherwise transfer your personal information to third parties. Your data is used exclusively for the purposes described in this policy.
            </p>
          </article>

          <article className="flex flex-col gap-4">
            <h2 className="font-headline-lg-mobile text-2xl text-[#99FF99] font-medium">
              5. Your Rights
            </h2>
            <p className="font-body-md text-[#99FF99]/80 leading-relaxed">
              You have the right to request access to, correction of, or deletion of your personal information at any time. To exercise these rights, please contact us at{' '}
              <a href="mailto:dina16in@gmail.com" className="text-[#99FF99] underline underline-offset-4 hover:text-[#99FF99]/70 transition-colors">
                dina16in@gmail.com
              </a>.
            </p>
          </article>

          <article className="flex flex-col gap-4">
            <h2 className="font-headline-lg-mobile text-2xl text-[#99FF99] font-medium">
              6. Contact
            </h2>
            <p className="font-body-md text-[#99FF99]/80 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us:
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
