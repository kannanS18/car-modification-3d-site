import React, { Suspense, useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Html, useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';
import {
  RotateCw,
  Eye,
  Sun,
  Moon,
  Layers,
  Sparkles,
  ArrowLeft,
  CheckCircle,
  Maximize2,
  Box,
  Compass,
} from 'lucide-react';
import {
  UserWheelAssembly,
  UserRimNode,
  UserTyreNode,
  MaxxisBimbraJTIWheel,
  FuelContraRedWheel,
  MethodBronzeKO2Wheel,
  TharOEMDiamondWheel,
} from '../3d/HighDefCustomParts';

// Camera Auto-Focuser based on selected model category
function CameraController({ category }) {
  const { camera } = useThree();

  useEffect(() => {
    if (category === 'Wheels & Tyres' || category === 'User Master Models') {
      camera.position.set(0, 0, 2.3);
      camera.lookAt(0, 0, 0);
    } else {
      camera.position.set(3.2, 1.5, 3.6);
      camera.lookAt(0, 0.4, 0);
    }
  }, [category, camera]);

  return null;
}

// GLB Model Loader Node with wireframe override
function GLBModelNode({ url, scale = 1, rotation = [0, 0, 0], wireframe = false }) {
  const { scene } = useGLTF(url);
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  useMemo(() => {
    clonedScene.traverse((child) => {
      if (child.isMesh && child.material) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (Array.isArray(child.material)) {
          child.material.forEach((m) => (m.wireframe = wireframe));
        } else {
          child.material.wireframe = wireframe;
        }
      }
    });
  }, [clonedScene, wireframe]);

  return (
    <Center>
      <primitive object={clonedScene} scale={scale} rotation={rotation} />
    </Center>
  );
}

