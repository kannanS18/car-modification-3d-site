import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// =========================================================================
// 1. FACTORY MAHINDRA THAR 18" DIAMOND-CUT ALLOY WHEEL (AUTHENTIC OEM SPEC)
// =========================================================================
export function TharStockOEMWheel({ wireframe = false, scale = 1.0 }) {
  return (
    <group scale={scale}>
      {/* 1. All-Season Tyre - Bridgestone Dueler Rubber */}
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.40, 0.40, 0.24, 48]} />
        <meshStandardMaterial
          color="#181A1D"
          roughness={0.88}
          metalness={0.04}
          wireframe={wireframe}
        />
      </mesh>

      {/* Outer & Inner Tyre Sidewall Rounded Shoulders */}
      {[-0.10, 0.10].map((z, i) => (
        <mesh key={i} position={[0, 0, z]} castShadow>
          <torusGeometry args={[0.34, 0.065, 20, 48]} />
          <meshStandardMaterial
            color="#1C1E22"
            roughness={0.85}
            metalness={0.06}
            wireframe={wireframe}
          />
        </mesh>
      ))}

      {/* Highway All-Season Radial Siping / Grooves around circumference */}
      {Array.from({ length: 32 }).map((_, gi) => {
        const ang = (gi / 32) * Math.PI * 2;
        return (
          <mesh
            key={gi}
            position={[Math.cos(ang) * 0.401, Math.sin(ang) * 0.401, 0]}
            rotation={[0, 0, ang]}
          >
            <boxGeometry args={[0.012, 0.008, 0.22]} />
            <meshStandardMaterial
              color="#0E1012"
              roughness={0.95}
              metalness={0.02}
              wireframe={wireframe}
            />
          </mesh>
        );
      })}

      {/* 2. Deep Inset Rim Barrel */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.255, 0.255, 0.23, 48, 1, true]} />
        <meshStandardMaterial
          color="#15171B"
          roughness={0.35}
          metalness={0.88}
          wireframe={wireframe}
        />
      </mesh>

      {/* Outer Polished Rim Lip */}
      <mesh position={[0, 0, 0.115]}>
        <ringGeometry args={[0.238, 0.262, 48]} />
        <meshStandardMaterial
          color="#F1F5F9"
          roughness={0.15}
          metalness={0.96}
          wireframe={wireframe}
        />
      </mesh>

      {/* 3. 5-Split Twin Diamond-Cut Spokes (10 arms total) */}
      {Array.from({ length: 5 }).map((_, si) => {
        const baseAng = (si / 5) * Math.PI * 2;
        return (
          <group key={si} rotation={[0, 0, baseAng]}>
            {/* Left Arm of Split Spoke */}
            <group position={[-0.032, 0.125, 0.095]} rotation={[0, 0, 0.08]}>
              {/* Obsidian Black Flank */}
              <mesh position={[0, 0, -0.012]}>
                <boxGeometry args={[0.038, 0.17, 0.024]} />
                <meshStandardMaterial
                  color="#0F1115"
                  roughness={0.25}
                  metalness={0.85}
                  wireframe={wireframe}
                />
              </mesh>
              {/* Machined Diamond-Cut Silver Face */}
              <mesh position={[0, 0, 0.006]}>
                <boxGeometry args={[0.032, 0.165, 0.012]} />
                <meshStandardMaterial
                  color="#F8FAFC"
                  roughness={0.12}
                  metalness={0.98}
                  wireframe={wireframe}
                />
              </mesh>
            </group>

            {/* Right Arm of Split Spoke */}
            <group position={[0.032, 0.125, 0.095]} rotation={[0, 0, -0.08]}>
              {/* Obsidian Black Flank */}
              <mesh position={[0, 0, -0.012]}>
                <boxGeometry args={[0.038, 0.17, 0.024]} />
                <meshStandardMaterial
                  color="#0F1115"
                  roughness={0.25}
                  metalness={0.85}
                  wireframe={wireframe}
                />
              </mesh>
              {/* Machined Diamond-Cut Silver Face */}
              <mesh position={[0, 0, 0.006]}>
                <boxGeometry args={[0.032, 0.165, 0.012]} />
                <meshStandardMaterial
                  color="#F8FAFC"
                  roughness={0.12}
                  metalness={0.98}
                  wireframe={wireframe}
                />
              </mesh>
            </group>
          </group>
        );
      })}

      {/* 4. Center Hub Cap & Mahindra Chrome Badge */}
      <mesh position={[0, 0, 0.10]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.068, 0.068, 0.032, 32]} />
        <meshStandardMaterial
          color="#121316"
          roughness={0.3}
          metalness={0.8}
          wireframe={wireframe}
        />
      </mesh>
      <mesh position={[0, 0, 0.118]}>
        <circleGeometry args={[0.048, 32]} />
        <meshStandardMaterial
          color="#CBD5E1"
          roughness={0.15}
          metalness={0.95}
          wireframe={wireframe}
        />
      </mesh>

      {/* 5 Chrome Hexagonal Lug Nuts */}
      {Array.from({ length: 5 }).map((_, ni) => {
        const nAng = (ni / 5) * Math.PI * 2;
        return (
          <mesh
            key={ni}
            position={[Math.cos(nAng) * 0.045, Math.sin(nAng) * 0.045, 0.116]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[0.0075, 0.0075, 0.012, 6]} />
            <meshStandardMaterial
              color="#F8FAFC"
              roughness={0.1}
              metalness={0.98}
              wireframe={wireframe}
            />
          </mesh>
        );
      })}

      {/* 5. Slotted Brake Rotor & Red Brembo Caliper */}
      <group position={[0, 0, -0.04]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.20, 0.20, 0.016, 48]} />
          <meshStandardMaterial
            color="#94A3B8"
            roughness={0.25}
            metalness={0.95}
            wireframe={wireframe}
          />
        </mesh>
        <mesh position={[0.13, 0.13, 0.02]}>
          <boxGeometry args={[0.10, 0.12, 0.05]} />
          <meshStandardMaterial
            color="#E11D48"
            roughness={0.2}
            metalness={0.4}
            wireframe={wireframe}
          />
        </mesh>
      </group>
    </group>
  );
}

