import type { Project, ServiceItemData, ContactFormData } from '../types';
import { INITIAL_PROJECTS } from '../data/projects';
import { SERVICES_DATA } from '../data/services';

const getApiUrl = (endpoint: string) => {
  const base = import.meta.env.VITE_API_URL || '/api';
  const cleanEndpoint = endpoint.replace(/^\//, '');
  if (base.startsWith('http://') || base.startsWith('https://')) {
    const cleanBase = base.replace(/\/$/, '');
    return new URL(`${cleanBase}/${cleanEndpoint}`);
  }
  const cleanBase = base.replace(/\/$/, '');
  const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
  return new URL(`${cleanBase}/${cleanEndpoint}`, origin);
};

export const api = {
  // GET /api/projects
  async getProjects(category?: string): Promise<Project[]> {
    try {
      const url = getApiUrl('projects');
      if (category && category !== 'All') {
        url.searchParams.append('category', category);
      }

      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (err) {
      console.warn('Backend unavailable, utilizing local fallback projects data:', err);
      if (!category || category === 'All') {
        return INITIAL_PROJECTS;
      }
      return INITIAL_PROJECTS.filter(
        (p) => p.category === category || p.tags.includes(category)
      );
    }
  },

  // GET /api/projects/:slug
  async getProjectBySlug(slug: string): Promise<Project | null> {
    try {
      const url = getApiUrl(`projects/${slug}`);
      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (err) {
      console.warn('Backend unavailable, utilizing local fallback project data:', err);
      const project = INITIAL_PROJECTS.find((p) => p.slug === slug);
      return project || null;
    }
  },

  // GET /api/services
  async getServices(): Promise<ServiceItemData[]> {
    try {
      const url = getApiUrl('services');
      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (err) {
      console.warn('Backend unavailable, utilizing local fallback services data:', err);
      return SERVICES_DATA;
    }
  },

  // GET /api/services/:idOrNumber
  async getServiceById(idOrNumber: string): Promise<ServiceItemData | null> {
    try {
      const url = getApiUrl(`services/${idOrNumber}`);
      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (err) {
      console.warn('Backend unavailable, utilizing local fallback service data:', err);
      const service = SERVICES_DATA.find((s) => s.id === idOrNumber || s.number === idOrNumber);
      return service || null;
    }
  },

  // POST /api/contact
  async submitContact(data: ContactFormData): Promise<{ success: boolean; message: string; inquiry_id?: string }> {
    // Client-side quick check
    if (!data.name || !data.email || !data.description) {
      throw new Error('Please fill in all required fields.');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new Error('Please enter a valid email address.');
    }

    const url = getApiUrl('contact');
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Server returned ${response.status}`);
    }

    const resJson = await response.json();
    return {
      success: true,
      message: resJson.message || 'Your inquiry has been received. Our studio will connect with you within 24 hours.',
      inquiry_id: resJson.inquiry_id,
    };
  },
};
