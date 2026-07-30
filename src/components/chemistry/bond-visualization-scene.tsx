"use client";

import * as React from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import type { MoleculeSpec, AtomSpec } from "@/lib/chemistry/molecules";
import { ELECTRONEGATIVITY } from "@/lib/chemistry/molecules";

function AtomMesh({
  atom,
  showLabel = true,
  radiusScale = 1,
}: {
  atom: AtomSpec;
  showLabel?: boolean;
  radiusScale?: number;
}) {
  const chargeLabel = atom.ionicCharge
    ? atom.ionicCharge > 0
      ? "⁺"
      : "⁻"
    : atom.partialCharge
      ? `δ${atom.partialCharge}`
      : "";

  return (
    <group position={atom.position}>
      <mesh>
        <sphereGeometry args={[atom.radius * radiusScale, 32, 32]} />
        <meshStandardMaterial
          color={atom.color}
          emissive={atom.color}
          emissiveIntensity={0.45}
          metalness={0.2}
          roughness={0.3}
        />
      </mesh>
      {showLabel ? (
        <Html center style={{ pointerEvents: "none" }}>
          <div className="text-[11px] font-semibold text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.8)]">
            {atom.element}
            {chargeLabel}
          </div>
        </Html>
      ) : null}
    </group>
  );
}

function covalentTransform(from: [number, number, number], to: [number, number, number]) {
  const start = new THREE.Vector3(...from);
  const end = new THREE.Vector3(...to);
  const mid = start.clone().add(end).multiplyScalar(0.5);
  const dir = end.clone().sub(start);
  const length = dir.length();
  const quaternion = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    dir.clone().normalize(),
  );
  return { position: mid, quaternion, length };
}

