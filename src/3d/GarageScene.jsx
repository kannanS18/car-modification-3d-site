import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Text } from '@react-three/drei';
import * as THREE from 'three';

// Procedural Roof LED Light Bar
function LedLightBar({ active, lightColor = '#FFFFFF' }) {
  if (!active) return null;
  return (
    <group position={[0, 1.35, 0.2]}>
      {/* Black aluminum housing */}
      <mesh>
        <boxGeometry args={[1.2, 0.1, 0.12]} />
        <meshStandardMaterial color="#111111" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Glowing LED chips strip */}
      <mesh position={[0, 0, 0.055]}>
        <boxGeometry args={[1.15, 0.06, 0.02]} />
        <meshBasicMaterial color={lightColor} />
      </mesh>
      {/* High-intensity forward floodlight */}
      <spotLight
        color={lightColor}
        intensity={6}
        distance={15}
        angle={0.65}
        penumbra={0.4}
        position={[0, 0, 0.2]}
        target-position={[0, -0.5, 8]}
      />
    </group>
  );
}

// Procedural Off-Road Front Bull Bar with Tow Hooks
function BullBar({ active }) {
  if (!active) return null;
  const steelMat = new THREE.MeshStandardMaterial({ color: '#1A1A1A', metalness: 0.85, roughness: 0.3 });
  const redHookMat = new THREE.MeshStandardMaterial({ color: '#DC2626', metalness: 0.6, roughness: 0.2 });

  return (
    <group position={[0, 0.15, 2.15]}>
      {/* Main horizontal tubular bar */}
      <mesh material={steelMat}>
        <cylinderGeometry args={[0.045, 0.045, 1.7, 16]} rotation={[0, 0, Math.PI / 2]} />
      </mesh>
      {/* Top upper nudge bar hoop */}
      <mesh position={[0, 0.25, -0.05]} material={steelMat}>
        <cylinderGeometry args={[0.04, 0.04, 0.9, 16]} rotation={[0, 0, Math.PI / 2]} />
      </mesh>
      {/* Left/Right upright posts */}
      <mesh position={[-0.45, 0.12, -0.05]} material={steelMat}>
        <cylinderGeometry args={[0.04, 0.04, 0.3, 16]} />
      </mesh>
      <mesh position={[0.45, 0.12, -0.05]} material={steelMat}>
        <cylinderGeometry args={[0.04, 0.04, 0.3, 16]} />
      </mesh>
      {/* Winch Box in center */}
      <mesh position={[0, -0.05, 0.05]}>
        <boxGeometry args={[0.4, 0.2, 0.2]} />
        <meshStandardMaterial color="#262626" metalness={0.9} />
      </mesh>
      {/* Red D-Ring Recovery Shackles */}
      <mesh position={[-0.55, -0.08, 0.12]} material={redHookMat}>
        <torusGeometry args={[0.06, 0.018, 12, 24]} />
      </mesh>
      <mesh position={[0.55, -0.08, 0.12]} material={redHookMat}>
        <torusGeometry args={[0.06, 0.018, 12, 24]} />
      </mesh>
    </group>
  );
}

// Procedural High-Output Boot Audio Subwoofer Enclosure ("extra speakers")
function SubwooferEnclosure({ active, pulseIntensity = 1.0 }) {
  if (!active) return null;
  const boxMat = new THREE.MeshStandardMaterial({ color: '#161616', roughness: 0.8 });
  const coneMat = new THREE.MeshStandardMaterial({ color: '#FF4D00', metalness: 0.4, roughness: 0.3 });
  const magnetMat = new THREE.MeshStandardMaterial({ color: '#111111', metalness: 0.9, roughness: 0.1 });

  return (
    <group position={[0, 0.7, -1.3]} scale={0.7}>
      {/* Custom Subwoofer Carpeted Box */}
      <mesh material={boxMat}>
        <boxGeometry args={[1.4, 0.7, 0.6]} />
      </mesh>
      {/* Dual 12-inch Subwoofer Cones */}
      {[-0.38, 0.38].map((x, i) => (
        <group key={i} position={[x, 0, 0.31]} rotation={[Math.PI / 2, 0, 0]}>
          {/* Outer Basket Ring with RGB LED glow */}
          <mesh>
            <torusGeometry args={[0.26, 0.025, 16, 32]} />
            <meshBasicMaterial color="#FF4D00" />
          </mesh>
          {/* Subwoofer Inverted Cone */}
          <mesh material={coneMat} position={[0, 0, -0.04]}>
            <coneGeometry args={[0.24, 0.14, 32]} />
          </mesh>
          {/* Dust Cap */}
          <mesh material={magnetMat} position={[0, 0, 0.04]}>
            <sphereGeometry args={[0.08, 16, 16]} />
          </mesh>
        </group>
      ))}
      {/* Subwoofer Ambient Bass Glow */}
      <pointLight color="#FF4D00" intensity={3 * pulseIntensity} distance={2} position={[0, 0, 0.4]} />
    </group>
  );
}

