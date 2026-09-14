"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";

const HeroMoleculeScene = dynamic(
  () => import("@/components/three/hero-molecule-scene").then((mod) => mod.HeroMoleculeScene),
  {
    ssr: false,
    loading: () => <MoleculeLoadingFallback />,
  },
);

function MoleculeLoadingFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="size-40 animate-pulse rounded-full bg-gradient-to-br from-brand-blue/40 via-brand-cyan/30 to-brand-purple/40 blur-2xl" />
    </div>
  );
}

/** Static, non-animated stand-in shown when the user prefers reduced motion. */
function StaticMoleculeGlyph() {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div className="absolute size-72 rounded-full bg-gradient-to-br from-brand-blue/25 via-brand-cyan/20 to-brand-purple/25 blur-3xl" />
      <svg
        viewBox="0 0 200 200"
        className="relative size-64 opacity-90"
        aria-hidden="true"
      >
        <g stroke="#37458a" strokeWidth="2" opacity="0.7">
          <line x1="100" y1="40" x2="155" y2="70" />
          <line x1="155" y1="70" x2="155" y2="130" />
          <line x1="155" y1="130" x2="100" y2="160" />
          <line x1="100" y1="160" x2="45" y2="130" />
          <line x1="45" y1="130" x2="45" y2="70" />
          <line x1="45" y1="70" x2="100" y2="40" />
        </g>
        {[
          [100, 40],
          [155, 70],
          [155, 130],
          [100, 160],
          [45, 130],
          [45, 70],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={9} fill="#4361ee" />
        ))}
        <circle cx="100" cy="100" r="6" fill="#2b3566" />
      </svg>
    </div>
  );
}

export function HeroMolecule() {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      className="relative aspect-square w-full max-w-xl"
    >
      {reduceMotion ? <StaticMoleculeGlyph /> : <HeroMoleculeScene />}
    </motion.div>
  );
}
