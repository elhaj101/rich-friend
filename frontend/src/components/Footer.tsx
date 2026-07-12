"use client";

import { useLanguage } from "@/lib/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer id="footer" className="bg-charcoal" style={{ padding: "clamp(40px, 5vw, 64px) clamp(24px, 5vw, 56px) clamp(20px, 3vw, 32px)" }}>
      {/* Top row: 3 columns */}
      <div
        className="flex flex-col md:flex-row gap-10 md:gap-16 pb-11"
        style={{ borderBottom: "1px solid rgba(244,241,232,0.14)" }}
      >
        {/* Brand column */}
        <div className="flex-[1.5]">
          <div className="font-serif font-semibold text-[18px] tracking-[0.14em] text-ivory mb-4">
            {t.footerBrand}
          </div>
          <p
            className="font-sans font-normal text-[13px] leading-[1.7] max-w-[280px] m-0"
            style={{ color: "rgba(244,241,232,0.6)" }}
          >
            {t.footerStatement}
          </p>
          {/* WhatsApp pill */}
          <a
            href="#"
            id="whatsapp-cta"
            className="inline-flex items-center gap-[10px] mt-6 px-[18px] py-3 bg-whatsapp rounded-[6px] no-underline hover:brightness-110 transition-all duration-200"
          >
            {/* WhatsApp icon (CSS shape) */}
            <div
              className="w-4 h-4 flex-none"
              style={{
                border: "2px solid #1B1916",
                borderRadius: "50% 50% 50% 4px",
              }}
            />
            <span className="font-sans font-semibold text-[12px] leading-none text-charcoal">
              {t.footerWhatsapp}
            </span>
          </a>
        </div>

        {/* Explore column */}
        <div className="flex-1">
          <div className="font-sans font-semibold text-[10px] tracking-[0.14em] text-accent-gold mb-[18px]">
            {t.footerExploreTitle}
          </div>
          <div className="flex flex-col gap-3">
            {t.footerExploreLinks.map((link, i) => (
              <a
                key={i}
                href="#"
                className="font-sans font-normal text-[13px] leading-none no-underline transition-colors duration-200 hover:text-ivory"
                style={{ color: "rgba(244,241,232,0.7)" }}
              >
                {link}
              </a>
            ))}
          </div>
        </div>

        {/* Concierge column */}
        <div className="flex-1">
          <div className="font-sans font-semibold text-[10px] tracking-[0.14em] text-accent-gold mb-[18px]">
            {t.footerConciergeTitle}
          </div>
          <div className="flex flex-col gap-3">
            {t.footerConciergeItems.map((item, i) => (
              <span
                key={i}
                className="font-sans font-normal text-[13px] leading-none"
                style={{ color: "rgba(244,241,232,0.7)" }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom legal row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-6 gap-3 flex-wrap">
        <div
          className="font-sans font-normal text-[11px] leading-none"
          style={{ color: "rgba(244,241,232,0.4)" }}
        >
          {t.footerLegal}
        </div>
        <div className="flex gap-[22px]">
          <a
            href="#"
            className="font-sans font-normal text-[11px] leading-none no-underline hover:text-ivory/60 transition-colors duration-200"
            style={{ color: "rgba(244,241,232,0.4)" }}
          >
            {t.footerPrivacy}
          </a>
          <a
            href="#"
            className="font-sans font-normal text-[11px] leading-none no-underline hover:text-ivory/60 transition-colors duration-200"
            style={{ color: "rgba(244,241,232,0.4)" }}
          >
            {t.footerTerms}
          </a>
          <a
            href="#"
            className="font-sans font-normal text-[11px] leading-none no-underline hover:text-ivory/60 transition-colors duration-200"
            style={{ color: "rgba(244,241,232,0.4)" }}
          >
            {t.footerLang}
          </a>
        </div>
      </div>
    </footer>
  );
}