// Procedural Roof Expedition Rack with Jerry Cans
function RoofRack({ active }) {
  if (!active) return null;
  const rackMat = new THREE.MeshStandardMaterial({ color: '#1F1F1F', metalness: 0.85, roughness: 0.3 });
  return (
    <group position={[0, 1.4, -0.2]}>
      {/* Main tubular basket perimeter */}
      <mesh material={rackMat}>
        <boxGeometry args={[1.35, 0.12, 1.8]} />
      </mesh>
      {/* Jerry Cans (Red & Army Green) */}
      <mesh position={[-0.35, 0.18, -0.3]}>
        <boxGeometry args={[0.22, 0.32, 0.38]} />
        <meshStandardMaterial color="#DC2626" roughness={0.4} />
      </mesh>
      <mesh position={[-0.08, 0.18, -0.3]}>
        <boxGeometry args={[0.22, 0.32, 0.38]} />
        <meshStandardMaterial color="#2E4A2E" roughness={0.4} />
      </mesh>
    </group>
  );
}

// Outdoor Road & Modern City Buildings
function OutdoorEnvironment() {
  const buildingColors = ['#1E222B', '#15171C', '#282C37', '#1A1D24'];

  const buildings = useMemo(() => {
    const list = [];
    // Left side skyline
    for (let z = 30; z > -15; z -= 7) {
      list.push({
        pos: [-9, 7 + (z % 5) * 2, z],
        size: [5, 14 + (z % 4) * 3, 5],
        color: buildingColors[Math.abs(z) % buildingColors.length],
      });
    }
    // Right side skyline
    for (let z = 30; z > 5; z -= 7) {
      list.push({
        pos: [9, 7 + (z % 4) * 2, z],
        size: [5, 12 + (z % 5) * 3, 5],
        color: buildingColors[(Math.abs(z) + 1) % buildingColors.length],
      });
    }
    return list;
  }, []);

  return (
    <group>
      {/* Main Indian Highway Asphalt Road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 15]}>
        <planeGeometry args={[10, 50]} />
        <meshStandardMaterial color="#1C1D21" roughness={0.8} />
      </mesh>

      {/* Yellow Centerline Road Markings */}
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 35 - i * 4]}>
          <planeGeometry args={[0.22, 2.2]} />
          <meshBasicMaterial color="#EAB308" />
        </mesh>
      ))}

      {/* White Shoulder Lines */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-4.5, 0.005, 15]}>
        <planeGeometry args={[0.2, 50]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[4.5, 0.005, 15]}>
        <planeGeometry args={[0.2, 50]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>

      {/* Sidewalks */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-5.6, 0.08, 15]}>
        <planeGeometry args={[2, 50]} />
        <meshStandardMaterial color="#475569" roughness={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[5.6, 0.08, 15]}>
        <planeGeometry args={[2, 50]} />
        <meshStandardMaterial color="#475569" roughness={0.9} />
      </mesh>

      {/* Buildings along the street */}
      {buildings.map((b, i) => (
        <mesh key={i} position={b.pos}>
          <boxGeometry args={b.size} />
          <meshStandardMaterial color={b.color} metalness={0.5} roughness={0.4} />
        </mesh>
      ))}

      {/* Street Lamps along the highway */}
      {[25, 15, 5].map((z, i) => (
        <group key={i} position={[-4.8, 0, z]}>
          <mesh position={[0, 2.5, 0]}>
            <cylinderGeometry args={[0.05, 0.06, 5, 12]} />
            <meshStandardMaterial color="#334155" metalness={0.8} />
          </mesh>
          <mesh position={[0.5, 4.9, 0]} rotation={[0, 0, -Math.PI / 4]}>
            <cylinderGeometry args={[0.04, 0.04, 1.2, 12]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
          <pointLight color="#FEF08A" intensity={3} distance={9} position={[1, 5.2, 0]} />
        </group>
      ))}
    </group>
  );
}

