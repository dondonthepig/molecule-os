"use client";

import { dict } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { Reaction } from "@/lib/chemistry/reactions";
import { ReactionEquation } from "./reaction-equation";

const DIFFICULTY_DOT: Record<Reaction["difficulty"], string> = {
  beginner: "bg-brand-cyan",
  intermediate: "bg-brand-blue",
  advanced: "bg-brand-purple",
};

/**
 * Editorial list row for the "featured reactions" section — no card chrome.
 * The reaction name and equation carry the visual weight; type/difficulty
 * are a small caption line, not badges. Distinct from `ReactionCard`, which
 * keeps a lightweight card treatment for the filterable reaction list below.
 */
export function FeaturedReactionRow({ reaction, onSelect }: { reaction: Reaction; onSelect: () => void }) {
  const copy = dict.reactionAtlas.reactions[reaction.id as keyof typeof dict.reactionAtlas.reactions];
  const typeLabel = dict.organicChemistry.reactionTypes[reaction.reactionTypeId];
  const difficultyLabel = dict.reactionAtlas.difficulty[reaction.difficulty];

  return (
    <button
      type="button"
      onClick={onSelect}
      className="group w-full border-b border-border/40 py-5 text-left transition-colors first:pt-0 last:border-b-0 hover:bg-muted/5 sm:py-6"
    >
      <p className="flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-muted-foreground">
        <span>{typeLabel}</span>
        <span className="text-border">·</span>
        <span className="inline-flex items-center gap-1.5">
          <span className={cn("size-1.5 rounded-full", DIFFICULTY_DOT[reaction.difficulty])} />
          {difficultyLabel}
        </span>
      </p>

      <div className="mt-2 flex flex-col gap-x-10 gap-y-2 sm:flex-row sm:items-baseline sm:justify-between">
        <div className="min-w-0">
          <h3 className="text-lg font-medium text-foreground transition-colors group-hover:text-brand-cyan sm:text-xl">
            {copy?.name}
          </h3>
          <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted-foreground line-clamp-2">{copy?.summary}</p>
        </div>

        <ReactionEquation
          reaction={reaction}
          size="md"
          className="shrink-0 text-base text-foreground/90 sm:justify-end sm:text-lg"
        />
      </div>
    </button>
  );
}
