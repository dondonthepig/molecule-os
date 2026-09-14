"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { dict } from "@/lib/i18n";

/** Electron-orbit visual for the Bond Explorer / 3D viewer feature card. */
export function OrbitVisual() {
  return (
    <div className="relative flex h-full items-center justify-center">
      <div className="absolute size-24 rounded-full bg-brand-blue/20 blur-2xl" />
      <div className="relative size-28">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="size-3.5 rounded-full bg-gradient-to-br from-brand-blue to-brand-cyan shadow-[0_0_16px_-2px_var(--color-brand-blue)]" />
        </div>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border border-white/15"
            style={{ rotate: i * 60 }}
            animate={{ rotate: i * 60 + 360 }}
            transition={{
              duration: 6 + i * 2,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <span
              className="absolute top-1/2 left-0 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                backgroundColor: i === 0 ? "#4361ee" : i === 1 ? "#4cc9f0" : "#2b3566",
                boxShadow: "0 0 8px currentColor",
              }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/** Reaction pathway visual: Alcohol -> Aldehyde -> Carboxylic Acid */
export function ReactionFlowVisual() {
  const steps = dict.featureVisuals.reactionSteps;
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2.5">
      {steps.map((step, i) => (
        <React.Fragment key={step}>
          <div className="glass-subtle rounded-lg px-3 py-1.5 text-xs font-medium text-foreground">
            {step}
          </div>
          {i < steps.length - 1 ? (
            <motion.div
              className="h-4 w-px bg-gradient-to-b from-brand-blue to-brand-purple"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.15 * i }}
            />
          ) : null}
        </React.Fragment>
      ))}
    </div>
  );
}

/** Periodic-table swatch visual: cycling highlighted cell. */
export function PeriodicSwatchVisual() {
  const [active, setActive] = React.useState(0);
  const cells = 24;

  React.useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % cells), 500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="grid h-full grid-cols-6 gap-1.5 p-1">
      {Array.from({ length: cells }).map((_, i) => (
        <motion.div
          key={i}
          className="rounded-[4px]"
          animate={{
            backgroundColor: i === active ? "#4cc9f0" : "rgba(76, 201, 240, 0.14)",
            scale: i === active ? 1.12 : 1,
          }}
          transition={{ duration: 0.35 }}
        />
      ))}
    </div>
  );
}

/** AI Tutor chat bubble typing visual. */
export function ChatTypingVisual() {
  const [step, setStep] = React.useState(0);
  const messages = [dict.featureVisuals.chatQuestion, dict.featureVisuals.chatAnswer];

  React.useEffect(() => {
    const id = setInterval(() => setStep((s) => (s + 1) % 3), 1600);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex h-full flex-col justify-center gap-2 px-2">
      <AnimatePresence mode="wait">
        {step >= 1 ? (
          <motion.div
            key="q"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="glass-subtle ml-auto max-w-[80%] rounded-2xl rounded-tr-sm px-3 py-2 text-xs text-foreground"
          >
            {messages[0]}
          </motion.div>
        ) : null}
      </AnimatePresence>
      <AnimatePresence mode="wait">
        {step === 2 ? (
          <motion.div
            key="a"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="max-w-[85%] rounded-2xl rounded-tl-sm bg-gradient-to-br from-brand-blue to-brand-purple px-3 py-2 text-xs text-white"
          >
            {messages[1]}
          </motion.div>
        ) : step === 0 ? (
          <motion.div
            key="typing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="glass-subtle flex w-fit items-center gap-1 rounded-full px-3 py-2"
          >
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="size-1.5 rounded-full bg-muted-foreground"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
              />
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

/** Quiz progress ring + streak visual. */
export function QuizProgressVisual() {
  return (
    <div className="flex h-full items-center justify-center gap-6">
      <div className="relative flex size-20 items-center justify-center">
        <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90">
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="color-mix(in oklab, var(--foreground) 10%, transparent)"
            strokeWidth="8"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="url(#quiz-gradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 42}
            initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
            whileInView={{ strokeDashoffset: 2 * Math.PI * 42 * 0.22 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          />
          <defs>
            <linearGradient id="quiz-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4361ee" />
              <stop offset="100%" stopColor="#2b3566" />
            </linearGradient>
          </defs>
        </svg>
        <span className="text-sm font-semibold text-foreground">78%</span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-2xl font-semibold text-gradient-brand">12</span>
        <span className="text-xs text-muted-foreground">
          {dict.featureVisuals.dayStreakLabel}
        </span>
      </div>
    </div>
  );
}

/** Knowledge graph visual: pulsing connected nodes. */
export function KnowledgeGraphVisual() {
  const nodes = [
    { x: 50, y: 20 },
    { x: 20, y: 55 },
    { x: 80, y: 50 },
    { x: 35, y: 85 },
    { x: 65, y: 85 },
  ];
  const edges: [number, number][] = [
    [0, 1],
    [0, 2],
    [1, 3],
    [2, 4],
    [1, 2],
  ];

  return (
    <svg viewBox="0 0 100 100" className="h-full w-full">
      {edges.map(([a, b], i) => (
        <motion.line
          key={i}
          x1={nodes[a].x}
          y1={nodes[a].y}
          x2={nodes[b].x}
          y2={nodes[b].y}
          stroke="color-mix(in oklab, var(--foreground) 16%, transparent)"
          strokeWidth="0.6"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: i * 0.1 }}
        />
      ))}
      {nodes.map((node, i) => (
        <motion.circle
          key={i}
          cx={node.x}
          cy={node.y}
          r={i === 0 ? 4.5 : 3.2}
          fill={i % 2 === 0 ? "#4361ee" : "#2b3566"}
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 + i * 0.08, type: "spring" }}
        />
      ))}
    </svg>
  );
}
