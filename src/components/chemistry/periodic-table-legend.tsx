import { dict } from "@/lib/i18n";
import { ELEMENT_CATEGORY_IDS, CATEGORY_COLORS } from "@/lib/chemistry/periodic-table";

export function PeriodicTableLegend({ className }: { className?: string }) {
  return (
    <div className={className}>
      <p className="mb-2 text-xs font-semibold text-brand-cyan">{dict.periodicTable.legend.title}</p>
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {ELEMENT_CATEGORY_IDS.map((id) => (
          <div key={id} className="flex items-center gap-1.5">
            <span
              className="size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: CATEGORY_COLORS[id] }}
            />
            <span className="text-[11px] text-muted-foreground">{dict.periodicTable.categories[id]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
