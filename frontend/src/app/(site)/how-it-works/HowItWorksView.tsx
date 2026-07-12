"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import CtaBand from "@/components/ui/CtaBand";

export default function HowItWorksView() {
  const { t } = useLanguage();

  return (
    <>
      {/* Intro */}
      <section
        className="bg-ivory text-center"
        style={{ padding: "clamp(72px, 9vw, 120px) clamp(24px, 5vw, 56px) clamp(32px, 4vw, 48px)" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-[620px] mx-auto"
        >
          <div className="font-sans font-semibold text-[11px] tracking-[0.2em] text-accent-gold mb-4">
            {t.howKicker}
          </div>
          <h1
            className="font-serif font-medium text-charcoal"
            style={{ fontSize: "clamp(30px, 5vw, 44px)", lineHeight: 1.15 }}
          >
            {t.howPageTitle}
          </h1>
          <p className="font-sans font-normal text-[15px] leading-[1.7] text-charcoal/60 max-w-[480px] mx-auto mt-6">
            {t.howPageSub}
          </p>
        </motion.div>
      </section>

      {/* Stages */}
      <section
        className="bg-ivory"
        style={{ padding: "clamp(16px, 3vw, 32px) clamp(24px, 5vw, 56px) clamp(64px, 8vw, 96px)" }}
      >
        <div className="max-w-[820px] mx-auto">
          {t.howStages.map((stage, i) => (
            <motion.div
              key={stage.num}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex flex-col sm:flex-row gap-5 sm:gap-10 py-10"
              style={{
                borderTop: i === 0 ? "none" : "1px solid rgba(27,25,22,0.1)",
              }}
            >
              <div
                className="font-serif font-semibold text-accent-gold leading-none flex-none"
                style={{ fontSize: "clamp(44px, 6vw, 64px)" }}
              >
                {stage.num}
              </div>
              <div className="pt-1">
                <h2 className="font-serif font-medium text-charcoal text-[24px] leading-[1.2] mb-3">
                  {stage.title}
                </h2>
                <p className="font-sans font-normal text-[14px] leading-[1.7] text-charcoal/60 max-w-[520px]">
                  {stage.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing + timeline reassurance band */}
      <section
        className="bg-charcoal"
        style={{ padding: "clamp(56px, 7vw, 88px) clamp(24px, 5vw, 56px)" }}
      >
        <div className="max-w-[900px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h3 className="font-serif font-medium text-ivory text-[24px] leading-[1.2] mb-4">
              {t.howPricingTitle}
            </h3>
            <p className="font-sans font-normal text-[14px] leading-[1.75] text-ivory/70">
              {t.howPricingBody}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          >
            <h3 className="font-serif font-medium text-ivory text-[24px] leading-[1.2] mb-4">
              {t.howTimelineTitle}
            </h3>
            <p className="font-sans font-normal text-[14px] leading-[1.75] text-ivory/70">
              {t.howTimelineBody}
            </p>
          </motion.div>
        </div>
      </section>

      <CtaBand title={t.howCtaTitle} buttonLabel={t.howCtaBtn} />
    </>
  );
}
