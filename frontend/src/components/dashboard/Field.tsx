"use client";

import type { ReactNode, SelectHTMLAttributes } from "react";
import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

const controlClass =
  "mt-2 w-full bg-transparent border border-charcoal/20 px-4 py-3 font-sans text-[14px] text-charcoal outline-none focus:border-accent-gold transition-colors";

const labelClass =
  "font-sans text-[11px] tracking-[0.08em] uppercase text-charcoal/55";

function LabelRow({ label, hint }: { label: string; hint?: string }) {
  return (
    <span className="flex items-baseline gap-2">
      <span className={labelClass}>{label}</span>
      {hint && (
        <span className="font-sans text-[10px] normal-case tracking-normal text-charcoal/35">
          {hint}
        </span>
      )}
    </span>
  );
}

export function Field({
  label,
  hint,
  ...props
}: { label: string; hint?: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <LabelRow label={label} hint={hint} />
      <input className={controlClass} {...props} />
    </label>
  );
}

export function TextArea({
  label,
  hint,
  ...props
}: { label: string; hint?: string } & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="block">
      <LabelRow label={label} hint={hint} />
      <textarea className={`${controlClass} resize-none`} rows={3} {...props} />
    </label>
  );
}

export function SelectField({
  label,
  hint,
  children,
  ...props
}: {
  label: string;
  hint?: string;
  children: ReactNode;
} & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <label className="block">
      <LabelRow label={label} hint={hint} />
      <select className={`${controlClass} cursor-pointer`} {...props}>
        {children}
      </select>
    </label>
  );
}
