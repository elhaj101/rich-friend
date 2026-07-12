"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function CtaBand({
  title,
  buttonLabel,
  href = "/sign-up",
}: {
  title: string;
  buttonLabel: string;
  href?: string;
}) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-warm-neutral text-center"
      style={{ padding: "clamp(48px, 6vw, 72px) clamp(24px, 5vw, 56px)" }}
    >
      <h2
        className="font-serif font-medium text-charcoal mb-6 mx-auto max-w-[520px]"
        style={{ fontSize: "clamp(24px, 3vw, 30px)", lineHeight: 1.25 }}
      >
        {title}
      </h2>
      <Link
        href={href}
        className="inline-block font-sans font-semibold text-[11px] tracking-[0.05em] bg-charcoal text-ivory no-underline hover:bg-charcoal/90 transition-colors"
        style={{ padding: "14px 28px" }}
      >
        {buttonLabel}
      </Link>
    </motion.section>
  );
}
