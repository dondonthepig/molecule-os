"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";
import { dict } from "@/lib/i18n";

type BondTypeKey = keyof typeof dict.interactiveDemo.bondTypes;

const BOND_TYPE_KEYS: BondTypeKey[] = ["ionic", "covalent", "metallic"];

const BOND_TYPES = BOND_TYPE_KEYS.map((id) => ({
  id,
  ...dict.interactiveDemo.bondTypes[id],
}));

function IonicVisual() {
  return (
    <svg viewBox="0 0 240 160" className="h-full w-full">
      <motion.circle
        cx="70"
        cy="80"
        r="24"
        fill="#f5c542"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />
      <text
        x="70"
        y="86"
        textAnchor="middle"
        stroke="black"
        strokeWidth="3"
        strokeOpacity="0.55"
        paintOrder="stroke"
        className="fill-white text-[13px] font-semibold"
      >
        Na⁺
      </text>
      <motion.circle
        cx="170"
        cy="80"
        r="30"
        fill="#4ec95e"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />
      <text
        x="170"
        y="86"
        textAnchor="middle"
        stroke="black"
        strokeWidth="3"
        strokeOpacity="0.55"
        paintOrder="stroke"
        className="fill-white text-[13px] font-semibold"
      >
        Cl⁻
      </text>
      <motion.line
        x1="96"
        y1="80"
        x2="138"
        y2="80"
        stroke="color-mix(in oklab, var(--foreground) 35%, transparent)"
        strokeWidth="2"
        strokeDasharray="4 5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6 }}
      />
      <motion.circle
        r="4"
        fill="#4cc9f0"
        initial={{ cx: 78, cy: 68, opacity: 1 }}
        animate={{ cx: [78, 130, 158], cy: [68, 55, 68], opacity: [1, 1, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 0.6, ease: "easeInOut" }}
      />
    </svg>
  );
}

function CovalentVisual() {
  return (
    <svg viewBox="0 0 240 160" className="h-full w-full">
      <circle cx="95" cy="80" r="26" fill="#f2f2f2" />
      <text
        x="95"
        y="86"
        textAnchor="middle"
        stroke="black"
        strokeWidth="3"
        strokeOpacity="0.55"
        paintOrder="stroke"
        className="fill-white text-[13px] font-semibold"
      >
        H
      </text>
      <circle cx="145" cy="80" r="26" fill="#f2f2f2" />
      <text
        x="145"
        y="86"
        textAnchor="middle"
        stroke="black"
        strokeWidth="3"
        strokeOpacity="0.55"
        paintOrder="stroke"
        className="fill-white text-[13px] font-semibold"
      >
        H
      </text>
      <motion.g
        animate={{ x: [0, 3, -3, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <circle cx="112" cy="72" r="3.5" fill="#4cc9f0" />
        <circle cx="128" cy="88" r="3.5" fill="#4cc9f0" />
      </motion.g>
    </svg>
  );
}

function MetallicVisual() {
  const ions = [
    [60, 45],
    [120, 45],
    [180, 45],
    [60, 90],
    [120, 90],
    [180, 90],
    [60, 135],
    [120, 135],
    [180, 135],
  ];
  return (
    <svg viewBox="0 0 240 160" className="h-full w-full">
      {ions.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="12" fill="#37458a" opacity={0.9} />
      ))}
      {Array.from({ length: 14 }).map((_, i) => (
        <motion.circle
          key={`e-${i}`}
          r="2.5"
          fill="#4cc9f0"
          initial={{
            cx: 20 + ((i * 37) % 200),
            cy: 20 + ((i * 53) % 120),
          }}
          animate={{
            cx: [20 + ((i * 37) % 200), 40 + ((i * 61) % 190), 20 + ((i * 37) % 200)],
            cy: [20 + ((i * 53) % 120), 30 + ((i * 41) % 110), 20 + ((i * 53) % 120)],
          }}
          transition={{
            duration: 4 + (i % 4),
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </svg>
  );
}

const VISUALS: Record<string, React.ReactNode> = {
  ionic: <IonicVisual />,
  covalent: <CovalentVisual />,
  metallic: <MetallicVisual />,
};

export function InteractiveDemoSection() {
  const [active, setActive] = React.useState(BOND_TYPES[1].id);
  const activeBond = BOND_TYPES.find((b) => b.id === active)!;

  return (
    <section className="relative px-6 py-24 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="text-xs font-semibold text-brand-cyan">
            {dict.interactiveDemo.eyebrow}
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            {dict.interactiveDemo.heading}
          </h2>
          <p className="mt-4 max-w-xl text-muted-foreground">
            {dict.interactiveDemo.paragraph}
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-10">
          <div className="glass grid grid-cols-1 gap-0 overflow-hidden rounded-3xl border-border/60 lg:grid-cols-5">
            <div className="flex flex-col gap-2 border-border/60 p-6 lg:col-span-2 lg:border-r">
              {BOND_TYPES.map((bond) => (
                <button
                  key={bond.id}
                  type="button"
                  onClick={() => setActive(bond.id)}
                  className={cn(
                    "rounded-xl border px-4 py-3 text-left transition-all",
                    active === bond.id
                      ? "border-brand-blue/50 bg-muted/60"
                      : "border-transparent hover:bg-muted/30",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">
                      {bond.label}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {bond.formula}
                    </span>
                  </div>
                  {active === bond.id ? (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-2 text-xs leading-relaxed text-muted-foreground"
                    >
                      {bond.description}
                    </motion.p>
                  ) : null}
                </button>
              ))}
            </div>

            <div className="relative flex flex-col items-center justify-center gap-4 p-8 lg:col-span-3">
              <div className="h-48 w-full max-w-sm">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.94 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full w-full"
                  >
                    {VISUALS[active]}
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="glass-subtle rounded-full px-4 py-1.5 text-xs text-muted-foreground">
                {dict.interactiveDemo.exampleLabel}{" "}
                <span className="text-foreground">{activeBond.example}</span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
