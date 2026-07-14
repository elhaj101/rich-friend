"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { assetPath } from "@/lib/assetPath";

export default function TrustSection() {
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const pillars = t.trustPillars;
  const active = pillars[activeIndex];

  return (
    <section id="trust" className="bg-ivory">
      {/* Intro */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="text-center"
        style={{
          padding:
            "clamp(67px, 9.6vw, 106px) clamp(24px, 5vw, 56px) clamp(48px, 6vw, 77px)",
        }}
      >
        <div className="font-sans font-semibold text-[13px] tracking-[0.2em] text-accent-gold mb-4">
          {t.trustKicker}
        </div>
        <h2
          className="font-serif font-medium text-charcoal max-w-[640px] mx-auto"
          style={{
            fontSize: "clamp(33px, 4.8vw, 48px)",
            lineHeight: 1.15,
          }}
        >
          {t.trustHeadline}
        </h2>
      </motion.div>

      {/* Interactive two-column module */}
      <div
        className="grid grid-cols-1 md:grid-cols-[300px_1fr] items-stretch"
        style={{
          padding: "0 clamp(24px, 5vw, 56px) clamp(48px, 6vw, 72px)",
        }}
      >
        {/* Left: pillar nav */}
        <div
          className="flex flex-col"
          style={{ borderTop: "1px solid rgba(27,25,22,0.12)" }}
        >
          {pillars.map((pillar, i) => {
            const isActive = i === activeIndex;
            return (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                id={`trust-tab-${i}`}
                className="flex items-center gap-4 text-left cursor-pointer transition-colors duration-200 border-none bg-transparent"
                style={{
                  padding: "22px 18px",
                  borderBottom: "1px solid rgba(27,25,22,0.12)",
                  borderLeft: isActive
                    ? "2px solid #A3803D"
                    : "2px solid transparent",
                  background: isActive
                    ? "rgba(163,128,61,0.06)"
                    : "transparent",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.background =
                      "rgba(27,25,22,0.03)";
                  }
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = isActive
                    ? "rgba(163,128,61,0.06)"
                    : "transparent";
                }}
              >
                <div
                  className="font-sans font-semibold text-[11px] tracking-[0.12em] w-7 flex-none"
                  style={{
                    color: isActive
                      ? "#A3803D"
                      : "rgba(27,25,22,0.35)",
                  }}
                >
                  {pillar.num}
                </div>
                <div
                  className="font-serif font-semibold text-[17px] leading-[1.3]"
                  style={{
                    color: isActive
                      ? "#1B1916"
                      : "rgba(27,25,22,0.45)",
                  }}
                >
                  {pillar.label}
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: detail panel */}
        <div
          className="bg-charcoal flex flex-col justify-center"
          style={{ padding: "clamp(38px, 5vw, 62px) clamp(33px, 5vw, 57px)", minHeight: "360px" }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <div className="font-serif font-semibold text-accent-gold mb-5" style={{ fontSize: "clamp(48px, 6vw, 76px)", lineHeight: 1 }}>
                {active.num}
              </div>
              <div
                className="font-serif font-medium text-ivory mb-4 max-w-[520px]"
                style={{
                  fontSize: "clamp(26px, 3.6vw, 33px)",
                  lineHeight: 1.2,
                }}
              >
                {active.title}
              </div>
              <p
                className="font-sans font-normal text-[18px] leading-[1.75] max-w-[520px] mb-7"
                style={{ color: "rgba(244,241,232,0.72)" }}
              >
                {active.body}
              </p>
              {/* Proof chip */}
              <div
                className="inline-flex items-center gap-[10px] px-4 py-[10px] rounded-[4px]"
                style={{ border: "1px solid rgba(163,128,61,0.5)" }}
              >
                <div className="w-[6px] h-[6px] rounded-full bg-accent-gold" />
                <div className="font-sans font-semibold text-[10px] tracking-[0.1em] text-light-gold">
                  {active.proof}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Client quote section */}
      <div className="relative overflow-hidden" style={{ padding: "clamp(48px, 6vw, 72px) clamp(24px, 5vw, 56px)" }}>
        {/* Background photo */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('${assetPath("/images/editorial-lock.jpeg")}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "rgba(20,18,15,0.78)" }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative text-center max-w-[560px] mx-auto"
        >
          <blockquote
            className="font-serif font-medium text-ivory m-0 text-on-image"
            style={{
              fontSize: "clamp(20px, 2.8vw, 26px)",
              lineHeight: 1.4,
            }}
          >
            {t.trustQuote}
          </blockquote>
          <div className="font-sans font-semibold text-[11px] tracking-[0.12em] text-light-gold mt-[22px] text-on-image">
            {t.trustAttribution}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
