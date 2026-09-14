import { cn } from "@/lib/utils";
import { dict } from "@/lib/i18n";
import type { Polarity } from "@/lib/chemistry/molecule-library-data";

const DOT_COLOR: Record<Polarity, string> = {
  nonpolar: "bg-brand-cyan",
  polar: "bg-brand-purple-dim",
  ionic: "bg-brand-blue",
};

export function PolarityIndicator({ polarity, className }: { polarity: Polarity; className?: string }) {
  const label =
    polarity === "polar"
      ? dict.moleculeLibrary.filters.polarityPolar
      : polarity === "ionic"
        ? dict.moleculeLibrary.filters.polarityIonic
        : dict.moleculeLibrary.filters.polarityNonpolar;

  return (
    <span className={cn("inline-flex items-center gap-1.5 text-[11px] text-muted-foreground", className)}>
      <span className={cn("size-1.5 rounded-full", DOT_COLOR[polarity])} />
      {label}
    </span>
  );
}
