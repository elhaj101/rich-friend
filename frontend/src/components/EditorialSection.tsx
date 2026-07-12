"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { motion } from "framer-motion";

export default function EditorialSection() {
  const { t } = useLanguage();

  return (
    <section id="editorial">
      {/* Photo background block */}
      <div
        className="relative overflow-hidden"
        style={{ padding: "clamp(72px, 10vw, 140px) clamp(24px, 5vw, 72px)" }}
      >
        {/* Background photo */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/images/editorial-lock.jpeg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        {/* Dark scrim */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(20,18,15,0.55), rgba(20,18,15,0.75))",
          }}
        />

        {/* Copy block */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative max-w-[560px] mx-auto text-center"
        >
          <h2
            className="font-serif font-medium text-ivory mb-[22px]"
            style={{
              fontSize: "clamp(26px, 3.5vw, 34px)",
              lineHeight: 1.35,
            }}
          >
            {t.editorialHeadline}
          </h2>
          <p
            className="font-sans font-normal text-[15px] leading-[1.7] mb-[18px]"
            style={{ color: "rgba(244,241,232,0.85)" }}
          >
            {t.editorialBody1}
          </p>
          <p
            className="font-sans font-normal text-[15px] leading-[1.7]"
            style={{ color: "rgba(244,241,232,0.85)" }}
          >
            {t.editorialBody2}
          </p>
        </motion.div>
      </div>

      {/* CTA band */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-warm-neutral text-center"
        style={{ padding: "clamp(36px, 5vw, 56px) clamp(24px, 5vw, 56px)" }}
      >
        <h3
          className="font-serif font-medium text-charcoal mb-6"
          style={{
            fontSize: "clamp(22px, 3vw, 28px)",
            lineHeight: 1.2,
          }}
        >
          {t.editorialCtaTitle}
        </h3>
        <a
          href="#"
          id="editorial-cta"
          className="inline-block font-sans font-semibold text-[11px] tracking-[0.05em] bg-charcoal text-ivory no-underline hover:bg-charcoal/90 transition-colors duration-200"
          style={{ padding: "14px 28px" }}
        >
          {t.editorialCtaBtn}
        </a>
      </motion.div>
    </section>
  );
}
