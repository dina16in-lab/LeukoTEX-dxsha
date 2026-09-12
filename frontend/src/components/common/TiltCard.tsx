import React, { useRef } from 'react';

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  maxRotation?: number;
  scale?: number;
  className?: string;
}

/**
 * Buttery tilt — pointer is sampled on mousemove, applied on rAF with
 * exponential smoothing so fast sweeps glide instead of snapping.
 * Transform-only, no per-event layout thrash.
 */
export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  maxRotation = 5,
  scale = 1.02,
  className = '',
  ...rest
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const target = useRef({ rx: 0, ry: 0, s: 1 });
  const current = useRef({ rx: 0, ry: 0, s: 1 });
  const raf = useRef(0);
  const hovering = useRef(false);

  const loop = () => {
    const card = cardRef.current;
    if (!card) return;
    // Butter smoothing — frame-rate independent-ish at 60fps assumption,
    // cheap and stable for a hover effect.
    const k = 0.18;
    current.current.rx += (target.current.rx - current.current.rx) * k;
    current.current.ry += (target.current.ry - current.current.ry) * k;
    current.current.s += (target.current.s - current.current.s) * k;
    const { rx, ry, s } = current.current;
    card.style.transform = `perspective(1000px) rotateX(${rx.toFixed(3)}deg) rotateY(${ry.toFixed(3)}deg) scale3d(${s}, ${s}, ${s})`;
    if (
      hovering.current ||
      Math.abs(rx) > 0.02 ||
      Math.abs(ry) > 0.02 ||
      Math.abs(s - 1) > 0.0005
    ) {
      raf.current = requestAnimationFrame(loop);
    } else {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    }
  };

  const wake = () => {
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(loop);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2 || 1;
    const centerY = rect.height / 2 || 1;
    target.current.ry = ((x - centerX) / centerX) * maxRotation;
    target.current.rx = ((y - centerY) / centerY) * -maxRotation;
    target.current.s = scale;
    hovering.current = true;
    wake();
  };

  const handleMouseLeave = () => {
    hovering.current = false;
    target.current.rx = 0;
    target.current.ry = 0;
    target.current.s = 1;
    wake();
  };

  React.useEffect(() => () => cancelAnimationFrame(raf.current), []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`will-change-transform ${className}`}
      style={{ transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)' }}
      {...rest}
    >
      {children}
    </div>
  );
};
