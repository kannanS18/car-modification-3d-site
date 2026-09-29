import React, { Suspense, useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Html, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import {
  Sparkles,
  CheckCircle,
  Crosshair,
  Zap,
  Check,
  Shield,
  Lightbulb,
  Disc,
  Activity,
  ArrowUpRight,
  Gauge,
  Volume2,
} from 'lucide-react';
import {
  UserWheelAssembly,
  UserRimNode,
  UserTyreNode,
} from './HighDefCustomParts';

// Web Audio API Synthesizer for tactile game audio feedback
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
    } else if (type === 'spin' || type === 'spawn') {
      // Futuristic motor spool-up & lock sound
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(980, ctx.currentTime + 0.32);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    }
  } catch (e) {
    // Ignore audio context errors if blocked by browser policy
  }
};

// Sparks / Embers Particle Effect (Optimized low-count)
function StudioParticles({ count = 20 }) {
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
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Single Standalone 3D Wheel for isolated turntable preview in panel
function SingleWheelDisplay({ wheelType }) {
  const meshRef = useRef();

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.9;
    }
  });

  return (
    <group ref={meshRef} rotation={[0, 0.4, 0]}>
      {wheelType === 'user_custom' && (
        <group>
          <UserTyreNode scale={0.21} />
          <UserRimNode scale={0.21 * 0.57} />
        </group>
      )}
      {wheelType === 'user_rim' && (
        <UserRimNode scale={0.21 * 0.57} />
      )}
      {wheelType === 'user_tyre' && (
        <UserTyreNode scale={0.21} />
      )}
    </group>
  );
}

