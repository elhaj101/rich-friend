"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";

export default function LegalView({ kind }: { kind: "privacy" | "terms" }) {
  const { t } = useLanguage();
  const title = kind === "privacy" ? t.privacyTitle : t.termsTitle;
  const body = kind === "privacy" ? t.privacyBody : t.termsBody;

  return (
    <section className="px-5 md:px-10 py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-[680px] mx-auto"
      >
        <h1
          className="font-serif font-medium text-charcoal"
          style={{ fontSize: "clamp(32px, 5vw, 48px)", lineHeight: 1.1 }}
        >
          {title}
        </h1>
        <p className="mt-3 font-sans text-[12px] tracking-[0.06em] uppercase text-charcoal/40">
          {t.legalUpdated}
        </p>

        <div className="mt-8 flex flex-col gap-5">
          {body.map((para, i) => (
            <p
              key={i}
              className="font-sans text-[15px] leading-[1.75] text-charcoal/75"
            >
              {para}
            </p>
          ))}
        </div>

        <p className="mt-10 pt-6 font-sans text-[13px] leading-[1.6] text-charcoal/45 border-t border-charcoal/10">
          {t.legalPlaceholderNote}
        </p>
      </motion.div>
    </section>
  );
}
