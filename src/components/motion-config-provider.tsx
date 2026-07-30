"use client";

import * as React from "react";
import { MotionConfig } from "framer-motion";

/** Makes every Framer Motion animation in the tree honor OS-level reduced-motion. */
export function MotionConfigProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
