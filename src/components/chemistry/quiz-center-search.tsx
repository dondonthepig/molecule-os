"use client";

import { Search, X } from "lucide-react";
import { dict } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function QuizCenterSearch({
  value,
  onChange,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  const s = dict.quizCenter.search;
  return (
    <div className={cn("glass-subtle flex items-center gap-2.5 rounded-full border-border/60 px-4 py-2.5", className)}>
      <Search className="size-4 shrink-0 text-muted-foreground" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={s.placeholder}
        className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label={s.clear}
          className="shrink-0 rounded-full text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          <X className="size-4" />
        </button>
      ) : null}
    </div>
  );
}
