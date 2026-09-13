import { cn } from "@/lib/utils";

export function PillGroup<T extends string>({
  value,
  options,
  onChange,
  className,
}: {
  value: T;
  options: { id: T; label: string }[];
  onChange: (value: T) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {options.map((option) => {
        const active = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.id)}
            className={cn(
              "rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors",
              active
                ? "border-brand-cyan/50 bg-brand-cyan/15 text-brand-cyan"
                : "border-border/60 text-muted-foreground hover:bg-muted/25",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
