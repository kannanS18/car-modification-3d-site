import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// =========================================================================
// PROCEDURAL CANVAS TEXTURE GENERATOR FOR HIGH-END AUTOMOTIVE TYRE SIDEWALLS
// =========================================================================
function createSidewallTexture(brandText, sizeText, hasWhiteLettering = true) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  const cx = 512;
  const cy = 512;

  // 1. Dark vulcanized rubber base
  ctx.fillStyle = '#17181C';
  ctx.fillRect(0, 0, 1024, 1024);

  // 2. Radial rubber grain & texture ridges
  ctx.strokeStyle = '#111215';
  ctx.lineWidth = 2.5;
  for (let r = 328; r < 500; r += 7) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  // 3. Subtle sidewall shoulder ribbing
  ctx.strokeStyle = '#202227';
  ctx.lineWidth = 4;
  for (let r = 450; r < 490; r += 12) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  // 4. Arced Curved Lettering Helper
  function drawCurvedText(text, radius, startAngle, letterSpacing, isWhite) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(startAngle);
    ctx.font = '900 38px "Arial Black", Impact, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const halfLength = (text.length - 1) / 2;
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      ctx.save();
      ctx.rotate((i - halfLength) * letterSpacing);
      ctx.translate(0, -radius);
      if (isWhite) {
        // Bright raised white lettering with authentic shadow
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 6;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 2;
        ctx.fillText(char, 0, 0);
      } else {
        // Embossed dark rubber lettering
        ctx.fillStyle = '#262930';
        ctx.shadowColor = '#0B0C0E';
        ctx.shadowBlur = 4;
        ctx.fillText(char, 0, 0);
      }
      ctx.restore();
    }
    ctx.restore();
  }

  // Top brand name (e.g. "MAXXIS BRAVO A/T 980" or "BFGOODRICH T/A KO2")
  drawCurvedText(brandText, 412, 0, 0.052, hasWhiteLettering);

  // Bottom tyre size & DOT (e.g. "285/60 R18 116H ALL-TERRAIN")
  drawCurvedText(sizeText, 412, Math.PI, 0.046, hasWhiteLettering);

  // Corner subtle safety warning text
  drawCurvedText('SAFETY WARNING: MOUNT ONLY ON APPROVED RIMS', 355, Math.PI * 0.5, 0.032, false);
  drawCurvedText('MAX LOAD 1250 KG  •  MAX INFLATION 50 PSI', 355, -Math.PI * 0.5, 0.032, false);

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 16;
  texture.needsUpdate = true;
  return texture;
}

// =========================================================================
// PROCEDURAL CANVAS TEXTURE FOR ALL-TERRAIN TREAD BLOCKS & DEEP SIPES
// =========================================================================
function createTreadTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  // Deep black mud channels
  ctx.fillStyle = '#0B0C0E';
  ctx.fillRect(0, 0, 1024, 256);

  // Draw 16 repeating rows of interlocking zig-zag all-terrain tread blocks
  ctx.fillStyle = '#1D1E22';
  for (let col = 0; col < 16; col++) {
    const x = col * 64;

    // Center chevron block
    ctx.beginPath();
    ctx.moveTo(x + 10, 80);
    ctx.lineTo(x + 32, 60);
    ctx.lineTo(x + 54, 80);
    ctx.lineTo(x + 54, 120);
    ctx.lineTo(x + 32, 100);
    ctx.lineTo(x + 10, 120);
    ctx.closePath();
    ctx.fill();

    // Sipes across center block
    ctx.strokeStyle = '#0B0C0E';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + 16, 90);
    ctx.lineTo(x + 48, 90);
    ctx.stroke();

    // Left shoulder block
    ctx.beginPath();
    ctx.rect(x + 8, 10, 48, 42);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x + 14, 30);
    ctx.lineTo(x + 50, 30);
    ctx.stroke();

    // Right shoulder block
    ctx.beginPath();
    ctx.rect(x + 8, 140, 48, 42);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x + 14, 160);
    ctx.lineTo(x + 50, 160);
    ctx.stroke();

    // Outer biting edge cleat
    ctx.beginPath();
    ctx.rect(x + 16, 195, 32, 50);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.repeat.set(4, 1);
  texture.anisotropy = 16;
  texture.needsUpdate = true;
  return texture;
}

