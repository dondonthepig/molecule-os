import type { Metadata } from "next";
import { Settings } from "lucide-react";
import { ComingSoon } from "@/components/coming-soon";
import { dict } from "@/lib/i18n";

export const metadata: Metadata = { title: dict.pages.settings.title };

export default function SettingsPage() {
  return (
    <ComingSoon
      icon={Settings}
      title={dict.pages.settings.title}
      description={dict.pages.settings.description}
    />
  );
}
