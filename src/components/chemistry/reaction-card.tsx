"use client";

import { dict } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { Reaction } from "@/lib/chemistry/reactions";
import { ReactionEquation } from "./reaction-equation";

const DIFFICULTY_STYLE: Record<Reaction["difficulty"], string> = {
  beginner: "border-brand-cyan/40 bg-brand-cyan/10 text-brand-cyan",
  intermediate: "border-brand-blue/40 bg-brand-blue/10 text-brand-blue",
  advanced: "border-brand-purple/40 bg-brand-purple/10 text-brand-purple",
};

export function ReactionCard({ reaction, onSelect }: { reaction: Reaction; onSelect: () => void }) {
  const copy = dict.reactionAtlas.reactions[reaction.id as keyof typeof dict.reactionAtlas.reactions];

  return (
    <button
      type="button"
      onClick={onSelect}
      className="glass-subtle group flex flex-col gap-3 rounded-2xl border-border/60 p-5 text-left transition-colors hover:bg-muted/20"
    >
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="rounded-full border border-border/60 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
          {dict.organicChemistry.reactionTypes[reaction.reactionTypeId]}
        </span>
        <span
          className={cn(
            "rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
            DIFFICULTY_STYLE[reaction.difficulty],
          )}
        >
          {dict.reactionAtlas.difficulty[reaction.difficulty]}
        </span>
      </div>

      <h3 className="text-base font-medium text-foreground">{copy?.name}</h3>

      <ReactionEquation reaction={reaction} size="sm" />

      <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">{copy?.summary}</p>
    </button>
  );
}
