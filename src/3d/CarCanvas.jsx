import React, { Suspense, useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Html, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { Sliders, RotateCw, Lightbulb, Sparkles } from 'lucide-react';

function FerrariModel({ color, wheelFinish, headlights, underglow, autoRotate }) {
  const groupRef = useRef();
  const { scene } = useGLTF((import.meta.env.BASE_URL + 'models/ferrari.glb'));
  const carScene = useMemo(() => scene.clone(true), [scene]);

  const bodyMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(color),
    metalness: 0.85,
    roughness: 0.15,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    reflectivity: 0.9,
  }), [color]);

  const wheelMaterial = useMemo(() => {
    let hex = '#D4AF37';
    if (wheelFinish === 'black') hex = '#111111';
    if (wheelFinish === 'silver') hex = '#E0E0E0';
    return new THREE.MeshStandardMaterial({ color: new THREE.Color(hex), metalness: 0.9, roughness: 0.2 });
  }, [wheelFinish]);

  const glassMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#111827'),
    metalness: 0.1,
    roughness: 0.05,
    transmission: 0.85,
    transparent: true,
    opacity: 0.7,
  }), []);

  const headlightMat = useMemo(() => new THREE.MeshBasicMaterial({
    color: headlights ? new THREE.Color('#FFFFFF') : new THREE.Color('#444444'),
  }), [headlights]);

  useEffect(() => {
    carScene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.name === 'body' || child.material?.name === 'Body_Color') {
          child.material = bodyMaterial;
        } else if (child.name.includes('rim') || child.name.includes('wheel')) {
          child.material = wheelMaterial;
        } else if (child.name.includes('glass') || child.material?.name?.includes('Glass')) {
          child.material = glassMaterial;
        } else if (child.name.includes('light') || child.name === 'leds') {
          child.material = headlightMat;
        }
      }
    });
  }, [carScene, bodyMaterial, wheelMaterial, glassMaterial, headlightMat]);

  // Sparks
  const particleCount = 70;
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < particleCount; i++) {
      temp.push({
        x: (Math.random() - 0.5) * 8,
        y: Math.random() * 3,
        z: (Math.random() - 0.5) * 8,
        speedY: 0.01 + Math.random() * 0.02,
        speedX: (Math.random() - 0.5) * 0.01,
      });
    }
    return temp;
  }, []);

  const particlesRef = useRef();

  useFrame((state, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.35;
    }
    if (particlesRef.current) {
      const pos = particlesRef.current.geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        let y = pos[i * 3 + 1] + particles[i].speedY;
        if (y > 3.5) y = 0.05;
        pos[i * 3 + 1] = y;
        pos[i * 3] += particles[i].speedX;
        if (Math.abs(pos[i * 3]) > 4) pos[i * 3] *= -0.9;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group position={[0, -0.6, 0]}>
      <group ref={groupRef}>
        <primitive object={carScene} scale={0.9} />
        {headlights && (
          <group position={[0, 0.4, 2.2]}>
            <spotLight color="#FFF5EA" intensity={4} angle={0.6} penumbra={0.5} position={[-0.7, 0, 0]} target-position={[-0.7, -0.5, 6]} />
            <spotLight color="#FFF5EA" intensity={4} angle={0.6} penumbra={0.5} position={[0.7, 0, 0]} target-position={[0.7, -0.5, 6]} />
          </group>
        )}
        {underglow && <pointLight color={color} intensity={5} distance={3.5} decay={2} position={[0, 0.08, 0]} />}
      </group>

      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={particleCount} array={new Float32Array(particles.flatMap(p => [p.x, p.y, p.z]))} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial color="#FF6B2B" size={0.06} transparent opacity={0.85} blending={THREE.AdditiveBlending} />
      </points>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#060607" roughness={0.2} metalness={0.8} />
      </mesh>
      <gridHelper args={[20, 20, '#FF4D00', '#222222']} position={[0, 0.005, 0]} />
    </group>
  );
}

// useGLTF.preload handled at runtime;

