"use client";

import { useLanguage } from "@/lib/LanguageContext";

export default function LangToggle({ variant = "light" }: { variant?: "light" | "dark" }) {
  const { lang, setLang } = useLanguage();
  const dark = variant === "dark";

  const btnClass = (active: boolean) =>
    `font-sans font-semibold text-[11px] leading-none tracking-[0.06em] px-3 py-2 md:px-[18px] md:py-[9px] border-none cursor-pointer transition-colors duration-200 ${
      active
        ? dark
          ? "bg-terracotta text-ivory"
          : "bg-charcoal text-ivory-alt"
        : dark
          ? "bg-transparent text-ivory/60"
          : "bg-transparent text-charcoal"
    }`;

  return (
    <div
      className={`inline-flex rounded-full overflow-hidden border ${
        dark ? "border-ivory/25" : "border-charcoal/25"
      }`}
      id="lang-toggle"
    >
      <button
        onClick={() => setLang("en")}
        className={btnClass(lang === "en")}
        aria-pressed={lang === "en"}
      >
        EN
      </button>
      <button
        onClick={() => setLang("ar")}
        className={btnClass(lang === "ar")}
        aria-pressed={lang === "ar"}
      >
        AR
      </button>
    </div>
  );
}
