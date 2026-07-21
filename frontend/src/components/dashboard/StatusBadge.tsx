"use client";

import { useLanguage } from "@/lib/LanguageContext";
import type { OrderStatus } from "@/lib/types";
import { orderStatusLabel } from "./orderStatus";

// Muted for in-progress states, terracotta for delivered — quiet, not traffic-light.
const STYLES: Record<OrderStatus, { bg: string; color: string }> = {
  requested: { bg: "rgba(27,25,22,0.06)", color: "rgba(27,25,22,0.7)" },
  sourcing: { bg: "rgba(27,25,22,0.06)", color: "rgba(27,25,22,0.7)" },
  purchased: { bg: "#F3DDD0", color: "#8A3D20" },
  in_transit: { bg: "rgba(196,109,74,0.16)", color: "#8A3D20" },
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
