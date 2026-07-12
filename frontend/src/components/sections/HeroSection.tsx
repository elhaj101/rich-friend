"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { motion } from "framer-motion";
import { useCloudScroll } from "@/hooks/useCloudScroll";

export default function HeroSection() {
  const { t } = useLanguage();
  const { heroRef, cloudLeftRef, cloudRightRef } = useCloudScroll();

  return (
    <section
      id="hero"
      ref={heroRef}
      className="hero-full relative w-full overflow-hidden"
    >
      {/* Background image with zoom animation (sizing handled by .hero-zoom-out) */}
      <div
        className="hero-zoom-out"
        style={{
          backgroundImage: "url('/images/hero-bag.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(0deg, rgba(20,18,15,0.55), rgba(20,18,15,0.15))",
        }}
      />

      {/* Cloud elements (bottom, moving outward) */}
      <img
        ref={cloudLeftRef}
        src="/images/cloud-cutout.png"
        alt=""
        className="absolute pointer-events-none"
        style={{
          width: "725px",
          height: "632px",
          top: "481px",
          left: "-53px",
          opacity: 0.92,
          transform: "translateX(0)",
        }}
      />
      <img
        ref={cloudRightRef}
        src="/images/cloud-cutout.png"
        alt=""
        className="absolute pointer-events-none"
        style={{
          width: "684px",
          height: "612px",
          top: "507px",
          left: "483px",
          opacity: 0.92,
          transform: "scaleX(-1) translateX(0)",
        }}
      />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-5 md:px-[60px]">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="font-serif font-medium text-ivory max-w-[560px] text-on-image"
          style={{
            fontSize: "clamp(32px, 5vw, 52px)",
            lineHeight: 1.1,
          }}
        >
          {t.heroHeadline}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: "easeOut" }}
          className="font-sans font-normal text-[15px] leading-[1.6] max-w-[440px] mt-5 text-on-image"
          style={{ color: "rgba(244,241,232,0.85)" }}
        >
          {t.heroSub}
        </motion.p>
      </div>
    </section>
  );
}
