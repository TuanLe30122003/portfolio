import "server-only";
import type { Locale } from "../config";
import type { Dictionary } from "./vi";

export type { Dictionary };

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  vi: () => import("./vi").then((module) => module.default),
  en: () => import("./en").then((module) => module.default),
};

export function loadDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}
