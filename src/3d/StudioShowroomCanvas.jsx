import React, { Suspense, useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Html, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { Sliders, RotateCw, Lightbulb, Sparkles, Disc, Wrench, Volume2, Shield, ArrowUpCircle } from 'lucide-react';

// Sparks / Embers Particle Effect
function StudioParticles({ count = 75 }) {
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        x: (Math.random() - 0.5) * 8,
        y: Math.random() * 3.5,
        z: (Math.random() - 0.5) * 8,
        speedY: 0.01 + Math.random() * 0.02,
        speedX: (Math.random() - 0.5) * 0.01,
      });
    }
    return temp;
  }, [count]);

  const pointsRef = useRef();

  useFrame(() => {
    if (!pointsRef.current) return;
    const pos = pointsRef.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      let y = pos[i * 3 + 1] + particles[i].speedY;
      if (y > 3.8) y = 0.05;
      pos[i * 3 + 1] = y;
      pos[i * 3] += particles[i].speedX;
      if (Math.abs(pos[i * 3]) > 4) pos[i * 3] *= -0.9;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={new Float32Array(particles.flatMap((p) => [p.x, p.y, p.z]))}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#FF6B2B"
        size={0.06}
        transparent
        opacity={0.85}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Subwoofer Boot Enclosure
function SubwooferBox({ active }) {
  if (!active) return null;
  return (
    <group position={[0, 0.75, -1.2]} scale={0.65}>
      <mesh>
        <boxGeometry args={[1.3, 0.6, 0.5]} />
        <meshStandardMaterial color="#141416" roughness={0.8} />
      </mesh>
      {[-0.35, 0.35].map((x, i) => (
        <group key={i} position={[x, 0, 0.26]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh>
            <torusGeometry args={[0.22, 0.02, 16, 32]} />
            <meshBasicMaterial color="#FF4D00" />
          </mesh>
          <mesh position={[0, 0, -0.03]}>
            <coneGeometry args={[0.2, 0.1, 32]} />
            <meshStandardMaterial color="#FF4D00" metalness={0.5} roughness={0.3} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// 3D Car Vehicle Mesh Node
function VehicleShowroom({
  carModel,
  color,
  wheelFinish,
  headlights,
  underglow,
  autoRotate,
  liftActive,
  subwooferActive,
}) {
  const groupRef = useRef();
  const baseUrl = import.meta.env.BASE_URL || '/';

  const ferrariGLTF = useGLTF(`${baseUrl}models/ferrari.glb`);
  const tharGLTF = useGLTF(`${baseUrl}models/thar.glb`);

  const ferrariScene = useMemo(() => ferrariGLTF.scene.clone(true), [ferrariGLTF.scene]);
  const tharScene = useMemo(() => tharGLTF.scene.clone(true), [tharGLTF.scene]);

  // Luxury PBR Metallic Paint
  const paintMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(color),
        metalness: 0.85,
        roughness: 0.18,
        clearcoat: 1.0,
        clearcoatRoughness: 0.04,
        reflectivity: 0.95,
      }),
    [color]
  );

  // Forged Rims
  const wheelMat = useMemo(() => {
    let hex = '#D4AF37';
    if (wheelFinish === 'black') hex = '#111111';
    if (wheelFinish === 'silver') hex = '#E2E8F0';
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(hex),
      metalness: 0.9,
      roughness: 0.2,
    });
  }, [wheelFinish]);

  const glassMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#0A0E17'),
        metalness: 0.1,
        roughness: 0.05,
        transmission: 0.85,
        transparent: true,
        opacity: 0.7,
      }),
    []
  );

  const headlightMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: headlights ? new THREE.Color('#FFFFFF') : new THREE.Color('#333333'),
      }),
    [headlights]
  );

  // Apply materials to Ferrari
  useEffect(() => {
    ferrariScene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.name === 'body' || child.material?.name === 'Body_Color') {
          child.material = paintMat;
        } else if (child.name.includes('rim') || child.name.includes('wheel')) {
          child.material = wheelMat;
        } else if (child.name.includes('glass') || child.material?.name?.includes('Glass')) {
          child.material = glassMat;
        } else if (child.name.includes('light') || child.name === 'leds') {
          child.material = headlightMat;
        }
      }
    });
  }, [ferrariScene, paintMat, wheelMat, glassMat, headlightMat]);

  // Apply materials to New Textured Thar model (Preserves authentic embedded photorealistic textures)
  useEffect(() => {
    tharScene.traverse((child) => {
      if (child.isMesh && child.material) {
        child.castShadow = true;
        child.receiveShadow = true;

        const mat = child.material;
        if (mat.map) {
          mat.map.anisotropy = 16;
          mat.map.needsUpdate = true;
        }

        mat.envMapIntensity = 1.35;
        mat.roughness = 0.42;
        mat.metalness = 0.52;

        // In Three.js PBR: #FFFFFF preserves 100% authentic factory texture colors (Red body, black roof, glass, wheels, grille)
        mat.color = new THREE.Color(carColor);
        mat.needsUpdate = true;
      }
    });
  }, [tharScene, carColor]);

  useFrame((state, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.35;
    }
  });

  const targetY = liftActive ? 0.8 : 0;

  return (
    <group position={[0, -0.6, 0]}>
      {/* Moving Vehicle Group */}
      <group
        ref={groupRef}
        position={[0, targetY, 0]}
        style={{ transition: 'all 0.5s ease-out' }}
      >
        {carModel === 'thar' ? (
          <group scale={1.8} position={[0, 0.77, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <primitive object={tharScene} />
          </group>
        ) : (
          <group scale={0.9} position={[0, 0.05, 0]}>
            <primitive object={ferrariScene} />
            <SubwooferBox active={subwooferActive} />
          </group>
        )}

        {/* Headlight Beams */}
        {headlights && (
          <group position={[0, 0.4, 2.2]}>
            <spotLight
              color="#FFF8E7"
              intensity={4.5}
              angle={0.6}
              penumbra={0.5}
              position={[-0.7, 0, 0]}
              target-position={[-0.7, -0.5, 6]}
            />
            <spotLight
              color="#FFF8E7"
              intensity={4.5}
              angle={0.6}
              penumbra={0.5}
              position={[0.7, 0, 0]}
              target-position={[0.7, -0.5, 6]}
            />
          </group>
        )}

        {/* Chassis Neon Underglow */}
        {underglow && (
          <pointLight
            color={color}
            intensity={6}
            distance={3.8}
            decay={2}
            position={[0, 0.08, 0]}
          />
        )}
      </group>

      {/* Floating Sparks */}
      <StudioParticles count={70} />

      {/* The Sleek Reflective Dark Showroom Floor Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[32, 32]} />
        <meshStandardMaterial color="#060607" roughness={0.18} metalness={0.82} />
      </mesh>

      {/* Glowing Hexagonal / Square Automotive Grid Floor */}
      <gridHelper args={[24, 24, '#FF4D00', '#1F1F24']} position={[0, 0.005, 0]} />

      {/* Outer Studio Ring Border */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.008, 0]}>
        <ringGeometry args={[6.8, 6.9, 64]} />
        <meshBasicMaterial color="#FF4D00" />
      </mesh>
    </group>
  );
}

