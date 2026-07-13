"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

export default function NotFound() {
  const { t } = useLanguage();
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center bg-ivory px-6">
      <Link
        href="/"
        className="font-script text-charcoal no-underline mb-10"
        style={{ fontSize: "clamp(30px, 4vw, 40px)", lineHeight: 1 }}
      >
        {t.brand}
      </Link>
      <p className="font-sans text-[13px] tracking-[0.2em] uppercase text-accent-gold">
        404
      </p>
      <h1
        className="font-serif font-medium text-charcoal mt-3"
        style={{ fontSize: "clamp(28px, 5vw, 44px)", lineHeight: 1.1 }}
      >
        {t.notFoundTitle}
      </h1>
      <p className="font-sans text-[15px] leading-[1.6] text-charcoal/60 mt-4 max-w-[380px]">
        {t.notFoundBody}
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center bg-charcoal text-ivory font-sans font-semibold text-[12px] tracking-[0.08em] px-7 py-3.5 no-underline hover:bg-charcoal/90 transition-colors"
      >
        {t.notFoundHome}
      </Link>
    </main>
  );
}
