"use client";

import { ELEMENTS } from "@/lib/chemistry/periodic-table";
import { ElementCell } from "./element-cell";

const LANTHANIDE_ROW = 9;
const ACTINIDE_ROW = 10;

/**
 * The real 18-column x 7-period periodic table layout (plus the
 * conventional lanthanide/actinide row below), not a plain list. Filtered-out
 * elements stay in place but dim, so the grid shape never collapses.
 */
export function PeriodicTableGrid({
  visibleSymbols,
  onSelect,
}: {
  visibleSymbols: Set<string> | null;
  onSelect: (symbol: string) => void;
}) {
  return (
    <div className="glass-subtle overflow-x-auto rounded-2xl border-border/60 p-3 sm:p-5">
      <div
        className="grid gap-1"
        style={{
          gridTemplateColumns: "repeat(18, minmax(30px, 1fr))",
          gridTemplateRows: "repeat(10, minmax(0, 1fr))",
          minWidth: 760,
        }}
      >
        {ELEMENTS.map((element) => {
          const isLanthanide = element.group === null && element.period === 6;
          const isActinide = element.group === null && element.period === 7;
          const row = isLanthanide ? LANTHANIDE_ROW : isActinide ? ACTINIDE_ROW : element.period;
          const col = element.group ?? 3 + (element.number - (isLanthanide ? 57 : 89));
          const dimmed = visibleSymbols ? !visibleSymbols.has(element.symbol) : false;
          return (
            <ElementCell
              key={element.symbol}
              element={element}
              dimmed={dimmed}
              onSelect={() => onSelect(element.symbol)}
              style={{ gridColumn: col, gridRow: row }}
            />
          );
        })}
      </div>
    </div>
  );
}
