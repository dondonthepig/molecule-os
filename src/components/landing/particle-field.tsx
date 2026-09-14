"use client";

import * as React from "react";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";

type Particle = {
  x: number;
  y: number;
  radius: number;
  driftX: number;
  driftY: number;
  hue: "blue" | "cyan" | "soft";
  twinklePhase: number;
  twinkleSpeed: number;
};

/* Literal RGB, matching every other 3D/canvas color in the app (see
   CLAUDE.md — canvas/Three.js contexts can't consume CSS var()/color-mix()).
   blue/cyan are the base triad's literal hex; "soft" approximates
   --molecule-soft (molecule-blue 55% / molecule-ice 45%) — there is no
   fourth hue here, this is a shade of the same two colors. */
const COLORS: Record<Particle["hue"], string> = {
  blue: "67, 97, 238",
  cyan: "76, 201, 240",
  soft: "71, 144, 239",
};

const PARTICLE_COUNT = 70;

function createParticles(width: number, height: number): Particle[] {
  const hues: Particle["hue"][] = ["blue", "cyan", "soft"];
  return Array.from({ length: PARTICLE_COUNT }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 1.6 + 0.4,
    driftX: (Math.random() - 0.5) * 0.12,
    driftY: (Math.random() - 0.5) * 0.12 - 0.04,
    hue: hues[Math.floor(Math.random() * hues.length)],
    twinklePhase: Math.random() * Math.PI * 2,
    twinkleSpeed: Math.random() * 0.015 + 0.006,
  }));
}

/** Lightweight canvas particle field — cheaper than DOM nodes at this count. */
export function ParticleField({ className }: { className?: string }) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const reduceMotion = usePrefersReducedMotion();

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let particles: Particle[] = [];
    let frameId = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      width = parent?.clientWidth ?? window.innerWidth;
      height = parent?.clientHeight ?? window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = createParticles(width, height);
    };

    resize();
    window.addEventListener("resize", resize);

    const drawStatic = () => {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        ctx.beginPath();
        ctx.fillStyle = `rgba(${COLORS[p.hue]}, 0.55)`;
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    if (reduceMotion) {
      drawStatic();
      return () => window.removeEventListener("resize", resize);
    }

    const tick = () => {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.x += p.driftX;
        p.y += p.driftY;
        p.twinklePhase += p.twinkleSpeed;

        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        const twinkle = (Math.sin(p.twinklePhase) + 1) / 2;
        const alpha = 0.25 + twinkle * 0.5;

        ctx.beginPath();
        ctx.fillStyle = `rgba(${COLORS[p.hue]}, ${alpha})`;
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frameId);
    };
  }, [reduceMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
    />
  );
}
