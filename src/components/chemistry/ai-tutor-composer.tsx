"use client";

import * as React from "react";
import { Send, Trash2 } from "lucide-react";
import { dict } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function AiTutorComposer({
  value,
  onChange,
  onSubmit,
  onClear,
  canClear,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onClear: () => void;
  canClear: boolean;
  disabled: boolean;
}) {
  const t = dict.aiTutor.composer;

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (value.trim() && !disabled) onSubmit();
    }
  };

  return (
    <div className="glass-subtle rounded-2xl border-border/60 p-3">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={t.placeholder}
        rows={2}
        className="w-full resize-none bg-transparent px-1.5 py-1 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
      />
      <div className="mt-2 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onClear}
          disabled={!canClear}
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
        >
          <Trash2 className="size-3.5" />
          {t.clear}
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={disabled || !value.trim()}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/80",
            "disabled:pointer-events-none disabled:opacity-40",
          )}
        >
          {t.send}
          <Send className="size-3.5" />
        </button>
      </div>
      <p className="mt-2 text-[11px] text-muted-foreground/80">{t.disclaimer}</p>
    </div>
  );
}
