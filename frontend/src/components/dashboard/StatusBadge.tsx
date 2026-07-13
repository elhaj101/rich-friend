"use client";

import { useLanguage } from "@/lib/LanguageContext";
import type { OrderStatus } from "@/lib/types";
import { orderStatusLabel } from "./orderStatus";

// Muted for in-progress states, gold for delivered — quiet, not traffic-light.
const STYLES: Record<OrderStatus, { bg: string; color: string }> = {
  requested: { bg: "rgba(27,25,22,0.06)", color: "rgba(27,25,22,0.7)" },
  sourcing: { bg: "rgba(27,25,22,0.06)", color: "rgba(27,25,22,0.7)" },
  purchased: { bg: "rgba(163,128,61,0.1)", color: "#8a6a2f" },
  in_transit: { bg: "rgba(163,128,61,0.12)", color: "#8a6a2f" },
  delivered: { bg: "rgba(45,90,61,0.12)", color: "#2d5a3d" },
};

export default function StatusBadge({ status }: { status: OrderStatus }) {
  const { t } = useLanguage();
  const s = STYLES[status];
  return (
    <span
      className="inline-flex items-center font-sans font-semibold text-[11px] tracking-[0.05em] uppercase px-3 py-1.5 rounded-full"
      style={{ background: s.bg, color: s.color }}
    >
      {orderStatusLabel(status, t)}
    </span>
  );
}