// =========================================================================
// COMMON HOLLOW TYRE CASING WITH DUAL-SIDEWALL CANVAS TEXTURES
// =========================================================================
function HollowTyreCasing({ brandText, sizeText, hasWhiteLettering = true, wireframe = false, scale = 1.0 }) {
  const sidewallTex = useMemo(() => createSidewallTexture(brandText, sizeText, hasWhiteLettering), [brandText, sizeText, hasWhiteLettering]);
  const treadTex = useMemo(() => createTreadTexture(), []);

  return (
    <group scale={scale}>
      {/* 1. Outer Tread Cylinder (OPEN-ENDED, HOLLOW!) */}
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.42, 0.42, 0.26, 64, 1, true]} />
        <meshStandardMaterial
          color="#181A1D"
          map={treadTex}
          roughness={0.88}
          metalness={0.03}
          wireframe={wireframe}
        />
      </mesh>

      {/* 2. Outer Shoulder Biting Cleats (32 Radial 3D Mud Blocks) */}
      {Array.from({ length: 32 }).map((_, bi) => {
        const ang = (bi / 32) * Math.PI * 2;
        const isOffset = bi % 2 === 0;
        return (
          <group key={bi} position={[Math.cos(ang) * 0.421, Math.sin(ang) * 0.421, 0]} rotation={[0, 0, ang]}>
            {/* Left Edge Shoulder Block */}
            <mesh position={[0, 0, isOffset ? 0.08 : -0.08]} castShadow>
              <boxGeometry args={[0.038, 0.016, 0.09]} />
              <meshStandardMaterial color="#121316" roughness={0.94} metalness={0.02} wireframe={wireframe} />
            </mesh>
          </group>
        );
      })}

      {/* 3. Front Sidewall Ring with Raised Lettering (HOLLOW CENTER r: 0.25 to 0.42) */}
      <mesh position={[0, 0, 0.13]} castShadow>
        <ringGeometry args={[0.252, 0.42, 64]} />
        <meshStandardMaterial
          color="#1A1C20"
          map={sidewallTex}
          roughness={0.85}
          metalness={0.04}
          side={THREE.DoubleSide}
          wireframe={wireframe}
        />
      </mesh>

      {/* 4. Rear Sidewall Ring (HOLLOW CENTER r: 0.25 to 0.42) */}
      <mesh position={[0, 0, -0.13]} rotation={[0, Math.PI, 0]} receiveShadow>
        <ringGeometry args={[0.252, 0.42, 64]} />
        <meshStandardMaterial
          color="#1A1C20"
          map={sidewallTex}
          roughness={0.85}
          metalness={0.04}
          side={THREE.DoubleSide}
          wireframe={wireframe}
        />
      </mesh>

      {/* 5. Sidewall Torus Shoulders for Curvature */}
      {[-0.125, 0.125].map((z, i) => (
        <mesh key={i} position={[0, 0, z]}>
          <torusGeometry args={[0.395, 0.025, 16, 64]} />
          <meshStandardMaterial color="#151619" roughness={0.88} metalness={0.03} wireframe={wireframe} />
        </mesh>
      ))}
    </group>
  );
}

