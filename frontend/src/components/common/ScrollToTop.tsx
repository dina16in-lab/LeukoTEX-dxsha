import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLenis } from 'lenis/react';
import { scrollToTopInstant } from '../../lib/smooth';

/**
 * Lenis-aware scroll restoration.
 * - Route change → instant jump to top through Lenis (no flash, no fight).
 * - Hash anchor → buttery Lenis scrollTo with header offset.
 */
export const ScrollToTop: React.FC = () => {
  const { pathname, hash } = useLocation();
  const lenis = useLenis();

  useEffect(() => {
    if (hash) {
      const id = hash.slice(1);
      const timer = window.setTimeout(() => {
        const element = document.getElementById(id);
        if (!element) return;
        if (lenis) {
          lenis.scrollTo(element, { offset: -88, duration: 1.4 });
        } else {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 60);
      return () => window.clearTimeout(timer);
    }

    scrollToTopInstant(lenis ?? null);
  }, [pathname, hash, lenis]);

  return null;
};
