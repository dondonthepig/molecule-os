"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ParticleField } from "./particle-field";

/** Aurora + grid + particle backdrop with subtle cursor parallax. */
export function HeroBackground() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  const blobOneX = useTransform(springX, (v) => v * 26);
  const blobOneY = useTransform(springY, (v) => v * 20);
  const blobTwoX = useTransform(springX, (v) => v * -20);
  const blobTwoY = useTransform(springY, (v) => v * -14);
  const blobThreeX = useTransform(springX, (v) => v * 14);
  const blobThreeY = useTransform(springY, (v) => v * -18);

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  return (
    <div
      onPointerMove={handlePointerMove}
      className="absolute inset-0 isolate z-0 overflow-hidden bg-background"
      aria-hidden="true"
    >
      {/* Grid */}
      <div className="absolute inset-0 bg-grid-fade opacity-60" />

      {/* Aurora blobs */}
      <motion.div
        style={{ x: blobOneX, y: blobOneY }}
        className="absolute -top-32 left-[8%] h-[32rem] w-[32rem] rounded-full bg-brand-blue/25 blur-[110px]"
      />
      <motion.div
        style={{ x: blobTwoX, y: blobTwoY }}
        className="absolute top-10 right-[5%] h-[28rem] w-[28rem] rounded-full bg-brand-purple/25 blur-[110px]"
      />
      <motion.div
        style={{ x: blobThreeX, y: blobThreeY }}
        className="absolute bottom-[-10rem] left-1/3 h-[26rem] w-[26rem] rounded-full bg-brand-cyan/20 blur-[110px]"
      />

      {/* Particles */}
      <ParticleField className="absolute inset-0" />

      {/*
       * Edge-only vignette for text legibility near the top/bottom of the
       * viewport. Explicit z-0 + isolate (root) keeps this pinned behind the
       * z-10 content grid in hero-section.tsx regardless of DOM order.
       * Stops are pushed past 80% so the gradient never washes over the hero
       * molecule's bounding box (it sits as far right as ~90% of the section
       * width via `lg:justify-end`) — the old 50% stop crushed contrast at
       * the molecule's silhouette/bloom edges, reading as atoms "sinking"
       * into the background even though the canvas paints on top of this.
       */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, color-mix(in oklab, var(--background) 10%, transparent) 0%, transparent 20%, transparent 82%, var(--background) 100%)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 z-0 bg-radial-fade" />
    </div>
  );
}