// =========================================================================
// COMMON BEHIND-THE-WHEEL BRAKE DISC & RED BREMBO CALIPER
// =========================================================================
function BrakeAssembly({ wireframe = false }) {
  return (
    <group position={[0, 0, -0.04]}>
      {/* 340mm Slotted Steel Brake Rotor */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.21, 0.21, 0.016, 48]} />
        <meshStandardMaterial
          color="#94A3B8"
          roughness={0.22}
          metalness={0.96}
          wireframe={wireframe}
        />
      </mesh>

      {/* Circular Rotor Holes */}
      {Array.from({ length: 8 }).map((_, hi) => {
        const hAng = (hi / 8) * Math.PI * 2;
        return (
          <mesh key={hi} position={[Math.cos(hAng) * 0.14, Math.sin(hAng) * 0.14, 0.009]}>
            <circleGeometry args={[0.006, 12]} />
            <meshBasicMaterial color="#334155" />
          </mesh>
        );
      })}

      {/* Red Brembo 4-Piston Caliper clamped on Top-Right Quadrant */}
      <group position={[0.135, 0.135, 0.02]} rotation={[0, 0, -0.78]}>
        <mesh castShadow>
          <boxGeometry args={[0.07, 0.13, 0.05]} />
          <meshStandardMaterial
            color="#DC2626"
            roughness={0.2}
            metalness={0.5}
            wireframe={wireframe}
          />
        </mesh>
        {/* Brembo White Logo Stripe */}
        <mesh position={[0, 0, 0.026]}>
          <boxGeometry args={[0.025, 0.065, 0.002]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
      </group>
    </group>
  );
}

// =========================================================================
// 1. MAXXIS BRAVO AT-980 • BIMBRA JTI ROUND MULTI-HOLE BEADLOCK ALLOY
// (Directly matches user link: https://bimbra.in/products/tyres-maxxis-980-at-285-60-r18-4/)
// =========================================================================
export function MaxxisBimbraJTIWheel({ wireframe = false, scale = 1.0 }) {
  return (
    <group scale={scale}>
      {/* Authentic Maxxis Bravo AT-980 Hollow Tyre */}
      <HollowTyreCasing
        brandText="MAXXIS BRAVO A/T 980"
        sizeText="285 / 60 R18 116H • ALL-TERRAIN"
        hasWhiteLettering={true}
        wireframe={wireframe}
      />

      {/* Deep-Dish Inset Rim Barrel (Hollow!) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.252, 0.252, 0.24, 64, 1, true]} />
        <meshStandardMaterial color="#16171A" roughness={0.3} metalness={0.88} wireframe={wireframe} />
      </mesh>

      {/* Outer Milled Silver Beadlock Ring */}
      <mesh position={[0, 0, 0.122]} castShadow>
        <ringGeometry args={[0.228, 0.254, 64]} />
        <meshStandardMaterial color="#E2E8F0" roughness={0.15} metalness={0.96} wireframe={wireframe} />
      </mesh>

      {/* 20 Bimbra JTI Circular Machined Holes & Stainless Steel Screws */}
      {Array.from({ length: 20 }).map((_, bi) => {
        const bAng = (bi / 20) * Math.PI * 2;
        return (
          <group key={bi} position={[Math.cos(bAng) * 0.241, Math.sin(bAng) * 0.241, 0.126]}>
            {/* Recessed black hole */}
            <mesh>
              <circleGeometry args={[0.008, 16]} />
              <meshBasicMaterial color="#0A0B0D" />
            </mesh>
            {/* Chrome Allen Screw */}
            <mesh position={[0, 0, 0.002]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.004, 0.004, 0.006, 6]} />
              <meshStandardMaterial color="#F8FAFC" roughness={0.1} metalness={0.98} />
            </mesh>
          </group>
        );
      })}

      {/* Deep Concave JTI Dish Face (Positioned 5cm deep inside rim!) */}
      <group position={[0, 0, 0.06]}>
        {/* Slanted Concave Rim Cone */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.228, 0.14, 0.06, 48, 1, true]} />
          <meshStandardMaterial color="#181A1F" roughness={0.32} metalness={0.85} wireframe={wireframe} />
        </mesh>

        {/* 10 Circular Windows on Inner Dish */}
        {Array.from({ length: 10 }).map((_, wi) => {
          const wAng = (wi / 10) * Math.PI * 2;
          return (
            <mesh key={wi} position={[Math.cos(wAng) * 0.175, Math.sin(wAng) * 0.175, 0.015]}>
              <circleGeometry args={[0.018, 16]} />
              <meshBasicMaterial color="#0E1013" />
            </mesh>
          );
        })}

        {/* Center Hub & Red Bimbra JTI Center Cap */}
        <mesh position={[0, 0, -0.01]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.075, 0.075, 0.035, 32]} />
          <meshStandardMaterial color="#111215" roughness={0.3} metalness={0.8} />
        </mesh>
        <mesh position={[0, 0, 0.008]}>
          <circleGeometry args={[0.048, 32]} />
          <meshStandardMaterial color="#DC2626" roughness={0.2} metalness={0.6} />
        </mesh>
        <mesh position={[0, 0, 0.010]}>
          <circleGeometry args={[0.024, 32]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.2} metalness={0.9} />
        </mesh>

        {/* 5 High-Tensile Chrome Wheel Lug Nuts */}
        {Array.from({ length: 5 }).map((_, ni) => {
          const nAng = (ni / 5) * Math.PI * 2;
          return (
            <mesh key={ni} position={[Math.cos(nAng) * 0.046, Math.sin(nAng) * 0.046, 0.012]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.008, 0.008, 0.016, 6]} />
              <meshStandardMaterial color="#F8FAFC" roughness={0.1} metalness={0.98} />
            </mesh>
          );
        })}
      </group>

      {/* Brake Rotor & Brembo Caliper */}
      <BrakeAssembly wireframe={wireframe} />
    </group>
  );
}

