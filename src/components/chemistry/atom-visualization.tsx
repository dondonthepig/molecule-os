"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ElectronAnimation } from "./electron-animation";
import { getMolecule, ELECTRONEGATIVITY } from "@/lib/chemistry/molecules";

const VIEW = { w: 240, h: 160 };

/**
 * 2D schematic close-up of electron behavior for a molecule — nucleus,
 * electrons, transfer/sharing/sea, rendered as a compact SVG. Complements the
 * 3D BondVisualization, which shows overall molecular geometry instead.
 */
export function AtomVisualization({
  moleculeId,
  size = "lg",
}: {
  moleculeId: string;
  size?: "sm" | "lg";
}) {
  const molecule = getMolecule(moleculeId);
  const scale = size === "sm" ? 0.62 : 1;

  if (molecule.isLattice) {
    return (
      <svg viewBox={`0 0 ${VIEW.w} ${VIEW.h}`} className="h-full w-full" style={{ transform: `scale(${scale})` }}>
        {[
          [50, 35], [120, 35], [190, 35],
          [50, 80], [120, 80], [190, 80],
          [50, 125], [120, 125], [190, 125],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={11} fill="#a5a5aa" opacity={0.85} />
        ))}
        {Array.from({ length: 10 }).map((_, i) => (
          <ElectronAnimation
            key={i}
            color="#91c9ed"
            radius={2.5}
            duration={3 + (i % 4)}
            delay={i * 0.15}
            points={[
              { x: 20 + ((i * 41) % 200), y: 20 + ((i * 57) % 120) },
              { x: 40 + ((i * 67) % 190), y: 40 + ((i * 33) % 110) },
              { x: 20 + ((i * 41) % 200), y: 20 + ((i * 57) % 120) },
            ]}
          />
        ))}
      </svg>
    );
  }

  const bond = molecule.bonds[0];
  const atomA = molecule.atoms.find((a) => a.id === bond?.from) ?? molecule.atoms[0];
  const atomB = molecule.atoms.find((a) => a.id === bond?.to) ?? molecule.atoms[1] ?? molecule.atoms[0];

  const ax = 70;
  const bx = 170;
  const cy = 80;
  const kind = bond?.kind ?? "covalent-single";

  if (kind === "ionic") {
    const enA = ELECTRONEGATIVITY[atomA.element];
    const enB = ELECTRONEGATIVITY[atomB.element];
    const donor = enA <= enB ? { atom: atomA, x: ax } : { atom: atomB, x: bx };
    const acceptor = enA <= enB ? { atom: atomB, x: bx } : { atom: atomA, x: ax };
    return (
      <svg viewBox={`0 0 ${VIEW.w} ${VIEW.h}`} className="h-full w-full" style={{ transform: `scale(${scale})` }}>
        <circle cx={donor.x} cy={cy} r={donor.atom.radius * 44} fill={donor.atom.color} />
        <text
          x={donor.x}
          y={cy + 4}
          textAnchor="middle"
          stroke="black"
          strokeWidth="3"
          strokeOpacity="0.55"
          paintOrder="stroke"
          className="fill-white text-[12px] font-semibold"
        >
          {donor.atom.element}⁺
        </text>
        <circle cx={acceptor.x} cy={cy} r={acceptor.atom.radius * 44} fill={acceptor.atom.color} />
        <text
          x={acceptor.x}
          y={cy + 4}
          textAnchor="middle"
          stroke="black"
          strokeWidth="3"
          strokeOpacity="0.55"
          paintOrder="stroke"
          className="fill-white text-[12px] font-semibold"
        >
          {acceptor.atom.element}⁻
        </text>
        <motion.line
          x1={donor.x + 30}
          y1={cy}
          x2={acceptor.x - 34}
          y2={cy}
          stroke="color-mix(in oklab, var(--foreground) 35%, transparent)"
          strokeWidth={2}
          strokeDasharray="4 5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8 }}
        />
        <ElectronAnimation
          points={[
            { x: donor.x + 14, y: cy - 14 },
            { x: (donor.x + acceptor.x) / 2, y: cy - 26 },
            { x: acceptor.x - 16, y: cy - 6 },
          ]}
          duration={1.4}
          repeat={Infinity}
        />
      </svg>
    );
  }

  if (kind === "hydrogen") {
    return (
      <svg viewBox={`0 0 ${VIEW.w} ${VIEW.h}`} className="h-full w-full" style={{ transform: `scale(${scale})` }}>
        <circle cx={ax} cy={cy} r={atomA.radius * 44} fill={atomA.color} />
        <text
          x={ax}
          y={cy + 4}
          textAnchor="middle"
          stroke="black"
          strokeWidth="3"
          strokeOpacity="0.55"
          paintOrder="stroke"
          className="fill-white text-[11px] font-semibold"
        >
          {atomA.element}
          {atomA.partialCharge ? `δ${atomA.partialCharge}` : ""}
        </text>
        <circle cx={bx} cy={cy} r={atomB.radius * 44} fill={atomB.color} />
        <text
          x={bx}
          y={cy + 4}
          textAnchor="middle"
          stroke="black"
          strokeWidth="3"
          strokeOpacity="0.55"
          paintOrder="stroke"
          className="fill-white text-[11px] font-semibold"
        >
          {atomB.element}
          {atomB.partialCharge ? `δ${atomB.partialCharge}` : ""}
        </text>
        <motion.line
          x1={ax + 26}
          y1={cy}
          x2={bx - 30}
          y2={cy}
          stroke="#91c9ed"
          strokeWidth={1.5}
          strokeDasharray="2 6"
          initial={{ opacity: 0.3 }}
          animate={{ opacity: [0.3, 0.9, 0.3] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    );
  }

  // covalent-single / covalent-double, possibly polar
  const enA = ELECTRONEGATIVITY[atomA.element];
  const enB = ELECTRONEGATIVITY[atomB.element];
  const delta = Math.abs(enA - enB);
  const isPolar = delta >= 0.4;
  const midBias = isPolar ? (enA > enB ? -14 : 14) : 0;
  const midX = (ax + bx) / 2 + midBias;

  return (
    <svg viewBox={`0 0 ${VIEW.w} ${VIEW.h}`} className="h-full w-full" style={{ transform: `scale(${scale})` }}>
      <circle cx={ax} cy={cy} r={atomA.radius * 44} fill={atomA.color} />
      <text
        x={ax}
        y={cy + 4}
        textAnchor="middle"
        stroke="black"
        strokeWidth="3"
        strokeOpacity="0.55"
        paintOrder="stroke"
        className="fill-white text-[12px] font-semibold"
      >
        {atomA.element}
        {atomA.partialCharge ? `δ${atomA.partialCharge}` : ""}
      </text>
      <circle cx={bx} cy={cy} r={atomB.radius * 44} fill={atomB.color} />
      <text
        x={bx}
        y={cy + 4}
        textAnchor="middle"
        stroke="black"
        strokeWidth="3"
        strokeOpacity="0.55"
        paintOrder="stroke"
        className="fill-white text-[12px] font-semibold"
      >
        {atomB.element}
        {atomB.partialCharge ? `δ${atomB.partialCharge}` : ""}
      </text>
      <motion.g
        animate={isPolar ? {} : { x: [0, 2, -2, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <circle cx={midX - 6} cy={cy - 6} r={3.5} fill="#91c9ed" />
        <circle cx={midX + 6} cy={cy + 8} r={3.5} fill="#91c9ed" />
      </motion.g>
    </svg>
  );
}
