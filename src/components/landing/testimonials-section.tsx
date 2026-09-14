"use client";

import { Quote } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { DemoDataBadge } from "@/components/ui/demo-data-badge";
import { CardStack, type CardStackItem } from "@/components/ui/card-stack";
import { DEMO_TESTIMONIALS, type Testimonial } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { dict } from "@/lib/i18n";
import { useMediaQuery } from "@/hooks/use-media-query";

type TestimonialCard = CardStackItem & Testimonial;

const ACCENT_BG: Record<Testimonial["accent"], string> = {
  blue: "from-brand-blue to-brand-blue-dim",
  cyan: "from-brand-cyan to-brand-cyan-dim",
  purple: "from-brand-purple-dim to-brand-blue-dim",
};

const items: TestimonialCard[] = DEMO_TESTIMONIALS.map((t) => ({
  ...t,
  title: t.name,
}));

export function TestimonialsSection() {
  // Below `sm` (640px), a 420px card would exceed the viewport and get
  // clipped by the section's overflow-hidden — shrink to fit narrow screens.
  const isMobile = useMediaQuery("(max-width: 639px)");
  const cardWidth = isMobile ? 290 : 420;
  const cardHeight = isMobile ? 236 : 260;

  return (
    <section className="relative overflow-hidden px-6 py-24 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-brand-cyan">
              {dict.testimonials.eyebrow}
            </p>
            <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              {dict.testimonials.heading}
            </h2>
          </div>
          <DemoDataBadge />
        </Reveal>

        <Reveal delay={0.1} className="mt-8">
          <CardStack
            items={items}
            cardWidth={cardWidth}
            cardHeight={cardHeight}
            maxVisible={5}
            renderCard={(item) => (
              <div
                className={cn(
                  "relative flex h-full w-full flex-col justify-between bg-gradient-to-br p-6 text-white",
                  ACCENT_BG[item.accent],
                )}
              >
                <Quote className="size-7 opacity-40" />
                <p className="text-[15px] leading-relaxed font-medium text-balance">
                  {item.quote}
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-full bg-white/20 text-xs font-semibold backdrop-blur-sm">
                    {item.initials}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{item.name}</div>
                    <div className="text-xs opacity-80">{item.role}</div>
                  </div>
                </div>
              </div>
            )}
          />
        </Reveal>
      </div>
    </section>
  );
}
