export function SettingsRow({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 border-t border-border/50 pt-5 first:border-t-0 first:pt-0 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <div className="max-w-sm">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {description ? <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p> : null}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}