// =========================================================================
// 2. BFGOODRICH T/A KO2 ROCK-CRAWLER WITH RED ANODIZED METHOD BEADLOCK
// =========================================================================
export function BFGoodrichKO2Wheel({ wireframe = false, scale = 1.0 }) {
  return (
    <group scale={scale}>
      {/* 1. Massive 35" Mud-Terrain Tyre Rubber */}
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.42, 0.42, 0.27, 48]} />
        <meshStandardMaterial
          color="#16171A"
          roughness={0.92}
          metalness={0.03}
          wireframe={wireframe}
        />
      </mesh>

      {/* Sidewall Bulge & Shoulder Cleats */}
      {[-0.12, 0.12].map((z, i) => (
        <mesh key={i} position={[0, 0, z]} castShadow>
          <torusGeometry args={[0.35, 0.075, 20, 48]} />
          <meshStandardMaterial
            color="#181A1D"
            roughness={0.90}
            metalness={0.04}
            wireframe={wireframe}
          />
        </mesh>
      ))}

      {/* 24 Aggressive 3D Knobby Mud-Terrain Tread Lugs */}
      {Array.from({ length: 24 }).map((_, li) => {
        const ang = (li / 24) * Math.PI * 2;
        const isOffset = li % 2 === 0;
        return (
          <group key={li} position={[Math.cos(ang) * 0.418, Math.sin(ang) * 0.418, 0]} rotation={[0, 0, ang]}>
            <mesh position={[0, 0, isOffset ? 0.06 : -0.06]} castShadow>
              <boxGeometry args={[0.042, 0.024, 0.13]} />
              <meshStandardMaterial
                color="#121316"
                roughness={0.95}
                metalness={0.02}
                wireframe={wireframe}
              />
            </mesh>
          </group>
        );
      })}

      {/* 2. Deep-Dish Matte Black Rim Barrel */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.26, 0.26, 0.25, 48, 1, true]} />
        <meshStandardMaterial
          color="#1E2024"
          roughness={0.35}
          metalness={0.85}
          wireframe={wireframe}
        />
      </mesh>

      {/* 3. Gloss Anodized Crimson Red Beadlock Locking Ring */}
      <mesh position={[0, 0, 0.132]} castShadow>
        <ringGeometry args={[0.235, 0.268, 48]} />
        <meshStandardMaterial
          color="#DC2626"
          roughness={0.22}
          metalness={0.88}
          wireframe={wireframe}
        />
      </mesh>
      <mesh position={[0, 0, 0.126]}>
        <torusGeometry args={[0.266, 0.012, 16, 48]} />
        <meshStandardMaterial
          color="#DC2626"
          roughness={0.22}
          metalness={0.88}
          wireframe={wireframe}
        />
      </mesh>

      {/* 24 Chrome Grade-8 Socket Screws around Beadlock Ring */}
      {Array.from({ length: 24 }).map((_, bi) => {
        const bAng = (bi / 24) * Math.PI * 2;
        return (
          <mesh
            key={bi}
            position={[Math.cos(bAng) * 0.252, Math.sin(bAng) * 0.252, 0.138]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[0.005, 0.005, 0.008, 6]} />
            <meshStandardMaterial
              color="#F8FAFC"
              roughness={0.12}
              metalness={0.98}
              wireframe={wireframe}
            />
          </mesh>
        );
      })}

      {/* 4. Method 5-Spoke Star Dish with Weight Relief Ports */}
      {Array.from({ length: 5 }).map((_, si) => {
        const sAng = (si / 5) * Math.PI * 2;
        return (
          <group key={si} rotation={[0, 0, sAng]} position={[0, 0, 0.09]}>
            <mesh position={[0, 0.12, 0]} castShadow>
              <boxGeometry args={[0.075, 0.17, 0.032]} />
              <meshStandardMaterial
                color="#1B1D22"
                roughness={0.35}
                metalness={0.85}
                wireframe={wireframe}
              />
            </mesh>
            {/* Recessed Spoke Accent Slot */}
            <mesh position={[0, 0.12, 0.016]}>
              <boxGeometry args={[0.035, 0.10, 0.008]} />
              <meshStandardMaterial
                color="#0D0E11"
                roughness={0.5}
                metalness={0.6}
                wireframe={wireframe}
              />
            </mesh>
          </group>
        );
      })}

      {/* 5. Center Hub Cap & Hex Lugs */}
      <mesh position={[0, 0, 0.098]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.075, 0.075, 0.035, 32]} />
        <meshStandardMaterial
          color="#121316"
          roughness={0.3}
          metalness={0.8}
          wireframe={wireframe}
        />
      </mesh>
      {Array.from({ length: 5 }).map((_, ni) => {
        const nAng = (ni / 5) * Math.PI * 2;
        return (
          <mesh
            key={ni}
            position={[Math.cos(nAng) * 0.046, Math.sin(nAng) * 0.046, 0.118]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[0.008, 0.008, 0.014, 6]} />
            <meshStandardMaterial
              color="#F8FAFC"
              roughness={0.1}
              metalness={0.98}
              wireframe={wireframe}
            />
          </mesh>
        );
      })}

      {/* 6. Brembo Cross-Drilled Slotted Brake Disc & Red Caliper */}
      <group position={[0, 0, -0.04]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.21, 0.21, 0.018, 48]} />
          <meshStandardMaterial
            color="#94A3B8"
            roughness={0.25}
            metalness={0.95}
            wireframe={wireframe}
          />
        </mesh>
        <mesh position={[0.135, 0.135, 0.02]}>
          <boxGeometry args={[0.11, 0.13, 0.055]} />
          <meshStandardMaterial
            color="#DC2626"
            roughness={0.18}
            metalness={0.4}
            wireframe={wireframe}
          />
        </mesh>
      </group>
    </group>
  );
}