export function StudioShowroomCanvas({
  carModel, setCarModel,
  carColor, setCarColor,
  wheelFinish, setWheelFinish,
  underglow, setUnderglow,
  headlights, setHeadlights,
  autoRotate, setAutoRotate,
  liftActive, setLiftActive,
  subwooferActive, setSubwooferActive,
  onOpenBooking,
}) {
  const [toolbarOpen, setToolbarOpen] = useState(true);

  const colors = [
    { name: 'Factory Dual-Tone (Red & Black)', hex: '#FFFFFF' },
    { name: 'Rosso Corsa Red', hex: '#FF4D00' },
    { name: 'Obsidian Matte Black', hex: '#111215' },
    { name: 'Desert Sand (Thar)', hex: '#C2A382' },
    { name: 'Army Camo Green', hex: '#2A3D2A' },
    { name: 'Forged Monaco Gold', hex: '#D4AF37' },
    { name: 'Glacier Pearl White', hex: '#F1F5F9' },
    { name: 'Riviera Electric Blue', hex: '#0284C7' },
  ];

  return (
    <div id="showroom-plane" className="relative w-full h-[750px] md:h-[880px] bg-[#0B0B0C] overflow-hidden select-none border-y border-[#FF4D00]/20">
      {/* 3D WebGL Canvas */}
      <Canvas
        shadows
        camera={{ position: [3.8, 2.2, 4.6], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Suspense
          fallback={
            <Html center>
              <div className="flex flex-col items-center gap-3 p-4 rounded-xl glass-panel shadow-2xl">
                <div className="w-8 h-8 border-2 border-[#FF4D00] border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-mono uppercase tracking-widest text-[#FF4D00] font-bold">
                  Loading 3D Studio Plane...
                </span>
              </div>
            </Html>
          }
        >
          <Environment preset="night" environmentIntensity={0.65} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[6, 9, 6]} intensity={1.8} castShadow shadow-mapSize={[1024, 1024]} />
          {/* Cyan/Orange Neon Overhead Tubes */}
          <pointLight color="#00D9FF" intensity={2.5} distance={15} position={[-4, 5, 2]} />
          <pointLight color="#FF4D00" intensity={2.5} distance={15} position={[4, 5, -2]} />

          <VehicleShowroom
            carModel={carModel}
            color={carColor}
            wheelFinish={wheelFinish}
            headlights={headlights}
            underglow={underglow}
            autoRotate={autoRotate}
            liftActive={liftActive}
            subwooferActive={subwooferActive}
          />

          <OrbitControls
            enablePan={false}
            minDistance={2.5}
            maxDistance={8.5}
            maxPolarAngle={Math.PI / 2 - 0.05}
            dampingFactor={0.05}
          />
        </Suspense>
      </Canvas>

      {/* Top Banner Guide */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between pointer-events-none z-20">
        <div className="glass-panel px-4 py-2 rounded-xl border border-white/10 flex items-center gap-2.5">
          <RotateCw className="w-4 h-4 text-[#FF4D00] animate-spin" style={{ animationDuration: '9s' }} />
          <span className="text-xs font-mono uppercase tracking-wider text-gray-300">
            360° Interactive Showroom Plane • Drag to Inspect from Any Angle
          </span>
        </div>

        {/* Platform Switcher */}
        <div className="pointer-events-auto flex items-center gap-2 glass-panel p-1 rounded-xl border border-[#FF4D00]/30 shadow-lg">
          <button
            onClick={() => setCarModel('ferrari')}
            className={`px-3 py-1.5 rounded-lg text-xs font-heading font-bold uppercase transition-all ${
              carModel === 'ferrari'
                ? 'bg-[#FF4D00] text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            🏎️ Ferrari 458 GT3
          </button>
          <button
            onClick={() => setCarModel('thar')}
            className={`px-3 py-1.5 rounded-lg text-xs font-heading font-bold uppercase transition-all ${
              carModel === 'thar'
                ? 'bg-[#FF4D00] text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            🏔️ Mahindra Thar 4x4
          </button>
        </div>
      </div>

      {/* Floating 3D Showroom Customizer Deck */}
      <div className="absolute bottom-6 left-6 z-30 pointer-events-auto">
        <button
          onClick={() => setToolbarOpen(!toolbarOpen)}
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl glass-panel shadow-2xl hover:border-[#FF4D00] transition-all border border-[#FF4D00]/40 group"
        >
          <Sliders className="w-4 h-4 text-[#FF4D00]" />
          <span className="text-xs font-bold tracking-wider uppercase font-heading text-white">
            {carModel === 'thar' ? 'Thar 4x4 Atelier Deck' : 'Ferrari Atelier Deck'}
          </span>
          <span className="w-2 h-2 rounded-full bg-[#FF4D00] animate-pulse" />
        </button>

        {toolbarOpen && (
          <div className="mt-3 p-5 rounded-2xl glass-panel shadow-2xl border border-[#FF4D00]/40 w-84 sm:w-96 space-y-4 backdrop-blur-2xl bg-black/85">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-xs font-bold tracking-widest uppercase text-[#FF4D00] font-heading flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Real-Time PBR Mod Deck</span>
              </span>
              <button
                onClick={() => setToolbarOpen(false)}
                className="text-gray-400 hover:text-white text-xs px-2 py-1 rounded bg-white/5"
              >
                ✕
              </button>
            </div>

            {/* PBR Ceramic Paint Finish */}
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1.5 font-mono">
                Bespoke Ceramic Paint & Wrap
              </label>
              <div className="flex flex-wrap gap-2">
                {colors.map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => setCarColor(c.hex)}
                    title={c.name}
                    style={{ backgroundColor: c.hex }}
                    className={`w-7 h-7 rounded-full border-2 transition-all ${
                      carColor === c.hex
                        ? 'border-white scale-115 shadow-[0_0_12px_rgba(255,255,255,0.7)]'
                        : 'border-transparent opacity-80 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Forged Rim Finish */}
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1.5 font-mono">
                Forged Wheel Finish
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'gold', name: 'Monaco Gold' },
                  { id: 'black', name: 'Stealth Black' },
                  { id: 'silver', name: 'Diamond Silver' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setWheelFinish(f.id)}
                    className={`py-1.5 text-[10px] font-mono uppercase rounded-md border text-center transition-all ${
                      wheelFinish === f.id
                        ? 'border-[#FF4D00] bg-[#FF4D00]/25 text-white font-bold shadow'
                        : 'border-white/10 text-gray-400 hover:text-white bg-white/5'
                    }`}
                  >
                    {f.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Real-Life Workshop Options */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-300 font-heading uppercase text-[11px]">Boot Subwoofer Box</span>
                <input
                  type="checkbox"
                  checked={subwooferActive}
                  onChange={(e) => setSubwooferActive(e.target.checked)}
                  className="accent-[#FF4D00] w-4 h-4 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-300 font-heading uppercase text-[11px]">Neon Underglow Kit</span>
                <input
                  type="checkbox"
                  checked={underglow}
                  onChange={(e) => setUnderglow(e.target.checked)}
                  className="accent-[#FF4D00] w-4 h-4 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-300 font-heading uppercase text-[11px]">Projector Headlights</span>
                <input
                  type="checkbox"
                  checked={headlights}
                  onChange={(e) => setHeadlights(e.target.checked)}
                  className="accent-[#FF4D00] w-4 h-4 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-300 font-heading uppercase text-[11px]">Turntable 360 Spin</span>
                <input
                  type="checkbox"
                  checked={autoRotate}
                  onChange={(e) => setAutoRotate(e.target.checked)}
                  className="accent-[#FF4D00] w-4 h-4 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-gray-300 font-heading uppercase text-[11px]">Hydraulic Hoist Elevation</span>
                <button
                  onClick={() => setLiftActive(!liftActive)}
                  className={`px-3 py-1 rounded-md text-[10px] font-mono uppercase font-bold transition-all ${
                    liftActive
                      ? 'bg-blue-600 text-white shadow-[0_0_10px_rgba(37,99,235,0.7)]'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {liftActive ? 'Lower Hoist' : 'Elevate Hoist'}
                </button>
              </div>
            </div>

            {/* Commission CTA Button */}
            <div className="pt-2 border-t border-white/10">
              <button
                onClick={onOpenBooking}
                className="w-full py-2.5 rounded-xl font-heading font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-[#FF4D00] to-[#E03B00] text-white shadow-lg hover:shadow-[0_0_25px_rgba(255,77,0,0.6)] transition-all cursor-pointer"
              >
                Commission This Custom Build
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Vignette */}
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#0B0B0C] to-transparent pointer-events-none" />
    </div>
  );
}
