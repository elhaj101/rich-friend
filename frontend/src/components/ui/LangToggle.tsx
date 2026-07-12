"use client";

import { useLanguage } from "@/lib/LanguageContext";

export default function LangToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <div
      className="inline-flex border border-charcoal/25 rounded-full overflow-hidden"
      id="lang-toggle"
    >
      <button
        onClick={() => setLang("en")}
        className={`font-sans font-semibold text-[11px] leading-none tracking-[0.06em] px-3 py-2 md:px-[18px] md:py-[9px] border-none cursor-pointer transition-colors duration-200 ${
          lang === "en"
            ? "bg-charcoal text-ivory-alt"
            : "bg-transparent text-charcoal"
        }`}
        aria-pressed={lang === "en"}
      >
        EN
      </button>
      <button
        onClick={() => setLang("ar")}
        className={`font-sans font-semibold text-[11px] leading-none tracking-[0.06em] px-3 py-2 md:px-[18px] md:py-[9px] border-none cursor-pointer transition-colors duration-200 ${
          lang === "ar"
            ? "bg-charcoal text-ivory-alt"
            : "bg-transparent text-charcoal"
        }`}
        aria-pressed={lang === "ar"}
      >
        AR
      </button>
    </div>
  );
}
