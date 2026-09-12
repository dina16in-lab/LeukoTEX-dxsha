import { useEffect, useRef } from 'react';

/**
 * LEUKOTEX — Buttery Interactive Dot Field (perf-tuned)
 *
 * Same look, a fraction of the cost:
 * - Adaptive density: caps total dots (~1100 desktop) instead of ~2600.
 * - Sleeps when idle: static dots render once, rAF stops until the
 *   pointer moves / resize happens. No 60fps redraw for a still image.
 * - DPR capped at 1.5, resize debounced, zero React state on mousemove,
 *   no per-frame layout reads, pauses when tab hidden.
 * - Disabled on touch / coarse pointers and static on reduced-motion.
 */

// --- Config ---
const DOT_SPACING = 36;
const DOT_BASE_RADIUS = 2.5;
const DOT_RADIUS_VARIATION = 0.55;
const DOT_BASE_OPACITY = 0.85;
const DOT_OPACITY_VARIATION = 0.15;

const CURSOR_RADIUS = 130;
const CURSOR_FORCE = 34;

const SPRING_STIFFNESS = 0.085;
const SPRING_DAMPING = 0.82;
const MAX_DOTS = 1200;

const DOT_COLORS = ['#39FF14', '#99FF99', '#00FF00'];

interface Dot {
  homeX: number;
  homeY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  opacity: number;
}

export const ParticleDotField: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafId = useRef(0);
  const running = useRef(false);
  const mouse = useRef({ x: -9999, y: -9999 });
  const dots = useRef<Dot[]>([]);
  const dpr = useRef(1);
  const canvasSize = useRef({ w: 0, h: 0 });
  const isReducedMotion = useRef(false);
  const needsWake = useRef(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const coarse =
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(hover: none)').matches ||
      navigator.maxTouchPoints > 0 ||
      'ontouchstart' in window;

    if (coarse) {
      if (canvasRef.current) canvasRef.current.style.display = 'none';
      return;
    }

    isReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const generateDots = () => {
      const { w, h } = canvasSize.current;
      // Grow spacing on huge viewports so dot count stays bounded
      const area = w * h;
      const spacing =
        area > 2_500_000 ? DOT_SPACING * 1.35 : area > 1_500_000 ? DOT_SPACING * 1.15 : DOT_SPACING;
      const cols = Math.ceil(w / spacing) + 1;
      const rows = Math.ceil(h / spacing) + 1;
      const total = cols * rows;
      const stride = total > MAX_DOTS ? Math.ceil(total / MAX_DOTS) : 1;

      const next: Dot[] = [];
      let i = 0;
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++, i++) {
          if (stride > 1 && i % stride !== 0) continue;
          const offsetX = row % 2 === 0 ? 0 : spacing * 0.5;
          const homeX = col * spacing + offsetX + (Math.random() - 0.5) * 6;
          const homeY = row * spacing + (Math.random() - 0.5) * 6;
          const radius = Math.max(
            0.5,
            DOT_BASE_RADIUS + (Math.random() - 0.5) * 2 * DOT_RADIUS_VARIATION,
          );
          const opacity = Math.max(
            0.25,
            Math.min(0.6, DOT_BASE_OPACITY + (Math.random() - 0.5) * 2 * DOT_OPACITY_VARIATION),
          );
          next.push({
            homeX,
            homeY,
            x: homeX,
            y: homeY,
            vx: 0,
            vy: 0,
            radius,
            color: DOT_COLORS[(Math.random() * DOT_COLORS.length) | 0],
            opacity,
          });
        }
      }
      dots.current = next;
    };

    const paint = () => {
      const { w, h } = canvasSize.current;
      ctx.clearRect(0, 0, w, h);
      const list = dots.current;
      for (let k = 0, len = list.length; k < len; k++) {
        const dot = list[k];
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, 6.2832);
        ctx.fillStyle = dot.color;
        ctx.globalAlpha = dot.opacity;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const cursorRadiusSq = CURSOR_RADIUS * CURSOR_RADIUS;

    const step = (): boolean => {
      // Returns true while anything is still moving
      let active = false;
      const mx = mouse.current.x;
      const my = mouse.current.y;
      const list = dots.current;
      const mouseLive = mx > -1000;

      for (let k = 0, len = list.length; k < len; k++) {
        const dot = list[k];
        if (mouseLive) {
          const dx = dot.homeX - mx;
          const dy = dot.homeY - my;
          const distSq = dx * dx + dy * dy;
          if (distSq < cursorRadiusSq && distSq > 0.01) {
            const dist = Math.sqrt(distSq);
            const force = ((CURSOR_RADIUS - dist) / CURSOR_RADIUS) * CURSOR_FORCE;
            dot.vx += (dx / dist) * force * 0.06;
            dot.vy += (dy / dist) * force * 0.06;
          }
        }
        const springX = (dot.homeX - dot.x) * SPRING_STIFFNESS;
        const springY = (dot.homeY - dot.y) * SPRING_STIFFNESS;
        dot.vx = (dot.vx + springX) * SPRING_DAMPING;
        dot.vy = (dot.vy + springY) * SPRING_DAMPING;
        dot.x += dot.vx;
        dot.y += dot.vy;

        if (
          Math.abs(dot.x - dot.homeX) < 0.05 &&
          Math.abs(dot.y - dot.homeY) < 0.05 &&
          Math.abs(dot.vx) < 0.01 &&
          Math.abs(dot.vy) < 0.01
        ) {
          dot.x = dot.homeX;
          dot.y = dot.homeY;
          dot.vx = 0;
          dot.vy = 0;
        } else {
          active = true;
        }
      }
      return active || mouseLive;
    };

    const loop = () => {
      if (isReducedMotion.current) {
        // Static render, no physics
        for (const dot of dots.current) {
          dot.x = dot.homeX;
          dot.y = dot.homeY;
        }
        paint();
        running.current = false;
        return;
      }
      const stillActive = step();
      paint();
      if (stillActive || needsWake.current) {
        needsWake.current = false;
        rafId.current = requestAnimationFrame(loop);
      } else {
        running.current = false;
      }
    };

    const wake = () => {
      needsWake.current = true;
      if (!running.current) {
        running.current = true;
        cancelAnimationFrame(rafId.current);
        rafId.current = requestAnimationFrame(loop);
      }
    };

    const handleResize = () => {
      dpr.current = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvasSize.current = { w, h };
      canvas.width = Math.round(w * dpr.current);
      canvas.height = Math.round(h * dpr.current);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr.current, 0, 0, dpr.current, 0, 0);
      generateDots();
      paint();
      wake();
    };

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(handleResize, 150);
    };

    const onMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      wake();
    };
    const onMouseLeave = () => {
      mouse.current.x = -9999;
      mouse.current.y = -9999;
      wake();
    };
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(rafId.current);
        running.current = false;
      } else {
        paint();
        wake();
      }
    };

    handleResize();

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelAnimationFrame(rafId.current);
      running.current = false;
      window.clearTimeout(resizeTimer);
      window.removeEventListener('mousemove', onMouseMove);
      document.documentElement.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="particle-dot-field"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none',
        width: '100%',
        height: '100%',
      }}
    />
  );
};
