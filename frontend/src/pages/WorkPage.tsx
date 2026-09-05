import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TiltCard } from '../components/common/TiltCard';
import { api } from '../services/api';
import type { Project, ProjectCategory } from '../types';

// Loading skeleton for project cards
const ProjectSkeleton: React.FC = () => (
  <div className="flex flex-col gap-6 animate-pulse">
    <div className="w-full aspect-[4/5] sm:aspect-square rounded-2xl bg-[#3E2723]/10" />
    <div className="flex flex-col gap-2">
      <div className="h-8 w-3/4 bg-[#3E2723]/10 rounded" />
      <div className="flex gap-3">
        <div className="h-4 w-16 bg-[#3E2723]/10 rounded" />
        <div className="h-4 w-20 bg-[#3E2723]/10 rounded" />
      </div>
    </div>
  </div>
);

// Empty state when no projects match filter
const EmptyState: React.FC<{ category: string }> = ({ category }) => (
  <div className="col-span-full flex flex-col items-center justify-center py-20 gap-6 text-center">
    <span className="material-symbols-outlined text-[64px] text-[#3E2723]/20">
      folder_off
    </span>
    <div className="flex flex-col gap-2">
      <h3 className="font-headline-lg-mobile text-2xl text-[#3E2723]/60 font-medium">
        No projects found
      </h3>
      <p className="font-body-md text-[#3E2723]/40 max-w-sm">
        {category === 'All'
          ? 'No projects available at the moment. Check back soon.'
          : `No projects match the "${category}" filter. Try selecting a different category.`}
      </p>
    </div>
  </div>
);

