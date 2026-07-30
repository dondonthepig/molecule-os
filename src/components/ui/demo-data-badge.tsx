import { cn } from "@/lib/utils";
import { dict } from "@/lib/i18n";

export function DemoDataBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "demo-data-badge inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold",
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {dict.common.demoData}
    </span>
  );
}
