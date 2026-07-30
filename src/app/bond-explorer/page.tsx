import type { Metadata } from "next";
import { Suspense } from "react";
import { BondExplorerWorkspace } from "@/components/chemistry/bond-explorer-workspace";
import { BondExplorerWithSearchParams } from "@/components/chemistry/bond-explorer-search-params";
import { dict } from "@/lib/i18n";

export const metadata: Metadata = { title: dict.pages.bondExplorer.title };

export default function BondExplorerPage() {
  return (
    <Suspense fallback={<BondExplorerWorkspace />}>
      <BondExplorerWithSearchParams />
    </Suspense>
  );
}
