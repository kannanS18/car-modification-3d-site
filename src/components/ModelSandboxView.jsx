import React, { Suspense, useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
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

// Standalone 3D Custom Wheels for direct sandbox inspection
function StandaloneCustomWheel({ type, wireframe }) {
  const isBronze = type === 'dakar_bronze';
  const isTitanium = type === 'titanium_spider';

  const rimColor = isBronze ? '#8C6832' : isTitanium ? '#A0ABBA' : '#141517';
  const rimMetalness = isBronze ? 0.85 : isTitanium ? 0.95 : 0.75;
  const rimRoughness = isBronze ? 0.32 : isTitanium ? 0.20 : 0.45;
  const beadlockColor = isBronze ? '#1F2024' : isTitanium ? '#E2E8F0' : '#DC2626';

  return (
    <group scale={1.8}>
      {/* Main Vulcanized Rubber Tyre */}
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.163, 0.163, 0.098, 36]} />
        <meshStandardMaterial
          color="#131416"
          roughness={0.92}
          metalness={0.02}
          wireframe={wireframe}
        />
      </mesh>

      {/* Sidewall Shoulders */}
      {[-0.038, 0.038].map((zPos, zi) => (
        <mesh key={zi} position={[0, 0, zPos]}>
          <torusGeometry args={[0.136, 0.027, 16, 36]} />
          <meshStandardMaterial
            color="#16171A"
            roughness={0.88}
            metalness={0.05}
            wireframe={wireframe}
          />
        </mesh>
      ))}

      {/* 3D Knobby Lugs */}
      {!isTitanium &&
        Array.from({ length: 20 }).map((_, li) => {
          const ang = (li / 20) * Math.PI * 2;
          return (
            <mesh
              key={li}
              position={[Math.cos(ang) * 0.162, Math.sin(ang) * 0.162, 0]}
              rotation={[0, 0, ang]}
              castShadow
            >
              <boxGeometry args={[0.015, 0.009, 0.088]} />
              <meshStandardMaterial
                color="#111214"
                roughness={0.95}
                metalness={0.01}
                wireframe={wireframe}
              />
            </mesh>
          );
        })}

      {/* Inset Deep-Dish Rim Barrel */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.104, 0.104, 0.088, 36, 1, true]} />
        <meshStandardMaterial
          color={rimColor}
          roughness={rimRoughness}
          metalness={rimMetalness}
          wireframe={wireframe}
        />
      </mesh>

      {/* Outer Rim Lip */}
      <mesh position={[0, 0, 0.046]}>
        <ringGeometry args={[0.096, 0.106, 36]} />
        <meshStandardMaterial
          color={beadlockColor}
          roughness={0.25}
          metalness={0.9}
          wireframe={wireframe}
        />
      </mesh>

      {/* 16 Beadlock Allen Screws */}
      {Array.from({ length: 16 }).map((_, bi) => {
        const bAng = (bi / 16) * Math.PI * 2;
        return (
          <mesh key={bi} position={[Math.cos(bAng) * 0.101, Math.sin(bAng) * 0.101, 0.048]}>
            <circleGeometry args={[0.0032, 6]} />
            <meshStandardMaterial
              color="#E2E8F0"
              roughness={0.2}
              metalness={0.95}
              wireframe={wireframe}
            />
          </mesh>
        );
      })}

      {/* Spokes */}
      {isBronze ? (
        /* Dakar 8-Window Rally Dish */
        Array.from({ length: 8 }).map((_, si) => {
          const sAng = (si / 8) * Math.PI * 2;
          return (
            <group key={si} position={[0, 0, 0.038]} rotation={[0, 0, sAng]}>
              <mesh position={[0, 0.052, 0]}>
                <boxGeometry args={[0.024, 0.068, 0.010]} />
                <meshStandardMaterial
                  color={rimColor}
                  roughness={rimRoughness}
                  metalness={rimMetalness}
                  wireframe={wireframe}
                />
              </mesh>
            </group>
          );
        })
      ) : isTitanium ? (
        /* 10-Spoke Directional Sport Alloy */
        Array.from({ length: 10 }).map((_, si) => {
          const sAng = (si / 10) * Math.PI * 2;
          return (
            <group key={si} position={[0, 0, 0.040]} rotation={[0, 0, sAng + 0.1]}>
              <mesh position={[0, 0.055, 0]}>
                <boxGeometry args={[0.014, 0.072, 0.008]} />
                <meshStandardMaterial
                  color={rimColor}
                  roughness={rimRoughness}
                  metalness={rimMetalness}
                  wireframe={wireframe}
                />
              </mesh>
            </group>
          );
        })
      ) : (
        /* BFG Method Beadlock 5-Spoke Star */
        Array.from({ length: 5 }).map((_, si) => {
          const sAng = (si / 5) * Math.PI * 2;
          return (
            <group key={si} position={[0, 0, 0.039]} rotation={[0, 0, sAng]}>
              <mesh position={[0, 0.050, 0]}>
                <boxGeometry args={[0.028, 0.068, 0.012]} />
                <meshStandardMaterial
                  color={rimColor}
                  roughness={rimRoughness}
                  metalness={rimMetalness}
                  wireframe={wireframe}
                />
              </mesh>
            </group>
          );
        })
      )}

      {/* Center Hub & 5 Hex Lug Nuts */}
      <mesh position={[0, 0, 0.042]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.028, 0.028, 0.014, 24]} />
        <meshStandardMaterial
          color="#0E1013"
          roughness={0.4}
          metalness={0.7}
          wireframe={wireframe}
        />
      </mesh>
      {Array.from({ length: 5 }).map((_, ni) => {
        const nAng = (ni / 5) * Math.PI * 2;
        return (
          <mesh key={ni} position={[Math.cos(nAng) * 0.018, Math.sin(nAng) * 0.018, 0.046]}>
            <circleGeometry args={[0.0035, 6]} />
            <meshStandardMaterial
              color="#D4D4D8"
              roughness={0.2}
              metalness={0.95}
              wireframe={wireframe}
            />
          </mesh>
        );
      })}

      {/* Slotted Ventilated Steel Brake Rotor & Red Brembo Caliper */}
      <group position={[0, 0, -0.016]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.082, 0.082, 0.006, 32]} />
          <meshStandardMaterial
            color="#94A3B8"
            roughness={0.25}
            metalness={0.95}
            wireframe={wireframe}
          />
        </mesh>
        <mesh position={[0.052, 0.052, 0]}>
          <boxGeometry args={[0.042, 0.048, 0.022]} />
          <meshStandardMaterial
            color="#E11D48"
            roughness={0.2}
            metalness={0.5}
            wireframe={wireframe}
          />
        </mesh>
      </group>
    </group>
  );
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
function SandboxStage({ activeModel, wireframe, autoRotate, lighting }) {
  const turntableRef = useRef();

  useFrame((_, delta) => {
    if (autoRotate && turntableRef.current) {
      turntableRef.current.rotation.y += delta * 0.45;
    }
  });

  return (
    <group ref={turntableRef}>
      {activeModel.isCustomWheel ? (
        <Center>
          <StandaloneCustomWheel type={activeModel.wheelType} wireframe={wireframe} />
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

  // Catalog of ALL 3D Models in the project
  const catalog = [
    {
      id: 'wheel_offroad',
      name: '3D Off-Road Tyre & Stamped Rim (Standalone)',
      category: 'Wheels & Tyres',
      url: `${baseUrl}models/wheel_offroad.glb`,
      scale: 0.012,
      rotation: [0, 0, 0],
      triangles: '976 tris',
      materials: 'wp_tire_offroad, RO3_Stamped',
      description: 'Authentic 3D knobby off-road tyre with stamped steel rim, normal maps, and PBR textures extracted from Thar 4x4.',
      badge: 'STANDALONE 3D',
    },
    {
      id: 'wheel_thar_stock',
      name: '3D Factory OEM Diamond-Cut Wheel (Standalone)',
      category: 'Wheels & Tyres',
      url: `${baseUrl}models/wheel_thar_stock.glb`,
      scale: 2.2,
      rotation: [0, 0, 0],
      triangles: '27,113 tris',
      materials: 'Factory Diamond-Cut PBR Texture',
      description: 'Factory stock Mahindra Thar 18" diamond-cut alloy wheel with Bridgestone Dueler all-season rubber extracted directly at origin.',
      badge: 'STOCK OEM',
    },
    {
      id: 'custom_bfg_ko2',
      name: 'BFGoodrich KO2 + Method Beadlock (3D Model)',
      category: 'Wheels & Tyres',
      isCustomWheel: true,
      wheelType: 'bfg_ko2',
      triangles: '2,480 tris',
      materials: 'Vulcanized Rubber, Matte Black Dish, Red Anodized Beadlock',
      description: 'Deep-dish satin black beadlock rim with red locking ring, 16 allen bolts, 20 radial knobby lugs, slotted rotor, and red Brembo caliper.',
      badge: '99% TRACTION',
    },
    {
      id: 'custom_dakar_bronze',
      name: 'Dakar Forged Bronze Rally Wheel (3D Model)',
      category: 'Wheels & Tyres',
      isCustomWheel: true,
      wheelType: 'dakar_bronze',
      triangles: '2,160 tris',
      materials: 'Satin Bronze Forged Alloy, Black Beadlock Ring',
      description: 'Deep-dish satin bronze forged rally wheel with 8-window rally dish, black beadlock ring, and heavy-duty 3-ply all-terrain rubber.',
      badge: '94% TRACTION',
    },
    {
      id: 'custom_titanium_spider',
      name: 'Titanium 10-Spoke Concave Sport Wheel (3D Model)',
      category: 'Wheels & Tyres',
      isCustomWheel: true,
      wheelType: 'titanium_spider',
      triangles: '1,980 tris',
      materials: 'Machined Titanium 95% Metalness, Silver Machined Lip',
      description: 'Directional 10-spoke motorsport concave alloy wheel with low-profile high-speed performance trail rubber and ventilated brake disc.',
      badge: '88% TRACTION',
    },
    {
      id: 'thar_split',
      name: 'Mahindra Thar 4x4 (Full Textured SUV)',
      category: 'Vehicles',
      url: `${baseUrl}models/thar_split.glb`,
      scale: 1.8,
      rotation: [0, -Math.PI / 2, 0],
      triangles: '330,268 tris',
      materials: 'PBR Body Color Texture, OEM Wheels Split Submesh',
      description: 'Full photorealistic 3D model of the 2024 Red Mahindra Thar SUV with detachable OEM wheels.',
      badge: 'MAIN VEHICLE',
    },
    {
      id: 'thar_4x4',
      name: 'Mahindra Thar 4x4 (51-Part Modular Model)',
      category: 'Vehicles',
      url: `${baseUrl}models/thar_4x4.glb`,
      scale: 1.1,
      rotation: [0, 0, 0],
      triangles: '55,420 tris',
      materials: '10 Distinct Materials (Body, Roof, Interior, Glass, Lights, Suspension)',
      description: '51 modular parts with separated body, hood, roof, doors, interior, lights, and suspension for deep customization.',
      badge: '51 PARTS',
    },
    {
      id: 'ferrari',
      name: 'Ferrari 458 GT3 Motorsport Supercar',
      category: 'Vehicles',
      url: `${baseUrl}models/ferrari.glb`,
      scale: 0.9,
      rotation: [0, 0, 0],
      triangles: '118,500 tris',
      materials: 'Body Paint, Wheels, Clear Glass, Headlight LEDs',
      description: 'GT3 racing spec supercar with aerodynamic carbon fiber aero kit and racing center-lock wheels.',
      badge: 'TRACK TUNER',
    },
  ];

  const [activeModelId, setActiveModelId] = useState('wheel_offroad');
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
              onClick={() => onNavigate && onNavigate('showroom')}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono flex items-center gap-1 cursor-pointer transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Showroom</span>
            </button>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FF4D00]/20 text-[#FF4D00] border border-[#FF4D00]/40 font-bold uppercase">
              3D MODEL SANDBOX
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-heading font-black tracking-wide uppercase text-white mt-1">
            STANDALONE 3D ASSET INSPECTOR
          </h1>
          <p className="text-xs text-gray-400 font-mono">
            Inspect all 3D vehicle and wheel models individually with 360° rotation, wireframe mesh, and studio lighting.
          </p>
        </div>

        {/* View Controls Toolbar */}
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
            COLLECTED 3D MODELS ({catalog.length}):
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
              camera={{ position: [2.2, 1.2, 2.5], fov: 45 }}
              gl={{ antialias: true, alpha: true }}
            >
              <Suspense
                fallback={
                  <Html center>
                    <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-black/90 border border-[#FF4D00]/40 text-xs font-mono text-[#FF4D00]">
                      <div className="w-8 h-8 border-2 border-[#FF4D00] border-t-transparent rounded-full animate-spin" />
                      <span>LOADING 3D ASSET...</span>
                    </div>
                  </Html>
                }
              >
                {/* Lighting Presets */}
                {lighting === 'studio' && (
                  <>
                    <Environment preset="night" environmentIntensity={0.6} />
                    <ambientLight intensity={0.8} />
                    <directionalLight position={[5, 8, 5]} intensity={2.2} castShadow />
                    <directionalLight position={[-5, -2, -5]} intensity={0.9} color="#94A3B8" />
                    <pointLight position={[0, 3, 2]} intensity={1.8} color="#FFF" />
                  </>
                )}
                {lighting === 'daylight' && (
                  <>
                    <Environment preset="city" environmentIntensity={1.0} />
                    <ambientLight intensity={1.2} />
                    <directionalLight position={[6, 12, 6]} intensity={3.0} castShadow />
                  </>
                )}
                {lighting === 'cyber' && (
                  <>
                    <Environment preset="night" environmentIntensity={0.4} />
                    <ambientLight intensity={0.4} />
                    <pointLight color="#00E5FF" intensity={4} distance={10} position={[-3, 3, 2]} />
                    <pointLight color="#FF4D00" intensity={4} distance={10} position={[3, 3, -2]} />
                  </>
                )}

                <SandboxStage
                  activeModel={activeModel}
                  wireframe={wireframe}
                  autoRotate={autoRotate}
                  lighting={lighting}
                />

                <OrbitControls
                  makeDefault
                  enablePan={true}
                  minDistance={0.5}
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
              <span><strong className="text-white">[SCROLL]</strong> Zoom</span>
              <span><strong className="text-white">[R-CLICK + DRAG]</strong> Pan</span>
            </div>
          </div>

          {/* Model Technical Specs Card */}
          <div className="glass-panel p-4 rounded-xl border border-white/10 bg-black/60 font-mono text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="text-gray-400 text-[10px] uppercase">TECHNICAL METRICS:</div>
              <div className="text-white font-bold text-sm">{activeModel.name}</div>
              <div className="text-gray-400 text-[11px] mt-0.5">{activeModel.description}</div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onNavigate && onNavigate('showroom')}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF4D00] to-[#E03B00] text-white font-heading font-black text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(255,77,0,0.5)] hover:shadow-[0_0_25px_rgba(255,77,0,0.8)] cursor-pointer transition-all"
              >
                Open in Showroom Garage →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
