import Link from "next/link";
import { ArrowLeft, type LucideIcon } from "lucide-react";
import { dict } from "@/lib/i18n";

export function ComingSoon({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <section className="relative flex min-h-[calc(100svh-6rem)] items-center justify-center overflow-hidden px-6 pt-24">
      <div className="bg-gradient-aurora absolute inset-0 opacity-30" aria-hidden="true" />
      <div className="glass relative mx-auto flex max-w-lg flex-col items-center rounded-3xl border-border/60 px-10 py-14 text-center">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-blue via-brand-cyan to-brand-purple shadow-[0_0_30px_-8px_var(--color-brand-blue)]">
          <Icon className="size-6 text-white" strokeWidth={2} />
        </span>
        <p className="mt-6 text-xs font-semibold text-brand-cyan">
          {dict.common.comingSoon}
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
        <Link
          href="/"
          className="glass-subtle mt-8 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted/40"
        >
          <ArrowLeft className="size-4" />
          {dict.common.backToHome}
        </Link>
      </div>
    </section>
  );
}
