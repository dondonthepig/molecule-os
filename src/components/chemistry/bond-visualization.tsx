"use client";

import dynamic from "next/dynamic";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import type { MoleculeSpec } from "@/lib/chemistry/molecules";
import type { MoleculeRenderMode } from "./bond-visualization-scene";

const BondVisualizationScene = dynamic(
  () => import("./bond-visualization-scene").then((mod) => mod.BondVisualizationScene),
  { ssr: false, loading: () => <VisualizationLoadingFallback /> },
);

function VisualizationLoadingFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="size-32 animate-pulse rounded-full bg-gradient-to-br from-brand-blue/40 via-brand-cyan/30 to-brand-purple/40 blur-2xl" />
    </div>
  );
}

/**
 * Interactive 3D molecule/bond viewer — rotate, zoom, and watch electron
 * behavior. Shared by Bond Explorer and Molecule Library (and reusable by
 * future Reaction Atlas / Organic Chemistry / AI Tutor pages). All new props
 * are optional and default to Bond Explorer's original behavior.
 */
export function BondVisualization({
  molecule,
  replayToken,
  viewResetToken,
  showLabels = true,
  showBonds = true,
  renderMode = "ballAndStick",
  enablePan = false,
  autoRotate = true,
}: {
  molecule: MoleculeSpec;
  replayToken: number;
  viewResetToken: number;
  showLabels?: boolean;
  showBonds?: boolean;
  renderMode?: MoleculeRenderMode;
  enablePan?: boolean;
  autoRotate?: boolean;
}) {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <div className="h-full w-full">
      <BondVisualizationScene
        key={`canvas-${viewResetToken}`}
        molecule={molecule}
        reduceMotion={reduceMotion}
        replayToken={replayToken}
        showLabels={showLabels}
        showBonds={showBonds}
        renderMode={renderMode}
        enablePan={enablePan}
        autoRotate={autoRotate}
      />
    </div>
  );
}
