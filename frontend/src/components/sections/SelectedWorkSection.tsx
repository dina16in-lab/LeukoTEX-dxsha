import React from 'react';

import { motion } from 'framer-motion';
import { TiltCard } from '../common/TiltCard';
import type { Project } from '../../types';

interface SelectedWorkSectionProps {
  projects: Project[];
}

export const SelectedWorkSection: React.FC<SelectedWorkSectionProps> = ({ projects }) => {
  const featured = projects.slice(0, 2);

  return (
    <section className="w-full py-section-gap px-margin-mobile md:px-margin-desktop flex flex-col gap-16 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-2">
          <span className="font-label-mono text-label-mono text-[#99FF99] uppercase tracking-widest">
            02 // Selected Work
          </span>
          <h3 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-[#99FF99]">
            Case Studies
          </h3>
        </div>
        <a
          href="#work"
          className="hidden md:flex text-[#99FF99] font-label-caps text-label-caps uppercase hover:text-[#99FF99] transition-colors items-center gap-2 group"
        >
          <span>View All Work</span>
          <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
            north_east
          </span>
        </a>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-12">
        {featured.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, delay: index * 0.15 }}
          >
            <TiltCard className="group relative w-full rounded-2xl overflow-hidden bg-surface-container-low/80 backdrop-blur-sm border border-border-metallic cursor-pointer shadow-2xl">
              <a href="#work">
                {/* Media Container */}
                <div className="relative h-72 sm:h-96 md:h-[420px] w-full overflow-hidden bg-surface-muted">
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-85 group-hover:opacity-60 transition-opacity duration-500" />
                </div>

                {/* Bottom Content Card */}
                <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 flex flex-col gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  {/* Tag Pills */}
                  <div className="flex flex-wrap gap-2 mb-1">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-sm bg-surface-variant/80 backdrop-blur-md text-[#99FF99] font-label-mono text-[10px] uppercase tracking-wider"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h4 className="font-headline-lg-mobile text-2xl md:text-3xl text-[#99FF99] font-semibold tracking-tight">
                    {project.title}
                  </h4>
                  <p className="font-body-md text-sm text-[#99FF99] opacity-80 group-hover:opacity-100 transition-opacity duration-500 line-clamp-2">
                    {project.description}
                  </p>

                  <div className="pt-2 flex items-center gap-2 text-[#99FF99] text-xs font-label-mono uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <span>Explore Case Study</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </div>
                </div>
              </a>
            </TiltCard>
          </motion.div>
        ))}
      </div>

      {/* Mobile CTA */}
      <div className="md:hidden w-full">
        <a
          href="#work"
          className="w-full block text-center border border-border-metallic text-[#99FF99] px-8 py-4 rounded-full font-label-caps text-label-caps uppercase hover:bg-surface-container-high transition-all bg-background/50 backdrop-blur-sm"
        >
          View All Projects
        </a>
      </div>
    </section>
  );
};

