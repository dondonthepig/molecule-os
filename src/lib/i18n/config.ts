export const locales = ["zh-TW", "en"] as const;

export type Locale = (typeof locales)[number];

/** MoleculeOS ships zh-TW as the primary experience; English is prepared but not yet wired to a switcher/router. */
export const defaultLocale: Locale = "zh-TW";
