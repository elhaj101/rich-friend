"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { useLanguage } from "@/lib/LanguageContext";
import { DEMO_AUTH } from "@/lib/config";
import LangToggle from "@/components/ui/LangToggle";
import WhatsAppFab from "./WhatsAppFab";
import { GridIcon, BagIcon, CalendarIcon, HeartIcon, UserIcon } from "./icons";

export default function DashboardShell({ children }: { children: ReactNode }) {
  const { user, loading, signOut, continueAsGuest } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const guestTried = useRef(false);

  // Access control. In DEMO mode (backend not yet configured) the dashboard is
  // reachable without signing in — we provision a guest session on the fly.
  // Otherwise this is a client-side guard that sends anonymous users to sign-in
  // (works under the static export too — no server middleware needed).
  useEffect(() => {
    if (loading || user) return;
    if (DEMO_AUTH) {
      if (!guestTried.current) {
        guestTried.current = true;
        continueAsGuest().catch(() => {});
      }
    } else {
      router.replace("/sign-in");
    }
  }, [loading, user, router, continueAsGuest]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory">
        <span className="font-sans text-[13px] tracking-[0.08em] uppercase text-charcoal/40">
          {t.dashLoading}
        </span>
      </div>
    );
  }

  const nav = [
    { href: "/dashboard", label: t.dashNavOverview, Icon: GridIcon, exact: true },
    { href: "/dashboard/orders", label: t.dashNavOrders, Icon: BagIcon },
    { href: "/dashboard/appointments", label: t.dashNavAppointments, Icon: CalendarIcon },
    { href: "/dashboard/wishlist", label: t.dashNavWishlist, Icon: HeartIcon },
    { href: "/dashboard/profile", label: t.dashNavProfile, Icon: UserIcon },
  ];

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

  async function handleSignOut() {
    await signOut();
    router.replace("/");
  }

  return (
    <div className="min-h-screen bg-ivory flex flex-col md:flex-row">
      {/* ── Sidebar (desktop) ── */}
      <aside
        className="hidden md:flex md:flex-col md:w-[248px] md:shrink-0 md:h-screen md:sticky md:top-0 bg-ivory-alt/50"
        style={{ borderInlineEnd: "1px solid rgba(27,25,22,0.1)" }}
      >
        <Link
          href="/"
          className="font-script text-charcoal no-underline px-7 pt-7 pb-6"
          style={{ fontSize: 30, lineHeight: 1 }}
        >
          {t.brand}
        </Link>

        <nav className="flex flex-col gap-1 px-4">
          {nav.map(({ href, label, Icon, exact }) => {
            const active = isActive(href, exact);
            return (
              <Link
                key={href}
                href={href}
                className="relative flex items-center gap-3 px-3 py-2.5 rounded-[5px] no-underline font-sans text-[14px] transition-colors"
                style={{
                  color: active ? "#1B1916" : "rgba(27,25,22,0.6)",
                  background: active ? "rgba(163,128,61,0.1)" : "transparent",
                  fontWeight: active ? 600 : 400,
                }}
              >
                {active && (
                  <span
                    aria-hidden
                    className="absolute top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-full bg-accent-gold"
                    style={{ insetInlineStart: 0 }}
                  />
                )}
                <Icon />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto px-6 py-6 flex flex-col gap-4" style={{ borderTop: "1px solid rgba(27,25,22,0.08)" }}>
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="font-sans text-[13px] font-semibold text-charcoal truncate">
              {user.name}
            </span>
            <span className="font-sans text-[12px] text-charcoal/45 truncate" dir="ltr">
              {user.email}
            </span>
          </div>
          <LangToggle />
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="font-sans text-[12px] text-charcoal/55 no-underline hover:text-charcoal transition-colors"
            >
              {t.dashBackToSite}
            </Link>
            <button
              onClick={handleSignOut}
              className="font-sans text-[12px] text-charcoal/55 bg-transparent border-none cursor-pointer hover:text-alert-red transition-colors"
            >
              {t.navSignOut}
            </button>
          </div>
        </div>
      </aside>

      {/* ── Top bar (mobile) ── */}
      <div
        className="md:hidden sticky top-0 z-30 bg-ivory/95 backdrop-blur-sm"
        style={{ borderBottom: "1px solid rgba(27,25,22,0.1)" }}
      >
        <div className="flex items-center justify-between px-5 py-3">
          <Link
            href="/"
            className="font-script text-charcoal no-underline"
            style={{ fontSize: 26, lineHeight: 1 }}
          >
            {t.brand}
          </Link>
          <div className="flex items-center gap-3">
            <LangToggle />
            <button
              onClick={handleSignOut}
              className="font-sans text-[11px] tracking-[0.04em] text-charcoal/60 bg-transparent border-none cursor-pointer"
            >
              {t.navSignOut}
            </button>
          </div>
        </div>
        <nav className="flex gap-1 px-3 pb-2 overflow-x-auto">
          {nav.map(({ href, label, exact }) => {
            const active = isActive(href, exact);
            return (
              <Link
                key={href}
                href={href}
                className="whitespace-nowrap px-3 py-2 rounded-full no-underline font-sans text-[13px] transition-colors"
                style={{
                  color: active ? "#1B1916" : "rgba(27,25,22,0.6)",
                  background: active ? "rgba(163,128,61,0.12)" : "transparent",
                  fontWeight: active ? 600 : 400,
                }}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* ── Main content ── */}
      <main className="flex-1 min-w-0 px-5 py-8 md:px-12 md:py-12">
        <div className="max-w-[900px] mx-auto">{children}</div>
      </main>

      <WhatsAppFab />
    </div>
  );
}
