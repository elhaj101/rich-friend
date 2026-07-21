"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/AuthContext";
import { useLanguage } from "@/lib/LanguageContext";
import * as api from "@/lib/api";
import { toLocaleDigits } from "@/lib/format";
import type { Appointment, Order, WishlistItem } from "@/lib/types";
import PageHeading from "@/components/dashboard/PageHeading";
import StatCard from "@/components/dashboard/StatCard";
import OrderCard from "@/components/dashboard/OrderCard";
import AppointmentCard from "@/components/dashboard/AppointmentCard";
import { isActiveOrder } from "@/components/dashboard/orderStatus";
import { relativeDayLabel } from "@/components/dashboard/relativeDay";

export default function OverviewPage() {
  const { user } = useAuth();
  const { t, lang } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([api.getOrders(), api.getAppointments(), api.getWishlist()])
      .then(([o, a, w]) => {
        if (!active) return;
        setOrders(o);
        setAppointments(a);
        setWishlist(w);
      })
      .catch(() => {})
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const firstName = user?.name.split(" ")[0] ?? "";
  const activeCount = orders.filter((o) => isActiveOrder(o.status)).length;
  const nextAppt = appointments.find((a) => a.status !== "completed");
  const wishlistFilled = wishlist.filter((w) => w.photo || w.title).length;

  return (
    <>
      <PageHeading
        title={`${t.dashWelcome}, ${firstName}`}
        sub={t.dashOverviewSub}
      />

      {loading ? (
        <LoadingRow t={t.dashLoading} />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {/* Snapshot */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              label={t.dashStatActiveOrders}
              value={toLocaleDigits(activeCount, lang)}
              href="/dashboard/orders"
              cta={t.dashViewAll}
            />
            <StatCard
              label={t.dashStatNextAppointment}
              value={
                nextAppt
                  ? relativeDayLabel(nextAppt.scheduledAt, lang, t)
                  : t.dashNone
              }
              sub={
                nextAppt
                  ? nextAppt.kind === "video_call"
                    ? t.dashApptVideo
                    : t.dashApptPhone
                  : undefined
              }
              href="/dashboard/appointments"
              cta={t.dashViewAll}
            />
            <StatCard
              label={t.dashStatWishlist}
              value={
                <>
                  {toLocaleDigits(wishlistFilled, lang)}
                  <span className="text-charcoal/40 text-[0.6em]">
                    {" "}
                    {t.dashOfFive}
                  </span>
                </>
              }
              href="/dashboard/wishlist"
              cta={t.dashViewAll}
            />
          </div>

          {/* Quick actions */}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/dashboard/orders/new"
              className="inline-flex items-center bg-terracotta text-white font-sans font-semibold text-[12px] tracking-[0.06em] px-5 py-3 no-underline hover:bg-terracotta-deep transition-colors"
            >
              {t.dashNewRequest}
            </Link>
            <Link
              href="/dashboard/appointments"
              className="inline-flex items-center bg-white border border-button-border text-charcoal font-sans font-semibold text-[12px] tracking-[0.06em] px-5 py-3 no-underline hover:border-terracotta transition-colors"
            >
              {t.dashApptRequestTitle}
            </Link>
          </div>

          {/* Next appointment */}
          {nextAppt && (
            <section className="mt-10">
              <SectionLabel>{t.dashStatNextAppointment}</SectionLabel>
              <AppointmentCard appt={nextAppt} />
            </section>
          )}

          {/* Recent orders */}
          <section className="mt-10">
            <div className="flex items-center justify-between mb-4">
              <SectionLabel>{t.dashRecentOrders}</SectionLabel>
              {orders.length > 0 && (
                <Link
                  href="/dashboard/orders"
                  className="font-sans text-[12px] text-terracotta no-underline hover:text-charcoal transition-colors"
                >
                  {t.dashViewAll} →
                </Link>
              )}
            </div>
            {orders.length === 0 ? (
              <EmptyOrders />
            ) : (
              <div className="flex flex-col gap-4">
                {orders.slice(0, 2).map((o) => (
                  <OrderCard key={o.id} order={o} />
                ))}
              </div>
            )}
          </section>
        </motion.div>
      )}
    </>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-sans text-[11px] tracking-[0.12em] uppercase text-charcoal/45 mb-4">
      {children}
    </h2>
  );
}

function LoadingRow({ t }: { t: string }) {
  return (
    <div className="py-16 text-center font-sans text-[13px] tracking-[0.08em] uppercase text-charcoal/35">
      {t}
    </div>
  );
}

function EmptyOrders() {
  const { t } = useLanguage();
  return (
    <div className="border border-dashed border-charcoal/20 rounded-[6px] p-8 text-center">
      <p className="font-sans text-[14px] text-charcoal/55">{t.dashNoOrders}</p>
      <Link
        href="/dashboard/orders/new"
        className="inline-block mt-4 font-sans text-[13px] font-semibold text-terracotta no-underline hover:text-charcoal transition-colors"
      >
        {t.dashNoOrdersCta} →
      </Link>
    </div>
  );
}
