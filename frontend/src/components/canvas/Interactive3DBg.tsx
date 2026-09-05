import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, MeshTransmissionMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

export const ScrollDrivenShapes = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    // Calculate scroll progress (0 to 1) from window
    const scrollY = window.scrollY;
    const maxScroll = Math.max(1, document.body.scrollHeight - window.innerHeight);
    const scrollProgress = scrollY / maxScroll;
    
    // Target rotations incorporating both scroll and mouse pointer
    const targetRotY = (scrollProgress * Math.PI * 4) + (state.pointer.x * 0.5);
    const targetRotX = (state.pointer.y * -0.5);
    
    groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetRotY, 4, delta);
    groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, targetRotX, 4, delta);
    
    // Target positions incorporating both scroll and mouse pointer
    const targetPosY = (-scrollProgress * 15) + (state.pointer.y * 1);
    const targetPosX = (state.pointer.x * 1);
    
    groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, targetPosY, 4, delta);
    groupRef.current.position.x = THREE.MathUtils.damp(groupRef.current.position.x, targetPosX, 4, delta);
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
        <mesh position={[3, 2, -2]}>
          <torusKnotGeometry args={[1, 0.3, 128, 32]} />
          <MeshTransmissionMaterial 
            backside
            thickness={0.5} 
            roughness={0.1} 
            transmission={1} 
            ior={1.5} 
            chromaticAberration={0.5}
            color="#ffffff"
          />
        </mesh>
      </Float>
      
      <Float speed={1.5} rotationIntensity={2} floatIntensity={1.5}>
        <mesh position={[-3, -1, -1]}>
          <octahedronGeometry args={[1.5]} />
          <MeshTransmissionMaterial 
            backside
            thickness={1} 
            roughness={0.2} 
            transmission={0.9} 
            ior={1.2} 
            chromaticAberration={0.8}
            color="#d4d4d8"
          />
        </mesh>
      </Float>

      <Float speed={2.5} rotationIntensity={1} floatIntensity={3}>
        <mesh position={[2, -4, -3]}>
          <sphereGeometry args={[1.2, 64, 64]} />
          <MeshTransmissionMaterial 
            backside
            thickness={0.8} 
            roughness={0.1} 
            transmission={0.95} 
            ior={1.4} 
            chromaticAberration={0.3}
            color="#71717a"
          />
        </mesh>
      </Float>
    </group>
  );
};

export const Interactive3DBg: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
        <Environment preset="city" />
        <ScrollDrivenShapes />
      </Canvas>
    </div>
  );
};