// =========================================================================
// 3. DAKAR RALLY STAGE SATIN BRONZE FORGED DISH WHEEL
// =========================================================================
export function DakarBronzeWheel({ wireframe = false, scale = 1.0 }) {
  const bronzeColor = '#A77B28';
  return (
    <group scale={scale}>
      {/* 1. Heavy-Duty Kevlar 3-Ply Rally Mud-Terrain Tyre */}
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.41, 0.41, 0.26, 48]} />
        <meshStandardMaterial
          color="#161719"
          roughness={0.90}
          metalness={0.03}
          wireframe={wireframe}
        />
      </mesh>
      {[-0.11, 0.11].map((z, i) => (
        <mesh key={i} position={[0, 0, z]} castShadow>
          <torusGeometry args={[0.345, 0.07, 20, 48]} />
          <meshStandardMaterial
            color="#191B1F"
            roughness={0.88}
            metalness={0.04}
            wireframe={wireframe}
          />
        </mesh>
      ))}

      {/* 20 Staggered Kevlar Mud Lugs */}
      {Array.from({ length: 20 }).map((_, li) => {
        const ang = (li / 20) * Math.PI * 2;
        return (
          <mesh
            key={li}
            position={[Math.cos(ang) * 0.408, Math.sin(ang) * 0.408, 0]}
            rotation={[0, 0, ang]}
          >
            <boxGeometry args={[0.046, 0.022, 0.20]} />
            <meshStandardMaterial
              color="#101114"
              roughness={0.95}
              metalness={0.02}
              wireframe={wireframe}
            />
          </mesh>
        );
      })}

      {/* 2. Forged Satin Bronze Rim Barrel */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.26, 0.26, 0.24, 48, 1, true]} />
        <meshStandardMaterial
          color={bronzeColor}
          roughness={0.28}
          metalness={0.90}
          wireframe={wireframe}
        />
      </mesh>

      {/* Satin Black Outer Beadlock Ring */}
      <mesh position={[0, 0, 0.126]}>
        <ringGeometry args={[0.235, 0.265, 48]} />
        <meshStandardMaterial
          color="#1B1C20"
          roughness={0.3}
          metalness={0.85}
          wireframe={wireframe}
        />
      </mesh>
      {Array.from({ length: 16 }).map((_, bi) => {
        const bAng = (bi / 16) * Math.PI * 2;
        return (
          <mesh
            key={bi}
            position={[Math.cos(bAng) * 0.250, Math.sin(bAng) * 0.250, 0.132]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[0.005, 0.005, 0.008, 6]} />
            <meshStandardMaterial
              color="#E2E8F0"
              roughness={0.15}
              metalness={0.98}
              wireframe={wireframe}
            />
          </mesh>
        );
      })}

      {/* 3. Dakar 8-Window Forged Rally Dish */}
      {Array.from({ length: 8 }).map((_, si) => {
        const sAng = (si / 8) * Math.PI * 2;
        return (
          <group key={si} rotation={[0, 0, sAng]} position={[0, 0, 0.09]}>
            <mesh position={[0, 0.13, 0]} castShadow>
              <boxGeometry args={[0.065, 0.16, 0.028]} />
              <meshStandardMaterial
                color={bronzeColor}
                roughness={0.26}
                metalness={0.92}
                wireframe={wireframe}
              />
            </mesh>
          </group>
        );
      })}

      {/* 4. Center Cap & 5 Hex Lug Nuts */}
      <mesh position={[0, 0, 0.095]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.03, 32]} />
        <meshStandardMaterial
          color="#16171B"
          roughness={0.3}
          metalness={0.8}
          wireframe={wireframe}
        />
      </mesh>
      {Array.from({ length: 5 }).map((_, ni) => {
        const nAng = (ni / 5) * Math.PI * 2;
        return (
          <mesh
            key={ni}
            position={[Math.cos(nAng) * 0.045, Math.sin(nAng) * 0.045, 0.115]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[0.0075, 0.0075, 0.012, 6]} />
            <meshStandardMaterial
              color="#F8FAFC"
              roughness={0.1}
              metalness={0.98}
              wireframe={wireframe}
            />
          </mesh>
        );
      })}

      {/* Brake Rotor & Caliper */}
      <group position={[0, 0, -0.04]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.20, 0.20, 0.016, 48]} />
          <meshStandardMaterial
            color="#94A3B8"
            roughness={0.25}
            metalness={0.95}
            wireframe={wireframe}
          />
        </mesh>
        <mesh position={[0.13, 0.13, 0.02]}>
          <boxGeometry args={[0.10, 0.12, 0.05]} />
          <meshStandardMaterial
            color="#E11D48"
            roughness={0.2}
            metalness={0.4}
            wireframe={wireframe}
          />
        </mesh>
      </group>
    </group>
  );
}

