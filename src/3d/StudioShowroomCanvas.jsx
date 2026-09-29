import React, { Suspense, useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Html, useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';
import {
  Crosshair,
  Zap,
  Check,
  Shield,
  Lightbulb,
  Disc,
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
      gain.gain.setValueAtTime(0.07, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } else if (type === 'tab') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(540, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } else if (type === 'toggle') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(780, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } else if (type === 'spin' || type === 'spawn') {
      // Futuristic motor spool-up & snap sound
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(980, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    }
  } catch (e) {
    // Ignore audio context errors if blocked by browser policy
  }
};

// Gentle Cyan Sparks / Ambient Embers
function StudioParticles({ count = 22 }) {
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        x: (Math.random() - 0.5) * 8,
        y: Math.random() * 3.5,
        z: (Math.random() - 0.5) * 8,
        speedY: 0.008 + Math.random() * 0.015,
        speedX: (Math.random() - 0.5) * 0.008,
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
        color="#00E5FF"
        size={0.05}
        transparent
        opacity={0.75}
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

// Mini 3D Turntable showing standalone parts alone on screen with 3 interactive pills
function MiniWheelTurntable({ wheelType, setWheelType, onOpenSandbox }) {
  return (
    <div className="bg-[#090D16] p-2 rounded-xl border border-[#00E5FF]/30 shadow-lg flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse" />
          <span className="text-[9px] font-mono font-bold tracking-wider text-gray-200 uppercase">
            3D PARTS VIEWER
          </span>
        </div>
        <span className="text-[8px] font-mono font-bold text-[#00E5FF] bg-[#00E5FF]/10 px-1.5 py-0.2 rounded border border-[#00E5FF]/30">
          360° ORBIT
        </span>
      </div>

      {/* Part Switcher Pill Tabs directly inside widget */}
      <div className="grid grid-cols-3 gap-1 bg-black/60 p-0.5 rounded-lg border border-white/10">
        <button
          onClick={() => {
            playUiSound('tab');
            setWheelType('user_custom');
          }}
          className={`py-1 px-1 rounded text-[8px] font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
            wheelType === 'user_custom'
              ? 'bg-[#00E5FF] text-black shadow-[0_0_8px_#00E5FF]'
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
          className={`py-1 px-1 rounded text-[8px] font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
            wheelType === 'user_rim'
              ? 'bg-[#00E5FF] text-black shadow-[0_0_8px_#00E5FF]'
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
          className={`py-1 px-1 rounded text-[8px] font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
            wheelType === 'user_tyre'
              ? 'bg-[#00E5FF] text-black shadow-[0_0_8px_#00E5FF]'
              : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <span>🏔️ 3D Tyre</span>
        </button>
      </div>

      {/* 3D Mini Viewport with 3/4 Perspective Camera & Orbit Controls */}
      <div className="w-full h-24 rounded-lg bg-black/70 border border-white/10 relative overflow-hidden flex items-center justify-center">
        <Canvas
          camera={{ position: [0.22, 0.1, 0.44], fov: 40 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
          dpr={1}
        >
          <ambientLight intensity={1.5} />
          <directionalLight position={[3, 3, 3]} intensity={3.0} />
          <directionalLight position={[-3, -1, -2]} intensity={1.2} color="#00E5FF" />
          <pointLight position={[0, 0, 1.2]} intensity={2.5} color="#FFF" />
          <SingleWheelDisplay wheelType={wheelType} />
          <OrbitControls enableZoom={false} enablePan={false} dampingFactor={0.1} />
        </Canvas>
        <div className="absolute bottom-1 right-2 text-[7px] font-mono text-gray-500 pointer-events-none">
          DRAG TO ROTATE
        </div>
      </div>
    </div>
  );
}

// 3D Miniature Model Node for the 2-Car Circular Bubbles (Centered & Scaled Up)
function MiniCarModel({ model }) {
  const baseUrl = import.meta.env.BASE_URL || '/';
  const tharGLTF = useGLTF(`${baseUrl}models/thar.glb`);
  const ferrariGLTF = useGLTF(`${baseUrl}models/ferrari.glb`);

  const tharScene = useMemo(() => tharGLTF.scene.clone(true), [tharGLTF.scene]);
  const ferrariScene = useMemo(() => {
    const clone = ferrariGLTF.scene.clone(true);
    const ferrariPaintMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#D32F2F'),
      metalness: 0.85,
      roughness: 0.16,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      reflectivity: 0.95,
    });
    clone.traverse((child) => {
      if (child.isMesh && child.material) {
        if (child.name === 'body' || child.material?.name === 'Body_Color') {
          child.material = ferrariPaintMat;
        }
      }
    });
    return clone;
  }, [ferrariGLTF.scene]);

  const groupRef = useRef();

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.9;
    }
  });

  return (
    <group ref={groupRef}>
      <Center precise>
        {model === 'thar' ? (
          <group scale={0.88} rotation={[0, -Math.PI / 2, 0]}>
            <primitive object={tharScene} />
          </group>
        ) : (
          <group scale={0.46} rotation={[0, 0, 0]}>
            <primitive object={ferrariScene} />
          </group>
        )}
      </Center>
    </group>
  );
}

// Mini 3D Car inside Circular Bubble (Centered, neatly framed, zero words)
function MiniBubbleCarCanvas({ model }) {
  return (
    <Canvas
      camera={{ position: [2.2, 1.1, 2.2], fov: 38 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
      dpr={1.5}
    >
      <ambientLight intensity={2.2} />
      <directionalLight position={[3, 4, 3]} intensity={3.2} />
      <directionalLight position={[-3, -2, -2]} intensity={1.6} color="#00E5FF" />
      <pointLight position={[0, 1, 2]} intensity={2.2} color="#FFF" />
      <MiniCarModel model={model} />
    </Canvas>
  );
}

// 3D Vehicle Node on Showroom Plane
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
  const underglowColor = (!carColor || carColor === 'original') ? '#00E5FF' : carColor;

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
              color="#F0F9FF"
              intensity={4.5}
              angle={0.6}
              penumbra={0.5}
              position={[-0.7, 0, 0]}
              target-position={[-0.7, -0.5, 6]}
            />
            <spotLight
              color="#F0F9FF"
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

      {/* Floating Cyan Sparks */}
      <StudioParticles count={22} />

      {/* Sleek Midnight Reflective Floor Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[32, 32]} />
        <meshStandardMaterial color="#080C14" roughness={0.16} metalness={0.85} />
      </mesh>

      {/* Glowing Pleasant Cyan Grid Floor */}
      <gridHelper args={[24, 24, '#00E5FF', '#121A2A']} position={[0, 0.005, 0]} />
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
  const [activeTab, setActiveTab] = useState('paint'); // 'paint' | 'controls' | 'mods'
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

  // Color Swatches tailored to each vehicle
  const tharColors = [
    { name: 'Factory Crimson', hex: 'original', displayHex: '#D32F2F', badge: 'OEM' },
    { name: 'Obsidian Stealth', hex: '#111215', displayHex: '#111215', badge: 'MATTE' },
    { name: 'Dune Sahara', hex: '#C2A382', displayHex: '#C2A382', badge: '4X4' },
    { name: 'Tactical Camo', hex: '#2A3D2A', displayHex: '#2A3D2A', badge: 'MIL' },
    { name: 'Monaco Gold', hex: '#D4AF37', displayHex: '#D4AF37', badge: 'ROYAL' },
    { name: 'Glacier White', hex: '#F1F5F9', displayHex: '#F1F5F9', badge: 'SNOW' },
    { name: 'Electric Cyan', hex: '#0284C7', displayHex: '#00E5FF', badge: 'CYBER' },
  ];

  const ferrariColors = [
    { name: 'Rosso Corsa Red', hex: '#D32F2F', displayHex: '#D32F2F', badge: 'CORSA' },
    { name: 'Giallo Modena', hex: '#EAB308', displayHex: '#EAB308', badge: 'RACE' },
    { name: 'Nero Daytona', hex: '#111215', displayHex: '#111215', badge: 'DARK' },
    { name: 'Bianco Avus', hex: '#F1F5F9', displayHex: '#F1F5F9', badge: 'PEARL' },
    { name: 'Blu Tour de France', hex: '#0284C7', displayHex: '#0284C7', badge: 'AZURE' },
    { name: 'Grigio Silverstone', hex: '#4B5563', displayHex: '#4B5563', badge: 'TITAN' },
  ];

  const activeColors = carModel === 'thar' ? tharColors : ferrariColors;

  // Modification upgrades (without off-roading / grip rating bars)
  const modsList = [
    { id: 'wheels', name: 'Forged Beadlock Alloys & AT Tyres', badge: 'WHEELS', icon: Disc },
    { id: 'lights', name: '50" Quad Roof LED Bar & Pods', badge: 'LIGHTS', icon: Lightbulb },
    { id: 'bullbar', name: 'Laser-Cut Winch Bull Bar Mount', badge: 'ARMOR', icon: Shield },
    { id: 'lift', name: '+3.5" Nitrogen Reservoir Lift Kit', badge: 'CHASSIS', icon: ArrowUpRight },
    { id: 'audio', name: 'Dual 12" Tailgate Subwoofer 2000W', badge: 'AUDIO', icon: Volume2 },
    { id: 'exhaust', name: 'Valvetronic Stainless Cat-Back Tune', badge: 'POWER', icon: Gauge },
  ];

  const handleSelectVehicle = (model) => {
    if (carModel === model) return;
    playUiSound('spin');
    if (setCarModel) setCarModel(model);
    setCarColor('original');
  };

  return (
    <div id="showroom-plane" className="relative w-full h-[760px] md:h-[880px] bg-[#070A10] overflow-hidden select-none border-y border-[#00E5FF]/20 font-body">
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
              <div className="flex flex-col items-center gap-3 p-5 rounded-2xl glass-panel shadow-2xl border border-[#00E5FF]/40 bg-black/90">
                <div className="w-10 h-10 border-3 border-[#00E5FF] border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-mono uppercase tracking-widest text-[#00E5FF] font-bold">
                  INITIALIZING GAME ENGINE 3D STUDIO...
                </span>
              </div>
            </Html>
          }
        >
          <Environment preset="night" environmentIntensity={0.65} />
          <ambientLight intensity={0.6} />
          <directionalLight position={[6, 9, 6]} intensity={1.8} castShadow shadow-mapSize={[512, 512]} />
          {/* Pleasant Cyan & Platinum Overhead Tubes */}
          <pointLight color="#00E5FF" intensity={3.5} distance={16} position={[-4, 5, 2]} />
          <pointLight color="#38BDF8" intensity={2.5} distance={16} position={[4, 5, -2]} />

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

      {/* TOP GAMING HUD BAR (WITH BUBBLE VEHICLE SELECTOR LOCATED RIGHT HERE NEAR TITLE!) */}
      <div className="absolute top-5 left-5 right-5 flex items-center justify-between pointer-events-none z-20">
        {/* Left Group: Title Banner + Vehicle Bubble Switcher (Exactly where user requested in Image 2!) */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 pointer-events-auto">
          {/* Game Title Tag (Image 2) */}
          <div className="glass-panel px-3.5 py-1.5 rounded-xl border border-[#00E5FF]/30 flex items-center gap-2.5 backdrop-blur-xl bg-[#080C14]/90 shadow-2xl">
            <div className="w-2 h-2 rounded-full bg-[#00E5FF] animate-ping" />
            <div className="text-left font-mono">
              <div className="text-[9px] text-gray-400 uppercase tracking-widest leading-tight">ATELIER TUNING SUITE</div>
              <div className="text-[11px] font-bold text-white uppercase tracking-wider flex items-center gap-1.5 leading-tight">
                <span>{carModel === 'thar' ? 'MAHINDRA THAR 4X4 • AUTHENTIC SPEC' : 'FERRARI 458 GT3 • SUPERCAR ATELIER'}</span>
                <span className="text-[8px] px-1.5 py-0.2 rounded-full bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40 font-mono font-bold">
                  {carModel === 'thar' ? '4X4 SUV' : 'SUPERCAR'}
                </span>
              </div>
            </div>
          </div>

          {/* THE 2 INDIVIDUAL VEHICLE BUBBLES - ONLY 3D CAR MODEL INSIDE, ZERO WORDS */}
          <div className="flex items-center gap-3.5">
            {/* Thar Individual Circular Bubble */}
            <button
              onClick={() => handleSelectVehicle('thar')}
              className={`relative w-[76px] h-[76px] sm:w-[84px] sm:h-[84px] shrink-0 rounded-full overflow-hidden transition-all duration-300 cursor-pointer flex items-center justify-center ${
                carModel === 'thar'
                  ? 'border-2 border-[#00E5FF] shadow-[0_0_28px_rgba(0,229,255,0.7)] ring-2 ring-[#00E5FF]/70 bg-gradient-to-b from-[#00E5FF]/25 to-[#080C14] scale-105'
                  : 'border-2 border-white/30 hover:border-[#00E5FF]/70 bg-[#080C14]/90 opacity-80 hover:opacity-100 hover:scale-105 shadow-xl'
              }`}
              title="Mahindra Thar 4x4"
            >
              <div className="w-full h-full pointer-events-none flex items-center justify-center">
                <MiniBubbleCarCanvas model="thar" />
              </div>
            </button>

            {/* Supercar Individual Circular Bubble */}
            <button
              onClick={() => handleSelectVehicle('ferrari')}
              className={`relative w-[76px] h-[76px] sm:w-[84px] sm:h-[84px] shrink-0 rounded-full overflow-hidden transition-all duration-300 cursor-pointer flex items-center justify-center ${
                carModel === 'ferrari'
                  ? 'border-2 border-[#00E5FF] shadow-[0_0_28px_rgba(0,229,255,0.7)] ring-2 ring-[#00E5FF]/70 bg-gradient-to-b from-[#00E5FF]/25 to-[#080C14] scale-105'
                  : 'border-2 border-white/30 hover:border-[#00E5FF]/70 bg-[#080C14]/90 opacity-80 hover:opacity-100 hover:scale-105 shadow-xl'
              }`}
              title="Ferrari 458 Supercar"
            >
              <div className="w-full h-full pointer-events-none flex items-center justify-center">
                <MiniBubbleCarCanvas model="ferrari" />
              </div>
            </button>
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
              className="px-3 py-1 rounded-xl text-xs font-heading font-extrabold uppercase border border-[#00E5FF]/50 bg-black/85 text-[#00E5FF] hover:bg-[#00E5FF]/20 hover:text-white transition-all shadow-[0_0_15px_rgba(0,229,255,0.25)] flex items-center gap-1.5 cursor-pointer backdrop-blur-md"
            >
              <span>🔬 3D Model Sandbox</span>
            </button>
          )}
        </div>
      </div>

      {/* RIGHT-SIDE COMPACT GAMING TUNING HUD (FITS ENTIRELY ON SCREEN - ZERO SCROLLING NEEDED) */}
      <div className="absolute top-20 right-5 w-[330px] sm:w-[355px] z-30 pointer-events-auto flex flex-col">
        <div className="glass-panel p-3 sm:p-3.5 rounded-2xl border border-[#00E5FF]/40 backdrop-blur-2xl bg-[#080C14]/92 shadow-[0_0_35px_rgba(0,0,0,0.85)] flex flex-col gap-2 max-h-[calc(100vh-120px)] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
            <div className="flex items-center gap-1.5">
              <Crosshair className="w-3.5 h-3.5 text-[#00E5FF] animate-spin" style={{ animationDuration: '10s' }} />
              <span className="text-xs font-heading font-black tracking-widest uppercase text-white">
                TUNING HUD
              </span>
            </div>
            <span className="text-[9px] font-mono text-[#00E5FF] font-bold px-2 py-0.5 rounded bg-[#00E5FF]/10 border border-[#00E5FF]/30">
              {carModel === 'thar' ? '🚙 THAR 4X4' : '🏎️ SUPERCAR'}
            </span>
          </div>

          {/* Standalone 3D Parts Studio (Alone in widget, 360 spin & drag) */}
          <MiniWheelTurntable
            wheelType={wheelType}
            setWheelType={setWheelType}
            onOpenSandbox={onOpenSandbox}
          />

          {/* Gaming Segmented Navigation Tabs */}
          <div className="grid grid-cols-3 gap-1 text-[10px] font-heading font-extrabold uppercase">
            {[
              { id: 'paint', label: '🎨 Paint' },
              { id: 'controls', label: '⚙️ Controls' },
              { id: 'mods', label: '📦 Upgrades' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  playUiSound('tab');
                  setActiveTab(tab.id);
                }}
                className={`py-1.5 px-1 rounded-xl border text-center transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-[#00E5FF] bg-[#00E5FF]/20 text-white shadow-[0_0_10px_rgba(0,229,255,0.3)]'
                    : 'border-white/10 text-gray-400 hover:text-white bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: PAINT SWATCHES (COMPACT, NO SCROLLING) */}
          {activeTab === 'paint' && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[9px] font-mono">
                <span className="text-gray-400 font-bold uppercase">FINISH:</span>
                <span className="text-[#00E5FF] font-bold">
                  {activeColors.find((c) => c.hex === carColor)?.name || 'Custom'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 max-h-[145px] overflow-y-auto pr-0.5 scrollbar-none">
                {activeColors.map((c) => {
                  const isSelected = carColor === c.hex;
                  return (
                    <button
                      key={c.hex}
                      onClick={() => {
                        playUiSound('spin');
                        setCarColor(c.hex);
                      }}
                      className={`p-1.5 rounded-lg border text-left flex items-center gap-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#00E5FF] bg-[#00E5FF]/25 text-white font-bold shadow-[0_0_8px_rgba(0,229,255,0.4)]'
                          : 'border-white/10 text-gray-300 hover:text-white bg-white/5'
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full shrink-0 border border-white/40 shadow"
                        style={{ backgroundColor: c.displayHex }}
                      />
                      <div className="leading-none truncate text-[9px] font-mono font-bold">
                        {c.name}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: CONTROLS & HOIST (2x2 GRID, NO SCROLLING) */}
          {activeTab === 'controls' && (
            <div className="grid grid-cols-2 gap-1.5">
              {/* Hydraulic Hoist */}
              <button
                onClick={() => {
                  playUiSound('toggle');
                  setLiftActive(!liftActive);
                }}
                className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  liftActive
                    ? 'border-[#00E5FF] bg-[#00E5FF]/20 text-white shadow-[0_0_10px_rgba(0,229,255,0.3)]'
                    : 'border-white/10 bg-white/5 text-gray-300 hover:text-white'
                }`}
              >
                <div className="text-[10px] font-mono font-bold">Hydraulic Lift</div>
                <div className="text-[8px] text-[#00E5FF] mt-1">{liftActive ? 'ELEVATED +0.8M' : 'GROUNDED'}</div>
              </button>

              {/* 360 Turntable */}
              <button
                onClick={() => {
                  playUiSound('toggle');
                  setAutoRotate(!autoRotate);
                }}
                className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  autoRotate
                    ? 'border-[#00E5FF] bg-[#00E5FF]/20 text-white shadow-[0_0_10px_rgba(0,229,255,0.3)]'
                    : 'border-white/10 bg-white/5 text-gray-300 hover:text-white'
                }`}
              >
                <div className="text-[10px] font-mono font-bold">360° Turntable</div>
                <div className="text-[8px] text-[#00E5FF] mt-1">{autoRotate ? 'ACTIVE SPIN' : 'PAUSED'}</div>
              </button>

              {/* Headlights */}
              <button
                onClick={() => {
                  playUiSound('toggle');
                  setHeadlights(!headlights);
                }}
                className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  headlights
                    ? 'border-[#00E5FF] bg-[#00E5FF]/20 text-white shadow-[0_0_10px_rgba(0,229,255,0.3)]'
                    : 'border-white/10 bg-white/5 text-gray-300 hover:text-white'
                }`}
              >
                <div className="text-[10px] font-mono font-bold">Headlight Beams</div>
                <div className="text-[8px] text-[#00E5FF] mt-1">{headlights ? 'ON' : 'OFF'}</div>
              </button>

              {/* Neon Underglow */}
              <button
                onClick={() => {
                  playUiSound('toggle');
                  setUnderglow(!underglow);
                }}
                className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  underglow
                    ? 'border-[#00E5FF] bg-[#00E5FF]/20 text-white shadow-[0_0_10px_rgba(0,229,255,0.3)]'
                    : 'border-white/10 bg-white/5 text-gray-300 hover:text-white'
                }`}
              >
                <div className="text-[10px] font-mono font-bold">Chassis Underglow</div>
                <div className="text-[8px] text-[#00E5FF] mt-1">{underglow ? 'ILLUMINATED' : 'OFF'}</div>
              </button>
            </div>
          )}

          {/* TAB 3: UPGRADES (CLEAN COMPACT LIST, NO BARS, NO SCROLLING) */}
          {activeTab === 'mods' && (
            <div className="space-y-1 max-h-[145px] overflow-y-auto pr-0.5 scrollbar-none">
              {modsList.map((mod) => {
                const isChecked = !!selectedMods[mod.id];
                return (
                  <div
                    key={mod.id}
                    onClick={() => toggleMod(mod.id)}
                    className={`px-2.5 py-1.5 rounded-lg border text-left transition-all cursor-pointer flex items-center justify-between ${
                      isChecked
                        ? 'border-[#00E5FF]/60 bg-[#00E5FF]/15 text-white'
                        : 'border-white/10 bg-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <div className={`w-1.5 h-1.5 rounded-full ${isChecked ? 'bg-[#00E5FF]' : 'bg-gray-600'}`} />
                      <span className="text-[9px] font-mono font-bold truncate">{mod.name}</span>
                    </div>
                    <span className="text-[7px] font-mono font-bold px-1 py-0.2 rounded bg-black/40 text-[#00E5FF] border border-[#00E5FF]/30">
                      {mod.badge}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* COMMISSION CTA BUTTON */}
          <div className="pt-1.5 border-t border-white/10">
            <button
              onClick={() => {
                playUiSound('click');
                if (onOpenBooking) onOpenBooking();
              }}
              className="w-full py-2.5 rounded-xl font-heading font-black text-xs uppercase tracking-wider bg-gradient-to-r from-[#00E5FF] to-[#0284C7] text-black hover:text-white shadow-[0_0_20px_rgba(0,229,255,0.4)] hover:shadow-[0_0_30px_rgba(0,229,255,0.7)] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>COMMISSION SPECIFICATION</span>
              <Zap className="w-3.5 h-3.5 fill-current" />
            </button>
          </div>
        </div>

        {/* BOTTOM GAMEPAD CONTROLLER HINTS */}
        <div className="mt-1.5 text-center text-[9px] font-mono text-gray-400 bg-black/70 px-3 py-1 rounded-xl border border-white/10 backdrop-blur-md">
          <span className="text-[#00E5FF] font-bold">[L-CLICK + DRAG]</span> 360° ORBIT • <span className="text-[#38BDF8] font-bold">[SCROLL]</span> ZOOM
        </div>
      </div>

      {/* Bottom Vignette */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#070A10] to-transparent pointer-events-none" />
    </div>
  );
}
