"use client";

import { useRef, useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { fileToResizedDataUrl } from "@/lib/imageResize";

interface Props {
  label: string;
  value?: string;
  onChange: (dataUrl: string | undefined) => void;
  /** Compact square variant for the wishlist slots. */
  compact?: boolean;
}

export default function PhotoUpload({ label, value, onChange, compact }: Props) {
  const { t } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    try {
      const dataUrl = await fileToResizedDataUrl(file);
      onChange(dataUrl);
    } catch {
      // Non-image or decode failure — ignore silently for the mock.
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const pickHeight = compact ? "h-full min-h-[140px]" : "min-h-[160px]";

  return (
    <div>
      {!compact && (
        <span className="font-sans text-[11px] tracking-[0.08em] uppercase text-charcoal/55">
          {label}
        </span>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {value ? (
        <div className={`${compact ? "" : "mt-2"} relative group`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt={label}
            className="w-full rounded-[4px] object-cover"
            style={{ maxHeight: compact ? 200 : 260 }}
          />
          <div className="mt-2 flex gap-4">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="font-sans text-[12px] text-charcoal underline underline-offset-4 hover:text-terracotta transition-colors"
            >
              {t.dashPhotoReplace}
            </button>
            <button
              type="button"
              onClick={() => onChange(undefined)}
              className="font-sans text-[12px] text-charcoal/60 underline underline-offset-4 hover:text-alert-red transition-colors"
            >
              {t.dashPhotoRemove}
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className={`${compact ? "" : "mt-2"} ${pickHeight} w-full flex flex-col items-center justify-center gap-2 border border-dashed border-charcoal/25 rounded-[4px] text-charcoal/50 hover:border-terracotta hover:text-terracotta transition-colors cursor-pointer disabled:cursor-wait`}
        >
          <PlusIcon />
          <span className="font-sans text-[12px]">
            {busy ? t.dashPhotoProcessing : t.dashPhotoAdd}
          </span>
          {!compact && (
            <span className="font-sans text-[10px] text-charcoal/35">
              {t.dashPhotoHint}
            </span>
          )}
        </button>
      )}
    </div>
  );
}

function PlusIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
