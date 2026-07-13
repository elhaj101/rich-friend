"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import { WHATSAPP_URL, CONCIERGE_EMAIL } from "@/lib/config";

// Parallel to t.footerExploreLinks — where each explore link routes.
const EXPLORE_HREFS = ["/how-it-works", "/#styling-suite", "/#trust", "/about"];

const linkClass =
  "font-sans font-normal text-[13px] leading-none no-underline transition-colors duration-200 hover:text-ivory";
const linkStyle = { color: "rgba(244,241,232,0.7)" };

export default function Footer() {
  const { t, toggleLang } = useLanguage();

  return (
    <footer
      id="footer"
      className="bg-charcoal"
      style={{ padding: "clamp(40px, 5vw, 64px) clamp(24px, 5vw, 56px) clamp(20px, 3vw, 32px)" }}
    >
      {/* Top row: 3 columns */}
      <div
        className="flex flex-col md:flex-row gap-10 md:gap-16 pb-11"
        style={{ borderBottom: "1px solid rgba(244,241,232,0.14)" }}
      >
        {/* Brand column */}
        <div className="flex-[1.5]">
          <div
            className="font-script text-ivory mb-5"
            style={{ fontSize: "clamp(30px, 3.4vw, 38px)", lineHeight: 1 }}
          >
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
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            id="whatsapp-cta"
            className="inline-flex items-center gap-[10px] mt-6 px-[18px] py-3 bg-whatsapp rounded-[6px] no-underline hover:brightness-110 transition-all duration-200"
          >
            {/* WhatsApp icon (CSS shape) */}
            <div
              className="w-4 h-4 flex-none"
              style={{ border: "2px solid #1B1916", borderRadius: "50% 50% 50% 4px" }}
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
              <Link
                key={i}
                href={EXPLORE_HREFS[i] ?? "/"}
                className={linkClass}
                style={linkStyle}
              >
                {link}
              </Link>
            ))}
          </div>
        </div>

        {/* Concierge column */}
        <div className="flex-1">
          <div className="font-sans font-semibold text-[10px] tracking-[0.14em] text-accent-gold mb-[18px]">
            {t.footerConciergeTitle}
          </div>
          <div className="flex flex-col gap-3">
            {/* Become a member */}
            <Link href="/sign-up" className={linkClass} style={linkStyle}>
              {t.footerConciergeItems[0]}
            </Link>
            {/* WhatsApp */}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
              style={linkStyle}
            >
              {t.footerConciergeItems[1]}
            </a>
            {/* Email */}
            <a
              href={`mailto:${CONCIERGE_EMAIL}`}
              dir="ltr"
              className={linkClass}
              style={linkStyle}
            >
              {t.footerConciergeItems[2]}
            </a>
            {/* Hours (not a link) */}
            <span
              className="font-sans font-normal text-[13px] leading-none"
              style={linkStyle}
            >
              {t.footerConciergeItems[3]}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom legal row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-6 gap-3 flex-wrap">
        <div
          className="font-sans font-normal text-[11px] leading-none"
          style={{ color: "rgba(244,241,232,0.55)" }}
        >
          {t.footerLegal}
        </div>
        <div className="flex gap-[22px] items-center">
          <Link
            href="/privacy"
            className="font-sans font-normal text-[11px] leading-none no-underline hover:text-ivory/60 transition-colors duration-200"
            style={{ color: "rgba(244,241,232,0.55)" }}
          >
            {t.footerPrivacy}
          </Link>
          <Link
            href="/terms"
            className="font-sans font-normal text-[11px] leading-none no-underline hover:text-ivory/60 transition-colors duration-200"
            style={{ color: "rgba(244,241,232,0.55)" }}
          >
            {t.footerTerms}
          </Link>
          {/* Language toggle */}
          <button
            onClick={toggleLang}
            className="font-sans font-normal text-[11px] leading-none bg-transparent border-none cursor-pointer hover:text-ivory/60 transition-colors duration-200"
            style={{ color: "rgba(244,241,232,0.55)" }}
          >
            {t.footerLang}
          </button>
        </div>
      </div>
    </footer>
  );
}
