import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// =========================================================================
// 1. AUTHENTIC 3D ALLOY RIM (FROM USER rim.glb - 763,004 triangles)
// =========================================================================
export function UserRimNode({ wireframe = false, scale = 1.0, rotation = [0, 0, 0] }) {
  const baseUrl = import.meta.env.BASE_URL || '/';
  const { scene } = useGLTF(`${baseUrl}models/rim.glb`);
  const cloned = useMemo(() => scene.clone(true), [scene]);

  useMemo(() => {
    cloned.traverse((child) => {
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
  }, [cloned, wireframe]);

  return <primitive object={cloned} scale={scale} rotation={rotation} />;
}

// =========================================================================
// 2. AUTHENTIC 3D OFF-ROAD TYRE (FROM USER tyre1.glb - 3,566,062 triangles)
// =========================================================================
export function UserTyreNode({ wireframe = false, scale = 1.0, rotation = [0, 0, 0] }) {
  const baseUrl = import.meta.env.BASE_URL || '/';
  const { scene } = useGLTF(`${baseUrl}models/tyre1.glb`);
  const cloned = useMemo(() => scene.clone(true), [scene]);

  useMemo(() => {
    const rubberMat = new THREE.MeshStandardMaterial({
      color: '#151618',
      roughness: 0.85,
      metalness: 0.05,
      wireframe: wireframe,
    });

    cloned.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.material = rubberMat;
      }
    });
  }, [cloned, wireframe]);

  return <primitive object={cloned} scale={scale} rotation={rotation} />;
}

// =========================================================================
// 3. COMPLETE AUTHENTIC WHEEL ASSEMBLY (rim.glb + tyre1.glb - 4,329,066 triangles)
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
// =========================================================================
export function TharFittedWheelSet({ wheelType }) {
  if (!wheelType || wheelType === 'oem') {
    return null;
  }

  // 5 Axle Hub Coordinates on Thar local coordinate space (calculated from OEM geometry)
  const hubs = [
    { id: 'FL', pos: [-0.530, -0.170, -0.320], rotY: Math.PI, isSpare: false },
    { id: 'FR', pos: [-0.530, -0.170, 0.320], rotY: 0, isSpare: false },
    { id: 'RL', pos: [0.455, -0.170, -0.320], rotY: Math.PI, isSpare: false },
    { id: 'RR', pos: [0.455, -0.170, 0.320], rotY: 0, isSpare: false },
    { id: 'Spare', pos: [0.872, 0.080, 0.000], rotY: Math.PI / 2, isSpare: true },
  ];

  const wheelScale = 0.148;

  return (
    <group>
      {hubs.map((hub) => (
        <group key={hub.id} position={hub.pos} rotation={[0, hub.rotY, 0]}>
          {(wheelType === 'user_custom' || wheelType === 'custom' || wheelType === 'user_wheel') && (
            <UserWheelAssembly scale={wheelScale} />
          )}
          {wheelType === 'user_rim' && (
            <UserRimNode scale={wheelScale * 0.57} />
          )}
          {wheelType === 'user_tyre' && (
            <UserTyreNode scale={wheelScale} />
          )}
        </group>
      ))}
    </group>
  );
}
