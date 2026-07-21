"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { formatDate } from "@/lib/format";
import type { Order } from "@/lib/types";
import StatusBadge from "./StatusBadge";
import StatusTimeline from "./StatusTimeline";

export default function OrderCard({ order }: { order: Order }) {
  const { t, lang } = useLanguage();

  return (
    <div className="bg-white border border-card-line rounded-[10px] p-5 md:p-6">
      <div className="flex gap-4 md:gap-5">
        {/* Thumbnail */}
        <div
          className="shrink-0 w-[76px] h-[76px] md:w-[92px] md:h-[92px] rounded-[4px] overflow-hidden bg-warm-neutral flex items-center justify-center"
          aria-hidden={!order.referencePhoto}
        >
          {order.referencePhoto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={order.referencePhoto}
              alt={order.itemName}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="font-serif text-charcoal/25 text-[22px]">
              {order.brand.slice(0, 1)}
            </span>
          )}
        </div>

        {/* Header info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="min-w-0">
              <span className="font-sans text-[11px] tracking-[0.08em] text-terracotta" dir="ltr">
                {order.ref}
              </span>
              <h3
                className="font-serif-dash text-charcoal truncate"
                style={{ fontSize: 20, lineHeight: 1.2 }}
              >
                {order.itemName}
              </h3>
              <p className="font-sans text-[13px] text-charcoal/60">{order.brand}</p>
            </div>
            <StatusBadge status={order.status} />
          </div>
        </div>
      </div>

      {/* Meta row */}
      <div className="flex flex-wrap gap-x-8 gap-y-2 mt-4 mb-6">
        {order.budget && <Meta label={t.dashOrderBudget} value={order.budget} />}
        <Meta label={t.dashOrderDest} value={order.destinationCountry} />
        {order.shopper && <Meta label={t.dashOrderShopper} value={order.shopper} />}
        <Meta label={t.dashOrderPlaced} value={formatDate(order.createdAt, lang)} />
      </div>

      <StatusTimeline status={order.status} />
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <div className="font-sans text-[10px] tracking-[0.08em] uppercase text-charcoal/40">
        {label}
      </div>
      <div className="font-sans text-[13px] text-charcoal/80 truncate">{value}</div>
    </div>
  );
}
