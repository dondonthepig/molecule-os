"use client";

import { motion } from "framer-motion";
import { ArrowRightLeft, Link2, SplitSquareHorizontal, LayoutGrid, Droplet, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { dict } from "@/lib/i18n";
import { BOND_TYPE_IDS, type BondTypeId } from "@/lib/chemistry/bond-types";

const ICONS: Record<BondTypeId, LucideIcon> = {
  ionic: ArrowRightLeft,
  covalent: Link2,
  polarCovalent: SplitSquareHorizontal,
  metallic: LayoutGrid,
  hydrogen: Droplet,
};

const ACCENT_TEXT: Record<string, string> = {
  blue: "text-brand-blue",
  cyan: "text-brand-cyan",
  purple: "text-brand-purple-dim",
};

export function BondSelector({
  activeId,
  onSelect,
  className,
}: {
  activeId: BondTypeId;
  onSelect: (id: BondTypeId) => void;
  className?: string;
}) {
  return (
    <div
      role="tablist"
      aria-label={dict.bondExplorer.sections.categories}
      className={cn(
        "flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] lg:flex-col lg:gap-1.5 lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden",
        className,
      )}
    >
      {BOND_TYPE_IDS.map((id) => {
        const bond = dict.bondExplorer.bonds[id];
        const Icon = ICONS[id];
        const active = activeId === id;
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onSelect(id)}
            className={cn(
              "glass-subtle group relative flex shrink-0 items-center gap-2.5 rounded-xl border-border/60 px-3.5 py-2.5 text-left transition-colors lg:w-full",
              active ? "border-brand-blue/40 bg-muted/50" : "hover:bg-muted/25",
            )}
          >
            <Icon className={cn("size-4 shrink-0", active ? ACCENT_TEXT.blue : "text-muted-foreground")} />
            <span className="flex flex-col">
              <span className={cn("text-sm font-medium whitespace-nowrap", active ? "text-foreground" : "text-foreground/80")}>
                {bond.nameZh}
              </span>
              <span className="hidden text-[11px] text-muted-foreground lg:block">{bond.nameEn}</span>
            </span>
            {active ? (
              <motion.span
                layoutId="bond-selector-active"
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
