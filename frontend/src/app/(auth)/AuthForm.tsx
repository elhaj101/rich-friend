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

function errorMessage(code: ApiErrorCode, t: Dictionary): string {
  switch (code) {
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
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isSignUp = mode === "signup";

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    // Client-side validation (mirrors the server checks).
    if (isSignUp && !name.trim()) {
      setError(t.authErrRequired);
      return;
    }
    if (!email.trim() || !password) {
      setError(t.authErrRequired);
      return;
    }
    if (!EMAIL_RE.test(email.trim())) {
      setError(t.authErrEmail);
      return;
    }
    if (password.length < 8) {
      setError(t.authErrPassword);
      return;
    }

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
      const code = err instanceof ApiError ? err.code : "unknown";
      setError(errorMessage(code, t));
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

      {error && (
        <div
          role="alert"
          className="mt-6 border px-4 py-3 font-sans text-[13px] leading-[1.5]"
          style={{
            borderColor: "rgba(192,57,43,0.35)",
            background: "rgba(192,57,43,0.06)",
            color: "#C0392B",
          }}
        >
          {error}
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
            className={fieldClass}
          />
        </label>

        <label className="block">
          <span className="font-sans text-[11px] tracking-[0.08em] uppercase text-charcoal/55">
            {t.authPassword}
          </span>
          <input
            type="password"
            dir="ltr"
            autoComplete={isSignUp ? "new-password" : "current-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t.authPasswordPh}
            className={fieldClass}
          />
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
