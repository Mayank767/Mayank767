import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Float, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

/* ═══════════════════════════════════════════════════════
   PREMIUM 3D BACKGROUND — "The Glass API Core"
   
   A sleek, modern, e-commerce style 3D animation.
   Features a large, highly-polished glass icosahedron
   (The Core) surrounded by dark metallic orbital rings
   (The Zero). Dramatic studio lighting and scroll-driven
   rotation give it that "WOW" Dribbble vibe.
   ═══════════════════════════════════════════════════════ */

// ── Global Scroll State ──
const getScrollProgress = () => {
  if (typeof window === 'undefined') return 0;
  const maxScroll = document.body.scrollHeight - window.innerHeight;
  return maxScroll > 0 ? window.scrollY / maxScroll : 0;
};

// ── Mouse & Scroll reactive camera ──
function CameraRig() {
  const { camera } = useThree();
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  useFrame(() => {
    const scrollP = getScrollProgress();
    
    // Smooth Parallax mouse effect
    camera.position.x += (mouseRef.current.x * 1.5 - camera.position.x) * 0.05;
    
    // Scroll effect: move camera and adjust look target
    const targetY = (mouseRef.current.y * 1 + 2) - (scrollP * 3);
    camera.position.y += (targetY - camera.position.y) * 0.05;
    
    // Camera pushes in slightly as you scroll down
    const targetZ = 7 - (scrollP * 2);
    camera.position.z += (targetZ - camera.position.z) * 0.05;

    camera.lookAt(0, -scrollP * 1.5, 0);
  });

  return null;
}

