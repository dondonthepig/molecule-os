"use client";

import * as React from "react";
import { DEFAULT_SETTINGS, SETTINGS_STORAGE_KEY, type MoleculeOSSettings } from "@/lib/settings-data";

function readFromStorage(): MoleculeOSSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<MoleculeOSSettings>) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

// Module-level cache + listener set so every `useSettings()` consumer across
// the app (AI Tutor, Settings page, MotionConfigProvider, Bond Explorer,
// Molecule Library) reads/writes the same live value without a Context
// provider — same useSyncExternalStore approach as use-media-query.ts.
let cache: MoleculeOSSettings | null = null;
const listeners = new Set<() => void>();

function getSnapshot(): MoleculeOSSettings {
  if (!cache) cache = readFromStorage();
  return cache;
}

function getServerSnapshot(): MoleculeOSSettings {
  return DEFAULT_SETTINGS;
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function persist(next: MoleculeOSSettings) {
  cache = next;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Storage unavailable (private browsing, quota) — settings just won't persist.
    }
  }
  listeners.forEach((listener) => listener());
}

/** Local-only, cross-tab-of-this-app-instance settings — no server/account sync. */
export function useSettings() {
  const settings = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const update = React.useCallback(<K extends keyof MoleculeOSSettings>(key: K, value: MoleculeOSSettings[K]) => {
    persist({ ...getSnapshot(), [key]: value });
  }, []);

  const reset = React.useCallback(() => persist(DEFAULT_SETTINGS), []);

  return { settings, update, reset };
}