// =========================================================================
// 4. TITANIUM 10-SPOKE DIRECTIONAL CONCAVE SPORT ALLOY WHEEL
// =========================================================================
export function TitaniumSpiderWheel({ wireframe = false, scale = 1.0 }) {
  const titaniumColor = '#B8C4D4';
  return (
    <group scale={scale}>
      {/* 1. Low-Profile High-Speed Trail Performance Rubber */}
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.395, 0.395, 0.25, 48]} />
        <meshStandardMaterial
          color="#161719"
          roughness={0.88}
          metalness={0.04}
          wireframe={wireframe}
        />
      </mesh>
      {[-0.105, 0.105].map((z, i) => (
        <mesh key={i} position={[0, 0, z]} castShadow>
          <torusGeometry args={[0.335, 0.065, 20, 48]} />
          <meshStandardMaterial
            color="#191B1F"
            roughness={0.85}
            metalness={0.05}
            wireframe={wireframe}
          />
        </mesh>
      ))}

      {/* 2. Deep Concave Titanium Barrel */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.26, 0.26, 0.24, 48, 1, true]} />
        <meshStandardMaterial
          color={titaniumColor}
          roughness={0.20}
          metalness={0.96}
          wireframe={wireframe}
        />
      </mesh>

      {/* Mirror-Polished Silver Outer Rim Lip */}
      <mesh position={[0, 0, 0.122]}>
        <ringGeometry args={[0.242, 0.264, 48]} />
        <meshStandardMaterial
          color="#FFFFFF"
          roughness={0.08}
          metalness={0.98}
          wireframe={wireframe}
        />
      </mesh>

      {/* 3. 10 Directional Concave Aerodynamic Blade Spokes */}
      {Array.from({ length: 10 }).map((_, si) => {
        const sAng = (si / 10) * Math.PI * 2;
        return (
          <group key={si} rotation={[0, 0, sAng + 0.12]} position={[0, 0, 0.095]}>
            <mesh position={[0, 0.13, 0]} rotation={[0.08, 0, 0]} castShadow>
              <boxGeometry args={[0.032, 0.175, 0.022]} />
              <meshStandardMaterial
                color={titaniumColor}
                roughness={0.16}
                metalness={0.98}
                wireframe={wireframe}
              />
            </mesh>
          </group>
        );
      })}

      {/* 4. Center Cap & Chrome Lug Nuts */}
      <mesh position={[0, 0, 0.098]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.068, 0.068, 0.028, 32]} />
        <meshStandardMaterial
          color="#0E1012"
          roughness={0.3}
          metalness={0.8}
          wireframe={wireframe}
        />
      </mesh>
      {Array.from({ length: 5 }).map((_, ni) => {
        const nAng = (ni / 5) * Math.PI * 2;
        return (
          <mesh
            key={ni}
            position={[Math.cos(nAng) * 0.044, Math.sin(nAng) * 0.044, 0.116]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[0.0075, 0.0075, 0.012, 6]} />
            <meshStandardMaterial
              color="#F8FAFC"
              roughness={0.1}
              metalness={0.98}
              wireframe={wireframe}
            />
          </mesh>
        );
      })}

      {/* Slotted Ventilated Rotor & Caliper */}
      <group position={[0, 0, -0.04]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.20, 0.20, 0.016, 48]} />
          <meshStandardMaterial
            color="#94A3B8"
            roughness={0.25}
            metalness={0.95}
            wireframe={wireframe}
          />
        </mesh>
        <mesh position={[0.13, 0.13, 0.02]}>
          <boxGeometry args={[0.10, 0.12, 0.05]} />
          <meshStandardMaterial
            color="#E11D48"
            roughness={0.2}
            metalness={0.4}
            wireframe={wireframe}
          />
        </mesh>
      </group>
    </group>
  );
}

