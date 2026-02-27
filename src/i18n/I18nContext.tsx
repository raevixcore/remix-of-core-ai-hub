import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { ptBR } from "./pt-BR";
import { en } from "./en";
import { es } from "./es";

export type Locale = "pt-BR" | "en" | "es";

type Translations = Record<string, string>;

const locales: Record<Locale, Translations> = {
  "pt-BR": ptBR,
  en,
  es,
};

export const localeLabels: Record<Locale, { label: string; flag: string }> = {
  "pt-BR": { label: "Português (BR)", flag: "🇧🇷" },
  en: { label: "English", flag: "🇺🇸" },
  es: { label: "Español", flag: "🇪🇸" },
};

interface I18nContextType {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType>({
  locale: "pt-BR",
  setLocale: () => {},
  t: (key) => key,
});

export const useI18n = () => useContext(I18nContext);

function loadLocale(): Locale {
  try {
    const saved = localStorage.getItem("locale");
    if (saved && saved in locales) return saved as Locale;
  } catch {}
  return "pt-BR";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(loadLocale);

  const setLocale = useCallback((l: Locale) => {
    localStorage.setItem("locale", l);
    setLocaleState(l);
  }, []);

  const t = useCallback(
    (key: string): string => locales[locale]?.[key] ?? locales["pt-BR"]?.[key] ?? key,
    [locale]
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}
