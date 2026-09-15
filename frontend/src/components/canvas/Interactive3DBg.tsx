import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { prefersReducedMotion } from '../../lib/utils';

/**
 * Buttery + lightweight scroll-driven 3D background.
 *
 * Perf fixes vs before:
 * - No MeshTransmissionMaterial (it forces an extra transmission render pass
 *   per mesh) and no remote Environment HDR — both were the main scroll-jank
 *   source. Cheap physical materials look near-identical on a fixed bg.
 * - Low-poly geometries, capped DPR, live per-frame scroll read so the
 *   shapes always move while scrolling (plus a velocity kick).
 * - Renders nothing on reduced-motion / no-WebGL / pure-touch devices only.
 */

const scrollState = { y: 0, vel: 0 };

export const ScrollDrivenShapes = () => {
  const groupRef = useRef<THREE.Group>(null);
  const lastY = useRef(0);
  const vel = useRef(0);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const d = Math.min(delta, 0.05);

    // Live scroll read every frame — exactly like the original, so the
    // geometry always reacts while scrolling (Lenis or native).
    const scrollY =
      window.scrollY ?? document.documentElement.scrollTop ?? scrollState.y;
    const maxScroll = Math.max(
      1,
      (document.body?.scrollHeight || document.documentElement.scrollHeight) -
        window.innerHeight,
    );
    const progress = THREE.MathUtils.clamp(scrollY / maxScroll, 0, 1);

    // Smoothed scroll velocity — gives a visible kick WHILE scrolling,
    // then settles back to the progress pose when scroll stops.
    const rawVel = scrollY - lastY.current;
    lastY.current = scrollY;
    scrollState.y = scrollY;
    vel.current = THREE.MathUtils.damp(vel.current, rawVel, 6, d);
    scrollState.vel = vel.current;
    const kickRot = THREE.MathUtils.clamp(vel.current * 0.006, -0.7, 0.7);
    const kickY = THREE.MathUtils.clamp(-vel.current * 0.03, -2.2, 2.2);

    // Target rotations incorporating scroll progress, scroll velocity + mouse pointer
    const targetRotY =
      progress * Math.PI * 4 + state.pointer.x * 0.5 + kickRot;
    const targetRotX = state.pointer.y * -0.5 + kickRot * 0.5;

    groupRef.current.rotation.y = THREE.MathUtils.damp(
      groupRef.current.rotation.y,
      targetRotY,
      4,
      d,
    );
    groupRef.current.rotation.x = THREE.MathUtils.damp(
      groupRef.current.rotation.x,
      targetRotX,
      4,
      d,
    );

    // Target positions incorporating scroll progress, scroll velocity + mouse pointer
    const targetPosY =
      -progress * 15 + state.pointer.y * 1 + kickY;
    const targetPosX = state.pointer.x * 1 + kickRot * 0.6;
    groupRef.current.position.y = THREE.MathUtils.damp(
      groupRef.current.position.y,
      targetPosY,
      4,
      d,
    );
    groupRef.current.position.x = THREE.MathUtils.damp(
      groupRef.current.position.x,
      targetPosX,
      4,
      d,
    );
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
        <mesh position={[3, 2, -2]}>
          <icosahedronGeometry args={[1.2, 0]} />
          <meshStandardMaterial color="#99FF99" emissive="#99FF99" emissiveIntensity={0.4} roughness={0.2} metalness={0.2} transparent opacity={0.9} />
        </mesh>
      </Float>

      <Float speed={1.5} rotationIntensity={2} floatIntensity={1.5}>
        <mesh position={[-3, -1, -1]}>
          <dodecahedronGeometry args={[1.3, 0]} />
          <meshStandardMaterial color="#99FF99" emissive="#99FF99" emissiveIntensity={0.4} roughness={0.1} metalness={0.2} transparent opacity={0.85} />
        </mesh>
      </Float>

      <Float speed={2.5} rotationIntensity={1} floatIntensity={3}>
        <mesh position={[2, -4, -3]}>
          <torusGeometry args={[1, 0.4, 16, 100]} />
          <meshStandardMaterial color="#99FF99" emissive="#99FF99" emissiveIntensity={0.4} roughness={0.4} metalness={0.2} transparent opacity={0.8} />
        </mesh>
      </Float>
    </group>
  );
};

export const Interactive3DBg: React.FC = () => {
  const [enabled] = React.useState(() => {
    if (typeof window === 'undefined') return false;
    if (prefersReducedMotion()) return false;
    // Only hide on devices with NO fine pointer at all. Touchscreen laptops
    // (maxTouchPoints > 0 + fine mouse) must still get the geometry.
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const fine = window.matchMedia('(pointer: fine)').matches;
    if (coarse && !fine) return false;
    try {
      const c = document.createElement('canvas');
      return !!(c.getContext('webgl2') ?? c.getContext('webgl'));
    } catch {
      return false;
    }
  });

  if (!enabled) return null;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        frameloop="always"
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 10]} intensity={1.1} color="#ffffff" />
        <directionalLight position={[-6, -4, 4]} intensity={0.35} color="#ffe9c9" />
        <ScrollDrivenShapes />
      </Canvas>
    </div>
  );
};
