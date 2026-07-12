"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { motion } from "framer-motion";
import Link from "next/link";
import Sparkles from "@/components/ui/Sparkles";
import { useEditorialCloudScroll } from "@/hooks/useCloudScroll";
import { assetPath } from "@/lib/assetPath";

export default function EditorialSection() {
  const { t } = useLanguage();
  const { editorialRef, cloudTopLeftRef, cloudTopRightRef } =
    useEditorialCloudScroll();

  return (
    <section id="editorial" ref={editorialRef}>
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
            backgroundImage: `url('${assetPath("/images/editorial-lock.jpeg")}')`,
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

        {/* Cloud elements (top, mirrored, continuing from hero). Percentage/
            aspect-ratio positioning mirrors HeroSection's approach so the
            seam reads as one continuous shape at every viewport size. */}
        <img
          ref={cloudTopLeftRef}
          src={assetPath("/images/cloud-cutout.png")}
          alt=""
          className="absolute pointer-events-none select-none"
          style={{
            left: "-4.3%",
            top: "-36.3%",
            width: "clamp(170px, 47.8vw, 688px)",
            aspectRatio: "688 / 659",
            objectFit: "fill",
            opacity: 0.92,
            transform: "scaleY(-1)",
            maskImage:
              "radial-gradient(ellipse 78% 72% at 50% 52%, #000 58%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 78% 72% at 50% 52%, #000 58%, transparent 100%)",
          }}
        />
        <img
          ref={cloudTopRightRef}
          src={assetPath("/images/cloud-cutout.png")}
          alt=""
          className="absolute pointer-events-none select-none"
          style={{
            left: "36.5%",
            top: "-32.9%",
            width: "clamp(150px, 42.7vw, 615px)",
            aspectRatio: "615 / 607",
            objectFit: "fill",
            opacity: 0.92,
            maskImage:
              "radial-gradient(ellipse 78% 72% at 50% 52%, #000 58%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 78% 72% at 50% 52%, #000 58%, transparent 100%)",
            transform: "scale(-1,-1)",
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
