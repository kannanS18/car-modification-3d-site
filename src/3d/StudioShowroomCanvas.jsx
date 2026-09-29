import React, { Suspense, useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Html, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import {
  Sliders,
  RotateCw,
  Sparkles,
  Wrench,
  Shield,
  Layers,
  Sun,
  Eye,
  CheckCircle,
} from 'lucide-react';

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

// Subwoofer Boot Enclosure (For Sports Coupe)
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

// 3D Auxiliary Front Bumper Rally Fog Pods (Mahindra Thar 4x4)
function BumperFogPods({ active, headlights }) {
  if (!active) return null;
  const isLit = headlights;

  return (
    <group>
      {/* Left Fog Pod */}
      <group position={[-0.93, -0.06, -0.22]}>
        {/* Die-cast black housing */}
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.045, 0.05, 0.04, 24]} />
          <meshStandardMaterial color="#111214" roughness={0.7} metalness={0.8} />
        </mesh>
        {/* Amber / Warm Lens */}
        <mesh position={[-0.021, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <circleGeometry args={[0.042, 24]} />
          <meshBasicMaterial color={isLit ? '#FFB800' : '#4A3B12'} />
        </mesh>
        {/* Steel Mounting Bracket */}
        <mesh position={[0.02, -0.03, 0]}>
          <boxGeometry args={[0.02, 0.05, 0.02]} />
          <meshStandardMaterial color="#1E2024" metalness={0.9} roughness={0.3} />
        </mesh>
        {/* Forward Spot Projection */}
        {isLit && (
          <spotLight
            color="#FFA726"
            intensity={5}
            distance={10}
            angle={0.45}
            penumbra={0.6}
            position={[-0.03, 0, 0]}
            target-position={[-4, -0.3, 0]}
          />
        )}
      </group>

      {/* Right Fog Pod */}
      <group position={[-0.93, -0.06, 0.22]}>
        {/* Die-cast black housing */}
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.045, 0.05, 0.04, 24]} />
          <meshStandardMaterial color="#111214" roughness={0.7} metalness={0.8} />
        </mesh>
        {/* Amber / Warm Lens */}
        <mesh position={[-0.021, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <circleGeometry args={[0.042, 24]} />
          <meshBasicMaterial color={isLit ? '#FFB800' : '#4A3B12'} />
        </mesh>
        {/* Steel Mounting Bracket */}
        <mesh position={[0.02, -0.03, 0]}>
          <boxGeometry args={[0.02, 0.05, 0.02]} />
          <meshStandardMaterial color="#1E2024" metalness={0.9} roughness={0.3} />
        </mesh>
        {/* Forward Spot Projection */}
        {isLit && (
          <spotLight
            color="#FFA726"
            intensity={5}
            distance={10}
            angle={0.45}
            penumbra={0.6}
            position={[-0.03, 0, 0]}
            target-position={[-4, -0.3, 0]}
          />
        )}
      </group>
    </group>
  );
}

// 3D Roof-Mounted High-Power LED Light Bar (Mahindra Thar 4x4)
function RoofLightBar({ active, headlights }) {
  if (!active) return null;
  const isLit = headlights;

  return (
    <group position={[-0.24, 0.38, 0]}>
      {/* Matte Black Extruded Aluminum Light Bar Housing */}
      <mesh castShadow>
        <boxGeometry args={[0.04, 0.035, 0.68]} />
        <meshStandardMaterial color="#121315" roughness={0.65} metalness={0.7} />
      </mesh>

      {/* Mounting Brackets (Left & Right) */}
      <mesh position={[0.01, -0.03, -0.32]}>
        <boxGeometry args={[0.04, 0.04, 0.02]} />
        <meshStandardMaterial color="#1A1B1E" roughness={0.5} metalness={0.8} />
      </mesh>
      <mesh position={[0.01, -0.03, 0.32]}>
        <boxGeometry args={[0.04, 0.04, 0.02]} />
        <meshStandardMaterial color="#1A1B1E" roughness={0.5} metalness={0.8} />
      </mesh>

      {/* Front Glowing LED Projectors (5 lenses) */}
      {[-0.24, -0.12, 0, 0.12, 0.24].map((zPos, idx) => (
        <mesh key={idx} position={[-0.021, 0, zPos]}>
          <circleGeometry args={[0.014, 16]} rotation={[0, -Math.PI / 2, 0]} />
          <meshBasicMaterial color={isLit ? '#E0F2FE' : '#334155'} />
        </mesh>
      ))}

      {/* High-Power Forward Illuminating Spotlights */}
      {isLit && (
        <>
          <spotLight
            color="#F0F9FF"
            intensity={6}
            distance={14}
            angle={0.5}
            penumbra={0.5}
            position={[-0.05, 0, -0.15]}
            target-position={[-6, -0.4, -0.15]}
          />
          <spotLight
            color="#F0F9FF"
            intensity={6}
            distance={14}
            angle={0.5}
            penumbra={0.5}
            position={[-0.05, 0, 0.15]}
            target-position={[-6, -0.4, 0.15]}
          />
        </>
      )}
    </group>
  );
}

// 3D Car Vehicle Mesh Node
function VehicleShowroom({
  carModel,
  carColor,
  hoodColor = 'match',
  roofColor = '#17181A',
  wheelType = 'at_black',
  bumperLights = true,
  roofLights = true,
  headlights = true,
  underglow = true,
  autoRotate = true,
  liftActive = false,
  subwooferActive = true,
}) {
  const groupRef = useRef();
  const baseUrl = import.meta.env.BASE_URL || '/';

  const ferrariGLTF = useGLTF(`${baseUrl}models/ferrari.glb`);
  const tharGLTF = useGLTF(`${baseUrl}models/thar.glb`);

  const ferrariScene = useMemo(() => ferrariGLTF.scene.clone(true), [ferrariGLTF.scene]);
  const tharScene = useMemo(() => tharGLTF.scene.clone(true), [tharGLTF.scene]);

  // 1. Luxury PBR Metallic Body Paint (Ferrari or Thar body panels)
  const paintMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(carColor),
        metalness: 0.85,
        roughness: 0.22,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
        reflectivity: 0.95,
      }),
    [carColor]
  );

  // 2. Hood / Bonnet Material (Match body or custom Carbon Black / Bronze / Desert Tan)
  const effectiveHoodColor = hoodColor === 'match' ? carColor : hoodColor;
  const hoodMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(effectiveHoodColor),
        metalness: hoodColor === '#141517' ? 0.35 : 0.85,
        roughness: hoodColor === '#141517' ? 0.65 : 0.25,
        clearcoat: hoodColor === '#141517' ? 0.35 : 0.95,
      }),
    [effectiveHoodColor, hoodColor]
  );

  // 3. Hardtop Roof Material (Rugged Matte Black or custom match / safari)
  const effectiveRoofColor = roofColor === 'match' ? carColor : roofColor;
  const roofMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(effectiveRoofColor),
        roughness: roofColor === '#17181A' ? 0.88 : 0.38,
        metalness: roofColor === '#17181A' ? 0.15 : 0.65,
      }),
    [effectiveRoofColor, roofColor]
  );

  // 4. Tinted Automotive Glass
  const glassMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#0A0E17'),
        metalness: 0.15,
        roughness: 0.05,
        transmission: 0.85,
        transparent: true,
        opacity: 0.75,
      }),
    []
  );

  // 5. Wheels & Tyres Material
  const wheelMat = useMemo(() => {
    let rimHex = '#161719';
    let roughness = 0.85;
    let metalness = 0.25;

    if (wheelType === 'dakar_bronze') {
      rimHex = '#4A3B22';
      roughness = 0.55;
      metalness = 0.7;
    } else if (wheelType === 'silver_alloy') {
      rimHex = '#8A929E';
      roughness = 0.45;
      metalness = 0.85;
    }

    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(rimHex),
      roughness,
      metalness,
    });
  }, [wheelType]);

  // 6. Rugged Bumpers & 7-Slot Grille
  const bumperMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#141416'),
        roughness: 0.82,
        metalness: 0.2,
      }),
    []
  );

  // Headlight Glow Material
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

  // Apply discrete materials to Thar model with 6-group spatial partitioning
  useEffect(() => {
    tharScene.traverse((child) => {
      if (child.isMesh && child.geometry) {
        const geo = child.geometry;
        if (!geo.attributes.normal) {
          geo.computeVertexNormals();
        }

        const pos = geo.attributes.position.array;
        const idx = geo.index ? geo.index.array : null;

        if (idx && !child.userData.partitioned) {
          child.userData.partitioned = true;

          const g0 = [], g1 = [], g2 = [], g3 = [], g4 = [], g5 = [];

          for (let i = 0; i < idx.length; i += 3) {
            const i1 = idx[i], i2 = idx[i + 1], i3 = idx[i + 2];
            const cx = (pos[i1 * 3] + pos[i2 * 3] + pos[i3 * 3]) / 3;
            const cy = (pos[i1 * 3 + 1] + pos[i2 * 3 + 1] + pos[i3 * 3 + 1]) / 3;
            const cz = (pos[i1 * 3 + 2] + pos[i2 * 3 + 2] + pos[i3 * 3 + 2]) / 3;

            if (cy < -0.16) {
              g4.push(i1, i2, i3); // 4: Wheels & tyres
            } else if (cy > 0.28 && cx > -0.25 && cx < 0.78) {
              g2.push(i1, i2, i3); // 2: Roof / hardtop
            } else if (cx >= -0.82 && cx <= -0.32 && cy >= 0.08 && cy <= 0.26 && Math.abs(cz) <= 0.36) {
              g1.push(i1, i2, i3); // 1: Hood / Bonnet
            } else if (cy > 0.08 && cy <= 0.28 && cx > -0.3 && cx < 0.75 && Math.abs(cz) > 0.35) {
              g3.push(i1, i2, i3); // 3: Side windows
            } else if (cy > 0.06 && cy <= 0.28 && cx >= -0.35 && cx <= -0.15 && Math.abs(cz) < 0.4) {
              g3.push(i1, i2, i3); // 3: Windshield
            } else if (cx < -0.82 || (cx > 0.88 && cy < 0.1)) {
              g5.push(i1, i2, i3); // 5: Bumpers & grille
            } else {
              g0.push(i1, i2, i3); // 0: Main Body panels
            }
          }

          const sorted = new Uint32Array(idx.length);
          let offset = 0;

          sorted.set(g0, offset); geo.addGroup(offset, g0.length, 0); offset += g0.length;
          sorted.set(g1, offset); geo.addGroup(offset, g1.length, 1); offset += g1.length;
          sorted.set(g2, offset); geo.addGroup(offset, g2.length, 2); offset += g2.length;
          sorted.set(g3, offset); geo.addGroup(offset, g3.length, 3); offset += g3.length;
          sorted.set(g4, offset); geo.addGroup(offset, g4.length, 4); offset += g4.length;
          sorted.set(g5, offset); geo.addGroup(offset, g5.length, 5); offset += g5.length;

          geo.setIndex(new THREE.BufferAttribute(sorted, 1));
        }

        child.material = [paintMat, hoodMat, roofMat, glassMat, wheelMat, bumperMat];
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [tharScene, paintMat, hoodMat, roofMat, glassMat, wheelMat, bumperMat]);

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
            {/* Front Bumper Rally Fog Pods */}
            <BumperFogPods active={bumperLights} headlights={headlights} />
            {/* Roof-Mounted Off-Road Light Bar */}
            <RoofLightBar active={roofLights} headlights={headlights} />
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
            color={carColor}
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
  hoodColor = 'match', setHoodColor,
  roofColor = '#17181A', setRoofColor,
  wheelType = 'at_black', setWheelType,
  bumperLights = true, setBumperLights,
  roofLights = true, setRoofLights,
  underglow, setUnderglow,
  headlights, setHeadlights,
  autoRotate, setAutoRotate,
  liftActive, setLiftActive,
  subwooferActive, setSubwooferActive,
  onOpenBooking,
}) {
  const [toolbarOpen, setToolbarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('body'); // 'body' | 'hood' | 'roof' | 'wheels' | 'equipment'

  const bodyColors = [
    { name: 'Factory Rosso Red', hex: '#D32F2F' },
    { name: 'Desert Sand (Thar)', hex: '#C2A382' },
    { name: 'Obsidian Matte Black', hex: '#111215' },
    { name: 'Army Camo Green', hex: '#2A3D2A' },
    { name: 'Forged Monaco Gold', hex: '#D4AF37' },
    { name: 'Glacier Pearl White', hex: '#F1F5F9' },
    { name: 'Riviera Electric Blue', hex: '#0284C7' },
  ];

  const hoodOptions = [
    { id: 'match', name: 'Match Body Paint', hex: carColor },
    { id: '#141517', name: 'Matte Carbon Black', hex: '#141517' },
    { id: '#453825', name: 'Dakar Satin Bronze', hex: '#453825' },
    { id: '#C2A382', name: 'Desert Sand Contrast', hex: '#C2A382' },
  ];

  const roofOptions = [
    { id: '#17181A', name: 'Factory Rugged Black', hex: '#17181A' },
    { id: 'match', name: 'Match Body Paint', hex: carColor },
    { id: '#F1F5F9', name: 'Glacier White Safari', hex: '#F1F5F9' },
    { id: '#C2A382', name: 'Desert Sand Hardtop', hex: '#C2A382' },
  ];

  const wheelOptions = [
    { id: 'at_black', name: 'All-Terrain Mud Black', sub: 'Deep vulcanized off-road rubber' },
    { id: 'dakar_bronze', name: 'Dakar Forged Bronze', sub: 'Rally beadlock alloy rims' },
    { id: 'silver_alloy', name: 'Machined Titanium Alloy', sub: 'Brushed multi-spoke face' },
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
            carColor={carColor}
            hoodColor={hoodColor}
            roofColor={roofColor}
            wheelType={wheelType}
            bumperLights={bumperLights}
            roofLights={roofLights}
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
            360° Interactive Studio • Drag to Inspect from Any Angle
          </span>
        </div>

        {/* Platform Switcher */}
        <div className="pointer-events-auto flex items-center gap-2 glass-panel p-1 rounded-xl border border-[#FF4D00]/30 shadow-lg">
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
        </div>
      </div>

      {/* Floating 3D Showroom Customizer Deck */}
      <div className="absolute bottom-6 left-6 z-30 pointer-events-auto max-w-[95vw]">
        <button
          onClick={() => setToolbarOpen(!toolbarOpen)}
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl glass-panel shadow-2xl hover:border-[#FF4D00] transition-all border border-[#FF4D00]/40 group"
        >
          <Sliders className="w-4 h-4 text-[#FF4D00]" />
          <span className="text-xs font-bold tracking-wider uppercase font-heading text-white">
            {carModel === 'thar' ? 'Thar Bespoke 4x4 Atelier Deck' : 'Ferrari Atelier Deck'}
          </span>
          <span className="w-2 h-2 rounded-full bg-[#FF4D00] animate-pulse" />
        </button>

        {toolbarOpen && (
          <div className="mt-3 p-4 sm:p-5 rounded-2xl glass-panel shadow-2xl border border-[#FF4D00]/40 w-[340px] sm:w-[420px] space-y-4 backdrop-blur-2xl bg-black/90">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-xs font-bold tracking-widest uppercase text-[#FF4D00] font-heading flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Bespoke 3D Modification Deck</span>
              </span>
              <button
                onClick={() => setToolbarOpen(false)}
                className="text-gray-400 hover:text-white text-xs px-2 py-1 rounded bg-white/5 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Customization Category Tabs (For Thar) */}
            {carModel === 'thar' && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-white/10 text-[10px] font-mono uppercase tracking-wider">
                {[
                  { id: 'body', label: 'Body Paint' },
                  { id: 'hood', label: 'Hood' },
                  { id: 'roof', label: 'Roof' },
                  { id: 'wheels', label: 'Tyres' },
                  { id: 'equipment', label: '4x4 Gear' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={`px-2.5 py-1 rounded-md transition-all shrink-0 cursor-pointer ${
                      activeTab === t.id
                        ? 'bg-[#FF4D00] text-white font-bold'
                        : 'text-gray-400 hover:text-white bg-white/5'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            )}

            {/* TAB 1: BODY PAINT */}
            {(activeTab === 'body' || carModel !== 'thar') && (
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1.5 font-mono">
                  Body Paint Color
                </label>
                <div className="flex flex-wrap gap-2">
                  {bodyColors.map((c) => (
                    <button
                      key={c.hex}
                      onClick={() => setCarColor(c.hex)}
                      title={c.name}
                      style={{ backgroundColor: c.hex }}
                      className={`w-7 h-7 rounded-full border-2 transition-all cursor-pointer ${
                        carColor === c.hex
                          ? 'border-white scale-115 shadow-[0_0_12px_rgba(255,255,255,0.7)]'
                          : 'border-transparent opacity-80 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: HOOD STYLING (Thar only) */}
            {carModel === 'thar' && activeTab === 'hood' && (
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase block font-mono">
                  Bonnet / Hood Styling
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {hoodOptions.map((h) => {
                    const isSelected = hoodColor === h.id;
                    return (
                      <button
                        key={h.id}
                        onClick={() => setHoodColor(h.id)}
                        className={`p-2 rounded-lg border text-left flex items-center gap-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#FF4D00] bg-[#FF4D00]/20 text-white font-bold'
                            : 'border-white/10 text-gray-300 hover:text-white bg-white/5'
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full shrink-0 border border-white/30"
                          style={{ backgroundColor: h.hex }}
                        />
                        <span className="text-[10px] font-mono leading-tight">{h.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: ROOF / HARDTOP (Thar only) */}
            {carModel === 'thar' && activeTab === 'roof' && (
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase block font-mono">
                  Hardtop Roof Styling
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {roofOptions.map((r) => {
                    const isSelected = roofColor === r.id;
                    return (
                      <button
                        key={r.id}
                        onClick={() => setRoofColor(r.id)}
                        className={`p-2 rounded-lg border text-left flex items-center gap-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#FF4D00] bg-[#FF4D00]/20 text-white font-bold'
                            : 'border-white/10 text-gray-300 hover:text-white bg-white/5'
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full shrink-0 border border-white/30"
                          style={{ backgroundColor: r.hex }}
                        />
                        <span className="text-[10px] font-mono leading-tight">{r.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 4: TYRES & WHEELS */}
            {activeTab === 'wheels' && (
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase block font-mono">
                  Tyres & Wheel Setup
                </label>
                <div className="space-y-1.5">
                  {wheelOptions.map((w) => {
                    const isSelected = wheelType === w.id;
                    return (
                      <button
                        key={w.id}
                        onClick={() => setWheelType(w.id)}
                        className={`w-full p-2.5 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#FF4D00] bg-[#FF4D00]/20 text-white font-bold'
                            : 'border-white/10 text-gray-300 hover:text-white bg-white/5'
                        }`}
                      >
                        <div>
                          <div className="text-[11px] font-mono">{w.name}</div>
                          <div className="text-[9px] text-gray-400">{w.sub}</div>
                        </div>
                        {isSelected && <CheckCircle className="w-4 h-4 text-[#FF4D00]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 5: 4x4 OFF-ROAD EQUIPMENT & LIGHTS */}
            {activeTab === 'equipment' && (
              <div className="space-y-2.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase block font-mono">
                  Auxiliary Off-Road Gear & Lighting
                </label>

                {/* Extra Bumper Lights Toggle */}
                {carModel === 'thar' && (
                  <div className="flex items-center justify-between text-xs bg-white/5 p-2 rounded-lg">
                    <div>
                      <div className="text-gray-200 font-heading uppercase text-[11px]">Front Bumper Rally Pods</div>
                      <div className="text-[9px] text-gray-400">Twin high-intensity amber auxiliary fog lamps</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={bumperLights}
                      onChange={(e) => setBumperLights(e.target.checked)}
                      className="accent-[#FF4D00] w-4 h-4 cursor-pointer"
                    />
                  </div>
                )}

                {/* Extra Roof Lights Toggle */}
                {carModel === 'thar' && (
                  <div className="flex items-center justify-between text-xs bg-white/5 p-2 rounded-lg">
                    <div>
                      <div className="text-gray-200 font-heading uppercase text-[11px]">Roof-Mounted Light Bar</div>
                      <div className="text-[9px] text-gray-400">Aerodynamic 5-lens high-output trail projector</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={roofLights}
                      onChange={(e) => setRoofLights(e.target.checked)}
                      className="accent-[#FF4D00] w-4 h-4 cursor-pointer"
                    />
                  </div>
                )}

                {/* Neon Underglow Kit */}
                <div className="flex items-center justify-between text-xs bg-white/5 p-2 rounded-lg">
                  <span className="text-gray-300 font-heading uppercase text-[11px]">Neon Underglow Kit</span>
                  <input
                    type="checkbox"
                    checked={underglow}
                    onChange={(e) => setUnderglow(e.target.checked)}
                    className="accent-[#FF4D00] w-4 h-4 cursor-pointer"
                  />
                </div>

                {/* Projector Headlights */}
                <div className="flex items-center justify-between text-xs bg-white/5 p-2 rounded-lg">
                  <span className="text-gray-300 font-heading uppercase text-[11px]">Projector Headlights</span>
                  <input
                    type="checkbox"
                    checked={headlights}
                    onChange={(e) => setHeadlights(e.target.checked)}
                    className="accent-[#FF4D00] w-4 h-4 cursor-pointer"
                  />
                </div>

                {/* Turntable 360 */}
                <div className="flex items-center justify-between text-xs bg-white/5 p-2 rounded-lg">
                  <span className="text-gray-300 font-heading uppercase text-[11px]">Turntable 360 Spin</span>
                  <input
                    type="checkbox"
                    checked={autoRotate}
                    onChange={(e) => setAutoRotate(e.target.checked)}
                    className="accent-[#FF4D00] w-4 h-4 cursor-pointer"
                  />
                </div>

                {/* Hydraulic Hoist Elevation */}
                <div className="flex items-center justify-between text-xs bg-white/5 p-2 rounded-lg">
                  <span className="text-gray-300 font-heading uppercase text-[11px]">Hydraulic Hoist Elevation</span>
                  <button
                    onClick={() => setLiftActive(!liftActive)}
                    className={`px-3 py-1 rounded-md text-[10px] font-mono uppercase font-bold transition-all cursor-pointer ${
                      liftActive
                        ? 'bg-blue-600 text-white shadow-[0_0_10px_rgba(37,99,235,0.7)]'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {liftActive ? 'Lower' : 'Elevate'}
                  </button>
                </div>
              </div>
            )}

            {/* Quick General Toggles (Visible across tabs) */}
            {activeTab !== 'equipment' && (
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono">
                <button
                  onClick={() => setHeadlights(!headlights)}
                  className={`px-2.5 py-1 rounded border transition-all cursor-pointer ${
                    headlights ? 'border-[#FF4D00] text-[#FF4D00]' : 'border-white/10 text-gray-400'
                  }`}
                >
                  💡 Lights: {headlights ? 'ON' : 'OFF'}
                </button>
                <button
                  onClick={() => setUnderglow(!underglow)}
                  className={`px-2.5 py-1 rounded border transition-all cursor-pointer ${
                    underglow ? 'border-[#FF4D00] text-[#FF4D00]' : 'border-white/10 text-gray-400'
                  }`}
                >
                  ✨ Glow: {underglow ? 'ON' : 'OFF'}
                </button>
                <button
                  onClick={() => setAutoRotate(!autoRotate)}
                  className={`px-2.5 py-1 rounded border transition-all cursor-pointer ${
                    autoRotate ? 'border-[#FF4D00] text-[#FF4D00]' : 'border-white/10 text-gray-400'
                  }`}
                >
                  🔄 Spin: {autoRotate ? 'ON' : 'OFF'}
                </button>
              </div>
            )}

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