export function CarCanvas() {
  const [color, setColor] = useState('#FF4D00');
  const [wheelFinish, setWheelFinish] = useState('gold');
  const [underglow, setUnderglow] = useState(true);
  const [headlights, setHeadlights] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);
  const [toolbarOpen, setToolbarOpen] = useState(false);

  const colors = [
    { name: 'Rosso Corsa', hex: '#FF4D00' },
    { name: 'Obsidian Black', hex: '#0D0E11' },
    { name: 'Electric Cyan', hex: '#00D9FF' },
    { name: 'Acid Green', hex: '#76FF03' },
    { name: 'Forged Gold', hex: '#D4AF37' },
    { name: 'Frozen Pearl', hex: '#F0F4F8' },
  ];

  return (
    <div className="relative w-full h-[650px] md:h-[750px] lg:h-[820px] overflow-hidden select-none">
      <Canvas shadows camera={{ position: [3.8, 2.2, 4.6], fov: 45 }} gl={{ antialias: true, alpha: true }}>
        <Suspense fallback={<Html center><div className="text-xs font-mono text-[#FF4D00]">LOADING FERRARI 458 3D...</div></Html>}>
          <Environment preset="night" environmentIntensity={0.6} />
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 8, 5]} intensity={1.5} castShadow />
          <FerrariModel color={color} wheelFinish={wheelFinish} headlights={headlights} underglow={underglow} autoRotate={autoRotate} />
          <OrbitControls enablePan={false} minDistance={2.5} maxDistance={8.5} maxPolarAngle={Math.PI / 2 - 0.05} dampingFactor={0.05} />
        </Suspense>
      </Canvas>

      {/* Floating 3D Controls */}
      <div className="absolute bottom-6 left-6 z-30 pointer-events-auto">
        <button
          onClick={() => setToolbarOpen(!toolbarOpen)}
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl glass-panel shadow-lg hover:border-[#FF4D00] transition-all group"
        >
          <Sliders className="w-4 h-4 text-[#FF4D00]" />
          <span className="text-xs font-semibold tracking-wider uppercase font-heading text-white">Ferrari Atelier Controls</span>
          <span className="w-2 h-2 rounded-full bg-[#FF4D00] animate-pulse" />
        </button>

        {toolbarOpen && (
          <div className="mt-3 p-5 rounded-2xl glass-panel shadow-2xl border border-[#FF4D00]/40 w-80 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-xs font-bold tracking-widest uppercase text-[#FF4D00] font-heading">Bespoke Spec Deck</span>
              <button onClick={() => setToolbarOpen(false)} className="text-gray-400 hover:text-white text-xs">✕</button>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-gray-400 uppercase block mb-1.5 font-mono">PBR Paint Finish</label>
              <div className="flex gap-2">
                {colors.map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => setColor(c.hex)}
                    style={{ backgroundColor: c.hex }}
                    className={`w-7 h-7 rounded-full border-2 transition-all ${color === c.hex ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-80'}`}
                  />
                ))}
              </div>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-gray-400 uppercase block mb-1.5 font-mono">Forged Rim Finish</label>
              <div className="grid grid-cols-3 gap-1.5">
                {['gold', 'black', 'silver'].map(f => (
                  <button
                    key={f}
                    onClick={() => setWheelFinish(f)}
                    className={`py-1 text-[11px] font-mono capitalize rounded-md border text-center ${wheelFinish === f ? 'border-[#FF4D00] bg-[#FF4D00]/20 text-white font-bold' : 'border-white/10 text-gray-400'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between text-xs pt-1 border-t border-white/10">
              <span>Neon Underglow</span>
              <input type="checkbox" checked={underglow} onChange={e => setUnderglow(e.target.checked)} className="accent-[#FF4D00]" />
            </div>
            <div className="flex items-center justify-between text-xs">
              <span>LED Headlights</span>
              <input type="checkbox" checked={headlights} onChange={e => setHeadlights(e.target.checked)} className="accent-[#FF4D00]" />
            </div>
            <div className="flex items-center justify-between text-xs">
              <span>Turntable 360</span>
              <input type="checkbox" checked={autoRotate} onChange={e => setAutoRotate(e.target.checked)} className="accent-[#FF4D00]" />
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0B0B0C] to-transparent pointer-events-none" />
    </div>
  );
}