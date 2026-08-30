"use client";

import type * as React from "react";
import { dict } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { CATEGORY_COLORS, type ElementSpec } from "@/lib/chemistry/periodic-table";

export function ElementCell({
  element,
  dimmed,
  onSelect,
  style,
}: {
  element: ElementSpec;
  dimmed?: boolean;
  onSelect: () => void;
  style?: React.CSSProperties;
}) {
  const nameZh = dict.periodicTable.elements[element.symbol as keyof typeof dict.periodicTable.elements]?.nameZh;
  const color = CATEGORY_COLORS[element.category];

  return (
    <button
      type="button"
      onClick={onSelect}
      style={{ ...style, borderColor: `color-mix(in oklab, ${color} 55%, transparent)` }}
      className={cn(
        "group relative flex aspect-square flex-col items-center justify-center rounded-md border px-0.5 py-0.5 text-center transition-transform hover:z-10 hover:scale-110 hover:shadow-lg",
        dimmed ? "opacity-25" : "opacity-100",
      )}
      title={`${nameZh} · ${element.name}`}
    >
      <span
        className="pointer-events-none absolute inset-0 -z-10 rounded-md"
        style={{ backgroundColor: `color-mix(in oklab, ${color} 22%, var(--card))` }}
      />
      <span className="text-[8px] leading-none text-muted-foreground sm:text-[9px]">{element.number}</span>
      <span className="text-[11px] leading-tight font-semibold text-foreground sm:text-sm">{element.symbol}</span>
      <span className="hidden text-[7px] leading-none text-muted-foreground sm:block">{nameZh}</span>
    </button>
  );
}