// =========================================================================
// 2. FUEL CONTRA CANDY RED & GLOSS BLACK CONCAVE SPIRAL BLADE ALLOY
// (Matches user reference image media_1790679222725.png)
// =========================================================================
export function FuelContraRedWheel({ wireframe = false, scale = 1.0 }) {
  const redCandy = '#DC2626';
  return (
    <group scale={scale}>
      <HollowTyreCasing
        brandText="VREDESTEIN PINZA A/T"
        sizeText="285 / 60 R18 116T • ALL-TERRAIN"
        hasWhiteLettering={true}
        wireframe={wireframe}
      />

      {/* Deep-Dish Gloss Black Barrel */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.252, 0.252, 0.24, 64, 1, true]} />
        <meshStandardMaterial color="#0D0E11" roughness={0.18} metalness={0.92} wireframe={wireframe} />
      </mesh>

      {/* Outer Lip with Red Anodized Pinstripe */}
      <mesh position={[0, 0, 0.122]}>
        <ringGeometry args={[0.242, 0.254, 64]} />
        <meshStandardMaterial color={redCandy} roughness={0.15} metalness={0.90} wireframe={wireframe} />
      </mesh>

      {/* 10 Swept Directional Turbine / Spiral Blades with Candy Red Chamfered Flanks */}
      <group position={[0, 0, 0.05]}>
        {Array.from({ length: 10 }).map((_, si) => {
          const sAng = (si / 10) * Math.PI * 2;
          return (
            <group key={si} rotation={[0, 0, sAng]} position={[0, 0, 0]}>
              {/* Gloss Black Main Blade Body */}
              <group position={[0.04, 0.125, 0.035]} rotation={[0.12, 0.15, -0.32]}>
                <mesh castShadow>
                  <boxGeometry args={[0.038, 0.18, 0.024]} />
                  <meshStandardMaterial color="#0A0B0E" roughness={0.16} metalness={0.95} wireframe={wireframe} />
                </mesh>
                {/* Milled Candy Red Left Bevel Accent */}
                <mesh position={[-0.019, 0, 0.004]}>
                  <boxGeometry args={[0.008, 0.178, 0.018]} />
                  <meshStandardMaterial color={redCandy} roughness={0.12} metalness={0.92} wireframe={wireframe} />
                </mesh>
                {/* Milled Candy Red Right Bevel Accent */}
                <mesh position={[0.019, 0, 0.004]}>
                  <boxGeometry args={[0.008, 0.178, 0.018]} />
                  <meshStandardMaterial color={redCandy} roughness={0.12} metalness={0.92} wireframe={wireframe} />
                </mesh>
              </group>
            </group>
          );
        })}

        {/* Center Concave Drop & Fuel Center Cap */}
        <mesh position={[0, 0, 0.01]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.03, 32]} />
          <meshStandardMaterial color="#0D0E11" roughness={0.2} metalness={0.9} />
        </mesh>
        <mesh position={[0, 0, 0.026]}>
          <circleGeometry args={[0.05, 32]} />
          <meshStandardMaterial color="#0A0B0D" roughness={0.2} metalness={0.9} />
        </mesh>
        <mesh position={[0, 0, 0.028]}>
          <circleGeometry args={[0.028, 32]} />
          <meshStandardMaterial color={redCandy} roughness={0.15} metalness={0.88} />
        </mesh>

        {/* 5 Chrome Lug Nuts */}
        {Array.from({ length: 5 }).map((_, ni) => {
          const nAng = (ni / 5) * Math.PI * 2;
          return (
            <mesh key={ni} position={[Math.cos(nAng) * 0.048, Math.sin(nAng) * 0.048, 0.028]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.0075, 0.0075, 0.014, 6]} />
              <meshStandardMaterial color="#F8FAFC" roughness={0.1} metalness={0.98} />
            </mesh>
          );
        })}
      </group>

      <BrakeAssembly wireframe={wireframe} />
    </group>
  );
}