// =========================================================================
// 5. KC HILITES EXTREME BUMPER RALLY FOG PODS (MODULAR OFF-ROAD ACCESSORY)
// =========================================================================
export function KCHilitesBumperPods({ wireframe = false, scale = 1.0 }) {
  return (
    <group scale={scale}>
      {[-0.28, 0.28].map((xPos, idx) => (
        <group key={idx} position={[xPos, 0, 0]}>
          {/* Finned Cast Aluminum Light Housing */}
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.14, 0.12, 0.12, 32]} />
            <meshStandardMaterial
              color="#1B1C20"
              roughness={0.35}
              metalness={0.85}
              wireframe={wireframe}
            />
          </mesh>

          {/* Cooling Fins on Rear */}
          {Array.from({ length: 5 }).map((_, fi) => (
            <mesh key={fi} position={[0, 0, -0.02 - fi * 0.015]}>
              <ringGeometry args={[0.08, 0.128 - fi * 0.005, 32]} />
              <meshStandardMaterial color="#141518" roughness={0.4} metalness={0.8} />
            </mesh>
          ))}

          {/* Chrome Inner Reflector Bowl */}
          <mesh position={[0, 0, 0.04]} rotation={[-Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.12, 0.06, 32, 1, true]} />
            <meshStandardMaterial color="#F8FAFC" roughness={0.08} metalness={0.98} />
          </mesh>

          {/* Glowing Amber Fluted Glass Lens */}
          <mesh position={[0, 0, 0.065]}>
            <circleGeometry args={[0.135, 32]} />
            <meshStandardMaterial
              color="#F59E0B"
              emissive="#F59E0B"
              emissiveIntensity={0.65}
              roughness={0.15}
              metalness={0.1}
              transparent
              opacity={0.88}
              wireframe={wireframe}
            />
          </mesh>

          {/* Heavy-Duty Cross Stone Guard Grill */}
          <mesh position={[0, 0, 0.07]}>
            <torusGeometry args={[0.135, 0.01, 16, 32]} />
            <meshStandardMaterial color="#111215" roughness={0.3} metalness={0.9} />
          </mesh>
          <mesh position={[0, 0, 0.072]}>
            <boxGeometry args={[0.26, 0.014, 0.006]} />
            <meshStandardMaterial color="#111215" roughness={0.3} metalness={0.9} />
          </mesh>
          <mesh position={[0, 0, 0.072]}>
            <boxGeometry args={[0.014, 0.26, 0.006]} />
            <meshStandardMaterial color="#111215" roughness={0.3} metalness={0.9} />
          </mesh>

          {/* Mounting Steel Base Bracket */}
          <mesh position={[0, -0.15, -0.02]}>
            <boxGeometry args={[0.08, 0.08, 0.04]} />
            <meshStandardMaterial color="#1F2024" roughness={0.4} metalness={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// =========================================================================
// 6. 50-INCH CURVED WINDSHIELD TRAIL LIGHT BAR (MODULAR ACCESSORY)
// =========================================================================
export function CurvedRoofLightBar({ wireframe = false, scale = 1.0 }) {
  const reflectorCount = 20;
  return (
    <group scale={scale}>
      {/* Extruded Aerodynamic Black Aluminum Heatsink Bar */}
      <mesh castShadow>
        <boxGeometry args={[1.35, 0.09, 0.08]} />
        <meshStandardMaterial
          color="#16171A"
          roughness={0.3}
          metalness={0.88}
          wireframe={wireframe}
        />
      </mesh>

      {/* Top Cooling Fins */}
      {[-0.02, 0, 0.02].map((y, yi) => (
        <mesh key={yi} position={[0, 0.045, y]}>
          <boxGeometry args={[1.34, 0.012, 0.006]} />
          <meshStandardMaterial color="#111214" roughness={0.4} metalness={0.85} />
        </mesh>
      ))}

      {/* Dual Row Reflector Projectors */}
      <group position={[0, 0, 0.038]}>
        {Array.from({ length: reflectorCount }).map((_, ri) => {
          const x = -0.60 + (ri / (reflectorCount - 1)) * 1.20;
          return (
            <group key={ri} position={[x, 0, 0]}>
              {/* Upper Projector LED */}
              <mesh position={[0, 0.02, 0]}>
                <circleGeometry args={[0.018, 16]} />
                <meshStandardMaterial
                  color="#FFFFFF"
                  emissive="#00E5FF"
                  emissiveIntensity={0.8}
                  roughness={0.1}
                  metalness={0.9}
                />
              </mesh>
              {/* Lower Projector LED */}
              <mesh position={[0, -0.02, 0]}>
                <circleGeometry args={[0.018, 16]} />
                <meshStandardMaterial
                  color="#FFFFFF"
                  emissive="#00E5FF"
                  emissiveIntensity={0.8}
                  roughness={0.1}
                  metalness={0.9}
                />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* Front High-Clarity Polycarbonate Lens */}
      <mesh position={[0, 0, 0.044]}>
        <boxGeometry args={[1.34, 0.082, 0.004]} />
        <meshStandardMaterial
          color="#E2E8F0"
          transparent
          opacity={0.65}
          roughness={0.08}
          metalness={0.1}
        />
      </mesh>

      {/* Side Mounting Steel Brackets */}
      {[-0.69, 0.69].map((x, i) => (
        <mesh key={i} position={[x, -0.04, -0.02]}>
          <boxGeometry args={[0.035, 0.12, 0.08]} />
          <meshStandardMaterial color="#1F2024" roughness={0.3} metalness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

// =========================================================================
// 7. HEAVY-DUTY FRONT BULL BAR & ELECTRIC WINCH (MODULAR ACCESSORY)
// =========================================================================
export function OverlandBullBar({ wireframe = false, scale = 1.0 }) {
  return (
    <group scale={scale}>
      {/* Main Steel Tubular Hoop */}
      <mesh position={[0, 0.18, 0]} castShadow>
        <boxGeometry args={[1.4, 0.05, 0.05]} />
        <meshStandardMaterial color="#1A1C20" roughness={0.35} metalness={0.85} wireframe={wireframe} />
      </mesh>
      <mesh position={[0, 0.02, 0]} castShadow>
        <boxGeometry args={[1.5, 0.06, 0.06]} />
        <meshStandardMaterial color="#1A1C20" roughness={0.35} metalness={0.85} wireframe={wireframe} />
      </mesh>

      {/* Vertical Stanchions */}
      {[-0.38, 0.38].map((x, i) => (
        <mesh key={i} position={[x, 0.10, 0]}>
          <boxGeometry args={[0.04, 0.22, 0.04]} />
          <meshStandardMaterial color="#141518" roughness={0.35} metalness={0.85} wireframe={wireframe} />
        </mesh>
      ))}

      {/* Center Winch Plate & Drum */}
      <mesh position={[0, -0.04, -0.04]}>
        <boxGeometry args={[0.48, 0.16, 0.18]} />
        <meshStandardMaterial color="#121316" roughness={0.4} metalness={0.8} wireframe={wireframe} />
      </mesh>

      {/* Spooled Synthetic Winch Cable Drum */}
      <mesh position={[0, -0.02, -0.02]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.055, 0.055, 0.28, 24]} />
        <meshStandardMaterial color="#64748B" roughness={0.6} metalness={0.7} />
      </mesh>

      {/* Polished Aluminum Hawse Fairlead */}
      <mesh position={[0, -0.04, 0.055]}>
        <boxGeometry args={[0.26, 0.07, 0.015]} />
        <meshStandardMaterial color="#E2E8F0" roughness={0.15} metalness={0.96} />
      </mesh>
      <mesh position={[0, -0.04, 0.058]}>
        <boxGeometry args={[0.16, 0.028, 0.02]} />
        <meshStandardMaterial color="#0B0C0E" roughness={0.5} metalness={0.3} />
      </mesh>

      {/* Forged Red Recovery Tow Hook */}
      <group position={[0.10, -0.04, 0.08]} rotation={[0, 0, -0.3]}>
        <mesh>
          <torusGeometry args={[0.035, 0.012, 16, 24, Math.PI * 1.5]} />
          <meshStandardMaterial color="#DC2626" roughness={0.2} metalness={0.5} />
        </mesh>
      </group>
    </group>
  );
}

// =========================================================================
// 8. BESPOKE WHEEL ADAPTER FOR MAHINDRA THAR (MOUNTS TO ALL 5 AXLE HUBS)
// =========================================================================
export function TharFittedWheelSet({ wheelType }) {
  if (!wheelType || wheelType === 'oem') {
    // If OEM is selected, the split Thar mesh's Thar_OEM_Wheels is visible!
    return null;
  }

  // 5 Axle Hub Coordinates on Thar local coordinate space
  const hubs = [
    { id: 'FL', pos: [-0.620, -0.245, -0.357], rotY: Math.PI, isSpare: false },
    { id: 'FR', pos: [-0.620, -0.245, 0.352], rotY: 0, isSpare: false },
    { id: 'RL', pos: [0.508, -0.245, -0.356], rotY: Math.PI, isSpare: false },
    { id: 'RR', pos: [0.508, -0.245, 0.351], rotY: 0, isSpare: false },
    { id: 'Spare', pos: [0.905, 0.070, -0.001], rotY: Math.PI / 2, isSpare: true },
  ];

  return (
    <group>
      {hubs.map((hub) => (
        <group key={hub.id} position={hub.pos} rotation={[0, hub.rotY, 0]}>
          {wheelType === 'bfg_ko2' && <BFGoodrichKO2Wheel scale={0.41} />}
          {wheelType === 'dakar_bronze' && <DakarBronzeWheel scale={0.41} />}
          {wheelType === 'titanium_spider' && <TitaniumSpiderWheel scale={0.41} />}
        </group>
      ))}
    </group>
  );
}
