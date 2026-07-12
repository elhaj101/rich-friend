"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import CtaBand from "@/components/ui/CtaBand";
import { assetPath } from "@/lib/assetPath";

export default function AboutView() {
  const { t, lang } = useLanguage();

  // Match the brand's Arabic-Indic numeral treatment used across the dictionary.
  const numeral = (n: number) => {
    const s = String(n).padStart(2, "0");
    return lang === "ar"
      ? s.replace(/[0-9]/g, (d) => "٠١٢٣٤٥٦٧٨٩"[Number(d)])
      : s;
  };

  return (
    <>
      {/* Intro */}
      <section
        className="bg-ivory text-center"
        style={{ padding: "clamp(72px, 9vw, 120px) clamp(24px, 5vw, 56px) clamp(40px, 5vw, 64px)" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-[620px] mx-auto"
        >
          <div className="font-sans font-semibold text-[11px] tracking-[0.2em] text-accent-gold mb-4">
            {t.aboutKicker}
          </div>
          <h1
            className="font-serif font-medium text-charcoal"
            style={{ fontSize: "clamp(30px, 5vw, 44px)", lineHeight: 1.15 }}
          >
            {t.aboutTitle}
          </h1>
          <p className="font-sans font-normal text-[15px] leading-[1.7] text-charcoal/60 max-w-[520px] mx-auto mt-6">
            {t.aboutLead}
          </p>
        </motion.div>
      </section>

      {/* Photo band with body copy */}
      <section
        className="relative overflow-hidden"
        style={{ padding: "clamp(80px, 11vw, 140px) clamp(24px, 5vw, 72px)" }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('${assetPath("/images/hero-bag.jpeg")}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(20,18,15,0.62), rgba(20,18,15,0.82))",
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative max-w-[560px] mx-auto text-center"
        >
          <p className="font-sans font-normal text-[15px] leading-[1.8] text-ivory/85 mb-5 text-on-image">
            {t.aboutBody1}
          </p>
          <p className="font-sans font-normal text-[15px] leading-[1.8] text-ivory/85 text-on-image">
            {t.aboutBody2}
          </p>
        </motion.div>
      </section>

      {/* Values */}
      <section
        className="bg-ivory"
        style={{ padding: "clamp(64px, 8vw, 96px) clamp(24px, 5vw, 56px)" }}
      >
        <div className="max-w-[1080px] mx-auto">
          <div className="font-sans font-semibold text-[11px] tracking-[0.2em] text-accent-gold mb-10 text-center">
            {t.aboutValuesKicker}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {t.aboutValues.map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
                className="bg-warm-neutral flex flex-col"
                style={{ padding: "32px 30px" }}
              >
                <div className="font-serif font-semibold text-[28px] text-accent-gold mb-4">
                  {numeral(i + 1)}
                </div>
                <h3 className="font-serif font-semibold text-[19px] leading-[1.2] text-charcoal mb-3">
                  {value.title}
                </h3>
                <p className="font-sans font-normal text-[13px] leading-[1.7] text-charcoal/60">
                  {value.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand title={t.aboutCtaTitle} buttonLabel={t.aboutCtaBtn} />
    </>
  );
}
