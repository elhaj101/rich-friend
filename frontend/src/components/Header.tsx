"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { motion } from "framer-motion";

export default function Header() {
  const { t, lang, setLang } = useLanguage();

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 z-50 bg-ivory/95 backdrop-blur-sm"
      style={{ borderBottom: "1px solid rgba(27,25,22,0.1)" }}
      id="site-header"
    >
      <div className="flex items-center justify-between px-5 py-4 md:px-10 md:py-[22px]">
        {/* Logo */}
        <a
          href="#"
          id="logo"
          className="font-serif font-semibold text-[15px] tracking-[0.14em] text-charcoal no-underline"
        >
          {t.brand}
        </a>

        {/* Nav Links — hidden on mobile */}
        <nav
          className="hidden md:flex items-center gap-7"
          id="main-nav"
        >
          <a href="#hero" className="font-sans font-medium text-[11px] tracking-[0.04em] text-charcoal/70 no-underline hover:text-charcoal transition-colors duration-200">
            {t.navOrder}
          </a>
          <a href="#styling-suite" className="font-sans font-medium text-[11px] tracking-[0.04em] text-charcoal/70 no-underline hover:text-charcoal transition-colors duration-200">
            {t.navServices}
          </a>
          <a href="#trust" className="font-sans font-medium text-[11px] tracking-[0.04em] text-charcoal/70 no-underline hover:text-charcoal transition-colors duration-200">
            {t.navTrust}
          </a>
          <a href="#footer" className="font-sans font-medium text-[11px] tracking-[0.04em] text-charcoal/70 no-underline hover:text-charcoal transition-colors duration-200">
            {t.navAbout}
          </a>
        </nav>

        {/* Right side: Lang toggle + CTA */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Language toggle */}
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
            >
              AR
            </button>
          </div>

          {/* CTA Button */}
          <a
            href="#"
            id="header-cta"
            className="hidden sm:inline-block font-sans font-semibold text-[11px] tracking-[0.05em] px-[18px] py-[10px] border border-charcoal text-charcoal no-underline hover:bg-charcoal hover:text-ivory transition-colors duration-200"
          >
            {t.navCta}
          </a>
        </div>
      </div>
    </motion.header>
  );
}
