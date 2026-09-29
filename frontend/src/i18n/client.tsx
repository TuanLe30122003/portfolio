"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Locale } from "./config";
import type { Dictionary } from "./dictionaries/vi";

interface I18nValue {
  locale: Locale;
  messages: Dictionary["ui"];
}

const I18nContext = createContext<I18nValue | null>(null);

/** Gives Client Components the current locale and the `ui` part of its dictionary. */
export function I18nProvider({ children, ...value }: I18nValue & { children: ReactNode }) {
  return <I18nContext value={value}>{children}</I18nContext>;
}

export function useI18n(): I18nValue {
  const value = useContext(I18nContext);
  if (!value) throw new Error("useI18n() must be used inside <I18nProvider>");
  return value;
}