// Indoor Real-Life Modification Garage & Hydraulic Hoist
function GarageWorkshop({ liftHeight = 0 }) {
  const concreteMat = new THREE.MeshStandardMaterial({ color: '#121316', roughness: 0.3, metalness: 0.5 });
  const wallMat = new THREE.MeshStandardMaterial({ color: '#1B1C22', roughness: 0.7 });
  const yellowHazardMat = new THREE.MeshStandardMaterial({ color: '#EAB308', metalness: 0.6, roughness: 0.3 });
  const blueHoistMat = new THREE.MeshStandardMaterial({ color: '#1D4ED8', metalness: 0.8, roughness: 0.2 });

  return (
    <group position={[0, 0, -18]}>
      {/* Epoxy Garage Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[24, 26]} />
        <primitive object={concreteMat} />
      </mesh>

      {/* Back Wall */}
      <mesh position={[0, 6, -13]}>
        <planeGeometry args={[24, 12]} />
        <primitive object={wallMat} />
      </mesh>

      {/* Left Wall with Industrial Tool Racks */}
      <mesh position={[-12, 6, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[26, 12]} />
        <primitive object={wallMat} />
      </mesh>

      {/* Right Wall */}
      <mesh position={[12, 6, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[26, 12]} />
        <primitive object={wallMat} />
      </mesh>

      {/* Front Garage Shutter Portal Frame */}
      <group position={[0, 4.5, 12.8]}>
        <mesh>
          <boxGeometry args={[14, 1.5, 0.5]} />
          <meshStandardMaterial color="#2B2D35" metalness={0.8} />
        </mesh>
        {/* Glowing Sign */}
        <mesh position={[0, 0, 0.3]}>
          <planeGeometry args={[8, 0.8]} />
          <meshBasicMaterial color="#FF4D00" />
        </mesh>
      </group>

      {/* 2-POST HYDRAULIC VEHICLE LIFT */}
      <group position={[0, 0, 0]}>
        {/* Left Heavy Steel Post */}
        <mesh position={[-2.4, 3, 0]} material={blueHoistMat}>
          <boxGeometry args={[0.45, 6, 0.45]} />
        </mesh>
        {/* Right Heavy Steel Post */}
        <mesh position={[2.4, 3, 0]} material={blueHoistMat}>
          <boxGeometry args={[0.45, 6, 0.45]} />
        </mesh>
        {/* Top Connecting Overhead Crossbeam */}
        <mesh position={[0, 5.8, 0]} material={blueHoistMat}>
          <boxGeometry args={[5.2, 0.35, 0.45]} />
        </mesh>

        {/* Elevating Hoist Carriages & Swing Arms (moves with liftHeight) */}
        <group position={[0, liftHeight, 0]}>
          {/* Left Lift Cradle */}
          <mesh position={[-2.2, 0.15, 0]} material={yellowHazardMat}>
            <boxGeometry args={[0.3, 0.4, 0.6]} />
          </mesh>
          {/* Right Lift Cradle */}
          <mesh position={[2.2, 0.15, 0]} material={yellowHazardMat}>
            <boxGeometry args={[0.3, 0.4, 0.6]} />
          </mesh>
          {/* Left Front/Rear Support Arms */}
          <mesh position={[-1.3, 0.1, 0.8]} rotation={[0, 0.4, 0]} material={yellowHazardMat}>
            <boxGeometry args={[1.6, 0.12, 0.16]} />
          </mesh>
          <mesh position={[-1.3, 0.1, -0.8]} rotation={[0, -0.4, 0]} material={yellowHazardMat}>
            <boxGeometry args={[1.6, 0.12, 0.16]} />
          </mesh>
          {/* Right Front/Rear Support Arms */}
          <mesh position={[1.3, 0.1, 0.8]} rotation={[0, -0.4, 0]} material={yellowHazardMat}>
            <boxGeometry args={[1.6, 0.12, 0.16]} />
          </mesh>
          <mesh position={[1.3, 0.1, -0.8]} rotation={[0, 0.4, 0]} material={yellowHazardMat}>
            <boxGeometry args={[1.6, 0.12, 0.16]} />
          </mesh>
        </group>
      </group>

      {/* Industrial Garage Tool Trolleys & Workbenches */}
      <group position={[-9.5, 0.6, -6]}>
        <mesh>
          <boxGeometry args={[1.4, 1.2, 3.5]} />
          <meshStandardMaterial color="#DC2626" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>
      <group position={[9.5, 0.6, -6]}>
        <mesh>
          <boxGeometry args={[1.4, 1.2, 3.5]} />
          <meshStandardMaterial color="#2563EB" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>

      {/* Dyno Rollers Plate in Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[4, 5.5]} />
        <meshStandardMaterial color="#0A0B0E" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Overhead Fluorescent & Spot Lighting inside garage */}
      <pointLight color="#FFFFFF" intensity={4} distance={14} position={[0, 5, 0]} />
      <pointLight color="#FF4D00" intensity={3} distance={8} position={[0, 2.5, -8]} />
      <spotLight color="#FFFFFF" intensity={6} angle={0.8} penumbra={0.3} position={[0, 7, 0]} target-position={[0, 0, 0]} />
    </group>
  );
}

export function GarageScene({
  scrollProgress = 0,
  carModel = 'thar', // 'thar' | 'ferrari'
  carColor = '#FF4D00',
  wheelFinish = 'gold',
  tireType = 'offroad', // 'offroad' | 'track' | 'forged'
  ledBarActive = true,
  bullBarActive = true,
  subwooferActive = true,
  roofRackActive = true,
  liftActive = false,
  underglow = true,
  headlights = true,
  drlColor = '#FFFFFF',
}) {
  const carGroupRef = useRef();

  // Load models using Vite base URL for GitHub Pages compatibility
  const baseUrl = import.meta.env.BASE_URL || '/';
  const tharGLTF = useGLTF(`${baseUrl}models/thar_4x4.glb`);
  const ferrariGLTF = useGLTF(`${baseUrl}models/ferrari.glb`);

  const tharScene = useMemo(() => tharGLTF.scene.clone(true), [tharGLTF.scene]);
  const ferrariScene = useMemo(() => ferrariGLTF.scene.clone(true), [ferrariGLTF.scene]);

  // Materials
  const carPaintMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(carColor),
    metalness: 0.8,
    roughness: 0.2,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    reflectivity: 0.9,
  }), [carColor]);

  const wheelMat = useMemo(() => {
    let hex = '#D4AF37';
    if (wheelFinish === 'black') hex = '#161616';
    if (wheelFinish === 'silver') hex = '#E2E8F0';
    return new THREE.MeshStandardMaterial({ color: new THREE.Color(hex), metalness: 0.9, roughness: 0.2 });
  }, [wheelFinish]);

  const headlightMat = useMemo(() => new THREE.MeshBasicMaterial({
    color: headlights ? new THREE.Color(drlColor) : new THREE.Color('#333333'),
  }), [headlights, drlColor]);

  // Apply materials to Thar model
  useEffect(() => {
    tharScene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.name.toLowerCase().includes('body') && !child.name.toLowerCase().includes('glass')) {
          child.material = carPaintMaterial;
        } else if (child.name.toLowerCase().includes('wheel') || child.name.toLowerCase().includes('rim')) {
          child.material = wheelMat;
        } else if (child.name.toLowerCase().includes('headlight')) {
          child.material = headlightMat;
        }
      }
    });
  }, [tharScene, carPaintMaterial, wheelMat, headlightMat]);

  // Apply materials to Ferrari model
  useEffect(() => {
    ferrariScene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.name === 'body' || child.material?.name === 'Body_Color') {
          child.material = carPaintMaterial;
        } else if (child.name.includes('rim') || child.name.includes('wheel')) {
          child.material = wheelMat;
        } else if (child.name.includes('light') || child.name === 'leds') {
          child.material = headlightMat;
        }
      }
    });
  }, [ferrariScene, carPaintMaterial, wheelMat, headlightMat]);

  // Current Lift Elevation
  const liftHeight = liftActive ? 1.6 : 0;

  // Frame animation: Scroll-driven car motion & wheel rotation
  useFrame((state, delta) => {
    if (!carGroupRef.current) return;

    // t goes from 0 (highway start) to 1 (parked on workshop lift)
    const t = Math.max(0, Math.min(1, scrollProgress));

    // Road starts at z = 22, garage center is at z = -18
    let targetZ;
    let targetX = 0;
    let targetRotY = 0;

    if (t < 0.4) {
      // Stage 1: Driving straight on highway
      const subT = t / 0.4;
      targetZ = THREE.MathUtils.lerp(22, 5, subT);
      targetX = 0;
      targetRotY = 0;
    } else if (t < 0.75) {
      // Stage 2: Approaching and entering garage gate (z = 5 to z = -12)
      const subT = (t - 0.4) / 0.35;
      targetZ = THREE.MathUtils.lerp(5, -12, subT);
      // Slight swerve / alignment into garage bay
      targetX = Math.sin(subT * Math.PI) * 0.4;
      targetRotY = Math.sin(subT * Math.PI) * 0.08;
    } else {
      // Stage 3: Rolling smoothly onto hydraulic hoist inside garage (z = -12 to z = -18)
      const subT = (t - 0.75) / 0.25;
      targetZ = THREE.MathUtils.lerp(-12, -18, subT);
      targetX = 0;
      targetRotY = 0;
    }

    // Smooth lerp car position
    carGroupRef.current.position.z = THREE.MathUtils.lerp(carGroupRef.current.position.z, targetZ, 0.1);
    carGroupRef.current.position.x = THREE.MathUtils.lerp(carGroupRef.current.position.x, targetX, 0.1);
    carGroupRef.current.rotation.y = THREE.MathUtils.lerp(carGroupRef.current.rotation.y, targetRotY, 0.1);

    // Car elevates on hydraulic lift when docked in garage
    const targetY = (t > 0.85 && liftActive) ? 1.6 : 0;
    carGroupRef.current.position.y = THREE.MathUtils.lerp(carGroupRef.current.position.y, targetY, 0.08);

    // Spin wheels while driving
    if (t < 0.85) {
      const spinSpeed = (1 - t * 0.8) * delta * 25;
      const targetScene = carModel === 'thar' ? tharScene : ferrariScene;
      targetScene.traverse((child) => {
        if (child.name.toLowerCase().includes('wheel')) {
          child.rotation.x += spinSpeed;
        }
      });
    }
  });

  return (
    <group>
      {/* 3D Highway & Skyline */}
      <OutdoorEnvironment />

      {/* 3D Modification Garage & Hydraulic Hoist */}
      <GarageWorkshop liftHeight={liftHeight} />

      {/* Moving Car Container */}
      <group ref={carGroupRef} position={[0, 0, 22]}>
        {carModel === 'thar' ? (
          <group scale={1.05} position={[0, 0.42, 0]}>
            <primitive object={tharScene} />
            {/* Custom Thar Modification Accessories */}
            <LedLightBar active={ledBarActive} lightColor={drlColor} />
            <BullBar active={bullBarActive} />
            <SubwooferEnclosure active={subwooferActive} />
            <RoofRack active={roofRackActive} />
          </group>
        ) : (
          <group scale={0.9} position={[0, 0.05, 0]}>
            <primitive object={ferrariScene} />
            <SubwooferEnclosure active={subwooferActive} />
          </group>
        )}

        {/* Headlight Beams */}
        {headlights && (
          <group position={[0, 0.6, 2.3]}>
            <spotLight color={drlColor} intensity={5} angle={0.55} penumbra={0.4} position={[-0.6, 0, 0]} target-position={[-0.6, -0.4, 8]} />
            <spotLight color={drlColor} intensity={5} angle={0.55} penumbra={0.4} position={[0.6, 0, 0]} target-position={[0.6, -0.4, 8]} />
          </group>
        )}

        {/* Neon Underglow Kit */}
        {underglow && (
          <pointLight color={carColor} intensity={5} distance={3.8} decay={2} position={[0, 0.1, 0]} />
        )}
      </group>
    </group>
  );
}

const preloadBase = import.meta.env.BASE_URL || '/';
useGLTF.preload(`${preloadBase}models/thar_4x4.glb`);
useGLTF.preload(`${preloadBase}models/ferrari.glb`);
