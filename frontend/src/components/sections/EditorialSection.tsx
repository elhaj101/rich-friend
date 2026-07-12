"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { motion } from "framer-motion";
import Link from "next/link";
import Sparkles from "@/components/ui/Sparkles";
import { useEditorialCloudScroll } from "@/hooks/useCloudScroll";

export default function EditorialSection() {
  const { t } = useLanguage();
  const { cloudTopLeftRef, cloudTopRightRef } = useEditorialCloudScroll();

  return (
    <section id="editorial" className="hero-section-end">
      {/* Photo background block — full viewport height, separated from the hero by a gold hairline */}
      <div
        className="relative overflow-hidden min-h-screen flex items-center justify-center"
        style={{
          padding: "clamp(77px, 12vw, 144px) clamp(24px, 5vw, 72px)",
          borderTop: "1px solid rgba(163,128,61,0.6)",
        }}
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

        {/* Cloud elements (top, mirrored, continuing from hero) */}
        <img
          ref={cloudTopLeftRef}
          src="/images/cloud-cutout.png"
          alt=""
          className="absolute pointer-events-none"
          style={{
            width: "688px",
            height: "659px",
            top: "-327px",
            left: "-62px",
            opacity: 0.92,
            transform: "scaleY(-1) translateX(0)",
          }}
        />
        <img
          ref={cloudTopRightRef}
          src="/images/cloud-cutout.png"
          alt=""
          className="absolute pointer-events-none"
          style={{
            width: "615px",
            height: "607px",
            top: "-296px",
            left: "526px",
            opacity: 0.92,
            transform: "scale(-1,-1) translateX(0)",
          }}
        />

        {/* Magic sparkles */}
        <Sparkles color="#D8C08A" />

        {/* Copy block */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative max-w-[560px] mx-auto text-center"
        >
          <h2
            className="font-serif font-medium text-ivory mb-[22px] text-on-image"
            style={{
              fontSize: "clamp(31px, 4.2vw, 41px)",
              lineHeight: 1.35,
            }}
          >
            {t.editorialHeadline}
          </h2>
          <p
            className="font-sans font-normal leading-[1.7] text-on-image"
            style={{ fontSize: "18px", color: "rgba(244,241,232,0.85)" }}
          >
            {t.editorialBody1}
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
            fontSize: "clamp(26px, 3.6vw, 33px)",
            lineHeight: 1.2,
          }}
        >
          {t.editorialCtaTitle}
        </h3>
        <Link
          href="/sign-up"
          id="editorial-cta"
          className="inline-block font-sans font-semibold text-[11px] tracking-[0.05em] bg-charcoal text-ivory no-underline hover:bg-charcoal/90 transition-colors duration-200"
          style={{ padding: "14px 28px" }}
        >
          {t.editorialCtaBtn}
        </Link>
      </motion.div>
    </section>
  );
}
