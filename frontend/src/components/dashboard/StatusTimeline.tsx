"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/types";
import { orderStatusLabel, statusIndex } from "./orderStatus";

// Horizontal 5-step progress line. Steps up to and including the current status
// are filled gold; the current one carries a ring; later steps are muted.
export default function StatusTimeline({ status }: { status: OrderStatus }) {
  const { t } = useLanguage();
  const current = statusIndex(status);

  return (
    <ol className="flex items-start w-full" aria-label={orderStatusLabel(status, t)}>
      {ORDER_STATUSES.map((s: OrderStatus, i) => {
        const done = i <= current;
        const isCurrent = i === current;
        const isLast = i === ORDER_STATUSES.length - 1;
        return (
          <li
            key={s}
            className="relative flex flex-col items-center flex-1 min-w-0"
          >
            {/* Connector to the next step (drawn behind the dot) */}
            {!isLast && (
              <span
                aria-hidden
                className="absolute top-[7px] h-[2px]"
                style={{
                  insetInlineStart: "50%",
                  width: "100%",
                  background: i < current ? "#A3803D" : "rgba(27,25,22,0.14)",
                }}
              />
            )}
            <span
              aria-hidden
              className="relative z-10 rounded-full"
              style={{
                width: isCurrent ? 16 : 14,
                height: isCurrent ? 16 : 14,
                background: done ? "#A3803D" : "#EDEAE0",
                border: done ? "none" : "2px solid rgba(27,25,22,0.2)",
                boxShadow: isCurrent ? "0 0 0 4px rgba(163,128,61,0.18)" : "none",
              }}
            />
            <span
              className="mt-2 font-sans text-[10px] md:text-[11px] leading-tight text-center px-1"
              style={{
                color: done ? "#1B1916" : "rgba(27,25,22,0.45)",
                fontWeight: isCurrent ? 600 : 400,
              }}
            >
              {orderStatusLabel(s, t)}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
