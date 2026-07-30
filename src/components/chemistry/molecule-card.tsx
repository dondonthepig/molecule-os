"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { dict } from "@/lib/i18n";
import { getMolecule } from "@/lib/chemistry/molecules";
import { getLibraryEntry, getAtomCount } from "@/lib/chemistry/molecule-library-data";
import { AtomVisualization } from "./atom-visualization";
import { FunctionalGroupBadge } from "./functional-group-badge";
import { PolarityIndicator } from "./polarity-indicator";

export function MoleculeCard({ moleculeId, onSelect }: { moleculeId: string; onSelect: () => void }) {
  const molecule = getMolecule(moleculeId);
  const entry = getLibraryEntry(moleculeId);
  const copy = dict.moleculeLibrary.molecules[moleculeId as keyof typeof dict.moleculeLibrary.molecules];
  const atomCount = getAtomCount(moleculeId);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 250, damping: 20 });
  const springY = useSpring(rotateY, { stiffness: 250, damping: 20 });
  const transformedRotateX = useTransform(springX, (v) => `${v}deg`);
  const transformedRotateY = useTransform(springY, (v) => `${v}deg`);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * 10);
    rotateX.set(py * -10);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX: transformedRotateX, rotateY: transformedRotateY, transformPerspective: 800 }}
      className="glass-subtle group flex flex-col rounded-2xl border-border/60 p-5 text-left transition-colors hover:bg-muted/20"
    >
      <div className="h-28 w-full">
        <AtomVisualization moleculeId={moleculeId} size="lg" />
      </div>

      <div className="mt-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-base font-medium text-foreground">{copy?.nameZh}</h3>
            <p className="text-xs text-muted-foreground">{copy?.nameEn}</p>
          </div>
          <span className="shrink-0 text-sm font-semibold text-brand-cyan">{molecule.formula}</span>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
          <span>
            {entry.molecularWeight} {dict.moleculeLibrary.detail.unitGMol}
          </span>
          <span>·</span>
          <span>
            {atomCount} {dict.moleculeLibrary.detail.unitAtoms}
          </span>
          <PolarityIndicator polarity={entry.polarity} />
        </div>

        <div className="mt-2 text-[11px] font-medium text-brand-purple/90">
          {dict.moleculeLibrary.categories[entry.category]}
        </div>

        {entry.functionalGroups.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {entry.functionalGroups.map((groupId) => (
              <FunctionalGroupBadge key={groupId} id={groupId} />
            ))}
          </div>
        ) : null}
      </div>
    </motion.button>
  );
}
