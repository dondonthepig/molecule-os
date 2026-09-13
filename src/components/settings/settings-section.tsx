export function SettingsSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="glass-subtle rounded-2xl border-border/60 px-5 py-6 sm:px-7 sm:py-7">
      <h2 className="text-base font-semibold tracking-tight text-foreground">{title}</h2>
      <p className="mt-1 max-w-xl text-sm text-muted-foreground">{description}</p>
      <div className="mt-6 flex flex-col gap-5">{children}</div>
    </section>
  );
}
