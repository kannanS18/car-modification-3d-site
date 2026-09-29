import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Shared rubber material for high efficiency
const sharedRubberMat = new THREE.MeshStandardMaterial({
  color: '#151618',
  roughness: 0.85,
  metalness: 0.05,
});

// =========================================================================
// 1. AUTHENTIC 3D ALLOY RIM (FROM USER rim.glb)
//    Used in Standalone 3D Panel Turntable & Sandbox
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
//    Used in Standalone 3D Panel Turntable & Sandbox
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
//    Used in Standalone 3D Panel Turntable & Sandbox
// =========================================================================
export function UserWheelAssembly({ wireframe = false, scale = 1.0, rotation = [0, 0, 0] }) {
  return (
    <group scale={scale} rotation={rotation}>
      <UserTyreNode wireframe={wireframe} scale={1.0} />
      <UserRimNode wireframe={wireframe} scale={0.57} />
    </group>
  );
}
