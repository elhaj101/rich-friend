// Locale-aware formatting shared across the dashboard.
// Keeps Arabic rendering consistent with the rest of the site (Arabic-Indic
// numerals) without pulling in a heavy i18n dependency.

import type { Lang } from "@/lib/dictionary";

const AR_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

export function toLocaleDigits(value: string | number, lang: Lang): string {
  const s = String(value);
  if (lang !== "ar") return s;
  return s.replace(/[0-9]/g, (d) => AR_DIGITS[Number(d)]);
}

export function formatDate(iso: string, lang: Lang): string {
  const d = new Date(iso);
  return new Intl.DateTimeFormat(lang === "ar" ? "ar" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

export function formatDateTime(iso: string, lang: Lang): string {
  const d = new Date(iso);
  return new Intl.DateTimeFormat(lang === "ar" ? "ar" : "en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

// Whole-day difference from now (negative = past).
export function dayDiffFromNow(iso: string): number {
  const startOfDay = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const diff = startOfDay(new Date(iso)) - startOfDay(new Date());
  return Math.round(diff / 86_400_000);
}
