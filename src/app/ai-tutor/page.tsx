import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { ComingSoon } from "@/components/coming-soon";
import { dict } from "@/lib/i18n";

export const metadata: Metadata = { title: dict.pages.aiTutor.title };

export default function AiTutorPage() {
  return (
    <ComingSoon
      icon={Sparkles}
      title={dict.pages.aiTutor.title}
      description={dict.pages.aiTutor.description}
    />
  );
}
