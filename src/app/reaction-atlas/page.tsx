import type { Metadata } from "next";
import { Suspense } from "react";
import { ReactionAtlasWorkspace } from "@/components/chemistry/reaction-atlas-workspace";
import { ReactionAtlasWithSearchParams } from "@/components/chemistry/reaction-atlas-search-params";
import { dict } from "@/lib/i18n";

export const metadata: Metadata = { title: dict.pages.reactionAtlas.title };

export default function ReactionAtlasPage() {
  return (
    <Suspense fallback={<ReactionAtlasWorkspace />}>
      <ReactionAtlasWithSearchParams />
    </Suspense>
  );
}