// =========================================================================
// 3. BFGOODRICH KO2 • METHOD RACE FORGED BRONZE RALLY BEADLOCK ALLOY
// (Matches user reference image media_1790679222725.png)
// =========================================================================
export function MethodBronzeKO2Wheel({ wireframe = false, scale = 1.0 }) {
  const bronzeColor = '#A77B24';
  return (
    <group scale={scale}>
      <HollowTyreCasing
        brandText="BFGOODRICH ALL-TERRAIN T/A"
        sizeText="LT 285 / 70 R17 121S • BAJA CHAMPION"
        hasWhiteLettering={true}
        wireframe={wireframe}
      />

      {/* Forged Bronze Inset Rim Barrel */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.252, 0.252, 0.24, 64, 1, true]} />
        <meshStandardMaterial color={bronzeColor} roughness={0.25} metalness={0.92} wireframe={wireframe} />
      </mesh>

      {/* Satin Black Simulated Beadlock Outer Ring */}
      <mesh position={[0, 0, 0.122]} castShadow>
        <ringGeometry args={[0.230, 0.254, 64]} />
        <meshStandardMaterial color="#1C1D21" roughness={0.3} metalness={0.85} wireframe={wireframe} />
      </mesh>

      {/* 16 Recessed Hex Screws on Beadlock */}
      {Array.from({ length: 16 }).map((_, bi) => {
        const bAng = (bi / 16) * Math.PI * 2;
        return (
          <mesh key={bi} position={[Math.cos(bAng) * 0.242, Math.sin(bAng) * 0.242, 0.126]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.0045, 0.0045, 0.008, 6]} />
            <meshStandardMaterial color="#E2E8F0" roughness={0.15} metalness={0.98} />
          </mesh>
        );
      })}

      {/* Method 8-Window Forged Rally Dish (Deep Concave!) */}
      <group position={[0, 0, 0.06]}>
        {Array.from({ length: 8 }).map((_, si) => {
          const sAng = (si / 8) * Math.PI * 2;
          return (
            <group key={si} rotation={[0, 0, sAng]}>
              <mesh position={[0, 0.13, 0.02]} rotation={[0.10, 0, 0]} castShadow>
                <boxGeometry args={[0.065, 0.165, 0.028]} />
                <meshStandardMaterial color={bronzeColor} roughness={0.24} metalness={0.94} wireframe={wireframe} />
              </mesh>
            </group>
          );
        })}

        {/* Center Hub & Black Method Cap */}
        <mesh position={[0, 0, 0.005]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.075, 0.075, 0.035, 32]} />
          <meshStandardMaterial color="#121316" roughness={0.35} metalness={0.8} />
        </mesh>
        <mesh position={[0, 0, 0.024]}>
          <circleGeometry args={[0.048, 32]} />
          <meshStandardMaterial color="#0F1013" roughness={0.2} metalness={0.9} />
        </mesh>
        <mesh position={[0, 0, 0.026]}>
          <circleGeometry args={[0.024, 32]} />
          <meshStandardMaterial color={bronzeColor} roughness={0.2} metalness={0.9} />
        </mesh>

        {/* 5 Chrome Lug Nuts */}
        {Array.from({ length: 5 }).map((_, ni) => {
          const nAng = (ni / 5) * Math.PI * 2;
          return (
            <mesh key={ni} position={[Math.cos(nAng) * 0.045, Math.sin(nAng) * 0.045, 0.025]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.0075, 0.0075, 0.015, 6]} />
              <meshStandardMaterial color="#F8FAFC" roughness={0.1} metalness={0.98} />
            </mesh>
          );
        })}
      </group>

      <BrakeAssembly wireframe={wireframe} />
    </group>
  );
}

