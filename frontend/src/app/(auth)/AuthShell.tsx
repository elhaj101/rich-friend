"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import LangToggle from "@/components/ui/LangToggle";
import { assetPath } from "@/lib/assetPath";

export default function AuthShell({ children }: { children: ReactNode }) {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-ivory">
      {/* Brand panel */}
      <aside className="relative md:flex-1 bg-charcoal overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('${assetPath("/images/editorial-lock.jpeg")}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.22,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(20,18,15,0.7), rgba(20,18,15,0.92))",
          }}
        />
        <div className="relative flex flex-col justify-between h-full gap-10 p-6 md:p-12 md:min-h-screen">
          <Link
            href="/"
            className="font-script text-ivory no-underline"
            style={{ fontSize: "clamp(30px, 3vw, 36px)", lineHeight: 1 }}
          >
            {t.brand}
          </Link>
          <p
            className="hidden md:block font-serif font-medium text-ivory max-w-[360px] text-on-image"
            style={{ fontSize: "clamp(22px, 2.4vw, 30px)", lineHeight: 1.4 }}
          >
            {t.authTagline}
          </p>
          <div className="hidden md:block" aria-hidden />
        </div>
      </aside>

      {/* Form panel */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-end p-6 md:p-8">
          <LangToggle />
        </div>
        <div className="flex-1 flex items-start md:items-center justify-center px-6 pb-16">
          <div className="w-full max-w-[380px]">{children}</div>
        </div>
      </div>
    </div>
  );
}
