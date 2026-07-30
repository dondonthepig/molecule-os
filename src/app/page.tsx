import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { InteractiveDemoSection } from "@/components/landing/interactive-demo-section";
import { CategoriesSection } from "@/components/landing/categories-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { StatsSection } from "@/components/landing/stats-section";
import { FinalCtaSection } from "@/components/landing/final-cta-section";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <InteractiveDemoSection />
      <CategoriesSection />
      <TestimonialsSection />
      <StatsSection />
      <FinalCtaSection />
    </>
  );
}
