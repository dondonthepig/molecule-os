import type { Metadata } from "next";
import { Brain } from "lucide-react";
import { ComingSoon } from "@/components/coming-soon";
import { dict } from "@/lib/i18n";

export const metadata: Metadata = { title: dict.pages.quiz.title };

export default function QuizPage() {
  return (
    <ComingSoon
      icon={Brain}
      title={dict.pages.quiz.title}
      description={dict.pages.quiz.description}
    />
  );
}
