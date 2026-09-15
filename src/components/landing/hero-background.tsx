/** Plain dark backdrop with an edge vignette for text legibility — no grid or glow decoration. */
export function HeroBackground() {
  return (
    <div
      className="absolute inset-0 isolate z-0 overflow-hidden bg-background"
      aria-hidden="true"
    >
      {/*
       * Edge-only vignette for text legibility near the top/bottom of the
       * viewport. Explicit z-0 + isolate (root) keeps this pinned behind the
       * z-10 content grid in hero-section.tsx regardless of DOM order.
       * Stops are pushed past 80% so the gradient never washes over the hero
       * molecule's bounding box (it sits as far right as ~90% of the section
       * width via `lg:justify-end`) — the old 50% stop crushed contrast at
       * the molecule's silhouette/bloom edges, reading as atoms "sinking"
       * into the background even though the canvas paints on top of this.
       */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, color-mix(in oklab, var(--background) 10%, transparent) 0%, transparent 20%, transparent 82%, var(--background) 100%)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 z-0 bg-radial-fade" />
    </div>
  );
}
