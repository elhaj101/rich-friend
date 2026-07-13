"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import { useAuth } from "@/lib/AuthContext";
import { ApiError, type ApiErrorCode } from "@/lib/api";
import type { Dictionary } from "@/lib/dictionary";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD = 8;

// Client-side validation codes reuse the API's codes where they overlap.
type ErrorCode = ApiErrorCode | "missing_name";

function errorMessage(code: ErrorCode, t: Dictionary): string {
  switch (code) {
    case "missing_name":
    case "missing_fields":
      return t.authErrRequired;
    case "invalid_email":
      return t.authErrEmail;
    case "weak_password":
      return t.authErrPassword;
    case "email_taken":
      return t.authErrTaken;
    case "invalid_credentials":
      return t.authErrInvalid;
    case "network":
      return t.authErrNetwork;
    default:
      return t.authErrGeneric;
  }
}

const fieldClass =
  "mt-2 w-full bg-transparent border border-charcoal/20 px-4 py-3 font-sans text-[14px] text-charcoal outline-none focus:border-accent-gold transition-colors";

export default function AuthForm({ mode }: { mode: "signin" | "signup" }) {
  const { t } = useLanguage();
  const { signIn, signUp } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorCode, setErrorCode] = useState<ErrorCode | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isSignUp = mode === "signup";

  // Live password feedback (sign-up only).
  const pwTooShort = isSignUp && password.length > 0 && password.length < MIN_PASSWORD;
  const pwOk = isSignUp && password.length >= MIN_PASSWORD;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErrorCode(null);

    // Client-side validation (mirrors the server checks) with specific codes.
    if (isSignUp && !name.trim()) return setErrorCode("missing_name");
    if (!email.trim() || !password) return setErrorCode("missing_fields");
    if (!EMAIL_RE.test(email.trim())) return setErrorCode("invalid_email");
    if (password.length < MIN_PASSWORD) return setErrorCode("weak_password");

    setSubmitting(true);
    try {
      if (isSignUp) {
        await signUp(name.trim(), email.trim(), password);
      } else {
        await signIn(email.trim(), password);
      }
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setErrorCode(err instanceof ApiError ? err.code : "unknown");
      setSubmitting(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <h1
        className="font-serif font-medium text-charcoal"
        style={{ fontSize: "clamp(28px, 4vw, 36px)", lineHeight: 1.15 }}
      >
        {isSignUp ? t.signUpTitle : t.signInTitle}
      </h1>
      <p className="mt-3 font-sans text-[14px] leading-[1.6] text-charcoal/60">
        {isSignUp ? t.signUpSubtitle : t.signInSubtitle}
      </p>

      {errorCode && (
        <div
          role="alert"
          className="mt-6 border px-4 py-3 font-sans text-[13px] leading-[1.5]"
          style={{
            borderColor: "rgba(192,57,43,0.35)",
            background: "rgba(192,57,43,0.06)",
            color: "#C0392B",
          }}
        >
          {errorMessage(errorCode, t)}
          {errorCode === "email_taken" && (
            <>
              {" "}
              <Link
                href="/sign-in"
                className="font-semibold underline underline-offset-2"
                style={{ color: "#C0392B" }}
              >
                {t.authTakenSignIn}
              </Link>
            </>
          )}
        </div>
      )}

      <form onSubmit={onSubmit} className="mt-7 flex flex-col gap-5" noValidate>
        {isSignUp && (
          <label className="block">
            <span className="font-sans text-[11px] tracking-[0.08em] uppercase text-charcoal/55">
              {t.authName}
            </span>
            <input
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.authNamePh}
              aria-invalid={errorCode === "missing_name"}
              className={fieldClass}
            />
          </label>
        )}

        <label className="block">
          <span className="font-sans text-[11px] tracking-[0.08em] uppercase text-charcoal/55">
            {t.authEmail}
          </span>
          <input
            type="email"
            dir="ltr"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.authEmailPh}
            aria-invalid={errorCode === "invalid_email"}
            className={fieldClass}
          />
        </label>

        <label className="block">
          <span className="font-sans text-[11px] tracking-[0.08em] uppercase text-charcoal/55">
            {t.authPassword}
          </span>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              dir="ltr"
              autoComplete={isSignUp ? "new-password" : "current-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t.authPasswordPh}
              aria-invalid={errorCode === "weak_password"}
              className={`${fieldClass} pe-16`}
            />
            {password.length > 0 && (
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? t.authHidePassword : t.authShowPassword}
                className="absolute top-1/2 -translate-y-1/2 mt-1 font-sans text-[11px] tracking-[0.04em] uppercase text-charcoal/50 hover:text-charcoal transition-colors bg-transparent border-none cursor-pointer"
                style={{ insetInlineEnd: "0.9rem" }}
              >
                {showPassword ? t.authHidePassword : t.authShowPassword}
              </button>
            )}
          </div>
          {/* Persistent requirement hint (sign-up) with live feedback */}
          {isSignUp && (
            <span
              className="mt-2 block font-sans text-[12px] leading-[1.4]"
              style={{
                color: pwTooShort ? "#C0392B" : pwOk ? "#8a6a2f" : "rgba(27,25,22,0.5)",
              }}
            >
              {pwTooShort
                ? t.authPasswordShort
                : pwOk
                  ? t.authPasswordOk
                  : t.authPasswordHint}
            </span>
          )}
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="mt-1 w-full bg-charcoal text-ivory font-sans font-semibold text-[12px] tracking-[0.08em] py-3.5 hover:bg-charcoal/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting
            ? t.authSubmitting
            : isSignUp
              ? t.authSubmitSignUp
              : t.authSubmitSignIn}
        </button>
      </form>

      <p className="mt-6 font-sans text-[13px] text-charcoal/60">
        {isSignUp ? t.authToSignInPrompt : t.authToSignUpPrompt}{" "}
        <Link
          href={isSignUp ? "/sign-in" : "/sign-up"}
          className="text-charcoal underline underline-offset-4 hover:text-accent-gold transition-colors"
        >
          {isSignUp ? t.authToSignInLink : t.authToSignUpLink}
        </Link>
      </p>
    </motion.div>
  );
}
