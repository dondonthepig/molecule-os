import { dict } from "@/lib/i18n";
import type { FunctionalGroupId } from "@/lib/chemistry/functional-groups";

export function FunctionalGroupBadge({ id }: { id: FunctionalGroupId }) {
  const group = dict.moleculeLibrary.functionalGroups[id];
  return (
    <span className="inline-flex items-center rounded-full border border-brand-purple-dim/30 bg-brand-purple-dim/10 px-2.5 py-1 text-[11px] font-medium text-brand-purple-dim">
      {group.name}
    </span>
  );
}
