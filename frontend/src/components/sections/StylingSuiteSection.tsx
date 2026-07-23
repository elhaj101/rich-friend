"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Sparkles from "@/components/ui/Sparkles";
import { assetPath } from "@/lib/assetPath";

export default function StylingSuiteSection() {
  const { t } = useLanguage();

  const cards = [
    { num: t.stylCard1Num, title: t.stylCard1Title, body: t.stylCard1Body },
    { num: t.stylCard2Num, title: t.stylCard2Title, body: t.stylCard2Body },
    { num: t.stylCard3Num, title: t.stylCard3Title, body: t.stylCard3Body },
  ];

  return (
    <section id="styling-suite" className="bg-ivory">
      {/* Intro block */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative text-center"
        style={{
          padding: "clamp(48px, 7vw, 80px) clamp(24px, 5vw, 56px) clamp(32px, 4vw, 48px)",
        }}
      >
        {/* Magic sparkles */}
        <Sparkles color="#A3803D" />

        <div className="relative">
          <div className="font-sans font-semibold text-[12px] tracking-[0.2em] text-accent-gold mb-4">
            {t.stylKicker}
          </div>
          <h2
            className="font-serif font-medium text-charcoal max-w-[580px] mx-auto"
            style={{
              fontSize: "clamp(30px, 4.2vw, 42px)",
              lineHeight: 1.15,
            }}
          >
            {t.stylHeadline}
          </h2>
          <p
            className="font-sans font-normal text-[16px] leading-[1.7] max-w-[500px] mx-auto mt-[18px]"
            style={{ color: "rgba(27,25,22,0.65)" }}
          >
            {t.stylBody}
          </p>
        </div>
      </motion.div>

      {/* Two-column grid: video call + benefit cards */}
      <div
        className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-4 items-stretch"
        style={{ padding: "0 clamp(24px, 5vw, 56px) clamp(48px, 6vw, 72px)" }}
      >
        {/* Mock video call panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative bg-charcoal overflow-hidden"
          style={{ minHeight: "420px" }}
        >
          {/* Stylist photo */}
          <Image
            src={assetPath("/images/stylist-call.png")}
            alt="A client on a private video styling call from home"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 60vw"
            priority
          />

          {/* Bottom gradient */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(0deg, rgba(20,18,15,0.55), transparent 50%)",
            }}
          />

          {/* LIVE pill */}
          <div
            className="absolute top-5 flex items-center gap-2 px-[14px] py-2 rounded-full"
            style={{
              left: "20px",
              background: "rgba(20,18,15,0.55)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
            }}
          >
            <div className="w-[7px] h-[7px] rounded-full bg-whatsapp" />
            <div className="font-sans font-semibold text-[10px] tracking-[0.08em] text-ivory">
              {t.stylLivePill}
            </div>
          </div>

          {/* Call controls */}
          <div className="absolute left-0 right-0 bottom-5 flex justify-center gap-[14px]">
            {/* Mute button */}
            <div
              className="w-[44px] h-[44px] rounded-full flex items-center justify-center"
              style={{
                background: "rgba(244,241,232,0.16)",
                backdropFilter: "blur(6px)",
              }}
            >
              <div
                className="w-4 h-3 rounded-[3px]"
                style={{ border: "2px solid #F4F1E8" }}
              />
            </div>

            {/* Hang up button */}
            <div className="w-[44px] h-[44px] rounded-full bg-alert-red flex items-center justify-center">
              <div
                className="w-4 h-[6px] bg-ivory rounded-full"
                style={{ transform: "rotate(135deg)" }}
              />
            </div>
          </div>
        </motion.div>

        {/* Benefit cards */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          className="flex flex-col gap-3"
        >
          {cards.map((card, i) => (
            <div
              key={i}
              className="flex-1 bg-warm-neutral flex flex-col justify-center"
              style={{ padding: "26px 28px" }}
            >
              <div className="font-serif font-semibold text-[32px] leading-none text-accent-gold mb-3">
                {card.num}
              </div>
              <div
                className="font-serif font-semibold leading-[1.2] text-charcoal mb-[6px]"
                style={{ fontSize: "clamp(22px, 2.3vw, 25px)" }}
              >
                {card.title}
              </div>
              <div
                className="font-sans font-normal leading-[1.6]"
                style={{ fontSize: "14px", color: "rgba(27,25,22,0.62)" }}
              >
                {card.body}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Dark CTA bar */}
      <div
        className="bg-charcoal flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-8"
        style={{ padding: "clamp(28px, 4vw, 44px) clamp(24px, 5vw, 56px)" }}
      >
        <div
          className="font-serif font-medium text-ivory max-w-[460px]"
          style={{
            fontSize: "clamp(20px, 2.7vw, 24px)",
            lineHeight: 1.3,
          }}
        >
          {t.stylCtaMsg}
        </div>
        <Link
          href="/sign-up"
          id="styling-cta"
          className="flex-none font-sans font-semibold text-[13px] tracking-[0.05em] bg-terracotta text-white no-underline hover:bg-terracotta-deep transition-colors duration-200"
          style={{ padding: "15px 32px" }}
        >
          {t.stylCtaBtn}
        </Link>
      </div>
    </section>
  );
}
