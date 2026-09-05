export type ProjectCategory = 'All' | '3D Websites' | 'Portfolio' | 'Interactive';

export interface Project {
  id: string;
  slug: string;
  title: string;
  year: string;
  category: string;
  categorySlug: '3d-websites' | 'portfolio' | 'interactive';
  description: string;
  fullDescription?: string;
  tags: string[];
  thumbnail: string;
  liveUrl?: string;
  client?: string;
  featured?: boolean;
}

export interface ServiceItemData {
  id: string;
  number: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  tags: string[];
  image: string;
  altText: string;
}

export interface TimelinePhase {
  phase: string;
  title: string;
  subtitle: string;
  description: string;
}

export interface ArsenalItem {
  name: string;
  icon: string;
  category: 'tech' | 'discipline';
}

export interface ContactFormData {
  name: string;
  email: string;
  projectType: string;
  description: string;
  budget: '10k-25k' | '25k-50k' | '50k+' | string;
}

export type FormStatus = 'idle' | 'loading' | 'success' | 'error';
