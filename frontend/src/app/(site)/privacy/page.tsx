import type { Metadata } from "next";
import LegalView from "@/components/LegalView";

export const metadata: Metadata = {
  title: "Privacy — Rich Friend",
  description:
    "How Rich Friend handles your information — collected only to source and deliver your requests, and kept confidential.",
};

export default function PrivacyPage() {
  return <LegalView kind="privacy" />;
}
