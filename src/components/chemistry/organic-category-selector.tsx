"use client";

import { motion } from "framer-motion";
import {
  Minus,
  Equal,
  AlignJustify,
  Hexagon,
  Droplet,
  Waves,
  CircleDot,
  Disc,
  FlaskConical,
  Sparkles,
  Triangle,
  Link2,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { dict } from "@/lib/i18n";
import { ORGANIC_CATEGORY_IDS, ORGANIC_CATEGORIES, type OrganicCategoryId } from "@/lib/chemistry/organic-chemistry";

const ICONS: Record<OrganicCategoryId, LucideIcon> = {
  alkane: Minus,
  alkene: Equal,
  alkyne: AlignJustify,
  aromatic: Hexagon,
  alcohol: Droplet,
  ether: Waves,
  aldehyde: CircleDot,
  ketone: Disc,
  carboxylicAcid: FlaskConical,
  ester: Sparkles,
  amine: Triangle,
  amide: Link2,
};

export function OrganicCategorySelector({
  activeId,
  onSelect,
  className,
}: {
  activeId: OrganicCategoryId;
  onSelect: (id: OrganicCategoryId) => void;
  className?: string;
}) {
  return (
    <div
      role="tablist"
      aria-label={dict.organicChemistry.sections.categories}
      className={cn(
        "flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className,
      )}
    >
      {ORGANIC_CATEGORY_IDS.map((id) => {
        const Icon = ICONS[id];
        const active = activeId === id;
        const label = dict.moleculeLibrary.categories[ORGANIC_CATEGORIES[id].libraryCategory];
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onSelect(id)}
            className={cn(
              "glass-subtle group relative flex shrink-0 items-center gap-2.5 rounded-xl border-border/60 px-3.5 py-2.5 text-left transition-colors",
              active ? "border-brand-blue/40 bg-muted/50" : "hover:bg-muted/25",
            )}
          >
            <Icon className={cn("size-4 shrink-0", active ? "text-brand-blue" : "text-muted-foreground")} />
            <span
              className={cn(
                "text-sm font-medium whitespace-nowrap",
                active ? "text-foreground" : "text-foreground/80",
              )}
            >
              {label}
            </span>
            {active ? (
              <motion.span
                layoutId="organic-category-active"
                className="absolute inset-0 -z-10 rounded-xl border border-brand-blue/30"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
