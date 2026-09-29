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
// ==========================================
// BESPOKE 3D OFF-ROAD WHEEL & TYRE PACKAGES
// ==========================================
function Bespoke3DWheelSet({ wheelType }) {
  if (!wheelType || wheelType === 'oem') return null;

  // 5 Axle Hub Coordinates on Thar in local Thar coordinates
  const hubs = [
    { id: 'FL', pos: [-0.620, -0.245, -0.357], rotY: Math.PI, isSpare: false },
    { id: 'FR', pos: [-0.620, -0.245, 0.352], rotY: 0, isSpare: false },
    { id: 'RL', pos: [0.508, -0.245, -0.356], rotY: Math.PI, isSpare: false },
    { id: 'RR', pos: [0.508, -0.245, 0.351], rotY: 0, isSpare: false },
    { id: 'Spare', pos: [0.905, 0.070, -0.001], rotY: Math.PI / 2, isSpare: true },
  ];

  const isBronze = wheelType === 'dakar_bronze';
  const isTitanium = wheelType === 'titanium_spider';

  const rimColor = isBronze ? '#8C6832' : isTitanium ? '#A0ABBA' : '#141517';
  const rimMetalness = isBronze ? 0.85 : isTitanium ? 0.95 : 0.75;
  const rimRoughness = isBronze ? 0.32 : isTitanium ? 0.20 : 0.45;
  const beadlockColor = isBronze ? '#1F2024' : isTitanium ? '#E2E8F0' : '#DC2626';

  return (
    <group>
      {hubs.map((hub) => (
        <group key={hub.id} position={hub.pos} rotation={[0, hub.rotY, 0]}>
          {/* Main Vulcanized Rubber Tyre Tread */}
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.163, 0.163, 0.098, 32]} />
            <meshStandardMaterial color="#131416" roughness={0.92} metalness={0.02} />
          </mesh>

          {/* Outer & Inner Sidewall Shoulder Bevels */}
          <mesh position={[0, 0, 0.038]} rotation={[0, 0, 0]}>
            <torusGeometry args={[0.136, 0.027, 16, 32]} />
            <meshStandardMaterial color="#16171A" roughness={0.88} metalness={0.05} />
          </mesh>
          <mesh position={[0, 0, -0.038]} rotation={[0, 0, 0]}>
            <torusGeometry args={[0.136, 0.027, 16, 32]} />
            <meshStandardMaterial color="#16171A" roughness={0.88} metalness={0.05} />
          </mesh>

          {/* 3D Off-Road Knobby Tread Lugs around circumference */}
          {!isTitanium &&
            Array.from({ length: 18 }).map((_, li) => {
              const ang = (li / 18) * Math.PI * 2;
              return (
                <mesh
                  key={li}
                  position={[Math.cos(ang) * 0.162, Math.sin(ang) * 0.162, 0]}
                  rotation={[0, 0, ang]}
                  castShadow
                >
                  <boxGeometry args={[0.015, 0.009, 0.088]} />
                  <meshStandardMaterial color="#111214" roughness={0.95} metalness={0.01} />
                </mesh>
              );
            })}

          {/* Deep-Dish Inset Rim Barrel */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.104, 0.104, 0.088, 32, 1, true]} />
            <meshStandardMaterial color={rimColor} roughness={rimRoughness} metalness={rimMetalness} />
          </mesh>

          {/* Outer Rim Lip */}
          <mesh position={[0, 0, 0.046]} rotation={[0, 0, 0]}>
            <ringGeometry args={[0.096, 0.106, 32]} />
            <meshStandardMaterial color={beadlockColor} roughness={0.25} metalness={0.9} />
          </mesh>

          {/* 16 Beadlock Socket Screws */}
          {Array.from({ length: 16 }).map((_, bi) => {
            const bAng = (bi / 16) * Math.PI * 2;
            return (
              <mesh key={bi} position={[Math.cos(bAng) * 0.101, Math.sin(bAng) * 0.101, 0.048]}>
                <circleGeometry args={[0.003, 6]} />
                <meshStandardMaterial color="#E2E8F0" roughness={0.2} metalness={0.95} />
              </mesh>
            );
          })}

          {/* Rim Face / Spokes */}
          {isBronze ? (
            /* Dakar 8-Window Rally Dish */
            Array.from({ length: 8 }).map((_, si) => {
              const sAng = (si / 8) * Math.PI * 2;
              return (
                <group key={si} position={[0, 0, 0.038]} rotation={[0, 0, sAng]}>
                  <mesh position={[0, 0.052, 0]}>
                    <boxGeometry args={[0.024, 0.068, 0.010]} />
                    <meshStandardMaterial color={rimColor} roughness={rimRoughness} metalness={rimMetalness} />
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
                    <meshStandardMaterial color={rimColor} roughness={rimRoughness} metalness={rimMetalness} />
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
                    <meshStandardMaterial color={rimColor} roughness={rimRoughness} metalness={rimMetalness} />
                  </mesh>
                </group>
              );
            })
          )}

          {/* Center Hub & 5 Hex Lug Nuts */}
          <mesh position={[0, 0, 0.042]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.028, 0.028, 0.014, 24]} />
            <meshStandardMaterial color="#0E1013" roughness={0.4} metalness={0.7} />
          </mesh>
          {Array.from({ length: 5 }).map((_, ni) => {
            const nAng = (ni / 5) * Math.PI * 2;
            return (
              <mesh key={ni} position={[Math.cos(nAng) * 0.018, Math.sin(nAng) * 0.018, 0.046]}>
                <circleGeometry args={[0.0035, 6]} />
                <meshStandardMaterial color="#D4D4D8" roughness={0.2} metalness={0.95} />
              </mesh>
            );
          })}

          {/* Behind-the-Wheel Slotted Brake Rotor & Brembo Caliper (Running wheels only) */}
          {!hub.isSpare && (
            <group position={[0, 0, -0.016]}>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.082, 0.082, 0.006, 32]} />
                <meshStandardMaterial color="#94A3B8" roughness={0.25} metalness={0.95} />
              </mesh>
              <mesh position={[0.052, 0.052, 0]}>
                <boxGeometry args={[0.042, 0.048, 0.022]} />
                <meshStandardMaterial color="#E11D48" roughness={0.2} metalness={0.5} />
              </mesh>
            </group>
          )}
        </group>
      ))}
    </group>
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

  const isBronze = wheelType === 'dakar_bronze';
  const isTitanium = wheelType === 'titanium_spider';
  const isOEM = !wheelType || wheelType === 'oem';

  const rimColor = isBronze ? '#8C6832' : isTitanium ? '#A0ABBA' : '#141517';
  const rimMetalness = isBronze ? 0.85 : isTitanium ? 0.95 : 0.75;
  const rimRoughness = isBronze ? 0.32 : isTitanium ? 0.20 : 0.45;
  const beadlockColor = isBronze ? '#1F2024' : isTitanium ? '#E2E8F0' : '#DC2626';

  return (
    <group ref={meshRef} scale={1.05}>
      {/* Main Vulcanized Rubber Tyre */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.163, 0.163, 0.098, 32]} />
        <meshStandardMaterial color="#131416" roughness={0.92} metalness={0.02} />
      </mesh>

      {/* Sidewall Shoulders */}
      <mesh position={[0, 0, 0.038]}>
        <torusGeometry args={[0.136, 0.027, 16, 32]} />
        <meshStandardMaterial color="#16171A" roughness={0.88} metalness={0.05} />
      </mesh>
      <mesh position={[0, 0, -0.038]}>
        <torusGeometry args={[0.136, 0.027, 16, 32]} />
        <meshStandardMaterial color="#16171A" roughness={0.88} metalness={0.05} />
      </mesh>

      {/* 3D Knobby Lugs */}
      {!isTitanium && !isOEM &&
        Array.from({ length: 18 }).map((_, li) => {
          const ang = (li / 18) * Math.PI * 2;
          return (
            <mesh
              key={li}
              position={[Math.cos(ang) * 0.162, Math.sin(ang) * 0.162, 0]}
              rotation={[0, 0, ang]}
            >
              <boxGeometry args={[0.015, 0.009, 0.088]} />
              <meshStandardMaterial color="#111214" roughness={0.95} metalness={0.01} />
            </mesh>
          );
        })}

      {/* Rim Barrel */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.104, 0.104, 0.088, 32, 1, true]} />
        <meshStandardMaterial color={isOEM ? '#8E9AA8' : rimColor} roughness={rimRoughness} metalness={rimMetalness} />
      </mesh>

      {/* Outer Lip */}
      <mesh position={[0, 0, 0.046]}>
        <ringGeometry args={[0.096, 0.106, 32]} />
        <meshStandardMaterial color={isOEM ? '#CBD5E1' : beadlockColor} roughness={0.25} metalness={0.9} />
      </mesh>

      {/* 16 Screws for custom wheels */}
      {!isOEM &&
        Array.from({ length: 16 }).map((_, bi) => {
          const bAng = (bi / 16) * Math.PI * 2;
          return (
            <mesh key={bi} position={[Math.cos(bAng) * 0.101, Math.sin(bAng) * 0.101, 0.048]}>
              <circleGeometry args={[0.003, 6]} />
              <meshStandardMaterial color="#E2E8F0" roughness={0.2} metalness={0.95} />
            </mesh>
          );
        })}

      {/* Spokes */}
      {isBronze ? (
        Array.from({ length: 8 }).map((_, si) => {
          const sAng = (si / 8) * Math.PI * 2;
          return (
            <group key={si} position={[0, 0, 0.038]} rotation={[0, 0, sAng]}>
              <mesh position={[0, 0.052, 0]}>
                <boxGeometry args={[0.024, 0.068, 0.010]} />
                <meshStandardMaterial color={rimColor} roughness={rimRoughness} metalness={rimMetalness} />
              </mesh>
            </group>
          );
        })
      ) : isTitanium ? (
        Array.from({ length: 10 }).map((_, si) => {
          const sAng = (si / 10) * Math.PI * 2;
          return (
            <group key={si} position={[0, 0, 0.040]} rotation={[0, 0, sAng + 0.1]}>
              <mesh position={[0, 0.055, 0]}>
                <boxGeometry args={[0.014, 0.072, 0.008]} />
                <meshStandardMaterial color={rimColor} roughness={rimRoughness} metalness={rimMetalness} />
              </mesh>
            </group>
          );
        })
      ) : isOEM ? (
        Array.from({ length: 5 }).map((_, si) => {
          const sAng = (si / 5) * Math.PI * 2;
          return (
            <group key={si} position={[0, 0, 0.040]} rotation={[0, 0, sAng]}>
              <mesh position={[-0.01, 0.052, 0]}>
                <boxGeometry args={[0.012, 0.068, 0.008]} />
                <meshStandardMaterial color="#E2E8F0" roughness={0.15} metalness={0.95} />
              </mesh>
              <mesh position={[0.01, 0.052, 0]}>
                <boxGeometry args={[0.012, 0.068, 0.008]} />
                <meshStandardMaterial color="#1E293B" roughness={0.3} metalness={0.8} />
              </mesh>
            </group>
          );
        })
      ) : (
        Array.from({ length: 5 }).map((_, si) => {
          const sAng = (si / 5) * Math.PI * 2;
          return (
            <group key={si} position={[0, 0, 0.039]} rotation={[0, 0, sAng]}>
              <mesh position={[0, 0.050, 0]}>
                <boxGeometry args={[0.028, 0.068, 0.012]} />
                <meshStandardMaterial color={rimColor} roughness={rimRoughness} metalness={rimMetalness} />
              </mesh>
            </group>
          );
        })
      )}

      {/* Center Cap & Lug Nuts */}
      <mesh position={[0, 0, 0.042]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.028, 0.028, 0.014, 24]} />
        <meshStandardMaterial color="#0E1013" roughness={0.4} metalness={0.7} />
      </mesh>
      {Array.from({ length: 5 }).map((_, ni) => {
        const nAng = (ni / 5) * Math.PI * 2;
        return (
          <mesh key={ni} position={[Math.cos(nAng) * 0.018, Math.sin(nAng) * 0.018, 0.046]}>
            <circleGeometry args={[0.0035, 6]} />
            <meshStandardMaterial color="#D4D4D8" roughness={0.2} metalness={0.95} />
          </mesh>
        );
      })}

      {/* Slotted Brake Rotor & Red Brembo Caliper */}
      <group position={[0, 0, -0.016]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.082, 0.082, 0.006, 32]} />
          <meshStandardMaterial color="#94A3B8" roughness={0.25} metalness={0.95} />
        </mesh>
        <mesh position={[0.052, 0.052, 0]}>
          <boxGeometry args={[0.042, 0.048, 0.022]} />
          <meshStandardMaterial color="#E11D48" roughness={0.2} metalness={0.5} />
        </mesh>
      </group>
    </group>
  );
}