// Sandbox 3D Scene Wrapper with Turntable Spin
function SandboxStage({ activeModel, wireframe, autoRotate }) {
  const turntableRef = useRef();

  useFrame((_, delta) => {
    if (autoRotate && turntableRef.current) {
      turntableRef.current.rotation.y += delta * 0.45;
    }
  });

  const Component = activeModel.component;

  return (
    <group ref={turntableRef}>
      {Component ? (
        <Center>
          <Component wireframe={wireframe} scale={activeModel.scale || 1.0} />
        </Center>
      ) : (
        <GLBModelNode
          url={activeModel.url}
          scale={activeModel.scale || 1}
          rotation={activeModel.rotation || [0, 0, 0]}
          wireframe={wireframe}
        />
      )}

      {/* Grid Floor */}
      <gridHelper args={[12, 24, '#FF4D00', '#222']} position={[0, -0.80, 0]} />
      {/* Reflective Dark Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.81, 0]} receiveShadow>
        <planeGeometry args={[18, 18]} />
        <meshStandardMaterial color="#08090B" roughness={0.2} metalness={0.8} />
      </mesh>
    </group>
  );
}

export function ModelSandboxView({ onNavigate }) {
  const baseUrl = import.meta.env.BASE_URL || '/';

  // Catalog of Real, Accurate 3D Wheels & Vehicles
  const catalog = [
    {
      id: 'user_wheel_assembly',
      name: 'Authentic 3D Master Wheel (CAD Rim + Tread Tyre)',
      category: 'User Master Models',
      component: UserWheelAssembly,
      scale: 0.75,
      triangles: '4,329,066 tris',
      materials: 'User CAD Alloy (rim.glb) + High-Tread Off-Road Tyre (tyre1.glb)',
      description: 'Your exact 3D models combined: 763k-tri CAD rim nested precisely within 3.56M-tri physical geometric tread tyre casing.',
      badge: 'USER ASSET • 4.3M TRIS',
    },
    {
      id: 'user_rim',
      name: 'Authentic CAD Alloy Rim (rim.glb)',
      category: 'User Master Models',
      component: UserRimNode,
      scale: 0.75,
      triangles: '763,004 tris',
      materials: 'Baked PBR BaseColor + Metallic-Roughness + Normal Maps',
      description: 'Your 26.7 MB authentic CAD alloy wheel rim with multi-spoke geometry, hub nut recesses, and baked PBR textures.',
      badge: 'USER CAD RIM',
    },
    {
      id: 'user_tyre',
      name: 'Authentic 3D Off-Road Tyre (tyre1.glb)',
      category: 'User Master Models',
      component: UserTyreNode,
      scale: 0.75,
      triangles: '3,566,062 tris',
      materials: 'High-Density 3D Physical Tread Blocks & Siped Sidewalls',
      description: 'Your 85.5 MB photorealistic off-road tyre with 3.56 million triangles of real physical 3D tread geometry and vulcanized rubber finish.',
      badge: 'USER TYRE • 3.5M TRIS',
    },
    {
      id: 'maxxis_bimbra',
      name: 'Maxxis AT-980 Bravo • Bimbra JTI Beadlock',
      category: 'Wheels & Tyres',
      component: MaxxisBimbraJTIWheel,
      scale: 1.7,
      triangles: '24,680 tris',
      materials: 'Maxxis 980 White Lettering, Bimbra JTI Multi-Hole Machined Dish, Brembo Caliper',
      description: 'Maxxis Bravo AT-980 (285/60 R18) all-terrain tyre with raised white lettering, paired with Bimbra JTI round multi-hole beadlock deep-dish alloy rim.',
      badge: 'BIMBRA 4X4 SPEC',
    },
    {
      id: 'fuel_contra',
      name: 'Fuel Contra • Candy Red & Black Concave',
      category: 'Wheels & Tyres',
      component: FuelContraRedWheel,
      scale: 1.7,
      triangles: '26,820 tris',
      materials: 'Vredestein Pinza A/T, Gloss Black with Milled Candy Red Flanks, Slotted Rotor',
      description: 'Directional 10-blade swept spiral concave alloy in deep gloss black with CNC-milled candy red anodized accents on aggressive All-Terrain rubber.',
      badge: 'CONCAVE BLADE',
    },
    {
      id: 'method_bronze',
      name: 'BFGoodrich KO2 • Method Bronze Forged',
      category: 'Wheels & Tyres',
      component: MethodBronzeKO2Wheel,
      scale: 1.7,
      triangles: '22,440 tris',
      materials: 'BFGoodrich T/A KO2 Raised White Lettering, Satin Bronze Forged Dish, Black Beadlock',
      description: 'BFGoodrich All-Terrain T/A KO2 Baja Champion tyre on Method Race Wheels satin bronze 8-window forged rally alloy with black simulated beadlock.',
      badge: 'BAJA RALLY',
    },
    {
      id: 'thar_oem',
      name: 'Mahindra Thar 18" OEM Diamond-Cut • Ceat Czar',
      category: 'Wheels & Tyres',
      component: TharOEMDiamondWheel,
      scale: 1.7,
      triangles: '18,650 tris',
      materials: 'Ceat Czar A/T White Lettering, Dual-Tone Machined Silver & Obsidian Black',
      description: 'Authentic 18" Mahindra Thar factory diamond-cut alloy wheel with 5-split twin-arms, central Mahindra twin-peaks emblem, and Ceat Czar A/T rubber.',
      badge: 'FACTORY OEM',
    },
    {
      id: 'thar_split',
      name: '2024 Red Mahindra Thar SUV',
      category: 'Vehicles',
      url: `${baseUrl}models/thar_split.glb`,
      scale: 1.8,
      rotation: [0, -Math.PI / 2, 0],
      triangles: '330,268 tris',
      materials: 'PBR Body Color Texture, Detachable OEM Wheels Submesh',
      description: 'The authentic 2024 Red Mahindra Thar SUV with full textured body, grille, headlights, mirrors, and detachable OEM wheels for modular custom packages.',
      badge: 'MAIN VEHICLE',
    },
    {
      id: 'ferrari',
      name: 'Ferrari 458 GT3 Motorsport Supercar',
      category: 'Vehicles',
      url: `${baseUrl}models/ferrari.glb`,
      scale: 0.9,
      rotation: [0, 0, 0],
      triangles: '118,500 tris',
      materials: 'Body Paint, Carbon Aero Kit, Wheels, Clear Glass',
      description: 'GT3 racing spec supercar with aerodynamic carbon fiber body, center-lock racing wheels, and rear boot subwoofer installation.',
      badge: 'TRACK TUNER',
    },
  ];

  const [activeModelId, setActiveModelId] = useState('user_wheel_assembly');
  const [wireframe, setWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [lighting, setLighting] = useState('studio'); // 'studio' | 'daylight' | 'cyber'

  const activeModel = useMemo(
    () => catalog.find((m) => m.id === activeModelId) || catalog[0],
    [activeModelId]
  );

  return (
    <div className="pt-20 min-h-screen bg-[#070709] text-white font-body relative flex flex-col justify-between select-none">
      {/* Top Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full pt-4 pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('showroom')}
              className="text-xs font-mono text-gray-400 hover:text-[#FF4D00] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to 3D Showroom</span>
            </button>
            <span className="text-gray-600">/</span>
            <span className="text-xs font-mono text-[#00E5FF] font-bold">3D Model Sandbox & Wheel Inspector</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-heading font-black uppercase tracking-wider text-white mt-1">
            MAHINDRA THAR 3D WHEEL & TYRE INSPECTOR
          </h1>
          <p className="text-xs text-gray-400 font-body">
            Accurate 3D models with true-to-life rims, raised white lettering sidewalls, deep concave dishes, and PBR studio lighting.
          </p>
        </div>

        {/* Viewport Control Badges */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-all ${
              autoRotate
                ? 'border-[#00E5FF] bg-[#00E5FF]/20 text-[#00E5FF]'
                : 'border-white/10 text-gray-400 hover:text-white bg-white/5'
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
            <span>360° Spin</span>
          </button>

          <button
            onClick={() => setWireframe(!wireframe)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-all ${
              wireframe
                ? 'border-[#FF4D00] bg-[#FF4D00]/20 text-[#FF4D00]'
                : 'border-white/10 text-gray-400 hover:text-white bg-white/5'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Wireframe</span>
          </button>

          <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-white/10">
            {[
              { id: 'studio', label: 'Studio' },
              { id: 'daylight', label: 'Day' },
              { id: 'cyber', label: 'Cyber' },
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => setLighting(mode.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  lighting === mode.id
                    ? 'bg-[#FF4D00] text-white font-bold'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area: Left Catalog Sidebar + Center 3D Stage */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 py-4">
        {/* LEFT MODEL CATALOG SELECTOR */}
        <div className="lg:col-span-4 flex flex-col gap-2 max-h-[680px] overflow-y-auto pr-1">
          <div className="text-[11px] font-mono uppercase tracking-widest text-gray-400 mb-1 font-bold">
            AVAILABLE 3D WHEELS & TYRES ({catalog.length}):
          </div>

          {catalog.map((m) => {
            const isSelected = activeModelId === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setActiveModelId(m.id)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#FF4D00] bg-gradient-to-r from-[#FF4D00]/25 to-black/80 shadow-[0_0_15px_rgba(255,77,0,0.4)]'
                    : 'border-white/10 hover:border-white/25 bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#00E5FF] uppercase font-bold">
                    {m.category}
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-gray-300">
                    {m.badge}
                  </span>
                </div>
                <div className="text-xs font-mono font-bold text-white mt-1">
                  {m.name}
                </div>
                <div className="text-[10px] text-gray-400 mt-1 line-clamp-2">
                  {m.description}
                </div>
                <div className="mt-2 pt-1.5 border-t border-white/10 flex items-center justify-between text-[9px] font-mono text-gray-400">
                  <span>{m.triangles}</span>
                  {isSelected && <span className="text-[#FF4D00] font-bold">INSPECTING IN 3D ✓</span>}
                </div>
              </button>
            );
          })}
        </div>

        {/* CENTER 3D VIEWPORT CANVAS */}
        <div className="lg:col-span-8 flex flex-col gap-3">
          <div className="relative w-full h-[520px] sm:h-[580px] rounded-2xl overflow-hidden border-2 border-white/10 bg-[#0B0C0E] shadow-2xl">
            {/* 3D WebGL Canvas */}
            <Canvas
              shadows
              camera={{ position: [0, 0, 1.35], fov: 42 }}
              gl={{ antialias: true, alpha: true }}
            >
              <Suspense
                fallback={
                  <Html center>
                    <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-black/90 border border-[#FF4D00]/40 text-xs font-mono text-[#FF4D00]">
                      <div className="w-8 h-8 border-2 border-[#FF4D00] border-t-transparent rounded-full animate-spin" />
                      <span>INITIALIZING 3D ASSET...</span>
                    </div>
                  </Html>
                }
              >
                <CameraController category={activeModel.category} />

                {/* Studio Lighting Presets */}
                {lighting === 'studio' && (
                  <>
                    <Environment preset="night" environmentIntensity={0.8} />
                    <ambientLight intensity={1.3} />
                    {/* Front Key Light directly onto the rim face */}
                    <directionalLight position={[2.5, 3.5, 4.5]} intensity={3.5} castShadow />
                    {/* Soft Fill Light from opposite side */}
                    <directionalLight position={[-3.5, 1.5, 3.5]} intensity={2.0} color="#D1D5DB" />
                    {/* Top / Rim Light */}
                    <directionalLight position={[0, 4.5, -2.5]} intensity={2.2} color="#FFFFFF" />
                    {/* Direct Center Specular Point Light for metallic rim highlights */}
                    <pointLight position={[0, 0, 2.0]} intensity={3.0} distance={8} color="#FFFFFF" />
                  </>
                )}
                {lighting === 'daylight' && (
                  <>
                    <Environment preset="city" environmentIntensity={1.2} />
                    <ambientLight intensity={1.5} />
                    <directionalLight position={[5, 10, 5]} intensity={4.0} castShadow />
                    <directionalLight position={[-4, -1, 3]} intensity={2.0} color="#93C5FD" />
                  </>
                )}
                {lighting === 'cyber' && (
                  <>
                    <Environment preset="night" environmentIntensity={0.6} />
                    <ambientLight intensity={0.7} />
                    <pointLight color="#00E5FF" intensity={7} distance={10} position={[-2.5, 2.5, 2]} />
                    <pointLight color="#FF4D00" intensity={7} distance={10} position={[2.5, 2.5, 2]} />
                    <directionalLight position={[0, 4, 3]} intensity={2.5} color="#FFF" />
                  </>
                )}

                <SandboxStage
                  activeModel={activeModel}
                  wireframe={wireframe}
                  autoRotate={autoRotate}
                />

                <OrbitControls
                  makeDefault
                  enablePan={true}
                  minDistance={0.35}
                  maxDistance={12}
                  dampingFactor={0.05}
                />
              </Suspense>
            </Canvas>

            {/* In-Canvas Model Badge Overlay */}
            <div className="absolute top-4 left-4 glass-panel px-3 py-1.5 rounded-xl border border-white/10 bg-black/75 backdrop-blur-md font-mono text-left pointer-events-none">
              <div className="text-[10px] text-[#00E5FF] font-bold">{activeModel.category}</div>
              <div className="text-xs font-bold text-white uppercase">{activeModel.name}</div>
            </div>

            {/* Bottom Mouse Controls Legend */}
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[10px] font-mono text-gray-400 glass-panel px-3 py-1 rounded-lg border border-white/10 bg-black/70 backdrop-blur-md pointer-events-none">
              <span><strong className="text-white">[L-CLICK + DRAG]</strong> Rotate 360°</span>
              <span><strong className="text-[#FF4D00]">[SCROLL]</strong> Zoom</span>
              <span><strong className="text-[#00E5FF]">[R-CLICK + DRAG]</strong> Pan</span>
            </div>
          </div>

          {/* Technical Specs Bottom Panel */}
          <div className="glass-panel p-4 rounded-xl border border-white/10 bg-black/60 font-mono text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-gray-400 block text-[10px] uppercase">Engineered Geometry & PBR Materials</span>
              <span className="text-white font-bold">{activeModel.materials}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] px-2.5 py-1 rounded bg-[#FF4D00]/20 text-[#FF4D00] border border-[#FF4D00]/40 font-bold">
                {activeModel.triangles}
              </span>
              <button
                onClick={() => onNavigate('showroom')}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#FF4D00] to-[#E03B00] text-white text-xs font-heading font-extrabold uppercase shadow-[0_0_15px_rgba(255,77,0,0.5)] hover:shadow-[0_0_20px_rgba(255,77,0,0.8)] transition-all cursor-pointer"
              >
                Mount on Thar 4x4 →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
