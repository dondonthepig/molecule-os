import type { Metadata } from "next";
import { SettingsWorkspace } from "@/components/settings/settings-workspace";
import { dict } from "@/lib/i18n";

export const metadata: Metadata = {
  title: dict.pages.settings.title,
  description: dict.pages.settings.description,
};

export default function SettingsPage() {
  return <SettingsWorkspace />;
}
