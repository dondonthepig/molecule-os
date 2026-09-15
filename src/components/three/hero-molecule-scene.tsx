"use client";

import * as React from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import {
  MOLECULE_ATOMS,
  MOLECULE_ATOM_MAP,
  MOLECULE_BONDS,
} from "./molecule-data";

function AtomMesh({ atom }: { atom: (typeof MOLECULE_ATOMS)[number] }) {
  return (
    <mesh position={atom.position}>
      <sphereGeometry args={[atom.radius, 32, 32]} />
      <meshStandardMaterial
        color={atom.color}
        emissive={atom.color}
        emissiveIntensity={0.55}
        metalness={0.2}
        roughness={0.25}
      />
      {/* Thin ice-blue rim light: a slightly larger back-face shell reads as a
          silhouette outline, keeping every atom legible against the dark
          background regardless of its own fill color. */}
      <mesh scale={1.12}>
        <sphereGeometry args={[atom.radius, 24, 24]} />
        <meshBasicMaterial color="#4cc9f0" transparent opacity={0.22} side={THREE.BackSide} />
      </mesh>
    </mesh>
  );
}

function BondMesh({ from, to }: { from: [number, number, number]; to: [number, number, number] }) {
  const { position, quaternion, length } = React.useMemo(() => {
    const start = new THREE.Vector3(...from);
    const end = new THREE.Vector3(...to);
    const mid = start.clone().add(end).multiplyScalar(0.5);
    const dir = end.clone().sub(start);
    const len = dir.length();
    const quat = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      dir.clone().normalize(),
    );
    return { position: mid, quaternion: quat, length: len };
  }, [from, to]);

  return (
    <mesh position={position} quaternion={quaternion}>
      <cylinderGeometry args={[0.05, 0.05, length, 12]} />
      <meshStandardMaterial
        color="#9aa0a8"
        emissive="#5a6472"
        emissiveIntensity={0.1}
        metalness={0.45}
        roughness={0.35}
        transparent
        opacity={0.85}
      />
    </mesh>
  );
}

function MoleculeGroup() {
  const group = React.useRef<THREE.Group>(null);
  const pointer = React.useRef({ x: 0, y: 0 });

  React.useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    g.rotation.y += delta * 0.16;
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, pointer.current.y * 0.18, 0.04);
    g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, -pointer.current.x * 0.08, 0.04);
  });

  return (
    // 0.72 (up from 0.62) still keeps the farthest tail atom's swept radius
    // (sqrt(x²+z²) as it spins through rotation.y) at ~24% inside the
    // fov:48/z:8.6 camera's horizontal frustum at that depth — see
    // PHASE_PROGRESS.md §20 for why this margin was tight enough to clip
    // once already; don't push scale up further without also widening fov
    // or moving the camera back.
    <group ref={group} scale={0.72}>
      {MOLECULE_BONDS.map(([fromId, toId]) => {
        const from = MOLECULE_ATOM_MAP.get(fromId)!;
        const to = MOLECULE_ATOM_MAP.get(toId)!;
        return (
          <BondMesh key={`${fromId}-${toId}`} from={from.position} to={to.position} />
        );
      })}
      {MOLECULE_ATOMS.map((atom) => (
        <AtomMesh key={atom.id} atom={atom} />
      ))}
    </group>
  );
}

export function HeroMoleculeScene() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 8.6], fov: 48 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      className="!touch-none"
    >
      <ambientLight intensity={0.65} />
      <directionalLight position={[5, 6, 5]} intensity={1.5} color="#eef4ff" />
      <pointLight position={[-6, -2, -3]} intensity={20} color="#2b3566" distance={22} />
      <pointLight position={[5, -4, 4]} intensity={14} color="#4cc9f0" distance={18} />
      <Float speed={1.3} rotationIntensity={0.35} floatIntensity={0.9}>
        <MoleculeGroup />
      </Float>
      <EffectComposer multisampling={0}>
        <Bloom
          intensity={0.55}
          luminanceThreshold={0.18}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
      </EffectComposer>
    </Canvas>
  );
}
