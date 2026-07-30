import type { Metadata } from "next";
import { Workflow } from "lucide-react";
import { ComingSoon } from "@/components/coming-soon";
import { dict } from "@/lib/i18n";

export const metadata: Metadata = { title: dict.pages.reactionAtlas.title };

export default function ReactionAtlasPage() {
  return (
    <ComingSoon
      icon={Workflow}
      title={dict.pages.reactionAtlas.title}
      description={dict.pages.reactionAtlas.description}
    />
  );
}
