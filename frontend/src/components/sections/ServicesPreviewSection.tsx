import React from 'react';

import { motion } from 'framer-motion';

export const ServicesPreviewSection: React.FC = () => {
  const previewItems = [
    {
      id: '01',
      title: 'Website Development',
      desc: 'Modern, responsive websites built around your business, idea, personal brand, or project.',
      tags: 'Responsive // Modern UI // Development',
    },
    {
      id: '02',
      title: 'UI/UX & Product Design',
      desc: 'Thoughtful interfaces and product-focused experiences designed around users, goals, and requirements.',
      tags: 'UI/UX // Product Design // Prototyping',
    },
    {
      id: '03',
      title: '3D & Interactive Websites',
      desc: 'Immersive 3D, motion, and interactive experiences for projects that need something beyond a standard webpage.',
      tags: '3D // WebGL // Interaction',
    },
  ];

  return (
    <section className="w-full py-section-gap px-margin-mobile md:px-margin-desktop bg-transparent relative max-w-7xl mx-auto">
      <div className="flex flex-col gap-12">
        <div className="flex justify-between items-end border-b border-border-metallic pb-6">
          <span className="font-label-mono text-label-mono text-[#3E2723] uppercase tracking-widest">
            03 // What We Do
          </span>
          <a
            href="#services"
            className="text-[#3E2723] hover:text-[#3E2723] transition-colors font-label-mono text-xs uppercase tracking-wider flex items-center gap-1"
          >
            <span>All Services</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </a>
        </div>

        <div className="flex flex-col">
          {previewItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <a
                href="#services"
                className="group flex flex-col md:flex-row md:items-center justify-between py-10 border-b border-border-metallic hover:bg-surface-container-low/60 transition-all duration-400 px-6 -mx-6 rounded-xl cursor-pointer backdrop-blur-sm"
              >
                <div className="flex items-start md:items-center gap-6">
                  <span className="font-label-mono text-sm text-[#3E2723] group-hover:text-[#3E2723] transition-colors">
                    {item.id}
                  </span>
                  <div className="flex flex-col gap-1">
                    <h4 className="font-headline-lg-mobile text-2xl md:text-3xl text-[#3E2723] group-hover:text-[#3E2723] transition-colors">
                      {item.title}
                    </h4>
                    <span className="font-label-mono text-[11px] text-[#3E2723] uppercase tracking-wider">
                      {item.tags}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-6 mt-4 md:mt-0">
                  <p className="font-body-md text-sm text-[#3E2723] md:max-w-xs group-hover:text-[#3E2723] transition-colors">
                    {item.desc}
                  </p>
                  <span className="material-symbols-outlined text-[#3E2723] group-hover:text-[#3E2723] group-hover:translate-x-2 transition-all duration-300">
                    arrow_forward
                  </span>
                </div>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

