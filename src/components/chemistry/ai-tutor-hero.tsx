import { Sparkles } from "lucide-react";
import { dict } from "@/lib/i18n";

export function AiTutorHero() {
  const t = dict.aiTutor;

  return (
    <div className="flex items-start gap-3">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-blue via-brand-cyan to-brand-purple">
        <Sparkles className="size-4.5 text-white" strokeWidth={2} />
      </span>
      <div>
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">{t.pageTitle}</h1>
          <span className="demo-data-badge inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold">
            <span className="size-1.5 rounded-full bg-current" />
            {t.prototypeBadge}
          </span>
        </div>
        <p className="mt-1 max-w-xl text-sm text-muted-foreground">{t.pageSubtitle}</p>
        <p className="mt-2 max-w-xl text-xs leading-relaxed text-muted-foreground/80">{t.prototypeNotice}</p>
      </div>
    </div>
  );
}
