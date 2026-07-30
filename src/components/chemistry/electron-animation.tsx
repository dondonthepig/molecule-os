"use client";

import { motion } from "framer-motion";

type ElectronAnimationProps = {
  /** Path the electron travels, in local SVG coordinates. */
  points: { x: number; y: number }[];
  duration?: number;
  delay?: number;
  repeat?: number | typeof Infinity;
  color?: string;
  radius?: number;
};

/** A single animated electron dot traveling along a path — the shared building block for every 2D bond diagram. */
export function ElectronAnimation({
  points,
  duration = 1.6,
  delay = 0,
  repeat = Infinity,
  color = "#91c9ed",
  radius = 3.5,
}: ElectronAnimationProps) {
  return (
    <motion.circle
      r={radius}
      fill={color}
      initial={{ cx: points[0]?.x, cy: points[0]?.y, opacity: 0 }}
      animate={{
        cx: points.map((p) => p.x),
        cy: points.map((p) => p.y),
        opacity: [0, 1, 1, 0],
      }}
      transition={{ duration, delay, repeat, ease: "easeInOut" }}
      style={{ filter: `drop-shadow(0 0 4px ${color})` }}
    />
  );
}
