import type { Metadata } from "next";
import { Suspense } from "react";
import { AiTutorWorkspace } from "@/components/chemistry/ai-tutor-workspace";
import { AiTutorWithSearchParams } from "@/components/chemistry/ai-tutor-search-params";
import { dict } from "@/lib/i18n";

export const metadata: Metadata = {
  title: dict.pages.aiTutor.title,
  description: dict.pages.aiTutor.description,
};

export default function AiTutorPage() {
  return (
    <Suspense fallback={<AiTutorWorkspace />}>
      <AiTutorWithSearchParams />
    </Suspense>
  );
}
