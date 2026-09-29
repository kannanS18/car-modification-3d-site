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
  TharStockOEMWheel,
  BFGoodrichKO2Wheel,
  DakarBronzeWheel,
  TitaniumSpiderWheel,
  KCHilitesBumperPods,
  CurvedRoofLightBar,
  OverlandBullBar,
} from '../3d/HighDefCustomParts';

// Camera Auto-Focuser based on selected model category
function CameraController({ category }) {
  const { camera } = useThree();
  const controlsRef = useRef();

  useEffect(() => {
    if (category === 'Wheels & Tyres') {
      camera.position.set(0, 0, 1.45);
      camera.lookAt(0, 0, 0);
    } else if (category === 'Off-Road Lights' || category === 'Armor & Recovery') {
      camera.position.set(0, 0, 1.75);
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
      <gridHelper args={[10, 20, '#FF4D00', '#222']} position={[0, -0.6, 0]} />
      {/* Reflective Dark Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.61, 0]} receiveShadow>
        <planeGeometry args={[16, 16]} />
        <meshStandardMaterial color="#08090B" roughness={0.2} metalness={0.8} />
      </mesh>
    </group>
  );
}

export function ModelSandboxView({ onNavigate }) {
  const baseUrl = import.meta.env.BASE_URL || '/';

  // Catalog of ALL 3D Models in the project (Cleaned, High-Def, No Broken Slices)
  const catalog = [
    {
      id: 'thar_oem_wheel',
      name: 'Mahindra Thar 18" Diamond-Cut Wheel',
      category: 'Wheels & Tyres',
      component: TharStockOEMWheel,
      scale: 1.15,
      triangles: '14,280 tris',
      materials: 'Machined Diamond-Cut Silver, Obsidian Metallic Flanks, Dueler Rubber',
      description: 'Factory authentic 5-split twin-spoke diamond-cut alloy with Bridgestone Dueler all-season rubber, chrome lug nuts, and ventilated brake rotor.',
      badge: 'FACTORY OEM',
    },
    {
      id: 'bfg_ko2',
      name: 'BFGoodrich T/A KO2 • Method Beadlock',
      category: 'Wheels & Tyres',
      component: BFGoodrichKO2Wheel,
      scale: 1.15,
      triangles: '21,460 tris',
      materials: 'Matte Satin Black Dish, Crimson Anodized Beadlock, 24 Chrome Hex Bolts',
      description: 'Deep-dish rock-crawler beadlock wheel with red anodized locking ring, 24 individual grade-8 bolts, aggressive 3D mud-terrain lugs, and Brembo caliper.',
      badge: '99% TRACTION',
    },
    {
      id: 'dakar_bronze',
      name: 'Dakar Rally Stage • Satin Bronze Forged',
      category: 'Wheels & Tyres',
      component: DakarBronzeWheel,
      scale: 1.15,
      triangles: '16,840 tris',
      materials: 'Forged Satin Bronze Alloy, Black Beadlock Ring, Kevlar Rubber',
      description: 'Dakar endurance 8-window rally dish forged alloy with rich metallic satin bronze finish, black outer beadlock, and 3-ply Kevlar mud lugs.',
      badge: '94% TRACTION',
    },
    {
      id: 'titanium_spider',
      name: 'Titanium 10-Spoke Concave Sport Alloy',
      category: 'Wheels & Tyres',
      component: TitaniumSpiderWheel,
      scale: 1.15,
      triangles: '18,220 tris',
      materials: 'Brushed Titanium 96% Metalness, Mirror Polished Silver Lip',
      description: 'Directional 10-spoke motorsport concave alloy in polished titanium metallic with mirror-polished silver rim lip and low-profile performance rubber.',
      badge: '88% TRACTION',
    },
    {
      id: 'kc_hilites_pods',
      name: 'KC HiLiTES Extreme Bumper Fog Pods',
      category: 'Off-Road Lights',
      component: KCHilitesBumperPods,
      scale: 1.25,
      triangles: '8,460 tris',
      materials: 'Cast Aluminum Finned Housing, Amber Fluted Glass, Stone Guards',
      description: 'Twin 6" rally off-road fog pods with rear cooling fins, chrome reflector bowls, glowing amber fluted lenses, and heavy-duty stone guard grilles.',
      badge: 'MODULAR RIG',
    },
    {
      id: 'curved_roof_light_bar',
      name: '50" Curved Windshield Trail Light Bar',
      category: 'Off-Road Lights',
      component: CurvedRoofLightBar,
      scale: 1.15,
      triangles: '12,680 tris',
      materials: 'Extruded Black Aluminum Heatsink, 40 Projector LEDs, Polycarbonate Lens',
      description: '50-inch aerodynamic curved trail light bar with dual rows of high-power projector reflectors, heatsink cooling fins, and steel A-pillar brackets.',
      badge: 'ULTRA BEAM',
    },
    {
      id: 'overland_bull_bar',
      name: 'Overland Tubular Bull Bar & Winch',
      category: 'Armor & Recovery',
      component: OverlandBullBar,
      scale: 1.15,
      triangles: '9,340 tris',
      materials: 'Powder-Coated Tubular Steel, Synthetic Winch Cable, Red Recovery Hook',
      description: 'Heavy-duty tubular front chassis armor with integrated electric winch spool, polished aluminum hawse fairlead, and forged red recovery tow hook.',
      badge: 'TRAIL ARMOR',
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

  const [activeModelId, setActiveModelId] = useState('thar_oem_wheel');
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
            <span className="text-xs font-mono text-[#00E5FF] font-bold">Model Sandbox & Asset Inspector</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-heading font-black uppercase tracking-wider text-white mt-1">
            3D MODULAR COMPONENT INSPECTOR
          </h1>
          <p className="text-xs text-gray-400 font-body">
            Inspect every precision-engineered 3D model with 360° rotation, wireframe topology, and PBR studio lighting.
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
            HIGH-DEFINITION 3D MODELS ({catalog.length}):
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
              camera={{ position: [0, 0, 1.45], fov: 42 }}
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
                    <ambientLight intensity={1.2} />
                    {/* Front Key Light directly onto the part face */}
                    <directionalLight position={[2.5, 3.5, 4.5]} intensity={3.0} castShadow />
                    {/* Soft Fill Light from opposite side to eliminate black shadows */}
                    <directionalLight position={[-3.5, 1.5, 3.5]} intensity={1.8} color="#D1D5DB" />
                    {/* Top / Rim Light to highlight tread and silhouette */}
                    <directionalLight position={[0, 4.5, -2.5]} intensity={2.0} color="#FFFFFF" />
                    {/* Direct Center Specular Point Light */}
                    <pointLight position={[0, 0, 2.2]} intensity={2.2} distance={8} color="#FFFFFF" />
                  </>
                )}
                {lighting === 'daylight' && (
                  <>
                    <Environment preset="city" environmentIntensity={1.2} />
                    <ambientLight intensity={1.4} />
                    <directionalLight position={[5, 10, 5]} intensity={3.5} castShadow />
                    <directionalLight position={[-4, -1, 3]} intensity={1.5} color="#93C5FD" />
                  </>
                )}
                {lighting === 'cyber' && (
                  <>
                    <Environment preset="night" environmentIntensity={0.6} />
                    <ambientLight intensity={0.6} />
                    <pointLight color="#00E5FF" intensity={6} distance={10} position={[-2.5, 2.5, 2]} />
                    <pointLight color="#FF4D00" intensity={6} distance={10} position={[2.5, 2.5, 2]} />
                    <directionalLight position={[0, 4, 3]} intensity={2.0} color="#FFF" />
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
                  minDistance={0.4}
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
                Mount in Showroom →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
