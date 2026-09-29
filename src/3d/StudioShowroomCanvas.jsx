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
  carColor = 'original',
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

  // Ferrari PBR Metallic Paint
  const ferrariPaintMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(carColor === 'original' ? '#FF2200' : carColor),
        metalness: 0.85,
        roughness: 0.18,
        clearcoat: 1.0,
        clearcoatRoughness: 0.04,
        reflectivity: 0.95,
      }),
    [carColor]
  );

  const ferrariWheelMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#D4AF37'),
        metalness: 0.9,
        roughness: 0.2,
      }),
    []
  );

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
          child.material = ferrariPaintMat;
        } else if (child.name.includes('rim') || child.name.includes('wheel')) {
          child.material = ferrariWheelMat;
        } else if (child.name.includes('glass') || child.material?.name?.includes('Glass')) {
          child.material = glassMat;
        } else if (child.name.includes('light') || child.name === 'leds') {
          child.material = headlightMat;
        }
      }
    });
  }, [ferrariScene, ferrariPaintMat, ferrariWheelMat, glassMat, headlightMat]);

  // Shader Uniforms for Thar Body Paint Customization (Preserves 100% of authentic textured wheels, roof, glass, and bumpers)
  const uniformsRef = useRef({
    uBodyColor: { value: new THREE.Color('#D32F2F') },
    uColorActive: { value: 0.0 },
  });

  // Dynamically update uniforms when carColor changes
  useEffect(() => {
    if (!carColor || carColor === 'original' || carColor === 'default') {
      uniformsRef.current.uColorActive.value = 0.0;
    } else {
      uniformsRef.current.uColorActive.value = 1.0;
      uniformsRef.current.uBodyColor.value.set(carColor);
    }
  }, [carColor]);

  // Apply original textured material to Thar with intelligent paint chrominance-masking shader
  useEffect(() => {
    tharScene.traverse((child) => {
      if (child.isMesh && child.material) {
        child.castShadow = true;
        child.receiveShadow = true;

        const mat = child.material;
        if (!mat.userData.customShaderAttached) {
          mat.userData.customShaderAttached = true;

          if (mat.map) {
            mat.map.anisotropy = 16;
            mat.map.needsUpdate = true;
          }

          mat.envMapIntensity = 1.35;
          mat.roughness = 0.45;
          mat.metalness = 0.55;

          mat.onBeforeCompile = (shader) => {
            shader.uniforms.uBodyColor = uniformsRef.current.uBodyColor;
            shader.uniforms.uColorActive = uniformsRef.current.uColorActive;

            shader.fragmentShader =
              'uniform vec3 uBodyColor;\nuniform float uColorActive;\n' +
              shader.fragmentShader;

            shader.fragmentShader = shader.fragmentShader.replace(
              '#include <map_fragment>',
              [
                '#ifdef USE_MAP',
                '  vec4 sampledDiffuseColor = texture2D( map, vMapUv );',
                '  #ifdef DECODE_VIDEO_TEXTURE',
                '    sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );',
                '  #endif',
                '  // Detect red body paint pixels from the texture UV unwrap',
                '  float redDominance = sampledDiffuseColor.r - max(sampledDiffuseColor.g, sampledDiffuseColor.b);',
                '  float isBodyPaint = smoothstep(0.08, 0.22, redDominance);',
                '  // Compute custom body paint color with realistic luminance preservation:',
                '  float lum = dot(sampledDiffuseColor.rgb, vec3(0.299, 0.587, 0.114));',
                '  vec3 customPaint = uBodyColor * (lum * 1.55);',
                '  // Blend: if it is body paint and colorActive > 0, apply custom paint; otherwise keep original texture untouched:',
                '  vec3 finalColor = mix(sampledDiffuseColor.rgb, mix(sampledDiffuseColor.rgb, customPaint, uColorActive), isBodyPaint);',
                '  diffuseColor *= vec4(finalColor, sampledDiffuseColor.a);',
                '#endif',
              ].join('\n')
            );
          };

          mat.needsUpdate = true;
        }
      }
    });
  }, [tharScene]);

  useFrame((state, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.35;
    }
  });

  const targetY = liftActive ? 0.8 : 0;
  const underglowColor = carColor === 'original' ? '#FF4D00' : carColor;

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
            color={underglowColor}
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
  carColor = 'original', setCarColor,
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

  const colors = [
    { name: 'Factory Original Spec (Red & Black)', hex: 'original', displayHex: '#D32F2F', badge: 'OEM' },
    { name: 'Desert Sand (Thar)', hex: '#C2A382', displayHex: '#C2A382' },
    { name: 'Obsidian Stealth Black', hex: '#111215', displayHex: '#111215' },
    { name: 'Army Camo Green', hex: '#2A3D2A', displayHex: '#2A3D2A' },
    { name: 'Forged Monaco Gold', hex: '#D4AF37', displayHex: '#D4AF37' },
    { name: 'Glacier Pearl White', hex: '#F1F5F9', displayHex: '#F1F5F9' },
    { name: 'Riviera Electric Blue', hex: '#0284C7', displayHex: '#0284C7' },
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
          <div className="mt-3 p-4 sm:p-5 rounded-2xl glass-panel shadow-2xl border border-[#FF4D00]/40 w-[340px] sm:w-[400px] space-y-4 backdrop-blur-2xl bg-black/90">
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

            {/* SECTION 1: BODY PAINT COLOR */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase font-mono">
                  Body Paint Color
                </label>
                <span className="text-[10px] text-[#FF4D00] font-mono">
                  {colors.find((c) => c.hex === carColor)?.name || 'Custom'}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {colors.map((c) => {
                  const isSelected = carColor === c.hex;
                  return (
                    <button
                      key={c.hex}
                      onClick={() => setCarColor(c.hex)}
                      title={c.name}
                      style={{ backgroundColor: c.displayHex }}
                      className={`relative w-7 h-7 rounded-full border-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-white scale-120 shadow-[0_0_14px_rgba(255,255,255,0.8)]'
                          : 'border-transparent opacity-80 hover:opacity-100 hover:scale-105'
                      }`}
                    >
                      {c.badge && (
                        <span className="absolute -top-1.5 -right-1.5 text-[8px] bg-[#FF4D00] text-white px-1 rounded-full font-bold">
                          {c.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SECTION 2: 4x4 OFF-ROAD EQUIPMENT & LIGHTING */}
            <div className="space-y-2.5 pt-2 border-t border-white/10">
              <label className="text-[10px] font-bold text-gray-400 uppercase block font-mono">
                Auxiliary 4x4 Gear & Lighting
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
