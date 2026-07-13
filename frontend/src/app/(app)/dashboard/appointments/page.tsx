"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import * as api from "@/lib/api";
import type { Appointment, AppointmentKind } from "@/lib/types";
import PageHeading from "@/components/dashboard/PageHeading";
import AppointmentCard from "@/components/dashboard/AppointmentCard";
import { TextArea, SelectField } from "@/components/dashboard/Field";

export default function AppointmentsPage() {
  const { t } = useLanguage();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const [kind, setKind] = useState<AppointmentKind>("video_call");
  const [when, setWhen] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    api
      .getAppointments()
      .then((a) => active && setAppointments(a))
      .catch(() => {})
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  // Minimum selectable datetime = now (local), formatted for datetime-local.
  const minDateTime = useMemo(() => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  }, []);

  const upcoming = appointments.filter((a) => a.status !== "completed");
  const past = appointments.filter((a) => a.status === "completed");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!when || Number.isNaN(Date.parse(when))) {
      setError(t.dashOrderErrRequired);
      return;
    }
    setSubmitting(true);
    try {
      const appt = await api.requestAppointment({
        kind,
        scheduledAt: new Date(when).toISOString(),
        note: note.trim() || undefined,
      });
      setAppointments((prev) =>
        [...prev, appt].sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt))
      );
      setWhen("");
      setNote("");
    } catch {
      setError(t.authErrGeneric);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <PageHeading title={t.dashApptTitle} sub={t.dashApptSub} />

      {loading ? (
        <div className="py-16 text-center font-sans text-[13px] tracking-[0.08em] uppercase text-charcoal/35">
          {t.dashLoading}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 lg:gap-10 items-start">
          {/* Lists */}
          <div>
            <h2 className="font-sans text-[11px] tracking-[0.12em] uppercase text-charcoal/45 mb-4">
              {t.dashApptUpcoming}
            </h2>
            {upcoming.length === 0 ? (
              <p className="font-sans text-[14px] text-charcoal/55 mb-8">
                {t.dashApptNone}
              </p>
            ) : (
              <div className="flex flex-col gap-4 mb-10">
                {upcoming.map((a) => (
                  <AppointmentCard key={a.id} appt={a} />
                ))}
              </div>
            )}

            {past.length > 0 && (
              <>
                <h2 className="font-sans text-[11px] tracking-[0.12em] uppercase text-charcoal/45 mb-4">
                  {t.dashApptPast}
                </h2>
                <div className="flex flex-col gap-4">
                  {past.map((a) => (
                    <AppointmentCard key={a.id} appt={a} />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Request form */}
          <motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-ivory-alt/50 border border-charcoal/10 rounded-[6px] p-5 md:p-6 lg:sticky lg:top-12"
          >
            <h2 className="font-serif text-charcoal" style={{ fontSize: 20, lineHeight: 1.2 }}>
              {t.dashApptRequestTitle}
            </h2>

            {error && (
              <p className="mt-3 font-sans text-[12px]" style={{ color: "#C0392B" }}>
                {error}
              </p>
            )}

            <div className="mt-4 flex flex-col gap-4">
              <SelectField
                label={t.dashApptKind}
                value={kind}
                onChange={(e) => setKind(e.target.value as AppointmentKind)}
              >
                <option value="video_call">{t.dashApptVideo}</option>
                <option value="phone_call">{t.dashApptPhone}</option>
              </SelectField>

              <label className="block">
                <span className="font-sans text-[11px] tracking-[0.08em] uppercase text-charcoal/55">
                  {t.dashApptDate}
                </span>
                <input
                  type="datetime-local"
                  dir="ltr"
                  min={minDateTime}
                  value={when}
                  onChange={(e) => setWhen(e.target.value)}
                  className="mt-2 w-full bg-transparent border border-charcoal/20 px-4 py-3 font-sans text-[14px] text-charcoal outline-none focus:border-accent-gold transition-colors"
                />
              </label>

              <TextArea
                label={t.dashFieldNotes}
                hint={t.dashOptional}
                placeholder={t.dashApptNotePh}
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />

              <button
                type="submit"
                disabled={submitting}
                className="bg-charcoal text-ivory font-sans font-semibold text-[12px] tracking-[0.08em] py-3.5 hover:bg-charcoal/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? t.dashSubmitting : t.dashApptSubmit}
              </button>
            </div>
          </motion.form>
        </div>
      )}
    </>
  );
}
