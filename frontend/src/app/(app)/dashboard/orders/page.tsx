"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import * as api from "@/lib/api";
import type { Order } from "@/lib/types";
import PageHeading from "@/components/dashboard/PageHeading";
import OrderCard from "@/components/dashboard/OrderCard";

export default function OrdersPage() {
  const { t } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api
      .getOrders()
      .then((o) => active && setOrders(o))
      .catch(() => {})
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <PageHeading
        title={t.dashOrdersTitle}
        sub={t.dashOrdersSub}
        action={
          <Link
            href="/dashboard/orders/new"
            className="inline-flex items-center bg-terracotta text-white font-sans font-semibold text-[12px] tracking-[0.06em] px-5 py-3 no-underline hover:bg-terracotta-deep transition-colors"
          >
            {t.dashNewRequest}
          </Link>
        }
      />

      {loading ? (
        <div className="py-16 text-center font-sans text-[13px] tracking-[0.08em] uppercase text-charcoal/35">
          {t.dashLoading}
        </div>
      ) : orders.length === 0 ? (
        <div className="border border-dashed border-charcoal/20 rounded-[6px] p-10 text-center">
          <p className="font-sans text-[14px] text-charcoal/55">{t.dashNoOrders}</p>
          <Link
            href="/dashboard/orders/new"
            className="inline-block mt-4 font-sans text-[13px] font-semibold text-terracotta no-underline hover:text-charcoal transition-colors"
          >
            {t.dashNoOrdersCta} →
          </Link>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col gap-4"
        >
          {orders.map((o) => (
            <OrderCard key={o.id} order={o} />
          ))}
        </motion.div>
      )}
    </>
  );
}
