"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { SettingsIcon } from "lucide-react";
import { dict } from "@/lib/i18n";
import { useHasMounted } from "@/hooks/use-has-mounted";
import { useSettings } from "@/hooks/use-settings";
import { TUTOR_DIFFICULTIES, TUTOR_LEARNING_MODES } from "@/lib/chemistry/tutor-data";
import { Switch } from "@/components/ui/switch";
import { SettingsSection } from "./settings-section";
import { SettingsRow } from "./settings-row";
import { PillGroup } from "@/components/ui/pill-group";
import packageJson from "../../../package.json";

export function SettingsWorkspace() {
  const s = dict.settings;
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useHasMounted();
  const { settings, update, reset } = useSettings();
  const [justReset, setJustReset] = React.useState(false);

  const isDark = mounted ? resolvedTheme === "dark" : true;

  const handleReset = () => {
    reset();
    setJustReset(true);
    window.setTimeout(() => setJustReset(false), 2500);
  };

  return (
    <div className="relative px-4 pt-24 pb-16 sm:px-6 sm:pt-28 lg:px-10">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-blue via-brand-cyan to-brand-purple">
            <SettingsIcon className="size-4.5 text-white" strokeWidth={2} />
          </span>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">{s.pageTitle}</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">{s.pageSubtitle}</p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-5">
          <SettingsSection title={s.sections.appearance.title} description={s.sections.appearance.description}>
            <SettingsRow label={s.appearance.themeLabel}>
              <PillGroup className="justify-end"
                value={isDark ? "dark" : "light"}
                options={[
                  { id: "dark", label: s.appearance.themeDark },
                  { id: "light", label: s.appearance.themeLight },
                ]}
                onChange={(value) => setTheme(value)}
              />
            </SettingsRow>
            <SettingsRow label={s.appearance.motionLabel} description={s.appearance.motionDescription}>
              <PillGroup className="justify-end"
                value={settings.motion}
                options={[
                  { id: "auto", label: s.appearance.motionAuto },
                  { id: "reduced", label: s.appearance.motionReduced },
                ]}
                onChange={(value) => update("motion", value)}
              />
            </SettingsRow>
          </SettingsSection>

          <SettingsSection title={s.sections.learning.title} description={s.sections.learning.description}>
            <SettingsRow label={s.learning.difficultyLabel}>
              <PillGroup className="justify-end"
                value={settings.preferredDifficulty}
                options={TUTOR_DIFFICULTIES.map((id) => ({ id, label: dict.aiTutor.difficulty[id] }))}
                onChange={(value) => update("preferredDifficulty", value)}
              />
            </SettingsRow>
            <SettingsRow label={s.learning.defaultModeLabel}>
              <PillGroup className="justify-end"
                value={settings.defaultLearningMode}
                options={TUTOR_LEARNING_MODES.map((id) => ({ id, label: dict.aiTutor.modes[id].label }))}
                onChange={(value) => update("defaultLearningMode", value)}
              />
            </SettingsRow>
            <SettingsRow label={s.learning.showExplanationsLabel} description={s.learning.showExplanationsDescription}>
              <Switch
                checked={settings.showExplanations}
                onCheckedChange={(checked) => update("showExplanations", checked)}
              />
            </SettingsRow>
            <SettingsRow label={s.learning.showHintsLabel} description={s.learning.showHintsDescription}>
              <Switch
                checked={settings.showHintsBeforeAnswers}
                onCheckedChange={(checked) => update("showHintsBeforeAnswers", checked)}
              />
            </SettingsRow>
          </SettingsSection>

          <SettingsSection title={s.sections.chemistry.title} description={s.sections.chemistry.description}>
            <SettingsRow label={s.chemistry.notationLabel}>
              <PillGroup className="justify-end"
                value={settings.notation}
                options={[
                  { id: "molecularFormula", label: s.chemistry.notationFormula },
                  { id: "structural", label: s.chemistry.notationStructural },
                ]}
                onChange={(value) => update("notation", value)}
              />
            </SettingsRow>
            <SettingsRow label={s.chemistry.showFormulasLabel}>
              <Switch
                checked={settings.showMolecularFormulas}
                onCheckedChange={(checked) => update("showMolecularFormulas", checked)}
              />
            </SettingsRow>
            <SettingsRow label={s.chemistry.showNamesLabel}>
              <Switch
                checked={settings.showMolecularNames}
                onCheckedChange={(checked) => update("showMolecularNames", checked)}
              />
            </SettingsRow>
            <SettingsRow label={s.chemistry.defaultVisualizationLabel}>
              <PillGroup className="justify-end"
                value={settings.defaultVisualization}
                options={[
                  { id: "ballAndStick", label: dict.moleculeLibrary.viewerControls.ballAndStick },
                  { id: "spaceFilling", label: dict.moleculeLibrary.viewerControls.spaceFilling },
                ]}
                onChange={(value) => update("defaultVisualization", value)}
              />
            </SettingsRow>
            <p className="text-[11px] text-muted-foreground">{s.chemistry.scopeNote}</p>
          </SettingsSection>

          <SettingsSection title={s.sections.application.title} description={s.sections.application.description}>
            <SettingsRow label={s.application.languageLabel} description={s.application.languageNote}>
              <span className="text-xs font-medium text-muted-foreground">{s.application.languageValue}</span>
            </SettingsRow>
            <SettingsRow label={s.application.versionLabel}>
              <span className="text-xs font-medium text-muted-foreground">v{packageJson.version}</span>
            </SettingsRow>
            <div className="border-t border-border/50 pt-5">
              <p className="text-sm font-medium text-foreground">{s.application.aboutTitle}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{s.application.aboutDescription}</p>
            </div>
          </SettingsSection>

          <SettingsSection title={s.sections.dataPrivacy.title} description={s.sections.dataPrivacy.description}>
            <p className="text-xs leading-relaxed text-muted-foreground">{s.dataPrivacy.localOnlyDescription}</p>
            <SettingsRow label={s.dataPrivacy.resetLabel} description={s.dataPrivacy.resetDescription}>
              <div className="flex items-center gap-3">
                {justReset ? (
                  <span className="text-xs font-medium text-brand-cyan">{s.dataPrivacy.resetConfirmed}</span>
                ) : null}
                <button
                  type="button"
                  onClick={handleReset}
                  className="glass-subtle rounded-full border-border/60 px-4 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted/40"
                >
                  {s.dataPrivacy.resetButton}
                </button>
              </div>
            </SettingsRow>
          </SettingsSection>
        </div>
      </div>
    </div>
  );
}