function SharedElectronPair({
  from,
  to,
  biasT = 0.5,
  reduceMotion,
}: {
  from: [number, number, number];
  to: [number, number, number];
  biasT?: number;
  reduceMotion: boolean;
}) {
  const ref = React.useRef<THREE.Group>(null);
  const { position, quaternion } = React.useMemo(() => {
    const start = new THREE.Vector3(...from);
    const end = new THREE.Vector3(...to);
    const pos = start.clone().lerp(end, biasT);
    const dir = end.clone().sub(start).normalize();
    const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir);
    return { position: pos, quaternion: quat };
  }, [from, to, biasT]);

  useFrame((_, delta) => {
    if (reduceMotion || !ref.current) return;
    ref.current.rotation.z += delta * 1.6;
  });

  return (
    <group position={position} quaternion={quaternion} ref={ref}>
      {[0.17, -0.17].map((offset) => (
        <mesh key={offset} position={[offset, 0, 0]}>
          <sphereGeometry args={[0.055, 12, 12]} />
          <meshStandardMaterial color="#91c9ed" emissive="#91c9ed" emissiveIntensity={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function IonicTransferParticle({
  from,
  to,
  reduceMotion,
}: {
  from: [number, number, number];
  to: [number, number, number];
  reduceMotion: boolean;
}) {
  const ref = React.useRef<THREE.Mesh>(null);
  const elapsed = React.useRef(0);
  const cycle = 2.6;

  useFrame((_, delta) => {
    const mesh = ref.current;
    if (!mesh) return;
    const from3 = new THREE.Vector3(...from);
    const to3 = new THREE.Vector3(...to);
    const material = mesh.material as THREE.MeshStandardMaterial;

    if (reduceMotion) {
      mesh.position.copy(to3);
      material.opacity = 0;
      return;
    }

    elapsed.current += delta;
    const t = (elapsed.current % cycle) / cycle;
    const travelT = Math.min(1, t / 0.6);
    const eased = THREE.MathUtils.smoothstep(travelT, 0, 1);
    const pos = from3.clone().lerp(to3, eased);
    pos.y += Math.sin(eased * Math.PI) * 0.55;
    mesh.position.copy(pos);
    material.opacity = t < 0.65 ? 1 : Math.max(0, 1 - (t - 0.65) / 0.35);
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.075, 14, 14]} />
      <meshStandardMaterial color="#91c9ed" emissive="#91c9ed" emissiveIntensity={1.1} transparent opacity={1} />
    </mesh>
  );
}

function IonicBondGlow({
  from,
  to,
  reduceMotion,
}: {
  from: [number, number, number];
  to: [number, number, number];
  reduceMotion: boolean;
}) {
  const ref = React.useRef<THREE.Mesh>(null);
  const { position, quaternion, length } = React.useMemo(
    () => covalentTransform(from, to),
    [from, to],
  );

  useFrame(({ clock }) => {
    const mesh = ref.current;
    if (!mesh || reduceMotion) return;
    const material = mesh.material as THREE.MeshStandardMaterial;
    material.opacity = 0.35 + Math.sin(clock.elapsedTime * 1.4) * 0.12;
  });

  return (
    <mesh ref={ref} position={position} quaternion={quaternion}>
      <cylinderGeometry args={[0.025, 0.025, length, 8]} />
      <meshStandardMaterial color="#0571cc" emissive="#0571cc" emissiveIntensity={0.6} transparent opacity={0.4} />
    </mesh>
  );
}

function HydrogenBondLine({
  from,
  to,
  reduceMotion,
}: {
  from: [number, number, number];
  to: [number, number, number];
  reduceMotion: boolean;
}) {
  const ref = React.useRef<THREE.Mesh>(null);
  const { position, quaternion, length } = React.useMemo(
    () => covalentTransform(from, to),
    [from, to],
  );

  useFrame(({ clock }) => {
    const mesh = ref.current;
    if (!mesh || reduceMotion) return;
    const material = mesh.material as THREE.MeshStandardMaterial;
    material.opacity = 0.25 + Math.sin(clock.elapsedTime * 0.9) * 0.15;
  });

  return (
    <mesh ref={ref} position={position} quaternion={quaternion}>
      <cylinderGeometry args={[0.018, 0.018, length, 6]} />
      <meshStandardMaterial color="#91c9ed" emissive="#91c9ed" emissiveIntensity={0.5} transparent opacity={0.3} />
    </mesh>
  );
}

function CovalentBondMesh({
  from,
  to,
  bondOrder,
}: {
  from: [number, number, number];
  to: [number, number, number];
  bondOrder: 1 | 2 | 3;
}) {
  const { position, quaternion, length } = React.useMemo(() => covalentTransform(from, to), [from, to]);
  const radius = bondOrder === 3 ? 0.095 : bondOrder === 2 ? 0.075 : 0.05;
  return (
    <mesh position={position} quaternion={quaternion}>
      <cylinderGeometry args={[radius, radius, length, 12]} />
      <meshStandardMaterial
        color="#9aa0a8"
        emissive="#5a6472"
        emissiveIntensity={0.12}
        metalness={0.45}
        roughness={0.35}
        transparent
        opacity={0.85}
      />
    </mesh>
  );
}

function ElectronSea({ atoms, reduceMotion }: { atoms: AtomSpec[]; reduceMotion: boolean }) {
  const count = 18;
  const bounds = React.useMemo(() => {
    const xs = atoms.map((a) => a.position[0]);
    const ys = atoms.map((a) => a.position[1]);
    return {
      minX: Math.min(...xs) - 0.35,
      maxX: Math.max(...xs) + 0.35,
      minY: Math.min(...ys) - 0.35,
      maxY: Math.max(...ys) + 0.35,
    };
  }, [atoms]);

  const particles = React.useMemo(
    () =>
      Array.from({ length: count }, () => ({
        pos: new THREE.Vector3(
          THREE.MathUtils.randFloat(bounds.minX, bounds.maxX),
          THREE.MathUtils.randFloat(bounds.minY, bounds.maxY),
          THREE.MathUtils.randFloat(-0.35, 0.35),
        ),
        vel: new THREE.Vector3(
          THREE.MathUtils.randFloatSpread(0.5),
          THREE.MathUtils.randFloatSpread(0.5),
          THREE.MathUtils.randFloatSpread(0.25),
        ),
      })),
    [bounds],
  );

  const refs = React.useRef<(THREE.Mesh | null)[]>([]);

  useFrame((_, delta) => {
    if (reduceMotion) return;
    particles.forEach((p, i) => {
      p.pos.addScaledVector(p.vel, delta);
      if (p.pos.x < bounds.minX || p.pos.x > bounds.maxX) p.vel.x *= -1;
      if (p.pos.y < bounds.minY || p.pos.y > bounds.maxY) p.vel.y *= -1;
      if (p.pos.z < -0.35 || p.pos.z > 0.35) p.vel.z *= -1;
      refs.current[i]?.position.copy(p.pos);
    });
  });

  return (
    <>
      {particles.map((p, i) => (
        <mesh
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          position={p.pos}
        >
          <sphereGeometry args={[0.045, 8, 8]} />
          <meshStandardMaterial color="#91c9ed" emissive="#91c9ed" emissiveIntensity={1} />
        </mesh>
      ))}
    </>
  );
}

export type MoleculeRenderMode = "ballAndStick" | "spaceFilling";

function MoleculeGroup({
  molecule,
  reduceMotion,
  showLabels = true,
  showBonds = true,
  renderMode = "ballAndStick",
}: {
  molecule: MoleculeSpec;
  reduceMotion: boolean;
  showLabels?: boolean;
  showBonds?: boolean;
  renderMode?: MoleculeRenderMode;
}) {
  const groupRef = React.useRef<THREE.Group>(null);
  const radiusScale = renderMode === "spaceFilling" ? 1.8 : 1;

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), Math.min(1, delta * 6));
  });

  return (
    <group ref={groupRef} scale={0.6}>
      {showBonds
        ? molecule.bonds.map((bond, i) => {
            const from = molecule.atoms.find((a) => a.id === bond.from)!;
            const to = molecule.atoms.find((a) => a.id === bond.to)!;
            if (bond.kind === "ionic") {
              return (
                <React.Fragment key={i}>
                  <IonicBondGlow from={from.position} to={to.position} reduceMotion={reduceMotion} />
                  <IonicTransferParticle from={from.position} to={to.position} reduceMotion={reduceMotion} />
                </React.Fragment>
              );
            }
            if (bond.kind === "hydrogen") {
              return <HydrogenBondLine key={i} from={from.position} to={to.position} reduceMotion={reduceMotion} />;
            }
            const enA = ELECTRONEGATIVITY[from.element];
            const enB = ELECTRONEGATIVITY[to.element];
            const delta = Math.abs(enA - enB);
            const biasT = delta >= 0.4 ? (enA > enB ? 0.35 : 0.65) : 0.5;
            const bondOrder = bond.kind === "covalent-triple" ? 3 : bond.kind === "covalent-double" ? 2 : 1;
            return (
              <React.Fragment key={i}>
                <CovalentBondMesh from={from.position} to={to.position} bondOrder={bondOrder} />
                <SharedElectronPair from={from.position} to={to.position} biasT={biasT} reduceMotion={reduceMotion} />
              </React.Fragment>
            );
          })
        : null}
      {molecule.atoms.map((atom) => (
        <AtomMesh key={atom.id} atom={atom} showLabel={showLabels} radiusScale={radiusScale} />
      ))}
      {molecule.isLattice ? <ElectronSea atoms={molecule.atoms} reduceMotion={reduceMotion} /> : null}
    </group>
  );
}

