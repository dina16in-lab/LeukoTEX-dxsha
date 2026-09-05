import { useEffect, useRef } from 'react';

/**
 * LEUKOTEX — Premium Interactive Dot Field Background
 *
 * Canvas2D particle system: ~800 subtle dark-brown dots across the viewport.
 * Cursor interaction: dots within a radius gently repel from the pointer and
 * smoothly spring back to their original positions.
 *
 * Performance: single <canvas>, requestAnimationFrame loop, zero React state
 * on mouse move, refs-only tracking, GPU-composited fixed layer.
 *
 * Accessibility: disabled on touch/coarse-pointer devices and respects
 * prefers-reduced-motion.
 */

// --- Config ---
const DOT_SPACING = 28; // px between dots in the grid
const DOT_BASE_RADIUS = 1.8; // base dot size (px)
const DOT_RADIUS_VARIATION = 0.6; // ± random size variation
const DOT_BASE_OPACITY = 0.45;
const DOT_OPACITY_VARIATION = 0.15; // ± random opacity variation

const CURSOR_RADIUS = 120; // interaction radius around cursor
const CURSOR_FORCE = 38; // max displacement force (px)

const SPRING_STIFFNESS = 0.08; // how quickly dots return (0–1, higher = faster)
const SPRING_DAMPING = 0.82; // velocity damping (0–1, higher = more damping)

// Dark brown palette
const DOT_COLORS = ['#3A2418', '#4A3022', '#2B1A12'];

interface Dot {
  /** Grid home position */
  homeX: number;
  homeY: number;
  /** Current rendered position */
  x: number;
  y: number;
  /** Velocity for spring physics */
  vx: number;
  vy: number;
  /** Visual properties (set once) */
  radius: number;
  color: string;
  opacity: number;
}

export const ParticleDotField: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafId = useRef(0);
  const mouse = useRef({ x: -9999, y: -9999 });
  const dots = useRef<Dot[]>([]);
  const dpr = useRef(1);
  const canvasSize = useRef({ w: 0, h: 0 });
  const isReducedMotion = useRef(false);
  const isSupported = useRef(true);
  const scrollY = useRef(0);

  useEffect(() => {
    // --- Device / preference checks ---
    if (typeof window === 'undefined') return;

    const coarse =
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(hover: none)').matches ||
      navigator.maxTouchPoints > 0 ||
      'ontouchstart' in window;

    if (coarse) {
      isSupported.current = false;
      // Hide the canvas element on touch devices
      if (canvasRef.current) {
        canvasRef.current.style.display = 'none';
      }
      return;
    }

    isReducedMotion.current = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // --- Dot generation ---
    const generateDots = () => {
      const w = canvasSize.current.w;
      const h = canvasSize.current.h;
      const newDots: Dot[] = [];
      const cols = Math.ceil(w / DOT_SPACING) + 1;
      const rows = Math.ceil(h / DOT_SPACING) + 1;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          // Staggered grid: offset every other row by half spacing
          const offsetX = row % 2 === 0 ? 0 : DOT_SPACING * 0.5;
          const homeX = col * DOT_SPACING + offsetX;
          const homeY = row * DOT_SPACING;

          // Organic variation: slight random jitter in position
          const jitterX = (Math.random() - 0.5) * 6;
          const jitterY = (Math.random() - 0.5) * 6;

          const radius =
            DOT_BASE_RADIUS +
            (Math.random() - 0.5) * 2 * DOT_RADIUS_VARIATION;
          const opacity =
            DOT_BASE_OPACITY +
            (Math.random() - 0.5) * 2 * DOT_OPACITY_VARIATION;
          const color =
            DOT_COLORS[Math.floor(Math.random() * DOT_COLORS.length)];

          newDots.push({
            homeX: homeX + jitterX,
            homeY: homeY + jitterY,
            x: homeX + jitterX,
            y: homeY + jitterY,
            vx: 0,
            vy: 0,
            radius: Math.max(0.5, radius),
            color,
            opacity: Math.max(0.25, Math.min(0.6, opacity)),
          });
        }
      }

      dots.current = newDots;
    };

    // --- Resize handler ---
    const handleResize = () => {
      dpr.current = Math.min(window.devicePixelRatio || 1, 2); // cap at 2x for perf
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvasSize.current = { w, h };
      canvas.width = w * dpr.current;
      canvas.height = h * dpr.current;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr.current, 0, 0, dpr.current, 0, 0);
      generateDots();
    };

    handleResize();

    // --- Mouse tracking (passive, no React state) ---
    const onMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    const onMouseLeave = () => {
      mouse.current.x = -9999;
      mouse.current.y = -9999;
    };

    const onScroll = () => {
      scrollY.current = window.scrollY;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    // Initial scroll
    scrollY.current = window.scrollY;

    // --- Animation loop ---
    const cursorRadiusSq = CURSOR_RADIUS * CURSOR_RADIUS;

    const animate = () => {
      const w = canvasSize.current.w;
      const h = canvasSize.current.h;

      ctx.clearRect(0, 0, w, h);

      const mx = mouse.current.x;
      const my = mouse.current.y;
      const reduced = isReducedMotion.current;

      for (let i = 0, len = dots.current.length; i < len; i++) {
        const dot = dots.current[i];

        if (!reduced) {
          // Calculate distance from cursor to dot home position
          // (home position stays fixed relative to canvas/viewport)
          const dx = dot.homeX - mx;
          const dy = dot.homeY - my;
          const distSq = dx * dx + dy * dy;

          if (distSq < cursorRadiusSq && distSq > 0.01) {
            const dist = Math.sqrt(distSq);
            // Force falls off smoothly with distance
            const force =
              ((CURSOR_RADIUS - dist) / CURSOR_RADIUS) * CURSOR_FORCE;
            // Normalize direction and apply force
            const nx = dx / dist;
            const ny = dy / dist;
            dot.vx += nx * force * 0.06;
            dot.vy += ny * force * 0.06;
          }

          // Spring back to home + damping
          const springX = (dot.homeX - dot.x) * SPRING_STIFFNESS;
          const springY = (dot.homeY - dot.y) * SPRING_STIFFNESS;
          dot.vx = (dot.vx + springX) * SPRING_DAMPING;
          dot.vy = (dot.vy + springY) * SPRING_DAMPING;
          dot.x += dot.vx;
          dot.y += dot.vy;

          // Snap when very close to avoid micro-jitter
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
          }
        } else {
          // Reduced motion: dots stay at home, no animation
          dot.x = dot.homeX;
          dot.y = dot.homeY;
        }

        // Draw dot
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        ctx.fillStyle = dot.color;
        ctx.globalAlpha = dot.opacity;
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(rafId.current);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', handleResize);
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
