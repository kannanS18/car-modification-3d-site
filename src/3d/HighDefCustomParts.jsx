import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Shared rubber material (created once, reused by all tyre instances)
const sharedRubberMat = new THREE.MeshStandardMaterial({
  color: '#151618',
  roughness: 0.85,
  metalness: 0.05,
});

// =========================================================================
// 1. AUTHENTIC 3D ALLOY RIM (FROM USER rim.glb)
// =========================================================================
export function UserRimNode({ wireframe = false, scale = 1.0, rotation = [0, 0, 0] }) {
  const baseUrl = import.meta.env.BASE_URL || '/';
  const { scene } = useGLTF(`${baseUrl}models/rim.glb`);
  const cloned = useMemo(() => scene.clone(true), [scene]);

  useMemo(() => {
    cloned.traverse((child) => {
      if (child.isMesh && child.material) {
        child.castShadow = false;
        child.receiveShadow = false;
        child.frustumCulled = true;
        if (Array.isArray(child.material)) {
          child.material.forEach((m) => (m.wireframe = wireframe));
        } else {
          child.material.wireframe = wireframe;
        }
      }
    });
  }, [cloned, wireframe]);

  return <primitive object={cloned} scale={scale} rotation={rotation} />;
}

// =========================================================================
// 2. AUTHENTIC 3D OFF-ROAD TYRE (FROM USER tyre1.glb)
// =========================================================================
export function UserTyreNode({ wireframe = false, scale = 1.0, rotation = [0, 0, 0] }) {
  const baseUrl = import.meta.env.BASE_URL || '/';
  const { scene } = useGLTF(`${baseUrl}models/tyre1.glb`);
  const cloned = useMemo(() => scene.clone(true), [scene]);

  useMemo(() => {
    cloned.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = false;
        child.receiveShadow = false;
        child.frustumCulled = true;
        child.material = sharedRubberMat;
      }
    });
  }, [cloned]);

  return <primitive object={cloned} scale={scale} rotation={rotation} />;
}

// =========================================================================
// 3. COMPLETE AUTHENTIC WHEEL ASSEMBLY (rim.glb + tyre1.glb)
// =========================================================================
export function UserWheelAssembly({ wireframe = false, scale = 1.0, rotation = [0, 0, 0] }) {
  return (
    <group scale={scale} rotation={rotation}>
      <UserTyreNode wireframe={wireframe} scale={1.0} />
      <UserRimNode wireframe={wireframe} scale={0.57} />
    </group>
  );
}

// =========================================================================
// 4. BESPOKE WHEEL ADAPTER FOR MAHINDRA THAR (MOUNTS TO ALL 5 AXLE HUBS)
//    OEM wheel radius = 0.216, tyre model radius = 0.954
//    Road scale = 0.216 / 0.954 = 0.226 (exact OEM match)
//    Spare scale = smaller proportional fit on tailgate
// =========================================================================
export function TharFittedWheelSet({ wheelType }) {
  if (!wheelType || wheelType === 'oem') {
    return null;
  }

  // OEM-accurate scale: 0.216 (OEM radius) / 0.954 (tyre model radius) = 0.226
  const roadScale = 0.226;
  // Spare on tailgate: proportionally smaller to match OEM spare look
  const spareScale = 0.185;

  // 5 Axle Hub Coordinates (measured exactly from OEM wheels in thar.glb)
  const hubs = [
    { id: 'FL', pos: [-0.668, -0.216, -0.357], rotY: Math.PI, scale: roadScale },
    { id: 'FR', pos: [-0.668, -0.216, 0.355], rotY: 0, scale: roadScale },
    { id: 'RL', pos: [0.550, -0.216, -0.361], rotY: Math.PI, scale: roadScale },
    { id: 'RR', pos: [0.550, -0.216, 0.359], rotY: 0, scale: roadScale },
    { id: 'Spare', pos: [0.849, 0.129, -0.002], rotY: Math.PI / 2, scale: spareScale },
  ];

  return (
    <group>
      {hubs.map((hub) => (
        <group key={hub.id} position={hub.pos} rotation={[0, hub.rotY, 0]}>
          {(wheelType === 'user_custom' || wheelType === 'custom' || wheelType === 'user_wheel') && (
            <UserWheelAssembly scale={hub.scale} />
          )}
          {wheelType === 'user_rim' && (
            <UserRimNode scale={hub.scale * 0.57} />
          )}
          {wheelType === 'user_tyre' && (
            <UserTyreNode scale={hub.scale} />
          )}
        </group>
      ))}
    </group>
  );
}