// Mini 3D Wheel Turntable for the Customization Panel
function MiniWheelTurntable({ wheelType, onOpenSandbox }) {
  const wheelLabels = {
    bfg_ko2: 'BFGoodrich T/A KO2 • Method Beadlock',
    dakar_bronze: 'Dakar Rally Stage • Satin Bronze',
    titanium_spider: 'Titanium 10-Spoke • Directional Sport',
    oem: 'Mahindra OEM Factory 18" Diamond-Cut',
  };

  return (
    <div className="bg-gradient-to-b from-black/95 to-[#121316] p-3 rounded-xl border border-[#FF4D00]/40 shadow-xl flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse" />
          <span className="text-[10px] font-mono font-bold tracking-widest text-white uppercase">
            STANDALONE 3D TYRE PREVIEW
          </span>
        </div>
        <span className="text-[9px] font-mono font-bold text-[#FF4D00] bg-[#FF4D00]/10 px-1.5 py-0.5 rounded border border-[#FF4D00]/30">
          360° SPIN
        </span>
      </div>

      {/* 3D Mini Viewport */}
      <div className="w-full h-28 rounded-lg bg-black/80 border border-white/10 relative overflow-hidden flex items-center justify-center">
        <Canvas camera={{ position: [0, 0, 0.46], fov: 45 }} gl={{ antialias: true, alpha: true }}>
          <ambientLight intensity={1.0} />
          <directionalLight position={[2, 3, 3]} intensity={2.2} />
          <directionalLight position={[-2, -2, -2]} intensity={0.9} color="#FF6B2B" />
          <SingleWheelDisplay wheelType={wheelType} />
        </Canvas>
        <div className="absolute bottom-1 right-2 text-[8px] font-mono text-gray-400 pointer-events-none">
          ISOLATED 3D MODEL
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
  const tharGLTF = useGLTF(`${baseUrl}models/thar_split.glb`);

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

  // Toggle OEM Wheels Visibility on Thar (Completely removes OEM tires when custom wheel is selected)
  useEffect(() => {
    tharScene.traverse((child) => {
      if (child.name === 'Thar_OEM_Wheels') {
        child.visible = (wheelType === 'oem');
      }
    });
  }, [tharScene, wheelType]);

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
            <Bespoke3DWheelSet wheelType={wheelType} />
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
  onOpenSandbox,
}) {
  const [activeCategory, setActiveCategory] = useState('wheels'); // 'wheels' | 'livery' | 'lighting' | 'chassis'

  // Performance Rating Scores (Dynamically calculated based on equipped mods)
  const stats = useMemo(() => {
    let traction = 78;
    if (wheelType === 'bfg_ko2' || wheelType === 'mud_beadlock') traction = 99;
    else if (wheelType === 'dakar_bronze') traction = 94;
    else if (wheelType === 'titanium_spider' || wheelType === 'titanium_alloy') traction = 88;

    let visibility = 60;
    if (headlights) visibility += 20;
    if (roofLights) visibility += 20;

    let clearance = liftActive ? '310 mm (+3.5")' : '226 mm (Stock)';

    return { traction, visibility, clearance };
  }, [wheelType, headlights, roofLights, liftActive]);

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
    {
      id: 'bfg_ko2',
      name: 'BFGoodrich T/A KO2 • Method Beadlock',
      specs: '17" Forged Rim • 285/75 R17 Rock-Crawler Lugs • Red Anodized Beadlock',
      traction: 99,
      tag: 'OFFROAD 99%',
      badge: 'MAX GRIP',
      swatch: '#DC2626',
      rimType: 'Matte Black Dish + Red Ring',
    },
    {
      id: 'dakar_bronze',
      name: 'Dakar Rally Stage • Satin Bronze Forged',
      specs: '17" Multi-Window Dish • 3-Ply Kevlar Mud-Terrain • Black Beadlock',
      traction: 94,
      tag: 'RALLY 94%',
      badge: 'RALLY SPEC',
      swatch: '#8C6832',
      rimType: 'Satin Bronze + Black Ring',
    },
    {
      id: 'titanium_spider',
      name: 'Titanium 10-Spoke • Directional Sport Alloy',
      specs: '18" Lightweight Titanium • All-Terrain Directional • Silver Machined Lip',
      traction: 88,
      tag: 'SPORT 88%',
      badge: 'PREMIUM',
      swatch: '#A0ABBA',
      rimType: 'Machined Titanium Finish',
    },
    {
      id: 'oem',
      name: 'Mahindra OEM Factory 18" Diamond-Cut',
      specs: '18" Stock Mahindra Factory Alloys • Highway Spec Dueler Rubber',
      traction: 78,
      tag: 'STOCK 78%',
      badge: 'OEM FACTORY',
      swatch: '#475569',
      rimType: 'Factory Diamond-Cut Spec',
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

        {/* Platform Vehicle Switcher & 3D Sandbox Quick Access */}
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

          <div className="flex items-center gap-1.5 glass-panel p-1 rounded-xl border border-[#FF4D00]/40 shadow-2xl bg-black/85">
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

          {/* STANDALONE 3D WHEEL & TYRE TURNTABLE (Replaced Stat Bar per user requirement) */}
          <MiniWheelTurntable wheelType={wheelType} onOpenSandbox={onOpenSandbox} />

          {/* REFINED CATEGORY NAVIGATION TABS */}
          <div className="grid grid-cols-4 gap-1 text-[10px] font-heading font-extrabold uppercase">
            {[
              { id: 'wheels', label: '🛞 Tyres' },
              { id: 'livery', label: '🎨 Livery' },
              { id: 'lighting', label: '💡 Lights' },
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

          {/* TAB CONTENT: 1. 3D WHEELS & TYRES SHOWCASE */}
          {activeCategory === 'wheels' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase font-mono tracking-wider">
                  3D WHEEL & TYRE PACKAGES:
                </span>
                <span className="text-[9px] font-mono text-[#00E5FF] bg-[#00E5FF]/10 px-2 py-0.5 rounded border border-[#00E5FF]/30">
                  4 HUBS + SPARE
                </span>
              </div>
              <p className="text-[10px] text-gray-400 leading-relaxed font-body">
                Equipping a package unmounts the factory OEM tyres and locks authentic 3D forged wheels onto all axle hubs.
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
                      {/* Active Glow Accent Strip */}
                      {isSelected && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FF4D00] shadow-[0_0_8px_#FF4D00]" />
                      )}

                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          {/* Wheel Color & Rim Swatch */}
                          <div
                            className="w-7 h-7 rounded-lg border-2 border-white/20 shrink-0 flex items-center justify-center shadow-md"
                            style={{ backgroundColor: w.colorHex }}
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

                        {/* Traction Score Tag */}
                        <div className="text-right shrink-0">
                          <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                            isSelected ? 'bg-[#FF4D00] text-white' : 'bg-white/10 text-gray-300'
                          }`}>
                            {w.badge}
                          </span>
                        </div>
                      </div>

                      {/* Specs description */}
                      <div className="text-[9px] text-gray-400 mt-2 font-mono">
                        {w.specs}
                      </div>

                      {/* Grip Bar & Action Row */}
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
