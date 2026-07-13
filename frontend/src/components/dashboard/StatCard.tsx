"use client";

import Link from "next/link";
import type { ReactNode } from "react";

interface Props {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  href?: string;
  cta?: string;
}

export default function StatCard({ label, value, sub, href, cta }: Props) {
  return (
    <div className="flex flex-col bg-ivory-alt/60 border border-charcoal/10 rounded-[6px] p-5 md:p-6">
      <span className="font-sans text-[11px] tracking-[0.1em] uppercase text-charcoal/50">
        {label}
      </span>
      <span
        className="font-serif text-charcoal mt-2"
        style={{ fontSize: "clamp(26px, 3vw, 34px)", lineHeight: 1.1 }}
      >
        {value}
      </span>
      {sub && (
        <span className="font-sans text-[13px] leading-[1.5] text-charcoal/60 mt-1.5">
          {sub}
        </span>
      )}
      {href && cta && (
        <Link
          href={href}
          className="mt-auto pt-4 font-sans text-[12px] tracking-[0.04em] text-accent-gold no-underline hover:text-charcoal transition-colors"
        >
          {cta} →
        </Link>
      )}
    </div>
  );
}
