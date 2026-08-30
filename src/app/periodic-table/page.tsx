import type { Metadata } from "next";
import { Suspense } from "react";
import { PeriodicTableWorkspace } from "@/components/chemistry/periodic-table-workspace";
import { PeriodicTableWithSearchParams } from "@/components/chemistry/periodic-table-search-params";
import { dict } from "@/lib/i18n";

export const metadata: Metadata = { title: dict.pages.periodicTable.title };

export default function PeriodicTablePage() {
  return (
    <Suspense fallback={<PeriodicTableWorkspace />}>
      <PeriodicTableWithSearchParams />
    </Suspense>
  );
}
