import type { Dictionary, Lang } from "@/lib/dictionary";
import { dayDiffFromNow, toLocaleDigits } from "@/lib/format";

// "Today" / "Tomorrow" / "In 3 days" / "5 days ago", localized.
export function relativeDayLabel(
  iso: string,
  lang: Lang,
  t: Dictionary
): string {
  const d = dayDiffFromNow(iso);
  if (d === 0) return t.dashToday;
  if (d === 1) return t.dashTomorrow;
  if (d > 1) return t.dashInDays.replace("{n}", toLocaleDigits(d, lang));
  return t.dashDaysAgo.replace("{n}", toLocaleDigits(Math.abs(d), lang));
}
