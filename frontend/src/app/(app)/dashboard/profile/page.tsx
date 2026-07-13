"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { useLanguage } from "@/lib/LanguageContext";
import LangToggle from "@/components/ui/LangToggle";
import PageHeading from "@/components/dashboard/PageHeading";

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.replace("/");
  }

  return (
    <>
      <PageHeading title={t.dashProfileTitle} sub={t.dashProfileSub} />

      <div className="max-w-[520px] bg-ivory-alt/50 border border-charcoal/10 rounded-[6px] divide-y divide-charcoal/10">
        <Row label={t.dashProfileName} value={user?.name ?? ""} />
        <Row label={t.dashProfileEmail} value={user?.email ?? ""} ltr />
        <div className="flex items-center justify-between gap-4 px-5 py-4">
          <span className="font-sans text-[11px] tracking-[0.08em] uppercase text-charcoal/45">
            {t.dashProfileLang}
          </span>
          <LangToggle />
        </div>
      </div>

      <button
        onClick={handleSignOut}
        className="mt-8 inline-flex items-center border border-charcoal/30 text-charcoal font-sans font-semibold text-[12px] tracking-[0.06em] px-6 py-3 hover:border-alert-red hover:text-alert-red transition-colors cursor-pointer"
      >
        {t.navSignOut}
      </button>
    </>
  );
}

function Row({ label, value, ltr }: { label: string; value: string; ltr?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-4">
      <span className="font-sans text-[11px] tracking-[0.08em] uppercase text-charcoal/45">
        {label}
      </span>
      <span className="font-sans text-[14px] text-charcoal" dir={ltr ? "ltr" : undefined}>
        {value}
      </span>
    </div>
  );
}
