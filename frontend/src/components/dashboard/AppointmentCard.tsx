"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { WHATSAPP_URL } from "@/lib/config";
import { formatDateTime } from "@/lib/format";
import type { Appointment, AppointmentStatus } from "@/lib/types";
import { relativeDayLabel } from "./relativeDay";
import { VideoIcon, PhoneIcon } from "./icons";

const STATUS_STYLE: Record<AppointmentStatus, { bg: string; color: string }> = {
  pending: { bg: "rgba(27,25,22,0.06)", color: "rgba(27,25,22,0.65)" },
  confirmed: { bg: "rgba(45,90,61,0.12)", color: "#2d5a3d" },
  completed: { bg: "rgba(27,25,22,0.05)", color: "rgba(27,25,22,0.45)" },
};

export default function AppointmentCard({ appt }: { appt: Appointment }) {
  const { t, lang } = useLanguage();
  const isVideo = appt.kind === "video_call";
  const statusLabel =
    appt.status === "pending"
      ? t.dashApptStatusPending
      : appt.status === "confirmed"
        ? t.dashApptStatusConfirmed
        : t.dashApptStatusCompleted;
  const s = STATUS_STYLE[appt.status];
  const isPast = appt.status === "completed";

  return (
    <div className="bg-ivory-alt/50 border border-charcoal/10 rounded-[6px] p-5 md:p-6 flex gap-4">
      <div
        className="shrink-0 w-11 h-11 rounded-full flex items-center justify-center text-accent-gold"
        style={{ background: "rgba(163,128,61,0.1)" }}
      >
        {isVideo ? <VideoIcon size={20} /> : <PhoneIcon size={20} />}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h3 className="font-serif text-charcoal" style={{ fontSize: 19, lineHeight: 1.2 }}>
              {isVideo ? t.dashApptVideo : t.dashApptPhone}
            </h3>
            <p className="font-sans text-[13px] text-charcoal/60">
              {t.dashApptWith} {appt.shopper}
            </p>
          </div>
          <span
            className="inline-flex items-center font-sans font-semibold text-[10px] tracking-[0.05em] uppercase px-2.5 py-1 rounded-full"
            style={{ background: s.bg, color: s.color }}
          >
            {statusLabel}
          </span>
        </div>

        <div className="mt-3 flex items-baseline gap-2 flex-wrap">
          <span className="font-sans text-[14px] text-charcoal/85">
            {formatDateTime(appt.scheduledAt, lang)}
          </span>
          {!isPast && (
            <span className="font-sans text-[12px] text-accent-gold">
              · {relativeDayLabel(appt.scheduledAt, lang, t)}
            </span>
          )}
        </div>

        {appt.note && (
          <p className="mt-2 font-sans text-[13px] leading-[1.5] text-charcoal/55">
            {appt.note}
          </p>
        )}

        {!isPast && (
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 font-sans text-[12px] font-semibold tracking-[0.04em] text-charcoal no-underline hover:text-accent-gold transition-colors"
          >
            {t.dashApptJoin} →
          </a>
        )}
      </div>
    </div>
  );
}