// Mini 3D Turntable showing standalone parts alone on screen with interactive tabs
function MiniWheelTurntable({ wheelType, setWheelType, onOpenSandbox }) {
  const wheelLabels = {
    user_custom: 'User Master Wheel Assembly (rim.glb + tyre1.glb)',
    user_rim: 'User CAD Alloy Wheel Rim (rim.glb • 763k Tris)',
    user_tyre: 'User 3D Deep Tread Off-Road Tyre (tyre1.glb • 3.56M Tris)',
  };

  return (
    <div className="bg-gradient-to-b from-black/95 to-[#121316] p-3 rounded-xl border border-[#FF4D00]/40 shadow-xl flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse" />
          <span className="text-[10px] font-mono font-bold tracking-widest text-white uppercase">
            STANDALONE 3D PARTS VIEWER
          </span>
        </div>
        <span className="text-[9px] font-mono font-bold text-[#FF4D00] bg-[#FF4D00]/10 px-1.5 py-0.5 rounded border border-[#FF4D00]/30">
          360° SPIN & ORBIT
        </span>
      </div>

      {/* Part Switcher Pill Tabs directly inside widget */}
      <div className="grid grid-cols-3 gap-1 bg-black/60 p-1 rounded-lg border border-white/10">
        <button
          onClick={() => {
            playUiSound('tab');
            setWheelType('user_custom');
          }}
          className={`py-1 px-1 rounded text-[9px] font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
            wheelType === 'user_custom'
              ? 'bg-[#FF4D00] text-white shadow-[0_0_8px_#FF4D00]'
              : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <span>🛞 Assembly</span>
        </button>
        <button
          onClick={() => {
            playUiSound('tab');
            setWheelType('user_rim');
          }}
          className={`py-1 px-1 rounded text-[9px] font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
            wheelType === 'user_rim'
              ? 'bg-[#FF4D00] text-white shadow-[0_0_8px_#FF4D00]'
              : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <span>⚙️ CAD Rim</span>
        </button>
        <button
          onClick={() => {
            playUiSound('tab');
            setWheelType('user_tyre');
          }}
          className={`py-1 px-1 rounded text-[9px] font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
            wheelType === 'user_tyre'
              ? 'bg-[#FF4D00] text-white shadow-[0_0_8px_#FF4D00]'
              : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <span>🏔️ 3D Tyre</span>
        </button>
      </div>

      {/* 3D Mini Viewport with 3/4 Perspective Camera & Orbit Controls */}
      <div className="w-full h-32 rounded-lg bg-black/80 border border-white/10 relative overflow-hidden flex items-center justify-center">
        <Canvas
          camera={{ position: [0.22, 0.1, 0.44], fov: 40 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
          dpr={1}
        >
          <ambientLight intensity={1.4} />
          <directionalLight position={[3, 3, 3]} intensity={3.0} />
          <directionalLight position={[-3, -1, -2]} intensity={1.2} color="#FF6B2B" />
          <pointLight position={[0, 0, 1.2]} intensity={2.5} color="#FFF" />
          <SingleWheelDisplay wheelType={wheelType} />
          <OrbitControls enableZoom={false} enablePan={false} dampingFactor={0.1} />
        </Canvas>
        <div className="absolute bottom-1 right-2 text-[8px] font-mono text-gray-400 pointer-events-none">
          DRAG TO ORBIT
        </div>
      </div>

      <div className="flex items-center justify-between text-[10px] font-mono">
        <div className="text-white font-bold truncate">
          {wheelLabels[wheelType] || 'Selected 3D Part'}
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

// 3D Vehicle Node on Showroom Plane
// (SUPPORTS BOTH MAHINDRA THAR 4x4 AND SUPERCAR FERRARI GT3 WITH SPIN & SCALE-UP ENTRANCE)
function VehicleShowroom({
  carModel = 'thar',
  carColor = 'original',
  headlights = true,
  underglow = true,
  autoRotate = true,
  liftActive = false,
}) {
  const groupRef = useRef();
  const carGroupRef = useRef();
  const baseUrl = import.meta.env.BASE_URL || '/';

  // 1. Authentic single Thar model
  const tharGLTF = useGLTF(`${baseUrl}models/thar.glb`);
  const tharScene = useMemo(() => tharGLTF.scene.clone(true), [tharGLTF.scene]);

  // 2. Supercar Ferrari model
  const ferrariGLTF = useGLTF(`${baseUrl}models/ferrari.glb`);
  const ferrariScene = useMemo(() => ferrariGLTF.scene.clone(true), [ferrariGLTF.scene]);

  // Track previous car & color key to trigger the Spin & Scale-Up entrance animation
  const prevKeyRef = useRef(`${carModel}_${carColor}`);
  const animProgressRef = useRef(1.0); // 1.0 = fully settled, < 1.0 = animating

  useEffect(() => {
    const currentKey = `${carModel}_${carColor}`;
    if (prevKeyRef.current !== currentKey) {
      prevKeyRef.current = currentKey;
      animProgressRef.current = 0.0; // Trigger spin & scale-up entrance!
    }
  }, [carModel, carColor]);

  // Shader Uniforms for Thar Body Paint Customization
  const uniformsRef = useRef({
    uBodyColor: { value: new THREE.Color('#D32F2F') },
    uColorActive: { value: 0.0 },
  });

  // Dynamically update Thar uniforms when carColor changes
  useEffect(() => {
    if (!carColor || carColor === 'original' || carColor === 'default') {
      uniformsRef.current.uColorActive.value = 0.0;
    } else {
      uniformsRef.current.uColorActive.value = 1.0;
      uniformsRef.current.uBodyColor.value.set(carColor);
    }
  }, [carColor]);

  // Apply original textured material & tint shader to Thar body
  useEffect(() => {
    tharScene.traverse((child) => {
      if (child.isMesh && child.material) {
        child.castShadow = false;
        child.receiveShadow = false;
        child.frustumCulled = true;

        const mat = child.material;
        if (!mat.userData.customShaderAttached) {
          mat.userData.customShaderAttached = true;

          if (mat.map) {
            mat.map.anisotropy = 8;
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
                '  // Blend: if body paint and active, apply custom paint; else keep original texture untouched:',
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

  // Apply materials and dynamic body paint to Supercar Ferrari model
  useEffect(() => {
    const paintColor = (!carColor || carColor === 'original' || carColor === 'default') ? '#D32F2F' : carColor;
    const ferrariPaintMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(paintColor),
      metalness: 0.85,
      roughness: 0.16,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      reflectivity: 0.95,
    });

    ferrariScene.traverse((child) => {
      if (child.isMesh && child.material) {
        child.castShadow = false;
        child.receiveShadow = false;
        child.frustumCulled = true;

        if (child.name === 'body' || child.material?.name === 'Body_Color') {
          child.material = ferrariPaintMat;
        }
      }
    });
  }, [ferrariScene, carColor]);

  // Frame Loop: Handles Spin & Scale-Up entrance animation and smooth auto-rotation
  useFrame((state, delta) => {
    const isThar = carModel === 'thar';
    const targetScale = isThar ? 1.8 : 0.92;
    const baseRot = isThar ? -Math.PI / 2 : 0;

    if (animProgressRef.current < 1.0) {
      // Advance entrance animation over ~0.45 seconds
      animProgressRef.current = Math.min(1.0, animProgressRef.current + delta * 2.2);
      const t = animProgressRef.current;
      // Cubic ease out
      const ease = 1 - Math.pow(1 - t, 3);

      // Scale smoothly up from 0 to target scale
      const currentScale = targetScale * Math.min(1.0, ease * 1.04);
      if (carGroupRef.current) {
        carGroupRef.current.scale.set(currentScale, currentScale, currentScale);
        // Spin 720 degrees (2 full spins) into position
        const spinAngle = (1.0 - ease) * Math.PI * 4;
        carGroupRef.current.rotation.y = baseRot + spinAngle;
      }
    } else {
      if (carGroupRef.current) {
        carGroupRef.current.scale.set(targetScale, targetScale, targetScale);
        carGroupRef.current.rotation.y = baseRot;
      }
      if (autoRotate && groupRef.current) {
        groupRef.current.rotation.y += delta * 0.35;
      }
    }
  });

  const targetY = liftActive ? 0.8 : 0;
  const underglowColor = (!carColor || carColor === 'original') ? '#FF4D00' : carColor;

  return (
    <group position={[0, -0.6, 0]}>
      {/* Moving Vehicle Group */}
      <group
        ref={groupRef}
        position={[0, targetY, 0]}
        style={{ transition: 'all 0.5s ease-out' }}
      >
        {/* Car group with spin & scale-up animation */}
        <group
          ref={carGroupRef}
          position={carModel === 'thar' ? [0, 0.77, 0] : [0, 0.32, 0]}
        >
          {carModel === 'thar' ? (
            <primitive object={tharScene} />
          ) : (
            <primitive object={ferrariScene} />
          )}
        </group>

        {/* Headlight Beams */}
        {headlights && (
          <group position={carModel === 'thar' ? [0, 0.4, 2.2] : [0, 0.3, 2.0]}>
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
      </group>

      {/* Floating Sparks */}
      <StudioParticles count={20} />

      {/* Sleek Dark Showroom Floor Plane */}
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
  carModel = 'thar', setCarModel,
  carColor = 'original', setCarColor,
  wheelType = 'user_custom', setWheelType,
  underglow, setUnderglow,
  headlights, setHeadlights,
  autoRotate, setAutoRotate,
  liftActive, setLiftActive,
  onOpenBooking,
  onOpenSandbox,
}) {
  const [activeCategory, setActiveCategory] = useState('mods'); // 'mods' | 'livery' | 'chassis'
  const [vehicleTab, setVehicleTab] = useState(carModel || 'thar'); // 'thar' | 'ferrari'
  const [selectedMods, setSelectedMods] = useState({
    wheels: true,
    lights: true,
    lift: false,
    bullbar: true,
    roofrack: true,
    exhaust: false,
    audio: true,
  });

  const toggleMod = (id) => {
    playUiSound('toggle');
    setSelectedMods((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Sync tab with external carModel
  useEffect(() => {
    if (carModel) setVehicleTab(carModel);
  }, [carModel]);

  // Both Cars and their Authentic Preset Editions for the Floating Bubble Selector
  const carEditions = [
    // 1. MAHINDRA THAR 4X4 SUV
    {
      id: 'thar_crimson',
      model: 'thar',
      name: 'Thar OEM Crimson',
      color: 'original',
      displayColor: '#D32F2F',
      accentColor: '#FF4D00',
      badge: 'THAR 4X4',
      icon: '🚙',
      desc: 'Mahindra Thar 4x4 Factory Red & Black Spec',
    },
    {
      id: 'thar_stealth',
      model: 'thar',
      name: 'Thar Stealth',
      color: '#111215',
      displayColor: '#111215',
      accentColor: '#4B5563',
      badge: 'THAR 4X4',
      icon: '🖤',
      desc: 'Mahindra Thar Midnight Matte Obsidian Edition',
    },
    {
      id: 'thar_sahara',
      model: 'thar',
      name: 'Thar Sahara Dune',
      color: '#C2A382',
      displayColor: '#C2A382',
      accentColor: '#D97706',
      badge: 'THAR 4X4',
      icon: '🏜️',
      desc: 'Mahindra Thar Overland Desert Expedition Spec',
    },
    {
      id: 'thar_camo',
      model: 'thar',
      name: 'Thar Army Camo',
      color: '#2A3D2A',
      displayColor: '#2A3D2A',
      accentColor: '#15803D',
      badge: 'THAR 4X4',
      icon: '🌲',
      desc: 'Mahindra Thar Tactical Military Matte Forest Drab',
    },
    // 2. FERRARI 458 GT3 SUPERCAR
    {
      id: 'ferrari_rosso',
      model: 'ferrari',
      name: 'Ferrari Rosso Corsa',
      color: '#D32F2F',
      displayColor: '#D32F2F',
      accentColor: '#EF4444',
      badge: 'SUPERCAR GT3',
      icon: '🏎️',
      desc: 'Ferrari 458 Italia GT3 Classic Italian Racing Red',
    },
    {
      id: 'ferrari_giallo',
      model: 'ferrari',
      name: 'Ferrari Giallo Modena',
      color: '#EAB308',
      displayColor: '#EAB308',
      accentColor: '#FACC15',
      badge: 'SUPERCAR GT3',
      icon: '⚡',
      desc: 'Ferrari 458 Italia GT3 Racing Yellow',
    },
    {
      id: 'ferrari_nero',
      model: 'ferrari',
      name: 'Ferrari Nero Daytona',
      color: '#111215',
      displayColor: '#111215',
      accentColor: '#374151',
      badge: 'SUPERCAR GT3',
      icon: '🥷',
      desc: 'Ferrari 458 Italia GT3 Stealth Carbon Black',
    },
    {
      id: 'ferrari_bianco',
      model: 'ferrari',
      name: 'Ferrari Bianco Avus',
      color: '#F1F5F9',
      displayColor: '#F1F5F9',
      accentColor: '#38BDF8',
      badge: 'SUPERCAR GT3',
      icon: '❄️',
      desc: 'Ferrari 458 Italia GT3 Pearl Arctic White',
    },
    {
      id: 'ferrari_azure',
      model: 'ferrari',
      name: 'Ferrari Blu Corsa',
      color: '#0284C7',
      displayColor: '#0284C7',
      accentColor: '#00E5FF',
      badge: 'SUPERCAR GT3',
      icon: '🌊',
      desc: 'Ferrari 458 Italia GT3 Metallic Riviera Azure Blue',
    },
  ];

  // Available Modifications Catalogue (Mentioned cleanly without altering the 3D model)
  const availableMods = [
    {
      id: 'wheels',
      name: 'Heavy-Duty Beadlock Wheels & AT Tyres',
      category: 'WHEELS & RIMS',
      icon: Disc,
      specs: '18" CAD Forged Multi-Spoke Alloys with 33" Deep Lug Physical Rubber Treads',
      badge: 'USER 3D SPEC',
      badgeColor: '#00E5FF',
      status: 'AVAILABLE AT WORKSHOP',
    },
    {
      id: 'lights',
      name: 'High-Power LED Off-Road Light Bar & Pods',
      category: 'ILLUMINATION',
      icon: Lightbulb,
      specs: '50" Curved Quad-Row Roof Bar (50,000 Lumens) + 4x Front Bumper Amber Fog Pods',
      badge: 'POPULAR MOD',
      badgeColor: '#FF4D00',
      status: 'IN STOCK',
    },
    {
      id: 'bullbar',
      name: 'Heavy-Duty Steel Bull Bar & Winch Mount',
      category: 'ARMOR & PROTECTION',
      icon: Shield,
      specs: 'Laser-Cut Cold Rolled Steel with Integrated 12,000 lbs Electric Recovery Winch',
      badge: 'EXPEDITION SPEC',
      badgeColor: '#10B981',
      status: 'READY TO MOUNT',
    },
    {
      id: 'lift',
      name: '+3.5" Nitrogen Reservoir Suspension Lift Kit',
      category: 'CHASSIS & CLEARANCE',
      icon: ArrowUpRight,
      specs: 'Ironman 4x4 Foam Cell Shocks, Extended Control Arms & Heavy-Duty Sway Bar Links',
      badge: '310mm CLEARANCE',
      badgeColor: '#3B82F6',
      status: 'CUSTOM FABRICATION',
    },
    {
      id: 'audio',
      name: 'Dual 12" Tailgate Subwoofer Audio Enclosure',
      category: 'INTERIOR ACOUSTICS',
      icon: Volume2,
      specs: '2000W RMS Monoblock Class-D Amp with Sealed Weatherproof Rear Sound Stage',
      badge: '142 dB STAGE',
      badgeColor: '#A855F7',
      status: 'PLUG & PLAY',
    },
    {
      id: 'exhaust',
      name: 'Valvetronic Stainless Dual-Exit Performance Exhaust',
      category: 'POWERTRAIN & SOUND',
      icon: Gauge,
      specs: 'Active Valve Remote Bypass with Stage 2 ECU Calibration (+45 HP / +80 Nm)',
      badge: '+45 HP TUNE',
      badgeColor: '#F59E0B',
      status: 'DYNO TESTED',
    },
  ];

  const handleCategorySwitch = (cat) => {
    playUiSound('tab');
    setActiveCategory(cat);
  };

  const handleSelectEdition = (edition) => {
    playUiSound('spin');
    if (setCarModel) setCarModel(edition.model);
    setCarColor(edition.color);
    setVehicleTab(edition.model);
  };

  return (
    <div id="showroom-plane" className="relative w-full h-[760px] md:h-[900px] bg-[#070709] overflow-hidden select-none border-y border-[#FF4D00]/30 font-body">
      {/* 3D WebGL Canvas */}
      <Canvas
        shadows
        dpr={[1, 1]}
        camera={{ position: [3.8, 2.2, 4.6], fov: 45 }}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        performance={{ min: 0.5 }}
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
          <directionalLight position={[6, 9, 6]} intensity={1.8} castShadow shadow-mapSize={[512, 512]} />
          {/* Cyber Neon Overhead Tubes */}
          <pointLight color="#00E5FF" intensity={3} distance={15} position={[-4, 5, 2]} />
          <pointLight color="#FF4D00" intensity={3} distance={15} position={[4, 5, -2]} />

          <VehicleShowroom
            carModel={carModel}
            carColor={carColor}
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
            enableDamping={true}
            dampingFactor={0.08}
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
              <span>{carModel === 'thar' ? 'MAHINDRA THAR 4X4 • AUTHENTIC SPEC' : 'FERRARI 458 GT3 • SUPERCAR ATELIER'}</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#FF4D00]/30 text-[#FF4D00] border border-[#FF4D00]/50 font-mono font-bold">
                {carModel === 'thar' ? 'USER ASSET' : 'SUPERCAR'}
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

      {/* FLOATING BUBBLE ICONS DOCK (TAP BUBBLE TO SWITCH CAR & SPIN/SCALE UP ONTO PLANE) */}
      <div className="absolute bottom-6 left-6 z-30 pointer-events-auto flex flex-col gap-2 max-w-[calc(100vw-400px)] hidden sm:flex">
        <div className="flex items-center gap-3 px-3 py-1 rounded-full bg-black/85 border border-[#FF4D00]/40 backdrop-blur-md w-fit shadow-xl">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#FF4D00] animate-pulse" />
            <span className="text-[10px] font-mono font-bold tracking-wider text-white uppercase">
              SELECT CAR SPECIFICATION
            </span>
          </div>
          <span className="text-[9px] font-mono text-[#00E5FF]">
            [TAP TO SWAP VEHICLE & SPIN ONTO PLANE]
          </span>
        </div>

        {/* Bubble Row */}
        <div className="flex items-center gap-2.5 p-2 rounded-2xl bg-black/85 border border-white/15 backdrop-blur-2xl shadow-[0_0_30px_rgba(0,0,0,0.85)] overflow-x-auto scrollbar-none">
          {carEditions.map((edition) => {
            const isSelected = carModel === edition.model && carColor === edition.color;
            return (
              <button
                key={edition.id}
                onClick={() => handleSelectEdition(edition)}
                className={`group relative flex flex-col items-center gap-1 p-2 rounded-xl transition-all cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-[#FF4D00]/25 border-2 border-[#FF4D00] shadow-[0_0_20px_rgba(255,77,0,0.6)] scale-105'
                    : 'bg-white/5 border border-white/10 hover:border-white/30 hover:bg-white/10'
                }`}
                title={edition.desc}
              >
                {/* Circular Glowing Bubble Icon */}
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center relative shadow-inner transition-transform group-hover:scale-110 ${
                    isSelected ? 'ring-2 ring-[#FF4D00] ring-offset-2 ring-offset-black' : ''
                  }`}
                  style={{
                    background: `radial-gradient(circle, ${edition.displayColor} 40%, #050507 100%)`,
                    border: `2px solid ${edition.accentColor}`,
                  }}
                >
                  <span className="text-lg filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    {edition.icon}
                  </span>
                  {isSelected && (
                    <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#00E5FF] border-2 border-black flex items-center justify-center">
                      <Check className="w-2 h-2 text-black stroke-[3]" />
                    </div>
                  )}
                </div>

                {/* Edition Label */}
                <div className="text-center">
                  <div className={`text-[9px] font-mono font-bold leading-tight ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                    {edition.name}
                  </div>
                  <div className="text-[7px] font-mono text-[#FF4D00]">
                    {edition.badge}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* RIGHT-SIDE VIDEO GAME TUNING CONTROLLER PANEL */}
      <div className="absolute top-20 right-5 bottom-8 w-[350px] sm:w-[380px] z-30 pointer-events-auto flex flex-col justify-between">
        <div className="glass-panel p-4 sm:p-5 rounded-2xl border-2 border-[#FF4D00]/50 backdrop-blur-2xl bg-black/90 shadow-[0_0_35px_rgba(0,0,0,0.9)] flex flex-col gap-4 max-h-full overflow-y-auto">
          {/* Game HUD Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Crosshair className="w-4 h-4 text-[#FF4D00] animate-spin" style={{ animationDuration: '10s' }} />
              <span className="text-xs font-heading font-black tracking-widest uppercase text-white">
                GARAGE TUNING HUD
              </span>
            </div>
            {/* Quick Car Selector Toggle */}
            <div className="flex items-center bg-black/60 rounded-lg p-0.5 border border-white/10">
              <button
                onClick={() => {
                  playUiSound('spin');
                  if (setCarModel) setCarModel('thar');
                  setVehicleTab('thar');
                }}
                className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold transition-all cursor-pointer ${
                  carModel === 'thar' ? 'bg-[#FF4D00] text-white shadow' : 'text-gray-400 hover:text-white'
                }`}
              >
                🚙 Thar
              </button>
              <button
                onClick={() => {
                  playUiSound('spin');
                  if (setCarModel) setCarModel('ferrari');
                  setVehicleTab('ferrari');
                }}
                className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold transition-all cursor-pointer ${
                  carModel === 'ferrari' ? 'bg-[#FF4D00] text-white shadow' : 'text-gray-400 hover:text-white'
                }`}
              >
                🏎️ Supercar
              </button>
            </div>
          </div>

          {/* STANDALONE 3D WHEEL & TYRE TURNTABLE (ALONE ON SCREEN IN PANEL WITH PART SWITCHER) */}
          <MiniWheelTurntable
            wheelType={wheelType}
            setWheelType={setWheelType}
            onOpenSandbox={onOpenSandbox}
          />

          {/* CATEGORY NAVIGATION TABS */}
          <div className="grid grid-cols-3 gap-1.5 text-[10px] font-heading font-extrabold uppercase">
            {[
              { id: 'mods', label: '📦 All Mods' },
              { id: 'livery', label: '🎨 Car Paint' },
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

          {/* TAB 1: ALL AVAILABLE MODIFICATIONS (MENTIONED FULLY) */}
          {activeCategory === 'mods' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase font-mono tracking-wider">
                  AVAILABLE TUNING UPGRADES:
                </span>
                <span className="text-[9px] font-mono text-[#00E5FF] bg-[#00E5FF]/10 px-2 py-0.5 rounded border border-[#00E5FF]/30">
                  {Object.values(selectedMods).filter(Boolean).length} / {availableMods.length} EQUIPPED
                </span>
              </div>
              <p className="text-[10px] text-gray-400 leading-relaxed font-body">
                Select your desired modifications to include in your vehicle commission build package:
              </p>

              <div className="space-y-2">
                {availableMods.map((mod) => {
                  const isChecked = !!selectedMods[mod.id];
                  const Icon = mod.icon;
                  return (
                    <div
                      key={mod.id}
                      onClick={() => toggleMod(mod.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                        isChecked
                          ? 'border-[#FF4D00]/70 bg-gradient-to-r from-[#FF4D00]/20 to-black/80 shadow-[0_0_12px_rgba(255,77,0,0.3)]'
                          : 'border-white/10 hover:border-white/20 bg-white/5'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-black/60 border border-white/20 flex items-center justify-center shrink-0">
                            <Icon className="w-3.5 h-3.5 text-[#FF4D00]" />
                          </div>
                          <div>
                            <div className="text-[10px] font-mono font-bold text-white flex items-center gap-1.5 leading-tight">
                              <span>{mod.name}</span>
                            </div>
                            <div className="text-[8px] text-gray-400 font-mono">
                              {mod.category}
                            </div>
                          </div>
                        </div>

                        <span
                          className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded border"
                          style={{
                            color: mod.badgeColor,
                            borderColor: `${mod.badgeColor}40`,
                            backgroundColor: `${mod.badgeColor}15`,
                          }}
                        >
                          {mod.badge}
                        </span>
                      </div>

                      <div className="text-[9px] text-gray-400 mt-1.5 font-mono leading-tight">
                        {mod.specs}
                      </div>

                      <div className="mt-2 pt-1.5 border-t border-white/10 flex items-center justify-between text-[9px] font-mono">
                        <span className="text-gray-400">{mod.status}</span>
                        <div className="flex items-center gap-1">
                          {isChecked ? (
                            <span className="text-emerald-400 font-bold flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              ADDED TO SPEC
                            </span>
                          ) : (
                            <span className="text-gray-500 hover:text-gray-300">
                              + ADD TO SPEC
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

          {/* TAB 2: LIVERY & COLOR */}
          {activeCategory === 'livery' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase font-mono">
                  SELECT {carModel === 'thar' ? 'THAR 4X4' : 'SUPERCAR'} FINISH:
                </span>
                <span className="text-[10px] text-[#FF4D00] font-mono font-bold">
                  {carEditions.find((c) => c.model === carModel && c.color === carColor)?.name || 'Custom'}
                </span>
              </div>
              <p className="text-[10px] text-gray-400 font-body">
                Changes the active car body paint finish in real-time with preserved reflections and specular highlights.
              </p>
              <div className="grid grid-cols-2 gap-2">
                {carEditions
                  .filter((c) => c.model === carModel)
                  .map((c) => {
                    const isSelected = carColor === c.color;
                    return (
                      <button
                        key={c.id}
                        onClick={() => {
                          playUiSound('spin');
                          setCarColor(c.color);
                        }}
                        className={`p-2 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#FF4D00] bg-[#FF4D00]/20 text-white font-bold shadow-[0_0_10px_rgba(255,77,0,0.5)]'
                            : 'border-white/10 text-gray-300 hover:text-white bg-white/5'
                        }`}
                      >
                        <span
                          className="w-5 h-5 rounded-full shrink-0 border-2 border-white/40 shadow"
                          style={{ backgroundColor: c.displayColor }}
                        />
                        <div className="leading-tight">
                          <div className="text-[10px] font-mono font-bold truncate">{c.name}</div>
                          <span className="text-[8px] text-[#FF4D00] font-mono">{c.badge}</span>
                        </div>
                      </button>
                    );
                  })}
              </div>
            </div>
          )}

          {/* TAB 3: CHASSIS & HOIST */}
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
          <span className="text-[#FF4D00] font-bold">[L-CLICK + DRAG]</span> 360° ORBIT • <span className="text-[#00E5FF] font-bold">[SCROLL]</span> ZOOM • <span className="text-yellow-400 font-bold">[BUBBLE]</span> SWAP CAR
        </div>
      </div>

      {/* Bottom Vignette */}
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#070709] to-transparent pointer-events-none" />
    </div>
  );
}
