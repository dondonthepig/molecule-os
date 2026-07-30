import type { Metadata } from "next";
import { Suspense } from "react";
import { MoleculeLibraryWorkspace } from "@/components/chemistry/molecule-library-workspace";
import { MoleculeLibraryWithSearchParams } from "@/components/chemistry/molecule-library-search-params";
import { dict } from "@/lib/i18n";

export const metadata: Metadata = { title: dict.pages.moleculeLibrary.title };

export default function MoleculeLibraryPage() {
  return (
    <Suspense fallback={<MoleculeLibraryWorkspace />}>
      <MoleculeLibraryWithSearchParams />
    </Suspense>
  );
}
