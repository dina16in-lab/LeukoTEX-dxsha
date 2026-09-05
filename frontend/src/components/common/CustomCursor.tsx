import { useEffect, useRef, useState } from 'react';

/**
 * LEUKOTEX — Premium Minimal Cursor
 * Performance-first: no React state on mousemove, GPU-only transforms (translate3d), rAF lerp for subtle trail.
 * Visual: 6px dot + 28px ring, brand pink accent on hover, no blur/particles.
 * Respects touch devices and prefers-reduced-motion.
 */
export const CustomCursor: React.FC = () => {
  const dotWrapRef = useRef<HTMLDivElement>(null);
  const dotInnerRef = useRef<HTMLDivElement>(null);
  const ringWrapRef = useRef<HTMLDivElement>(null);
  const ringInnerRef = useRef<HTMLDivElement>(null);

  const mouse = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const rafId = useRef<number>(0);
  const isHovering = useRef(false);
  const visible = useRef(false);

  const [isSupported] = useState(() => {
    if (typeof window === 'undefined') return true;
    const isCoarse =
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(hover: none)').matches ||
      navigator.maxTouchPoints > 0 ||
      'ontouchstart' in window;
    return !isCoarse;
  });

  useEffect(() => {
    if (!isSupported) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const dotWrap = dotWrapRef.current;
    const dotInner = dotInnerRef.current;
    const ringWrap = ringWrapRef.current;
    const ringInner = ringInnerRef.current;
    if (!dotWrap || !dotInner || !ringWrap || !ringInner) return;

    // Initial hidden state
    dotWrap.style.opacity = '0';
    ringWrap.style.opacity = '0';

    // If reduced motion, disable trail completely — ring snaps directly
    const lerpFactor = prefersReduced ? 1 : 0.35;

    // Animation loop — only for trailing ring (dot is updated instantly on mousemove for zero lag)
    const animate = () => {
      const dx = mouse.current.x - ringPos.current.x;
      const dy = mouse.current.y - ringPos.current.y;

      if (prefersReduced) {
        ringPos.current.x = mouse.current.x;
        ringPos.current.y = mouse.current.y;
      } else {
        // Fast lerp, no overshoot, keeps ring tightly following pointer
        ringPos.current.x += dx * lerpFactor;
        ringPos.current.y += dy * lerpFactor;
        // Snap when very close to avoid micro jitter
        if (Math.abs(dx) < 0.3 && Math.abs(dy) < 0.3) {
          ringPos.current.x = mouse.current.x;
          ringPos.current.y = mouse.current.y;
        }
      }

      // GPU-optimized: only transform, no layout
      ringWrap.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%)`;

      rafId.current = requestAnimationFrame(animate);
    };
    rafId.current = requestAnimationFrame(animate);

    const onMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;

      // Dot follows native pointer exactly — zero trail for precision
      dotWrap.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;

      if (!visible.current) {
        visible.current = true;
        dotWrap.style.opacity = '1';
        ringWrap.style.opacity = '1';
      }
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // Text inputs — hide custom cursor, restore native text cursor
      const isTextField = !!target.closest('input, textarea, [contenteditable="true"]');
      if (isTextField) {
        dotWrap.style.opacity = '0';
        ringWrap.style.opacity = '0';
        // Ensure native text cursor shows (CSS already restores, this is fallback)
        return;
      }
      // Restore visibility when leaving text field
      if (visible.current) {
        dotWrap.style.opacity = '1';
        ringWrap.style.opacity = '1';
      }

      // Hover detection — lightweight, no getComputedStyle
      // Buttons/links
      const isLinkHover = !!target.closest('a, button, [role="button"], [data-cursor="hover"]');
      // Cards / images subtle hover (elements with cursor-pointer inside group cards)
      const isCardHover =
        !isLinkHover &&
        !!target.closest('.cursor-pointer, [data-cursor="card"], [data-cursor="image"]');

      const shouldHover = isLinkHover || isCardHover;

      if (shouldHover !== isHovering.current) {
        isHovering.current = shouldHover;

        if (prefersReduced) {
          // No scale animation when reduced motion preferred
          return;
        }

        if (isLinkHover) {
          ringInner.style.transform = 'scale(1.32)';
          ringInner.style.borderColor = 'rgba(232, 160, 191, 0.42)'; // subtle LEUKOTEX pink/lilac
          ringInner.style.backgroundColor = 'rgba(232, 160, 191, 0.06)';
          dotInner.style.transform = 'scale(0.85)';
          dotInner.style.opacity = '0.95';
        } else if (isCardHover) {
          ringInner.style.transform = 'scale(1.14)';
          ringInner.style.borderColor = 'rgba(62, 39, 35, 0.16)';
          ringInner.style.backgroundColor = 'rgba(62, 39, 35, 0.03)';
          dotInner.style.transform = 'scale(1)';
        } else {
          ringInner.style.transform = 'scale(1)';
          ringInner.style.borderColor = 'rgba(62, 39, 35, 0.13)';
          ringInner.style.backgroundColor = 'transparent';
          dotInner.style.transform = 'scale(1)';
          dotInner.style.opacity = '1';
        }
      }
    };

    const onMouseDown = () => {
      if (prefersReduced) return;
      dotInner.style.transform = isHovering.current ? 'scale(0.7)' : 'scale(0.88)';
      ringInner.style.transform = isHovering.current ? 'scale(1.2)' : 'scale(0.96)';
    };

    const onMouseUp = () => {
      if (prefersReduced) return;
      if (isHovering.current) {
        ringInner.style.transform = 'scale(1.32)';
        dotInner.style.transform = 'scale(0.85)';
      } else {
        ringInner.style.transform = 'scale(1)';
        dotInner.style.transform = 'scale(1)';
      }
    };

    const onMouseLeave = () => {
      visible.current = false;
      dotWrap.style.opacity = '0';
      ringWrap.style.opacity = '0';
    };

    const onMouseEnter = () => {
      // Will become visible on next mousemove
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseover', onMouseOver, { passive: true });
    window.addEventListener('mousedown', onMouseDown, { passive: true });
    window.addEventListener('mouseup', onMouseUp, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      cancelAnimationFrame(rafId.current);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [isSupported]);

  if (!isSupported) return null;

  return (
    <>
      {/* Dot — follows native pointer exactly, no delay */}
      <div
        ref={dotWrapRef}
        aria-hidden="true"
        className="custom-cursor-dot-wrap"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 0,
          height: 0,
          pointerEvents: 'none',
          zIndex: 9999,
          opacity: 0,
          willChange: 'transform',
          // Hide on touch via CSS, but JS also returns null
        }}
      >
        <div
          ref={dotInnerRef}
          className="custom-cursor-dot"
          style={{
            width: 10,
            height: 10,
            marginLeft: -5,
            marginTop: -5,
            borderRadius: 9999,
            backgroundColor: '#3E2723',
            border: '1.5px solid rgba(255,255,255,0.95)',
            boxShadow: '0 1px 4px rgba(62,39,35,0.28)',
            willChange: 'transform',
            transition: 'transform 120ms cubic-bezier(0.25, 1, 0.5, 1), opacity 120ms ease',
          }}
        />
      </div>

      {/* Ring — subtle trailing, minimal pink accent on hover */}
      <div
        ref={ringWrapRef}
        aria-hidden="true"
        className="custom-cursor-ring-wrap"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 0,
          height: 0,
          pointerEvents: 'none',
          zIndex: 9998,
          opacity: 0,
          willChange: 'transform',
        }}
      >
        <div
          ref={ringInnerRef}
          className="custom-cursor-ring"
          style={{
            width: 38,
            height: 38,
            marginLeft: -19,
            marginTop: -19,
            borderRadius: 9999,
            border: '1.5px solid rgba(62, 39, 35, 0.22)',
            backgroundColor: 'rgba(62, 39, 35, 0.03)',
            willChange: 'transform',
            transition:
              'transform 120ms cubic-bezier(0.25, 1, 0.5, 1), border-color 120ms ease, background-color 120ms ease',
          }}
        />
      </div>
    </>
  );
};
