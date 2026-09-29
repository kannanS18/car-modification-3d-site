import React, { Suspense, useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Html, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import {
  Sliders,
  RotateCw,
  Sparkles,
  Layers,
  Sun,
  Eye,
  CheckCircle,
  Crosshair,
  Zap,
} from 'lucide-react';
import {
  UserWheelAssembly,
  UserRimNode,
  UserTyreNode,
  TharFittedWheelSet,
} from './HighDefCustomParts';

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

// Single Standalone 3D Wheel for isolated turntable preview
function SingleWheelDisplay({ wheelType }) {
  const meshRef = useRef();

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 1.1;
    }
  });

  return (
    <group ref={meshRef}>
      {(!wheelType || wheelType === 'user_custom' || wheelType === 'custom' || wheelType === 'oem') && (
        <UserWheelAssembly scale={0.21} />
      )}
      {wheelType === 'user_rim' && <UserRimNode scale={0.21 * 0.57} />}
      {wheelType === 'user_tyre' && <UserTyreNode scale={0.21} />}
    </group>
  );
}

// Mini 3D Wheel Turntable for the Customization Panel
function MiniWheelTurntable({ wheelType, onOpenSandbox }) {
  const wheelLabels = {
    user_custom: 'User Master Wheel • CAD Rim & AT Tyre (4.3M Tris)',
    user_rim: 'User Standalone CAD Rim (rim.glb • 763k Tris)',
    user_tyre: 'User Standalone Off-Road Tyre (tyre1.glb • 3.56M Tris)',
    oem: 'Original Factory Stock Wheels',
  };

  return (
    <div className="bg-gradient-to-b from-black/95 to-[#121316] p-3 rounded-xl border border-[#FF4D00]/40 shadow-xl flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse" />
          <span className="text-[10px] font-mono font-bold tracking-widest text-white uppercase">
            STANDALONE 3D WHEEL PREVIEW
          </span>
        </div>
        <span className="text-[9px] font-mono font-bold text-[#FF4D00] bg-[#FF4D00]/10 px-1.5 py-0.5 rounded border border-[#FF4D00]/30">
          360° SPIN
        </span>
      </div>

      {/* 3D Mini Viewport */}
      <div className="w-full h-28 rounded-lg bg-black/80 border border-white/10 relative overflow-hidden flex items-center justify-center">
        <Canvas camera={{ position: [0, 0, 0.46], fov: 45 }} gl={{ antialias: true, alpha: true }}>
          <ambientLight intensity={1.2} />
          <directionalLight position={[2, 3, 3]} intensity={2.5} />
          <directionalLight position={[-2, -2, -2]} intensity={0.9} color="#FF6B2B" />
          <pointLight position={[0, 0, 1]} intensity={2.0} color="#FFF" />
          <SingleWheelDisplay wheelType={wheelType} />
        </Canvas>
        <div className="absolute bottom-1 right-2 text-[8px] font-mono text-gray-400 pointer-events-none">
          USER 3D ASSET
        </div>
      </div>

      <div className="flex items-center justify-between text-[10px] font-mono">
        <div className="text-white font-bold truncate">
          {wheelLabels[wheelType] || 'Selected Wheel'}
        </div>
      </div>

      {onOpenSandbox && (
        <button
          onClick={onOpenSandbox}
          className="mt-0.5 w-full py-1.5 rounded-lg border border-[#00E5FF]/40 bg-[#00E5FF]/10 hover:bg-[#00E5FF]/20 text-[#00E5FF] hover:text-white text-[10px] font-mono font-bold uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>🔬 Inspect in 3D Model Sandbox</span>
        </button>
      )}
    </div>
  );
}

// 3D Thar Vehicle Mesh Node (Only User's Authentic Thar Model)
function VehicleShowroom({
  carColor = 'original',
  wheelType = 'user_custom',
  headlights = true,
  underglow = true,
  autoRotate = true,
  liftActive = false,
}) {
  const groupRef = useRef();
  const baseUrl = import.meta.env.BASE_URL || '/';

  const tharGLTF = useGLTF(`${baseUrl}models/thar_split.glb`);
  const tharScene = useMemo(() => tharGLTF.scene.clone(true), [tharGLTF.scene]);

  // Toggle OEM Wheels Visibility on Thar (Hides OEM tires when custom wheel/rim/tyre is selected)
  useEffect(() => {
    tharScene.traverse((child) => {
      if (child.name === 'Thar_OEM_Wheels') {
        child.visible = (wheelType === 'oem');
      }
    });
  }, [tharScene, wheelType]);

  // Shader Uniforms for Thar Body Paint Customization
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

  // Apply original textured material to Thar
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
        <group scale={1.8} position={[0, 0.77, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <primitive object={tharScene} />
          <TharFittedWheelSet wheelType={wheelType} />
        </group>

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
            distance={5}
            position={[0, 0.1, 0]}
          />
        )}

        {/* Wheel Well Illuminators */}
        <pointLight position={[-0.62, -0.2, 0.8]} intensity={2.2} color="#FFF" distance={2} />
        <pointLight position={[-0.62, -0.2, -0.8]} intensity={2.2} color="#FFF" distance={2} />
        <pointLight position={[0.51, -0.2, 0.8]} intensity={2.2} color="#FFF" distance={2} />
        <pointLight position={[0.51, -0.2, -0.8]} intensity={2.2} color="#FFF" distance={2} />
      </group>

      {/* Floating Sparks */}
      <StudioParticles count={70} />

      {/* The Sleek Reflective Dark Showroom Floor Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[32, 32]} />
        <meshStandardMaterial color="#060607" roughness={0.18} metalness={0.82} />
      </mesh>

      {/* Glowing Automotive Grid Floor */}
      <gridHelper args={[24, 24, '#FF4D00', '#1F1F24']} position={[0, 0.005, 0]} />
    </group>
  );
}

