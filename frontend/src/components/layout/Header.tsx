"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import { useAuth } from "@/lib/AuthContext";
import LangToggle from "@/components/ui/LangToggle";

const navLinkClass =
  "font-sans font-medium text-[11px] tracking-[0.04em] uppercase text-charcoal/70 no-underline hover:text-charcoal transition-colors duration-200";

export default function Header() {
  const { t } = useLanguage();
  const { user, signOut } = useAuth();
  const router = useRouter();

  const headerRef = useRef<HTMLElement>(null);

  // Publish the header's height so the hero can fill exactly the remaining viewport.
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const setVar = () =>
      document.documentElement.style.setProperty("--header-h", `${el.offsetHeight}px`);
    setVar();
    const ro = new ResizeObserver(setVar);
    ro.observe(el);
    window.addEventListener("resize", setVar);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", setVar);
    };
  }, []);

  async function handleSignOut() {
    await signOut();
    router.refresh();
  }

  return (
    <motion.header
      ref={headerRef}
      initial={{ y: "-100%" }}
      animate={{ y: "0%" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="sticky top-0 z-50 bg-ivory/95 backdrop-blur-sm"
      style={{ borderBottom: "1px solid rgba(27,25,22,0.1)" }}
      id="site-header"
    >
      <div className="flex items-center justify-between px-5 py-4">
        {/* Logo */}
        <Link
          href="/"
          id="logo"
          className="font-script text-charcoal no-underline"
          style={{ fontSize: "clamp(26px, 3.4vw, 32px)", lineHeight: 1 }}
        >
          {t.brand}
        </Link>

        {/* Nav Links — hidden on mobile */}
        <nav className="hidden md:flex items-center gap-7" id="main-nav">
          <Link href="/#hero" className={navLinkClass}>
            {t.navOrder}
          </Link>
          <Link href="/how-it-works" className={navLinkClass}>
            {t.navHow}
          </Link>
          <Link href="/#styling-suite" className={navLinkClass}>
            {t.navServices}
          </Link>
          <Link href="/#trust" className={navLinkClass}>
            {t.navTrust}
          </Link>
          <Link href="/about" className={navLinkClass}>
            {t.navAbout}
          </Link>
        </nav>

        {/* Right side: Lang toggle + auth-aware actions */}
        <div className="flex items-center gap-3 md:gap-4">
          <LangToggle />

          {user ? (
            <div className="flex items-center gap-3 md:gap-4">
              <Link
                href="/dashboard"
                className="hidden sm:inline font-sans font-medium text-[11px] tracking-[0.04em] uppercase text-charcoal/70 no-underline hover:text-charcoal transition-colors duration-200"
              >
                {t.navDashboard}
              </Link>
              <Link
                href="/dashboard"
                className="font-sans font-semibold text-[11px] tracking-[0.05em] px-[18px] py-[10px] border border-charcoal text-charcoal no-underline bg-transparent hover:bg-charcoal hover:text-ivory transition-colors duration-200"
              >
                {user.name.split(" ")[0]}
              </Link>
              <button
                onClick={handleSignOut}
                className="hidden sm:inline font-sans font-medium text-[11px] tracking-[0.04em] text-charcoal/55 cursor-pointer bg-transparent border-none hover:text-alert-red transition-colors duration-200"
              >
                {t.navSignOut}
              </button>
            </div>
          ) : (
            <Link
              href="/sign-in"
              id="header-cta"
              className="inline-block font-sans font-semibold text-[11px] tracking-[0.05em] px-[18px] py-[10px] border border-charcoal text-charcoal no-underline hover:bg-charcoal hover:text-ivory transition-colors duration-200"
            >
              {t.navSignIn}
            </Link>
          )}
        </div>
      </div>
    </motion.header>
  );
}
