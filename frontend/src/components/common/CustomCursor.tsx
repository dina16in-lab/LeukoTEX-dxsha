import { useEffect, useRef, useState } from 'react';

/**
 * LEUKOTEX — Buttery Custom Cursor
 *
 * Butter feel = frame-rate independent critically-damped follow
 * (exponential smoothing) on 3 layers with different speeds +
 * velocity-based squash & stretch + magnetic hover growth.
 *
 * - dot   : k=35  — tracks almost 1:1, tiny smoothing removes jitter
 * - ring  : k=14  — visible butter trail
 * - halo  : k=7   — ultra-soft outer wake
 * - All motion is transform-only (translate3d) + opacity. Zero layout.
 * - Single rAF loop, delta-time normalized, pauses when tab hidden.
 * - Respects coarse pointers + prefers-reduced-motion.
 */

type HoverKind = 'link' | 'card' | null;

export const CustomCursor: React.FC = () => {
  const dotWrapRef = useRef<HTMLDivElement>(null);
  const dotInnerRef = useRef<HTMLDivElement>(null);
  const ringWrapRef = useRef<HTMLDivElement>(null);
  const ringInnerRef = useRef<HTMLDivElement>(null);
  const haloWrapRef = useRef<HTMLDivElement>(null);
  const haloInnerRef = useRef<HTMLDivElement>(null);

  const [isSupported] = useState(() => {
    if (typeof window === 'undefined') return false;
    const coarse =
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(hover: none)').matches ||
      navigator.maxTouchPoints > 0 ||
      'ontouchstart' in window;
    return !coarse;
  });

  useEffect(() => {
    if (!isSupported) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const dotWrap = dotWrapRef.current;
    const dotInner = dotInnerRef.current;
    const ringWrap = ringWrapRef.current;
    const ringInner = ringInnerRef.current;
    const haloWrap = haloWrapRef.current;
    const haloInner = haloInnerRef.current;
    if (!dotWrap || !dotInner || !ringWrap || !ringInner || !haloWrap || !haloInner) return;

    // --- state (refs only, no re-render) ---
    const target = { x: -100, y: -100 };
    const dot = { x: -100, y: -100 };
    const ring = { x: -100, y: -100 };
    const halo = { x: -100, y: -100 };
    let visible = false;
    let hover: HoverKind = null;
    let pressed = false;
    let raf = 0;
    let lastT = performance.now();
    let lastAngle = 0;

    // Exponential smoothing factor, frame-rate independent.
    // k = responsiveness (higher = snappier). t = 1 - exp(-k * dtSec)
    const K_DOT = reduced ? 1000 : 32;
    const K_RING = reduced ? 1000 : 13;
    const K_HALO = reduced ? 1000 : 6.5;

    const HOVER_SCALE = { dot: 0.6, ring: 1.55, halo: 1.35 } as const;
    const CARD_SCALE = { dot: 1, ring: 1.2, halo: 1.12 } as const;

    const setOpacity = (v: string) => {
      dotWrap.style.opacity = v;
      ringWrap.style.opacity = v;
      haloWrap.style.opacity = v;
    };
    setOpacity('0');

    const applyHoverStyle = () => {
      if (reduced) return;
      if (hover === 'link') {
        ringInner.style.borderColor = 'rgba(232, 160, 191, 0.55)';
        ringInner.style.backgroundColor = 'rgba(232, 160, 191, 0.08)';
        haloInner.style.backgroundColor = 'rgba(232, 160, 191, 0.07)';
        haloInner.style.borderColor = 'rgba(232, 160, 191, 0.18)';
        dotInner.style.backgroundColor = '#99FF99';
      } else if (hover === 'card') {
        ringInner.style.borderColor = 'rgba(153, 255, 153, 0.28)';
        ringInner.style.backgroundColor = 'rgba(153, 255, 153, 0.04)';
        haloInner.style.backgroundColor = 'rgba(153, 255, 153, 0.04)';
        haloInner.style.borderColor = 'rgba(153, 255, 153, 0.1)';
        dotInner.style.backgroundColor = '#99FF99';
      } else {
        ringInner.style.borderColor = 'rgba(153, 255, 153, 0.22)';
        ringInner.style.backgroundColor = 'rgba(153, 255, 153, 0.03)';
        haloInner.style.backgroundColor = 'rgba(153, 255, 153, 0.025)';
        haloInner.style.borderColor = 'rgba(153, 255, 153, 0.08)';
        dotInner.style.backgroundColor = '#99FF99';
      }
    };
    applyHoverStyle();

    const damp = (cur: number, tgt: number, k: number, dt: number) =>
      cur + (tgt - cur) * (1 - Math.exp(-k * dt));

    const animate = (now: number) => {
      const dt = Math.min(0.05, Math.max(0.001, (now - lastT) / 1000));
      lastT = now;

      // --- smooth follow (each layer chases the one ahead for a whip-free trail) ---
      dot.x = damp(dot.x, target.x, K_DOT, dt);
      dot.y = damp(dot.y, target.y, K_DOT, dt);
      ring.x = damp(ring.x, dot.x, K_RING, dt);
      ring.y = damp(ring.y, dot.y, K_RING, dt);
      halo.x = damp(halo.x, ring.x, K_HALO, dt);
      halo.y = damp(halo.y, ring.y, K_HALO, dt);

      // Snap when microscopically close — kills sub-pixel shimmer
      if (Math.abs(target.x - dot.x) < 0.05 && Math.abs(target.y - dot.y) < 0.05) {
        dot.x = target.x;
        dot.y = target.y;
      }

      dotWrap.style.transform = `translate3d(${dot.x}px, ${dot.y}px, 0)`;
      ringWrap.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0)`;
      haloWrap.style.transform = `translate3d(${halo.x}px, ${halo.y}px, 0)`;

      if (!reduced) {
        // --- velocity squash & stretch (butter signature) ---
        const vx = dot.x - ring.x;
        const vy = dot.y - ring.y;
        const speed = Math.sqrt(vx * vx + vy * vy); // px behind
        const stretch = Math.min(0.38, speed * 0.012);
        let angle = lastAngle;
        if (speed > 0.6) {
          angle = Math.atan2(vy, vx);
          lastAngle = angle;
        }
        const deg = (angle * 180) / Math.PI;

        const base =
          hover === 'link' ? HOVER_SCALE : hover === 'card' ? CARD_SCALE : null;
        const sDot = (base?.dot ?? 1) * (pressed ? 0.72 : 1);
        const sRing = (base?.ring ?? 1) * (pressed ? 0.88 : 1);
        const sHalo = (base?.halo ?? 1) * (pressed ? 0.92 : 1);

        // Stretch along motion, squeeze perpendicular — subtle, never wobbly
        dotInner.style.transform = `translate(-50%, -50%) scale(${sDot})`;
        ringInner.style.transform =
          `translate(-50%, -50%) rotate(${deg}deg) ` +
          `scale(${(sRing * (1 + stretch)).toFixed(3)}, ${(sRing * (1 - stretch * 0.7)).toFixed(3)})`;
        haloInner.style.transform =
          `translate(-50%, -50%) rotate(${deg}deg) ` +
          `scale(${((sHalo as number) * (1 + stretch * 0.7)).toFixed(3)}, ${((sHalo as number) * (1 - stretch * 0.5)).toFixed(3)})`;
      } else {
        const s = pressed ? 0.9 : 1;
        dotInner.style.transform = `translate(-50%, -50%) scale(${s})`;
        ringInner.style.transform = `translate(-50%, -50%) scale(${s})`;
        haloInner.style.transform = `translate(-50%, -50%) scale(${s})`;
      }

      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!visible) {
        visible = true;
        // Snap all layers to pointer on first show — no fly-in from corner
        dot.x = ring.x = halo.x = e.clientX;
        dot.y = ring.y = halo.y = e.clientY;
        setOpacity('1');
      } else if (dotWrap.style.opacity === '0') {
        // Re-show after leaving a text field
        const t = e.target as HTMLElement | null;
        const inText = !!t?.closest?.('input, textarea, [contenteditable="true"]');
        if (!inText) setOpacity('1');
      }
    };

    const onOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement | null;
      if (!el?.closest) return;

      if (el.closest('input, textarea, select, [contenteditable="true"]')) {
        setOpacity('0');
        return;
      }
      if (visible && dotWrap.style.opacity === '0') setOpacity('1');

      const isLink = !!el.closest('a, button, [role="button"], [data-cursor="hover"]');
      const isCard =
        !isLink && !!el.closest('.cursor-pointer, [data-cursor="card"], [data-cursor="image"]');
      const next: HoverKind = isLink ? 'link' : isCard ? 'card' : null;
      if (next !== hover) {
        hover = next;
        applyHoverStyle();
      }
    };

    const onDown = () => {
      pressed = true;
    };
    const onUp = () => {
      pressed = false;
    };
    const onLeaveDoc = () => {
      visible = false;
      setOpacity('0');
    };
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else {
        lastT = performance.now();
        raf = requestAnimationFrame(animate);
      }
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    window.addEventListener('mousedown', onDown, { passive: true });
    window.addEventListener('mouseup', onUp, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeaveDoc);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.documentElement.removeEventListener('mouseleave', onLeaveDoc);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [isSupported]);

  if (!isSupported) return null;

  return (
    <div aria-hidden="true" className="custom-cursor-layer">
      {/* Halo — soft outer wake */}
      <div ref={haloWrapRef} className="custom-cursor-ring-wrap" style={wrapStyle(9996)}>
        <div
          ref={haloInnerRef}
          className="custom-cursor-ring"
          style={{
            width: 64,
            height: 64,
            borderRadius: 9999,
            border: '1px solid rgba(153, 255, 153, 0.08)',
            backgroundColor: 'rgba(153, 255, 153, 0.025)',
            willChange: 'transform',
            transition: 'border-color 160ms ease, background-color 160ms ease',
          }}
        />
      </div>
      {/* Ring — butter trail */}
      <div ref={ringWrapRef} className="custom-cursor-ring-wrap" style={wrapStyle(9997)}>
        <div
          ref={ringInnerRef}
          className="custom-cursor-ring"
          style={{
            width: 36,
            height: 36,
            borderRadius: 9999,
            border: '1.5px solid rgba(153, 255, 153, 0.22)',
            backgroundColor: 'rgba(153, 255, 153, 0.03)',
            willChange: 'transform',
            transition: 'border-color 160ms ease, background-color 160ms ease',
          }}
        />
      </div>
      {/* Dot — near-instant, jitter-filtered */}
      <div ref={dotWrapRef} className="custom-cursor-dot-wrap" style={wrapStyle(9998)}>
        <div
          ref={dotInnerRef}
          className="custom-cursor-dot"
          style={{
            width: 8,
            height: 8,
            borderRadius: 9999,
            backgroundColor: '#99FF99',
            border: '1.5px solid rgba(255,255,255,0.95)',
            boxShadow: '0 1px 4px rgba(153, 255, 153,0.28)',
            willChange: 'transform',
          }}
        />
      </div>
    </div>
  );
};

const wrapStyle = (zIndex: number): React.CSSProperties => ({
  position: 'fixed',
  top: 0,
  left: 0,
  width: 0,
  height: 0,
  pointerEvents: 'none',
  zIndex,
  opacity: 0,
  willChange: 'transform',
});