export function StudioShowroomCanvas({
  carColor = 'original', setCarColor,
  wheelType = 'user_custom', setWheelType,
  underglow, setUnderglow,
  headlights, setHeadlights,
  autoRotate, setAutoRotate,
  liftActive, setLiftActive,
  onOpenBooking,
  onOpenSandbox,
}) {
  const [activeCategory, setActiveCategory] = useState('wheels'); // 'wheels' | 'livery' | 'chassis'

  // Performance Rating Scores
  const stats = useMemo(() => {
    let traction = 85;
    if (wheelType === 'user_custom') traction = 100;
    else if (wheelType === 'user_tyre') traction = 98;
    else if (wheelType === 'user_rim') traction = 95;

    let visibility = headlights ? 100 : 60;
    let clearance = liftActive ? '310 mm (+3.5")' : '226 mm (Stock)';

    return { traction, visibility, clearance };
  }, [wheelType, headlights, liftActive]);

  const colors = [
    { name: 'Factory Original Spec (Red & Black)', hex: 'original', displayHex: '#D32F2F', badge: 'OEM' },
    { name: 'Desert Sand', hex: '#C2A382', displayHex: '#C2A382' },
    { name: 'Obsidian Stealth Black', hex: '#111215', displayHex: '#111215' },
    { name: 'Army Camo Green', hex: '#2A3D2A', displayHex: '#2A3D2A' },
    { name: 'Forged Monaco Gold', hex: '#D4AF37', displayHex: '#D4AF37' },
    { name: 'Glacier Pearl White', hex: '#F1F5F9', displayHex: '#F1F5F9' },
    { name: 'Riviera Electric Blue', hex: '#0284C7', displayHex: '#0284C7' },
  ];

  const wheelOptions = [
    {
      id: 'user_custom',
      name: 'User Master Spec • CAD Rim & AT Tyre',
      specs: 'Your Authentic 4.3M Tri CAD Wheel (rim.glb + tyre1.glb)',
      traction: 100,
      tag: 'MASTER 100%',
      badge: 'USER 3D MODEL',
      swatch: '#1A1C20',
      rimType: 'CAD Alloy + 3D Tread',
    },
    {
      id: 'user_rim',
      name: 'User Standalone CAD Rim (rim.glb)',
      specs: '763k Tri Authentic CAD Multi-Spoke Alloy with Baked Textures',
      traction: 95,
      tag: 'RIM 95%',
      badge: 'USER CAD RIM',
      swatch: '#DC2626',
      rimType: 'CAD Alloy Rim',
    },
    {
      id: 'user_tyre',
      name: 'User Standalone Off-Road Tyre (tyre1.glb)',
      specs: '3.56M Tri Authentic Physical Tread Mud/All-Terrain Rubber',
      traction: 98,
      tag: 'TYRE 98%',
      badge: 'USER 3D TYRE',
      swatch: '#151618',
      rimType: '3D Tread Tyre',
    },
    {
      id: 'oem',
      name: 'Original Factory Stock Wheels',
      specs: 'Original Wheels from your Mahindra Thar GLB model',
      traction: 85,
      tag: 'STOCK 85%',
      badge: 'ORIGINAL MODEL',
      swatch: '#94A3B8',
      rimType: 'Factory Original',
    },
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
            carColor={carColor}
            wheelType={wheelType}
            headlights={headlights}
            underglow={underglow}
            autoRotate={autoRotate}
            liftActive={liftActive}
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
              <span>MAHINDRA THAR 4X4 • AUTHENTIC USER 3D SPEC</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#FF4D00]/30 text-[#FF4D00] border border-[#FF4D00]/50 font-mono font-bold">
                USER ASSETS
              </span>
            </div>
          </div>
        </div>

        {/* 3D Sandbox Quick Access */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {onOpenSandbox && (
            <button
              onClick={() => {
                playUiSound('click');
                onOpenSandbox();
              }}
              className="px-3.5 py-1.5 rounded-xl text-xs font-heading font-extrabold uppercase border border-[#00E5FF]/50 bg-black/85 text-[#00E5FF] hover:bg-[#00E5FF]/20 hover:text-white transition-all shadow-[0_0_15px_rgba(0,229,255,0.3)] flex items-center gap-1.5 cursor-pointer backdrop-blur-md"
            >
              <span>🔬 3D Model Sandbox</span>
            </button>
          )}
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
              USER ASSETS
            </span>
          </div>

          {/* STANDALONE 3D WHEEL & TYRE TURNTABLE */}
          <MiniWheelTurntable wheelType={wheelType} onOpenSandbox={onOpenSandbox} />

          {/* CATEGORY NAVIGATION TABS */}
          <div className="grid grid-cols-3 gap-1.5 text-[10px] font-heading font-extrabold uppercase">
            {[
              { id: 'wheels', label: '🛞 3D Wheels' },
              { id: 'livery', label: '🎨 Livery' },
              { id: 'chassis', label: '⚙️ Hoist & Spin' },
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

          {/* TAB CONTENT: 1. 3D WHEELS & TYRES SHOWCASE */}
          {activeCategory === 'wheels' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase font-mono tracking-wider">
                  USER 3D WHEEL PACKAGES:
                </span>
                <span className="text-[9px] font-mono text-[#00E5FF] bg-[#00E5FF]/10 px-2 py-0.5 rounded border border-[#00E5FF]/30">
                  4 HUBS + SPARE
                </span>
              </div>
              <p className="text-[10px] text-gray-400 leading-relaxed font-body">
                Equipping your custom wheel locks your authentic CAD rim and off-road tyre models onto all 5 axle hubs of the Thar.
              </p>

              <div className="space-y-2.5">
                {wheelOptions.map((w) => {
                  const isSelected = wheelType === w.id;
                  return (
                    <div
                      key={w.id}
                      onClick={() => {
                        playUiSound('click');
                        setWheelType(w.id);
                      }}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                        isSelected
                          ? 'border-[#FF4D00] bg-gradient-to-r from-[#FF4D00]/25 to-black/80 shadow-[0_0_16px_rgba(255,77,0,0.4)]'
                          : 'border-white/10 hover:border-white/25 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FF4D00] shadow-[0_0_8px_#FF4D00]" />
                      )}

                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-7 h-7 rounded-lg border-2 border-white/20 shrink-0 flex items-center justify-center shadow-md bg-black/60"
                          >
                            <span
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: w.swatch }}
                            />
                          </div>

                          <div>
                            <div className="text-[11px] font-mono font-bold text-white flex items-center gap-1.5">
                              <span>{w.name}</span>
                            </div>
                            <div className="text-[9px] text-[#FF4D00] font-mono font-bold">
                              {w.rimType}
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                            isSelected ? 'bg-[#FF4D00] text-white' : 'bg-white/10 text-gray-300'
                          }`}>
                            {w.badge}
                          </span>
                        </div>
                      </div>

                      <div className="text-[9px] text-gray-400 mt-2 font-mono">
                        {w.specs}
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[9px] font-mono">
                        <div className="flex items-center gap-1.5">
                          <span className="text-gray-400">TRACTION:</span>
                          <span className="text-[#00E5FF] font-bold">{w.traction}%</span>
                        </div>

                        <div className="flex items-center gap-1">
                          {isSelected ? (
                            <span className="text-emerald-400 font-bold flex items-center gap-1">
                              <CheckCircle className="w-3.5 h-3.5" />
                              MOUNTED ON VEHICLE
                            </span>
                          ) : (
                            <span className="text-gray-400 hover:text-white flex items-center gap-1">
                              EQUIP SPEC →
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB CONTENT: 2. LIVERY & PAINT */}
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

          {/* TAB CONTENT: 3. CHASSIS & HOIST */}
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

              {/* Headlights Toggle */}
              <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/10">
                <div>
                  <div className="text-gray-100 font-heading uppercase text-[11px] font-bold">
                    Headlight Driving Beams
                  </div>
                  <div className="text-[9px] text-gray-400">Forward driving projectors</div>
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

              {/* Neon Chassis Underglow */}
              <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/10">
                <div>
                  <div className="text-gray-100 font-heading uppercase text-[11px] font-bold">
                    Chassis Underglow
                  </div>
                  <div className="text-[9px] text-gray-400">Ground effect illumination</div>
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
          <span className="text-[#FF4D00] font-bold">[L-CLICK + DRAG]</span> 360° ORBIT • <span className="text-[#00E5FF] font-bold">[SCROLL]</span> ZOOM • <span className="text-yellow-400 font-bold">[TURNTABLE]</span> 360° SPIN
        </div>
      </div>

      {/* Bottom Vignette */}
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#070709] to-transparent pointer-events-none" />
    </div>
  );
}
