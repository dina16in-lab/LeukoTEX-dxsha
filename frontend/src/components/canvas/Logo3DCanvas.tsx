import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { isWebGLAvailable, prefersReducedMotion } from '../../lib/utils';

export const Logo3DCanvas: React.FC<{ className?: string }> = ({ className = '' }) => {
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

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 8;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch {
      setWebGLError(true);
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Dynamic Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.5);
    mainLight.position.set(2, 5, 5);
    scene.add(mainLight);

    // Colored accents matching the new logo gradient
    const lilacLight = new THREE.PointLight(0xC9A0DC, 8, 20); // Lilac
    lilacLight.position.set(-3, 3, 2);
    scene.add(lilacLight);

    const coralLight = new THREE.PointLight(0xFF9E9E, 8, 20); // Coral
    coralLight.position.set(3, -3, 2);
    scene.add(coralLight);

    // New Lightning Bolt L Group
    const logoGroup = new THREE.Group();

    // Premium Frosted Glass Material
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x5D3A1A,
      metalness: 0.15,
      roughness: 0.2,
      transmission: 0.4, 
      thickness: 1.5,
      ior: 1.5,
      transparent: true,
      side: THREE.DoubleSide
    });

    const createPolygonShape = (points: number[][]) => {
      const shape = new THREE.Shape();
      points.forEach((p, i) => {
        const x = (p[0] - 50) * 0.07;
        const y = -(p[1] - 50) * 0.07;
        if (i === 0) shape.moveTo(x, y);
        else shape.lineTo(x, y);
      });
      return shape;
    };

    const extrudeSettings = {
      depth: 0.4,
      bevelEnabled: true,
      bevelSegments: 5,
      bevelSteps: 2,
      bevelSize: 0.03,
      bevelThickness: 0.03
    };

    // Top stem
    const topPoints = [[45,10], [65,10], [45,55], [25,55]];
    const topGeom = new THREE.ExtrudeGeometry(createPolygonShape(topPoints), extrudeSettings);
    topGeom.center();
    const topMesh = new THREE.Mesh(topGeom, glassMat);
    topMesh.position.set(0, 1.5, 0); // Offset based on center
    logoGroup.add(topMesh);

    // Middle horizontal bar
    const midPoints = [[25,58], [75,58], [65,68], [15,68]];
    const midGeom = new THREE.ExtrudeGeometry(createPolygonShape(midPoints), extrudeSettings);
    midGeom.center();
    const midMesh = new THREE.Mesh(midGeom, glassMat);
    midMesh.position.set(0, -0.2, 0.2); // slight z-offset for depth
    logoGroup.add(midMesh);

    // Bottom point
    const botPoints = [[35,71], [50,71], [30,95]];
    const botGeom = new THREE.ExtrudeGeometry(createPolygonShape(botPoints), extrudeSettings);
    botGeom.center();
    const botMesh = new THREE.Mesh(botGeom, glassMat);
    botMesh.position.set(-0.5, -1.8, 0);
    logoGroup.add(botMesh);

    // Add some floating glowing particles to enhance immersion
    const particleGeo = new THREE.SphereGeometry(0.04, 8, 8);
    const particleMat1 = new THREE.MeshBasicMaterial({ color: 0xC9A0DC });
    const particleMat2 = new THREE.MeshBasicMaterial({ color: 0xFF9E9E });
    const particles: THREE.Mesh[] = [];

    for(let i=0; i<12; i++) {
      const mesh = new THREE.Mesh(particleGeo, i % 2 === 0 ? particleMat1 : particleMat2);
      mesh.position.set(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 4
      );
      mesh.userData = {
        speedX: (Math.random() - 0.5) * 0.01,
        speedY: (Math.random() - 0.5) * 0.01 + 0.005,
      };
      particles.push(mesh);
      logoGroup.add(mesh);
    }

    // Center pivot slightly
    logoGroup.position.set(0, 0, 0);
    scene.add(logoGroup);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth follow for rotation
      logoGroup.rotation.y += (mouseX * 0.8 - logoGroup.rotation.y) * 0.05;
      logoGroup.rotation.x += (-mouseY * 0.4 - logoGroup.rotation.x) * 0.05;
      
      // Floating animation
      logoGroup.position.y = Math.sin(elapsedTime * 1.2) * 0.2;

      // Animate parts slightly differently for dynamic feel
      topMesh.position.y = 1.5 + Math.sin(elapsedTime * 2) * 0.05;
      botMesh.position.y = -1.8 + Math.cos(elapsedTime * 2.5) * 0.05;

      // Animate particles
      particles.forEach(p => {
        p.position.x += p.userData.speedX;
        p.position.y += p.userData.speedY;
        if(p.position.y > 4) p.position.y = -4;
      });

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
    return null;
  }

  return (
    <div className={`w-full h-full ${className}`}>
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
};


