"use client";

import { ListChecks, Clock, ArrowRight } from "lucide-react";
import { dict } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { estimateMinutes, type QuizSetSpec } from "@/lib/chemistry/quiz-center-data";

const DIFFICULTY_DOT: Record<QuizSetSpec["difficulty"], string> = {
  beginner: "bg-brand-cyan",
  intermediate: "bg-brand-blue",
  advanced: "bg-brand-purple-dim",
};

export function QuizCenterCard({ quizSet, onStart }: { quizSet: QuizSetSpec; onStart: () => void }) {
  const copy = dict.quizCenter.sets[quizSet.id as keyof typeof dict.quizCenter.sets];
  const card = dict.quizCenter.card;
  const minutes = estimateMinutes(quizSet.difficulty, quizSet.questions.length);

  return (
    <div className="flex flex-col gap-4 border-b border-border/40 py-6 first:pt-0 last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-muted-foreground">
          <span>{dict.quizCenter.categories[quizSet.categoryId]}</span>
          <span className="text-border">·</span>
          <span className="inline-flex items-center gap-1.5">
            <span className={cn("size-1.5 rounded-full", DIFFICULTY_DOT[quizSet.difficulty])} />
            {dict.quizCenter.difficulties[quizSet.difficulty]}
          </span>
        </p>

        <h3 className="mt-1.5 text-lg font-medium text-foreground sm:text-xl">{copy.title}</h3>
        <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted-foreground line-clamp-2">{copy.description}</p>

        <div className="mt-2.5 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <ListChecks className="size-3.5" />
            {quizSet.questions.length} {card.questionsLabel}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-3.5" />
            {minutes} {card.minutesLabel}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={onStart}
        className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 self-start rounded-full bg-gradient-to-r from-brand-blue via-brand-cyan to-brand-purple px-4 text-sm font-medium text-white transition-transform hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 sm:self-center"
      >
        {card.start}
        <ArrowRight className="size-4" />
      </button>
    </div>
  );
}