// =========================================================================
// 4. MAHINDRA THAR 18" FACTORY DIAMOND-CUT ALLOY • CEAT CZAR A/T
// (Matches user reference image media_1790679222725.png)
// =========================================================================
export function TharOEMDiamondWheel({ wireframe = false, scale = 1.0 }) {
  return (
    <group scale={scale}>
      <HollowTyreCasing
        brandText="CEAT CZAR A/T"
        sizeText="255 / 65 R18 110T • ALL-TERRAIN"
        hasWhiteLettering={true}
        wireframe={wireframe}
      />

      {/* Dark Anthracite Inset Rim Barrel */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.252, 0.252, 0.23, 64, 1, true]} />
        <meshStandardMaterial color="#16181C" roughness={0.3} metalness={0.88} wireframe={wireframe} />
      </mesh>

      {/* Diamond-Cut Machined Bright Outer Lip */}
      <mesh position={[0, 0, 0.116]}>
        <ringGeometry args={[0.238, 0.254, 64]} />
        <meshStandardMaterial color="#F8FAFC" roughness={0.12} metalness={0.98} wireframe={wireframe} />
      </mesh>

      {/* 5-Split Twin Spokes (10 total arms) with Dual-Tone Machined Face & Obsidian Flanks */}
      <group position={[0, 0, 0.07]}>
        {Array.from({ length: 5 }).map((_, si) => {
          const baseAng = (si / 5) * Math.PI * 2;
          return (
            <group key={si} rotation={[0, 0, baseAng]}>
              {/* Left Spoke Arm */}
              <group position={[-0.034, 0.125, 0.02]} rotation={[0.08, 0, 0.08]}>
                {/* Obsidian Black Flank */}
                <mesh position={[0, 0, -0.012]} castShadow>
                  <boxGeometry args={[0.040, 0.17, 0.024]} />
                  <meshStandardMaterial color="#0E1014" roughness={0.25} metalness={0.85} wireframe={wireframe} />
                </mesh>
                {/* Diamond-Cut Machined Silver Face */}
                <mesh position={[0, 0, 0.006]}>
                  <boxGeometry args={[0.034, 0.165, 0.012]} />
                  <meshStandardMaterial color="#F8FAFC" roughness={0.10} metalness={0.98} wireframe={wireframe} />
                </mesh>
              </group>

              {/* Right Spoke Arm */}
              <group position={[0.034, 0.125, 0.02]} rotation={[0.08, 0, -0.08]}>
                {/* Obsidian Black Flank */}
                <mesh position={[0, 0, -0.012]} castShadow>
                  <boxGeometry args={[0.040, 0.17, 0.024]} />
                  <meshStandardMaterial color="#0E1014" roughness={0.25} metalness={0.85} wireframe={wireframe} />
                </mesh>
                {/* Diamond-Cut Machined Silver Face */}
                <mesh position={[0, 0, 0.006]}>
                  <boxGeometry args={[0.034, 0.165, 0.012]} />
                  <meshStandardMaterial color="#F8FAFC" roughness={0.10} metalness={0.98} wireframe={wireframe} />
                </mesh>
              </group>
            </group>
          );
        })}

        {/* Center Hub & Mahindra Chrome Emblem Cap */}
        <mesh position={[0, 0, 0.01]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.072, 0.072, 0.03, 32]} />
          <meshStandardMaterial color="#111317" roughness={0.3} metalness={0.8} />
        </mesh>
        <mesh position={[0, 0, 0.026]}>
          <circleGeometry args={[0.05, 32]} />
          <meshStandardMaterial color="#E2E8F0" roughness={0.15} metalness={0.96} />
        </mesh>
        {/* Mahindra Chrome Twin Peaks Logo Silhouette */}
        <mesh position={[0, 0, 0.028]}>
          <circleGeometry args={[0.022, 32]} />
          <meshStandardMaterial color="#0F1115" roughness={0.2} metalness={0.9} />
        </mesh>

        {/* 5 Chrome Lug Nuts */}
        {Array.from({ length: 5 }).map((_, ni) => {
          const nAng = (ni / 5) * Math.PI * 2;
          return (
            <mesh key={ni} position={[Math.cos(nAng) * 0.046, Math.sin(nAng) * 0.046, 0.026]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.0075, 0.0075, 0.014, 6]} />
              <meshStandardMaterial color="#F8FAFC" roughness={0.1} metalness={0.98} />
            </mesh>
          );
        })}
      </group>

      <BrakeAssembly wireframe={wireframe} />
    </group>
  );
}

