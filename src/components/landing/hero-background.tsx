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

      {/*
       * A single low-opacity cyan glow, not three overlapping blue/navy/cyan
       * blobs — three translucent color washes stacked on a dark background
       * read as a purple-blue haze rather than clean graphite, even once
       * each individual hue is correct. One glow also doubles as the "cyan
       * needs real visible area" requirement instead of only ever appearing
       * in thin text/borders.
       */}
      <motion.div
        style={{ x: blobOneX, y: blobOneY }}
        className="absolute -top-32 left-[8%] h-[32rem] w-[32rem] rounded-full bg-brand-cyan/10 blur-[110px]"
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