export const WorkPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const categories: ProjectCategory[] = ['All', '3D Websites', 'Portfolio', 'Interactive'];

  useEffect(() => {
    setIsLoading(true);
    api.getProjects(activeCategory === 'All' ? undefined : activeCategory)
      .then(setProjects)
      .finally(() => setIsLoading(false));
  }, [activeCategory]);

  // Keyboard dismiss for modal
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && selectedProject) {
      setSelectedProject(null);
    }
  }, [selectedProject]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedProject]);

  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter((p) => {
        if (activeCategory === '3D Websites') return p.category.includes('3D') || p.tags.includes('WebGL') || p.tags.includes('Three.js');
        if (activeCategory === 'Portfolio') return p.category.includes('Portfolio') || p.tags.includes('Editorial');
        if (activeCategory === 'Interactive') return p.category.includes('Interactive') || p.tags.includes('Interactive');
        return true;
      });

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="flex flex-col px-margin-mobile md:px-margin-desktop gap-6 pb-12 pt-8 max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col gap-4"
        >
          <span className="font-label-mono text-label-mono text-[#3E2723] uppercase tracking-widest">
            Portfolio // Archive
          </span>
          <h1 className="font-headline-display text-5xl sm:text-6xl md:text-7xl lg:text-[84px] text-[#3E2723] uppercase max-w-4xl tracking-tighter leading-none font-bold">
            Selected<br />
            Work
          </h1>
          <p className="font-body-md text-base sm:text-lg text-[#3E2723] max-w-lg leading-relaxed">
            Engineering premium digital products and interactive narratives for the digital avant-garde. We blend spatial computing with cinematic design.
          </p>
        </motion.div>
      </section>

      {/* Category Filter Navigation */}
      <div className="w-full px-margin-mobile md:px-margin-desktop pb-12 flex flex-col max-w-7xl mx-auto">
        <nav className="flex overflow-x-auto gap-4 sm:gap-8 pb-6 scrollbar-hide border-b border-border-metallic/60" aria-label="Project categories">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`font-label-mono text-label-mono uppercase tracking-widest whitespace-nowrap flex items-center gap-2 transition-colors duration-300 py-2 px-3 min-h-[44px] rounded-lg ${
                  isActive ? 'text-[#3E2723] bg-[#3E2723]/10' : 'text-[#3E2723]/60 hover:text-[#3E2723] hover:bg-[#3E2723]/5'
                }`}
                aria-pressed={isActive}
              >
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary-container shadow-[0_0_6px_#18a0fb]" />
                )}
                {cat}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Project Grid */}
      <section className="flex flex-col md:grid md:grid-cols-2 gap-12 md:gap-16 px-margin-mobile md:px-margin-desktop pb-section-gap w-full max-w-7xl mx-auto">
        {isLoading ? (
          // Loading skeletons
          <>
            <ProjectSkeleton />
            <div className="md:mt-24"><ProjectSkeleton /></div>
            <ProjectSkeleton />
            <div className="md:mt-24"><ProjectSkeleton /></div>
          </>
        ) : filteredProjects.length === 0 ? (
          <EmptyState category={activeCategory} />
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => {
              const isStaggered = index % 2 === 1;
              return (
                <motion.article
                  layout
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`group relative flex flex-col gap-6 cursor-pointer ${
                    isStaggered ? 'md:mt-24' : ''
                  }`}
                  onClick={() => setSelectedProject(project)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedProject(project); } }}
                  tabIndex={0}
                  role="button"
                  aria-label={`View case study: ${project.title}`}
                >
                  <TiltCard className="relative w-full aspect-[4/5] sm:aspect-square overflow-hidden rounded-2xl bg-surface-muted shadow-2xl border border-border-metallic group-hover:border-outline-variant transition-colors duration-500">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                      style={{ backgroundImage: `url('${project.thumbnail}')` }}
                    />
                    {/* Glassmorphic Overlays */}
                    <div className="absolute inset-0 bg-background/20 group-hover:bg-background/0 transition-colors duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />

                    {/* Hover Button Action */}
                    <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out">
                      <span
                        className="bg-primary text-[#3E2723] font-label-mono text-label-mono uppercase px-6 py-3 rounded-full flex items-center gap-2 shadow-lg"
                      >
                        <span>View Case Study</span>
                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </span>
                      <span className="font-label-mono text-xs text-[#3E2723] px-3 py-1.5 rounded-full bg-surface-container/80 backdrop-blur-md">
                        {project.year}
                      </span>
                    </div>
                  </TiltCard>

                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-baseline">
                      <h2 className="font-headline-lg-mobile text-2xl md:text-3xl text-[#3E2723] uppercase tracking-tight group-hover:text-[#3E2723] transition-colors">
                        {project.title}
                      </h2>
                      <span className="font-label-mono text-label-mono text-[#3E2723]">{project.year}</span>
                    </div>
                    <div className="flex flex-wrap gap-3 font-label-mono text-label-mono uppercase text-[#3E2723]">
                      {project.tags.map((tag) => (
                        <span key={tag} className="flex items-center gap-1.5 text-xs">
                          <span className="w-1 h-1 bg-outline rounded-full" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        )}
      </section>

      {/* Case Study Modal Preview */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-background/90 backdrop-blur-xl"
            onClick={() => setSelectedProject(null)}
            role="dialog"
            aria-modal="true"
            aria-label={`Case study: ${selectedProject.title}`}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-3xl bg-surface-container-low border border-border-metallic rounded-2xl p-6 sm:p-10 flex flex-col gap-6 shadow-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full bg-surface-variant text-[#3E2723] hover:text-[#3E2723] transition-colors focus-visible:ring-2 focus-visible:ring-white/50 z-10"
                aria-label="Close case study"
                autoFocus
              >
                <span className="material-symbols-outlined">close</span>
              </button>

              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-secondary-container text-[#3E2723] font-label-mono text-[10px] uppercase">
                  {selectedProject.category}
                </span>
                <span className="font-label-mono text-xs text-[#3E2723]">{selectedProject.year}</span>
              </div>

              <h3 className="font-headline-lg-mobile text-3xl sm:text-4xl text-[#3E2723] font-bold pr-12">
                {selectedProject.title}
              </h3>

              <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-surface-muted border border-border-metallic">
                <img
                  src={selectedProject.thumbnail}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <p className="font-body-md text-[#3E2723] leading-relaxed text-base">
                {selectedProject.fullDescription || selectedProject.description}
              </p>

              <div className="flex flex-wrap gap-2 pt-2">
                {selectedProject.tags.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 bg-surface-variant text-[#3E2723] font-label-mono text-xs rounded-md"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4 border-t border-border-metallic">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="px-6 py-3 rounded-full border border-border-metallic text-[#3E2723] font-label-mono text-xs uppercase hover:bg-surface-container-high transition-colors min-h-[44px]"
                >
                  Close
                </button>
                {selectedProject.liveUrl && (
                  <a
                    href={selectedProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-3 rounded-full bg-primary text-[#3E2723] font-label-caps text-xs uppercase font-semibold flex items-center justify-center gap-2 hover:bg-tertiary transition-colors min-h-[44px]"
                  >
                    View Live
                    <span className="material-symbols-outlined text-[14px]">north_east</span>
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WorkPage;
