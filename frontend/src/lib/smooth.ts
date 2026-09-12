import type Lenis from 'lenis';

/**
 * Shared buttery-smooth motion tokens.
 * Single source of truth so scroll, cursor, reveals and parallax all feel like one system.
 */

/** Expo-out — the "butter" easing used by Lenis, framer-motion and CSS. */
export const BUTTER_EASING_FN = (t: number): number =>
  Math.min(1, 1.001 - Math.pow(2, -10 * t));

/** Framer-motion cubic-bezier equivalent of expo-out-ish butter. */
export const BUTTER_EASE = [0.22, 1, 0.36, 1] as const;

/** Canonical Lenis options for a seamless, fluid feel. */
export const LENIS_OPTIONS = {
  duration: 1.15,
  easing: BUTTER_EASING_FN,
  orientation: 'vertical' as const,
  gestureOrientation: 'vertical' as const,
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 1.8,
  syncTouch: false,
  infinite: false,
  autoRaf: true,
  anchors: { offset: -80 } as const,
  prevent: (node: HTMLElement) =>
    node.hasAttribute('data-lenis-prevent') ||
    node.closest?.('[data-lenis-prevent]') != null,
} as const;

/**
 * Smooth-scroll to an in-page section via Lenis when available,
 * falling back to native smooth scroll. Always accounts for the
 * fixed 80px header.
 */
export function scrollToSection(
  lenis: Lenis | undefined | null,
  id: string,
  extraOffset = -80,
): void {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) {
    lenis.scrollTo(el, {
      offset: extraOffset,
      duration: 1.4,
      easing: BUTTER_EASING_FN,
    });
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY + extraOffset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

/** Instant-jump to top through Lenis (route changes) — no flash. */
export function scrollToTopInstant(lenis: Lenis | undefined | null): void {
  if (lenis) {
    lenis.scrollTo(0, { immediate: true, force: true });
  } else {
    window.scrollTo(0, 0);
  }
}
