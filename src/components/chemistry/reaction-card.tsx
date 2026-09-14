"use client";

import { dict } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { Reaction } from "@/lib/chemistry/reactions";
import { ReactionEquation } from "./reaction-equation";

const DIFFICULTY_DOT: Record<Reaction["difficulty"], string> = {
  beginner: "bg-brand-cyan",
  intermediate: "bg-brand-blue",
  advanced: "bg-brand-purple-dim",
};

export function ReactionCard({ reaction, onSelect }: { reaction: Reaction; onSelect: () => void }) {
  const copy = dict.reactionAtlas.reactions[reaction.id as keyof typeof dict.reactionAtlas.reactions];

  return (
    <button
      type="button"
      onClick={onSelect}
      className="group flex flex-col gap-2.5 rounded-lg border border-border/30 p-4 text-left transition-colors hover:border-border/60 hover:bg-muted/10"
    >
      <p className="flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-muted-foreground">
        <span>{dict.organicChemistry.reactionTypes[reaction.reactionTypeId]}</span>
        <span className="text-border">·</span>
        <span className="inline-flex items-center gap-1.5">
          <span className={cn("size-1.5 rounded-full", DIFFICULTY_DOT[reaction.difficulty])} />
          {dict.reactionAtlas.difficulty[reaction.difficulty]}
        </span>
      </p>

      <h3 className="text-base font-medium text-foreground transition-colors group-hover:text-brand-cyan">
        {copy?.name}
      </h3>

      <ReactionEquation reaction={reaction} size="sm" />

      <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">{copy?.summary}</p>
    </button>
  );
}
