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
  Crosshair,
  Zap,
  Volume2,
  Award,
} from 'lucide-react';

// Browser Web Audio API Sound Synthesizer for tactile game audio feedback
const playUiSound = (type = 'click') => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.035);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } else if (type === 'tab') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(820, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.09, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } else if (type === 'toggle') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(750, ctx.currentTime + 0.06);
      gain.gain.setValueAtTime(0.07, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07);
      osc.start();
      osc.stop(ctx.currentTime + 0.07);
    }
  } catch (e) {
    // Ignore audio context errors if blocked by browser policy
  }
};

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

// Subwoofer Boot Enclosure (For Ferrari)
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

// ==========================================
// ACCURATE 3D OFF-ROAD LIGHTS & ACCESSORIES (Awaiting real 3D GLB models from catalog)
function BumperFogPods({ active, headlights }) {
  return null;
}

function RoofLightBar({ active, headlights }) {
  return null;
}

function BullBarWinch({ active }) {
  return null;
}

function RoofRack({ active }) {
  return null;
}

// 5. Custom 3D Wheels (Disabled until real 3D asset GLB models are selected)
function CustomWheelAssembly({ wheelType }) {
  return null;
}

// 3D Car Vehicle Mesh Node
function VehicleShowroom({
  carModel,
  carColor = 'original',
  wheelType = 'oem',
  bumperLights = true,
  roofLights = true,
  bullBar = true,
  roofRack = true,
  headlights = true,
  underglow = true,
  autoRotate = true,
  liftActive = false,
  subwooferActive = true,
  onSelectCategory,
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
  wheelType = 'oem', setWheelType,
  bumperLights = true, setBumperLights,
  roofLights = true, setRoofLights,
  bullBar = true, setBullBar,
  roofRack = true, setRoofRack,
  underglow, setUnderglow,
  headlights, setHeadlights,
  autoRotate, setAutoRotate,
  liftActive, setLiftActive,
  subwooferActive, setSubwooferActive,
  onOpenBooking,
}) {
  const [activeCategory, setActiveCategory] = useState('livery'); // 'livery' | 'wheels' | 'lighting' | 'armor' | 'chassis'

  // Performance Rating Scores (Dynamically calculated based on equipped mods)
  const stats = useMemo(() => {
    let traction = 78;
    if (wheelType === 'mud_beadlock') traction = 99;
    else if (wheelType === 'dakar_bronze') traction = 94;
    else if (wheelType === 'titanium_alloy') traction = 86;

    let visibility = 65;
    if (bumperLights) visibility += 18;
    if (roofLights) visibility += 17;

    let armor = 62;
    if (bullBar) armor += 20;
    if (roofRack) armor += 18;

    let clearance = liftActive ? '310 mm (+3.5")' : '226 mm (Stock)';

    return { traction, visibility, armor, clearance };
  }, [wheelType, bumperLights, roofLights, bullBar, roofRack, liftActive]);

  const colors = [
    { name: 'Factory Original Spec (Red & Black)', hex: 'original', displayHex: '#D32F2F', badge: 'OEM' },
    { name: 'Desert Sand (Thar)', hex: '#C2A382', displayHex: '#C2A382' },
    { name: 'Obsidian Stealth Black', hex: '#111215', displayHex: '#111215' },
    { name: 'Army Camo Green', hex: '#2A3D2A', displayHex: '#2A3D2A' },
    { name: 'Forged Monaco Gold', hex: '#D4AF37', displayHex: '#D4AF37' },
    { name: 'Glacier Pearl White', hex: '#F1F5F9', displayHex: '#F1F5F9' },
    { name: 'Riviera Electric Blue', hex: '#0284C7', displayHex: '#0284C7' },
  ];

  const wheelOptions = [
    { id: 'oem', name: 'Factory OEM Alloy Wheels', sub: 'Original factory textured rims & rubber', tag: 'STOCK' },
    { id: 'mud_beadlock', name: 'Stealth Black Mud-Terrain Beadlocks', sub: 'Aggressive rock-crawler lugs + functional beadlock ring', tag: 'OFFROAD 99%' },
    { id: 'dakar_bronze', name: 'Dakar Forged Bronze Rally Rims', sub: 'Deep-dish satin bronze forged wheels with black beadlock', tag: 'RALLY SPEC' },
    { id: 'titanium_alloy', name: 'Machined Titanium 10-Spoke Alloy', sub: 'Directional forged face + high-speed performance tyres', tag: 'PREMIUM' },
  ];

  const handleCategorySwitch = (cat) => {
    playUiSound('tab');
    setActiveCategory(cat);
  };

  return (
    <div id="showroom-plane" className="relative w-full h-[750px] md:h-[890px] bg-[#070709] overflow-hidden select-none border-y border-[#FF4D00]/30 font-body">
      {/* 3D WebGL Canvas */}
      <Canvas
        shadows
        camera={{ position: [3.8, 2.2, 4.6], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Suspense
          fallback={
            <Html center>
              <div className="flex flex-col items-center gap-3 p-5 rounded-2xl glass-panel shadow-2xl border border-[#FF4D00]/50 bg-black/90">
                <div className="w-10 h-10 border-3 border-[#FF4D00] border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-mono uppercase tracking-widest text-[#FF4D00] font-bold">
                  INITIALIZING GAME ENGINE 3D STUDIO...
                </span>
              </div>
            </Html>
          }
        >
          <Environment preset="night" environmentIntensity={0.65} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[6, 9, 6]} intensity={1.8} castShadow shadow-mapSize={[1024, 1024]} />
          {/* Cyber Neon Overhead Tubes */}
          <pointLight color="#00E5FF" intensity={3} distance={15} position={[-4, 5, 2]} />
          <pointLight color="#FF4D00" intensity={3} distance={15} position={[4, 5, -2]} />

          <VehicleShowroom
            carModel={carModel}
            carColor={carColor}
            wheelType={wheelType}
            bumperLights={bumperLights}
            roofLights={roofLights}
            bullBar={bullBar}
            roofRack={roofRack}
            headlights={headlights}
            underglow={underglow}
            autoRotate={autoRotate}
            liftActive={liftActive}
            subwooferActive={subwooferActive}
            onSelectCategory={handleCategorySwitch}
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

      {/* TOP GAMING HUD BAR */}
      <div className="absolute top-5 left-5 right-5 flex items-center justify-between pointer-events-none z-20">
        {/* Game Title Tag */}
        <div className="glass-panel px-4 py-2 rounded-xl border border-white/10 flex items-center gap-3 backdrop-blur-xl bg-black/70 shadow-2xl">
          <div className="w-2.5 h-2.5 rounded-full bg-[#00E5FF] animate-ping" />
          <div className="text-left font-mono">
            <div className="text-[10px] text-gray-400 uppercase tracking-widest">AUTOSPORT TUNING TERMINAL</div>
            <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <span>{carModel === 'thar' ? 'MAHINDRA THAR 4X4 ADVENTURE' : 'FERRARI 458 GT3 MOTORSPORT'}</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#FF4D00]/30 text-[#FF4D00] border border-[#FF4D00]/50 font-mono font-bold">
                TIER-4 MODS
              </span>
            </div>
          </div>
        </div>

        {/* Platform Vehicle Switcher */}
        <div className="pointer-events-auto flex items-center gap-1.5 glass-panel p-1 rounded-xl border border-[#FF4D00]/40 shadow-2xl bg-black/85">
          <button
            onClick={() => {
              playUiSound('tab');
              setCarModel('thar');
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-heading font-extrabold uppercase transition-all cursor-pointer ${
              carModel === 'thar'
                ? 'bg-gradient-to-r from-[#FF4D00] to-[#E03B00] text-white shadow-[0_0_15px_rgba(255,77,0,0.6)]'
                : 'text-gray-400 hover:text-white bg-transparent'
            }`}
          >
            🏔️ Thar 4x4
          </button>
          <button
            onClick={() => {
              playUiSound('tab');
              setCarModel('ferrari');
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-heading font-extrabold uppercase transition-all cursor-pointer ${
              carModel === 'ferrari'
                ? 'bg-gradient-to-r from-[#FF4D00] to-[#E03B00] text-white shadow-[0_0_15px_rgba(255,77,0,0.6)]'
                : 'text-gray-400 hover:text-white bg-transparent'
            }`}
          >
            🏎️ Ferrari GT3
          </button>
        </div>
      </div>

      {/* RIGHT-SIDE VIDEO GAME TUNING CONTROLLER PANEL */}
      <div className="absolute top-20 right-5 bottom-8 w-[350px] sm:w-[390px] z-30 pointer-events-auto flex flex-col justify-between">
        <div className="glass-panel p-4 sm:p-5 rounded-2xl border-2 border-[#FF4D00]/50 backdrop-blur-2xl bg-black/90 shadow-[0_0_35px_rgba(0,0,0,0.9)] flex flex-col gap-4 max-h-full overflow-y-auto">
          {/* Game HUD Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Crosshair className="w-4 h-4 text-[#FF4D00] animate-spin" style={{ animationDuration: '10s' }} />
              <span className="text-xs font-heading font-black tracking-widest uppercase text-white">
                GARAGE TUNING HUD
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold text-[#00E5FF] px-2 py-0.5 rounded bg-[#00E5FF]/10 border border-[#00E5FF]/40">
              LIVE PBR
            </span>
          </div>

          {/* DYNAMIC PERFORMANCE STAT BARS */}
          <div className="bg-black/60 p-3 rounded-xl border border-white/10 space-y-2 font-mono text-[10px]">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">TRACTION RATING:</span>
              <span className="text-[#00E5FF] font-bold">{stats.traction}% [MAX GRIP]</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-[#00E5FF] transition-all duration-300"
                style={{ width: `${stats.traction}%` }}
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-gray-400">NIGHT ILLUMINATION:</span>
              <span className="text-[#FF4D00] font-bold">{stats.visibility}% [BEAM POWER]</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-500 to-[#FF4D00] transition-all duration-300"
                style={{ width: `${stats.visibility}%` }}
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-gray-400">OVERLAND RECOVERY ARMOR:</span>
              <span className="text-emerald-400 font-bold">{stats.armor}% [OFFROAD]</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-300"
                style={{ width: `${stats.armor}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[9px] pt-1 text-gray-400 border-t border-white/10">
              <span>RIDE HEIGHT:</span>
              <span className="text-white font-bold">{stats.clearance}</span>
            </div>
          </div>

          {/* GAME CATEGORY CONTROLLER BUTTONS */}
          <div className="grid grid-cols-3 gap-1.5 text-[10px] font-heading font-extrabold uppercase">
            {[
              { id: 'livery', label: '🎨 Livery' },
              { id: 'wheels', label: '🛞 Tyres' },
              { id: 'lighting', label: '💡 Lights' },
              { id: 'armor', label: '🛡️ Armor' },
              { id: 'chassis', label: '⚙️ Hoist' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleCategorySwitch(tab.id)}
                className={`py-2 px-1 rounded-xl border text-center transition-all cursor-pointer ${
                  activeCategory === tab.id
                    ? 'border-[#FF4D00] bg-gradient-to-r from-[#FF4D00]/30 to-[#E03B00]/20 text-white shadow-[0_0_12px_rgba(255,77,0,0.4)]'
                    : 'border-white/10 text-gray-400 hover:text-white bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB CONTENT: 1. LIVERY & PAINT */}
          {activeCategory === 'livery' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase font-mono">
                  SELECT AUTOMOTIVE FINISH:
                </span>
                <span className="text-[10px] text-[#FF4D00] font-mono font-bold">
                  {colors.find((c) => c.hex === carColor)?.name || 'Custom'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {colors.map((c) => {
                  const isSelected = carColor === c.hex;
                  return (
                    <button
                      key={c.hex}
                      onClick={() => {
                        playUiSound('click');
                        setCarColor(c.hex);
                      }}
                      className={`p-2 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#FF4D00] bg-[#FF4D00]/20 text-white font-bold shadow-[0_0_10px_rgba(255,77,0,0.5)]'
                          : 'border-white/10 text-gray-300 hover:text-white bg-white/5'
                      }`}
                    >
                      <span
                        className="w-5 h-5 rounded-full shrink-0 border-2 border-white/40 shadow"
                        style={{ backgroundColor: c.displayHex }}
                      />
                      <div className="leading-tight">
                        <div className="text-[10px] font-mono font-bold truncate">{c.name}</div>
                        {c.badge && <span className="text-[8px] text-[#FF4D00] font-mono">{c.badge}</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB CONTENT: 2. WHEELS & TYRES */}
          {activeCategory === 'wheels' && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase font-mono block">
                INTERCHANGEABLE WHEEL PACKAGES:
              </span>
              <div className="space-y-2">
                {wheelOptions.map((w) => {
                  const isSelected = wheelType === w.id;
                  return (
                    <button
                      key={w.id}
                      onClick={() => {
                        playUiSound('click');
                        setWheelType(w.id);
                      }}
                      className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#FF4D00] bg-[#FF4D00]/20 text-white font-bold shadow-[0_0_12px_rgba(255,77,0,0.5)]'
                          : 'border-white/10 text-gray-300 hover:text-white bg-white/5'
                      }`}
                    >
                      <div>
                        <div className="text-[11px] font-mono font-bold flex items-center gap-1.5">
                          <span>{w.name}</span>
                          <span className="text-[8px] px-1 py-0.2 rounded bg-white/10 text-[#00E5FF]">
                            {w.tag}
                          </span>
                        </div>
                        <div className="text-[9px] text-gray-400 mt-0.5">{w.sub}</div>
                      </div>
                      {isSelected && <CheckCircle className="w-4 h-4 text-[#FF4D00] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB CONTENT: 3. LIGHTING RIGS */}
          {activeCategory === 'lighting' && (
            <div className="space-y-2.5">
              <span className="text-[10px] font-bold text-gray-400 uppercase font-mono block">
                EXTREME OFF-ROAD LIGHTING RIGS:
              </span>

              {/* Bumper Rally Pods */}
              <div className="flex items-center justify-between bg-white/5 p-2.5 rounded-xl border border-white/10">
                <div>
                  <div className="text-gray-100 font-heading uppercase text-[11px] font-bold">
                    KC HiLiTES Bumper Rally Pods
                  </div>
                  <div className="text-[9px] text-gray-400">Twin finned amber fog pods + forward spot beams</div>
                </div>
                <input
                  type="checkbox"
                  checked={bumperLights}
                  onChange={(e) => {
                    playUiSound('toggle');
                    setBumperLights(e.target.checked);
                  }}
                  className="accent-[#FF4D00] w-4 h-4 cursor-pointer"
                />
              </div>

              {/* Roof Light Bar */}
              <div className="flex items-center justify-between bg-white/5 p-2.5 rounded-xl border border-white/10">
                <div>
                  <div className="text-gray-100 font-heading uppercase text-[11px] font-bold">
                    50" Curved Windshield Light Bar
                  </div>
                  <div className="text-[9px] text-gray-400">12-projector aerodynamic high-power trail beam</div>
                </div>
                <input
                  type="checkbox"
                  checked={roofLights}
                  onChange={(e) => {
                    playUiSound('toggle');
                    setRoofLights(e.target.checked);
                  }}
                  className="accent-[#FF4D00] w-4 h-4 cursor-pointer"
                />
              </div>

              {/* Neon Chassis Underglow */}
              <div className="flex items-center justify-between bg-white/5 p-2.5 rounded-xl border border-white/10">
                <div>
                  <div className="text-gray-100 font-heading uppercase text-[11px] font-bold">
                    Neon Chassis Underglow Kit
                  </div>
                  <div className="text-[9px] text-gray-400">Multi-point LED neon glow underbody illumination</div>
                </div>
                <input
                  type="checkbox"
                  checked={underglow}
                  onChange={(e) => {
                    playUiSound('toggle');
                    setUnderglow(e.target.checked);
                  }}
                  className="accent-[#FF4D00] w-4 h-4 cursor-pointer"
                />
              </div>

              {/* Main Projector Headlights */}
              <div className="flex items-center justify-between bg-white/5 p-2.5 rounded-xl border border-white/10">
                <div>
                  <div className="text-gray-100 font-heading uppercase text-[11px] font-bold">
                    Xenon High-Beam Headlights
                  </div>
                  <div className="text-[9px] text-gray-400">Front headlights and optical driving beams</div>
                </div>
                <input
                  type="checkbox"
                  checked={headlights}
                  onChange={(e) => {
                    playUiSound('toggle');
                    setHeadlights(e.target.checked);
                  }}
                  className="accent-[#FF4D00] w-4 h-4 cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* TAB CONTENT: 4. ARMOR & 4X4 GEAR */}
          {activeCategory === 'armor' && (
            <div className="space-y-2.5">
              <span className="text-[10px] font-bold text-gray-400 uppercase font-mono block">
                HEAVY-DUTY OVERLAND EXPEDITION ARMOR:
              </span>

              {/* Bull Bar & Winch */}
              <div className="flex items-center justify-between bg-white/5 p-2.5 rounded-xl border border-white/10">
                <div>
                  <div className="text-gray-100 font-heading uppercase text-[11px] font-bold">
                    Pre-Runner Bull Bar & Winch
                  </div>
                  <div className="text-[9px] text-gray-400">Tubular steel push bar + Warn electric cable winch</div>
                </div>
                <input
                  type="checkbox"
                  checked={bullBar}
                  onChange={(e) => {
                    playUiSound('toggle');
                    setBullBar(e.target.checked);
                  }}
                  className="accent-[#FF4D00] w-4 h-4 cursor-pointer"
                />
              </div>

              {/* Roof Expedition Rack */}
              <div className="flex items-center justify-between bg-white/5 p-2.5 rounded-xl border border-white/10">
                <div>
                  <div className="text-gray-100 font-heading uppercase text-[11px] font-bold">
                    Overland Roof Basket & Sand Boards
                  </div>
                  <div className="text-[9px] text-gray-400">Steel safari rack + recovery tracks & high-lift jack</div>
                </div>
                <input
                  type="checkbox"
                  checked={roofRack}
                  onChange={(e) => {
                    playUiSound('toggle');
                    setRoofRack(e.target.checked);
                  }}
                  className="accent-[#FF4D00] w-4 h-4 cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* TAB CONTENT: 5. CHASSIS & HOIST */}
          {activeCategory === 'chassis' && (
            <div className="space-y-2.5">
              <span className="text-[10px] font-bold text-gray-400 uppercase font-mono block">
                WORKSHOP HYDRAULIC & TURNTABLE CONTROLS:
              </span>

              {/* Hydraulic Lift Hoist */}
              <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/10">
                <div>
                  <div className="text-gray-100 font-heading uppercase text-[11px] font-bold">
                    Hydraulic Hoist Lift
                  </div>
                  <div className="text-[9px] text-gray-400">Elevate chassis +0.8m for undercarriage inspection</div>
                </div>
                <button
                  onClick={() => {
                    playUiSound('toggle');
                    setLiftActive(!liftActive);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase font-bold transition-all cursor-pointer ${
                    liftActive
                      ? 'bg-blue-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.8)]'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {liftActive ? 'Lower Hoist' : 'Elevate +0.8m'}
                </button>
              </div>

              {/* Turntable 360 Spin */}
              <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/10">
                <div>
                  <div className="text-gray-100 font-heading uppercase text-[11px] font-bold">
                    360° Studio Turntable
                  </div>
                  <div className="text-[9px] text-gray-400">Continuous rotational vehicle showcase</div>
                </div>
                <input
                  type="checkbox"
                  checked={autoRotate}
                  onChange={(e) => {
                    playUiSound('toggle');
                    setAutoRotate(e.target.checked);
                  }}
                  className="accent-[#FF4D00] w-4 h-4 cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* COMMISSION CTA BUTTON */}
          <div className="pt-2 border-t border-white/10">
            <button
              onClick={() => {
                playUiSound('click');
                if (onOpenBooking) onOpenBooking();
              }}
              className="w-full py-3 rounded-xl font-heading font-black text-xs uppercase tracking-wider bg-gradient-to-r from-[#FF4D00] to-[#E03B00] text-white shadow-[0_0_25px_rgba(255,77,0,0.7)] hover:shadow-[0_0_35px_rgba(255,77,0,0.9)] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>COMMISSION THIS SPECIFICATION</span>
              <Zap className="w-4 h-4 fill-white" />
            </button>
          </div>
        </div>

        {/* BOTTOM GAMEPAD CONTROLLER HINTS */}
        <div className="mt-2 text-center text-[10px] font-mono text-gray-400 bg-black/70 px-3 py-1.5 rounded-xl border border-white/10 backdrop-blur-md">
          <span className="text-[#FF4D00] font-bold">[L-CLICK + DRAG]</span> 360° ORBIT • <span className="text-[#00E5FF] font-bold">[SCROLL]</span> ZOOM • <span className="text-yellow-400 font-bold">[HOTSPOTS]</span> 3D PINS
        </div>
      </div>

      {/* Bottom Vignette */}
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#070709] to-transparent pointer-events-none" />
    </div>
  );
}
