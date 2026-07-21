"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import { toLocaleDigits } from "@/lib/format";
import * as api from "@/lib/api";
import type { WishlistItem } from "@/lib/types";
import PageHeading from "@/components/dashboard/PageHeading";
import PhotoUpload from "@/components/dashboard/PhotoUpload";

type Slot = Omit<WishlistItem, "priority">;

const EMPTY: Slot[] = [{}, {}, {}, {}, {}];

export default function WishlistPage() {
  const { t, lang } = useLanguage();
  const router = useRouter();
  const [slots, setSlots] = useState<Slot[]>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    let active = true;
    api
      .getWishlist()
      .then((items) => {
        if (!active) return;
        const ordered = [1, 2, 3, 4, 5].map((p) => {
          const m = items.find((i) => i.priority === p);
          return m ? { photo: m.photo, title: m.title, link: m.link, note: m.note } : {};
        });
        setSlots(ordered);
      })
      .catch(() => {})
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  function update(index: number, patch: Partial<Slot>) {
    setSlots((prev) => prev.map((s, i) => (i === index ? { ...s, ...patch } : s)));
    setJustSaved(false);
  }

  function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target > 4) return;
    setSlots((prev) => {
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
    setJustSaved(false);
  }

  async function save() {
    setSaving(true);
    try {
      const items: WishlistItem[] = slots.map((s, i) => ({ priority: i + 1, ...s }));
      await api.saveWishlist(items);
      setJustSaved(true);
    } catch {
      /* mock — ignore */
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <PageHeading
        title={t.dashWishlistTitle}
        sub={t.dashWishlistSub}
        action={
          <div className="flex items-center gap-3">
            {justSaved && (
              <span className="font-sans text-[12px] text-terracotta">
                {t.dashWishlistSaved}
              </span>
            )}
            <button
              onClick={save}
              disabled={saving}
              className="bg-terracotta text-white font-sans font-semibold text-[12px] tracking-[0.06em] px-6 py-3 hover:bg-terracotta-deep transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? t.dashSaving : t.dashSave}
            </button>
          </div>
        }
      />

      {loading ? (
        <div className="py-16 text-center font-sans text-[13px] tracking-[0.08em] uppercase text-charcoal/35">
          {t.dashLoading}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col gap-4"
        >
          {slots.map((slot, i) => (
            <div
              key={i}
              className="bg-white border border-card-line rounded-[10px] p-4 md:p-5 flex flex-col sm:flex-row gap-4 md:gap-5"
            >
              {/* Priority badge */}
              <div className="flex sm:flex-col items-center sm:items-start gap-2 sm:gap-3 shrink-0">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center font-serif text-[17px]"
                  style={{
                    background: i === 0 ? "#C46D4A" : "#F3DDD0",
                    color: i === 0 ? "#ffffff" : "#8A3D20",
                  }}
                  title={i === 0 ? t.dashWishlistTopPriority : undefined}
                >
                  {toLocaleDigits(i + 1, lang)}
                </div>
                <div className="flex sm:flex-col gap-1">
                  <IconBtn
                    label={t.dashMoveUp}
                    disabled={i === 0}
                    onClick={() => move(i, -1)}
                    dir="up"
                  />
                  <IconBtn
                    label={t.dashMoveDown}
                    disabled={i === 4}
                    onClick={() => move(i, 1)}
                    dir="down"
                  />
                </div>
              </div>

              {/* Photo */}
              <div className="w-full sm:w-[140px] shrink-0">
                <PhotoUpload
                  label={t.dashFieldPhoto}
                  value={slot.photo}
                  onChange={(v) => update(i, { photo: v })}
                  compact
                />
              </div>

              {/* Fields */}
              <div className="flex-1 min-w-0 flex flex-col gap-3">
                <input
                  value={slot.title ?? ""}
                  onChange={(e) => update(i, { title: e.target.value })}
                  placeholder={t.dashWishlistItemTitlePh}
                  aria-label={t.dashWishlistItemTitle}
                  className="w-full bg-transparent border border-charcoal/20 px-3 py-2.5 font-sans text-[14px] text-charcoal outline-none focus:border-terracotta transition-colors"
                />
                <input
                  value={slot.link ?? ""}
                  onChange={(e) => update(i, { link: e.target.value })}
                  placeholder={t.dashWishlistLinkPh}
                  aria-label={t.dashWishlistLink}
                  dir="ltr"
                  className="w-full bg-transparent border border-charcoal/20 px-3 py-2.5 font-sans text-[13px] text-charcoal/80 outline-none focus:border-terracotta transition-colors"
                />
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <input
                    value={slot.note ?? ""}
                    onChange={(e) => update(i, { note: e.target.value })}
                    placeholder={t.dashWishlistNotePh}
                    aria-label={t.dashFieldNotes}
                    className="flex-1 min-w-[160px] bg-transparent border-b border-charcoal/15 px-1 py-1.5 font-sans text-[13px] text-charcoal/70 outline-none focus:border-terracotta transition-colors"
                  />
                  {slot.title?.trim() && (
                    <button
                      onClick={() =>
                        router.push(
                          `/dashboard/orders/new?item=${encodeURIComponent(
                            slot.title ?? ""
                          )}${slot.note ? `&note=${encodeURIComponent(slot.note)}` : ""}`
                        )
                      }
                      className="font-sans text-[12px] font-semibold text-terracotta no-underline hover:text-charcoal transition-colors whitespace-nowrap"
                    >
                      {t.dashWishlistToOrder} →
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </>
  );
}

function IconBtn({
  label,
  disabled,
  onClick,
  dir,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  dir: "up" | "down";
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className="w-7 h-7 flex items-center justify-center rounded-[4px] border border-charcoal/15 text-charcoal/60 hover:border-terracotta hover:text-terracotta transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d={dir === "up" ? "M6 15l6-6 6 6" : "M6 9l6 6 6-6"}
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
