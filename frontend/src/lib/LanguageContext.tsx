"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
} from "react";
import { DICT, type Lang, type Dictionary } from "./dictionary";

interface LanguageContextType {
  lang: Lang;
  t: Dictionary;
  toggleLang: () => void;
  setLang: (lang: Lang) => void;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

const STORAGE_KEY = "rf_lang";

// The language preference is treated as an external store (localStorage) via
// useSyncExternalStore. This renders "en" on the server + first client paint
// (matching the root <html lang="en"> — no hydration mismatch), then reconciles
// to the stored value after hydration, and stays in sync across tabs.
const listeners = new Set<() => void>();

function readStoredLang(): Lang {
  if (typeof window === "undefined") return "en";
  return window.localStorage.getItem(STORAGE_KEY) === "ar" ? "ar" : "en";
}

function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

function writeLang(lang: Lang): void {
  window.localStorage.setItem(STORAGE_KEY, lang);
  listeners.forEach((l) => l());
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const lang = useSyncExternalStore<Lang>(
    subscribe,
    readStoredLang,
    () => "en"
  );
  const t = DICT[lang];

  const setLang = useCallback((newLang: Lang) => writeLang(newLang), []);
  const toggleLang = useCallback(
    () => writeLang(readStoredLang() === "en" ? "ar" : "en"),
    []
  );

  // Reflect the active language onto <html> (external DOM — not React state).
  useEffect(() => {
    document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    document.documentElement.setAttribute("lang", lang);
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, t, toggleLang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