// =========================================================================
// 5. AUTHENTIC 3D ALLOY RIM (FROM USER rim.glb - 763k polys)
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
// 6. AUTHENTIC 3D OFF-ROAD TYRE (FROM USER tyre1.glb - 3.56M polys)
// =========================================================================
export function UserTyreNode({ wireframe = false, scale = 1.0, rotation = [0, 0, 0] }) {
  const baseUrl = import.meta.env.BASE_URL || '/';
  const { scene } = useGLTF(`${baseUrl}models/tyre1.glb`);
  const cloned = useMemo(() => scene.clone(true), [scene]);

  useMemo(() => {
    const rubberMat = new THREE.MeshStandardMaterial({
      color: '#1A1C20',
      roughness: 0.88,
      metalness: 0.04,
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
// 7. COMPLETE AUTHENTIC WHEEL ASSEMBLY (rim.glb + tyre1.glb COMBINED - 4.3M polys)
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
// BESPOKE WHEEL ADAPTER FOR MAHINDRA THAR (MOUNTS TO ALL 5 AXLE HUBS)
// =========================================================================
export function TharFittedWheelSet({ wheelType }) {
  if (!wheelType || wheelType === 'oem') {
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
          {(wheelType === 'user_custom' || wheelType === 'custom' || wheelType === 'maxxis_bimbra') && (
            <UserWheelAssembly scale={0.170} />
          )}
          {wheelType === 'fuel_contra' && <FuelContraRedWheel scale={0.41} />}
          {wheelType === 'method_bronze' && <MethodBronzeKO2Wheel scale={0.41} />}
          {wheelType === 'thar_oem' && <TharOEMDiamondWheel scale={0.41} />}
        </group>
      ))}
    </group>
  );
}
