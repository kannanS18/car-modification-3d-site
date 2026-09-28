import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Html } from '@react-three/drei';
import * as THREE from 'three';
import { GarageScene } from './GarageScene';

function DynamicCameraController({ scrollProgress }) {
  const controlsRef = useRef();

  useFrame((state) => {
    const t = Math.max(0, Math.min(1, scrollProgress));

    // When inside garage (t >= 0.75), user can orbit freely around the car parked at [0, 0, -18]
    if (t >= 0.75) {
      if (controlsRef.current) {
        controlsRef.current.enabled = true;
        controlsRef.current.target.set(0, 1.2, -18);
      }
    } else {
      // In driving phase, smoothly animate camera following the car
      if (controlsRef.current) {
        controlsRef.current.enabled = false;
      }

      // Calculate car Z position matching GarageScene stages
      let carZ = 22;
      let targetCamX = 3.8;
      let targetCamY = 2.8;

      if (t < 0.4) {
        // Highway straight cruise
        const subT = t / 0.4;
        carZ = THREE.MathUtils.lerp(22, 5, subT);
        targetCamX = THREE.MathUtils.lerp(3.8, 2.5, subT);
        targetCamY = THREE.MathUtils.lerp(2.8, 2.6, subT);
      } else if (t < 0.75) {
        // Entering garage portal
        const subT = (t - 0.4) / 0.35;
        carZ = THREE.MathUtils.lerp(5, -12, subT);
        targetCamX = THREE.MathUtils.lerp(2.5, 1.8, subT);
        targetCamY = THREE.MathUtils.lerp(2.6, 2.9, subT);
      } else {
        // Rolling onto 2-post lift
        const subT = (t - 0.75) / 0.25;
        carZ = THREE.MathUtils.lerp(-12, -18, subT);
        targetCamX = THREE.MathUtils.lerp(1.8, 0, subT);
        targetCamY = THREE.MathUtils.lerp(2.9, 2.8, subT);
      }

      // Camera positions smoothly behind and slightly above car
      const targetCamZ = carZ + 6.8;

      state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetCamX, 0.08);
      state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetCamY, 0.08);
      state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetCamZ, 0.08);

      state.camera.lookAt(0, 1.0, carZ);
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      minDistance={2.5}
      maxDistance={12}
      maxPolarAngle={Math.PI / 2 - 0.05}
      dampingFactor={0.05}
    />
  );
}

export function GarageCanvas({
  scrollProgress = 0,
  carModel,
  carColor,
  wheelFinish,
  tireType,
  ledBarActive,
  bullBarActive,
  subwooferActive,
  roofRackActive,
  liftActive,
  underglow,
  headlights,
  drlColor,
}) {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-auto z-0 select-none">
      <Canvas
        shadows
        camera={{ position: [3.8, 2.8, 28.5], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Suspense
          fallback={
            <Html center>
              <div className="flex flex-col items-center gap-3 p-4 rounded-xl glass-panel shadow-2xl">
                <div className="w-8 h-8 border-2 border-[#FF4D00] border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-mono tracking-widest uppercase text-white font-bold">
                  Loading 3D Highway & Workshop...
                </span>
              </div>
            </Html>
          }
        >
          {/* Outdoor Sunlight + Garage Mood Lights */}
          <ambientLight intensity={scrollProgress > 0.5 ? 0.4 : 0.8} />
          <directionalLight
            position={[10, 20, 15]}
            intensity={scrollProgress > 0.5 ? 0.6 : 2.0}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />

          <GarageScene
            scrollProgress={scrollProgress}
            carModel={carModel}
            carColor={carColor}
            wheelFinish={wheelFinish}
            tireType={tireType}
            ledBarActive={ledBarActive}
            bullBarActive={bullBarActive}
            subwooferActive={subwooferActive}
            roofRackActive={roofRackActive}
            liftActive={liftActive}
            underglow={underglow}
            headlights={headlights}
            drlColor={drlColor}
          />

          <DynamicCameraController scrollProgress={scrollProgress} />
        </Suspense>
      </Canvas>

      {/* Subtle Vignette Gradient */}
      <div className="absolute inset-0 bg-radial-gradient pointer-events-none opacity-40" />
    </div>
  );
}
