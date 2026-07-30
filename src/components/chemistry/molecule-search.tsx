"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { dict } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export type SearchSuggestion = { id: string; label: string; sublabel: string };

export function MoleculeSearch({
  value,
  onChange,
  suggestions,
  onSelectSuggestion,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  suggestions: SearchSuggestion[];
  onSelectSuggestion: (id: string) => void;
  className?: string;
}) {
  const [focused, setFocused] = React.useState(false);
  const showSuggestions = focused && value.trim().length > 0 && suggestions.length > 0;

  return (
    <div className={cn("relative", className)}>
      <div className="glass-subtle flex items-center gap-2.5 rounded-full border-border/60 px-4 py-2.5">
        <Search className="size-4 shrink-0 text-muted-foreground" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => window.setTimeout(() => setFocused(false), 150)}
          placeholder={dict.moleculeLibrary.search.placeholder}
          className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
        {value ? (
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label={dict.moleculeLibrary.search.clear}
            className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        ) : null}
      </div>

      {showSuggestions ? (
        <div className="glass absolute inset-x-0 top-full z-20 mt-2 max-h-72 overflow-y-auto rounded-2xl border-border/60 p-2">
          <p className="px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
            {dict.moleculeLibrary.search.suggestionsLabel}
          </p>
          {suggestions.map((s) => (
            <button
              key={s.id}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onSelectSuggestion(s.id)}
              className="flex w-full items-center justify-between gap-2 rounded-xl px-2.5 py-2 text-left text-sm transition-colors hover:bg-muted/40"
            >
              <span className="text-foreground">{s.label}</span>
              <span className="text-xs text-muted-foreground">{s.sublabel}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
