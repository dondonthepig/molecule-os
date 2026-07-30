import zhTW from "@/locales/zh-TW.json";
import en from "@/locales/en.json";
import { defaultLocale, type Locale } from "./config";

/** Canonical shape every locale dictionary must satisfy. */
export type Dictionary = typeof zhTW;

const dictionaries: Record<Locale, Dictionary> = {
  "zh-TW": zhTW,
  en: en satisfies Dictionary,
};

export function getDictionary(locale: Locale = defaultLocale): Dictionary {
  return dictionaries[locale] ?? dictionaries[defaultLocale];
}

/**
 * No URL/cookie-based locale routing yet — the whole app renders in
 * `defaultLocale`. Every component reads from this single resolved
 * dictionary so wiring up a real locale switcher later only means
 * changing how `locale` below is resolved, not touching call sites.
 */
export const dict = getDictionary(defaultLocale);
