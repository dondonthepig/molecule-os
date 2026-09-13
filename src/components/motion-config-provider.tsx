"use client";

import * as React from "react";
import { MotionConfig } from "framer-motion";
import { useSettings } from "@/hooks/use-settings";

/**
 * Makes every Framer Motion animation in the tree honor OS-level
 * reduced-motion, plus the user's explicit "Reduce motion" preference from
 * Settings (dict.settings.appearance.motionReduced) when set.
 */
export function MotionConfigProvider({ children }: { children: React.ReactNode }) {
  const { settings } = useSettings();
  const reducedMotion = settings.motion === "reduced" ? "always" : "user";
  return <MotionConfig reducedMotion={reducedMotion}>{children}</MotionConfig>;
}
