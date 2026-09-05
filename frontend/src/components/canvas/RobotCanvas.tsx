import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { isWebGLAvailable, prefersReducedMotion } from '../../lib/utils';

interface RobotCanvasProps {
  className?: string;
}

export const RobotCanvas: React.FC<RobotCanvasProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [webGLError, setWebGLError] = useState<boolean>(false);

  useEffect(() => {
    if (!isWebGLAvailable() || prefersReducedMotion()) {
      setWebGLError(true);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 3.8;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    } catch {
      setWebGLError(true);
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xffffff, 2.5);
    spotLight.position.set(10, 10, 10);
    scene.add(spotLight);

    const pointLight = new THREE.PointLight(0x18a0fb, 2, 15);
    pointLight.position.set(-4, -1, 4);
    scene.add(pointLight);

    const rimLight = new THREE.PointLight(0x9acbff, 1.2, 10);
    rimLight.position.set(3, 2, -2);
    scene.add(rimLight);

    // Robotic Character Group
    const robotGroup = new THREE.Group();

    // Main Metallic Helmet/Head
    const helmetGeom = new THREE.SphereGeometry(1.05, 48, 48, 0, Math.PI * 2, 0, Math.PI * 0.82);
    const metalMat = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      metalness: 0.9,
      roughness: 0.25,
    });
    const helmet = new THREE.Mesh(helmetGeom, metalMat);
    robotGroup.add(helmet);

    // Glassy Reflective Visor
    const visorGeom = new THREE.SphereGeometry(1.08, 48, 48, 0, Math.PI, Math.PI * 0.28, Math.PI * 0.34);
    const visorMat = new THREE.MeshPhysicalMaterial({
      color: 0x050505,
      metalness: 0.1,
      roughness: 0.05,
      transmission: 0.85,
      thickness: 0.5,
      transparent: true,
      opacity: 0.95,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });
    const visor = new THREE.Mesh(visorGeom, visorMat);
    robotGroup.add(visor);

    // Mechanical Neck
    const neckGeom = new THREE.CylinderGeometry(0.45, 0.65, 0.85, 24);
    const neckMat = new THREE.MeshStandardMaterial({
      color: 0x161616,
      metalness: 0.85,
      roughness: 0.35,
    });
    const neck = new THREE.Mesh(neckGeom, neckMat);
    neck.position.y = -1.25;
    robotGroup.add(neck);

    // Internal Azure Glowing Core
    const coreGeom = new THREE.CylinderGeometry(0.35, 0.35, 0.65, 24);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0x18a0fb });
    const core = new THREE.Mesh(coreGeom, coreMat);
    core.position.y = -1.25;
    robotGroup.add(core);

    // Collar detail ring
    const ringGeom = new THREE.TorusGeometry(0.7, 0.06, 16, 40);
    const ring = new THREE.Mesh(ringGeom, metalMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -1.35;
    robotGroup.add(ring);

    scene.add(robotGroup);

    // Mouse Tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0;
    let targetRotY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
      targetRotY = mouseX * 0.45;
      targetRotX = -mouseY * 0.3;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Window Resize
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Gentle floating sine wave
      robotGroup.position.y = Math.sin(elapsedTime * 1.2) * 0.08;

      // Smooth mouse-follow interpolation
      robotGroup.rotation.y += (targetRotY - robotGroup.rotation.y) * 0.05;
      robotGroup.rotation.x += (targetRotX - robotGroup.rotation.x) * 0.05;

      // Slight pulsing glow on core
      const pulse = (Math.sin(elapsedTime * 3) + 1) * 0.5;
      pointLight.intensity = 1.8 + pulse * 0.6;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      scene.clear();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  if (webGLError) {
    return (
      <div className={`relative w-full h-full flex items-center justify-center overflow-hidden ${className}`}>
        <img
          src="/assets/hero_robot.png"
          alt="LEUKOTEX Robotic Avatar"
          className="w-full h-full object-cover object-center opacity-80 filter brightness-95"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full ${className}`}>
      <div ref={containerRef} className="w-full h-full" />
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent pointer-events-none" />
    </div>
  );
};