// ── Cinematic Studio Lighting ──
function StudioLighting() {
  const mouseSpotRef = useRef();

  useFrame((state) => {
    if (!mouseSpotRef.current) return;
    const t = state.clock.elapsedTime;
    // Subtle movement for dynamic reflections
    mouseSpotRef.current.position.x = Math.sin(t * 0.5) * 5;
    mouseSpotRef.current.position.y = 4 + Math.cos(t * 0.3) * 2;
  });

  return (
    <>
      <ambientLight intensity={0.1} color="#ffffff" />
      {/* Key Light */}
      <directionalLight position={[5, 10, 5]} intensity={1.5} color="#ffffff" />
      {/* Fill Light */}
      <directionalLight position={[-5, 0, 5]} intensity={0.5} color="#00e87a" />
      {/* Dramatic Rim Lights */}
      <pointLight position={[-8, 5, -8]} intensity={4} color="#6366f1" distance={20} />
      <pointLight position={[8, -5, -8]} intensity={3} color="#00e87a" distance={20} />
      {/* Dynamic Mouse/Spot Light */}
      <pointLight ref={mouseSpotRef} position={[0, 4, 4]} intensity={2} color="#ffffff" distance={15} />
      
      {/* Built-in procedural environment to avoid external CDN fetch failures */}
      <Environment background={false}>
        <group>
          <mesh position={[10, 10, 10]}>
            <sphereGeometry args={[2, 32, 32]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <mesh position={[-10, -10, -10]}>
            <sphereGeometry args={[2, 32, 32]} />
            <meshBasicMaterial color="#00e87a" />
          </mesh>
        </group>
      </Environment>
    </>
  );
}

// ── The Central Glass Core ──
function GlassCore() {
  const coreRef = useRef();
  const innerGlowRef = useRef();

  useFrame((state) => {
    if (!coreRef.current) return;
    const scrollP = getScrollProgress();
    const t = state.clock.elapsedTime;
    
    // The core spins faster as you scroll down
    coreRef.current.rotation.y = t * 0.2 + scrollP * Math.PI * 2;
    coreRef.current.rotation.x = t * 0.1 + scrollP * Math.PI;

    if (innerGlowRef.current) {
      innerGlowRef.current.rotation.y = -t * 0.5;
      innerGlowRef.current.scale.setScalar(1 + Math.sin(t * 3) * 0.05); // Pulsing
    }
  });

  return (
    <group position={[0, -1, 0]}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <group ref={coreRef}>
          {/* Main diamond/icosahedron core */}
          <mesh scale={2.8}>
            <icosahedronGeometry args={[1, 1]} />
            <MeshTransmissionMaterial
              backside
              backsideThickness={5}
              thickness={2}
              chromaticAberration={0.8}
              anisotropy={0.3}
              distortion={0.5}
              distortionScale={0.5}
              temporalDistortion={0.1}
              color="#ffffff"
              transmission={0.9}
              roughness={0.1}
            />
          </mesh>
          
          {/* Inner glowing wireframe for tech vibe */}
          <mesh scale={2.6}>
            <icosahedronGeometry args={[1, 2]} />
            <meshStandardMaterial
              color="#00ffe0"
              emissive="#00e87a"
              emissiveIntensity={1}
              wireframe
              transparent
              opacity={0.3}
            />
          </mesh>
        </group>
      </Float>
    </group>
  );
}

// ── Dark Metallic Orbital Rings (The "Zero" in ZeroAPITools) ──
function MetallicRings() {
  const groupRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const ring3Ref = useRef();

  useFrame((state) => {
    if (!groupRef.current) return;
    const scrollP = getScrollProgress();
    const t = state.clock.elapsedTime;

    // Rings tilt dramatically on scroll
    groupRef.current.rotation.x = scrollP * Math.PI * 0.5;
    groupRef.current.position.y = -scrollP * 2;

    // Independent smooth rotation
    ring1Ref.current.rotation.z = t * 0.1;
    ring1Ref.current.rotation.x = Math.sin(t * 0.2) * 0.2;
    
    ring2Ref.current.rotation.z = -t * 0.15;
    ring2Ref.current.rotation.y = Math.cos(t * 0.15) * 0.3;

    ring3Ref.current.rotation.x = t * 0.05;
    ring3Ref.current.rotation.y = Math.sin(t * 0.1) * 0.4;
  });

  // Premium dark metal material
  const metalMaterial = new THREE.MeshStandardMaterial({
    color: '#111111',
    roughness: 0.2,
    metalness: 0.9,
    envMapIntensity: 2,
  });

  return (
    <group ref={groupRef}>
      <mesh ref={ring1Ref} material={metalMaterial} rotation={[Math.PI / 2.2, 0, 0]}>
        <torusGeometry args={[3.2, 0.04, 16, 100]} />
      </mesh>
      
      <mesh ref={ring2Ref} material={metalMaterial} rotation={[Math.PI / 1.8, 0.2, 0]}>
        <torusGeometry args={[3.8, 0.02, 16, 100]} />
      </mesh>

      <mesh ref={ring3Ref} material={metalMaterial} rotation={[Math.PI / 2, -0.3, 0]}>
        <torusGeometry args={[4.5, 0.06, 16, 100]} />
      </mesh>
    </group>
  );
}

// ── Floating Data Particles ──
function DataParticles({ count = 150 }) {
  const pointsRef = useRef();

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Create a cylinder/tornado distribution around the center
      const radius = 2 + Math.random() * 6;
      const angle = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 15;
      
      arr[i * 3] = Math.cos(angle) * radius;
      arr[i * 3 + 1] = y;
      arr[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.elapsedTime;
    pointsRef.current.rotation.y = t * 0.05;
    
    // Subtle vertical floating
    const posArray = pointsRef.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      posArray[i * 3 + 1] += 0.01; // Move up
      if (posArray[i * 3 + 1] > 7.5) {
        posArray[i * 3 + 1] = -7.5; // Wrap around
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#00ffe0"
        transparent
        opacity={0.15}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ── Main Scene ──
function Scene() {
  return (
    <>
      <StudioLighting />
      <CameraRig />

      <group position={[0, -3.5, -1.5]}>
        {/* The sleek, premium Glass Core */}
        <GlassCore />

        {/* Dark metallic orbital rings */}
        <MetallicRings />
      </group>

      {/* Floating neon particles */}
      <DataParticles />
    </>
  );
}

// ── Exported Component ──
export default function ThreeDAnimation() {
  return (
    <div
      className="three-d-bg-container"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1, // Put it behind all content
        pointerEvents: 'none', // Allow clicks to pass through to website content
        background: 'var(--bg-primary, #0a0a0a)',
      }}
    >
      {/* Premium vignette overlay to make website text extremely readable */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: 'radial-gradient(circle at center, transparent 20%, var(--vignette-edge) 100%)',
      }} />
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: 'linear-gradient(180deg, var(--vignette-mid) 0%, transparent 20%, transparent 80%, var(--vignette-edge) 100%)',
      }} />

      {/* Three.js Canvas */}
      <Canvas
        camera={{ position: [0, 2, 7], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent', pointerEvents: 'none' }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