export function BondVisualizationScene({
  molecule,
  reduceMotion,
  replayToken,
  showLabels = true,
  showBonds = true,
  renderMode = "ballAndStick",
  enablePan = false,
  autoRotate = true,
}: {
  molecule: MoleculeSpec;
  reduceMotion: boolean;
  replayToken: number;
  showLabels?: boolean;
  showBonds?: boolean;
  renderMode?: MoleculeRenderMode;
  enablePan?: boolean;
  autoRotate?: boolean;
}) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 6.5], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      className="!touch-none"
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 6, 5]} intensity={1.4} color="#eef4ff" />
      <pointLight position={[-6, -2, -3]} intensity={18} color="#243b67" distance={20} />
      <pointLight position={[5, -4, 4]} intensity={12} color="#91c9ed" distance={16} />
      <MoleculeGroup
        key={`${molecule.id}-${replayToken}`}
        molecule={molecule}
        reduceMotion={reduceMotion}
        showLabels={showLabels}
        showBonds={showBonds}
        renderMode={renderMode}
      />
      <OrbitControls
        enableDamping
        dampingFactor={0.1}
        enablePan={enablePan}
        minDistance={3.5}
        maxDistance={11}
        autoRotate={autoRotate && !reduceMotion}
        autoRotateSpeed={0.6}
      />
      <EffectComposer multisampling={0}>
        <Bloom intensity={0.5} luminanceThreshold={0.2} luminanceSmoothing={0.9} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
}
