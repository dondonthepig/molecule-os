"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { dict } from "@/lib/i18n";

export type LearningMode = "explore" | "learn";

export function LearningModeToggle({
  mode,
  onChange,
  className,
}: {
  mode: LearningMode;
  onChange: (mode: LearningMode) => void;
  className?: string;
}) {
  const options: { id: LearningMode; label: string }[] = [
    { id: "explore", label: dict.bondExplorer.modeToggle.explore },
    { id: "learn", label: dict.bondExplorer.modeToggle.learn },
  ];

  return (
    <div
      role="tablist"
      aria-label={dict.bondExplorer.modeToggle.explore + " / " + dict.bondExplorer.modeToggle.learn}
      className={cn("glass-subtle relative inline-flex items-center rounded-full p-1", className)}
    >
      {options.map((option) => {
        const active = mode === option.id;
        return (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.id)}
            className={cn(
              "relative z-10 rounded-full px-4 py-1.5 text-xs font-medium transition-colors",
              active ? "text-white" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {active ? (
              <motion.span
                layoutId="learning-mode-pill"
                className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-brand-blue via-brand-cyan to-brand-purple"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            ) : null}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
