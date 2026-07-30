import type { Metadata } from "next";
import { Grid3x3 } from "lucide-react";
import { ComingSoon } from "@/components/coming-soon";
import { dict } from "@/lib/i18n";

export const metadata: Metadata = { title: dict.pages.periodicTable.title };

export default function PeriodicTablePage() {
  return (
    <ComingSoon
      icon={Grid3x3}
      title={dict.pages.periodicTable.title}
      description={dict.pages.periodicTable.description}
    />
  );
}
